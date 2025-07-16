import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';

export default {
  async getDailyEnrolments(enrolmentReportId) {
    try {
      const response = await ApiService.apiAxios.get(
        `${ApiRoutes.ENROLMENT_REPORTS}/dailyEnrolments?enrolmentReportId=${enrolmentReportId}`,
      );
      return response?.data;
    } catch (error) {
      console.log(`Failed to get daily enrolments - ${error}`);
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
};
