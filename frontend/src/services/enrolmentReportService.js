import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';

export default {
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
};
