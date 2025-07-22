import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';

export default {
  async getLicenceDetails(licenceId) {
    try {
      if (!licenceId) return [];
      const response = await ApiService.apiAxios.get(`${ApiRoutes.LICENCE_DETAILS}/${licenceId}`);
      return response?.data;
    } catch (error) {
      console.log(`Failed to get licence detail(s) by licenceId - ${error}`);
      throw error;
    }
  },
};
