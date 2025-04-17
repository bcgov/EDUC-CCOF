import { isEmpty } from 'lodash';

import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';

export default {
  async getOrganizationClosures(organizationId, programYearId) {
    try {
      if (!organizationId || !programYearId) return [];
      const response = await ApiService.apiAxios.get(
        `${ApiRoutes.CLOSURES}?organizationId=${organizationId}&programYearId=${programYearId}`,
      );
      return response?.data;
    } catch (error) {
      console.log(`Failed to get organization closures - ${error}`);
      throw error;
    }
  },

  async createNewClosureChangeRequest(payload) {
    try {
      if (isEmpty(payload)) return;
      const response = await ApiService.apiAxios.post(ApiRoutes.CHANGE_REQUEST_CLOSURE, payload);
      return response?.data;
    } catch (error) {
      console.log(`Failed to create new closure request - ${error}`);
      throw error;
    }
  },

  async createRemoveClosureChangeRequest(closureId) {
    try {
      if (!closureId) return;
      const response = await ApiService.apiAxios.delete(`${ApiRoutes.CHANGE_REQUEST_CLOSURE}?closureId=${closureId}`);
      return response?.data;
    } catch (error) {
      console.log(`Failed to create remove closure request - ${error}`);
      throw error;
    }
  },
};
