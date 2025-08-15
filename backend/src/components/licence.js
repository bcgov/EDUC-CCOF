'use strict';
const { getOperation, patchOperationWithObjectId } = require('./utils');
const { MappableObjectForFront } = require('../util/mapping/MappableObject');
const { LicenceMappings, ServiceDeliveryMappings } = require('../util/mapping/Mappings');
const HttpStatus = require('http-status-codes');
const log = require('./logger');

async function getLicences(req, res) {
  try {
    const operation =
      'ccof_licenses?$select=ccof_end_date,_ccof_facility_value,ccof_licenseid,ccof_name,ccof_organization,ccof_start_date' +
      '&$expand=ccof_service_delivery_details_license_ccof_license($select=ccof_accepts_subsidy,ccof_after_school,ccof_afternoon_kindercare,ccof_before_school,ccof_care_type,ccof_end_date,ccof_extended_hours_offered,ccof_hours_of_operation_end,ccof_hours_of_operation_start,ccof_name,' +
      'ccof_licenced_spaces,ccof_license_categories,ccof_max_4_or_less,ccof_max_capacity,ccof_max_days_per_week,ccof_max_over_4,ccof_max_weeks_per_year,ccof_morning_kindercare,ccof_number_of_preschool_sessions,ccof_overnight_care,ccof_recreational_care,ccof_school_age_on_school_grounds,ccof_start_date)' +
      `&$filter=(_ccof_facility_value eq ${req.query.facilityId})`;

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

async function updateServiceDeliveryHours(req, res) {
  try {
    const payload = {
      ccof_hours_of_operation_start: req.body.facilityHoursFrom,
      ccof_hours_of_operation_end: req.body.facilityHoursTo,
    };
    const response = await patchOperationWithObjectId('ccof_service_delivery_detailses', req.body.serviceDeliveryId, payload);
    return res.status(HttpStatus.OK).json(new MappableObjectForFront(response, ServiceDeliveryMappings));
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  getLicences,
  updateServiceDeliveryHours,
};
