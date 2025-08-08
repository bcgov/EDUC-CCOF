'use strict';
const { getOperation } = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const { buildFilterQuery } = require('./utils');
const { FundingAgreementMappings } = require('../util/mapping/Mappings');
const { MappableObjectForFront } = require('../util/mapping/MappableObject');

async function getFundingAgreements(req, res) {
  try {
    const query = `${buildFilterQuery(req.query, FundingAgreementMappings)} and statuscode ne 101510002`; // 101510002 = 'Drafted'
    const response = await getOperation(`ccof_funding_agreements?${query}`);
    const fundingAgreements = response?.value?.map((item) => new MappableObjectForFront(item, FundingAgreementMappings).toJSON());
    return res.status(HttpStatus.OK).json(fundingAgreements);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function getFundingAgreementPDF(req, res) {
  try {
    const operation = `ccof_funding_agreements(${req.params.fundingAgreementId})/ccof_funding_pdf`;
    const response = await getOperation(operation);
    return res.status(HttpStatus.OK).json(response.value);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}
module.exports = {
  getFundingAgreements,
  getFundingAgreementPDF,
};
