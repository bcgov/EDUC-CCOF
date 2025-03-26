'use strict';
const { getOperation } = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const { ClosureMappings } = require('../util/mapping/Mappings');
const { buildFilterQuery } = require('./../components/utils');

async function getClosures(req, res) {
  try {
    const url = `ccof_application_ccfri_closures` + buildFilterQuery(req.query, ClosureMappings);
    const response = await getOperation(url);
    const frontendClosures = [];

    for (const closureObject of response.value) {
      frontendClosures.push(mapClosureObjectForFront(closureObject));
    }
    return res.status(HttpStatus.OK).json(frontendClosures);
  } catch (e) {
    log.error('failed with error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  getClosures,
};
