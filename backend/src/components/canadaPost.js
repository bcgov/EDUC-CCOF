'use strict';

const axios = require('axios');
const config = require('../config/index');
const log = require('./logger');
const HttpStatus = require('http-status-codes');
const { ApiError } = require('./error');

/* 
  The documentation of the Canada Post's AddressComplete API: https://www.canadapost-postescanada.ca/ac/support/api/
*/

async function findAddresses(req, res) {
  try {
    let url = `${config.get('canadaPostApi:findApiEndpoint')}?key=${config.get('canadaPostApi:apiKey')}`;
    if (req?.query?.searchTerm) {
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
    return res.status(HttpStatus.OK).json(response.data);
  } catch (e) {
    log.error(e);
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, { message: 'API Find error' }, e);
  }
}

module.exports = {
  findAddresses,
};
