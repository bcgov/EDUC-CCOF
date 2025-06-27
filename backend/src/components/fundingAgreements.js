'use strict';
const { getOperation } = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const { FundingAgreementMappings } = require('../util/mapping/Mappings');
const { MappableObjectForFront } = require('../util/mapping/MappableObject');

async function getFundingAgreements(req, res) {
  try {
    const { organizationId } = req.query;

    if (!organizationId) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Missing required organizationId' });
    }
    const query = `$filter=_ccof_organization_value eq '${organizationId}'`;
    const response = await getOperation(`ccof_funding_agreements?${query}`);
    const fundingAgreements = response?.value?.map((item) => new MappableObjectForFront(item, FundingAgreementMappings).toJSON());
    return res.status(HttpStatus.OK).json(fundingAgreements);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  getFundingAgreements,
};
