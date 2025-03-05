import { isEmpty } from 'lodash';

import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';

export default {
  async createApplicationCCFRIClosure(payload) {
    try {
      if (isEmpty(payload)) return;
      await ApiService.apiAxios.post(ApiRoutes.DOCUMENT_APPLICATION, payload);
    } catch (error) {
      console.log(`Failed to create an application's CCFRI closure - ${error}`);
      throw error;
    }
  },

  async getApplicationCCFRIClosures(ccfriApplicationGuid) {
    try {
      if (!ccfriApplicationGuid) return [];
      const response = await ApiService.apiAxios.get(`${ApiRoutes.DOCUMENT_APPLICATION}/${ccfriApplicationGuid}`);
      return response?.data;
    } catch (error) {
      console.log(`Failed to get an application's CCFRI closures - ${error}`);
      throw error;
    }
  },

  async updateApplicationCCFRIClosure(ccfriApplicationGuid, payload) {
    try {
      if (isEmpty(ccfriApplicationGuid) || isEmpty(payload)) return;
      await ApiService.apiAxios.patch(`${ApiRoutes.DOCUMENT}/${ccfriApplicationGuid}`, payload);
    } catch (error) {
      console.log(`Failed to update an application's CCFRI closure - ${error}`);
      throw error;
    }
  },

  async deleteApplicationCCFRIClosure(ccfriApplicationGuid) {
    try {
      if (isEmpty(ccfriApplicationGuid)) return;
      await ApiService.apiAxios.delete(`${ApiRoutes.DOCUMENT}/${ccfriApplicationGuid}`);
    } catch (error) {
      console.log(`Failed to delete an application's CCFRI closure - ${error}`);
      throw error;
    }
  },
};
