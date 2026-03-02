'use strict';

const { buildFilterQuery, getOperation, getUserGuid, padString, patchOperationWithObjectId, postOperation } = require('../utils');
const HttpStatus = require('http-status-codes');
const { createRawECEReportStaff } = require('./staff');
const log = require('../logger');
const { ECEReportMappings, ECEReportStaffMappings } = require('../../util/mapping/Mappings');
const { getCurrentPacificDate, restrictFacilities } = require('../../util/common');
const { ECE_REPORT_STAFF_STATUS_CODES, ECE_REPORT_STATUS_CODES, ECE_REPORT_TYPES } = require('../../util/constants');
const { MappableObjectForBack, MappableObjectForFront } = require('../../util/mapping/MappableObject');

function isAdjustmentReport(reportType) {
  return reportType === ECE_REPORT_TYPES.ADJUSTMENT;
}

function getReportVersionText(report) {
  const version = padString(report?.version, 2, '0');
  return isAdjustmentReport(report?.reportType) ? `${version}-Adjustment` : `${version}-Base`;
}

function mapECEReportForFront(report) {
  const mappedReport = new MappableObjectForFront(report, ECEReportMappings).toJSON();
  mappedReport.isAdjustment = isAdjustmentReport(mappedReport.reportType);
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
      ccof_report_type: ECE_REPORT_TYPES.BASE,
    };
    const response = await postOperation('ccof_ece_monthly_reports', payload);
    return res.status(HttpStatus.CREATED).json(response);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function getRawECEReport(eceReportId) {
  if (!eceReportId) {
    throw new Error('eceReportId is required.');
  }
  const response = await getOperation(
    `ccof_ece_monthly_reports(${eceReportId})?$expand=ccof_ece_staff_information_ece_monthly_report_ccof_ece_monthly_report($select=_ccof_ece_staff_value,ccof_total_hours_worked,ccof_verified_hours,ccof_ece_sb_amount,ccof_ece_we_amount,ccof_total_amount,statuscode)`,
  );
  return response;
}

async function getECEReport(req, res) {
  try {
    const response = await getRawECEReport(req.params.eceReportId);
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

async function addStaffFromParentReportToAdjustmentReport(staffFromParentReport, adjustmentReportId) {
  const mappedStaff = staffFromParentReport?.map((staff) => ({
    eceReportId: adjustmentReportId,
    eceStaffId: staff._ccof_ece_staff_value,
    totalHoursWorked: staff.statuscode === ECE_REPORT_STAFF_STATUS_CODES.VERIFIED ? staff.ccof_verified_hours : staff.ccof_total_hours_worked,
    // isInheritedFromParentReport: true,
  }));
  await Promise.all(mappedStaff.map(async (staff) => await createRawECEReportStaff(staff)));
}

async function createAdjustmentReport(req, res) {
  try {
    const report = await getRawECEReport(req.params.eceReportId);
    const baseReportId = isAdjustmentReport(report?.ccof_report_type) ? report?._ccof_base_report_id_value : report?.ccof_ece_monthly_reportid;
    const payload = {
      'ccof_organization@odata.bind': `/accounts(${report._ccof_organization_value})`,
      'ccof_Facility@odata.bind': `/accounts(${report._ccof_facility_value})`,
      'ccof_fiscal_year@odata.bind': `/ccof_program_years(${report._ccof_fiscal_year_value})`,
      'ccof_base_report_id@odata.bind': `/ccof_ece_monthly_reports(${baseReportId})`,
      ccof_month: String(report.ccof_month),
      ccof_year: String(report.ccof_year),
      ccof_report_type: ECE_REPORT_TYPES.ADJUSTMENT,
      ccof_version: Number(report.ccof_version) + 1,
    };
    const staffFromParentReport = report?.ccof_ece_staff_information_ece_monthly_report_ccof_ece_monthly_report;
    const adjustmentReportId = await postOperation('ccof_ece_monthly_reports', payload);
    await addStaffFromParentReportToAdjustmentReport(staffFromParentReport, adjustmentReportId);
    return res.status(HttpStatus.CREATED).json(adjustmentReportId);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}
module.exports = { createAdjustmentReport, createECEReport, getECEReport, getECEReports, submitECEReport, updateECEReport };
