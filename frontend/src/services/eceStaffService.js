import { isEmpty } from 'lodash';

import ApiService from '@/common/apiService';
import { buildQueryString } from '@/utils/common.js';
import { ApiRoutes } from '@/utils/constants';

export default {
  async getECEFacilityStaff(query) {
    try {
      const queryString = buildQueryString(query);
      if (!queryString) {
        return [];
      }
      const response = await ApiService.apiAxios.get(`${ApiRoutes.ECE_STAFF}${queryString}`);
      return response?.data;
    } catch (error) {
      console.log(`Failed to get ECE Facility Staff - ${error}`);
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
      console.error(`Failed to get certificates for staff - ${error}`);
      throw error;
    }
  },

  async updateECEFacilityStaff(payload) {
    try {
      if (isEmpty(payload)) return;
      const chunkSize = 10;
      for (let i = 0; i < payload.length; i += chunkSize) {
        const chunk = payload.slice(i, i + chunkSize);
        await ApiService.apiAxios.patch(`${ApiRoutes.ECE_STAFF}/facility-staff`, chunk);
      }
    } catch (error) {
      console.error(`Failed to update ECE Facility Staff - ${error}`);
      throw error;
    }
  },

  async createECEFacilityStaff(payload) {
    try {
      if (isEmpty(payload)) return;
      const chunkSize = 5;
      for (let i = 0; i < payload.length; i += chunkSize) {
        const chunk = payload.slice(i, i + chunkSize);
        await ApiService.apiAxios.post(`${ApiRoutes.ECE_STAFF}/facility-staff`, chunk);
      }
    } catch (error) {
      console.error(`Failed to create ECE Facility Staff - ${error}`);
      throw error;
    }
  },

  async createECEReportStaff(payload) {
    try {
      if (isEmpty(payload)) return;
      const chunkSize = 10;
      for (let i = 0; i < payload.length; i += chunkSize) {
        const chunk = payload.slice(i, i + chunkSize);
        await ApiService.apiAxios.post(`${ApiRoutes.ECE_STAFF}/report-staff`, chunk);
      }
    } catch (error) {
      console.error(`Failed to create ECE Report Staff - ${error}`);
      throw error;
    }
  },

  async updateECEReportStaff(payload) {
    try {
      if (isEmpty(payload)) return;
      const chunkSize = 10;
      for (let i = 0; i < payload.length; i += chunkSize) {
        const chunk = payload.slice(i, i + chunkSize);
        await ApiService.apiAxios.patch(`${ApiRoutes.ECE_STAFF}/report-staff`, chunk);
      }
    } catch (error) {
      console.error(`Failed to update ECE Report Staff - ${error}`);
      throw error;
    }
  },

  async deleteECEReportStaff(payload) {
    try {
      if (isEmpty(payload)) return;
      const chunkSize = 20;
      for (let i = 0; i < payload.length; i += chunkSize) {
        const chunk = payload.slice(i, i + chunkSize);
        await ApiService.apiAxios.delete(`${ApiRoutes.ECE_STAFF}/report-staff`, {
          data: chunk,
        });
      }
    } catch (error) {
      console.error(`Failed to delete ECE Report Staff - ${error}`);
      throw error;
    }
  },
};
