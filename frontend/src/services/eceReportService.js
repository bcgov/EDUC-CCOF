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

  async submitECEReport(eceReportId) {
    try {
      if (!eceReportId) return;
      await ApiService.apiAxios.post(`${ApiRoutes.ECE_REPORTS}/${eceReportId}/submit`);
    } catch (error) {
      console.error(`Failed to submit ECE report - ${error}`);
      throw error;
    }
  },
};
