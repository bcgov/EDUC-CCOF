'use strict';
const { getOperationWithObjectId, postOperation, patchOperationWithObjectId, getUserGuid} = require('./utils');
const HttpStatus = require('http-status-codes');
const { ACCOUNT_TYPE } = require('../util/constants');
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject');
const { OrganizationMappings } = require('../util/mapping/Mappings');

async function getOrganization(req, res) {
  try {
    let organization = await getOperationWithObjectId('accounts', req.params.organizationId);
    if (ACCOUNT_TYPE.ORGANIZATION != organization?.ccof_accounttype) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'Account found but is not organization.' });
    }

    organization = new MappableObjectForFront(organization, OrganizationMappings);

    return res.status(HttpStatus.OK).json(organization);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function createOrganization(req, res) {

  const userGuid = getUserGuid(req);
  let organization = req.body;
  organization = new MappableObjectForBack(organization, OrganizationMappings);
  organization.data.ccof_accounttype = ACCOUNT_TYPE.ORGANIZATION;
  organization.data['primarycontactid@odata.bind'] = `/contacts(ccof_userid='${userGuid}')`;

  // For new organizations, create a CCOF Application header
  organization.data['ccof_ccof_application_Organization_account'] = [ 
    {
      'ccof_providertype': 100000000, //GROUP, 100000001 - Family
      'ccof_applicationtype': 100000000, // new
      'ccof_ProgramYear@odata.bind': '/ccof_program_years(fba5721b-9434-ed11-9db1-002248d53d53)',
    }
  ];

  try {
    let organizationGuid = await postOperation('accounts', organization);
    return res.status(HttpStatus.CREATED).json({ organizationId: organizationGuid });
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function updateOrganization(req, res) {
  let organization = req.body;

  organization = new MappableObjectForBack(organization, OrganizationMappings);
  organization = organization.toJSON();
  organization.ccof_accounttype = ACCOUNT_TYPE.ORGANIZATION;

  try {
    let orgResponse = await patchOperationWithObjectId('accounts', req.params.organizationId, organization);
    orgResponse = new MappableObjectForFront(orgResponse, OrganizationMappings);
    return res.status(HttpStatus.OK).json(orgResponse);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  getOrganization,
  createOrganization,
  updateOrganization
};
