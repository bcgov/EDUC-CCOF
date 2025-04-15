import ApiService from '@/common/apiService';
import { licenseCategoriesUrl } from '@/utils/constants';

export default {
  async getLicenseCategories(facilityId) {
    try {
      if (!facilityId) return [];
      const response = await ApiService.apiAxios.get(licenseCategoriesUrl(facilityId));
      return response?.data;
    } catch (error) {
      console.log(`Failed to get facility license categories - ${error}`);
      throw error;
    }
  },
};
