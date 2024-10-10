import { defineStore } from 'pinia';
import { isEmpty, isEqual } from 'lodash';

import ApiService from '../common/apiService.js';
import { ApiRoutes } from '../utils/constants.js';
import { checkSession } from '../utils/session.js';
import { deepCloneObject } from '../utils/common.js';

export const useRfiAppStore = defineStore('rfiApp', {
  store: () => ({
    rfiModel: {
      expansionList: [],
      wageList: [],
      fundingList: [],
      expenseList: [],
      indigenousExpenseList: [],
    },
    loadedModel: {},
    rfiStore: {},
  }),
  getters: {
    getByCcfriId: (state) => (ccfriId) => {
      return state.rfiStore[ccfriId];
    },
  },
  actions: {
    setRfiModel(value) {
      this.rfiModel = value;
    },
    setLoadedModel(value) {
      this.loadedModel = value;
    },
    addRfiToStore({ ccfriId, model }) {
      if (ccfriId) {
        this.rfiStore[ccfriId] = model;
      }
    },
    async loadRfi(ccfriId) {
      console.log('loading RFI for: ', ccfriId);
      let rfiModel = this.getByCcfriId(ccfriId);
      if (rfiModel) {
        this.setRfiModel(rfiModel);
        this.setLoadedModel(deepCloneObject(rfiModel));
      } else {
        checkSession();
        try {
          let response = await ApiService.apiAxios.get(ApiRoutes.APPLICATION_RFI + '/' + ccfriId + '/rfi');
          console.info(response);
          if (!isEmpty(response.data)) {
            this.addRfiToStore({ ccfriId: ccfriId, model: response.data });
            this.setRfiModel(response.data);
            this.setLoadedModel(deepCloneObject(response.data));
          } else {
            let rfi = {
              expansionList: [],
              wageList: [],
              fundingList: [],
              expenseList: [],
              indigenousExpenseList: [],
            };
            this.addRfiToStore({ ccfriId: ccfriId, model: rfi });
            this.setRfiModel(rfi);
            this.setLoadedModel(deepCloneObject(rfi));
          }
        } catch (e) {
          console.log(`Failed to get existing RFI with error - ${e}`);
          throw e;
        }
      }
    },
    async saveRfi({ ccfriId, isRfiComplete }) {
      checkSession();

      if (isEqual({ ...this.rfiModel }, { ...this.loadedModel })) {
        console.info('no model changes');
        return;
      }

      let rfiPayloadModel = deepCloneObject(this.rfiModel);
      rfiPayloadModel.isRfiComplete = isRfiComplete;
      if (!rfiPayloadModel.ccfriApplicationId) {
        rfiPayloadModel.ccfriApplicationId = ccfriId;
      }
      if (isEqual({ ...this.rfiModel.expansionList }, { ...this.loadedModel.expansionList })) {
        rfiPayloadModel.expansionList = undefined;
      }
      if (isEqual({ ...this.rfiModel.wageList }, { ...this.loadedModel.wageList })) {
        rfiPayloadModel.wageList = undefined;
      }
      if (isEqual({ ...this.rfiModel.fundingList }, { ...this.loadedModel.fundingList })) {
        rfiPayloadModel.fundingList = undefined;
      }
      if (isEqual({ ...this.rfiModel.expenseList }, { ...this.loadedModel.expenseList })) {
        rfiPayloadModel.expenseList = undefined;
      }
      if (isEqual({ ...this.rfiModel.indigenousExpenseList }, { ...this.loadedModel.indigenousExpenseList })) {
        rfiPayloadModel.indigenousExpenseList = undefined;
      }

      this.setLoadedModel(deepCloneObject(this.rfiModel));

      if (this.rfiModel?.rfiId) {
        // has a rfi ID, so update the data
        try {
          await ApiService.apiAxios.put(
            ApiRoutes.APPLICATION_RFI + '/' + 'rfi/' + this.rfiModel?.rfiId,
            rfiPayloadModel,
          );
          this.addRfiToStore({ ccfriId: ccfriId, model: this.rfiModel });
          return null;
        } catch (error) {
          console.log(`Failed to update existing RFI - ${error}`);
          throw error;
        }
      } else {
        // else create a new RFI
        try {
          let response = await ApiService.apiAxios.post(
            ApiRoutes.APPLICATION_RFI + '/' + ccfriId + '/rfi',
            rfiPayloadModel,
          );
          this.rfiModel.rfiId = response.data?.friApplicationGuid;
          this.addRfiToStore({ ccfriId: ccfriId, model: this.rfiModel });
          return response.data?.friApplicationGuid;
        } catch (error) {
          console.log(`Failed to save new RFI - ${error}`);
          throw error;
        }
      }
    },
  },
});
