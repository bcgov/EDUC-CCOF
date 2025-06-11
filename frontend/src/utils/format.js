import { isEmpty } from 'lodash';
import moment from 'moment';

import { DateTimeFormatterBuilder, ResolverStyle } from '@js-joda/core';

export function getDateFormatter(pattern) {
  return new DateTimeFormatterBuilder().appendPattern(pattern).toFormatter(ResolverStyle.STRICT);
}

export function is12hFormat(time) {
  return time?.toUpperCase().includes('AM') || time?.toUpperCase().includes('PM');
}

export function formatTime12to24(time12h) {
  if (isEmpty(time12h) || !is12hFormat(time12h)) return time12h;
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  if (hours === '12') {
    hours = '00';
  }
  if (modifier?.toUpperCase() === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }
  return `${hours}:${minutes}`;
}

export function formatTime24to12(time24h) {
  if (isEmpty(time24h) || is12hFormat(time24h)) return time24h;
  let hours = Number(time24h?.split(':')[0]);
  const minutes = time24h?.split(':')[1];
  const ampm = hours >= 12 ? 'pm' : 'am';
  const hours12hFormat = hours % 12 || 12;
  return `${hours12hFormat}:${minutes} ${ampm}`;
}

export function formatFiscalYearName(fiscalYearName) {
  return fiscalYearName?.replace('/', '-').replace(/[^\d-]/g, '');
}

/**
 * Converts a UTC ISO date string to a short date string in the user's local timezone.
 *
 * Expected Input:
 *   - A valid UTC ISO date string (e.g., "2025-11-27T00:00:00Z").
 *
 * Expected Output:
 *   - A formatted date string ignoring the time and timezone (e.g., "Nov 26, 2025").
 */
export function formatUTCDateToShortDateString(date) {
  if (!date) return null;
  return moment.utc(date).format('MMM D, YYYY');
}
/**
 * Converts a date string to a standardized date string in YYYY-MM-DD format.
 *
 * Expected Input:
 *   - A valid date string (e.g., "06/11/2025 18:12:56").
 *
 * Expected Output:
 *   - A formatted date string in the format "YYYY-MM-DD" (e.g., "2025-06-11").
 */
export function formatUTCDateToStandardFormat(date) {
  if (!date) return null;
  return moment(date, 'MM/DD/YYYY HH:mm:ss').format('YYYY-MM-DD');
}
