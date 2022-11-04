'use strict';
const { getOperationWithObjectId, postOperation, patchOperationWithObjectId, getSessionUser} = require('./utils');
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
  const userInfo = getSessionUser(req);

  if (!userInfo || !userInfo.jwt || !userInfo._json) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: 'No session data'
    });
  }
  let businessGuid = null;
  if (req.session?.passport?.user?._json?.bceid_business_guid) {
    // This is a business BCEID user
    businessGuid = req.session?.passport?.user?._json?.bceid_business_guid;
  } else {
    // This is an IDIR user
    businessGuid = req.session?.passport?.user?._json?.idir_user_guid;
  }

  let organization = req.body;
  organization = new MappableObjectForBack(organization, OrganizationMappings);
  organization = organization.toJSON();
  organization.ccof_accounttype = ACCOUNT_TYPE.ORGANIZATION;
  organization['primarycontactid@odata.bind'] = `/contacts(ccof_userid='${businessGuid}')`;

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
