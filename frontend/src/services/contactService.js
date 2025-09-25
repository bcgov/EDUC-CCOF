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
  async addContact(contact) {
    try {
      const response = await ApiService.apiAxios.post(`${ApiRoutes.CONTACTS}`, contact);
      return response.data;
    } catch (error) {
      console.log(`Failed to create contact - ${error}`);
      throw error;
    }
  },

  async updateContact(contactId, payload) {
    try {
      if (!contactId) return;
      const response = await ApiService.apiAxios.patch(`${ApiRoutes.CONTACTS}/${contactId}`, payload);
      return response.data;
    } catch (error) {
      console.log(`Failed to update the contact - ${error}`);
      throw error;
    }
  },
};
