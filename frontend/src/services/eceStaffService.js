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

  async getECEStaffCertificates(registrationNumber) {
    try {
      if (!registrationNumber) {
        return [];
      }
      const response = await ApiService.apiAxios.get(
        `${ApiRoutes.ECE_STAFF}/certificates?registrationNumber=${registrationNumber}`,
      );
      return response?.data;
    } catch (error) {
      console.log(`Failed to get certificate for staff - ${error}`);
      throw error;
    }
  },
};
