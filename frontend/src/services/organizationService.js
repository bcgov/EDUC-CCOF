import { ApiRoutes } from '@/utils/constants';
import ApiService from '@/common/apiService';

export default {
  async getOrganizationGoodStanding(organizationId) {
    try {
      if (!organizationId) return false;
      const response = await ApiService.apiAxios.get(`${ApiRoutes.ORGANIZATION}/${organizationId}/goodStandingCheck`);
      return response?.data;
    } catch (error) {
      console.log(`Failed to get application's documents - ${error}`);
      throw error;
    }
  },
};
