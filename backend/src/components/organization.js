'use strict';
const { getOperationWithObjectId, postOperation, patchOperationWithObjectId, getUserGuid, getOperation } = require('./utils');
const HttpStatus = require('http-status-codes');
const { ACCOUNT_TYPE, APPLICATION_STATUS_CODES, CCOF_APPLICATION_TYPES, ORGANIZATION_PROVIDER_TYPES } = require('../util/constants');
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject');
const { OrganizationMappings } = require('../util/mapping/Mappings');
const { getLabelFromValue } = require('./utils');
const log = require('./logger');

async function getOrganization(req, res) {
  try {
    let organization = await getOperationWithObjectId('accounts', req.params.organizationId);
    if (ACCOUNT_TYPE.ORGANIZATION != organization?.ccof_accounttype) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'Account found but is not organization.' });
    }

    organization = mapOrganizationObjectForFront(organization);

    return res.status(HttpStatus.OK).json(organization);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

function mapOrganizationForBack(data) {
  let organizationForBack = new MappableObjectForBack(data, OrganizationMappings).toJSON();

  if (organizationForBack.ccof_facilitystartdate) {
    organizationForBack.ccof_facilitystartdate = `${organizationForBack.ccof_facilitystartdate}-01-01`;
  }

  return organizationForBack;
}

function mapOrganizationObjectForFront(data) {
  if (data.ccof_facilitystartdate) {
    let year = data.ccof_facilitystartdate.split('-')[0];
    data.ccof_facilitystartdate = year;
  }

  return new MappableObjectForFront(data, OrganizationMappings).toJSON();
}

async function createOrganization(req, res) {
  try {
    const userGuid = getUserGuid(req);
    const organization = mapOrganizationForBack(req.body);
    organization.ccof_accounttype = ACCOUNT_TYPE.ORGANIZATION;
    organization['primarycontactid@odata.bind'] = `/contacts(ccof_userid='${userGuid}')`;

    // For new organizations, create a CCOF Application header
    organization.ccof_ccof_application_Organization_account = [
      {
        ccof_providertype: req.body?.providerType, //10000000 GROUP, 100000001 - Family
        ccof_applicationtype: CCOF_APPLICATION_TYPES.NEW,
        ccof_application_template_version: req.body?.applicationTemplateVersion,
        'ccof_ProgramYear@odata.bind': '/ccof_program_years(' + req.body?.programYearId + ')',
      },
    ];
    const organizationGuid = await postOperation('accounts', organization);
    //After the application is created, get the application guid
    const operation = `accounts(${organizationGuid})?$select=accountid&$expand=ccof_ccof_application_Organization_account($select=ccof_applicationid,statuscode)`;
    const applicationPayload = await getOperation(operation);
    let applicationId;
    let applicationStatus;
    const providerTypeLabel = getLabelFromValue(req.body?.providerType, ORGANIZATION_PROVIDER_TYPES);
    if (applicationPayload?.ccof_ccof_application_Organization_account?.length > 0) {
      applicationId = applicationPayload.ccof_ccof_application_Organization_account[0].ccof_applicationid;
      applicationStatus = getLabelFromValue(applicationPayload.ccof_ccof_application_Organization_account[0].statuscode, APPLICATION_STATUS_CODES);
    } else {
      log.error('Unable to find applicationId when creating organization: ', organizationGuid);
    }
    return res.status(HttpStatus.CREATED).json({
      organizationId: organizationGuid,
      applicationId: applicationId,
      applicationStatus: applicationStatus,
      organizationProviderType: providerTypeLabel,
      applicationType: 'NEW',
    });
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function updateOrganization(req, res) {
  try {
    const organization = mapOrganizationForBack(req.body);
    organization.ccof_accounttype = ACCOUNT_TYPE.ORGANIZATION;
    const response = await patchOperationWithObjectId('accounts', req.params.organizationId, organization);
    return res.status(HttpStatus.OK).json(new MappableObjectForFront(response, OrganizationMappings));
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  getOrganization,
  createOrganization,
  updateOrganization,
};
