'use strict';
const { patchOperationWithObjectId, getOperationWithObjectId } = require('./utils');
const HttpStatus = require('http-status-codes');
const { MappableObjectForBack, MappableObjectForFront } = require('../util/mapping/MappableObject');
const { CCOFApplicationFundingMapping } = require('../util/mapping/Mappings');

function mapFundingObjectForBack(data) {

  if (data.hasClosedMonth === 'no') {
    for (let i = 1; i <= 12; i++) {
      data[`closedIn${i}`] = 0;
    }
  } else { 
    for (let i = 1; i <= 12; i++) {
      data[`closedIn${i}`] ? data[`closedIn${i}`] = 1 : data[`closedIn${i}`] = 0;
    }
  }

  let fundingForBack = new MappableObjectForBack(data, CCOFApplicationFundingMapping).toJSON();

  return fundingForBack;
}

function mapFundingObjectForFront(data) {
  let fundingForFront = new MappableObjectForFront(data, CCOFApplicationFundingMapping).toJSON();

  fundingForFront.hasClosedMonth = 'no';
  for (let i = 1; i <= 12; i++) {
    if (fundingForFront[`closedIn${i}`] === 1) {
      fundingForFront.hasClosedMonth = 'yes';
    }
  }

  return fundingForFront;
}

async function updateFunding(req, res) {
  try {
    let fundId = req.params.fundId;

    console.log('patch operation: ', `ccof_application_basefundings(${fundId})`);

    let payload = mapFundingObjectForBack(req.body);
    let response = await patchOperationWithObjectId('ccof_application_basefundings', fundId, payload);
    response = mapFundingObjectForFront(response);

    return res.status(HttpStatus.OK).json(response);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function getFunding(req, res) {
  try {
    console.info('get operation: ', `ccof_application_basefundings(${req.params.fundId})`);
    let funding = await getOperationWithObjectId('ccof_application_basefundings', req.params.fundId);
    let model = mapFundingObjectForFront(funding);

    return res.status(HttpStatus.OK).json(model);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  updateFunding,
  getFunding,
};
