'use strict';

const axios = require('axios');
const cache = require('memory-cache');
const config = require('../config/index');
const log = require('./logger');
const HttpStatus = require('http-status-codes');
const { ApiError } = require('./error');

const addressSearchResultsCache = new cache.Cache();
const ONE_DAY_MS = 24 * 60 * 60 * 1000; // Cache timeout set for one day

/* 
  The documentation of the Canada Post's AddressComplete API: https://www.canadapost-postescanada.ca/ac/support/api/
*/
async function findAddresses(req, res) {
  try {
    let url = `${config.get('canadaPostApi:findApiEndpoint')}?key=${config.get('canadaPostApi:apiKey')}`;

    if (req?.query?.searchTerm) {
      const cachedSearchResult = addressSearchResultsCache.get(req?.query?.searchTerm);
      if (cachedSearchResult) {
        log.info(`Canada Post findAddresses :: Cache hit for search term - ${req?.query?.searchTerm}`);
        return res.status(HttpStatus.OK).json(cachedSearchResult);
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
    if (req?.query?.searchTerm) {
      addressSearchResultsCache.put(req?.query?.searchTerm, response.data, ONE_DAY_MS);
    }
    log.info(`Canada Post findAddresses :: Cache miss and AddressComplete API is called for search term - ${req?.query?.searchTerm}`);
    return res.status(HttpStatus.OK).json(response.data);
  } catch (e) {
    log.error(e);
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, { message: 'API Find error' }, e);
  }
}

module.exports = {
  findAddresses,
};
