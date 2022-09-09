'use strict';
const nconf = require('nconf');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const env = process.env.NODE_ENV || 'local';

nconf.argv()
  .env()
  .file({ file: path.join(__dirname, `${env}.json`) });

//injects environment variables into the json file
nconf.overrides({
  environment: env,

  server: {
    logLevel: process.env.LOG_LEVEL,
    morganFormat: 'dev',
    port: 8080
  }
});



nconf.defaults({
  environment: env,
  logoutEndpoint: process.env.SOAM_URL + '/auth/realms/master/protocol/openid-connect/logout',
  siteMinder_logout_endpoint: process.env.SITEMINDER_LOGOUT_ENDPOINT,
  server: {
    frontend: process.env.SERVER_FRONTEND,
    logLevel: process.env.LOG_LEVEL,
    morganFormat: 'dev',
    port: 8080
  },
  oidc: {
    publicKey: process.env.SOAM_PUBLIC_KEY,
    clientId: process.env.SOAM_CLIENT_ID,
    clientSecret: process.env.SOAM_CLIENT_SECRET,
    discovery: process.env.SOAM_DISCOVERY
  },
  secureExchange: {
    apiEndpoint: process.env.CCOF_API_ENDPOINT,
  },
  tokenGenerate: {
    privateKey: process.env.UI_PRIVATE_KEY,
    publicKey: process.env.UI_PUBLIC_KEY,
    audience: process.env.SERVER_FRONTEND,
    issuer: process.env.ISSUER
  },
  organization: {
    apiEndpoint: process.env.ORGANIZATION_API_ENDPOINT,
  },
  ccofForm: {
    apiEndpoint: process.env.CCOF_FORM_API_ENDPOINT,
  },
  email: {
    secretKey: process.env.EMAIL_SECRET_KEY,
    tokenTTL: process.env.TOKEN_TTL_MINUTES
  },
  messaging:{
    natsUrl:process.env.NATS_URL,
    natsCluster:process.env.NATS_CLUSTER
  },
  ccof: {
    rootURL: process.env.CCOF_API_ENDPOINT,
    organizationUR: process.env.CCOF_API_ENDPOINT + '/organizations',
    ccofFormURL: process.env.CCOF_API_ENDPOINT + '/ccof'
  }
});
module.exports = nconf;
