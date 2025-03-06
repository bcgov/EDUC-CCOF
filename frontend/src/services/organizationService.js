import { ApiRoutes } from '@/utils/constants';
import ApiService from '@/common/apiService';

export default {
  async getOrganizationGoodStanding(organizationId) {
    try {
      if (!organizationId) return false;
      const response = await ApiService.apiAxios.get(`${ApiRoutes.ORGANIZATION}/${organizationId}/inGoodStanding`);
      return response?.data.bypassGoodstandingCheck === true || response?.data.goodStandingStatus !== undefined;
    } catch (error) {
      console.log(`Failed to get application's documents - ${error}`);
      throw error;
    }
  },
};
