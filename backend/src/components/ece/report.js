'use strict';

const { buildFilterQuery, getOperation, getUserGuid, padString, patchOperationWithObjectId, postOperation, sleep } = require('../utils');
const HttpStatus = require('http-status-codes');
const { createRawECEReportStaff } = require('./staff');
const log = require('../logger');
const { ECEReportMappings, ECEReportStaffMappings } = require('../../util/mapping/Mappings');
const { getCurrentPacificDate, restrictFacilities } = require('../../util/common');
const { ECE_REPORT_EXTERNAL_STATUS_CODES, ECE_REPORT_STATUS_CODES, ECE_REPORT_TYPES } = require('../../util/constants');
const { MappableObjectForBack, MappableObjectForFront } = require('../../util/mapping/MappableObject');

function isAdjustmentReport(reportType) {
  return reportType === ECE_REPORT_TYPES.ADJUSTMENT;
}

function getReportVersionText(report) {
  const version = padString(report?.version, 2, '0');
  return isAdjustmentReport(report?.reportType) ? `${version}-Adjustment` : `${version}-Base`;
}

function calculateStaffAmounts(staff, weRate, sbRate) {
  const totalHours = staff.totalHoursWorkedAllReports;
  const weAmount = totalHours * weRate;
  const sbAmount = totalHours * sbRate;
  if (Number.isNaN(weAmount) || Number.isNaN(sbAmount)) {
    throw new TypeError('Invalid staff amount calculation.');
  }
  return {
    totalHours,
    weAmount,
    sbAmount,
    totalAmount: weAmount + sbAmount,
  };
}

function mapECEReportForFront(report) {
  const mappedReport = new MappableObjectForFront(report, ECEReportMappings).toJSON();
  mappedReport.isAdjustment = isAdjustmentReport(mappedReport.reportType);
  mappedReport.versionText = getReportVersionText(mappedReport);

  const eceStaffInformation = report?.ccof_ece_staff_information_ece_monthly_report_ccof_ece_monthly_report ?? [];
  const mappedStaffInformation = eceStaffInformation.map((staffInfo) => {
    const mappedStaff = new MappableObjectForFront(staffInfo, ECEReportStaffMappings).toJSON();
    const { weAmount, sbAmount, totalAmount } = calculateStaffAmounts(mappedStaff, mappedReport.weRate, mappedReport.sbRate);
    mappedStaff.approvedWeAmount = weAmount;
    mappedStaff.approvedSbAmount = sbAmount;
    mappedStaff.approvedTotalAmount = totalAmount;
    return mappedStaff;
  });

  let approvedWeSubtotal = 0;
  let approvedSbSubtotal = 0;
  for (const staff of mappedStaffInformation) {
    approvedWeSubtotal += staff.approvedWeAmount;
    approvedSbSubtotal += staff.approvedSbAmount;
  }

  mappedReport.eceStaffInformation = mappedStaffInformation;
  mappedReport.approvedWeSubtotal = approvedWeSubtotal;
  mappedReport.approvedSbSubtotal = approvedSbSubtotal;
  mappedReport.approvedTotalAmount = approvedWeSubtotal + approvedSbSubtotal;

  return mappedReport;
}

function mapECETopUpReportForFront(report, eceStaffIdSet) {
  const mappedReport = new MappableObjectForFront(report, ECEReportMappings).toJSON();
  const selectedStaff = report?.ccof_ece_staff_information_ece_monthly_report_ccof_ece_monthly_report?.filter((staff) => eceStaffIdSet.has(staff._ccof_ece_staff_value)) ?? [];
  const mappedStaffInformation = selectedStaff.map((staffInfo) => {
    const mappedStaff = new MappableObjectForFront(staffInfo, ECEReportStaffMappings).toJSON();
    const amounts = calculateStaffAmounts(mappedStaff, mappedReport.weRate, mappedReport.sbRate);
    return {
      ...mappedStaff,
      ...amounts,
    };
  });

  let totalHours = 0;
  let weSubtotal = 0;
  let sbSubtotal = 0;
  for (const staff of mappedStaffInformation) {
    totalHours += staff.totalHours;
    weSubtotal += staff.weAmount;
    sbSubtotal += staff.sbAmount;
  }

  mappedReport.eceStaffInformation = mappedStaffInformation;
  mappedReport.totalHours = totalHours;
  mappedReport.weSubtotal = weSubtotal;
  mappedReport.sbSubtotal = sbSubtotal;
  mappedReport.totalAmount = weSubtotal + sbSubtotal;

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
  const response = await getOperation(
    `ccof_ece_monthly_reports(${eceReportId})?$expand=ccof_ece_staff_information_ece_monthly_report_ccof_ece_monthly_report($select=_ccof_ece_staff_value,ccof_total_hours_worked,ccof_total_hours_worked_previous_reports,ccof_is_inherited_from_parent_report,statuscode,ccof_reason_for_rejection)`,
  );
  return response;
}

// CMS sets rates shortly after report creation; this can take a few seconds.
// Retry briefly if rates are not yet available to avoid returning incomplete data.
async function getECEReport(req, res) {
  const MAX_RETRIES = 5;
  const DELAY_MS = 1000; // wait for 1 second before retry
  const { eceReportId } = req.params;
  try {
    let attempt = 0;
    let report;
    while (attempt < MAX_RETRIES) {
      attempt++;
      const response = await getRawECEReport(eceReportId);
      report = mapECEReportForFront(response);
      const hasRates = report?.weRate != null && report?.sbRate != null;
      if (hasRates) {
        return res.status(HttpStatus.OK).json(report);
      }
      if (attempt < MAX_RETRIES) {
        await sleep(DELAY_MS);
      }
      log.verbose(`Rates not ready for report ${eceReportId}. Attempt ${attempt}/${MAX_RETRIES}`);
    }
    return res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
      code: 'RATES_PENDING',
      message: 'Rates are still being processed. Please try again shortly.',
    });
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function getECEReports(req, res) {
  try {
    const response = await getOperation(`ccof_ece_monthly_reports?${buildFilterQuery(req.query, ECEReportMappings)}`);
    let eceReports = response?.value?.map(mapECEReportForFront) ?? [];
    eceReports = restrictFacilities(req, eceReports);
    return res.status(HttpStatus.OK).json(eceReports);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

function getLatestReports(reports) {
  const latestMap = new Map();
  for (const report of reports) {
    const key = `${report.facilityId}|${report.year}|${report.month}`;
    const existing = latestMap.get(key);
    if (!existing || report.version > existing.version) {
      latestMap.set(key, report);
    }
  }
  return [...latestMap.values()];
}

async function getECETopUpReports(req, res) {
  try {
    const { year, fromMonth, toMonth, facilityIds, eceStaffIds } = req.body;
    const userOrganizationId = req.session?.passport?.user?.organizationId;
    if (!userOrganizationId) {
      throw new Error('Organization ID is missing from the authenticated user.');
    }
    let filter = `_ccof_organization_value eq ${userOrganizationId} and ccof_year eq '${year}' and (ccof_external_status eq ${ECE_REPORT_EXTERNAL_STATUS_CODES.APPROVED} or ccof_external_status eq ${ECE_REPORT_EXTERNAL_STATUS_CODES.PAID})`;
    if (fromMonth != null && toMonth != null) {
      filter += ` and Microsoft.Dynamics.CRM.Between(PropertyName='ccof_month',PropertyValues=['${fromMonth}','${toMonth}'])`;
    }
    const response = await getOperation(
      'ccof_ece_monthly_reports?$select=ccof_ece_monthly_reportid,_ccof_facility_value,ccof_version,ccof_ece_rate,ccof_ece_sb_rate,ccof_month,ccof_year,ccof_approval_date' +
        `&$filter=(${filter})` +
        '&$expand=ccof_ece_staff_information_ece_monthly_report_ccof_ece_monthly_report($select=_ccof_ece_staff_value,ccof_total_hours_worked_previous_reports)',
    );
    const facilityIdSet = new Set(facilityIds);
    const eceStaffIdSet = new Set(eceStaffIds);
    let eceReports = response?.value?.filter((report) => facilityIdSet.has(report._ccof_facility_value)) ?? [];
    eceReports = eceReports.map((report) => mapECETopUpReportForFront(report, eceStaffIdSet)).filter((report) => report.totalHours > 0);
    eceReports = restrictFacilities(req, eceReports);
    return res.status(HttpStatus.OK).json(getLatestReports(eceReports));
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

async function createStaffFromPreviousReport(staffFromPreviousReport, adjustmentReportId) {
  if (!staffFromPreviousReport?.length || !adjustmentReportId) return;
  const mappedStaff = staffFromPreviousReport.map((staff) => ({
    eceReportId: adjustmentReportId,
    eceStaffId: staff._ccof_ece_staff_value,
    totalHoursWorked: staff.ccof_total_hours_worked_previous_reports,
    isInheritedFromPreviousReport: true,
  }));
  await Promise.all(mappedStaff.map(async (staff) => await createRawECEReportStaff(staff)));
}

async function createAdjustmentReport(report) {
  const baseReportId = isAdjustmentReport(report.ccof_report_type) ? report._ccof_base_report_id_value : report.ccof_ece_monthly_reportid;
  const payload = {
    'ccof_organization@odata.bind': `/accounts(${report._ccof_organization_value})`,
    'ccof_Facility@odata.bind': `/accounts(${report._ccof_facility_value})`,
    'ccof_fiscal_year@odata.bind': `/ccof_program_years(${report._ccof_fiscal_year_value})`,
    'ccof_base_report_id@odata.bind': `/ccof_ece_monthly_reports(${baseReportId})`,
    'ccof_previous_report@odata.bind': `/ccof_ece_monthly_reports(${report.ccof_ece_monthly_reportid})`,
    ccof_month: String(report.ccof_month),
    ccof_year: String(report.ccof_year),
    ccof_report_type: ECE_REPORT_TYPES.ADJUSTMENT,
  };
  const adjustmentReportId = await postOperation('ccof_ece_monthly_reports', payload);
  return adjustmentReportId;
}

async function adjustECEReport(req, res) {
  try {
    const { eceReportId } = req.params;
    await patchOperationWithObjectId('ccof_ece_monthly_reports', eceReportId, {
      ccof_has_next_report_created: true,
    });
    const report = await getRawECEReport(eceReportId);
    const adjustmentReportId = await createAdjustmentReport(report);
    const staffFromPreviousReport = report?.ccof_ece_staff_information_ece_monthly_report_ccof_ece_monthly_report;
    await createStaffFromPreviousReport(staffFromPreviousReport, adjustmentReportId);
    return res.status(HttpStatus.CREATED).json(adjustmentReportId);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = { adjustECEReport, createECEReport, getECEReport, getECEReports, getECETopUpReports, submitECEReport, updateECEReport };
