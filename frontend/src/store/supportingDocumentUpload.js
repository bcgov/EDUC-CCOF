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
      console.log('save uploaded documents called');
      console.log('da payload', payload);
      try {
        let response = await ApiService.apiAxios.post(ApiRoutes.SUPPORTING_DOCUMENT_UPLOAD, payload);
        console.log('save uploaded documents called');
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async getDocuments(applicationId) {
      try {
        console.log('cALLLING FOR DOCS');
        this.setUploadedDocuments([]);
        let response = await ApiService.apiAxios.get(ApiRoutes.SUPPORTING_DOCUMENT_UPLOAD + '/' + applicationId);
        console.log(response.data);
        this.setUploadedDocuments(response.data);
        console.log('get documents called');
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async deleteDocuments(deletedFiles) {
      try {
        await ApiService.apiAxios.delete(ApiRoutes.SUPPORTING_DOCUMENT_UPLOAD, { data: deletedFiles });
        console.log('delete uploaded documents called');
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
});
