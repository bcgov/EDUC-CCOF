import { defineStore } from 'pinia';

import ApiService from '../common/apiService.js';
import { checkSession } from '../utils/session.js';
import { ApiRoutes } from '../utils/constants.js';

export const useDocumentStore = defineStore('document', {
  state: () => ({
    documentTypeCodes: null,
    unsubmittedDocuments: [],
    pdfs: [],
  }),
  actions: {
    setPDFs(pdfs) {
      this.pdfs = pdfs;
    },
    setDocumentTypeCodes(documentTypeCodes) {
      this.documentTypeCodes = documentTypeCodes;
    },
    setUnsubmittedDocuments(unsubmittedDocuments) {
      this.unsubmittedDocuments = unsubmittedDocuments || [];
    },
    setUploadedDocument(document) {
      this.unsubmittedDocuments = [...this.unsubmittedDocuments, document];
    },
    async getDocumentTypeCodes() {
      const response = await ApiService.getDocumentTypeCodes();
      this.setDocumentTypeCodes(response.data);
    },
    async deleteFile({ secureExchangeID, documentID }) {
      await ApiService.deleteDocument(secureExchangeID, documentID);
      const documents = this.unsubmittedDocuments.filter((document) => document.documentID !== documentID);
      this.setUnsubmittedDocuments(documents);
    },
    async getPDFs(organizationId) {
      checkSession();
      try {
        let response = await ApiService.apiAxios.get(ApiRoutes.PDFS + '/' + organizationId);
        this.setPDFs(response?.data);
        return response;
      } catch (e) {
        console.log(`Failed to get pdfs with error - ${e}`);
        throw e;
      }
    },
  },
});
