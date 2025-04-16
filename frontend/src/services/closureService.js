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
      console.log(`Failed to create organization closure request - ${error}`);
      throw error;
    }
  },
};
