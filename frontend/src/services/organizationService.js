import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';

export default {
  async getOrganizationGoodStandingCheck(organizationId) {
    try {
      if (!organizationId) return;
      const response = await ApiService.apiAxios.get(`${ApiRoutes.ORGANIZATION}/${organizationId}/goodStandingCheck`);
      return response?.data;
    } catch (error) {
      console.log(`Failed to get organization's good standing values - ${error}`);
      throw error;
    }
  },
};
