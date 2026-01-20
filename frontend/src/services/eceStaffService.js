import { isEmpty } from 'lodash';

import ApiService from '@/common/apiService';
import { buildQueryString } from '@/utils/common.js';
import { ApiRoutes } from '@/utils/constants';

export default {
  async getECEStaff(query) {
    try {
      const queryString = buildQueryString(query);
      if (!queryString) {
        return [];
      }
      const response = await ApiService.apiAxios.get(`${ApiRoutes.ECE_STAFF}${queryString}`);
      return response?.data;
    } catch (error) {
      console.log(`Failed to get ECE Staff by facilityId - ${error}`);
      throw error;
    }
  },

  async getECEStaffCertificates(query) {
    try {
      const queryString = buildQueryString(query);
      if (!queryString) {
        return [];
      }
      const response = await ApiService.apiAxios.get(`${ApiRoutes.ECE_STAFF}/certificates${queryString}`);
      return response?.data;
    } catch (error) {
      console.log(`Failed to get certificate for staff - ${error}`);
      throw error;
    }
  },

  async updateECEStaff(payload) {
    try {
      if (isEmpty(payload)) return;
      const chunkSize = 10;
      for (let i = 0; i < payload.length; i += chunkSize) {
        const chunk = payload.slice(i, i + chunkSize);
        await ApiService.apiAxios.patch(`${ApiRoutes.ECE_STAFF}/bulk`, chunk);
      }
    } catch (error) {
      console.log(`Failed to update ECE Staff - ${error}`);
      throw error;
    }
  },

  async createECEStaff(payload) {
    try {
      if (isEmpty(payload)) return;
      const response = await ApiService.apiAxios.post(ApiRoutes.ECE_STAFF, payload);
      return response?.data;
    } catch (error) {
      console.log(`Failed to create ECE Staff - ${error}`);
      throw error;
    }
  },
};
