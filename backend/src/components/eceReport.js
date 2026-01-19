'use strict';

const { buildFilterQuery, getOperation, postOperation } = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const { ECEReportMappings } = require('../util/mapping/Mappings');
const { restrictFacilities } = require('../util/common');
const { MappableObjectForFront } = require('../util/mapping/MappableObject');
const { padString } = require('./utils');

function isAdjustmentReport(report) {
  return report?.version > 1;
}

function getReportVersionText(report) {
  const version = padString(report?.version, 2, '0');
  return isAdjustmentReport(report) ? `${version}-Adjustment` : `${version}-Base`;
}

function mapECEReportForFront(report) {
  const mappedReport = new MappableObjectForFront(report, ECEReportMappings).toJSON();
  mappedReport.isAdjustment = isAdjustmentReport(mappedReport);
  mappedReport.versionText = getReportVersionText(mappedReport);
  return mappedReport;
}

async function createECEReport(req, res) {
  try {
    const eceReport = req.body;
    const payload = {
      'ccof_organization@odata.bind': `/accounts(${eceReport.organizationId})`,
      'ccof_Facility@odata.bind': `/accounts(${eceReport.facilityId})`,
      'ccof_fiscal_year@odata.bind': `/ccof_program_years(${eceReport.programYearId})`,
      ccof_month: String(eceReport.month),
      ccof_year: String(eceReport.year),
      ccof_report_type: eceReport.reportType,
    };
    const response = await postOperation('ccof_ece_monthly_reports', payload);
    return res.status(HttpStatus.CREATED).json(response);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function getECEReport(req, res) {
  try {
    const response = await getOperation(`ccof_ece_monthly_reports(${req.params.eceReportId})`);
    return res.status(HttpStatus.OK).json(mapECEReportForFront(response));
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function getECEReports(req, res) {
  try {
    const response = await getOperation(`ccof_ece_monthly_reports?${buildFilterQuery(req.query, ECEReportMappings)}`);
    let eceReports = [];
    response?.value?.forEach((report) => eceReports.push(mapECEReportForFront(report)));
    eceReports = restrictFacilities(req, eceReports);
    return res.status(HttpStatus.OK).json(eceReports);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = { createECEReport, getECEReport, getECEReports };
