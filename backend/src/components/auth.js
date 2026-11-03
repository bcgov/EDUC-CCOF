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

const pendingRenewals = new Map();

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

  // Get new JWT and Refresh tokens. Returns { jwt, refreshToken } on success, otherwise null.
  renew(refreshToken) {
    if (!pendingRenewals.has(refreshToken)) {
      const renewal = auth.requestRenewal(refreshToken).finally(() => pendingRenewals.delete(refreshToken));
      pendingRenewals.set(refreshToken, renewal);
    }
    return pendingRenewals.get(refreshToken);
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
    } catch (error) {
      log.error('renew', `Token renewal failed: ${error.message}`, error.response?.data);
    }
    return null;
  },

  // Update or remove token based on JWT and user state
  async refreshJWT(req, _res, next) {
    try {
      if (!!req && !!req.user && !!req.user.jwt) {
        log.verbose('refreshJWT', 'User & JWT exists');

        if (auth.isTokenExpired(req.user.jwt)) {
          log.verbose('refreshJWT', 'JWT has expired');

          if (!!req.user.refreshToken && auth.isRenewable(req.user.refreshToken)) {
            log.verbose('refreshJWT', 'Can refresh JWT token');

            // Get new JWT and Refresh Tokens and update the request
            const result = await auth.renew(req.user.refreshToken);
            if (result) {
              req.user.jwt = result.jwt;
              req.user.refreshToken = result.refreshToken;
            } else {
              log.info('refreshJWT', 'Token renewal failed, removing user from request');
              delete req.user;
            }
          } else {
            log.info('refreshJWT', 'Refresh token expired, removing user from request');
            delete req.user;
          }
        }
      } else {
        log.verbose('refreshJWT', 'No existing User or JWT');
        delete req.user;
      }
    } catch (error) {
      log.error('refreshJWT', error.message);
    }
    next();
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
