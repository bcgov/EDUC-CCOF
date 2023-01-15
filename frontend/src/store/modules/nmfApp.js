import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';
import { checkSession } from '@/utils/session';
import { deepCloneObject } from '@/utils/common';
import { isEqual } from 'lodash';

export default {
  namespaced: true,
  state: {
    nmfModel: {},
    loadedModel: {},
    nmfStore: {},
  },
  mutations: {
    setNmfModel: (state, value) => { state.nmfModel = value; },
    setLoadedModel: (state, value) => { state.loadedModel = value; },
    addNmfToStore: (state, {ccfriId, model} ) => {
      if (ccfriId) {
        state.nmfStore[ccfriId] = model;  
      }
    },
  },
  getters: {
    getByCcfriId: (state) => (ccfriId) => { 
      return state.nmfStore[ccfriId];
    },
  },  

  actions: {
    async loadNmf({getters, commit}, ccfriId) {
      let nmfModel = getters.getByCcfriId(ccfriId);
      if (nmfModel) {
        console.log('found nmfmodel for ccfriId: ', ccfriId);
        commit('setNmfModel', nmfModel);
        commit('setLoadedModel', nmfModel);
      } else {
        checkSession();
        try {
          let response = await ApiService.apiAxios.get(ApiRoutes.APPLICATION_NMF + '/' + ccfriId + '/nmf');
          commit('addNmfToStore', {ccfriId: ccfriId, model: response.data});
          commit('setNmfModel', response.data);
          commit('setLoadedModel', response.data);
        } catch(e) {
          console.log(`Failed to get existing NMF with error - ${e}`);
          throw e;
        }
      }
    },    
    async saveNmf({ state, commit }, ccfriId) {

      checkSession();
      console.info(state.nmfModel);
      console.info(state.loadedModel);

      if (isEqual(state.nmfModel, state.loadedModel)) {
        console.info('no model changes');
        return;
      }

      commit('setLoadedModel', deepCloneObject(state.nmfModel));
      if (state.nmfModel?.nmfId) {
        // has a nmf ID, so update the data
        try {
          let response = await ApiService.apiAxios.put(ApiRoutes.APPLICATION_NMF + '/' + 'nmf/' + state.nmfModel?.nmfId, state.nmfModel);
          return response;
        } catch (error) {
          console.log(`Failed to update existing NMF - ${error}`);
          throw error;
        }
      } else {
        // else create a new RFI
        try {
          let response = await ApiService.apiAxios.post(ApiRoutes.APPLICATION_NMF + '/' + ccfriId + '/nmf', state.nmfModel);
          state.nmfModel.nmfId = response.data.nmfApplicationGuid;
          commit('addNmfToStore', {ccfriId: ccfriId, model: state.nmfModel});
          return response;
        } catch (error) {
          console.log(`Failed to save new NMF - ${error}`);
          throw error;
        }
      }
    },
  },
};
