import ApiService from '../common/apiService';
import { ApiRoutes } from '../utils/constants';
import { checkSession } from '../utils/session.js';

export default {
  async loadContacts(organizationId) {
    checkSession();

    try {
      const response = await ApiService.apiAxios.get(`${ApiRoutes.CONTACTS}/${organizationId}`);
      return response.data;
    } catch (error) {
      console.log(`Failed to get facilities - ${error}`);
      throw error;
    }
  },
};
