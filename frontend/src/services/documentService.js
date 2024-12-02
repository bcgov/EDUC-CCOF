import { isEmpty } from 'lodash';

import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';

export default {
  async getApplicationUploadedDocuments(applicationId) {
    try {
      if (!applicationId) return;
      const response = await ApiService.apiAxios.get(`${ApiRoutes.DOCUMENT_APPLICATION}/${applicationId}`);
      return response?.data;
    } catch (error) {
      console.log(`Failed to get application's documents - ${error}`);
      throw error;
    }
  },

  async createApplicationDocuments(payload) {
    try {
      if (isEmpty(payload)) return;
      await ApiService.apiAxios.post(ApiRoutes.DOCUMENT_APPLICATION, payload);
    } catch (error) {
      console.log(`Failed to create application's documents - ${error}`);
      throw error;
    }
  },

  async createChangeActionDocuments(payload) {
    try {
      if (isEmpty(payload)) return;
      await ApiService.apiAxios.post(ApiRoutes.DOCUMENT_CHANGE_ACTION, payload);
    } catch (error) {
      console.log(`Failed to create change action's documents - ${error}`);
      throw error;
    }
  },

  async updateDocument(annotationId, payload) {
    try {
      if (isEmpty(annotationId) || isEmpty(payload)) return;
      console.log('updateDocument');
      console.log(annotationId);
      await ApiService.apiAxios.patch(`${ApiRoutes.DOCUMENT}/${annotationId}`, payload);
    } catch (error) {
      console.log(`Failed to update document - ${error}`);
      throw error;
    }
  },

  async deleteDocuments(deletedFiles) {
    try {
      if (isEmpty(deletedFiles)) return;
      await ApiService.apiAxios.delete(ApiRoutes.DOCUMENT, { data: deletedFiles });
    } catch (error) {
      console.log(`Failed to delete documents - ${error}`);
      throw error;
    }
  },
};
