import ApiService from '../common/apiService';
import { ApiRoutes } from '../utils/constants';
import { checkSession } from '../utils/session.js';

export default {
  async loadContacts(organizationId) {
    checkSession();

    try {
      const response = await ApiService.apiAxios.get(`${ApiRoutes.CONTACTS}/organization/${organizationId}`);
      return response.data;
    } catch (error) {
      console.log(`Failed to get facilities - ${error}`);
      throw error;
    }
  },
  async deleteContact(contactId) {
    try {
      const response = await ApiService.apiAxios.delete(`${ApiRoutes.CONTACTS}/${contactId}`);
      return response.data;
    } catch (error) {
      console.log(`Failed to delete contact - ${error}`);
      throw error;
    }
  },
  async getRoles() {
    try {
      const response = await ApiService.apiAxios.get(`${ApiRoutes.CONTACTS}/roles`);
      return response.data;
    } catch (error) {
      console.log(`Failed to get contact roles = ${error}`);
    }
  },
};
