/* eslint-disable quotes */
'use strict';
const { postOperation, patchOperationWithObjectId, getHttpHeader, minify } = require('./utils');
const config = require('../config/index');
const ApiError = require('./error');
const axios = require('axios');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const _ = require ('lodash');


//creates or updates CCFRI application. 
//NOTE - CCOF application GUID is currently hardcoded in CcfriEceLanding! Will need to be replaced with a get or found in the vuex store.

async function upsertCCFRIApplication(req, res) {
  let payload = {
    'ccof_ccfrioptin' : '',
  };
  
  let body = req.body;
  payload.ccof_ccfrioptin = body.optInResponse;

  payload = JSON.parse(JSON.stringify(payload));
  log.info(payload);
  let url = `_ccof_application_value=${body.applicationID},_ccof_facility_value=${body.facilityID}`;

  try {
    let response = await patchOperationWithObjectId('ccof_applicationccfris', url, payload);
    return res.status(HttpStatus.OK).json(response);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }
}



// {



//   "ccof_apr": 0.00,
//   "ccof_may": 0.00,
//   "ccof_jun": 0.00,
//   "ccof_jul": 0.00,
//   "ccof_aug": 0.00,
//   "ccof_sep": 0.00,
//   "ccof_oct": 0.00,
//   "ccof_nov": 0.00,
//   "ccof_dec": 45.00,
//   "ccof_jan": 45.00,
//   "ccof_feb": 45.00,
//   "ccof_mar": 45.00,
//   "ccof_frequency": 100000002,
//   "ccof_ChildcareCategory@odata.bind": "/ccof_childcare_categories(19abd92c-0436-ed11-9db1-002248d53d53)", // 0-18 months
//   "ccof_ProgramYear@odata.bind": "/ccof_program_years(fba5721b-9434-ed11-9db1-002248d53d53)" // Lookup //2021/22
// }


/* child care and program year GUIDs are looked up in AddNewFees.vue 


*/ 
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


  });
}


module.exports = {
  upsertCCFRIApplication,
  upsertParentFees
};
