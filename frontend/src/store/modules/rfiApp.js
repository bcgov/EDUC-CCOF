import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';
import { checkSession } from '@/utils/session';
import {isEmpty, isEqual} from 'lodash';
import {deepCloneObject} from '@/utils/common';

export default {
  namespaced: true,
  state: {
    rfiModel: {
      expansionList: [],
      wageList: [],
      fundingList: [],
      expenseList: [],
      indigenousExpenseList: []
    },
    loadedModel: {},
    rfiStore: {},
  },
  mutations: {
    setRfiModel: (state, value) => { state.rfiModel = value; },
    setLoadedModel: (state, value) => { state.loadedModel = value; },
    addRfiToStore: (state, {ccfriId, model} ) => {
      if (ccfriId) {
        state.rfiStore[ccfriId] = model;
      }
    },
  },
  getters: {
    getByCcfriId: (state) => (ccfriId) => {
      return state.rfiStore[ccfriId];
    },
  },

  actions: {
    async loadRfi({getters, commit}, ccfriId) {
      console.log('loading RFI for: ', ccfriId);
      let rfiModel = getters.getByCcfriId(ccfriId);
      if (rfiModel) {
        commit('setRfiModel', rfiModel);
        commit('setLoadedModel', deepCloneObject(rfiModel));
      } else {
        checkSession();
        try {
          let response = await ApiService.apiAxios.get(ApiRoutes.APPLICATION_RFI + '/' + ccfriId + '/rfi');
          console.info(response);
          if (!isEmpty(response.data)) {
            commit('addRfiToStore', {ccfriId: ccfriId, model: response.data});
            commit('setRfiModel', response.data);
            commit('setLoadedModel', deepCloneObject(response.data));
          } else {
            let rfi =  {
              expansionList: [],
              wageList: [],
              fundingList: [],
              expenseList: [],
              indigenousExpenseList: []
            };
            commit('addRfiToStore', {ccfriId: ccfriId, model: rfi});
            commit('setRfiModel', rfi);
            commit('setLoadedModel', deepCloneObject(rfi));
          }
        } catch(e) {
          console.log(`Failed to get existing RFI with error - ${e}`);
          throw e;
        }
      }
    },
    async saveRfi({ state, commit},{ccfriId, isRfiComplete}) {

      checkSession();

      if (isEqual({ ...state.rfiModel }, { ...state.loadedModel})) {
        console.info('no model changes');
        return;
      }

      let rfiPayloadModel  = deepCloneObject(state.rfiModel);
      rfiPayloadModel.isRfiComplete = isRfiComplete;
      if (!rfiPayloadModel.ccfriApplicationId) {
        rfiPayloadModel.ccfriApplicationId = ccfriId;
      }
      if (isEqual({ ...state.rfiModel.expansionList }, { ...state.loadedModel.expansionList})) {
        rfiPayloadModel.expansionList = undefined;
      }
      if (isEqual({ ...state.rfiModel.wageList }, { ...state.loadedModel.wageList})) {
        rfiPayloadModel.wageList = undefined;
      }
      if (isEqual({ ...state.rfiModel.fundingList }, { ...state.loadedModel.fundingList})) {
        rfiPayloadModel.fundingList = undefined;
      }
      if (isEqual({ ...state.rfiModel.expenseList }, { ...state.loadedModel.expenseList})) {
        rfiPayloadModel.expenseList = undefined;
      }
      if (isEqual({ ...state.rfiModel.indigenousExpenseList }, { ...state.loadedModel.indigenousExpenseList})) {
        rfiPayloadModel.indigenousExpenseList = undefined;
      }

      
      commit('setLoadedModel', deepCloneObject(state.rfiModel));
      
      if (state.rfiModel?.rfiId) {
        // has a rfi ID, so update the data
        try {
          await ApiService.apiAxios.put(ApiRoutes.APPLICATION_RFI + '/' + 'rfi/' + state.rfiModel?.rfiId, rfiPayloadModel);
          commit('addRfiToStore', {ccfriId: ccfriId, model: state.rfiModel});
          return null;
        } catch (error) {
          console.log(`Failed to update existing RFI - ${error}`);
          throw error;
        }
      } else {
        // else create a new RFI
        try {
          let response = await ApiService.apiAxios.post(ApiRoutes.APPLICATION_RFI+ '/' + ccfriId + '/rfi', rfiPayloadModel);
          state.rfiModel.rfiId = response.data?.friApplicationGuid;
          commit('addRfiToStore', {ccfriId: ccfriId, model: state.rfiModel});
          return response.data?.friApplicationGuid;
        } catch (error) {
          console.log(`Failed to save new RFI - ${error}`);
          throw error;
        }
      }
    },
  },
};
