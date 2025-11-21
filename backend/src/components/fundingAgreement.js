'use strict';
const { getOperation, patchOperationWithObjectId, getUserGuid } = require('./utils');
const HttpStatus = require('http-status-codes');
const { isEmpty } = require('lodash');
const log = require('./logger');
const { buildFilterQuery } = require('./utils');
const { FundingAgreementMappings } = require('../util/mapping/Mappings');
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject');

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

async function getFundingAgreement(req, res) {
  try {
    const operation = `ccof_funding_agreements(${req.params.fundingAgreementId})`;
    const response = await getOperation(operation);
    const fundingAgreement = new MappableObjectForFront(response, FundingAgreementMappings).toJSON();
    return res.status(HttpStatus.OK).json(fundingAgreement);
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

// TODO (vietle-cgi): Review this function name later
async function getFundingAgreementPDFByQuery(req, res) {
  try {
    const query = buildFilterQuery(req.query, FundingAgreementMappings);
    const faResponse = await getOperation(`ccof_funding_agreements?$select=ccof_funding_agreementid&${query}`);
    if (isEmpty(faResponse?.value)) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'Funding agreement not found' });
    }
    const fundingAgreementId = faResponse.value[0].ccof_funding_agreementid;
    const pdfResponse = await getOperation(`ccof_funding_agreements(${fundingAgreementId})/ccof_funding_pdf`);
    if (isEmpty(pdfResponse?.value)) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'Funding agreement PDF not found' });
    }
    return res.status(HttpStatus.OK).json({
      fundingAgreementId,
      pdfFile: pdfResponse.value,
    });
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function updateFundingAgreement(req, res) {
  try {
    const fundingAgreementPayload = new MappableObjectForBack(req.body, FundingAgreementMappings).toJSON();
    fundingAgreementPayload['ccof_sp_primary_contact_name@odata.bind'] = `/contacts(ccof_userid='${getUserGuid(req)}')`;
    const response = await patchOperationWithObjectId('ccof_funding_agreements', req.params.fundingAgreementId, fundingAgreementPayload);
    return res.status(HttpStatus.OK).json(response);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function checkFundingAgreementExists(req, res) {
  try {
    const response = await getOperation(`ccof_funding_agreements?$select=ccof_name&${buildFilterQuery(req.query, FundingAgreementMappings)}`);
    return res.status(HttpStatus.OK).json({ exists: !isEmpty(response?.value) });
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  checkFundingAgreementExists,
  getFundingAgreement,
  getFundingAgreements,
  getFundingAgreementPDF,
  getFundingAgreementPDFByQuery,
  updateFundingAgreement,
};
