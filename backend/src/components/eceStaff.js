'use strict';

const { buildFilterQuery, getOperation, patchOperationWithObjectId, postOperation } = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const { ECEStaffMappings, ECECertificateMappings } = require('../util/mapping/Mappings');
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

async function getECEStaffCertificates(req, res) {
  try {
    const query = { ...req.query };
    ['registrationNumber', 'firstName', 'lastName'].forEach((key) => {
      if (query[key]) {
        query[key] = `'${query[key].replace(/'/g, "''")}'`;
      }
    });
    const filterQuery = buildFilterQuery(query, ECECertificateMappings);
    const certResponse = await getOperation(`ofm_employee_certificates?${filterQuery}`);
    const certificates = certResponse?.value?.map((cert) => new MappableObjectForFront(cert, ECECertificateMappings).toJSON());
    return res.status(HttpStatus.OK).json(certificates);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function updateECEStaff(req, res) {
  try {
    await Promise.all(
      req.body?.map(async (item) => {
        const payload = new MappableObjectForBack(item, ECEStaffMappings).toJSON();
        await patchOperationWithObjectId('ccof_ece_provider_employees', item.eceStaffId, payload);
      }),
    );
    return res.status(HttpStatus.OK).json();
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function createECEStaff(req, res) {
  try {
    const eceStaffPayload = new MappableObjectForBack(req.body, ECEStaffMappings).toJSON();
    eceStaffPayload['ccof_facility_id@odata.bind'] = `/accounts(${req.body.facilityId})`;
    delete eceStaffPayload._ccof_facility_id_value;
    await postOperation('ccof_ece_provider_employees', eceStaffPayload);
    return res.status(HttpStatus.CREATED).json();
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = { createECEStaff, getECEStaff, getECEStaffCertificates, updateECEStaff };
