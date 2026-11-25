'use strict';
const { getOperation, patchOperationWithObjectId, getUserGuid } = require('./utils');
const HttpStatus = require('http-status-codes');
const { isEmpty } = require('lodash');
const log = require('./logger');
const { buildFilterQuery } = require('./utils');
const { isProgramYear2024OrLater } = require('../util/common');
const { CHANGE_REQUEST_EXTERNAL_STATUS_CODES, CHANGE_REQUEST_TYPES, FUNDING_AGREEMENT_EXTERNAL_STATUS_TEXTS, FUNDING_AGREEMENT_STATUS_CODES } = require('../util/constants');
const { FundingAgreementMappings } = require('../util/mapping/Mappings');
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject');

async function getFundingAgreements(req, res) {
  try {
    const query = `${buildFilterQuery(req.query, FundingAgreementMappings)} and statuscode ne 101510002`; // 101510002 = 'Drafted'
    const response = await getOperation(`ccof_funding_agreements?${query}`);
    const fundingAgreements = response?.value?.map((item) => new MappableObjectForFront(item, FundingAgreementMappings).toJSON()).filter((fa) => isProgramYear2024OrLater(fa.fundingAgreementTerm));
    if (req.query.includePdf === 'true') {
      await Promise.all(
        fundingAgreements.map(async (fundingAgreement) => {
          const pdfResponse = await getOperation(`ccof_funding_agreements(${fundingAgreement.fundingAgreementId})/ccof_funding_pdf`);
          fundingAgreement.pdfFile = pdfResponse?.value;
        }),
      );
    }
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

async function hasSubmittedChangeRequest(organizationId) {
  const applicationsResponse = await getOperation(`ccof_applications?$select=ccof_applicationid&$filter=_ccof_organization_value eq ${organizationId}`);
  const applicationIdList = (applicationsResponse?.value ?? []).map((application) => `'${application.ccof_applicationid}'`).join(',');
  if (isEmpty(applicationIdList)) return false;
  const closureChangeTypes = [CHANGE_REQUEST_TYPES.NEW_CLOSURE, CHANGE_REQUEST_TYPES.EDIT_EXISTING_CLOSURE, CHANGE_REQUEST_TYPES.REMOVE_A_CLOSURE];
  const excludeClosuresFilter = closureChangeTypes.map((type) => `c/ccof_changetype ne ${type}`).join(' and ');
  const operation =
    `ccof_change_requests?$select=ccof_change_requestid&$top=1&$filter=ccof_externalstatus eq ${CHANGE_REQUEST_EXTERNAL_STATUS_CODES.SUBMITTED}` +
    ` and ccof_change_action_change_request/any(c:(${excludeClosuresFilter}))` +
    ` and (Microsoft.Dynamics.CRM.In(PropertyName='ccof_application',PropertyValues=[${applicationIdList}]))`;
  const response = await getOperation(operation);
  return !isEmpty(response?.value);
}

async function getLatestFundingAgreementActionStatus(req, res) {
  try {
    const { organizationId } = req.query;
    const [fundingAgreementsResponse, hasSubmittedCR] = await Promise.all([
      getOperation(
        `ccof_funding_agreements?$select=ccof_funding_agreementid,ccof_version,statuscode,ccof_external_portal_status,_ccof_programyear_value&${buildFilterQuery({ organizationId }, FundingAgreementMappings)} and statuscode ne ${FUNDING_AGREEMENT_STATUS_CODES.DRAFTED}`,
      ),
      hasSubmittedChangeRequest(organizationId),
    ]);
    const latestFundingAgreement = fundingAgreementsResponse?.value
      ?.map((item) => new MappableObjectForFront(item, FundingAgreementMappings).toJSON())
      .filter((fa) => isProgramYear2024OrLater(fa.fundingAgreementTerm))
      .sort((a, b) => b.fundingAgreementTerm.localeCompare(a.fundingAgreementTerm) || Number(b.fundingAgreementOrderNumber ?? 0) - Number(a.fundingAgreementOrderNumber ?? 0))[0];
    return res.status(HttpStatus.OK).json({
      fundingAgreementId: latestFundingAgreement?.fundingAgreementId ?? null,
      fundingAgreementOrderNumber: latestFundingAgreement?.fundingAgreementOrderNumber ?? null,
      isProviderActionRequired: latestFundingAgreement?.externalStatusText === FUNDING_AGREEMENT_EXTERNAL_STATUS_TEXTS.DRAFTED_PROVIDER_ACTION_REQUIRED,
      hasSubmittedChangeRequest: hasSubmittedCR,
    });
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  checkFundingAgreementExists,
  getLatestFundingAgreementActionStatus,
  getFundingAgreement,
  getFundingAgreements,
  getFundingAgreementPDF,
  updateFundingAgreement,
};
