import { isEqual } from 'lodash';
import { defineStore } from 'pinia';

import ApiService from '../common/apiService.js';
import { deepCloneObject } from '../utils/common.js';
import { ApiRoutes } from '../utils/constants.js';
import { checkSession } from '../utils/session.js';

export const useNmfAppStore = defineStore('nmfApp', {
  state: () => ({
    nmfModel: {},
    loadedModel: {},
    nmfStore: {},
  }),
  getters: {
    getByCcfriId: (state) => (ccfriId) => {
      return state.nmfStore[ccfriId];
    },
  },
  actions: {
    setNmfModel(value) {
      this.nmfModel = value;
    },
    setLoadedModel(value) {
      this.loadedModel = value;
    },
    addNmfToStore({ ccfriId, model }) {
      if (ccfriId) {
        this.nmfStore[ccfriId] = model;
      }
    },
    async loadNmf(ccfriId) {
      let nmfModel = this.getByCcfriId(ccfriId);
      if (nmfModel) {
        this.setNmfModel(nmfModel);
        this.setLoadedModel(nmfModel);
      } else {
        checkSession();
        try {
          let response = await ApiService.apiAxios.get(ApiRoutes.APPLICATION_NMF + '/' + ccfriId + '/nmf');
          this.addNmfToStore({ ccfriId: ccfriId, model: response.data });
          this.setNmfModel(response.data);
          this.setLoadedModel(response.data);
        } catch (e) {
          console.log(`Failed to get existing NMF with error - ${e}`);
          throw e;
        }
      }
    },
    async saveNmf(ccfriId) {
      checkSession();

      if (isEqual(this.nmfModel, this.loadedModel)) {
        console.info('no model changes');
        return;
      }

      this.setLoadedModel(deepCloneObject(this.nmfModel));
      if (this.nmfModel?.nmfId) {
        // has a nmf ID, so update the data
        try {
          let payload = {
            nmfModel: this.nmfModel,
            ccfriId: ccfriId,
          };
          await ApiService.apiAxios.put(ApiRoutes.APPLICATION_NMF + '/' + 'nmf/' + this.nmfModel?.nmfId, payload);
          this.addNmfToStore({ ccfriId: ccfriId, model: this.nmfModel });
          return;
        } catch (error) {
          console.log(`Failed to update existing NMF - ${error}`);
          throw error;
        }
      } else {
        // else create a new RFI
        try {
          let response = await ApiService.apiAxios.post(ApiRoutes.APPLICATION_NMF + '/' + ccfriId + '/nmf', {
            nmfModel: this.nmfModel,
          });
          this.nmfModel.nmfId = response.data.nmfApplicationGuid;
          this.loadedModel.nmfId = response.data.nmfApplicationGuid;
          this.addNmfToStore({ ccfriId: ccfriId, model: this.nmfModel });
          return response.data.nmfApplicationGuid;
        } catch (error) {
          console.log(`Failed to save new NMF - ${error}`);
          throw error;
        }
      }
    },
  },
});
