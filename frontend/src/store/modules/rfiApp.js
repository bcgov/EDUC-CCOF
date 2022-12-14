import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';
import { checkSession } from '@/utils/session';
import { getChanges } from '@/utils/validation';

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
        commit('setRfiModel', rfiModel);
        commit('setLoadedModel', rfiModel);
      } else {
        checkSession();
        try {
          let response = await ApiService.apiAxios.get(ApiRoutes.APPLICATION_RFI + '/' + ccfriId + '/rfi');
          commit('addRfiToStore', {ccfriId: ccfriId, model: response.data});
          commit('setRfiModel', response.data);
          commit('setLoadedModel', response.data);
        } catch(e) {
          console.log(`Failed to get existing RFI with error - ${e}`);
          throw e;
        }
      }
    },    
    async saveRfi({ state, commit, rootState }) {

      checkSession();
      const payload = getChanges(state.organizationModel, state.loadedModel);
      console.log('saveOrganization, payload', payload);
      if (!payload) {
        return; //No changes. so return from function
      }
      commit('setLoadedModel', state.organizationModel);

      if (state.organizationId) {
        // has an orgaization ID, so update the data
        try {
          let response = await ApiService.apiAxios.put(ApiRoutes.ORGANIZATION + '/' + state.organizationId, payload);
          commit('setIsOrganizationComplete', response.data?.isOrganizationComplete);
          return response;
        } catch (error) {
          console.log(`Failed to update existing Organization - ${error}`);
          throw error;
        }
      } else {
        // else create a new application and set the program year
        payload.programYearId = rootState.app.programYearList.current.programYearId;
        try {
          let response = await ApiService.apiAxios.post(ApiRoutes.ORGANIZATION, payload);
          commit('setOrganizationId', response.data?.organizationId);
          commit('setApplicationId', response.data?.applicationId);
          commit('setApplicationStatus', response.data?.applicationStatus);
          commit('setApplicationType', response.data?.applicationType);
          commit('setOrganizationProviderType', response.data?.organizationProviderType);
          commit('setIsOrganizationComplete', response.data?.isOrganizationComplete);
          return response;
        } catch (error) {
          console.log(`Failed to save new Organization - ${error}`);
          throw error;
        }
      }
    },
  },
};
