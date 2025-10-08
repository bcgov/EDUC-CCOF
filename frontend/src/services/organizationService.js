import ApiService from '../common/apiService';
import { ApiRoutes } from '../utils/constants';
import { checkSession } from '../utils/session.js';

export default {
  async getOrganization(organizationId) {
    try {
      const response = await ApiService.apiAxios.get(`${ApiRoutes.ORGANIZATION}/${organizationId}`);
      return response.data;
    } catch (error) {
      console.log(`Failed to get Organization - ${error}`);
      throw error;
    }
  },

  async createOrganization(organization) {
    try {
      const response = await ApiService.apiAxios.post(ApiRoutes.ORGANIZATION, organization);
      return response.data;
    } catch (error) {
      console.log(`Failed to create Organization - ${error}`);
      throw error;
    }
  },

  async updateOrganization(organizationId, organization) {
    try {
      const response = await ApiService.apiAxios.put(`${ApiRoutes.ORGANIZATION}/${organizationId}`, organization);
      return response.data;
    } catch (error) {
      console.log(`Failed to update Organization - ${error}`);
      throw error;
    }
  },

  async loadFacilities(organizationId) {
    checkSession();

    try {
      const response = await ApiService.apiAxios.get(`${ApiRoutes.ORGANIZATION}/${organizationId}/facilities`);
      return response.data;
    } catch (error) {
      console.log(`Failed to get Organization facilities - ${error}`);
      throw error;
    }
  },
};
