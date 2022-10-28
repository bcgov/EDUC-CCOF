'use strict';
const { getOperationWithObjectId, postOperation, patchOperationWithObjectId } = require('./utils');
const HttpStatus = require('http-status-codes');
const { ACCOUNT_TYPE } = require('../util/constants');
const _ = require ('lodash');

// used to map from Dynamics API to Vue.js
const GetOrganizationKeyMap = {
  name : 'legalName',
  address1_name : 'address1', //Address
  address1_city : 'city1',
  address1_postalcode : 'postalCode1',
  address2_name : 'address2', //Mailing Address
  address2_city : 'city2',
  address2_postalcode : 'postalCode2',
  address1_primarycontactname: 'contactName',
  ccof_position: 'position',
  telephone1 : 'phone',
  // businessBCeID : 'businessId', 
  emailaddress1 : 'email',
  ccof_instructionnumber : 'incNumber', //incorporation number
  ccof_typeoforganization : 'organizationType',
  'ccof_typeoforganization@OData.Community.Display.V1.FormattedValue' : 'organizationTypeDesc'
};

// used to map from Vue.js to Dynamics API
const PostOrganizationKeyMap = {
  legalName : 'name',
  address1 : 'address1_name',
  city1 : 'address1_city',
  postalCode1 : 'address1_postalcode',
  address2 : 'address2_name',
  city2 : 'address2_city',
  postalCode2 : 'address2_postalcode',
  contactName: 'address1_primarycontactname',
  position: 'ccof_position',
  // businessBCeID : 'businessId', 
  phone : 'telephone1',
  email : 'emailaddress1',
  incNumber : 'ccof_instructionnumber',
  organizationType : 'ccof_typeoforganization',
};


async function getOrganization(req, res) {
  try {
    let organization = await getOperationWithObjectId('accounts', req.params.organizationId);
    if (ACCOUNT_TYPE.ORGANIZATION != organization?.ccof_accounttype) {
      return res.status(HttpStatus.NOT_FOUND).json({message: 'Account found but is not organization.'});
    }
    organization = _(organization).pick(Object.keys(GetOrganizationKeyMap)).mapKeys((value,key) => {return GetOrganizationKeyMap[key];});
    return res.status(HttpStatus.OK).json(organization);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }
}

async function createOrganization(req, res) {
  let organization = req.body;
  organization = _(organization).pick(Object.keys(PostOrganizationKeyMap)).mapKeys((value,key) => {return PostOrganizationKeyMap[key];});
  organization = organization.value();
  organization.ccof_accounttype = ACCOUNT_TYPE.ORGANIZATION;

  try {
    let organizationGuid = await postOperation('accounts', organization);
    return res.status(HttpStatus.CREATED).json({organizationId: organizationGuid});
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }
}

async function updateOrganization(req, res) {
  let organization = req.body;
  organization = _(organization).pick(Object.keys(PostOrganizationKeyMap)).mapKeys((value,key) => {return PostOrganizationKeyMap[key];});
  organization = organization.value();
  organization.ccof_accounttype = ACCOUNT_TYPE.ORGANIZATION;

  try {
    let orgResponse = await patchOperationWithObjectId('accounts', req.params.organizationId, organization);
    orgResponse = _(orgResponse).pick(Object.keys(GetOrganizationKeyMap)).mapKeys((value,key) => {return GetOrganizationKeyMap[key];});
    return res.status(HttpStatus.OK).json(orgResponse);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }
}

module.exports = {
  getOrganization,
  createOrganization,
  updateOrganization
};
