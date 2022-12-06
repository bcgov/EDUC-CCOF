/* eslint-disable quotes */
'use strict';
const { postOperation, patchOperationWithObjectId, getHttpHeader, minify, getOperation } = require('./utils');
const config = require('../config/index');
const ApiError = require('./error');
const axios = require('axios');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const _ = require ('lodash');
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject');
const { ECEWEApplicationMappings, ECEWEFacilityMappings } = require('../util/mapping/Mappings');
const { info } = require('./logger');

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
    "ccof_frequency": 100000002,
    "ccof_ChildcareCategory@odata.bind": childCareCategory, // 0-18 months
    "ccof_ProgramYear@odata.bind": programYear, // Lookup //2021/22
    "ccof_apr": 230.00,
    "ccof_may": 110.00,
    "ccof_jun": 110.00,
    "ccof_jul": 110.00,
    "ccof_aug": 110.00,
    "ccof_sep": 340.00,
    "ccof_oct": 450.00,
    "ccof_nov": 450.00,
    "ccof_dec": 45.00,
    "ccof_jan": 45.00,
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

async function getECEWEApplication(req, res) {
  try {
    let operation = 'ccof_applications('+req.params.applicationId+')?$select=ccof_ecewe_optin,ccof_ecewe_employeeunion,ccof_ecewe_selecttheapplicablefundingmodel,ccof_ecewe_confirmation&$expand=ccof_ccof_application_ccof_applicationecewe_application($select=ccof_name,_ccof_facility_value,ccof_optintoecewe,statuscode)';
    let eceweApp = await getOperation(operation);
    eceweApp = new MappableObjectForFront(eceweApp, ECEWEApplicationMappings);
    let forFrontFacilities = [];
    Object.values(eceweApp.data.facilities).forEach(value => forFrontFacilities.push(new MappableObjectForFront(value, ECEWEFacilityMappings).data));
    eceweApp.data.facilities = forFrontFacilities;
    return res.status(HttpStatus.OK).json(eceweApp);
  } catch (e) {
    log.info('@#$@$#$ = '+e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function updateECEWEApplication(req, res) {
  let application = req.body;
  // remove facilities from request payload (i.e. not updating facilities)
  delete application.facilities;
  application = new MappableObjectForBack(application, ECEWEApplicationMappings);
  application = application.toJSON();
  try {
    let response = await patchOperationWithObjectId('ccof_applications', req.params.applicationId, application);
    return res.status(HttpStatus.OK).json(response);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function updateECEWEFacilityApplication(req, res) {
  let facilities = req.body;
  let forBackFacilities = [];
  let response;
  Object.values(facilities).forEach(value => forBackFacilities.push(new MappableObjectForBack(value, ECEWEFacilityMappings).data));
  let eceweApplicationId;
  try {
    for (let key in forBackFacilities) {
      // add join attributes for application and facility
      forBackFacilities[key]['ccof_application@odata.bind'] = '/ccof_applications('+req.params.applicationId+')';
      forBackFacilities[key]['ccof_Facility@odata.bind'] = '/accounts('+forBackFacilities[key]._ccof_facility_value+')';
      eceweApplicationId = forBackFacilities[key].ccof_applicationeceweid;
      // remove attributes we are not updating before sending payload.
      delete forBackFacilities[key].ccof_applicationeceweid;
      delete forBackFacilities[key]._ccof_facility_value;
      let facility = forBackFacilities[key];
      response = await patchOperationWithObjectId('ccof_applicationecewes', eceweApplicationId , facility);
    }
    return res.status(HttpStatus.OK).json(response);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  upsertCCFRIApplication,
  upsertParentFees,
  getECEWEApplication,
  updateECEWEApplication,
  updateECEWEFacilityApplication
};
