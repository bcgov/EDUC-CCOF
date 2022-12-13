import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';
import { checkSession } from '@/utils/session';

export default {
  namespaced: true,
  state: {
    organizationId: null,
    applicationId: null,
    applicationStatus: null,
    organizationType: null,
    providerType: null,
    isOrganizationComplete: false,
    isStarted: false,
    organizationModel: {}
  },
  mutations: {
    setOrganizationId: (state, organizationId) => { state.organizationId = organizationId; },
    setApplicationId: (state, applicationId) => { state.applicationId = applicationId; },
    setApplicationStatus: (state, applicationStatus) => { state.applicationStatus = applicationStatus; },
    setIsStarted: (state, isStarted) => { state.isStarted = isStarted; },
    setOrganizationModel: (state, model) => { state.organizationModel = model; },
    setIsOrganizationComplete: (state, value) => { state.isOrganizationComplete = value; }
  },
  actions: {
    async saveOrganization({ state, commit, rootState }) {

      checkSession();

      let payload = { ...state.organizationModel };

      delete payload['applicationStatus']; //TODO: verify no need to include status as it will be set automatically.
      console.log('saveOrganization, payload', payload);

      if (state.organizationId) {
        // has an orgaization ID, so update the data
        try {
          let response = await ApiService.apiAxios.put(ApiRoutes.ORGANIZATION + '/' + state.organizationId, payload);
          commit('setOrganizationModel', response.data);
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
          commit('setOrganizationModel', response.data);
          return response;
        } catch (error) {
          console.log(`Failed to save new Organization - ${error}`);
          throw error;
        }
      }
    },
    async loadOrganization({ commit }, organizationId) {
      checkSession();

      try {
        let response = await ApiService.apiAxios.get(ApiRoutes.ORGANIZATION + '/' + organizationId);
        commit('setOrganizationModel', response.data);
        commit('setIsOrganizationComplete', response.data?.isOrganizationComplete);
        console.log('response.data?.isOrganizationComplete', response.data?.isOrganizationComplete);
      } catch (error) {
        console.log(`Failed to get Organization - ${error}`);
        throw error;
      }
      
    }
  },
};
