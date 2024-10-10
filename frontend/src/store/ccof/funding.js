import { defineStore } from 'pinia';
import { isEmpty, isEqual } from 'lodash';

import ApiService from '../../common/apiService.js';
import { ApiRoutes } from '../../utils/constants.js';
import { checkSession } from '../../utils/session.js';

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
        console.info('no model changes');
        return;
      }

      let payload = { ...this.fundingModel };
      this.setLoadedModel(this.fundingModel);

      let deleteFields = [];
      if (payload.hasClosedMonth !== 'yes') {
        for (let i = 1; i <= 12; i++) {
          deleteFields.push('closedIn' + i);
        }
      }

      if (payload.isSchoolProperty !== 'yes') {
        deleteFields.push('beforeSchool', 'afterSchool', 'beforeKindergarten', 'afterKindergarten');
        payload.isSchoolProperty = 0;
      } else {
        payload.isSchoolProperty = 1;
        ['beforeSchool', 'afterSchool', 'beforeKindergarten', 'afterKindergarten'].forEach((item) => {
          payload[item] = payload[item] ? 1 : 0;
        });
      }

      deleteFields.forEach((field) => delete payload[field]);

      console.log('save group funding', payload);
      let response = await ApiService.apiAxios.put(ApiRoutes.GROUP_FUND_AMOUNT + '/' + this.ccofBaseFundingId, payload);
      return response;
    },
    async loadFunding(fundingId) {
      this.setCcofBaseFundingId(fundingId);
      let model = this.getModelById(fundingId);
      if (model) {
        console.log('found model for guid: ', fundingId);
        this.setFundingModel(model);
        this.setLoadedModel(model);
      } else {
        checkSession();
        try {
          let response = await ApiService.apiAxios.get(ApiRoutes.GROUP_FUND_AMOUNT + '/' + fundingId);
          let model = response.data;
          if (model.familyLicenseType) {
            model.familyLicenseType = '' + model.familyLicenseType;
          }
          console.log('response', model);
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
