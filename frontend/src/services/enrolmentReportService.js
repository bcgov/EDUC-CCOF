import { isEmpty } from 'lodash';

import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';

export default {
  async getDailyEnrolments(enrolmentReportId) {
    try {
      const response = await ApiService.apiAxios.get(
        `${ApiRoutes.ENROLMENT_REPORTS}/${enrolmentReportId}/daily-enrolments`,
      );
      return response?.data;
    } catch (error) {
      console.log(`Failed to get daily enrolments - ${error}`);
      throw error;
    }
  },

  async updateDailyEnrolments(enrolmentReportId, payload) {
    try {
      if (isEmpty(payload)) return;
      const chunkSize = 16;
      for (let i = 0; i < payload.length; i += chunkSize) {
        const chunk = payload.slice(i, i + chunkSize);
        await ApiService.apiAxios.patch(
          `${ApiRoutes.ENROLMENT_REPORTS}/${enrolmentReportId}/daily-enrolments/bulk`,
          chunk,
        );
      }
    } catch (error) {
      console.log(`Failed to update daily enrolments - ${error}`);
      throw error;
    }
  },

  async getEnrolmentReports(organizationId, programYearId) {
    try {
      if (!organizationId || !programYearId) return [];
      const response = await ApiService.apiAxios.get(
        `${ApiRoutes.ENROLMENT_REPORTS}?organizationId=${organizationId}&programYearId=${programYearId}`,
      );
      return response?.data;
    } catch (error) {
      console.log(`Failed to get enrolment reports - ${error}`);
      throw error;
    }
  },

  async getEnrolmentReport(enrolmentReportId) {
    try {
      if (!enrolmentReportId) return null;
      const response = await ApiService.apiAxios.get(`${ApiRoutes.ENROLMENT_REPORTS}/${enrolmentReportId}`);
      return response?.data;
    } catch (error) {
      console.log(`Failed to get enrolment report - ${error}`);
      throw error;
    }
  },

  async updateEnrolmentReport(enrolmentReportId, payload) {
    try {
      if (!enrolmentReportId || isEmpty(payload)) return;
      await ApiService.apiAxios.patch(`${ApiRoutes.ENROLMENT_REPORTS}/${enrolmentReportId}`, payload);
    } catch (error) {
      console.log(`Failed to update enrolment report - ${error}`);
      throw error;
    }
  },

  async createAdjustmentEnrolmentReport(enrolmentReportId, contactId) {
    try {
      if (isEmpty(enrolmentReportId)) return;
      const response = await ApiService.apiAxios.post(`${ApiRoutes.ENROLMENT_REPORTS}/adjustment`, {
        enrolmentReportId: enrolmentReportId,
        contactId: contactId,
      });
      return response;
    } catch (error) {
      console.error(`Failed to create adjustment report - ${error}`);
      throw error;
    }
  },

  async checkDueEnrolmentReports(organizationId, programYearId, prevProgramYearId) {
    try {
      if (!organizationId || !programYearId || !prevProgramYearId) return false;

      const response = await ApiService.apiAxios.get(
        `${ApiRoutes.ENROLMENT_REPORTS}/has-due?organizationId=${organizationId}&programYearId=${programYearId}&prevProgramYearId=${prevProgramYearId}`,
      );
      return response?.data;
    } catch (error) {
      console.log(`Failed to check due enrolment reports - ${error}`);
      throw error;
    }
  },

  isSubmissionDeadlinePassed(enrolmentReport) {
    return new Date() > new Date(enrolmentReport.submissionDeadline);
  },
};
