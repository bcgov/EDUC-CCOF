'use strict';
const { patchOperationWithObjectId, getOperationWithObjectId } = require('./utils');
const HttpStatus = require('http-status-codes');
const { MappableObjectForBack, MappableObjectForFront } = require('../util/mapping/MappableObject');
const { CCOFApplicationFundingMapping } = require('../util/mapping/Mappings');
const {updateFacilityLicenseType} = require('./facility');

function mapFundingObjectForBack(data) {
  console.log('why???', data);
  if (data.hasClosedMonth !== undefined) {
    
    data.hasClosedMonth = choiceForBack(data.hasClosedMonth);
    if (data.hasClosedMonth) {
      for (let i = 1; i <= 12; i++) {
        data[`closedIn${i}`] = data[`closedIn${i}`] ? 1 : 0;
      }
    } else {
      for (let i = 1; i <= 12; i++) {
        data[`closedIn${i}`] = null;
      }
    }
  }

  data.isExtendedHours = choiceForBack(data.isExtendedHours);
  if (!data.isExtendedHours) {
    data.maxDaysPerWeekExtended = null;
    data.maxDaysPerYearExtended = null;
  }

  data.isSchoolProperty = data.isSchoolProperty ? 1 : 0;

  let fundingForBack = new MappableObjectForBack(data, CCOFApplicationFundingMapping).toJSON();

  return fundingForBack;
}


function mapFundingObjectForFront(data) {
  let fundingForFront = new MappableObjectForFront(data, CCOFApplicationFundingMapping).toJSON();

  fundingForFront.hasClosedMonth = choiceForFront(fundingForFront.hasClosedMonth);
  fundingForFront.isSchoolProperty = choiceForFront(fundingForFront.isSchoolProperty);
  fundingForFront.isExtendedHours = choiceForFront(fundingForFront.isExtendedHours);

  return fundingForFront;
}

function choiceForBack(value) { 
  if (value === 'yes') return 1;
  if (value === 'no') return 0;
  
  return null;
}

function choiceForFront(value) { 
  if (value === 1) return 'yes';
  if (value === 0) return 'no';
  
  return null;
}

async function updateFunding(req, res) {
  try {
    let fundId = req.params.fundId;
    let facilityId = req.body.facilityId;
    delete req.body.facilityId;
    console.log('patch operation: ', `ccof_application_basefundings(${fundId})`);
    console.log('patch operation facilityID: ', facilityId);
    await updateFacilityLicenseType(facilityId, req.body);
    let payload = mapFundingObjectForBack(req.body);
    console.log('patch operation: ', `ccof_application_basefundings(${payload.toJSON})`);
    let response = await patchOperationWithObjectId('ccof_application_basefundings', fundId, payload);
    response = mapFundingObjectForFront(response);

    return res.status(HttpStatus.OK).json(response);
  } catch (e) {
    console.log('error', e);
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
