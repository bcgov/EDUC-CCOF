'use strict';
const { getOperation, patchOperationWithObjectId, getUserGuid } = require('./utils');
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

async function updateFundingAgreement(req, res) {
  try {
    const payload = {
      ccof_declaration: req.body.consentCheck,
      'ccof_sp_primary_contact_name@odata.bind': `/contacts(ccof_userid='${getUserGuid(req)}')`,
      ccof_date_signed_sp: req.body.signedOn,
    };
    const response = await patchOperationWithObjectId('ccof_funding_agreements', req.params.fundingAgreementId, payload);
    return res.status(HttpStatus.OK).json(response);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  getFundingAgreement,
  getFundingAgreements,
  getFundingAgreementPDF,
  updateFundingAgreement,
};
