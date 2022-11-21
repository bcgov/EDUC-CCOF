'use strict';
const { getOperation, patchOperationWithObjectId, getOperationWithObjectId } = require('./utils');
const HttpStatus = require('http-status-codes');
const { MappableObjectForBack, MappableObjectForFront } = require('../util/mapping/MappableObject');
const { CCOFApplicationFundingMapping } = require('../util/mapping/Mappings');

async function saveFunding(req, res) {
  console.log('route /funding', req.body);

  if (req.body.ccofBaseFundingId) {
    return updateFunding(req, res);
  } else {
    return createFunding(req, res);
  }
}

async function createFunding(req, res) {
  try {
    let operation = 'ccof_application_basefundings';
    console.info('post operation: ', operation);
    let funding = await getOperation(operation);

    let model = new MappableObjectForFront(funding, CCOFApplicationFundingMapping);
    console.log('BACK', funding);
    console.log('MODEL', model);

    return res.status(HttpStatus.OK).json(model);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function updateFunding(req, res) {
  try {
    let { ccofBaseFundingId } = req.body;

    console.info('patch operation: ', `ccof_application_basefundings(${ccofBaseFundingId})`);

    let payload = req.body;
    payload = new MappableObjectForBack(payload, CCOFApplicationFundingMapping);

    let response = await patchOperationWithObjectId('ccof_application_basefundings', ccofBaseFundingId, payload);
    console.log('BACK', response);
    response = new MappableObjectForFront(response, CCOFApplicationFundingMapping);
    console.log('MODEL', response);

    return res.status(HttpStatus.OK).json(response);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function getFunding(req, res) {
  try {
    console.info('get operation: ', `ccof_application_basefundings(${req.params.fundId})`);
    let funding = await getOperationWithObjectId('ccof_application_basefundings', req.params.fundId);

    let model = new MappableObjectForFront(funding, CCOFApplicationFundingMapping);
    console.log('BACK', funding);
    console.log('MODEL', model);

    return res.status(HttpStatus.OK).json(model);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  saveFunding,
  getFunding
};
