'use strict';
const { getOperation, patchOperationWithObjectId } = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const { DailyEnrolmentMappings, EnrolmentReportMappings, EnrolmentReportSummaryMappings } = require('../util/mapping/Mappings');
const { buildFilterQuery, padString } = require('./utils');
const { MappableObjectForBack, MappableObjectForFront } = require('../util/mapping/MappableObject');

function isAdjustmentReport(report) {
  return report?.reportVersion > 1;
}

function getReportVersionText(report) {
  const version = padString(report?.reportVersion, 2, '0');
  return isAdjustmentReport(report) ? `${version}-Adjustment` : version;
}

function mapEnrolmentReportForFront(report) {
  const mappedReport = new MappableObjectForFront(report, EnrolmentReportMappings).toJSON();
  mappedReport.isAdjustment = isAdjustmentReport(mappedReport);
  mappedReport.versionText = getReportVersionText(mappedReport);
  return mappedReport;
}

async function getEnrolmentReport(req, res) {
  try {
    const response = await getOperation(`ccof_monthlyenrollmentreports(${req.params.enrolmentReportId})?$expand=ccof_reportextension`);
    const enrolmentReport = { ...response, ...response.ccof_reportextension };
    delete enrolmentReport.ccof_reportextension;
    return res.status(HttpStatus.OK).json(mapEnrolmentReportForFront(enrolmentReport));
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function getEnrolmentReports(req, res) {
  try {
    const response = await getOperation(`ccof_monthlyenrollmentreports?${buildFilterQuery(req.query, EnrolmentReportSummaryMappings)}`);
    const enrolmentReports = [];
    response?.value?.forEach((report) => enrolmentReports.push(mapEnrolmentReportForFront(report)));
    return res.status(HttpStatus.OK).json(enrolmentReports);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function updateEnrolmentReport(req, res) {
  try {
    const payload = new MappableObjectForBack(req.body, EnrolmentReportMappings).toJSON();
    await patchOperationWithObjectId('ccof_monthlyenrollmentreports', req.params.enrolmentReportId, payload);
    return res.status(HttpStatus.OK).json();
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function getDailyEnrolments(req, res) {
  try {
    const response = await getOperation(`ccof_dailyenrollments?$filter=_ccof_monthlyenrollmentreport_value eq ${req.params.enrolmentReportId}`);
    const dailyEnrolments = response?.value?.map((day) => new MappableObjectForFront(day, DailyEnrolmentMappings).toJSON());
    return res.status(HttpStatus.OK).json(dailyEnrolments);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function updateDailyEnrolments(req, res) {
  try {
    await Promise.all(
      req.body?.map(async (item) => {
        const payload = new MappableObjectForBack(item, DailyEnrolmentMappings).toJSON();
        await patchOperationWithObjectId('ccof_dailyenrollments', item.dailyEnrolmentId, payload);
      }),
    );
    return res.status(HttpStatus.OK).json();
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  getDailyEnrolments,
  getEnrolmentReport,
  getEnrolmentReports,
  updateDailyEnrolments,
  updateEnrolmentReport,
};
