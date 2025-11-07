import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';

export default {
  async getLicenseCategories(facilityId) {
    try {
      if (!facilityId) return [];
      const response = await ApiService.apiAxios.get(`${ApiRoutes.FACILITY}/${facilityId}/licenseCategories`);
      return response?.data;
    } catch (error) {
      console.log(`Failed to get facility licence categories - ${error}`);
      throw error;
    }
  },
  async getFacility(facilityId) {
    try {
      if (!facilityId) return null;
      const response = await ApiService.apiAxios.get(`${ApiRoutes.FACILITY}/${facilityId}`);
      return response?.data;
    } catch (error) {
      console.log(`Failed to get facility by ID - ${error}`);
      throw error;
    }
  },

  async createFacility(payload) {
    try {
      const response = await ApiService.apiAxios.post(ApiRoutes.FACILITY, payload);
      return response;
    } catch (error) {
      console.log(`Failed to create Facility - ${error}`);
      throw error;
    }
  },

  async updateFacility(facilityId, payload) {
    try {
      const response = await ApiService.apiAxios.put(`${ApiRoutes.FACILITY}/${facilityId}`, payload);
      return response;
    } catch (error) {
      console.log(`Failed to update existing Facility - ${error}`);
      throw error;
    }
  },

  async deleteFacility(payload) {
    try {
      const response = await ApiService.apiAxios.delete(payload);
      return response;
    } catch (error) {
      console.log(`Failed to delete Facility - ${error}`);
      throw error;
    }
  },
};
