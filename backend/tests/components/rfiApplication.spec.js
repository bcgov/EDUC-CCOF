'use strict';

jest.mock('../../src/components/utils', () => ({
  sleep: jest.fn(),
  getOperation: jest.fn(),
  postOperation: jest.fn(),
  postOperationsInBatches: jest.fn(),
  patchOperationWithObjectId: jest.fn(),
  deleteOperationWithObjectId: jest.fn(),
}));

jest.mock('../../src/components/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  verbose: jest.fn(),
}));

const utils = require('../../src/components/utils');
const { getRfiApplicationByCcfriId, getRFIApplication, updateRFIApplication, createRFIApplication } = require('../../src/components/rfiApplication');

const { getOperation, postOperation, postOperationsInBatches, patchOperationWithObjectId, deleteOperationWithObjectId } = utils;

const CCFRI_ID = '11111111-1111-1111-1111-111111111111';
const RFI_ID = '22222222-2222-2222-2222-222222222222';
const NEW_RFI_ID = '33333333-3333-3333-3333-333333333333';
const EXPENSE_ID_1 = '44444444-4444-4444-4444-444444444444';
const EXPENSE_ID_2 = '55555555-5555-5555-5555-555555555555';

const INCLUSION_ENTITY = 'ccof_rfipfiserviceexpansioninclusions';
const INCLUSION_ID = 'ccof_rfipfiserviceexpansioninclusionid';
const INCLUSION_PARENT_FILTER = '_ccof_rfiparentfeeincrease_inclusion_value';
const INCLUSION_BIND = 'ccof_RFIParentFeeIncrease_Inclusion@odata.bind';

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

function rfiRecord(overrides = {}) {
  return {
    ccof_rfipfiid: RFI_ID,
    _ccof_applicationccfri_value: CCFRI_ID,
    statuscode: 1,
    ccof_feeincreasedduetoanexceptionalcircumstance: 0,
    ccof_feeincreasedduetoaincreasedconnection: 0,
    ccof_rfi_pfi_other_funding_RFI_PFI: [],
    ccof_rfipfi_ccof_rfipfi_IndegenousService: [],
    ...overrides,
  };
}

function inclusionExpenseRecord(overrides = {}) {
  return {
    [INCLUSION_ID]: EXPENSE_ID_1,
    ccof_expensedescription: 'Adaptive equipment',
    ccof_date: '2027-05-10T00:00:00Z',
    ccof_paymentfrequency: 'One-time',
    ccof_amount: 1500,
    statecode: 0,
    ...overrides,
  };
}

// the inclusion entity name also starts with 'ccof_rfipfis', so match it first
function mockGetRfi(rfi, inclusionExpenses = []) {
  getOperation.mockImplementation((query) => {
    if (query.startsWith(INCLUSION_ENTITY)) return Promise.resolve({ value: inclusionExpenses });
    if (query.startsWith('ccof_rfipfis?')) return Promise.resolve({ value: rfi ? [rfi] : [] });
    return Promise.resolve({ value: [] });
  });
}

describe('rfiApplication component - PSE Inclusion', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRfiApplicationByCcfriId', () => {
    it('returns an empty object and does not query inclusion expenses when no RFI exists', async () => {
      mockGetRfi(null);

      const result = await getRfiApplicationByCcfriId(CCFRI_ID);

      expect(result).toEqual({});
      expect(getOperation).toHaveBeenCalledTimes(1);
      expect(getOperation.mock.calls[0][0]).not.toContain(INCLUSION_ENTITY);
    });

    it('maps all PSE Inclusion question fields to the front end (template V4 RFI)', async () => {
      mockGetRfi(
        rfiRecord({
          ccof_pseinclusioneligibleexpenseandpolicy: 1,
          ccof_pseinclusionbusinesscase: 'Business case text',
          ccof_pseinclusionparentfeescope: 101510001,
          ccof_pseinclusionstaffexpenses: 1,
          ccof_pseinclusionstaffingexplanation: 'Staffing model text',
        }),
      );

      const result = await getRfiApplicationByCcfriId(CCFRI_ID);

      expect(result.data).toEqual(
        expect.objectContaining({
          rfiId: RFI_ID,
          inclusionEligibleExpenseAndPolicy: 1,
          inclusionBusinessCase: 'Business case text',
          inclusionParentFeeScope: 101510001,
          inclusionStaffExpenses: 1,
          inclusionStaffingExplanation: 'Staffing model text',
        }),
      );
    });

    it('keeps a "No" (0) answer for the inclusion yes/no questions', async () => {
      mockGetRfi(rfiRecord({ ccof_pseinclusioneligibleexpenseandpolicy: 0, ccof_pseinclusionstaffexpenses: 0 }));

      const result = await getRfiApplicationByCcfriId(CCFRI_ID);

      expect(result.data.inclusionEligibleExpenseAndPolicy).toBe(0);
      expect(result.data.inclusionStaffExpenses).toBe(0);
    });

    it('maps null inclusion answers as null (question not answered yet)', async () => {
      mockGetRfi(rfiRecord({ ccof_pseinclusioneligibleexpenseandpolicy: null, ccof_pseinclusionparentfeescope: null }));

      const result = await getRfiApplicationByCcfriId(CCFRI_ID);

      expect(result.data.inclusionEligibleExpenseAndPolicy).toBeNull();
      expect(result.data.inclusionParentFeeScope).toBeNull();
    });

    it('does not add inclusion question fields for an older (template V3) RFI that has none', async () => {
      mockGetRfi(rfiRecord());

      const result = await getRfiApplicationByCcfriId(CCFRI_ID);

      expect(result.data).not.toHaveProperty('inclusionEligibleExpenseAndPolicy');
      expect(result.data).not.toHaveProperty('inclusionBusinessCase');
      expect(result.data).not.toHaveProperty('inclusionParentFeeScope');
      expect(result.data).not.toHaveProperty('inclusionStaffExpenses');
      expect(result.data).not.toHaveProperty('inclusionStaffingExplanation');
      expect(result.data.inclusionExpenseList).toEqual([]);
    });

    it('queries only active inclusion expenses for the RFI by the inclusion lookup', async () => {
      mockGetRfi(rfiRecord());

      await getRfiApplicationByCcfriId(CCFRI_ID);

      const inclusionQuery = getOperation.mock.calls.map((call) => call[0]).find((q) => q.startsWith(INCLUSION_ENTITY));
      expect(inclusionQuery).toBe(`${INCLUSION_ENTITY}?$filter=(${INCLUSION_PARENT_FILTER} eq ${RFI_ID} and statecode eq 0)`);
    });

    it('maps inclusion expense rows to the front end and strips the time from the date', async () => {
      mockGetRfi(rfiRecord(), [
        inclusionExpenseRecord(),
        inclusionExpenseRecord({ [INCLUSION_ID]: EXPENSE_ID_2, ccof_expensedescription: 'Training', ccof_date: '2027-06-01T07:00:00Z', ccof_paymentfrequency: 'Monthly', ccof_amount: 200 }),
      ]);

      const result = await getRfiApplicationByCcfriId(CCFRI_ID);

      expect(result.data.inclusionExpenseList).toEqual([
        { id: EXPENSE_ID_1, description: 'Adaptive equipment', date: '2027-05-10', frequency: 'One-time', expense: 1500 },
        { id: EXPENSE_ID_2, description: 'Training', date: '2027-06-01', frequency: 'Monthly', expense: 200 },
      ]);
    });

    it('keeps an inclusion expense with no date as-is', async () => {
      mockGetRfi(rfiRecord(), [inclusionExpenseRecord({ ccof_date: null })]);

      const result = await getRfiApplicationByCcfriId(CCFRI_ID);

      expect(result.data.inclusionExpenseList[0].date).toBeNull();
    });

    it('returns an empty inclusion expense list when the RFI has no inclusion expenses', async () => {
      mockGetRfi(rfiRecord(), []);

      const result = await getRfiApplicationByCcfriId(CCFRI_ID);

      expect(result.data.inclusionExpenseList).toEqual([]);
    });

    it('still returns the existing Indigenous expense list alongside the inclusion list', async () => {
      mockGetRfi(
        rfiRecord({
          ccof_rfipfi_ccof_rfipfi_IndegenousService: [
            {
              ccof_rfipfiserviceexpansionindigenouscommunityid: 'indig-1',
              ccof_expensedescription: 'Elder visit',
              ccof_date: '2027-04-02T00:00:00Z',
              ccof_paymentfrequency: 'Weekly',
              ccof_amount: 50,
            },
          ],
        }),
        [inclusionExpenseRecord()],
      );

      const result = await getRfiApplicationByCcfriId(CCFRI_ID);

      expect(result.data.indigenousExpenseList).toEqual([{ id: 'indig-1', description: 'Elder visit', date: '2027-04-02', frequency: 'Weekly', expense: 50 }]);
      expect(result.data.inclusionExpenseList).toHaveLength(1);
    });
  });

  describe('getRFIApplication', () => {
    it('responds 200 with the RFI including the inclusion expense list', async () => {
      mockGetRfi(rfiRecord(), [inclusionExpenseRecord()]);
      const res = mockRes();

      await getRFIApplication({ params: { ccfriId: CCFRI_ID } }, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const body = res.json.mock.calls[0][0];
      expect(body.data.inclusionExpenseList).toHaveLength(1);
    });

    it('responds 500 when the inclusion expense query fails', async () => {
      getOperation.mockImplementation((query) => {
        if (query.startsWith(INCLUSION_ENTITY)) return Promise.reject({ status: 500, data: 'dynamics error' });
        return Promise.resolve({ value: [rfiRecord()] });
      });
      const res = mockRes();

      await getRFIApplication({ params: { ccfriId: CCFRI_ID } }, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith('dynamics error');
    });
  });

  describe('updateRFIApplication', () => {
    function updateReq(body) {
      return { params: { rfipfiid: RFI_ID }, body: { ccfriApplicationId: CCFRI_ID, ...body } };
    }

    beforeEach(() => {
      patchOperationWithObjectId.mockResolvedValue({});
      getOperation.mockResolvedValue({ value: [] });
      postOperationsInBatches.mockResolvedValue();
      deleteOperationWithObjectId.mockResolvedValue();
    });

    it('patches the RFI with the PSE Inclusion question fields mapped to CMS names', async () => {
      const res = mockRes();

      await updateRFIApplication(
        updateReq({
          inclusionEligibleExpenseAndPolicy: 1,
          inclusionBusinessCase: 'Business case',
          inclusionParentFeeScope: 101510000,
          inclusionStaffExpenses: 0,
          inclusionStaffingExplanation: null,
        }),
        res,
      );

      expect(patchOperationWithObjectId).toHaveBeenCalledWith(
        'ccof_rfipfis',
        RFI_ID,
        expect.objectContaining({
          ccof_pseinclusioneligibleexpenseandpolicy: 1,
          ccof_pseinclusionbusinesscase: 'Business case',
          ccof_pseinclusionparentfeescope: 101510000,
          ccof_pseinclusionstaffexpenses: 0,
          ccof_pseinclusionstaffingexplanation: null,
        }),
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('never sends the inclusion expense list as a field of the RFI record', async () => {
      await updateRFIApplication(updateReq({ inclusionExpenseList: [{ description: 'x', date: '2027-05-10', frequency: 'Daily', expense: 1 }] }), mockRes());

      const rfiPatch = patchOperationWithObjectId.mock.calls.find((call) => call[0] === 'ccof_rfipfis')[2];
      expect(rfiPatch).not.toHaveProperty('inclusionExpenseList');
    });

    it('does not touch inclusion expenses when the list is not sent (unchanged on the front end)', async () => {
      await updateRFIApplication(updateReq({ inclusionEligibleExpenseAndPolicy: 0 }), mockRes());

      expect(getOperation).not.toHaveBeenCalledWith(expect.stringContaining(INCLUSION_ENTITY));
      expect(postOperationsInBatches).not.toHaveBeenCalledWith(INCLUSION_ENTITY, expect.anything());
    });

    it('replaces existing inclusion expenses: deletes old rows and posts new rows linked to the RFI', async () => {
      getOperation.mockResolvedValue({ value: [{ [INCLUSION_ID]: EXPENSE_ID_1 }, { [INCLUSION_ID]: EXPENSE_ID_2 }] });

      await updateRFIApplication(
        updateReq({
          inclusionExpenseList: [
            { id: 'temp-1', description: 'Ramp', date: '2027-05-10', frequency: 'One-time', expense: 900 },
            { id: EXPENSE_ID_1, description: 'Aide', date: '2027/06/15', frequency: 'Monthly', expense: 300 },
          ],
        }),
        mockRes(),
      );

      expect(getOperation).toHaveBeenCalledWith(`${INCLUSION_ENTITY}?$select=${INCLUSION_ID}&$filter=(${INCLUSION_PARENT_FILTER} eq ${RFI_ID})`);
      expect(deleteOperationWithObjectId).toHaveBeenCalledWith(INCLUSION_ENTITY, EXPENSE_ID_1);
      expect(deleteOperationWithObjectId).toHaveBeenCalledWith(INCLUSION_ENTITY, EXPENSE_ID_2);
      expect(postOperationsInBatches).toHaveBeenCalledWith(INCLUSION_ENTITY, [
        {
          [INCLUSION_ID]: 'temp-1',
          ccof_expensedescription: 'Ramp',
          ccof_date: '2027-05-10T12:00:00.000Z',
          ccof_paymentfrequency: 'One-time',
          ccof_amount: 900,
          [INCLUSION_BIND]: `/ccof_rfipfis(${RFI_ID})`,
        },
        {
          [INCLUSION_ID]: EXPENSE_ID_1,
          ccof_expensedescription: 'Aide',
          ccof_date: '2027-06-15T12:00:00.000Z',
          ccof_paymentfrequency: 'Monthly',
          ccof_amount: 300,
          [INCLUSION_BIND]: `/ccof_rfipfis(${RFI_ID})`,
        },
      ]);
    });

    it('deletes old rows before posting new ones', async () => {
      getOperation.mockResolvedValue({ value: [{ [INCLUSION_ID]: EXPENSE_ID_1 }] });

      await updateRFIApplication(updateReq({ inclusionExpenseList: [{ description: 'Ramp', date: '2027-05-10', frequency: 'Daily', expense: 1 }] }), mockRes());

      const deleteOrder = deleteOperationWithObjectId.mock.invocationCallOrder[0];
      const postOrder = postOperationsInBatches.mock.invocationCallOrder[0];
      expect(deleteOrder).toBeLessThan(postOrder);
    });

    it('removes all inclusion expenses when an empty list is sent (all rows removed by the provider)', async () => {
      getOperation.mockResolvedValue({ value: [{ [INCLUSION_ID]: EXPENSE_ID_1 }] });

      await updateRFIApplication(updateReq({ inclusionExpenseList: [] }), mockRes());

      expect(deleteOperationWithObjectId).toHaveBeenCalledWith(INCLUSION_ENTITY, EXPENSE_ID_1);
      expect(postOperationsInBatches).toHaveBeenCalledWith(INCLUSION_ENTITY, []);
    });

    it('sends a null date to CMS when the inclusion expense date is empty or invalid', async () => {
      await updateRFIApplication(
        updateReq({
          inclusionExpenseList: [
            { description: 'No date', date: undefined, frequency: 'Daily', expense: 1 },
            { description: 'Bad date', date: 'not-a-date', frequency: 'Daily', expense: 1 },
          ],
        }),
        mockRes(),
      );

      const posted = postOperationsInBatches.mock.calls.find((call) => call[0] === INCLUSION_ENTITY)[1];
      expect(posted[0].ccof_date).toBeNull();
      expect(posted[1].ccof_date).toBeNull();
    });

    it('saves the inclusion list independently of the other RFI lists', async () => {
      await updateRFIApplication(
        updateReq({
          indigenousExpenseList: [{ description: 'Elder', date: '2027-05-10', frequency: 'Daily', expense: 1 }],
          inclusionExpenseList: [{ description: 'Ramp', date: '2027-05-10', frequency: 'Daily', expense: 2 }],
        }),
        mockRes(),
      );

      expect(postOperationsInBatches).toHaveBeenCalledWith('ccof_rfipfiserviceexpansionindigenouscommunities', [expect.objectContaining({ ccof_expensedescription: 'Elder' })]);
      expect(postOperationsInBatches).toHaveBeenCalledWith(INCLUSION_ENTITY, [expect.objectContaining({ ccof_expensedescription: 'Ramp' })]);
    });

    it('responds 500 when saving inclusion expenses fails', async () => {
      postOperationsInBatches.mockRejectedValue({ status: 400, data: 'bad request' });
      const res = mockRes();

      await updateRFIApplication(updateReq({ inclusionExpenseList: [{ description: 'Ramp', date: '2027-05-10', frequency: 'Daily', expense: 2 }] }), res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith('bad request');
    });
  });

  describe('createRFIApplication', () => {
    function createReq(body) {
      return { params: { ccfriId: CCFRI_ID }, body: { isRfiComplete: false, ...body } };
    }

    beforeEach(() => {
      postOperation.mockResolvedValue(NEW_RFI_ID);
      patchOperationWithObjectId.mockResolvedValue({});
      getOperation.mockResolvedValue({ value: [] });
      postOperationsInBatches.mockResolvedValue();
    });

    it('creates the RFI with the PSE Inclusion question fields and without the expense list', async () => {
      const res = mockRes();

      await createRFIApplication(
        createReq({
          inclusionEligibleExpenseAndPolicy: 1,
          inclusionBusinessCase: 'Business case',
          inclusionParentFeeScope: 101510001,
          inclusionStaffExpenses: 1,
          inclusionStaffingExplanation: 'Staffing',
          inclusionExpenseList: [{ description: 'Ramp', date: '2027-05-10', frequency: 'One-time', expense: 900 }],
        }),
        res,
      );

      const createdRfi = postOperation.mock.calls[0][1];
      expect(postOperation.mock.calls[0][0]).toBe('ccof_rfipfis');
      expect(createdRfi).toEqual(
        expect.objectContaining({
          ccof_pseinclusioneligibleexpenseandpolicy: 1,
          ccof_pseinclusionbusinesscase: 'Business case',
          ccof_pseinclusionparentfeescope: 101510001,
          ccof_pseinclusionstaffexpenses: 1,
          ccof_pseinclusionstaffingexplanation: 'Staffing',
          'ccof_ApplicationCCFRI@odata.bind': `/ccof_applicationccfris(${CCFRI_ID})`,
        }),
      );
      expect(createdRfi).not.toHaveProperty('inclusionExpenseList');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ friApplicationGuid: NEW_RFI_ID });
    });

    it('posts the inclusion expenses linked to the newly created RFI', async () => {
      await createRFIApplication(createReq({ inclusionExpenseList: [{ description: 'Ramp', date: '2027-05-10', frequency: 'One-time', expense: 900 }] }), mockRes());

      expect(postOperationsInBatches).toHaveBeenCalledWith(INCLUSION_ENTITY, [
        {
          ccof_expensedescription: 'Ramp',
          ccof_date: '2027-05-10T12:00:00.000Z',
          ccof_paymentfrequency: 'One-time',
          ccof_amount: 900,
          [INCLUSION_BIND]: `/ccof_rfipfis(${NEW_RFI_ID})`,
        },
      ]);
      expect(postOperation.mock.invocationCallOrder[0]).toBeLessThan(postOperationsInBatches.mock.invocationCallOrder[0]);
    });

    it('does not post inclusion expenses when the list is empty', async () => {
      await createRFIApplication(createReq({ inclusionExpenseList: [] }), mockRes());

      expect(getOperation).not.toHaveBeenCalled();
      expect(postOperationsInBatches).not.toHaveBeenCalled();
    });

    it('does not post inclusion expenses for an older (template V3) RFI that sends no list', async () => {
      const res = mockRes();

      await createRFIApplication(createReq({ exceptionalCircumstances: 0 }), res);

      expect(postOperationsInBatches).not.toHaveBeenCalled();
      expect(postOperation.mock.calls[0][1]).not.toHaveProperty('ccof_pseinclusioneligibleexpenseandpolicy');
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('responds 500 when creating the RFI fails and does not post inclusion expenses', async () => {
      postOperation.mockRejectedValue({ status: 500, data: 'create failed' });
      const res = mockRes();

      await createRFIApplication(createReq({ inclusionExpenseList: [{ description: 'Ramp', date: '2027-05-10', frequency: 'Daily', expense: 1 }] }), res);

      expect(postOperationsInBatches).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
