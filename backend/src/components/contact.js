'use strict';
const { isEmpty } = require('lodash');
const HttpStatus = require('http-status-codes');
const { getOperation, patchOperationWithObjectId, postOperation, deleteOperationWithObjectId } = require('./utils');
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject');
const { ContactMappings, ContactFacilityMappings, FacilityMappings } = require('../util/mapping/Mappings');
const { getRoles } = require('../components/lookup');
const log = require('./logger');

async function getActiveContactsByOrgID(orgId) {
  const operation = `contacts?$select=contactid,ccof_username,firstname,lastname,telephone1,emailaddress1,_ccof_ccof_portal_id_value&$filter=(_parentcustomerid_value eq ${orgId} and statecode eq 0)`;
  return getOperation(operation);
}

function setContactType(contact) {
  return { ...contact.data, isPortalUser: !isEmpty(contact.data.bceid) };
}

async function getActiveContactsInOrganization(req, res) {
  try {
    const contactsData = await getActiveContactsByOrgID(req.params.organizationId);
    const contactsRaw = contactsData.value.map((contact) => new MappableObjectForFront(contact, ContactMappings)).map(setContactType);
    const roleMap = new Map((await getRoles()).map((role) => [role.roleId, { roleNumber: role.roleNumber, roleName: role.roleName }]));
    const contacts = await Promise.all(
      contactsRaw.map(async ({ roleId, contactId, ...rest }) => {
        const facilities = await getRawContactFacilities(contactId);
        return {
          ...rest,
          contactId,
          role: {
            roleId,
            roleNumber: roleMap.get(roleId)?.roleNumber ?? null,
            roleName: roleMap.get(roleId)?.roleName ?? null,
          },
          facilities,
        };
      }),
    );
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
  if (!contactId) {
    return [];
  }

  try {
    const operation = `ccof_bceid_organizations?$select=ccof_bceid_organizationid,ccof_name,_ccof_facility_value,_ccof_organization_value&$expand=ccof_facility($select=name,ccof_facilitylicencenumber,accountnumber)&$filter=(_ccof_facility_value ne null and _ccof_businessbceid_value eq ${contactId}) and statecode eq 0`;
    const response = await getOperation(operation);
    const responseValues = response?.value || [];

    return responseValues.map((item) => {
      const facility = new MappableObjectForFront(item, ContactFacilityMappings);
      return {
        ...facility.data,
        ...new MappableObjectForFront(item.ccof_facility, FacilityMappings).data,
      };
    });
  } catch (e) {
    log.error(e);
    return [];
  }
}

async function createContact(req, res) {
  try {
    if (req.body.bceid) {
      const existingContact = (await getOperation(`contacts?$filter=ccof_username eq '${req.body.bceid}'`))?.value?.[0];

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
    if (req.body.role?.roleId) {
      contactPayload['ccof_ccof_portal_id@odata.bind'] = `/ofm_portal_roles(${req.body.role.roleId})`;
    }

    const createdContact = await postOperation('contacts', contactPayload);
    if (!isEmpty(req.body.facilities)) {
      await createRawContactFacility(createdContact, req.body.facilities);
    }
    return res.status(HttpStatus.CREATED).json(createdContact);
  } catch (e) {
    log.error('failed with error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function createRawContactFacility(contactId, facilityId) {
  const records = {
    'ccof_facility@odata.bind': `/accounts(${facilityId})`,
    'ccof_BusinessBCeID@odata.bind': `/contacts(${contactId})`,
  };
  return postOperation('ccof_bceid_organizations', records);
}

async function syncContactFacilities(contactId, incomingFacilityIds = []) {
  try {
    const response = await getOperation(`ccof_bceid_organizations?$select=ccof_bceid_organizationid,_ccof_facility_value,statecode&$filter=_ccof_businessbceid_value eq ${contactId}`);
    const existingLinks = response?.value ?? [];
    const existingFacilityMap = new Map(existingLinks.map((item) => [item._ccof_facility_value, { id: item.ccof_bceid_organizationid, statecode: item.statecode }]));

    const toDelete = [];
    const toCreate = [];

    for (const facilityId of incomingFacilityIds) {
      if (!existingFacilityMap.has(facilityId)) {
        toCreate.push(facilityId);
      }
    }
    for (const [facilityId, { id }] of existingFacilityMap.entries()) {
      if (!incomingFacilityIds.includes(facilityId)) {
        toDelete.push(id);
      }
    }
    const updates = [...toDelete.map((id) => deleteOperationWithObjectId('ccof_bceid_organizations', id)), ...toCreate.map((id) => createRawContactFacility(contactId, id))];
    await Promise.all(updates);
  } catch (e) {
    log.error(e);
  }
}

async function updateContact(req, res) {
  try {
    const payload = new MappableObjectForBack(req.body, ContactMappings).toJSON();
    if (req.body.role?.roleId) {
      payload['ccof_ccof_portal_id@odata.bind'] = `/ofm_portal_roles(${req.body.role.roleId})`;
    }
    await patchOperationWithObjectId('contacts', req.params.contactId, payload);

    if (req.body.facilities) {
      await syncContactFacilities(req.params.contactId, req.body.facilities);
    }
    return res.status(HttpStatus.OK).json();
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  getActiveContactsInOrganization,
  deactivateContact,
  getRawContactFacilities,
  createContact,
  createRawContactFacility,
  updateContact,
};
