'use strict';

const { buildFilterQuery, getOperation, patchOperationWithObjectId, postOperation } = require('../utils');
const HttpStatus = require('http-status-codes');
const log = require('../logger');
const { ECECertificateMappings, ECEFacilityStaffMappings, ECEReportStaffMappings, ECEStaffMappings } = require('../../util/mapping/Mappings');
const { MappableObjectForBack, MappableObjectForFront } = require('../../util/mapping/MappableObject');
const { sanitizeODataFilterValue } = require('../../util/common');

function mapECEFacilityStaffForFront(eceFacilityStaff) {
  const result = [];
  eceFacilityStaff.forEach((staff) => {
    if (!staff.ccof_ece_staff) {
      return;
    }
    const mappedStaff = new MappableObjectForFront(staff.ccof_ece_staff, ECEStaffMappings).toJSON();
    const mappedFacilityStaff = new MappableObjectForFront(staff, ECEFacilityStaffMappings).toJSON();
    result.push({
      ...mappedStaff,
      ...mappedFacilityStaff,
    });
  });
  return result;
}

async function getECEFacilityStaff(req, res) {
  try {
    const query = `ccof_ece_staff_information_facilities?$select=ccof_hourly_wage,statecode,ccof_ece_staff_information_facilityid,_ccof_ece_staff_value&$expand=ccof_ece_staff($select=ccof_first_name,ccof_middle_name,ccof_last_name,ccof_registration_no)&${buildFilterQuery(req.query, ECEFacilityStaffMappings)}`;
    const response = await getOperation(query);
    return res.status(HttpStatus.OK).json(mapECEFacilityStaffForFront(response?.value || []));
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
        query[key] = `'${sanitizeODataFilterValue(query[key])}'`;
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

async function updateECEFacilityStaff(req, res) {
  try {
    await Promise.all(
      req.body?.map(async (item) => {
        const payload = new MappableObjectForBack(item, ECEFacilityStaffMappings).toJSON();
        await patchOperationWithObjectId('ccof_ece_staff_information_facilities', item.eceFacilityStaffId, payload);
      }),
    );
    return res.status(HttpStatus.OK).json();
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function findOrCreateECEStaff({ firstName, middleName, lastName, registrationNumber }) {
  const sanitizedRegistrationNumber = sanitizeODataFilterValue(registrationNumber);
  const query = `ccof_ece_provider_employees?$select=ccof_ece_provider_employeeid&$filter=ccof_registration_no eq '${sanitizedRegistrationNumber}'`;
  const lookup = await getOperation(query);
  if (lookup?.value?.length > 0) {
    return lookup.value[0].ccof_ece_provider_employeeid;
  }
  const payload = new MappableObjectForBack({ firstName, middleName, lastName, registrationNumber }, ECEStaffMappings).toJSON();
  return await postOperation('ccof_ece_provider_employees', payload);
}

async function createECEFacilityStaff(req, res) {
  try {
    const { registrationNumber, firstName, middleName, lastName, hourlyWage, facilityId, organizationId } = req.body;
    const staffId = await findOrCreateECEStaff({ firstName, middleName, lastName, registrationNumber });
    const payload = {
      'ccof_organization@odata.bind': `/accounts(${organizationId})`,
      'ccof_facility@odata.bind': `/accounts(${facilityId})`,
      'ccof_ece_staff@odata.bind': `/ccof_ece_provider_employees(${staffId})`,
      ccof_hourly_wage: hourlyWage,
    };
    await postOperation('ccof_ece_staff_information_facilities', payload);
    return res.status(HttpStatus.CREATED).json();
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function createECEReportStaff(req, res) {
  try {
    await Promise.all(
      req.body?.map(async (eceStaff) => {
        const payload = {
          'ccof_ece_monthly_report@odata.bind': `/ccof_ece_monthly_reports(${eceStaff.eceReportId})`,
          'ccof_ece_staff@odata.bind': `/ccof_ece_provider_employees(${eceStaff.eceStaffId})`,
          ccof_hourly_wage: eceStaff.hourlyWage,
        };
        await postOperation('ccof_ece_staff_informations', payload);
      }),
    );
    return res.status(HttpStatus.CREATED).json();
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function updateECEReportStaff(req, res) {
  try {
    await Promise.all(
      req.body?.map(async (item) => {
        const payload = new MappableObjectForBack(item, ECEReportStaffMappings).toJSON();
        delete payload.ccof_ece_staff_informationid;
        await patchOperationWithObjectId('ccof_ece_staff_informations', item.eceReportStaffId, payload);
      }),
    );
    return res.status(HttpStatus.OK).json();
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = { createECEFacilityStaff, createECEReportStaff, getECEFacilityStaff, getECEStaffCertificates, updateECEFacilityStaff, updateECEReportStaff };
