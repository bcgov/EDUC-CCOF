import { ECE_REPORT_INTERNAL_STATUSES } from '@/utils/constants.js';

export function isReportReadOnly({ loading, eceReport }) {
  if (loading || !eceReport) {
    return true;
  }
  return eceReport.statusCode !== ECE_REPORT_INTERNAL_STATUSES.DRAFT;
}

export function getSubmissionDeadlineUTCDate(year, month) {
  if (!year || !month) return null;
  const targetMonthIndex = Number(month) - 1 + 6;
  return new Date(Date.UTC(Number(year), targetMonthIndex + 1, 0));
}
