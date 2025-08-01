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

export function capitalize(word) {
  return `${word[0]}${word.slice(1).toLowerCase()}`;
}

/**
 * Returns a formatted string like "December 2024" from a given month and year.
 *
 * @param {number} month - The month number (1 = January, 12 = December)
 * @param {number} year - The full year (e.g., 2025)
 * @returns {string} - A formatted date string like "December 2025"
 */
export function formatMonthYearToString(month, year) {
  const date = moment({ year, month: month - 1 });
  return date.isValid() ? date.format('MMMM YYYY') : null;
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
 *   - A valid date string.
 *
 * Expected Output:
 *   - A formatted date string in the format "YYYY-MM-DD" (e.g., "2025-06-11").
 */
export function formatDateToStandardFormat(date) {
  if (!date) return null;
  return moment(date).format('YYYY-MM-DD');
}
/**
 * Converts a date string to a standardized date string in YYYY-MM-DD HH:mm format.
 *
 *  */
export function formatSubmissionTimestamp(date) {
  if (!date) return null;
  return moment(date).format('YYYY-MM-DD HH:mm');
}
/**
 * Converts a date string to local time and formats it as 'YYYY-MM-DD'.
 *
 *  */
export function formatUTCDateToLocal(date, inputFormat = 'YYYY-MM-DDTHH:mm:ssZ') {
  if (!date) return null;
  return moment.utc(date, inputFormat, true).local().format('YYYY-MM-DD');
}
/**
 * Formats a UTC ISO date string to a short date string (YYYY-MM-DD) in UTC.
 *
 */
export function formatUTCDate(date) {
  if (!date) return null;
  return moment.utc(date).format('YYYY-MM-DD');
}

/**
 * Formats a UTC ISO datetime string to 12-hour local time.
 */
export function formatUTCTimeToLocal(time) {
  if (!time) return null;
  return moment.utc(time).local().format('h:mm A');
}

/**
 * Formats a given decimal number with commas as thousands separators
 * and exactly two digits after the decimal point.
 * - minimumFractionDigits: 2 (pads with zeroes if needed)
 * - maximumFractionDigits: 2 (rounds if more than two decimals)
 *
 * @param {number|string} input - The numeric value to format. Can be a number or a numeric string.
 * @returns {string} A formatted string with comma separators and two decimal digits.
 *
 * @example
 * formatNumber(1000);      // "1,000.00"
 * formatNumber("233.14");  // "233.14"
 * formatNumber(9876543);   // "9,876,543.00"
 */
export function formatDecimalNumber(input) {
  const number = parseFloat(input);
  if (isNaN(number)) return null;
  return number.toLocaleString('en-CA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
