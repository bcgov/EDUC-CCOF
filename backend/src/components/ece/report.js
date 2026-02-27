'use strict';

const { buildFilterQuery, getOperation, getUserGuid, padString, patchOperationWithObjectId, postOperation } = require('../utils');
const HttpStatus = require('http-status-codes');
const log = require('../logger');
const { ECEReportMappings, ECEReportStaffMappings } = require('../../util/mapping/Mappings');
const { getCurrentPacificDate, restrictFacilities } = require('../../util/common');
const { ECE_REPORT_STATUS_CODES } = require('../../util/constants');
const { MappableObjectForBack, MappableObjectForFront } = require('../../util/mapping/MappableObject');

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
  const eceStaffInformation = report?.ccof_ece_staff_information_ece_monthly_report_ccof_ece_monthly_report;
  mappedReport.eceStaffInformation = eceStaffInformation?.map((staffInfo) => {
    return new MappableObjectForFront(staffInfo, ECEReportStaffMappings).toJSON();
  });
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
    const response = await getOperation(
      `ccof_ece_monthly_reports(${req.params.eceReportId})?$expand=ccof_ece_staff_information_ece_monthly_report_ccof_ece_monthly_report($select=_ccof_ece_staff_value,ccof_hourly_wage,ccof_total_hours_worked,ccof_ece_sb_amount,ccof_ece_we_amount,ccof_total_amount)`,
    );
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

async function submitECEReport(req, res) {
  try {
    const payload = {
      'ccof_submitted_by@odata.bind': `/contacts(ccof_userid='${getUserGuid(req)}')`,
      ccof_submit_date: getCurrentPacificDate(),
      statuscode: ECE_REPORT_STATUS_CODES.SUBMITTED,
    };
    await patchOperationWithObjectId('ccof_ece_monthly_reports', req.params.eceReportId, payload);
    return res.status(HttpStatus.OK).json();
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function updateECEReport(req, res) {
  try {
    const mapped = new MappableObjectForBack(req.body, ECEReportMappings).toJSON();

    if (!Object.keys(mapped).length) {
      return res.status(HttpStatus.BAD_REQUEST).json('No valid fields provided for update');
    }

    await patchOperationWithObjectId('ccof_ece_monthly_reports', req.params.eceReportId, mapped);
    return res.status(HttpStatus.OK).json();
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}
module.exports = { createECEReport, getECEReport, getECEReports, submitECEReport, updateECEReport };
