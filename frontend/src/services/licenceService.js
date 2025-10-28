import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';

export default {
  async getLicences({ facilityId, fundingAgreementId } = {}) {
    try {
      let queryParam = null;
      if (facilityId) {
        queryParam = `facilityId=${facilityId}`;
      } else if (fundingAgreementId) {
        queryParam = `fundingAgreementId=${fundingAgreementId}`;
      }

      if (!queryParam) return [];
      const response = await ApiService.apiAxios.get(`${ApiRoutes.LICENCES}?${queryParam}`);
      return response?.data;
    } catch (error) {
      console.log(`Failed to get licences - ${error}`);
      throw error;
    }
  },
};
