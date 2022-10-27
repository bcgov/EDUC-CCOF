'use strict';
const { getOperationWithObjectId, postOperation, patchOperationWithObjectId } = require('./utils');
const HttpStatus = require('http-status-codes');
const logger = require('./logger');
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
    if (100000000 != organization?.ccof_accounttype) {
      return res.status(HttpStatus.NOT_FOUND).json({message: 'Account found but is not organization.'});
    }
    organization = _(organization).pick(Object.keys(GetOrganizationKeyMap)).mapKeys((value,key) => {return GetOrganizationKeyMap[key];});
    return res.status(HttpStatus.OK).json(organization);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }
}
/* some JSON for creating organization
  -d '{
    "name": "Rob'\''s second organization", // Max length 160
    "ccof_accounttype": 100000000, // Organization
    "ccof_typeoforganization": 100000000, // Non-Profit
    "address1_name": "JJJ-ADDRESS1_name", // Max length 200
    "address1_city": "JJJ-ADDRESS1_city", // Max length 80
    "address1_postalcode": "Q3Q 3Q3", // Max length 20
    "address2_name": "JJJ-ADDRESS2_name", // Max length 200
    "address2_city": "JJJ-ADDRESS2_city", // Max length 80
    "address2_postalcode": "V1V 1V1", // Max length 20
    "telephone1": "604-444-4444", // Max length 50
    "emailaddress1": "test@email.com", // Max length 100
    "ccof_instructionnumber": "ccof_instruction_num" // Max length 4000
}
'
*/
async function createOrganization(req, res) {
  let organization = req.body;
  organization = _(organization).pick(Object.keys(PostOrganizationKeyMap)).mapKeys((value,key) => {return PostOrganizationKeyMap[key];});
  organization = organization.value();
  organization.ccof_accounttype = 100000000;

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
  organization.ccof_accounttype = 100000000;

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
