import ApiService from '@/common/apiService';
import {ApiRoutes} from '@/utils/constants';
import {checkSession} from '@/utils/session';


export default {
  namespaced: true,
  state: {
    changeActionId: 123,
    changeRequestId: undefined,
    unsubmittedDocuments: [],
    model: {},


  },
  getters: {
    changeActionId: state => state.changeActionId,
    changeRequestId: state => state.changeRequestId,
    unsubmittedDocuments: state => state.unsubmittedDocuments,
  },
  mutations: {
    model(state, value) {
      state.model = value;
    },
    setChangeActionId: (state, changeActionId) => {
      state.changeActionId = changeActionId;
    },
    setChangeRequestId: (state, changeRequestId) => {
      state.changeRequestId = changeRequestId;
    },
    setUnsubmittedDocuments: (state, unsubmittedDocuments) => {
      state.unsubmittedDocuments = unsubmittedDocuments || [];
    },
    setUploadedDocument: (state, document) => {
      state.unsubmittedDocuments = [...state.unsubmittedDocuments, document];
    },
  },
  actions: {
    async createChangeRequest({ state, commit, rootState }) {

      checkSession();
      let payload = {
        'applicationId': rootState.application.applicationId,
        'programYearId': rootState.application.programYearId,
        'providerType': 100000000
      };
      try {
        //commit('setLoadedFacilities', {...state.facilities});

        let response = await ApiService.apiAxios.post('http://localhost:8080/api/changeRequest/documents', payload);
        commit('setChangeActionId', response.data.changeActionId);
        commit('setChangeRequestId', response.data.changeRequestId);
        console.log(response);
        return response;
      } catch (error) {
        console.info(`Failed to create a change notification  - ${error}`);
        throw error;
      }

    }
  },

};
