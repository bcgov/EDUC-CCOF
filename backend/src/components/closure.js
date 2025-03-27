'use strict';
const { getOperation } = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const { ClosureMappings } = require('../util/mapping/Mappings');
const { buildFilterQuery } = require('./../components/utils');
const { MappableObjectForFront } = require('../util/mapping/MappableObject');

async function getClosures(req, res) {
  try {
    const response = await getOperation(`ccof_application_ccfri_closures${buildFilterQuery(req.query, ClosureMappings)}`);
    const closures = [];
    response?.value?.forEach((closure) => closures.push(new MappableObjectForFront(closure, ClosureMappings).toJSON()));
    return res.status(HttpStatus.OK).json(closures);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  getClosures,
};
