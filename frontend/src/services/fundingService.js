import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';

export default {
  async getFunding(fundingId) {
    try {
      if (!fundingId) return null;
      const response = await ApiService.apiAxios.get(`${ApiRoutes.GROUP_FUND_AMOUNT}/${fundingId}`);
      return response?.data;
    } catch (error) {
      console.log(`Failed to get Funding by ID - ${error}`);
      throw error;
    }
  },

  async updateFunding(fundingId, payload) {
    try {
      const response = await ApiService.apiAxios.put(`${ApiRoutes.GROUP_FUND_AMOUNT}/${fundingId}`, payload);
      return response;
    } catch (error) {
      console.log(`Failed to update existing Facility - ${error}`);
      throw error;
    }
  },
};
