import ApiService from '../common/apiService';
import { ApiRoutes } from '../utils/constants';
import { checkSession } from '../utils/session.js';

export default {
  async loadFacilities(organizationId) {
    checkSession();

    try {
      const response = await ApiService.apiAxios.get(`${ApiRoutes.ORGANIZATION}/${organizationId}/facilities`);
      return response.data;
    } catch (error) {
      console.log(`Failed to get facilities - ${error}`);
      throw error;
    }
  },
};
