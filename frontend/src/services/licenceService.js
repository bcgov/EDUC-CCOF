import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';

export default {
  async getLicences({ facilityId, fundingAgreementId } = {}) {
    try {
      const queryParam = facilityId
        ? `facilityId=${facilityId}`
        : fundingAgreementId
          ? `fundingAgreementId=${fundingAgreementId}`
          : null;

      if (!queryParam) return [];
      const response = await ApiService.apiAxios.get(`${ApiRoutes.LICENCES}?${queryParam}`);
      return response?.data;
    } catch (error) {
      console.log(`Failed to get licences - ${error}`);
      throw error;
    }
  },
};
