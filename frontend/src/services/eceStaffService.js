import ApiService from '@/common/apiService';
import { buildQueryString } from '@/utils/common.js';
import { ApiRoutes } from '@/utils/constants';

export default {
  async getECEStaff(query) {
    try {
      const queryString = buildQueryString(query);
      if (!queryString) {
        return [];
      }
      const response = await ApiService.apiAxios.get(`${ApiRoutes.ECESTAFF}${queryString}`);
      return response?.data;
    } catch (error) {
      console.log(`Failed to get ECE Staff by facilityId - ${error}`);
      throw error;
    }
  },
};
