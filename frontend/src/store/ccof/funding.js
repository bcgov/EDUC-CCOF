import { isEmpty, isEqual } from 'lodash';
import { defineStore } from 'pinia';

import FundingService from '@/services/fundingService';
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
      const payload = { ...this.fundingModel };
      delete payload.licenceCategoryId;
      const response = await FundingService.updateFunding(fundingId, payload);
      return response;
    },
    async loadFunding(fundingId) {
      try {
        checkSession();
        const model = await FundingService.getFunding(fundingId);
        model.licenceCategoryNumber = model.licenceCategoryNumber ? Number(model.licenceCategoryNumber) : null;
        this.setFundingModel(model);
        this.setLoadedModel(model);
      } catch (error) {
        console.log(`Failed to get Licence and Service details - ${error}`);
        throw error;
      }
    },
  },
});
