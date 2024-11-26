import { isEmpty } from 'lodash';

import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';

// function sortDocuments(documents) {
//   documents?.sort((doc1, doc2) => {
//     return new Date(doc1.lastUpdatedTime) - new Date(doc2.lastUpdatedTime);
//   });
//   return documents;
// }

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

  async createDocuments(payload) {
    try {
      if (isEmpty(payload)) return;
      await ApiService.apiAxios.post(ApiRoutes.DOCUMENT_APPLICATION, payload);
    } catch (error) {
      console.log(`Failed to create application's documents - ${error}`);
      throw error;
    }
  },

  async deleteDocuments(deletedFiles) {
    try {
      if (isEmpty(deletedFiles)) return;
      await ApiService.apiAxios.delete(ApiRoutes.DOCUMENT_APPLICATION, { data: deletedFiles });
    } catch (error) {
      console.log(`Failed to delete application's documents - ${error}`);
      throw error;
    }
  },
};
