'use strict';
const { getOperation } = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject');
const { ClosureMappings } = require('../util/mapping/Mappings');
const { filter } = require('lodash');

function mapClosureObjectForFront(backendClosureObject) {
  return new MappableObjectForFront(backendClosureObject, ClosureMappings).toJSON();
}

function buildFilterQueryForGetClosures(filterQuery) {
  if (filterQuery) {
    const queryObject = new MappableObjectForBack(filterQuery, ClosureMappings).toJSON();
    let query = `?$filter=`;
    for (const key in queryObject) {
      query += `${key} eq ${queryObject[key]} and `;
    }
    return query.slice(0, -4);
  } else {
    return ``;
  }
}

//a wrapper fn as getCCFRIClosureDates does not take in a req/res
async function getClosures(req, res) {
  try {
    let url = `ccof_application_ccfri_closures` + buildFilterQueryForGetClosures(req?.query);
    let data = await getOperation(url);
    const frontendClosures = [];

    for (const closureObject of data.value) {
      frontendClosures.push(mapClosureObjectForFront(closureObject));
    }

    // const closuresData = { closures: frontendClosures };
    return res.status(HttpStatus.OK).json(frontendClosures);
  } catch (e) {
    log.error('failed with error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  getClosures,
};
