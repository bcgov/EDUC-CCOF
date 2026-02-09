'use strict';

const { buildFilterQuery, getOperation, patchOperationWithObjectId, postOperation } = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const { ECECertificateMappings, ECEFacilityStaffMappings, ECEStaffMappings } = require('../util/mapping/Mappings');
const { MappableObjectForBack, MappableObjectForFront } = require('../util/mapping/MappableObject');

async function getECEStaff(req, res) {
  try {
    const query = `ccof_ece_staff_information_facilities?$select=ccof_hourly_wage,statecode,ccof_ece_staff_information_facilityid&$expand=ccof_ece_staff($select=ccof_first_name,ccof_middle_name,ccof_last_name,ccof_registration_no)&$filter=_ccof_facility_value eq ${req.query.facilityId}`;
    const response = await getOperation(query);

    const eceStaff = response?.value
      ?.filter((r) => r.ccof_ece_staff)
      .map((r) =>
        new MappableObjectForFront(
          { ...r.ccof_ece_staff, ccof_hourly_wage: r.ccof_hourly_wage, statecode: r.statecode, ccof_ece_staff_information_facilityid: r.ccof_ece_staff_information_facilityid },
          ECEStaffMappings,
        ).toJSON(),
      );

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
        await patchOperationWithObjectId('ccof_ece_staff_information_facilities', item.staffInformationId, payload);
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

async function createECEStaff(req, res) {
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

module.exports = { createECEStaff, getECEStaff, getECEStaffCertificates, updateECEStaff };
