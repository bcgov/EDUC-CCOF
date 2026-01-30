'use strict';

const axios = require('axios');
const config = require('../config/index');
const log = require('./logger');
const HttpStatus = require('http-status-codes');
const { ApiError } = require('./error');

const Redis = require('../util/redis/redis-client');
const { isEmpty } = require('lodash');
const REDIS_EXPIRE_ARGS = [3600, 'NX'];
const REDIS_MAP = 'postalQueries';

/*
  The documentation of the Canada Post's AddressComplete API: https://www.canadapost-postescanada.ca/ac/support/api/
*/
async function findAddresses(req, res) {
  if (Redis.isReady) {
    await Redis.client.json.set(REDIS_MAP, '$', {}, { condition: 'NX' });
  } else {
    log.error('Redis is not working for Canada Post lookups, this should not have happened.');
  }

  try {
    let url = `${config.get('canadaPostApi:apiEndpoint')}?key=${config.get('canadaPostApi:apiKey')}`;

    if (req?.query?.searchTerm) {
      try {
        const cachedSearchResult = Redis.isReady ? await Redis.client.json.get(REDIS_MAP, { path: `.${Redis.encodeKey(req?.query?.searchTerm)}` }) : false;
        if (!isEmpty(cachedSearchResult)) {
          log.verbose(`Canada Post findAddresses :: Cache hit for search term: '${req?.query?.searchTerm}'`);
          return res.status(HttpStatus.OK).json(cachedSearchResult);
        }
      } catch {
        log.verbose('Unable to find cached search term');
      }
      url += `&SearchTerm=${req.query.searchTerm}`;
    }

    if (req?.query?.lastId) {
      url += `&LastId=${req.query.lastId}`;
    }

    const headers = {
      Accept: 'text/plain',
      'Content-Type': 'application/json',
    };
    const response = await axios.get(url, headers);
    if (req?.query?.searchTerm && Redis.isReady) {
      Redis.client.json.set(REDIS_MAP, `$.${Redis.encodeKey(req?.query?.searchTerm)}`, response.data);
      Redis.client.expire(REDIS_MAP, ...REDIS_EXPIRE_ARGS);
    }
    log.verbose(`Canada Post findAddresses :: Cache miss for search term: '${req?.query?.searchTerm}'. Calling AddressComplete API.`);
    return res.status(HttpStatus.OK).json(response.data);
  } catch (e) {
    log.error(e);
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, { message: 'API Find error' }, e);
  }
}

module.exports = {
  findAddresses,
};
