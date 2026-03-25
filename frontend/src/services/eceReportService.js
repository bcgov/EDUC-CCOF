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

  async getECETopUpReports({ fromMonth, fromYear, toMonth, toYear, facilityIds, eceStaffIds }) {
    const requests = [];
    for (let year = fromYear; year <= toYear; year++) {
      let body = {
        year,
        facilityIds,
        eceStaffIds,
      };
      if (fromYear === toYear) {
        body.fromMonth = fromMonth;
        body.toMonth = toMonth;
      } else if (year === fromYear) {
        body.fromMonth = fromMonth;
        body.toMonth = 12;
      } else if (year === toYear) {
        body.fromMonth = 1;
        body.toMonth = toMonth;
      }
      requests.push(ApiService.apiAxios.post(`${ApiRoutes.ECE_REPORTS}/top-up`, body));
    }
    const responses = await Promise.all(requests);
    return responses.flatMap((r) => r.data);
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

  async updateECEReport(eceReportId, payload) {
    try {
      if (!eceReportId || isEmpty(payload)) return;

      await ApiService.apiAxios.patch(`${ApiRoutes.ECE_REPORTS}/${eceReportId}`, payload);
    } catch (error) {
      console.error(`Failed to update ECE report - ${error}`);
      throw error;
    }
  },

  async createAdjustmentReport(eceReportId) {
    try {
      if (!eceReportId) return;
      const response = await ApiService.apiAxios.post(`${ApiRoutes.ECE_REPORTS}/${eceReportId}/adjustment`);
      return response?.data;
    } catch (error) {
      if (error.response?.status === 504) {
        console.error(`Adjustment report request timed out - ${error}`);
      } else {
        console.error(`Failed to create adjustment report - ${error}`);
      }
      throw error;
    }
  },
};
