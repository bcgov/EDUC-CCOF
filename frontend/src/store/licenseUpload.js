import { defineStore } from 'pinia';

import ApiService from '../common/apiService.js';
import { ApiRoutes } from '../utils/constants.js';

export const useLicenseUploadStore = defineStore('licenseUpload', {
  state: () => ({
    uploadedLicenses: [],
  }),
  actions: {
    async saveLicenseFiles(payload) {
      try {
        let response = await ApiService.apiAxios.post(ApiRoutes.LICENSE_UPLOAD, payload);
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async getLicenseFiles(applicationId) {
      try {
        this.uploadedLicenses = [];
        let response = await ApiService.apiAxios.get(ApiRoutes.LICENSE_UPLOAD + '/' + applicationId);
        this.uploadedLicenses = response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async deleteLicenseFiles(payload) {
      try {
        await ApiService.apiAxios.delete(ApiRoutes.LICENSE_UPLOAD, { data: payload });
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
});
