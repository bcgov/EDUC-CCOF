import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';
import { checkSession } from '@/utils/session';
import {isEqual} from 'lodash';
import {deepCloneObject} from '@/utils/common';

export default {
  namespaced: true,
  state: {
    rfiModel: {},
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
      let rfiModel = getters.getByCcfriId(ccfriId);
      if (rfiModel) {
        console.log('found rfimodel for ccfriId: ', ccfriId);
        console.log('found rfimodel for  ', rfiModel);
        commit('setRfiModel', rfiModel);
        commit('setLoadedModel', deepCloneObject(rfiModel));
      } else {
        checkSession();
        try {
          let response = await ApiService.apiAxios.get(ApiRoutes.APPLICATION_RFI + '/' + ccfriId + '/rfi');
          console.info(response);
          commit('addRfiToStore', {ccfriId: ccfriId, model: response.data});
          commit('setRfiModel', response.data);
          commit('setLoadedModel', deepCloneObject(response.data));
        } catch(e) {
          console.log(`Failed to get existing RFI with error - ${e}`);
          throw e;
        }
      }
    },
    async saveRfi({ state, commit},ccfriId) {

      checkSession();
      console.info(state.rfiModel);
      console.info(state.loadedModel);

      // if (isEqual({ ...state.rfiModel }, { ...state.loadedModel})) {
      //   console.info('no model changes');
      //   return;
      // }
      commit('setLoadedModel', deepCloneObject(state.rfiModel));
      if (state.rfiModel?.rfiId) {
        // has a rfi ID, so update the data
        try {
          let response = await ApiService.apiAxios.put(ApiRoutes.APPLICATION_RFI + '/' + 'rfi/' + state.rfiModel?.rfiId, state.rfiModel);
          return response;
        } catch (error) {
          console.log(`Failed to update existing RFI - ${error}`);
          throw error;
        }
      } else {
        // else create a new RFI
        try {
          let response = await ApiService.apiAxios.post(ApiRoutes.APPLICATION_RFI+ '/' + ccfriId + '/rfi', state.rfiModel);
          state.rfiModel.rfiId = response.data;
          commit('addRfiToStore', {ccfriId: ccfriId, model: state.rfiModel});
          return response;
        } catch (error) {
          console.log(`Failed to save new RFI - ${error}`);
          throw error;
        }
      }
    },
  },
};
