'use strict';

const { ROLES } = require('./constants');

/**
 * Normalize a date string into ISO 8601 (UTC noon).
 * - Returns null if input is empty/invalid.
 * - Supports "YYYY-MM-DD" or "YYYY/MM/DD".
 */
function formatDateForBack(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.replaceAll('/', '-').split('-').map(Number);
  if (![y, m, d].every(Number.isFinite) || m < 1 || m > 12 || d < 1 || d > 31) return null;
  const date = new Date(Date.UTC(y, m - 1, d, 12));
  return isNaN(date) ? null : date.toISOString();
}

function isFacilityAdmin(user) {
  return user?.role?.roleNumber === ROLES.FAC_ADMIN_ADVANCED || user?.role?.roleNumber === ROLES.FAC_ADMIN_BASIC;
}

function restrictFacilities(req, results, property = 'facilityId') {
  const user = req.session?.passport?.user;
  if (!isFacilityAdmin(user)) {
    return results;
  }
  return results.filter((result) => user?.facilities?.some((facility) => facility.facilityId === result[property]));
}

/**
 * Sanitizes a value for safe use in a D365 OData $filter expression.
 */
function sanitizeODataFilterValue(value) {
  if (typeof value !== 'string') {
    return value;
  }
  let sanitized = value.trim();
  // Allow only letters, numbers, space, and safe punctuation
  sanitized = sanitized.replace(/[^\p{L}\p{N} ._'-]/gu, '');
  // Escape single quotes for OData
  sanitized = sanitized.replace(/'/g, "''");
  return sanitized;
}

function getCurrentPSTDate() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Vancouver',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

module.exports = { formatDateForBack, getCurrentPSTDate, isFacilityAdmin, restrictFacilities, sanitizeODataFilterValue };
