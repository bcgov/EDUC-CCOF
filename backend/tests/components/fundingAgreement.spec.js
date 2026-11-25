'use strict';

jest.mock('../../src/components/utils', () => ({
  getOperation: jest.fn(),
  patchOperationWithObjectId: jest.fn(),
  getUserGuid: jest.fn(),
  buildFilterQuery: jest.fn(() => '$filter=_ccof_organization_value eq org-id'),
}));

jest.mock('../../src/components/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  verbose: jest.fn(),
}));

const { getOperation } = require('../../src/components/utils');
const { getLatestFundingAgreementActionStatus } = require('../../src/components/fundingAgreement');

const ORG_ID = '778ad039-3ade-ed11-8847-000d3af36bac';
const APPLICATIONS = [{ ccof_applicationid: '11111111-1111-1111-1111-111111111111' }, { ccof_applicationid: '22222222-2222-2222-2222-222222222222' }];
const FOREIGN_APP_ID = '99999999-9999-9999-9999-999999999999';
const PROVIDER_ACTION_REQUIRED = 'Drafted – Provider Action Required';
const ACTIVE = 'Active';

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

function fundingAgreementRow(id, term, version, externalStatusText) {
  return {
    ccof_funding_agreementid: id,
    ccof_version: version,
    'ccof_external_portal_status@OData.Community.Display.V1.FormattedValue': externalStatusText,
    _ccof_programyear_value: `py-${term}`,
    '_ccof_programyear_value@OData.Community.Display.V1.FormattedValue': term,
  };
}

function mockDynamics({ fundingAgreements = [], applications = [], changeRequests = [] }) {
  getOperation.mockImplementation((operation) => {
    if (operation.startsWith('ccof_funding_agreements')) return Promise.resolve({ value: fundingAgreements });
    if (operation.startsWith('ccof_applications')) return Promise.resolve({ value: applications });
    if (operation.startsWith('ccof_change_requests')) return Promise.resolve({ value: changeRequests });
    return Promise.resolve({ value: [] });
  });
}

const getQuery = (prefix) => getOperation.mock.calls.map(([op]) => op).find((op) => op.startsWith(prefix));

describe('getLatestFundingAgreementActionStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the latest FA by term, then highest version', async () => {
    mockDynamics({
      fundingAgreements: [
        fundingAgreementRow('fa-2024-00', '2024-25 FY', 0, ACTIVE),
        fundingAgreementRow('fa-2025-00', '2025-26 FY', 0, ACTIVE),
        fundingAgreementRow('fa-2025-01', '2025-26 FY', 1, PROVIDER_ACTION_REQUIRED),
      ],
    });
    const res = mockRes();
    await getLatestFundingAgreementActionStatus({ query: { organizationId: ORG_ID } }, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      fundingAgreementId: 'fa-2025-01',
      fundingAgreementOrderNumber: 1,
      programYearId: 'py-2025-26 FY',
      isProviderActionRequired: true,
      hasSubmittedChangeRequest: false,
    });
  });

  it('flags when the latest FA is not in Provider Action Required status', async () => {
    mockDynamics({
      fundingAgreements: [fundingAgreementRow('fa-2024-01', '2024-25 FY', 1, PROVIDER_ACTION_REQUIRED), fundingAgreementRow('fa-2025-00', '2025-26 FY', 0, ACTIVE)],
    });
    const res = mockRes();
    await getLatestFundingAgreementActionStatus({ query: { organizationId: ORG_ID } }, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ fundingAgreementId: 'fa-2025-00', isProviderActionRequired: false }));
  });

  it('ignores FAs before 2024', async () => {
    mockDynamics({ fundingAgreements: [fundingAgreementRow('fa-2023-00', '2023-24 FY', 0, PROVIDER_ACTION_REQUIRED)] });
    const res = mockRes();
    await getLatestFundingAgreementActionStatus({ query: { organizationId: ORG_ID } }, res);

    expect(res.json).toHaveBeenCalledWith({
      fundingAgreementId: null,
      fundingAgreementOrderNumber: null,
      programYearId: null,
      isProviderActionRequired: false,
      hasSubmittedChangeRequest: false,
    });
  });

  it("reports a submitted change request using the organization's own applications", async () => {
    mockDynamics({
      fundingAgreements: [fundingAgreementRow('fa-2025-01', '2025-26 FY', 1, PROVIDER_ACTION_REQUIRED)],
      applications: APPLICATIONS,
      changeRequests: [{ ccof_change_requestid: 'cr-1' }],
    });
    const res = mockRes();
    await getLatestFundingAgreementActionStatus({ query: { organizationId: ORG_ID } }, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ hasSubmittedChangeRequest: true }));
    expect(getQuery('ccof_applications')).toContain(`_ccof_organization_value eq ${ORG_ID}`);
    const changeRequestQuery = getQuery('ccof_change_requests');
    expect(changeRequestQuery).toContain('ccof_externalstatus eq 2');
    expect(changeRequestQuery).toContain("PropertyValues=['11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222']");
  });

  it('ignores applicationIds sent by the caller', async () => {
    mockDynamics({ applications: APPLICATIONS });
    const res = mockRes();
    await getLatestFundingAgreementActionStatus({ query: { organizationId: ORG_ID, applicationIds: FOREIGN_APP_ID } }, res);

    expect(getQuery('ccof_change_requests')).not.toContain(FOREIGN_APP_ID);
  });

  it('skips the change request lookup when the organization has no applications', async () => {
    mockDynamics({ fundingAgreements: [] });
    const res = mockRes();
    await getLatestFundingAgreementActionStatus({ query: { organizationId: ORG_ID } }, res);

    expect(getQuery('ccof_change_requests')).toBeUndefined();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ hasSubmittedChangeRequest: false }));
  });

  it('returns 500 when Dynamics fails', async () => {
    getOperation.mockRejectedValue({ status: 500 });
    const res = mockRes();
    await getLatestFundingAgreementActionStatus({ query: { organizationId: ORG_ID } }, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
