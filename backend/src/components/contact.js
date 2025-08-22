'use strict';
const cache = require('memory-cache');
const { isEmpty } = require('lodash');
const HttpStatus = require('http-status-codes');
const { getOperation, patchOperationWithObjectId, getUserGuid } = require('./utils');
const { OFM_PORTAL_ROLES } = require('../util/constants');
const { MappableObjectForFront } = require('../util/mapping/MappableObject');
const { ContactMappings, ContactRoleMappings } = require('../util/mapping/Mappings');
const log = require('./logger');

const rolesCache = new cache.Cache();
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

async function getActiveContactsByOrgID(orgId) {
  const operation = `contacts?$select=contactid,ccof_username,firstname,lastname,telephone1,emailaddress1&$filter=(_parentcustomerid_value eq ${orgId} and statecode eq 0)`;
  return getOperation(operation);
}

function setContactType(contact) {
  return { ...contact.data, isPortalUser: !isEmpty(contact.data.bceid) };
}

async function getActiveContactsInOrganization(req, res) {
  try {
    const contactsData = await getActiveContactsByOrgID(req.params.organizationId);
    const contacts = contactsData.value.map((contact) => new MappableObjectForFront(contact, ContactMappings)).map(setContactType);
    return res.status(HttpStatus.OK).json(contacts);
  } catch (e) {
    log.error('failed with error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function deactivateContact(req, res) {
  try {
    const responseData = await patchOperationWithObjectId('contacts', req.params.contactId, { statecode: 1 });
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    log.error('failed with error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function getCCOFRoles() {
  const cachedRoles = rolesCache.get('portalRoles');

  if (cachedRoles) {
    log.info('Retrieved portalRoles from cache');
    return cachedRoles;
  }

  const operation = "ofm_portal_roles?$select=ofm_name,ofm_portal_role_number&$expand=owningbusinessunit($select=name)&$filter=owningbusinessunit/name eq 'CCOF'";
  const roleData = await getOperation(operation);
  const portalRoles = roleData.value.map((role) => new MappableObjectForFront(role, ContactRoleMappings).data);
  rolesCache.put('portalRoles', portalRoles, ONE_DAY_MS);

  return portalRoles;
}

async function getRoleByGuid(guid) {
  const operation = `contacts?$select=_ofm_portal_role_id_value&$filter=ccof_userid eq '${guid}'`;
  const data = await getOperation(operation);
  return data.value[0]['_ofm_portal_role_id_value'];
}

async function getRoles(_req, res) {
  try {
    const roles = await getCCOFRoles();
    return res.status(HttpStatus.OK).json(roles);
  } catch (e) {
    log.error('failed with error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function createContact(req, res) {
  try {
    const ccofRoles = await getCCOFRoles();
    const userRoleId = await getRoleByGuid(getUserGuid(req));
    const userRole = ccofRoles.find((role) => role.roleId === userRoleId);
    const adminRole = ccofRoles.find((role) => role.roleNumber === OFM_PORTAL_ROLES.ORG_ADMIN);

    if (userRoleId !== adminRole.roleId) {
      return res.status(HttpStatus.UNAUTHORIZED).json('Not authorized');
    }

    // TODO: Work out the rest of the forking logic for create contactp

    return res.status(HttpStatus.OK).json(userRole);
  } catch (e) {
    log.error('failed with error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  createContact,
  getActiveContactsInOrganization,
  getRoles,
  deactivateContact,
};
