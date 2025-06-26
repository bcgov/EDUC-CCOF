'use strict';
const { getOperation } = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const { EnrolmentReportSummaryMappings } = require('../util/mapping/Mappings');
const { buildFilterQuery } = require('./utils');
const { MappableObjectForFront } = require('../util/mapping/MappableObject');

async function getEnrolmentReports(req, res) {
  try {
    const response = await getOperation(`ccof_monthlyenrollmentreports?${buildFilterQuery(req.query, EnrolmentReportSummaryMappings)}`);
    const enrolmentReports = [];
    response?.value?.forEach((report) => enrolmentReports.push(new MappableObjectForFront(report, EnrolmentReportSummaryMappings).toJSON()));
    return res.status(HttpStatus.OK).json(enrolmentReports);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  getEnrolmentReports,
};
