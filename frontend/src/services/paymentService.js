import ApiService from '@/common/apiService';
import { buildQueryString } from '@/utils/common.js';
import { ApiRoutes } from '@/utils/constants';

export default {
  async getPayments(query) {
    try {
      if (!query?.organizationId) return [];
      const response = await ApiService.apiAxios.get(`${ApiRoutes.PAYMENTS}${buildQueryString(query)}`);
      return response?.data;
    } catch (error) {
      console.log(`Failed to get payment records - ${error}`);
      throw error;
    }
  },
};
