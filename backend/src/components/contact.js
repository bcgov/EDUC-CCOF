'use strict';
const cache = require('memory-cache');
const { isEmpty } = require('lodash');
const HttpStatus = require('http-status-codes');
const { getOperation, patchOperationWithObjectId, postOperation } = require('./utils');
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject');
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

  const operation = "ofm_portal_roles?$select=ofm_name,ofm_portal_role_number,ofm_portal_roleid&$expand=owningbusinessunit($select=name)&$filter=owningbusinessunit/name eq 'CCOF'";
  const roleData = await getOperation(operation);
  const portalRoles = roleData.value.map((role) => new MappableObjectForFront(role, ContactRoleMappings).data);
  rolesCache.put('portalRoles', portalRoles, ONE_DAY_MS);

  return portalRoles;
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
    const contactPayload = new MappableObjectForBack(req.body, ContactMappings).toJSON();
    if (req.body.organizationId) {
      contactPayload['parentcustomerid_account@odata.bind'] = `/accounts(${req.body.organizationId})`;
    }
    if (req.body.portalRole) {
      const userRole = ccofRoles.find((role) => role.roleNumber === req.body.portalRole);
      if (userRole) {
        contactPayload['ofm_portal_role_id@odata.bind'] = `/ofm_portal_roles(${userRole.roleId})`;
      }
    }
    const createdContact = await postOperation('contacts', contactPayload);
    return res.status(HttpStatus.OK).json(createdContact);
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
