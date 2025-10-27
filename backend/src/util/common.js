'use strict';

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

function isFacilityAdmin(_user) {
  // Not used for Pre-Renewals release
  return false;
  // return user?.role?.roleNumber === ROLES.FAC_ADMIN_ADVANCED || user?.role?.roleNumber === ROLES.FAC_ADMIN_BASIC;
}

function restrictFacilities(_req, results, _property = 'facilityId') {
  // Not used for Pre-Renewals release
  return results;
  // const user = req.session?.passport?.user;
  // if (!isFacilityAdmin(user)) {
  //   return results;
  // }
  // return results.filter((result) => user?.facilities?.some((facility) => facility.facilityId === result[property]));
}

module.exports = { formatDateForBack, isFacilityAdmin, restrictFacilities };
