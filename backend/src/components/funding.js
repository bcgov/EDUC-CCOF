'use strict';
const { getUserGuid, postOperation, getOperation } = require('./utils');
const HttpStatus = require('http-status-codes');
const { MappableObjectForBack, MappableObjectForFront } = require('../util/mapping/MappableObject');
const { CCOFApplicationFundingMapping } = require('../util/mapping/Mappings');

async function createFunding(req, res) {
  const userGuid = getUserGuid(req);

  console.log('route /funding', req.body);

  new MappableObjectForBack(req.body, CCOFApplicationFundingMapping);

  try {
    let organizationGuid = await postOperation('accounts', 'XXX');
    return res.status(HttpStatus.CREATED).json({ organizationId: organizationGuid });
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function getFunding(req, res) {
  try {
    let operation = `ccof_application_basefundings(${req.params.fundId})`;
    console.info('operation: ', operation);
    let funding = await getOperation(operation);

    let model = new MappableObjectForFront(funding, CCOFApplicationFundingMapping);
    console.log('BACK', funding);
    console.log('MODEL', model);
    
    return res.status(HttpStatus.OK).json(model);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  createFunding,
  getFunding
};
