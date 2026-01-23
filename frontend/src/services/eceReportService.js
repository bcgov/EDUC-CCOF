import { isEmpty } from 'lodash';

import ApiService from '@/common/apiService';
import { buildQueryString } from '@/utils/common.js';
import { ApiRoutes } from '@/utils/constants';

export default {
  async createECEReport(payload) {
    try {
      if (isEmpty(payload)) return;
      const response = await ApiService.apiAxios.post(`${ApiRoutes.ECE_REPORTS}`, payload);
      return response;
    } catch (error) {
      console.error(`Failed to create ECE report - ${error}`);
      throw error;
    }
  },

  async getECEReport(eceReportId) {
    try {
      if (!eceReportId) return null;
      const response = await ApiService.apiAxios.get(`${ApiRoutes.ECE_REPORTS}/${eceReportId}`);
      return response?.data;
    } catch (error) {
      console.error(`Failed to get ECE report - ${error}`);
      throw error;
    }
  },

  async getECEReports(query) {
    try {
      const queryString = buildQueryString(query);
      if (!queryString) {
        return [];
      }
      const response = await ApiService.apiAxios.get(`${ApiRoutes.ECE_REPORTS}${queryString}`);
      return response?.data;
    } catch (error) {
      console.error(`Failed to get ECE Reports - ${error}`);
      throw error;
    }
  },

  async createECEStaffInformation(eceReportId, payload) {
    try {
      if (!eceReportId || isEmpty(payload)) return;
      const chunkSize = 10;
      for (let i = 0; i < payload.length; i += chunkSize) {
        const chunk = payload.slice(i, i + chunkSize);
        await ApiService.apiAxios.post(`${ApiRoutes.ECE_REPORTS}/${eceReportId}/staff-information`, chunk);
      }
    } catch (error) {
      console.log(`Failed to create ECE Staff Information - ${error}`);
      throw error;
    }
  },

  async updateECEStaffInformation(payload) {
    try {
      console.log(payload);
      if (isEmpty(payload)) return;
      const chunkSize = 10;
      for (let i = 0; i < payload.length; i += chunkSize) {
        const chunk = payload.slice(i, i + chunkSize);
        await ApiService.apiAxios.patch(`${ApiRoutes.ECE_REPORTS}/staff-information/bulk`, chunk);
      }
    } catch (error) {
      console.log(`Failed to update ECE Staff Information - ${error}`);
      throw error;
    }
  },
};
