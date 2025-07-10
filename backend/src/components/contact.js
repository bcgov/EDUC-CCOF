'use strict';
const { getOperation } = require('./utils');
const HttpStatus = require('http-status-codes');
const { MappableObjectForFront } = require('../util/mapping/MappableObject');
const { ContactMappings } = require('../util/mapping/Mappings');
const log = require('./logger');

async function getContactsByOrgID(orgId) {
  const operation = `contacts?$select=contactid,ccof_username,firstname,lastname,telephone1,emailaddress1&$filter=_parentcustomerid_value eq ${orgId}`;
  return getOperation(operation);
}

async function getContactsInOrganization(req, res) {
  try {
    const contactsData = await getContactsByOrgID(req.params.organizationId);
    const contacts = contactsData.value.map((contact) => new MappableObjectForFront(contact, ContactMappings));
    return res.status(HttpStatus.OK).json(contacts);
  } catch (e) {
    log.error('failed with error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  getContactsInOrganization,
};
