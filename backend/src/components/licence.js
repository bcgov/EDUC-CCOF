'use strict';
const { getOperation } = require('./utils');
const { restrictFacilities } = require('../util/common');
const { MappableObjectForFront } = require('../util/mapping/MappableObject');
const { LicenceMappings, ServiceDeliveryMappings } = require('../util/mapping/Mappings');
const HttpStatus = require('http-status-codes');
const log = require('./logger');

async function getLicencesByFacilityId(req, res) {
  try {
    const operation =
      'ccof_licenses?$select=ccof_end_date,_ccof_facility_value,ccof_licenseid,ccof_name,ccof_organization,ccof_start_date,statuscode,ccof_record_start_date,ccof_record_end_date,ccof_maximum_capacity,ccof_maximum_days_per_week,ccof_maximum_weeks_per_year,ccof_extended_hours_offered,ccof_extended_days_per_week,ccof_extended_weeks_per_year' +
      '&$expand=ccof_service_delivery_details_license_ccof_license($select=ccof_after_school,ccof_before_school,ccof_afternoon_kindercare,ccof_morning_kindercare,' +
      'ccof_care_type,ccof_licenced_spaces,_ccof_license_categories_lookup_value,ccof_max_4_or_less,ccof_max_over_4,ccof_number_of_preschool_sessions)' +
      `&$filter=(_ccof_facility_value eq ${req.query.facilityId} and statuscode ne 100000001 and statuscode ne 101510003)`;
    const response = await getOperation(operation);
    const licence = response.value.map((item) => ({
      ...new MappableObjectForFront(item, LicenceMappings).toJSON(),
      serviceDeliveryDetails: item.ccof_service_delivery_details_license_ccof_license.map((detail) => new MappableObjectForFront(detail, ServiceDeliveryMappings).toJSON()),
    }));
    return res.status(HttpStatus.OK).json(licence);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function getLicencesByFundingAgreementId(req, res) {
  try {
    const operation =
      'ccof_funding_agreements?$select=ccof_funding_agreementid' +
      '&$expand=ccof_Funding_Agreement_ccof_license_ccof_license' +
      '($select=ccof_end_date,ccof_extended_days_per_week,ccof_extended_hours_offered,ccof_extended_weeks_per_year,ccof_facility_id,ccof_maximum_days_per_week,ccof_maximum_weeks_per_year,' +
      'ccof_name,ccof_record_end_date,ccof_record_start_date,ccof_start_date,_ccof_facility_value,ccof_licenseid,ccof_maximum_capacity,ccof_organization,statuscode;' +
      '$filter=(statecode eq 0 and statuscode ne 100000001))' +
      `&$filter=(ccof_funding_agreementid eq ${req.query.fundingAgreementId})`;
    const response = await getOperation(operation);
    let licences = [];
    for (const fa of response.value) {
      for (const licence of fa.ccof_Funding_Agreement_ccof_license_ccof_license) {
        licences.push({
          ...new MappableObjectForFront(licence, LicenceMappings).toJSON(),
          serviceDeliveryDetails: await getRawServiceDetails(licence.ccof_licenseid),
        });
      }
    }
    licences = restrictFacilities(req, licences);
    return res.status(HttpStatus.OK).json(licences);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function getRawServiceDetails(licenceId) {
  const operation =
    'ccof_service_delivery_detailses?' +
    '$select=ccof_after_school,ccof_afternoon_kindercare,ccof_before_school,ccof_extended_hours_offered,ccof_morning_kindercare,' +
    'ccof_licenced_spaces,_ccof_license_categories_lookup_value,ccof_number_of_preschool_sessions,ccof_max_4_or_less,ccof_max_over_4,_ccof_license_value' +
    '&$expand=ccof_license($select=_ccof_facility_value,ccof_facility_id;' +
    '$expand=ccof_facility($select=accountid,name))' +
    `&$filter=(_ccof_license_value eq '${licenceId}')`;
  const response = await getOperation(operation);
  return response.value.map((detail) => ({
    ...new MappableObjectForFront(detail, ServiceDeliveryMappings).toJSON(),
    facilityName: detail.ccof_license?.ccof_facility?.name,
  }));
}

async function getLicences(req, res) {
  try {
    const { facilityId, fundingAgreementId } = req.query;
    if (facilityId) {
      return await getLicencesByFacilityId(req, res);
    } else if (fundingAgreementId) {
      return await getLicencesByFundingAgreementId(req, res);
    }
  } catch (e) {
    log.error(e);
    return res.status(500).json(e.data ? e.data : e?.status);
  }
}
module.exports = {
  getLicences,
};
