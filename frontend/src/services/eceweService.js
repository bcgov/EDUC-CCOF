import ApiService from '@/common/apiService';
import { buildQueryString } from '@/utils/common.js';
import { ApiRoutes } from '@/utils/constants';

export default {
  async getECEWEFacilities(query) {
    try {
      const queryString = buildQueryString(query);
      if (!queryString) {
        return [];
      }
      const response = await ApiService.apiAxios.get(`${ApiRoutes.ECEWE}${queryString}`);
      return response?.data;
    } catch (error) {
      console.log(`Failed to get ECEWE Facilities - ${error}`);
      throw error;
    }
  },
};
