'use strict';
const { isEmpty } = require('lodash');
const HttpStatus = require('http-status-codes');
const { getOperation, patchOperationWithObjectId, postOperation } = require('./utils');
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject');
const { ContactMappings, ContactFacilityMappings } = require('../util/mapping/Mappings');
const { getRoles } = require('../components/lookup');
const log = require('./logger');

async function getActiveContactsByOrgID(orgId) {
  const operation = `contacts?$select=contactid,ccof_username,firstname,lastname,telephone1,emailaddress1,_ofm_portal_role_id_value&$filter=(_parentcustomerid_value eq ${orgId} and statecode eq 0)`;
  return getOperation(operation);
}

function setContactType(contact) {
  return { ...contact.data, isPortalUser: !isEmpty(contact.data.bceid) };
}

async function getActiveContactsInOrganization(req, res) {
  try {
    const contactsData = await getActiveContactsByOrgID(req.params.organizationId);
    const contactsRaw = contactsData.value.map((contact) => new MappableObjectForFront(contact, ContactMappings)).map(setContactType);

    const roleMap = new Map((await getRoles()).map(({ data }) => [data.roleId, data.roleNumber]));
    const contacts = contactsRaw.map(({ roleId, ...rest }) => ({
      ...rest,
      role: {
        roleId,
        roleNumber: roleMap.get(roleId) ?? null,
      },
    }));
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

async function getRawContactFacilities(contactId) {
  const facilities = [];

  if (!contactId) {
    return facilities;
  }

  try {
    const operation = `ccof_bceid_organizations?$select=ccof_bceid_organizationid,ccof_name,_ccof_facility_value,_ccof_organization_value&$filter=(_ccof_facility_value ne null and _ccof_businessbceid_value eq ${contactId})`;
    const response = await getOperation(operation);

    response?.value?.forEach((item) => {
      const facility = new MappableObjectForFront(item, ContactFacilityMappings);
      facilities.push(facility);
    });

    return facilities;
  } catch (e) {
    log.error(e);
    return facilities;
  }
}

async function createContact(req, res) {
  try {
    if (req.body.bceid) {
      const existingContact = (await getOperation(`contacts?$filter=ccof_username eq '${req.body.bceid}' and statecode eq 0`))?.value?.[0];

      if (existingContact) {
        return res.status(HttpStatus.PRECONDITION_FAILED).json({
          message: 'A contact with this BCeID already exists.',
          contactId: existingContact.contactid,
        });
      }
    }
    const contactPayload = new MappableObjectForBack(req.body, ContactMappings).toJSON();
    if (req.body.organizationId) {
      contactPayload['parentcustomerid_account@odata.bind'] = `/accounts(${req.body.organizationId})`;
    }
    if (req.body.role && req.body.role.roleId) {
      contactPayload['ofm_portal_role_id@odata.bind'] = `/ofm_portal_roles(${req.body.role.roleId})`;
    }

    const createdContact = await postOperation('contacts', contactPayload);
    if (req.body.facilities && req.body.facilities.length > 0) {
      await createRawContactFacilities(createdContact, req.body.facilities);
    }
    return res.status(HttpStatus.CREATED).json(createdContact);
  } catch (e) {
    log.error('failed with error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function createRawContactFacilities(contactId, facilityIds) {
  try {
    for (const id of facilityIds) {
      const records = {
        'ccof_facility@odata.bind': `/accounts(${id})`,
        'ccof_BusinessBCeID@odata.bind': `/contacts(${contactId})`,
      };
      await postOperation('ccof_bceid_organizations', records);
    }
  } catch (e) {
    log.error(e);
  }
}

module.exports = {
  getActiveContactsInOrganization,
  deactivateContact,
  getRawContactFacilities,
  createContact,
  createRawContactFacilities,
};
