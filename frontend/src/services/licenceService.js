import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';

export default {
  async getLicences(facilityId) {
    try {
      if (!facilityId) return [];
      const response = await ApiService.apiAxios.get(`${ApiRoutes.LICENCES}?facilityId=${facilityId}`);
      return response?.data;
    } catch (error) {
      console.log(`Failed to get the licences by facilityId - ${error}`);
      throw error;
    }
  },
};
