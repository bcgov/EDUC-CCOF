'use strict';
const { getOperation } = require('./utils');
const { MappableObjectForFront } = require('../util/mapping/MappableObject');
const { LicenceDetailsMappings } = require('../util/mapping/Mappings');
const HttpStatus = require('http-status-codes');
const log = require('./logger');

async function getLicenceDetails(req, res) {
  try {
    const query = `ccof_service_delivery_detailses?$select=ccof_name,ccof_license_categories,ccof_max_weeks_per_year,ccof_max_days_per_week,ccof_overnight_care,ccof_care_type,ccof_extended_hours_offered,ccof_start_date,ccof_end_date,ccof_max_capacity,ccof_licenced_spaces,ccof_hours_of_operation_start,ccof_hours_of_operation_end,ccof_number_of_preschool_sessions,ccof_school_age_on_school_grounds,ccof_recreational_care,ccof_before_school,ccof_after_school,ccof_morning_kindercare,ccof_afternoon_kindercare,ccof_accepts_subsidy,statuscode,ccof_max_4_or_less,ccof_max_over_4&$filter=(_ccof_license_value eq ${req.params.licenceId} and statecode eq 0)`;
    const response = await getOperation(query);
    const licenceDetails = response?.value?.map((item) => new MappableObjectForFront(item, LicenceDetailsMappings).toJSON());
    return res.status(HttpStatus.OK).json(licenceDetails);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  getLicenceDetails,
};
