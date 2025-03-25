'use strict';
const { getOperation, postOperation, patchOperationWithObjectId, minify, getLabelFromValue, deleteOperationWithObjectId, getApplicationDocument, getHttpHeader } = require('./utils');
const HttpStatus = require('http-status-codes');
const axios = require('axios');
const config = require('../config/index');
const log = require('./logger');
const { MappableObjectForFront } = require('../util/mapping/MappableObject');
const { OrganizationClosureMappings } = require('../util/mapping/Mappings');

function mapClosureObjectForFront(backendClosureObject) {
  return new MappableObjectForFront(data, OrganizationClosureMappings).toJSON();
}

//a wrapper fn as getCCFRIClosureDates does not take in a req/res
async function getClosures(req, res) {
  try {
    const url = `ccof_application_ccfri_closures?$filter= _ccof_organization_value eq ${req.query.organizationId} and  _ccof_program_year_value eq ${req.query.programYearId}`;
    let data = await getOperation(url);
    const frontendClosures = [];

    for (const closureObject of data.value) {
      frontendClosures.push(mapClosureObjectForFront(closureObject));
    }

    const closuresData = { closures: frontendClosures };
    return res.status(HttpStatus.OK).json(closuresData);
  } catch (e) {
    log.error('failed with error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  getClosures,
};
