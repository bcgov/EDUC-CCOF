'use strict';

const { getOperation } = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const { ECEStaffMappings } = require('../util/mapping/Mappings');
const { MappableObjectForFront } = require('../util/mapping/MappableObject');

async function getECEStaff(req, res) {
  try {
    const response = await getOperation(`ccof_ece_provider_employees?$filter=_ccof_facility_id_value eq ${req.query.facilityId}`);
    const eceStaff = response?.value?.map((record) => new MappableObjectForFront(record, ECEStaffMappings).toJSON());
    return res.status(HttpStatus.OK).json(eceStaff);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = { getECEStaff };
