'use strict';
const { getOperation, patchOperationWithObjectId, postAdjustmentERGeneration } = require('./utils');
const HttpStatus = require('http-status-codes');
const { isEmpty } = require('lodash');
const log = require('./logger');
const { DailyEnrolmentMappings, EnrolmentReportDifferenceMappings, EnrolmentReportMappings, EnrolmentReportSummaryMappings, RateMappings } = require('../util/mapping/Mappings');
const { buildFilterQuery, padString } = require('./utils');
const { restrictFacilities } = require('../util/common');
const { MappableObjectForBack, MappableObjectForFront } = require('../util/mapping/MappableObject');

function isAdjustmentReport(report) {
  return report?.reportVersion > 1;
}

function getReportVersionText(report) {
  const version = padString(report?.reportVersion, 2, '0');
  return isAdjustmentReport(report) ? `${version}-Adjustment` : version;
}

function mapEnrolmentReportSummaryForFront(report) {
  const mappedReport = new MappableObjectForFront(report, EnrolmentReportSummaryMappings).toJSON();
  mappedReport.isAdjustment = isAdjustmentReport(mappedReport);
  mappedReport.versionText = getReportVersionText(mappedReport);
  return mappedReport;
}

function mapEnrolmentReportForFront(response) {
  const report = { ...response, ...response.ccof_reportextension };
  const mappedReport = new MappableObjectForFront(report, EnrolmentReportMappings).toJSON();
  mappedReport.baseFundingRates = new MappableObjectForFront(report.ccof_ccofbaserate, RateMappings).toJSON();
  mappedReport.ccfriProviderPaymentRates = new MappableObjectForFront(report.ccof_ccfriproviderpaymentrate, RateMappings).toJSON();
  mappedReport.isAdjustment = isAdjustmentReport(mappedReport);
  mappedReport.versionText = getReportVersionText(mappedReport);
  if (mappedReport.isAdjustment) {
    mappedReport.differences = new MappableObjectForFront(report, EnrolmentReportDifferenceMappings).toJSON();
  }
  return mappedReport;
}

async function getEnrolmentReport(req, res) {
  try {
    const response = await getOperation(`ccof_monthlyenrollmentreports(${req.params.enrolmentReportId})?$expand=ccof_reportextension,ccof_ccofbaserate,ccof_ccfriproviderpaymentrate`);
    return res.status(HttpStatus.OK).json(mapEnrolmentReportForFront(response));
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function getEnrolmentReports(req, res) {
  try {
    const response = await getOperation(`ccof_monthlyenrollmentreports?${buildFilterQuery(req.query, EnrolmentReportSummaryMappings)}`);
    let enrolmentReports = [];
    response?.value?.forEach((report) => enrolmentReports.push(mapEnrolmentReportSummaryForFront(report)));
    enrolmentReports = restrictFacilities(req, enrolmentReports);
    return res.status(HttpStatus.OK).json(enrolmentReports);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function checkDueEnrolmentReports(req, res) {
  try {
    const { organizationId, programYearId, prevProgramYearId } = req.query;
    const today = new Date();

    const operation = `ccof_monthlyenrollmentreports?$filter=_ccof_organization_value eq ${organizationId} and (_ccof_programyear_value eq ${programYearId} or _ccof_programyear_value eq ${prevProgramYearId}) and (ccof_ccof_external_status eq 1 or ccof_ccfri_external_status eq 1)`;
    const responses = await getOperation(operation);

    let enrolmentReports = responses?.value?.map(mapEnrolmentReportSummaryForFront) ?? [];
    enrolmentReports = restrictFacilities(req, enrolmentReports);

    const hasDueReports = enrolmentReports.some((report) => {
      const firstOfNextMonth = new Date(report.year, report.month, 1);
      return today >= firstOfNextMonth && today <= new Date(report.submissionDeadline);
    });
    return res.status(HttpStatus.OK).json({ hasDueReports });
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ?? e?.status);
  }
}

async function updateEnrolmentReport(req, res) {
  try {
    const payload = new MappableObjectForBack(req.body, EnrolmentReportMappings).toJSON();
    await patchOperationWithObjectId('ccof_monthlyenrollmentreports', req.params.enrolmentReportId, payload);
    if (!isEmpty(req?.body?.differences)) {
      const diffPayload = new MappableObjectForBack(req.body.differences, EnrolmentReportDifferenceMappings).toJSON();
      await patchOperationWithObjectId('ccof_monthlyenrolmentreportextensions', req.body.differences.enrolmentReportExtensionId, diffPayload);
    }
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

async function createAdjustmentEnrolmentReport(req, res) {
  try {
    const payload = {
      ERGuid: req.body.enrolmentReportId,
      targetEntityLogicalName: 'contact',
      targetEntitySetName: 'contacts',
      targetRecordGuid: req.body.contactId,
    };
    const response = await postAdjustmentERGeneration(payload);
    return res.status(HttpStatus.CREATED).json(response.data.ccof_monthlyenrollmentreportid);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  checkDueEnrolmentReports,
  createAdjustmentEnrolmentReport,
  getDailyEnrolments,
  getEnrolmentReport,
  getEnrolmentReports,
  updateDailyEnrolments,
  updateEnrolmentReport,
};
