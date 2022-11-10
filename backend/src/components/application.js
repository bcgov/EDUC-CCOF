'use strict';
const { postOperation, patchOperationWithObjectId, getHttpHeader, minify } = require('./utils');
const config = require('../config/index');
const ApiError = require('./error');
const axios = require('axios');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const _ = require ('lodash');

// used to map from Dynamics API to Vue.js
// const GetFacilityKeyMap = {
//   name: 'facilityName',
//   ccof_facilitystartdate: 'yearBeginOperation',
//   address1_line1: 'facilityAddress',
//   address1_city: 'city',
//   address1_postalcode: 'postalCode', 
//   // XXXXXXXXXXXXX: 'contactName',
//   // XXXXXXXXXXXXX: 'position',
//   // XXXXXXXXXXXXX: 'phone',
//   // XXXXXXXXXXXXX: 'email',
//   ccof_facilitylicencenumber: 'licenseNumber',
//   // XXXXXXXXXXXXX: 'licenseEffectiveDate',
//   // XXXXXXXXXXXXX: 'hasReceivedFunding',
//   organizationId: 'organizationId: '
// };

// // used to map from Vue.js to Dynamics API
// const PostFacilityKeyMap = {
//   facilityName: 'name',
//   yearBeginOperation: 'ccof_facilitystartdate',
//   facilityAddress: 'address1_line1',
//   city: 'address1_city',
//   postalCode: 'address1_postalcode',
//   // contactName: 'XXXXXXXXXXXXX',
//   // position: 'XXXXXXXXXXXXX',
//   // phone: 'XXXXXXXXXXXXX',
//   // email: 'XXXXXXXXXXXXX',
//   licenseNumber: 'ccof_facilitylicencenumber',
//   // licenseEffectiveDate: 'XXXXXXXXXXXXX',
//   // hasReceivedFunding: 'XXXXXXXXXXXXX',
// };

let payload = {
  'ccof_ccfrioptin' : '',
};


//post doesn't work rn - so just leaving this here for now
async function createCCFRIApplication(req, res) {

  try {
    //let facilityGuid = await postOperation('accounts', facility);
    return res.status(HttpStatus.CREATED).json();
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }
}

async function updateCCFRIApplication(req, res) {
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

module.exports = {
  createCCFRIApplication,
  updateCCFRIApplication
};
