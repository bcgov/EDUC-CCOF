import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';

export default {
  async getECEStaff(facilityId) {
    try {
      if (!facilityId) return [];
      const response = await ApiService.apiAxios.get(`${ApiRoutes.ECESTAFF}?facilityId=${facilityId}`);
      return response?.data;
    } catch (error) {
      console.log(`Failed to get ECE Staff by facilityId - ${error}`);
      throw error;
    }
  },
};
