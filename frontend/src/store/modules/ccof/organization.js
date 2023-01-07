import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';
import { checkSession } from '@/utils/session';
import { isEqual } from 'lodash';

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
    setOrganizationModel(state, model) { state.organizationModel = model; },
    setLoadedModel(state, model) { state.loadedModel = model; },
    setIsOrganizationComplete: (state, value) => { state.isOrganizationComplete = value; }
  },
  actions: {
    async saveOrganization({ state, commit, rootState }) {

      checkSession();

      if (isEqual({ ...state.organizationModel, providerType: null }, { ...state.loadedModel, providerType: null })) {
        console.info('no model changes');
        return;
      }

      const payload = { ...state.organizationModel };

      console.log('saveOrganization, payload', payload);

      if (state.organizationId) {
        // has an orgaization ID, so update the data
        try {
          let response = await ApiService.apiAxios.put(ApiRoutes.ORGANIZATION + '/' + state.organizationId, payload);
          commit('setOrganizationModel', response.data);
          commit('setLoadedModel', response.data);
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
          commit('setOrganizationModel', response.data);
          commit('setLoadedModel', response.data);
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
    async renewApplication({ commit, state, rootState, dispatch  }) {
      checkSession();

      let payload = {
        providerType: state.organizationProviderType,
        programYearId: rootState.app.programYearList.future.programYearId,
        organizationId: state.organizationId,
      };
      console.log('renewApplication, payload', payload);
      try {
        const response = await ApiService.apiAxios.post(ApiRoutes.APPLICATION_RENEW, payload);
        commit('auth/setIsUserInfoLoaded', false, { root: true });
        commit('organization/setIsStarted', false, { root: true });
        commit('eceweApp/setIsStarted', false, { root: true });
        // dispatch('auth/getUserInfo', null, { root: true });
  
        // commit('setApplicationId', response.data?.applicationId);
        // commit('setApplicationStatus', 'DRAFT');
        // commit('setApplicationType', 'RENEW');
        // commit('app/setIsLicenseUploadComplete', null, { root: true });
        // commit('app/setIsRenewal', true, { root: true });
        // let facilityList  = rootState.app.navBarList.map(({facilityId, facilityName, licenseNumber}) => ({facilityId, facilityName, licenseNumber}));
        // commit('app/bulkAddToNavNBar', facilityList, { root: true });

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
