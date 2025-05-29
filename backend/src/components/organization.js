'use strict';
const { getOperationWithObjectId, postOperation, patchOperationWithObjectId, getUserGuid, getOperation } = require('./utils');
const HttpStatus = require('http-status-codes');
const { ACCOUNT_TYPE, APPLICATION_STATUS_CODES, CCOF_APPLICATION_TYPES, ORGANIZATION_PROVIDER_TYPES } = require('../util/constants');
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject');
const { OrganizationMappings, OrganizationFacilityMappings, FundingAgreementMappings } = require('../util/mapping/Mappings');
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

async function getFacilitiesByOrgId(orgId) {
  const operation =
    'accounts?$select=name,address1_city,address1_line1,address1_line2,address1_stateorprovince,address1_postalcode,' +
    'telephone1,emailaddress1,ccof_facilitylicencenumber,accountnumber,statuscode' +
    `&$filter=_parentaccountid_value eq ${orgId}` +
    '&$expand=ccof_funding_agreement_facility_account($orderby=createdon desc)';
  return getOperation(operation);
}

async function getOrganizationFacilities(req, res) {
  try {
    const facilitiesData = await getFacilitiesByOrgId(req.params.organizationId);
    const facilities = facilitiesData.value.map((facility) => {
      let mappedFacility = new MappableObjectForFront(facility, OrganizationFacilityMappings);
      mappedFacility.data.fundingAgreements = facility.ccof_funding_agreement_facility_account.map((fa) => {
        return new MappableObjectForFront(fa, FundingAgreementMappings).data;
      });
      return mappedFacility;
    });
    return res.status(HttpStatus.OK).json(facilities);
  } catch (e) {
    log.error('failed with error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

function mapOrganizationForBack(data) {
  const organizationForBack = new MappableObjectForBack(data, OrganizationMappings).toJSON();
  organizationForBack.ccof_accounttype = ACCOUNT_TYPE.ORGANIZATION;
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
        'ccof_ProgramYear@odata.bind': `/ccof_program_years(${req.body?.programYearId})`,
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
    const response = await patchOperationWithObjectId('accounts', req.params.organizationId, organization);
    return res.status(HttpStatus.OK).json(new MappableObjectForFront(response, OrganizationMappings));
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  getOrganization,
  getOrganizationFacilities,
  createOrganization,
  updateOrganization,
};
