import { ECE_REPORT_INTERNAL_STATUSES } from '@/utils/constants.js';

// TODO: Implement ECE Reports permissions
export function isReportReadOnly({ loading, eceReport }) {
  if (loading || !eceReport) {
    return true;
  }
  return eceReport.statusCode !== ECE_REPORT_INTERNAL_STATUSES.DRAFT;
}
