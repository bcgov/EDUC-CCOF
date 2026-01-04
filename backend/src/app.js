'use strict';

const config = require('./config/index');
const dotenv = require('dotenv');
const log = require('./components/logger');
const morgan = require('morgan');
const session = require('express-session');
const express = require('express');
const atob = require('atob');
const passport = require('passport');
const helmet = require('helmet');
const cors = require('cors');
const utils = require('./components/utils');
const auth = require('./components/auth');
const { getUserProfile } = require('./components/user');
const { ROLES } = require('./util/constants');
const { MappableObjectForFront } = require('./util/mapping/MappableObject');
const { RoleMappings } = require('./util/mapping/Mappings');

const bodyParser = require('body-parser');
dotenv.config();

const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const OidcStrategy = require('passport-openidconnect-keycloak-idp').Strategy;
const noCache = require('nocache');
const apiRouter = express.Router();
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const facilityRouter = require('./routes/facility');
const organizationRouter = require('./routes/organization');
const publicRouter = require('./routes/public');
const configRouter = require('./routes/config');
const applicationRouter = require('./routes/application');
const documentRouter = require('./routes/document');
const fundingRouter = require('./routes/funding');
const messageRouter = require('./routes/message');
const licenseUploadRouter = require('./routes/licenseUpload');
const supportingDocumentUploadRouter = require('./routes/supportingDocuments');
const changeRequestRouter = require('./routes/changeRequest');
const pdfRouter = require('./routes/pdf');
const canadaPostRouter = require('./routes/canadaPost');
const closureRouter = require('./routes/closure');
const fundingAgreementRouter = require('./routes/fundingAgreement');
const enrolmentReportRouter = require('./routes/enrolmentReport');
const licenceRouter = require('./routes/licence');
const contactRouter = require('./routes/contact');
const programsVacanciesRouter = require('./routes/programsVacancies');
const paymentRouter = require('./routes/payment');
const eceReportRouter = require('./routes/eceReport');
const eceStaffRouter = require('./routes/eceStaff');

const connectRedis = require('connect-redis');
const { RedisStore } = require('rate-limit-redis');
const rateLimit = require('express-rate-limit');

const promMid = require('express-prometheus-middleware');
const { isEmpty } = require('lodash');

const { getRawContactFacilities } = require('./components/contact');
const { isFacilityAdmin } = require('./util/common');

//initialize app
const app = express();
app.set('trust proxy', 1);
//sets security measures (headers, etc)
app.use(cors());
app.use(helmet());
app.use(noCache());
app.use(
  promMid({
    metricsPath: '/api/prometheus',
    collectDefaultMetrics: true,
    requestDurationBuckets: [0.1, 0.5, 1, 1.5],
  }),
);
//tells the app to use json as means of transporting data
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '50mb',
  }),
);

const logStream = {
  write: (message) => {
    log.info(message);
  },
};

const dbSession = getRedisDbSession();
const cookie = {
  secure: true,
  httpOnly: true,
  maxAge: 1800000, //30 minutes in ms. this is same as session time. DO NOT MODIFY, IF MODIFIED, MAKE SURE SAME AS SESSION TIME OUT VALUE.
};
if ('local' === config.get('environment')) {
  cookie.secure = false;
}
//sets cookies for security purposes (prevent cookie access, allow secure connections only, etc)
app.use(
  session({
    name: 'ccof_cookie',
    secret: config.get('oidc:clientSecret'),
    resave: false,
    saveUninitialized: true,
    cookie: cookie,
    store: dbSession,
  }),
);

app.use(require('./routes/health-check').router);
//initialize routing and session. Cookies are now only reachable via requests (not js)
app.use(passport.initialize());
app.use(passport.session());

function getRedisDbSession() {
  if (config.get('redis:use') == 'true') {
    const Redis = require('./util/redis/redis-client');
    Redis.init(); // call the init to initialize appropriate client, and reuse it across the app.
    const RedisStore = connectRedis(session);
    const dbSession = new RedisStore({
      client: Redis.getRedisClient(),
      prefix: 'ccof-sess:',
    });
    return dbSession;
  }
  return undefined;
}

function addLoginPassportUse(discovery, strategyName, callbackURI, kc_idp_hint, clientId, clientSecret) {
  passport.use(
    strategyName,
    new OidcStrategy(
      {
        issuer: discovery.issuer,
        authorizationURL: discovery.authorization_endpoint,
        tokenURL: discovery.token_endpoint,
        userInfoURL: discovery.userinfo_endpoint,
        clientID: config.get(clientId),
        clientSecret: config.get(clientSecret),
        callbackURL: callbackURI,
        scope: 'openid',
        kc_idp_hint: kc_idp_hint,
      },
      async (_issuer, profile, _context, idToken, accessToken, refreshToken, verified) => {
        if (typeof accessToken === 'undefined' || accessToken === null || typeof refreshToken === 'undefined' || refreshToken === null) {
          return verified('No access token', null);
        }
        //set access and refresh tokens
        profile.jwtFrontend = auth.generateUiToken();
        profile.jwt = accessToken;
        profile._json = parseJwt(accessToken);
        profile.refreshToken = refreshToken;
        profile.idToken = idToken;

        // Store additional information on the profile to enable role/permission/statecode validation
        await populateUserInfo(profile);
        return verified(null, profile);
      },
    ),
  );
}

async function populateUserInfo(profile) {
  const { guid, identity_provider } = profile._json;

  // Get UserProfile for BCeID users
  if (identity_provider === config.get('oidc:idpHintBceid')) {
    // If the userGuid cannot be found in Dynamics, then Dynamics will check if the userName exists,
    // If userName exists but has a null userGuid, the system will update the user record with the GUID and return that user profile.
    // In CCOF this would only happen for new users added through the portal
    const user = await getUserProfile(guid, profile._json.bceid_username);

    if (!isEmpty(user)) {
      profile.contactId = user.contactid;
      profile.organizationId = user.organization_accountid;
      if (user.portalRole) {
        profile.role = new MappableObjectForFront(user.portalRole, RoleMappings).data;
      }
      profile.statecode = user.statecode;

      // Add facilities for Facility Admin users
      if (isFacilityAdmin(profile)) {
        const facilities = await getRawContactFacilities(profile.contactId);
        profile.facilities = facilities.map((f) => ({ facilityId: f.facilityId }));
      }
    } else {
      // If the user is not found in Dynamics at all, assign the default Organization Admin role
      profile.role = {
        roleNumber: ROLES.ORG_ADMIN,
      };
    }
  } else if (identity_provider === config.get('oidc:idpHintIdir')) {
    // TODO (weskubo-cgi) Add role logic for IDIR users
  }
}

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};
//initialize our authentication strategy
utils.getOidcDiscovery().then((discovery) => {
  //OIDC Strategy is used for authorization
  addLoginPassportUse(discovery, 'oidcBceid', config.get('server:frontend') + '/api/auth/callback', config.get('oidc:idpHintBceid'), 'oidc:clientId', 'oidc:clientSecret');
  addLoginPassportUse(discovery, 'oidcIdir', config.get('server:frontend') + '/api/auth/callback_idir', config.get('oidc:idpHintIdir'), 'oidc:clientId', 'oidc:clientSecret');

  //JWT strategy is used for authorization  keycloak_bcdevexchange_idir
  passport.use(
    'jwt',
    new JWTStrategy(
      {
        algorithms: ['RS256'],
        // Keycloak 7.3.0 no longer automatically supplies matching client_id audience.
        // If audience checking is needed, check the following SO to update Keycloak first.
        // Ref: https://stackoverflow.com/a/53627747
        audience: config.get('server:frontend'),
        issuer: config.get('tokenGenerate:issuer'),
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.get('tokenGenerate:publicKey'),
        ignoreExpiration: true,
      },
      (jwtPayload, done) => {
        if (typeof jwtPayload === 'undefined' || jwtPayload === null) {
          return done('No JWT token', null);
        }

        done(null, {
          email: jwtPayload.email,
          familyName: jwtPayload.family_name,
          givenName: jwtPayload.given_name,
          jwt: jwtPayload,
          name: jwtPayload.name,
          user_guid: jwtPayload.user_guid,
          realmRole: jwtPayload.realm_role,
        });
      },
    ),
  );
});

//functions for serializing/deserializing users
passport.serializeUser((user, next) => next(null, user));
passport.deserializeUser((obj, next) => next(null, obj));

// Setup Rate limit for the number of frontend requests allowed per windowMs to avoid DDOS attack
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  store: dbSession ? new RedisStore({ sendCommand: (...args) => dbSession.client.call(...args) }) : undefined,
});
app.use('/api/canadaPost', limiter);

app.use(morgan(config.get('server:morganFormat'), { stream: logStream }));
//set up routing to auth and main API
app.use(/(\/api)?/, apiRouter);

apiRouter.use('/auth', authRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/facility', facilityRouter);
apiRouter.use('/organization', organizationRouter);
apiRouter.use('/public', publicRouter);
apiRouter.use('/config', configRouter);
apiRouter.use('/application', applicationRouter);
apiRouter.use('/document', documentRouter);
apiRouter.use('/group/funding', fundingRouter);
apiRouter.use('/messages', messageRouter);
apiRouter.use('/licenseUpload', licenseUploadRouter);
apiRouter.use('/supportingDocument', supportingDocumentUploadRouter);
apiRouter.use('/changeRequest', changeRequestRouter);
apiRouter.use('/pdf', pdfRouter);
apiRouter.use('/canadaPost', canadaPostRouter);
apiRouter.use('/closures', closureRouter);
apiRouter.use('/fundingAgreements', fundingAgreementRouter);
apiRouter.use('/enrolmentReports', enrolmentReportRouter);
apiRouter.use('/licences', licenceRouter);
apiRouter.use('/contacts', contactRouter);
apiRouter.use('/programsVacancies', programsVacanciesRouter);
apiRouter.use('/payments', paymentRouter);
apiRouter.use('/eceReports', eceReportRouter);
apiRouter.use('/eceStaff', eceStaffRouter);

//Handle 500 error
app.use((err, _req, res, next) => {
  //This is from the ResultValidation
  if (err.errors && err.mapped) {
    return res.status(400).json({
      errors: err.mapped(),
    });
  }
  log.error(err?.stack);
  res?.redirect(config?.get('server:frontend') + '/error?message=500_internal_error');
  next();
});

// Handle 404 error
app.use((_req, res) => {
  log.error('404 Error');
  res.redirect(config?.get('server:frontend') + '/error?message=404_Page_Not_Found');
});

// Prevent unhandled errors from crashing application
process.on('unhandledRejection', (err) => {
  log.error('Unhandled Rejection at:', err?.stack || err);
});
module.exports = app;
