'use strict';

const { getOperation } = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const { buildFilterQuery } = require('./utils');
const { ECECertificateMappings, ECEStaffMappings } = require('../util/mapping/Mappings');
const { MappableObjectForFront } = require('../util/mapping/MappableObject');

async function getECEStaff(req, res) {
  try {
    const response = await getOperation(`ccof_ece_provider_employees?${buildFilterQuery(req.query, ECEStaffMappings)}`);
    const eceStaff = response?.value?.map((record) => new MappableObjectForFront(record, ECEStaffMappings).toJSON());

    await Promise.all(
      eceStaff.map(async (staff) => {
        staff.certificates = await getCertificatesForStaff(staff.registrationNumber);
      }),
    );

    return res.status(HttpStatus.OK).json(eceStaff);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function getCertificatesForStaff(registrationNumber) {
  try {
    const certResponse = await getOperation(`ofm_employee_certificates?$filter=ofm_certificate_number eq '${registrationNumber}'`);
    return certResponse?.value?.map((cert) => new MappableObjectForFront(cert, ECECertificateMappings).toJSON());
  } catch (e) {
    log.error(e);
    return [];
  }
}

module.exports = { getECEStaff, getCertificatesForStaff };
