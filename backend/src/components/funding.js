'use strict';
const { patchOperationWithObjectId, getOperationWithObjectId } = require('./utils');
const HttpStatus = require('http-status-codes');
const { MappableObjectForBack, MappableObjectForFront } = require('../util/mapping/MappableObject');
const { CCOFApplicationFundingMapping } = require('../util/mapping/Mappings');
const {updateFacilityLicenseType} = require('./facility');
const log = require('./logger');

function mapFundingObjectForBack(data) {
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
    log.verbose('patch operation: ', `ccof_application_basefundings(${fundId})`);
    await updateFacilityLicenseType(facilityId, req.body);
    let payload = mapFundingObjectForBack(req.body);
    let response = await patchOperationWithObjectId('ccof_application_basefundings', fundId, payload);
    response = mapFundingObjectForFront(response);
    // update to funding will not return back facilityId.  add it back!
    // we will need it for further updates.
    response.facilityId = facilityId;
    return res.status(HttpStatus.OK).json(response);
  } catch (e) {
    log.error('error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function getFunding(req, res) {
  try {
    log.info('get operation: ', `ccof_application_basefundings(${req.params.fundId})`);
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
