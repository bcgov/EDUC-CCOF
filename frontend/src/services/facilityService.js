import ApiService from '@/common/apiService';
import { replaceChildCareLabel } from '@/utils/common.js';
import { ApiRoutes } from '@/utils/constants';

export default {
  async getLicenseCategories(facilityId) {
    try {
      if (!facilityId) return [];
      const response = await ApiService.apiAxios.get(`${ApiRoutes.FACILITY}/${facilityId}/licenseCategories`);
      // This helper updates the childcare category labels to reflect the new business naming.
      return replaceChildCareLabel(response?.data);
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
  async updateFacility(facilityId, payload) {
    try {
      const response = await ApiService.apiAxios.put(`${ApiRoutes.FACILITY}/${facilityId}`, payload);
      return response;
    } catch (error) {
      console.log(`Failed to update existing Facility - ${error}`);
      throw error;
    }
  },
};
