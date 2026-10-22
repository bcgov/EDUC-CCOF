'use strict';

jest.mock('../../src/components/utils', () => ({
  getOperationAllPages: jest.fn(),
  buildFilterQuery: jest.fn(),
}));

jest.mock('../../src/components/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  verbose: jest.fn(),
}));

jest.mock('../../src/util/common', () => ({
  restrictFacilities: jest.fn(),
}));

const utils = require('../../src/components/utils');
const log = require('../../src/components/logger');
const { restrictFacilities } = require('../../src/util/common');
const { getPayments } = require('../../src/components/payment');

const { getOperationAllPages, buildFilterQuery } = utils;

const ORG_ID = '778ad039-3ade-ed11-8847-000d3af36bac';
const PY_ID = '9577df98-e0ef-ef11-be20-002248b38a50';

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

function req(overrides = {}) {
  return {
    query: { organizationId: ORG_ID, programYearId: PY_ID },
    ...overrides,
  };
}

function paymentRow(overrides = {}) {
  return {
    ofm_amount: 2850.96,
    ccof_facilityid: 'G-0028110-0001250',
    ofm_invoice_number: 'INV-1',
    _ofm_facility_value: 'facility-guid',
    ccof_monthly_enrollment_report: { ccof_month: 7, ccof_year: 2026 },
    ccof_monthly_ecewe_report: null,
    ofm_facility: { ccof_facilitylicencenumber: 'G-0028110-0001250' },
    ...overrides,
  };
}

describe('payment component getPayments', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    buildFilterQuery.mockReturnValue('$filter=_ofm_organization_value eq 778ad039-3ade-ed11-8847-000d3af36bac');
    restrictFacilities.mockImplementation((request, payments) => payments);
  });

  it('uses getOperationAllPages (not single-page getOperation) with pageSize=500 and returns mapped payments', async () => {
    const res = mockRes();
    getOperationAllPages.mockResolvedValue({ value: [paymentRow()] });

    await getPayments(req(), res);

    expect(getOperationAllPages).toHaveBeenCalledTimes(1);
    const operation = getOperationAllPages.mock.calls[0][0];
    expect(operation).toContain('ofm_payments?$select=');
    expect(operation).toContain('&pageSize=500');
    expect(operation).toContain('$filter=_ofm_organization_value eq 778ad039-3ade-ed11-8847-000d3af36bac');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([expect.objectContaining({ paymentAmount: 2850.96 })]);
  });

  it('merges rows across pages returned by getOperationAllPages', async () => {
    const res = mockRes();
    getOperationAllPages.mockResolvedValue({
      value: [paymentRow({ ofm_amount: 2850.96 }), paymentRow({ ofm_amount: 6718.5 }), paymentRow({ ofm_amount: 1242.47 })],
    });

    await getPayments(req(), res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json.mock.calls[0][0]).toHaveLength(3);
  });

  it('responds with all 5,000 mapped payments from a large payload', async () => {
    const res = mockRes();
    const TOTAL = 5000;
    const rows = Array.from({ length: TOTAL }, (_, i) =>
      paymentRow({ ofm_amount: 100 + i, ofm_invoice_number: `INV-${String(i).padStart(5, '0')}` }),
    );
    getOperationAllPages.mockResolvedValue({ value: rows });

    await getPayments(req(), res);

    expect(getOperationAllPages).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    const payments = res.json.mock.calls[0][0];
    expect(payments).toHaveLength(TOTAL);
    // mapping still correct on the last row, not just the first
    expect(payments[TOTAL - 1].paymentAmount).toBe(100 + TOTAL - 1);
    expect(payments[TOTAL - 1].invoiceNumber).toBe('INV-04999');
    // restrictFacilities received the full set before responding
    const [, mapped] = restrictFacilities.mock.calls[0];
    expect(mapped).toHaveLength(TOTAL);
  });

  it('prefers enrolment report month/year and flattens the facility licence number', async () => {
    const res = mockRes();
    getOperationAllPages.mockResolvedValue({
      value: [
        paymentRow({
          ccof_monthly_enrollment_report: { ccof_month: 7, ccof_year: 2026 },
          ccof_monthly_ecewe_report: { ccof_month: 3, ccof_year: 2025, ccof_report_type: 1 },
        }),
        paymentRow({
          ccof_monthly_enrollment_report: null,
          ccof_monthly_ecewe_report: { ccof_month: 3, ccof_year: 2025, ccof_report_type: 1 },
        }),
      ],
    });

    await getPayments(req(), res);

    const payments = res.json.mock.calls[0][0];
    expect(payments[0].paymentMonth).toBe(7);
    expect(payments[0].paymentYear).toBe(2026);
    expect(payments[1].paymentMonth).toBe(3);
    expect(payments[1].paymentYear).toBe(2025);
    expect(payments[0].facilityId).toBe('facility-guid');
    expect(payments[0].licenceNumber).toBe('G-0028110-0001250');
  });

  it('applies restrictFacilities to the fully collected rows before responding', async () => {
    const res = mockRes();
    const rows = [paymentRow(), paymentRow({ ofm_amount: 1 })];
    getOperationAllPages.mockResolvedValue({ value: rows });
    restrictFacilities.mockReturnValue([rows[1]]);

    await getPayments(req(), res);

    expect(restrictFacilities).toHaveBeenCalledTimes(1);
    const [request, mapped] = restrictFacilities.mock.calls[0];
    expect(request.query).toEqual({ organizationId: ORG_ID, programYearId: PY_ID });
    expect(mapped).toHaveLength(2);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json.mock.calls[0][0]).toHaveLength(1);
  });

  it('returns 200 with an empty array when no payments exist', async () => {
    const res = mockRes();
    getOperationAllPages.mockResolvedValue({ value: [] });

    await getPayments(req(), res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it('returns 500 when getOperationAllPages throws', async () => {
    const res = mockRes();
    const error = { status: 500, data: { message: 'API Get error' } };
    getOperationAllPages.mockRejectedValue(error);

    await getPayments(req(), res);

    expect(log.error).toHaveBeenCalledWith(error);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'API Get error' });
  });
});
