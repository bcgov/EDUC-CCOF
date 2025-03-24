import { isEmpty, isEqual } from 'lodash';
import { defineStore } from 'pinia';

import ApiService from '@/common/apiService.js';
import { ApiRoutes } from '@/utils/constants.js';
import { checkSession } from '@/utils/session.js';

export const useFundingStore = defineStore('funding', {
  state: () => ({
    fundingModel: {},
    loadedModel: {},
  }),
  getters: {
    isNewFundingStarted: (state) => !isEmpty(state.fundingModel),
  },
  actions: {
    setFundingModel(model) {
      this.fundingModel = { ...model };
    },
    setLoadedModel(model) {
      this.loadedModel = { ...model };
    },
    async saveFunding(fundingId) {
      checkSession();
      if (isEqual(this.fundingModel, this.loadedModel)) return;
      this.setLoadedModel(this.fundingModel);
      const response = await ApiService.apiAxios.put(`${ApiRoutes.GROUP_FUND_AMOUNT}/${fundingId}`, this.fundingModel);
      return response;
    },
    async loadFunding(fundingId) {
      try {
        checkSession();
        const model = (await ApiService.apiAxios.get(`${ApiRoutes.GROUP_FUND_AMOUNT}/${fundingId}`))?.data;
        // if (model.familyLicenseType) { ?????
        //   model.familyLicenseType = '' + model.familyLicenseType;
        // }
        this.setFundingModel(model);
        this.setLoadedModel(model);
      } catch (error) {
        console.log(`Failed to get Funding - ${error}`);
        throw error;
      }
    },
  },
});
