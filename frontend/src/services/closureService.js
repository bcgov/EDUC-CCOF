import { isEmpty } from 'lodash';

import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';

export default {
  async getApplicationClosures(ccfriApplicationId) {
    try {
      if (!ccfriApplicationId) return [];
      const response = await ApiService.apiAxios.get(`${ApiRoutes.CLOSURES}?ccfriApplicationId=${ccfriApplicationId}`);
      response?.data?.forEach(
        (closure) => (closure.ageGroups = closure.ageGroups?.split(',')?.map((item) => Number(item.trim()))),
      );
      return response?.data;
    } catch (error) {
      console.log(`Failed to get application closures - ${error}`);
      throw error;
    }
  },

  async createClosure(closure) {
    try {
      if (isEmpty(closure)) return;
      await ApiService.apiAxios.post(ApiRoutes.CLOSURES, closure);
    } catch (error) {
      console.error(`Failed to create closure - ${error}`);
      throw error;
    }
  },

  async updateClosure(closure) {
    try {
      if (isEmpty(closure)) return;
      await ApiService.apiAxios.patch(`${ApiRoutes.CLOSURES}/${closure.closureId}`, closure);
    } catch (error) {
      console.error(`Failed to update closures - ${error}`);
      throw error;
    }
  },

  async deleteClosures(closures) {
    try {
      if (isEmpty(closures)) return;
      const closureIds = closures.map((closure) => closure.closureId);
      await ApiService.apiAxios.delete(ApiRoutes.CLOSURES, { data: closureIds });
    } catch (error) {
      console.error(`Failed to delete closures - ${error}`);
      throw error;
    }
  },

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

  async createClosureChangeRequest(payload) {
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
