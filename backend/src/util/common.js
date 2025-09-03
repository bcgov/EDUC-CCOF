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

module.exports = { formatDateForBack };
