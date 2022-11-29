'use strict';
const { getOperationWithObjectId, postOperation, patchOperationWithObjectId, getUserGuid, getOperation, minify} = require('./utils');
const HttpStatus = require('http-status-codes');
const { ACCOUNT_TYPE, ORGANIZATION_PROVIDER_TYPES } = require('../util/constants');
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject');
const { OrganizationMappings } = require('../util/mapping/Mappings');
const log = require('./logger');


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
  log.info('create org called');
  try {
    const userGuid = getUserGuid(req);
    let organization = req.body;
    let programYear = '/ccof_program_years(' + organization.programYearId +')';
    // let programYear = '/ccof_program_years(fba5721b-9434-ed11-9db1-002248d53d53)';
    
    log.info('about to map: ', organization);
    organization = new MappableObjectForBack(organization, OrganizationMappings);
    log.info('after to map: ', organization);
    organization.data.ccof_accounttype = ACCOUNT_TYPE.ORGANIZATION;
    organization.data['primarycontactid@odata.bind'] = `/contacts(ccof_userid='${userGuid}')`;

    // For new organizations, create a CCOF Application header
    organization.data['ccof_ccof_application_Organization_account'] = [ 
      {
        'ccof_providertype': ORGANIZATION_PROVIDER_TYPES.GROUP, //10000000, // organization.providerType, //10000000 GROUP, 100000001 - Family
        'ccof_applicationtype': 100000000, // new
        'ccof_ProgramYear@odata.bind': programYear,
      }
    ];


    log.info('createOrganziation payload:', organization );
    let organizationGuid = await postOperation('accounts', organization);
    //After the application is created, get the application guid
    let operation = 'accounts(' + organizationGuid + ')?$select=accountid&$expand=ccof_ccof_application_Organization_account($select=ccof_applicationid,statuscode)';
    let applicationPayload = await getOperation(operation);
    let applicationId = undefined;
    let applicationStatus = undefined;
    if ( applicationPayload?.ccof_ccof_application_Organization_account?.length > 0) {
      applicationId = applicationPayload.ccof_ccof_application_Organization_account[0].ccof_applicationid;
      applicationStatus= applicationPayload.ccof_ccof_application_Organization_account[0].statuscode;
      
    } else {
      log.error('Unable to find applicationId when creating organization: ', organizationGuid);
    }
    return res.status(HttpStatus.CREATED).json({ organizationId: organizationGuid, applicationId: applicationId, applicationStatus: applicationStatus});
  } catch (e) {
    log.error('error', e);
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
