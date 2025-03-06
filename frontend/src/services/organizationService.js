import { ApiRoutes, ORGANIZATION_GOOD_STANDING_STATUSES } from '@/utils/constants';

import ApiService from '@/common/apiService';

export default {
  async getOrganizationGoodStanding(organizationId) {
    try {
      if (!organizationId) return false;
      const response = await ApiService.apiAxios.get(`${ApiRoutes.ORGANIZATION}/${organizationId}/goodStandingCheck`);
      return (
        response?.data.bypassGoodstandingCheck ||
        response?.data.goodStandingStatus === ORGANIZATION_GOOD_STANDING_STATUSES.PASS
      );
    } catch (error) {
      console.log(`Failed to get application's documents - ${error}`);
      throw error;
    }
  },
};
