import { isEmpty, isEqual } from 'lodash';
import { defineStore } from 'pinia';

import ApiService from '@/common/apiService.js';
import { ApiRoutes } from '@/utils/constants.js';
import { checkSession } from '@/utils/session.js';

export const useFundingStore = defineStore('funding', {
  state: () => ({
    isValidForm: undefined,
    ccofBaseFundingId: undefined,
    fundingModel: {},
    loadedModel: {},
    modelStore: {},
  }),
  getters: {
    isNewFundingStarted: (state) => !isEmpty(state.fundingModel),
    getModelById: (state) => (fundingId) => state.modelStore[fundingId],
  },
  actions: {
    setFundingModel(value) {
      this.fundingModel = value;
    },
    setLoadedModel(value) {
      this.loadedModel = value;
    },
    setIsValidForm(value) {
      this.isValidForm = value;
    },
    setCcofBaseFundingId(value) {
      this.ccofBaseFundingId = value;
    },
    setModelStore(value) {
      this.modelStore = value;
    },
    addModelToStore({ fundingId, model }) {
      if (fundingId) {
        this.modelStore[fundingId] = model;
      }
    },
    deleteFromStore(fundingId) {
      delete this.modelStore[fundingId];
    },
    async saveFunding() {
      checkSession();
      if (isEqual(this.fundingModel, this.loadedModel)) {
        return;
      }
      this.setLoadedModel(this.fundingModel);
      const response = await ApiService.apiAxios.put(
        `${ApiRoutes.GROUP_FUND_AMOUNT}/${this.ccofBaseFundingId}`,
        this.fundingModel,
      );
      return response;
    },
    async loadFunding(fundingId) {
      this.setCcofBaseFundingId(fundingId);
      let model = this.getModelById(fundingId);
      if (model) {
        this.setFundingModel(model);
        this.setLoadedModel(model);
      } else {
        checkSession();
        try {
          const response = await ApiService.apiAxios.get(`${ApiRoutes.GROUP_FUND_AMOUNT}/${fundingId}`);
          model = response.data;
          if (model.familyLicenseType) {
            model.familyLicenseType = '' + model.familyLicenseType;
          }
          this.setFundingModel(model);
          this.setLoadedModel(model);
          this.addModelToStore({ fundingId, model });
        } catch (error) {
          console.log(`Failed to get Funding - ${error}`);
          throw error;
        }
      }
    },
  },
});
