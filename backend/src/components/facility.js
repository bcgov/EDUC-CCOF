'use strict';
const { getOperationWithObjectId, postOperation, patchOperationWithObjectId } = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const _ = require ('lodash');

// used to map from Dynamics API to Vue.js
const GetFacilityKeyMap = {
  name: 'facilityName',
  ccof_facilitystartdate: 'yearBeginOperation',
  address1_line1: 'facilityAddress',
  address1_city: 'city',
  address1_postalcode: 'postalCode', 
  // XXXXXXXXXXXXX: 'contactName',
  // XXXXXXXXXXXXX: 'position',
  // XXXXXXXXXXXXX: 'phone',
  // XXXXXXXXXXXXX: 'email',
  ccof_facilitylicencenumber: 'licenseNumber',
  // XXXXXXXXXXXXX: 'licenseEffectiveDate',
  // XXXXXXXXXXXXX: 'hasReceivedFunding',
  organizationId: 'organizationId: '
};

// used to map from Vue.js to Dynamics API
const PostFacilityKeyMap = {
  facilityName: 'name',
  yearBeginOperation: 'ccof_facilitystartdate',
  facilityAddress: 'address1_line1',
  city: 'address1_city',
  postalCode: 'address1_postalcode',
  // contactName: 'XXXXXXXXXXXXX',
  // position: 'XXXXXXXXXXXXX',
  // phone: 'XXXXXXXXXXXXX',
  // email: 'XXXXXXXXXXXXX',
  licenseNumber: 'ccof_facilitylicencenumber',
  // licenseEffectiveDate: 'XXXXXXXXXXXXX',
  // hasReceivedFunding: 'XXXXXXXXXXXXX',
};


async function getFacility(req, res) {
  try {
    let facility = await getOperationWithObjectId('accounts', req.params.facilityId);
    if (100000001 != facility?.ccof_accounttype) {
      return res.status(HttpStatus.NOT_FOUND).json({message: 'Account found but is not facility.'});
    }
    log.info('before is:');
    log.info(facility);
    log.info('facility is');

    
    facility = _(facility).pick(Object.keys(GetFacilityKeyMap)).mapKeys((value,key) => {return GetFacilityKeyMap[key];});
    log.info(facility);
    return res.status(HttpStatus.OK).json(facility);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }
}

async function createFacility(req, res) {
  let facility = req.body;
  let organizationString = '/accounts(' + req.organizationId + ')';
  //"parentaccountid@odata.bind": "/accounts(c4a15c1f-0449-ed11-bba2-000d3af4f031)", // Lookup - Organization Guid
  facility = _(facility).pick(Object.keys(PostFacilityKeyMap)).mapKeys((value,key) => {return PostFacilityKeyMap[key];});
  facility = facility.value();
  facility['ccof_accounttype'] = 100000001;
  facility['parentaccountid@odata.bind'] = organizationString;

  try {
    let facilityGuid = await postOperation('accounts', facility);
    return res.status(HttpStatus.CREATED).json({facilityId: facilityGuid});
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }
}

async function updateFacility(req, res) {
  let facility = req.body;
  facility = _(facility).pick(Object.keys(PostFacilityKeyMap)).mapKeys((value,key) => {return PostFacilityKeyMap[key];});
  facility = facility.value();
  facility.ccof_accounttype = 100000001;

  try {
    let response = await patchOperationWithObjectId('accounts', req.params.facilityId, facility);
    response = _(response).pick(Object.keys(GetFacilityKeyMap)).mapKeys((value,key) => {return GetFacilityKeyMap[key];});
    return res.status(HttpStatus.OK).json(response);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }
}

module.exports = {
  getFacility,
  createFacility,
  updateFacility
};
