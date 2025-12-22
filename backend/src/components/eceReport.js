'use strict';

const { getOperation, postOperation } = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const { ECEReportMappings } = require('../util/mapping/Mappings');
const { buildFilterQuery } = require('./utils');
const { restrictFacilities } = require('../util/common');
const { MappableObjectForFront } = require('../util/mapping/MappableObject');

async function createECEReport(req, res) {
  try {
    const eceReport = req.body;
    const payload = {
      'ccof_Facility@odata.bind': `/accounts(${eceReport.facilityId})`,
      'ccof_fiscal_year@odata.bind': `/ccof_program_years(${eceReport.programYearId})`,
    };
    const response = await postOperation('ccof_ece_monthly_reports', payload);
    console.log(response);
    return res.status(HttpStatus.CREATED).json();
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function getECEReports(req, res) {
  try {
    const response = await getOperation(`ccof_ece_monthly_reports?${buildFilterQuery(req.query, ECEReportMappings)}`);
    let eceReports = [];
    response?.value?.forEach((report) => eceReports.push(new MappableObjectForFront(report, ECEReportMappings).toJSON()));
    eceReports = restrictFacilities(req, eceReports);
    return res.status(HttpStatus.OK).json(eceReports);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = { createECEReport, getECEReports };
