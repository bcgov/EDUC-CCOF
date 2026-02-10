'use strict';

const { buildFilterQuery, getOperation, patchOperationWithObjectId, postOperation } = require('../utils');
const HttpStatus = require('http-status-codes');
const log = require('../logger');
const { ECECertificateMappings, ECEFacilityStaffMappings, ECEReportStaffMappings, ECEStaffMappings } = require('../../util/mapping/Mappings');
const { MappableObjectForBack, MappableObjectForFront } = require('../../util/mapping/MappableObject');

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

async function createFacilityStaff(facilityData) {
  const payload = new MappableObjectForBack(facilityData, ECEFacilityStaffMappings).toJSON();
  payload['ccof_ece_staff@odata.bind'] = `/ccof_ece_provider_employees(${facilityData.staffId})`;
  payload['ccof_facility@odata.bind'] = `/accounts(${facilityData.facilityId})`;
  payload['ccof_organization@odata.bind'] = `/accounts(${facilityData.organizationId})`;
  await postOperation('ccof_ece_staff_information_facilities', payload);
}

async function createECEFacilityStaff(req, res) {
  try {
    const { registrationNumber, firstName, middleName, lastName, hourlyWage, facilityId, organizationId } = req.body;

    const payload = new MappableObjectForBack({ firstName, middleName, lastName, registrationNumber }, ECEStaffMappings).toJSON();
    const created = await postOperation('ccof_ece_provider_employees', payload);
    let staffId = created?.ccof_ece_provider_employeeid;
    if (!staffId) {
      const lookup = await getOperation(`ccof_ece_provider_employees?$select=ccof_ece_provider_employeeid&$filter=ccof_registration_no eq '${registrationNumber.replace(/'/g, "''")}'`);
      staffId = lookup?.value?.[0]?.ccof_ece_provider_employeeid;
    }
    await createFacilityStaff({ staffId, facilityId, hourlyWage, organizationId });

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
