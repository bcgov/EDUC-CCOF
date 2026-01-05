'use strict';

const { getOperation, patchOperationWithObjectId } = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const { buildFilterQuery } = require('./utils');
const { ECEStaffMappings } = require('../util/mapping/Mappings');
const { MappableObjectForBack, MappableObjectForFront } = require('../util/mapping/MappableObject');

async function getECEStaff(req, res) {
  try {
    const response = await getOperation(`ccof_ece_provider_employees?${buildFilterQuery(req.query, ECEStaffMappings)}`);
    const eceStaff = response?.value?.map((record) => new MappableObjectForFront(record, ECEStaffMappings).toJSON());
    return res.status(HttpStatus.OK).json(eceStaff);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function updateECEStaff(req, res) {
  try {
    const eceStaffPayload = new MappableObjectForBack(req.body, ECEStaffMappings).toJSON();
    const response = await patchOperationWithObjectId('ccof_ece_provider_employees', req.params.eceStaffId, eceStaffPayload);
    console.log(eceStaffPayload);
    console.log(response);
    return res.status(HttpStatus.OK).json(response);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = { getECEStaff, updateECEStaff };
