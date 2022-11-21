/* eslint-disable quotes */
'use strict';
const { postOperation, patchOperationWithObjectId, getHttpHeader, minify,} = require('./utils');
const config = require('../config/index');
const ApiError = require('./error');
const axios = require('axios');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const _ = require ('lodash');


//creates or updates CCFRI application. 
//NOTE - CCOF application GUID is currently hardcoded in CcfriEceLanding! Will need to be replaced with a get or found in the vuex store.

async function updateCCFRIApplication(req, res) {
  let body = req.body;

  body.forEach(async(facility) => { 
    let payload = {
      'ccof_ccfrioptin' : '',
    };
    payload.ccof_ccfrioptin = facility.optInResponse;

    payload = JSON.parse(JSON.stringify(payload));
    log.info(payload);
    let url = `_ccof_application_value=${facility.applicationID},_ccof_facility_value=${facility.facilityID}`;

    try {
      let response = await patchOperationWithObjectId('ccof_applicationccfris', url, payload);
      return res.status(HttpStatus.OK).json(response);
    } catch (e) {
      log.error(e);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
    }
  }); //end for each
}


/* child care and program year GUIDs are looked up in AddNewFees.vue */ 

async function upsertParentFees(req, res) {
  let body = req.body;
  
  //the front end sends over an array of objects. This loops through the array and sends a dynamics API request
  //for each object.
  body.forEach(async(feeGroup) => {

    let childCareCategory = `/ccof_childcare_categories(${feeGroup.childCareCategory})`;
    let programYear = `/ccof_program_years(${feeGroup.programYear})`;

    let payload = {
      "ccof_frequency": feeGroup.feeFrequency,
      "ccof_ChildcareCategory@odata.bind": childCareCategory, 
      "ccof_ProgramYear@odata.bind": programYear, 
    };

    if (feeGroup.feeFrequency == '100000000' || feeGroup.feeFrequency == '100000001'){
      Object.assign(payload, 
        {
          "ccof_apr": feeGroup.aprFee,
          "ccof_may": feeGroup.mayFee,
          "ccof_jun": feeGroup.junFee,
          "ccof_jul": feeGroup.julFee,
          "ccof_aug": feeGroup.augFee,
          "ccof_sep": feeGroup.sepFee,
          "ccof_oct": feeGroup.octFee,
          "ccof_nov": feeGroup.novFee,
          "ccof_dec": feeGroup.decFee,
          "ccof_jan": feeGroup.janFee,
          "ccof_feb": feeGroup.febFee,
          "ccof_mar": feeGroup.marFee,
        }
      );
    } //TODO : add daily payload -- but I'm not sure that Dynamics supports that yet ! 

    //payload.ccof_ccfrioptin = feeGroup.optInResponse;

    payload = JSON.parse(JSON.stringify(payload));
    // log.info(payload);
    let url =  `_ccof_applicationccfri_value=${feeGroup.ccfriApplicationGuid},_ccof_childcarecategory_value=${feeGroup.childCareCategory}`;

    try {
      let response = await patchOperationWithObjectId('ccof_application_ccfri_childcarecategories', url, payload);
      //log.info('feeResponse', response);
      return res.status(HttpStatus.CREATED).json(response);
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
    }

  }); //end forEach

  //if no closure dates, don't bother sending any requests
  //closure dates are the same for each age group - so pick the first group in the array and take data from there
  if (body[0].facilityClosureDates){
    try {
      let response = postClosureDates(body[0].facilityClosureDates, body[0].ccfriApplicationGuid, res);
      //log.info('datesRes', response);
      return res.status(HttpStatus.CREATED).json(response);
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
    }
  }
}

async function postClosureDates(dates, ccfriApplicationGuid, res){

  //if the user selects an end date, create a start and end date. else, use the only date for start and end.
  dates.forEach(async (date) => {

    let payload = {
      "ccof_startdate": new Date (date.selectedDates[0]),
      "ccof_paidclosure": date.feesPaidWhileClosed,
      "ccof_enddate": date.selectedDates[1]? new Date (date.selectedDates[1]) :new Date (date.selectedDates[0]),
      "ccof_comment": date.message,
      "ccof_ApplicationCCFRI@odata.bind": `/ccof_applicationccfris(${ccfriApplicationGuid})`
    };

    try {
      let response = await postOperation('ccof_application_ccfri_closures', payload);
      log.info('feeResponse', response);
      return res.status(HttpStatus.CREATED).json(response);
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
    }

  });

}

module.exports = {
  updateCCFRIApplication,
  upsertParentFees
};
