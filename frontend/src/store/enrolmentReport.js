import { defineStore } from 'pinia';

import EnrolmentReportService from '@/services/enrolmentReportService.js';
import { useAppStore } from '@/store/app.js';

export const useEnrolmentReport = defineStore('enrolmentReport', {
  state: () => ({
    hasDueReports: null,
  }),
  actions: {
    async checkDueReports(organizationId, programYearId) {
      const appStore = useAppStore();

      const enrolmentReports = (
        await Promise.all([
          EnrolmentReportService.getEnrolmentReports(organizationId, programYearId),
          EnrolmentReportService.getEnrolmentReports(organizationId, appStore.getPreviousProgramYearId(programYearId)),
        ])
      ).flat();

      this.hasDueReports = enrolmentReports.some((report) => EnrolmentReportService.isDueEnrolmentReport(report));
    },
  },
});
