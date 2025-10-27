'use strict';
const { getOperation } = require('./utils');
const { MappableObjectForFront } = require('../util/mapping/MappableObject');
const { LicenceMappings, ServiceDeliveryMappings } = require('../util/mapping/Mappings');
const HttpStatus = require('http-status-codes');
const log = require('./logger');

async function getLicences(req, res) {
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

module.exports = {
  getLicences,
};
