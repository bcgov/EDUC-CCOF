'use strict';

jest.mock('../../src/components/utils', () => ({
  getOperation: jest.fn(),
  postOperation: jest.fn(),
  patchOperationWithObjectId: jest.fn(),
  deleteOperationWithObjectId: jest.fn(),
  getUserName: jest.fn(),
}));

jest.mock('../../src/components/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  verbose: jest.fn(),
}));

jest.mock('../../src/components/lookup', () => ({
  getRoles: jest.fn(),
}));

const utils = require('../../src/components/utils');
const log = require('../../src/components/logger');
const { createContact, linkExistingContactWithAnOrg } = require('../../src/components/contact');

const { getOperation, postOperation, patchOperationWithObjectId, deleteOperationWithObjectId, getUserName } = utils;

const ORG_ID = '11111111-1111-1111-1111-111111111111';
const OTHER_ORG_ID = '99999999-9999-9999-9999-999999999999';
const CONTACT_ID = '22222222-2222-2222-2222-222222222222';
const FACILITY_ID = '33333333-3333-3333-3333-333333333333';
const OTHER_FACILITY_ID = '55555555-5555-5555-5555-555555555555';
const ROLE_ID = '44444444-4444-4444-4444-444444444444';
const LINK_ID = '66666666-6666-6666-6666-666666666666';

const ORPHANED_MESSAGE = 'This BCeID exists but is not associated with any organization.';
const ALREADY_LINKED_MESSAGE = 'This BCeID is already associated with another organization.';

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

function baseCreateReq(overrides = {}) {
  return {
    body: {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@test.com',
      telephone: '250-999-9999',
      organizationId: ORG_ID,
      facilities: [],
      ...overrides,
    },
  };
}

function orphanedContact(overrides = {}) {
  return {
    contactid: CONTACT_ID,
    firstname: 'Jane',
    lastname: 'Doe',
    _parentcustomerid_value: null,
    ...overrides,
  };
}

function linkedContact() {
  return orphanedContact({ _parentcustomerid_value: OTHER_ORG_ID });
}

describe('contact component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getUserName.mockReturnValue('testadmin');
  });

  describe('createContact', () => {
    it('creates a contact without a BCeID (Contact Only) and skips the duplicate check', async () => {
      const req = baseCreateReq({ bceid: undefined });
      const res = mockRes();
      postOperation.mockResolvedValue('created-contact-id');

      await createContact(req, res);

      expect(getOperation).not.toHaveBeenCalled();
      expect(postOperation).toHaveBeenCalledTimes(1);
      expect(postOperation).toHaveBeenCalledWith('contacts', expect.objectContaining({
        firstname: 'Jane',
        lastname: 'Doe',
        emailaddress1: 'jane.doe@test.com',
        telephone1: '250-999-9999',
        'parentcustomerid_account@odata.bind': `/accounts(${ORG_ID})`,
      }));
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('creates a new contact when the BCeID does not exist', async () => {
      const req = baseCreateReq({ bceid: 'newbceid1' });
      const res = mockRes();
      getOperation.mockResolvedValue({ value: [] });
      postOperation.mockResolvedValue('created-contact-id');

      await createContact(req, res);

      expect(getOperation).toHaveBeenCalledWith(expect.stringContaining("ccof_username eq 'newbceid1'"));
      expect(postOperation).toHaveBeenCalledWith('contacts', expect.objectContaining({
        ccof_username: 'newbceid1',
        'parentcustomerid_account@odata.bind': `/accounts(${ORG_ID})`,
      }));
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('returns orphaned details and does not create a record when the BCeID has no organization', async () => {
      const req = baseCreateReq({ bceid: 'orphanbceid' });
      const res = mockRes();
      getOperation.mockResolvedValue({ value: [orphanedContact()] });

      await createContact(req, res);

      expect(postOperation).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        exists: true,
        orphaned: true,
        contactId: CONTACT_ID,
        firstName: 'Jane',
        lastName: 'Doe',
        message: ORPHANED_MESSAGE,
      }));
    });

    it('returns 412 and does not create a record when the BCeID belongs to another organization', async () => {
      const req = baseCreateReq({ bceid: 'linkedbceid' });
      const res = mockRes();
      getOperation.mockResolvedValue({ value: [linkedContact()] });

      await createContact(req, res);

      expect(postOperation).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(412);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: ALREADY_LINKED_MESSAGE,
        contactId: CONTACT_ID,
        organizationId: OTHER_ORG_ID,
      }));
    });

    it('flags the orphaned contact as deactivated when statecode is 1', async () => {
      const req = baseCreateReq({ bceid: 'deactivatedbceid' });
      const res = mockRes();
      getOperation.mockResolvedValue({ value: [orphanedContact({ statecode: 1 })] });

      await createContact(req, res);

      expect(postOperation).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        orphaned: true,
        deactivated: true,
        message: ORPHANED_MESSAGE,
      }));
    });

    it('flags the orphaned contact as not deactivated when statecode is 0', async () => {
      const req = baseCreateReq({ bceid: 'activebceid' });
      const res = mockRes();
      getOperation.mockResolvedValue({ value: [orphanedContact({ statecode: 0 })] });

      await createContact(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        orphaned: true,
        deactivated: false,
      }));
    });
    it('creates facility links when facilities are provided on create', async () => {
      const req = baseCreateReq({ bceid: undefined, facilities: [FACILITY_ID] });
      const res = mockRes();
      postOperation.mockResolvedValue('created-contact-id');

      await createContact(req, res);

      expect(postOperation).toHaveBeenCalledWith('contacts', expect.any(Object));
      expect(postOperation).toHaveBeenCalledWith('ccof_bceid_organizations', expect.objectContaining({
        'ccof_facility@odata.bind': `/accounts(${FACILITY_ID})`,
        'ccof_BusinessBCeID@odata.bind': '/contacts(created-contact-id)',
      }));
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('linkExistingContactWithAnOrg', () => {
    function linkReq(overrides = {}) {
      return {
        body: {
          contactId: CONTACT_ID,
          organizationId: ORG_ID,
          role: { roleId: ROLE_ID, roleNumber: '10' },
          facilities: [],
          ...overrides,
        },
      };
    }

    it('returns 404 when the contact does not exist', async () => {
      const res = mockRes();
      getOperation.mockResolvedValue({ value: [] });

      await linkExistingContactWithAnOrg(linkReq(), res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Contact not found.' });
      expect(patchOperationWithObjectId).not.toHaveBeenCalled();
    });

    it('reactivates the contact when linking a deactivated orphaned BCeID', async () => {
      const res = mockRes();
      getOperation.mockResolvedValue({ value: [orphanedContact({ statecode: 1 })] });
      patchOperationWithObjectId.mockResolvedValue({});

      await linkExistingContactWithAnOrg(linkReq(), res);

      expect(patchOperationWithObjectId).toHaveBeenCalledWith('contacts', CONTACT_ID, expect.objectContaining({
        'parentcustomerid_account@odata.bind': `/accounts(${ORG_ID})`,
        statecode: 0,
      }));
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('does not include statecode in the payload when the contact is already active', async () => {
      const res = mockRes();
      getOperation.mockResolvedValue({ value: [orphanedContact({ statecode: 0 })] });
      patchOperationWithObjectId.mockResolvedValue({});

      await linkExistingContactWithAnOrg(linkReq(), res);

      const payload = patchOperationWithObjectId.mock.calls[0][2];
      expect(payload).not.toHaveProperty('statecode');
    });

    it('logs that the contact was reactivated when linking a deactivated BCeID', async () => {
      const res = mockRes();
      getOperation.mockResolvedValue({ value: [orphanedContact({ statecode: 1 })] });
      patchOperationWithObjectId.mockResolvedValue({});

      await linkExistingContactWithAnOrg(linkReq(), res);

      expect(log.info).toHaveBeenCalledWith(
        `Linked orphaned BCeID contact [${CONTACT_ID}] to organization [${ORG_ID}] by user [testadmin] (contact was reactivated)`,
      );
    });
    it('returns 412 without patching when the contact already has an organization', async () => {
      const res = mockRes();
      getOperation.mockResolvedValue({ value: [linkedContact()] });

      await linkExistingContactWithAnOrg(linkReq(), res);

      expect(res.status).toHaveBeenCalledWith(412);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: ALREADY_LINKED_MESSAGE,
        contactId: CONTACT_ID,
        organizationId: OTHER_ORG_ID,
      }));
      expect(patchOperationWithObjectId).not.toHaveBeenCalled();
    });

    it('links an orphaned contact to the organization with the selected role', async () => {
      const res = mockRes();
      getOperation.mockResolvedValue({ value: [orphanedContact()] });
      patchOperationWithObjectId.mockResolvedValue({});

      await linkExistingContactWithAnOrg(linkReq(), res);

      expect(patchOperationWithObjectId).toHaveBeenCalledWith('contacts', CONTACT_ID, expect.objectContaining({
        'parentcustomerid_account@odata.bind': `/accounts(${ORG_ID})`,
        'ccof_ccof_portal_id@odata.bind': `/ofm_portal_roles(${ROLE_ID})`,
      }));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ contactId: CONTACT_ID, organizationId: ORG_ID });
    });

    it('omits the role binding when no role is provided', async () => {
      const res = mockRes();
      getOperation.mockResolvedValue({ value: [orphanedContact()] });
      patchOperationWithObjectId.mockResolvedValue({});

      await linkExistingContactWithAnOrg(linkReq({ role: null }), res);

      const payload = patchOperationWithObjectId.mock.calls[0][2];
      expect(payload['parentcustomerid_account@odata.bind']).toBe(`/accounts(${ORG_ID})`);
      expect(payload).not.toHaveProperty('ccof_ccof_portal_id@odata.bind');
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('creates facility links for facilities not yet linked', async () => {
      const res = mockRes();
      getOperation.mockImplementation((operation) => {
        if (operation.startsWith('contacts?')) {
          return Promise.resolve({ value: [orphanedContact()] });
        }
        if (operation.startsWith('ccof_bceid_organizations?')) {
          return Promise.resolve({ value: [] });
        }
        return Promise.resolve({ value: [] });
      });
      patchOperationWithObjectId.mockResolvedValue({});
      postOperation.mockResolvedValue('link-id');

      await linkExistingContactWithAnOrg(linkReq({ facilities: [FACILITY_ID] }), res);

      expect(deleteOperationWithObjectId).not.toHaveBeenCalled();
      expect(postOperation).toHaveBeenCalledWith('ccof_bceid_organizations', expect.objectContaining({
        'ccof_facility@odata.bind': `/accounts(${FACILITY_ID})`,
        'ccof_BusinessBCeID@odata.bind': `/contacts(${CONTACT_ID})`,
      }));
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('removes facility links that are no longer in the incoming list', async () => {
      const res = mockRes();
      getOperation.mockImplementation((operation) => {
        if (operation.startsWith('contacts?')) {
          return Promise.resolve({ value: [orphanedContact()] });
        }
        if (operation.startsWith('ccof_bceid_organizations?')) {
          return Promise.resolve({
            value: [{ ccof_bceid_organizationid: LINK_ID, _ccof_facility_value: OTHER_FACILITY_ID, statecode: 0 }],
          });
        }
        return Promise.resolve({ value: [] });
      });
      patchOperationWithObjectId.mockResolvedValue({});
      postOperation.mockResolvedValue('link-id');
      deleteOperationWithObjectId.mockResolvedValue({});

      await linkExistingContactWithAnOrg(linkReq({ facilities: [FACILITY_ID] }), res);

      expect(deleteOperationWithObjectId).toHaveBeenCalledWith('ccof_bceid_organizations', LINK_ID);
      expect(postOperation).toHaveBeenCalledWith('ccof_bceid_organizations', expect.objectContaining({
        'ccof_facility@odata.bind': `/accounts(${FACILITY_ID})`,
      }));
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('does not touch facility links when no facilities are provided', async () => {
      const res = mockRes();
      getOperation.mockResolvedValue({ value: [orphanedContact()] });
      patchOperationWithObjectId.mockResolvedValue({});

      await linkExistingContactWithAnOrg(linkReq({ facilities: [] }), res);

      expect(getOperation).toHaveBeenCalledTimes(1);
      expect(postOperation).not.toHaveBeenCalled();
      expect(deleteOperationWithObjectId).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('writes an audit log entry when an orphaned BCeID is linked', async () => {
      const res = mockRes();
      getOperation.mockResolvedValue({ value: [orphanedContact()] });
      patchOperationWithObjectId.mockResolvedValue({});

      await linkExistingContactWithAnOrg(linkReq(), res);

      expect(log.info).toHaveBeenCalledWith(
        `Linked orphaned BCeID contact [${CONTACT_ID}] to organization [${ORG_ID}] by user [testadmin]`,
      );
    });
  });
});
