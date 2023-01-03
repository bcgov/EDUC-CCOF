import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';
import { checkSession } from '@/utils/session';
import { getChanges } from '@/utils/validation';

export default {
  namespaced: true,
  state: {
    organizationId: null,
    applicationId: null,
    applicationStatus: null,
    applicationType: null,
    organizationType: null,
    organizationProviderType: null,
    isOrganizationComplete: false,
    isStarted: false,
    organizationModel: {},
    loadedModel: {},
  },
  mutations: {
    setOrganizationId: (state, organizationId) => { state.organizationId = organizationId; },
    setApplicationId: (state, applicationId) => { state.applicationId = applicationId; },
    setApplicationType: (state, applicationType) => { state.applicationType = applicationType; },
    setApplicationStatus: (state, applicationStatus) => { state.applicationStatus = applicationStatus; },
    setOrganizationProviderType: (state, organizationProviderType) => { state.organizationProviderType = organizationProviderType; },
    setIsStarted: (state, isStarted) => { state.isStarted = isStarted; },
    setOrganizationModel: (state, model) => { state.organizationModel = model; },
    setLoadedModel: (state, model) => { state.loadedModel = model; },
    setIsOrganizationComplete: (state, value) => { state.isOrganizationComplete = value; }
  },
  actions: {
    async saveOrganization({ state, commit, rootState }) {

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
    async renewApplication({ commit, state, rootState }) {
      checkSession();

      let payload = {
        providerType: state.organizationProviderType,
        programYearId: rootState.app.programYearList.future.programYearId,
        organizationId: state.organizationId,
      };
      console.log('renewApplication, payload', payload);
      try {
        const response = await ApiService.apiAxios.post(ApiRoutes.APPLICATION_RENEW, payload);
        commit('setApplicationId', response.data?.applicationId);
        return response;
      } catch (error) {
        console.log(`Failed to renew Application - ${error}`);
        throw error;
      }
    },

    async loadOrganization({ commit }, organizationId) {
      checkSession();

      try {
        let response = await ApiService.apiAxios.get(ApiRoutes.ORGANIZATION + '/' + organizationId);
        commit('setOrganizationModel', response.data);
        commit('setLoadedModel', response.data);
        commit('setIsOrganizationComplete', response.data?.isOrganizationComplete);
        console.log('response.data?.isOrganizationComplete', response.data?.isOrganizationComplete);
      } catch (error) {
        console.log(`Failed to get Organization - ${error}`);
        throw error;
      }
      
    }
  },
};
