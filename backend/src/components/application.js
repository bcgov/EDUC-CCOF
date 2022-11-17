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
  // facility = _(facility).pick(Object.keys(PostFacilityKeyMap)).mapKeys((value,key) => {return PostFacilityKeyMap[key];});
  // facility = facility.value();
  // facility.ccof_accounttype = 100000001;

  try {
    let response = await patchOperationWithObjectId('ccof_applicationccfris', url, payload);
    // response = _(response).pick(Object.keys(GetFacilityKeyMap)).mapKeys((value,key) => {return GetFacilityKeyMap[key];});
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


/* child care and program year GUIDs are hardcoded in AddNewFees.vue 

use the mapping feature here because the payload names will be long and complicated
*/ 
async function upsertParentFees(req, res) {
  let body = req.body;

  let childCareCategory = `/ccof_childcare_categories(${body.childCareCategory})`;

  let programYear = `/ccof_program_years(${body.programYear})`;

  let payload = {
    "ccof_frequency": body.feeFrequency,
    "ccof_ChildcareCategory@odata.bind": childCareCategory, // 0-18 months
    "ccof_ProgramYear@odata.bind": programYear, // Lookup //2021/22
    "ccof_apr": body.aprFee,
    "ccof_may": 550.00,
    "ccof_jun": 110.00,
    "ccof_jul": 110.00,
    "ccof_aug": 110.00,
    "ccof_sep": 340.00,
    "ccof_oct": 450.00,
    "ccof_nov": 5450.00,
    "ccof_dec": 45.00,
    "ccof_jan": 545.00,
    "ccof_feb": 45.00,
    "ccof_mar": 45.00,
  };

  //payload.ccof_ccfrioptin = body.optInResponse;

  payload = JSON.parse(JSON.stringify(payload));
  log.info(payload);
  let url =  `_ccof_applicationccfri_value=${body.ccfriApplicationGuid},_ccof_childcarecategory_value=${body.childCareCategory}`;

  try {
    let response = await patchOperationWithObjectId('ccof_application_ccfri_childcarecategories', url, payload);
    log.info('feeResponse', response);
    return res.status(HttpStatus.CREATED).json(response);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }
}


module.exports = {
  upsertCCFRIApplication,
  upsertParentFees
};
