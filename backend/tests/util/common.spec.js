'use strict';

const moment = require('moment-timezone');
const { getCurrentPacificDate } = require('../../src/util/common');

describe('tzdata (IANA) rulebook', () => {
  // CCOF: BC stops the "fall back". From Nov 1, 2026 onward America/Vancouver
  // must stay on UTC-7 permanently. This requires tzdata 2026b or newer.
  it('ships tzdata 2026b or newer', () => {
    expect(moment.tz.dataVersion.localeCompare('2026b', undefined, { numeric: false })).toBeGreaterThanOrEqual(0);
  });

  it('keeps America/Vancouver on UTC-7 after 2026-11-01 (no fall back)', () => {
    // Old rulebook: UTC-8 (PST) -> this would resolve to 2026-11-01.
    // New rulebook: UTC-7 (PDT) stays -> 2026-11-02.
    expect(moment.tz('2026-11-02T07:59:00Z', 'America/Vancouver').format('YYYY-MM-DD HH:mm')).toBe('2026-11-02 00:59');
  });

  it('stays on permanent daylight time through the following winter (no fall back to UTC-8)', () => {
    // Old (stale) rulebook fell back to UTC-8 (PST) -> 12:00.
    // New rulebook keeps BC on permanent daylight time -> never 12:00/PST again.
    const winter = moment.tz('2027-01-15T20:00:00Z', 'America/Vancouver');
    expect(winter.utcOffset()).toBeGreaterThan(-8 * 60);
    expect(winter.format('YYYY-MM-DD')).toBe('2027-01-15');
  });
});

describe('getCurrentPacificDate', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns an ISO YYYY-MM-DD string', () => {
    expect(getCurrentPacificDate()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('uses the correct Pacific date across the 2026-11 boundary', () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-11-02T07:59:00Z'));
    // Under the stale rulebook this would incorrectly be 2026-11-01.
    expect(getCurrentPacificDate()).toBe('2026-11-02');
  });

  it('returns the correct Pacific date during standard time', () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-03-09T19:30:00Z'));
    expect(getCurrentPacificDate()).toBe('2026-03-09');
  });
});
