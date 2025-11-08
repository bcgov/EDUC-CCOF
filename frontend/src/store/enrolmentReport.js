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
      const prevProgramYearId = appStore.getPreviousProgramYearId(programYearId);

      const result = await EnrolmentReportService.checkDueEnrolmentReports(
        organizationId,
        programYearId,
        prevProgramYearId,
      );

      this.hasDueReports = result?.hasDueReports;
    },
  },
});
