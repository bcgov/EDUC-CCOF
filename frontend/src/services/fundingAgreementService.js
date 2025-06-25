import ApiService from '../common/apiService';
import { ApiRoutes } from '../utils/constants';
import { checkSession } from '../utils/session.js';

export default {
  async getFundingAgreements() {
    checkSession();

    try {
      const response = await ApiService.apiAxios.get(`${ApiRoutes.USER}`);
      return response?.data;
    } catch (error) {
      console.log(`Failed to get funding agreements - ${error}`);
      throw error;
    }
  },
};
