'use strict';
/**
 * Turn 'YYYY-MM-DD' or 'YYYY/MM/DD' into a proper UTC ISO string that
 * represents **noon in America/Vancouver** on that date (DST-safe).
 */
function formatTimeForBack(dateStr) {
  if (!dateStr) return null;
  const s = String(dateStr).trim();
  if (s.includes('T')) return s; // assume already an instant (ISO-ish)

  // Parse plain calendar date
  const [y, m, d] = s.replaceAll('/', '-').split('-').map(Number);

  // Get wall-clock "noon in America/Vancouver" for that calendar day
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Vancouver',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const probe = new Date(y, m - 1, d, 12, 0, 0); // noon (local tz doesn’t matter)
  const parts = Object.fromEntries(fmt.formatToParts(probe).map((p) => [p.type, p.value]));

  // Reconstruct that Pacific noon as an absolute UTC instant
  return new Date(Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second)).toISOString();
}

module.exports = { formatTimeForBack };
