import ApiService from '../common/apiService';
import { ApiRoutes } from '../utils/constants';
import { checkSession } from '../utils/session';

export default {
  async getFundingAgreementsByOrganizationId(organizationId) {
    checkSession();
    try {
      if (!organizationId) return [];
      const response = await ApiService.apiAxios.get(
        `${ApiRoutes.FUNDING_AGREEMENTS}?organizationId=${organizationId}`,
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to load funding agreements - ${error}`);
      throw error;
    }
  },
};
