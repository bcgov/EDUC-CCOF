import { defineStore } from 'pinia';

import EnrolmentReportService from '@/services/enrolmentReportService.js';
import { useAppStore } from '@/store/app.js';
import { PERMISSIONS } from '@/utils/constants/permissions.js';

import { useAuthStore } from './auth';

export const useEnrolmentReport = defineStore('enrolmentReport', {
  state: () => ({
    hasDueReports: null,
  }),

  actions: {
    async checkDueReports(organizationId, programYearId) {
      const appStore = useAppStore();
      const authStore = useAuthStore();

      if (!authStore.hasPermission(PERMISSIONS.SUBMIT_ENROLMENT_REPORT)) {
        return false;
      }

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
