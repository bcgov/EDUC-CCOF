import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';
import { checkSession } from '@/utils/session';

export default {
  namespaced: true,
  state: {
    isValidForm: undefined,
    model: {},

  },
  getters: {},  
  mutations: {
    model(state, value) {
      state.model = value;
    },
    isValidForm(state, value) {
      state.isValidForm = value;
    },
  },
  actions: {
    async loadDeclaration({ commit, rootState }) {
      checkSession();
      try {
        let payload = (await ApiService.apiAxios.get(ApiRoutes.APPLICATION_DECLARATION + '/' + rootState.application.applicationId)).data;
        commit('model', payload);
      } catch (error) {
        console.log(`Failed to get Declaration - ${error}`);
        throw error;
      }
    },
    async updateDeclaration({ commit, state, rootState}, reLockPayload) {
      checkSession();
      let payload = { agreeConsentCertify:state.model.agreeConsentCertify,
        orgContactName:state.model.orgContactName,
        declarationAStatus:state.model?.declarationAStatus,
        declarationBStatus:state.model?.declarationBStatus };
      try {
        if ((Object.keys(reLockPayload).length > 0)) {
          payload = {...payload, ...reLockPayload};
        }
        let response = await ApiService.apiAxios.patch(ApiRoutes.APPLICATION_DECLARATION_SUBMIT + '/' + rootState.application.applicationId, payload);
        commit('organization/setApplicationStatus', 'SUBMITTED', { root: true });
        commit('auth/setIsUserInfoLoaded', false, { root: true });
        return response;
      } catch (error) {
        console.log(`Failed to SUBMIT application - ${error}`);
        throw error;
      }
    },
  },
};
