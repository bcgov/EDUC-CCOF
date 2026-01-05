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
      const response = await ApiService.apiAxios.get(`${ApiRoutes.ECE_STAFF}${queryString}`);
      return response?.data;
    } catch (error) {
      console.log(`Failed to get ECE Staff by facilityId - ${error}`);
      throw error;
    }
  },

  async updateECEStaff(eceStaffId, payload) {
    try {
      if (!eceStaffId) return;
      const response = await ApiService.apiAxios.patch(`${ApiRoutes.ECE_STAFF}/${eceStaffId}`, payload);
      return response?.data;
    } catch (error) {
      console.log(`Failed to update the ECE Staff record - ${error}`);
      throw error;
    }
  },
};
