import { isEmpty } from 'lodash';
import moment from 'moment';

import { padString } from '@/utils/common.js';
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
export function formatDecimalNumber(input, useCommas = true) {
  const number = parseFloat(input);
  if (isNaN(number)) return null;
  return number.toLocaleString('en-CA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: useCommas,
  });
}

/**
 * Formats input into a number rounded to the specified decimal places.
 *
 * @param {string|number} input
 * @param {number} [decimalPlaces=2]
 * @returns {number|null} Rounded number, or null if invalid.
 */
export function formatDecimalNumberToNumber(input, decimalPlaces = 2) {
  if (input == null) return null;
  const number = typeof input === 'number' ? input : Number(input);
  if (!Number.isFinite(number)) return null;
  return Number(number.toFixed(decimalPlaces));
}

/**
 * Formats a value as a localized Canadian currency string (CAD).
 *
 * - Uses Intl.NumberFormat with the "en-CA" locale and accounting-style currency.
 * - Always displays two decimal places and applies thousands separators.
 * - Formats negative values using parentheses (e.g., ($6.28)).
 * - Treats null or undefined values as 0.
 *
 * Examples:
 *   formatCurrency(1345489.6568) => "$1,345,489.66"
 *   formatCurrency(-6.28)        => "($6.28)"
 *   formatCurrency(0)            => "$0.00"
 *   formatCurrency(null)         => "$0.00"
 */
export function formatCurrency(value) {
  const amount = Number(value ?? 0);
  if (Number.isNaN(amount)) return null;
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    currencySign: 'accounting',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Converts a comma-separated string into an array of numbers.
 * Example:
 *   "1, 2, 3" => [1, 2, 3]
 *   null or "" => []
 */
export function formatStringToNumberList(str) {
  if (!str) return [];
  return str.split(',').map((x) => Number(x.trim()));
}
/**
 * Converts a date value to "Month YYYY" format (e.g., "November 2025").
 *
 * Expected input formats:
 *   - Full ISO date strings (e.g., "2025-11-25T23:37:40Z")
 *   - Date-only strings (e.g., "2025-09-13")
 *   - Year-month strings (e.g., "2025-09")
 *
 * Expected Output:
 *   - Returns a formatted string like "September 2025" or null
 *
 */
export function formatUTCDateToMonthYear(date) {
  if (!date) return null;
  return moment.utc(date).format('MMMM YYYY');
}

/**
 * Format UTC time to Pacific Time (America/Vancouver)
 * and return easy-access date parts.
 *
 * @param {string | Date} utcTime - UTC ISO string or Date
 * @returns {{
 *   year: number,
 *   month: number,
 *   day: number,
 *   hour: number,
 *   minute: number,
 *   second: number,
 * } | null}
 */
export function formatUTCtoPacificTime(utcTime) {
  const date = new Date(utcTime);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Vancouver',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const get = (type) => Number(parts.find((p) => p.type === type)?.value);
  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
    hour: get('hour'),
    minute: get('minute'),
    second: get('second'),
  };
}

/**
 * Format the first date of a month as a YYYY-MM-DD string
 *
 * @param {number|string} year - Full year (e.g., 2025)
 * @param {number|string} month - 1-based month (1–12)
 * @returns {string | null}
 */
export function formatFirstDateOfMonth(month, year) {
  return `${year}-${padString(month, 2, '0')}-01`;
}

// Formats year and month values into a YYYY-MM string for display
export function formatYearMonthYYYYMM(year, month) {
  return `${year}-${padString(month, 2, '0')}`;
}

/**
 * Formats personal names correctly:
 * - Capitalizes each part
 * - Preserves spaces and hyphens
 **/
export function formatName(value) {
  if (!value) return '';
  return value.toLowerCase().replace(/(^|[\s\-'\u2019])\S/g, (match) => match.toUpperCase());
}
