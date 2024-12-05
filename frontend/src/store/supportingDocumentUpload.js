import { defineStore } from 'pinia';

import ApiService from '../common/apiService.js';
import { ApiRoutes } from '../utils/constants.js';

export const useSupportingDocumentUploadStore = defineStore('supportingDocumentUpload', {
  state: () => ({
    uploadedDocuments: [],
  }),
  actions: {
    setUploadedDocuments(uploadedDocuments) {
      this.uploadedDocuments = uploadedDocuments;
    },
    async saveUploadedDocuments(payload) {
      try {
        let response = await ApiService.apiAxios.post(ApiRoutes.SUPPORTING_DOCUMENT_UPLOAD, payload);
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async getDocuments(applicationId) {
      try {
        this.setUploadedDocuments([]);
        let response = await ApiService.apiAxios.get(ApiRoutes.SUPPORTING_DOCUMENT_UPLOAD + '/' + applicationId);
        this.setUploadedDocuments(response.data);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
});
