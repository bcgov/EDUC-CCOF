'use strict';

jest.mock('axios');
jest.mock('../../src/config/index', () => ({
  get: jest.fn().mockReturnValue('https://d365.example.com'),
}));
jest.mock('../../src/components/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  verbose: jest.fn(),
}));

const axios = require('axios');
const config = require('../../src/config/index');
const log = require('../../src/components/logger');
const { getOperationAllPages } = require('../../src/components/utils');

const OPERATION = 'ofm_payments?$select=ofm_amount&$filter=_ofm_organization_value eq 111&pageSize=500';
// D365 nextLinks are percent-encoded; the converter must round-trip them without double-decoding
const PAGE_2_STATEMENT =
  'ofm_payments?$select=ofm_amount&$filter=_ofm_organization_value%20eq%20111&pageSize=500&$skiptoken=%3Ccookie%20msprop%3D%22x%22%3E5%3C%2Fcookie%3E';

function nextLink(statement) {
  return `https://d365.example.com/api/data/v9.2/${statement}`;
}

function page(rows, statementOrNextLink) {
  const data = { value: rows };
  if (statementOrNextLink) {
    // pass through absolute URLs (for the unrecognized-host case); wrap statements in the D365 prefix
    data['@odata.nextLink'] = /^https?:\/\//.test(statementOrNextLink) ? statementOrNextLink : nextLink(statementOrNextLink);
  }
  return { data };
}

function statementOf(callIndex) {
  const url = axios.get.mock.calls[callIndex][0];
  return url.substring(url.indexOf('statement=') + 'statement='.length);
}

describe('getOperationAllPages', () => {
  beforeEach(() => {
    // reset (not clear) so leftover mockResolvedValueOnce queues from prior tests are dropped
    jest.resetAllMocks();
    config.get.mockReturnValue('https://d365.example.com');
  });

  it('performs a single call when there is no nextLink (current getOperation behavior)', async () => {
    axios.get.mockResolvedValueOnce(page([{ ofm_amount: 1 }, { ofm_amount: 2 }]));

    const result = await getOperationAllPages(OPERATION);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith('https://d365.example.com/api/Operations?statement=' + OPERATION, expect.any(Object));
    expect(result).toEqual({ value: [{ ofm_amount: 1 }, { ofm_amount: 2 }] });
    expect(log.warn).not.toHaveBeenCalled();
    expect(log.info).toHaveBeenCalledWith('getOperationAllPages complete', { pages: 1, rows: 2 });
  });

  it('follows nextLink and merges rows from page 2', async () => {
    const page2 = PAGE_2_STATEMENT;
    axios.get
      .mockResolvedValueOnce(page([{ ofm_amount: 1 }], page2))
      .mockResolvedValueOnce(page([{ ofm_amount: 999 }]));

    const result = await getOperationAllPages(OPERATION);

    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(statementOf(1)).toBe(page2);
    expect(result.value).toEqual([{ ofm_amount: 1 }, { ofm_amount: 999 }]);
    expect(log.warn).not.toHaveBeenCalled();
    expect(log.info).toHaveBeenCalledWith('getOperationAllPages complete', { pages: 2, rows: 2 });
  });

  it('follows nextLink across 3+ pages until exhausted', async () => {
    axios.get
      .mockResolvedValueOnce(page([{ ofm_amount: 1 }], 'ofm_payments?$skiptoken=page2'))
      .mockResolvedValueOnce(page([{ ofm_amount: 2 }], 'ofm_payments?$skiptoken=page3'))
      .mockResolvedValueOnce(page([{ ofm_amount: 3 }]));

    const result = await getOperationAllPages(OPERATION);

    expect(axios.get).toHaveBeenCalledTimes(3);
    expect(statementOf(1)).toBe('ofm_payments?$skiptoken=page2');
    expect(statementOf(2)).toBe('ofm_payments?$skiptoken=page3');
    expect(result.value).toEqual([{ ofm_amount: 1 }, { ofm_amount: 2 }, { ofm_amount: 3 }]);
    expect(log.info).toHaveBeenCalledWith('getOperationAllPages complete', { pages: 3, rows: 3 });
  });

  it('merges 5,000 rows across 10 pages of 500 until exhausted', async () => {
    const TOTAL_PAGES = 10;
    const PAGE_SIZE = 500;

    // chain nextLink statements the way D365 does: each response points at the next page
    for (let i = 1; i <= TOTAL_PAGES; i++) {
      const rows = Array.from({ length: PAGE_SIZE }, (_, r) => ({ ofm_amount: i * 1000 + r }));
      const hasNext = i < TOTAL_PAGES;
      axios.get.mockResolvedValueOnce(page(rows, hasNext ? `ofm_payments?$skiptoken=page${i + 1}` : null));
    }

    const result = await getOperationAllPages(OPERATION);

    expect(axios.get).toHaveBeenCalledTimes(TOTAL_PAGES);
    // every call after the first must carry the statement from the previous nextLink
    for (let i = 1; i < TOTAL_PAGES; i++) {
      expect(statementOf(i)).toBe(`ofm_payments?$skiptoken=page${i + 1}`);
    }
    expect(result.value).toHaveLength(5000);
    // order preserved: first row of page 1, last row of page 10
    expect(result.value[0]).toEqual({ ofm_amount: 1000 });
    expect(result.value[4999]).toEqual({ ofm_amount: 10000 + (PAGE_SIZE - 1) });
    expect(log.warn).not.toHaveBeenCalled();
    expect(log.info).toHaveBeenCalledWith('getOperationAllPages complete', { pages: 10, rows: 5000 });
  });

  it('preserves URL encoding of the skiptoken when converting nextLink', async () => {
    axios.get
      .mockResolvedValueOnce(page([], PAGE_2_STATEMENT))
      .mockResolvedValueOnce(page([]));

    await getOperationAllPages(OPERATION);

    expect(statementOf(1)).toContain('%3Ccookie%20msprop%3D%22x%22%3E5%3C%2Fcookie%3E');
    expect(statementOf(1)).not.toContain('<cookie');
  });

  it('stops at maxPages and warns when nextLink never ends', async () => {
    for (let i = 0; i < 60; i++) {
      axios.get.mockResolvedValueOnce(page([{ ofm_amount: i }], 'ofm_payments?$skiptoken=page' + i));
    }

    const result = await getOperationAllPages(OPERATION, 5);

    expect(axios.get).toHaveBeenCalledTimes(5);
    expect(result.value).toHaveLength(5);
    expect(log.warn).toHaveBeenCalledWith('getOperationAllPages: page limit reached, returning partial results', {
      operation: OPERATION,
      maxPages: 5,
      rows: 5,
    });
  });

  it('stops and returns partial results when nextLink format is unrecognized', async () => {
    axios.get.mockResolvedValueOnce(page([{ ofm_amount: 1 }], 'https://unexpected.example.com/some/other/path?x=1'));

    const result = await getOperationAllPages(OPERATION);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(result.value).toEqual([{ ofm_amount: 1 }]);
    expect(log.warn).toHaveBeenCalledWith('getOperationAllPages: unparseable nextLink, returning partial results', { pages: 1, rows: 1 });
  });

  it('throws an ApiError when a subsequent page request fails', async () => {
    axios.get
      .mockResolvedValueOnce(page([{ ofm_amount: 1 }], 'ofm_payments?$skiptoken=page2'))
      .mockRejectedValueOnce({ response: { status: 500 } });

    await expect(getOperationAllPages(OPERATION)).rejects.toMatchObject({
      status: 500,
      data: { message: 'API Get error' },
    });
    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(log.error).toHaveBeenCalledWith('getOperationAllPages Error', 500);
  });

  it('throws an ApiError when the first request fails', async () => {
    axios.get.mockRejectedValueOnce({ message: 'network down' });

    await expect(getOperationAllPages(OPERATION)).rejects.toMatchObject({
      data: { message: 'API Get error' },
    });
    expect(log.error).toHaveBeenCalledWith('getOperationAllPages Error', 'network down');
  });

  it('tolerates a response without a value array', async () => {
    axios.get.mockResolvedValueOnce({ data: {} });

    const result = await getOperationAllPages(OPERATION);

    expect(result).toEqual({ value: [] });
    expect(log.info).toHaveBeenCalledWith('getOperationAllPages complete', { pages: 1, rows: 0 });
  });

  it('strips control characters (CR/LF) from logged URLs to prevent log injection', async () => {
    axios.get.mockResolvedValueOnce(page([]));

    await getOperationAllPages('ofm_payments?$select=ofm_amount\r\nsecond log line');

    const dataUrlLog = log.info.mock.calls.find((call) => call[0] === 'getOperationAllPages Data Url');
    expect(dataUrlLog[1]).not.toMatch(/[\r\n]/);
    // line breaks are removed but the text itself is preserved (no data loss, no forged line)
    expect(dataUrlLog[1]).toContain('ofm_amountsecond log line');
  });

  it('truncates overlong logged values to 2000 characters', async () => {
    axios.get.mockResolvedValueOnce(page([]));

    await getOperationAllPages('ofm_payments?$select=' + 'a'.repeat(5000));

    const dataUrlLog = log.info.mock.calls.find((call) => call[0] === 'getOperationAllPages Data Url');
    expect(dataUrlLog[1].length).toBeLessThanOrEqual(2000);
  });
});
