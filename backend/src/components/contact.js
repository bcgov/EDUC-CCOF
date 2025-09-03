'use strict';
const { isEmpty } = require('lodash');
const HttpStatus = require('http-status-codes');
const { getOperation, patchOperationWithObjectId } = require('./utils');
const { MappableObjectForFront } = require('../util/mapping/MappableObject');
const { ContactMappings, ContactFacilityMappings } = require('../util/mapping/Mappings');
const log = require('./logger');

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

module.exports = {
  getActiveContactsInOrganization,
  deactivateContact,
  getRawContactFacilities,
};
