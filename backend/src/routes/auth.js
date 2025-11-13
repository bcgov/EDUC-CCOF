'use strict';

const config = require('../config/index');
const passport = require('passport');
const express = require('express');
const auth = require('../components/auth');
const log = require('../components/logger');
const { v4: uuidv4 } = require('uuid');
const { getUserGuid } = require('../components/utils');

const { body, validationResult } = require('express-validator');
const router = express.Router();

router.get('/', (_req, res) => {
  res.status(200).json({
    endpoints: ['/callback', '/callback_idir', '/login', '/logout', '/refresh', '/token'],
  });
});

router.get(
  '/callback',
  passport.authenticate('oidcBceid', {
    failureRedirect: 'error',
  }),
  (_req, res) => {
    res.redirect(config.get('server:frontend'));
  },
);

router.get(
  '/callback_idir',
  passport.authenticate('oidcIdir', {
    failureRedirect: 'error',
  }),
  (_req, res) => {
    res.redirect(config.get('server:frontend'));
  },
);

//a prettier way to handle errors
router.get('/error', (_req, res) => {
  res.redirect(config.get('server:frontend') + '/login-error');
});

//redirects to the SSO login screen
router.get(
  '/login',
  passport.authenticate('oidcBceid', {
    failureRedirect: 'error',
  }),
);

router.get(
  '/login-idir',
  passport.authenticate('oidcIdir', {
    failureRedirect: 'error',
  }),
);

//removes tokens and destroys session
router.get('/logout', async (req, res, next) => {
  const idToken = req.session?.passport?.user?.idToken;
  const isIdir = !!req.session?.passport?.user?._json?.idir_username;

  req.logout(function (err) {
    if (err) return next(err);

    req.session.destroy();

    // If the session has expired just return as SSO logout isn't required
    if (req.query?.sessionExpired) {
      return res.redirect(`/session-expired?idir=${isIdir}`);
    }

    const endpoint = `/logout?idir=${isIdir}`;
    const redirectUri = `${config.get('server:frontend')}${endpoint}`;
    const retUrl = encodeURIComponent(`${config.get('logoutEndpoint')}?post_logout_redirect_uri=${redirectUri}&id_token_hint=${idToken}`);
    const logoutUrl = config.get('siteMinder_logout_endpoint') + retUrl;

    log.verbose(`URL: ${logoutUrl}`);
    res.redirect(logoutUrl);
  });
});

const UnauthorizedRsp = {
  error: 'Unauthorized',
  error_description: 'Not logged in',
};

//refreshes jwt on refresh if refreshToken is valid
router.post('/refresh', [body('refreshToken').exists()], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  if (!req['user'] || !req['user'].refreshToken || !req?.user?.jwt) {
    res.status(401).json(UnauthorizedRsp);
  } else {
    if (auth.isTokenExpired(req.user.jwt)) {
      if (req?.user?.refreshToken && auth.isRenewable(req.user.refreshToken)) {
        return generateTokens(req, res);
      } else {
        res.status(401).json(UnauthorizedRsp);
      }
    } else {
      const responseJson = {
        jwtFrontend: req.user.jwtFrontend,
      };
      return res.status(200).json(responseJson);
    }
  }
});

//provides a jwt to authenticated users
router.get('/token', auth.refreshJWT, (req, res) => {
  if (req?.user && req.user?.jwtFrontend && req.user?.refreshToken) {
    if (req.session?.passport?.user?._json) {
      const correlationID = uuidv4();
      req.session.correlationID = correlationID;
      const correlation = {
        user_guid: getUserGuid(req),
        correlation_id: correlationID,
      };
      log.info('created correlation id and stored in session', correlation);
    }
    const responseJson = {
      jwtFrontend: req.user.jwtFrontend,
    };
    res.status(200).json(responseJson);
  } else {
    res.status(401).json(UnauthorizedRsp);
  }
});
async function generateTokens(req, res) {
  const result = await auth.renew(req.user.refreshToken);
  if (result && result.jwt && result.refreshToken) {
    req.user.jwt = result.jwt;
    req.user.refreshToken = result.refreshToken;
    req.user.jwtFrontend = auth.generateUiToken();
    const responseJson = {
      jwtFrontend: req.user.jwtFrontend,
    };
    res.status(200).json(responseJson);
  } else {
    res.status(401).json(UnauthorizedRsp);
  }
}
router.get('/user-session-remaining-time', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req?.session?.cookie && req?.session?.passport?.user) {
    const remainingTime = req.session.cookie.maxAge;
    log.info(`session remaining time is :: ${remainingTime} for user`, req.session?.passport?.user?.displayName);
    return res.status(200).json(req.session.cookie.maxAge);
  } else {
    return res.sendStatus(401);
  }
});

module.exports = router;
