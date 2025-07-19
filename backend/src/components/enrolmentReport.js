'use strict';
const { getOperation } = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const { DailyEnrolmentMappings, EnrolmentReportMappings, EnrolmentReportSummaryMappings } = require('../util/mapping/Mappings');
const { buildFilterQuery } = require('./utils');
const { MappableObjectForFront } = require('../util/mapping/MappableObject');

async function getEnrolmentReport(req, res) {
  try {
    const response = await getOperation(`ccof_monthlyenrollmentreports(${req.params.enrolmentReportId})?$expand=ccof_reportextension`);
    const enrolmentReport = { ...response, ...response.ccof_reportextension };
    delete enrolmentReport.ccof_reportextension;
    return res.status(HttpStatus.OK).json(new MappableObjectForFront(enrolmentReport, EnrolmentReportMappings).toJSON());
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

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

async function getDailyEnrolments(req, res) {
  try {
    const response = await getOperation(`ccof_dailyenrollments?${buildFilterQuery(req.query, DailyEnrolmentMappings)}`);
    const dailyEnrolments = response?.value?.map((day) => new MappableObjectForFront(day, DailyEnrolmentMappings).toJSON());
    return res.status(HttpStatus.OK).json(dailyEnrolments);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  getDailyEnrolments,
  getEnrolmentReport,
  getEnrolmentReports,
};
