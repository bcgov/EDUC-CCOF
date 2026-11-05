'use strict';

const axios = require('axios');
const config = require('../config/index');
const log = require('./logger');
const jsonwebtoken = require('jsonwebtoken');
const qs = require('node:querystring');
const utils = require('./utils');
const HttpStatus = require('http-status-codes');
const safeStringify = require('fast-safe-stringify');
const { ApiError } = require('./error');
const { pick } = require('lodash');
const crypto = require('node:crypto');
const Redis = require('../util/redis/redis-client');

const pendingRenewals = new Map();
const RENEWAL_GRACE_SECONDS = 60;

function renewalKey(refreshToken) {
  return `renew:${crypto.createHash('sha256').update(refreshToken).digest('hex')}`;
}

async function getSharedRenewal(refreshToken) {
  if (!Redis.isReady) return null;
  try {
    const cached = await Redis.get(renewalKey(refreshToken));
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    log.warn('renew', `Unable to read shared renewal from Redis: ${error.message}`);
    return null;
  }
}

async function setSharedRenewal(refreshToken, result) {
  if (!Redis.isReady) return;
  try {
    await Redis.set(renewalKey(refreshToken), JSON.stringify(result), { EX: RENEWAL_GRACE_SECONDS });
  } catch (error) {
    log.warn('renew', `Unable to store shared renewal in Redis: ${error.message}`);
  }
}

const auth = {
  // Check if JWT Access Token has expired
  isTokenExpired(token) {
    const now = Date.now().valueOf() / 1000;
    const payload = jsonwebtoken.decode(token);
    return !!payload['exp'] && payload['exp'] < now + 30; // Add 30 seconds to make sure , edge case is avoided and token is refreshed.
  },

  // Check if JWT Refresh Token has expired
  isRenewable(token) {
    const now = Date.now().valueOf() / 1000;
    const payload = jsonwebtoken.decode(token);

    // Check if expiration exists, or lacks expiration
    return (typeof payload.exp !== 'undefined' && payload.exp !== null && payload.exp === 0) || payload.exp > now;
  },

  // Get new JWT and Refresh tokens. Returns { jwt, refreshToken } on success, null if Keycloak rejected the
  // refresh token, and throws if Keycloak is unavailable. Successful results are shared (in memory and via Redis)
  // for a grace period because Keycloak rotates refresh tokens and concurrent requests may hold the old one.
  renew(refreshToken) {
    if (!pendingRenewals.has(refreshToken)) {
      const renewal = auth.renewOnce(refreshToken).then(
        (result) => {
          if (result) {
            setTimeout(() => pendingRenewals.delete(refreshToken), RENEWAL_GRACE_SECONDS * 1000).unref();
          } else {
            pendingRenewals.delete(refreshToken);
          }
          return result;
        },
        (error) => {
          pendingRenewals.delete(refreshToken);
          throw error;
        },
      );
      pendingRenewals.set(refreshToken, renewal);
    }
    return pendingRenewals.get(refreshToken);
  },

  async renewOnce(refreshToken) {
    const shared = await getSharedRenewal(refreshToken);
    if (shared) {
      log.verbose('renew', 'Reusing renewal from another request');
      return shared;
    }
    const result = await auth.requestRenewal(refreshToken);
    if (result) {
      await setSharedRenewal(refreshToken, result);
    }
    return result;
  },

  async requestRenewal(refreshToken) {
    let clientId = config.get('oidc:clientId');
    let clientSecret = config.get('oidc:clientSecret');
    try {
      const discovery = await utils.getOidcDiscovery();
      const response = await axios.post(
        discovery.token_endpoint,
        qs.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          scope: 'offline_access',
        }),
        {
          headers: {
            Accept: 'application/json',
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      log.verbose('renew', utils.prettyStringify(response.data));
      if (response?.data?.access_token && response?.data?.refresh_token) {
        return { jwt: response.data.access_token, refreshToken: response.data.refresh_token };
      }
      log.error('renew', 'Access token or refresh token not retrieved properly');
      return null;
    } catch (error) {
      const status = error.response?.status;
      if (status >= 400 && status < 500) {
        log.info('renew', `Keycloak rejected token renewal with status ${status}`, error.response?.data);
        return null;
      }
      log.error('renew', `Keycloak unavailable during token renewal: ${error.message}`);
      throw error;
    }
  },

  async renewUserTokensIfExpired(user) {
    if (!user?.jwt) {
      log.verbose('refreshJWT', 'No existing User or JWT');
      return false;
    }
    if (!auth.isTokenExpired(user.jwt)) {
      return true;
    }
    if (!user.refreshToken || !auth.isRenewable(user.refreshToken)) {
      log.info('refreshJWT', 'Refresh token expired, removing user from request');
      return false;
    }
    const result = await auth.renew(user.refreshToken);
    if (!result) {
      log.info('refreshJWT', 'Token renewal failed, removing user from request');
      return false;
    }
    user.jwt = result.jwt;
    user.refreshToken = result.refreshToken;
    return true;
  },

  // Update or remove token based on JWT and user state. Responds 401 if the user can no longer be authenticated.
  // Unexpected errors (e.g. a brief Keycloak outage) fall through so downstream token validation decides.
  async refreshJWT(req, res, next) {
    try {
      if (!(await auth.renewUserTokensIfExpired(req.user))) {
        delete req.user;
        return res.status(HttpStatus.UNAUTHORIZED).json();
      }
    } catch (error) {
      log.error('refreshJWT', error.message);
    }
    return next();
  },

  generateUiToken() {
    const i = config.get('tokenGenerate:issuer');
    const s = 'user@penrequest.ca';
    const a = config.get('server:frontend');
    const signOptions = {
      issuer: i,
      subject: s,
      audience: a,
      expiresIn: '30m',
      algorithm: 'RS256',
    };

    const privateKey = config.get('tokenGenerate:privateKey');
    const uiToken = jsonwebtoken.sign({}, privateKey, signOptions);
    log.verbose('Generated JWT', uiToken);
    return uiToken;
  },

  async getApiCredentials() {
    try {
      const discovery = await utils.getOidcDiscovery();
      const response = await axios.post(
        discovery.token_endpoint,
        qs.stringify({
          client_id: config.get('oidc:clientId'),
          client_secret: config.get('oidc:clientSecret'),
          grant_type: 'client_credentials',
          scope: discovery.scopes_supported,
        }),
        {
          headers: {
            Accept: 'application/json',
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      log.verbose('getApiCredentials Res', safeStringify(response.data));

      let result = {};
      result.accessToken = response.data.access_token;
      result.refreshToken = response.data.refresh_token;
      return result;
    } catch (error) {
      log.error('getApiCredentials Error', error.response ? pick(error.response, ['status', 'statusText', 'data']) : error.message);
      const status = error.response ? error.response.status : HttpStatus.INTERNAL_SERVER_ERROR;
      throw new ApiError(status, { message: 'Get getApiCredentials error' }, error);
    }
  },
  isValidBackendToken() {
    return function (req, res, next) {
      if (req?.session?.passport?.user?.jwt) {
        try {
          jsonwebtoken.verify(req.session.passport.user.jwt, config.get('oidc:publicKey'));
        } catch (e) {
          log.info('error is from verify', e);
          return res.status(HttpStatus.UNAUTHORIZED).json();
        }
        log.info('Backend token is valid moving to next');
        return next();
      } else {
        log.info('no jwt responding back 401');
        return res.status(HttpStatus.UNAUTHORIZED).json();
      }
    };
  },
};

module.exports = auth;
