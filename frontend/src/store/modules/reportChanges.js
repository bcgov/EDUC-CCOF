import ApiService from '@/common/apiService';
import {ApiRoutes} from '@/utils/constants';
import {checkSession} from '@/utils/session';
import {isEmpty} from 'lodash';
import {deepCloneObject} from '@/utils/common';


//TODO : remove unneeded state vars after restructure
export default {
  namespaced: true,
  state: {
    changeRequestId: undefined,
    unsubmittedDocuments: [],
    model: {},
    changeActionStore : {},


  },
  getters: {
    changeActionStore: state => state.changeActionStore,
    changeActions: state => state.changeActions,
    changeRequestId: state => state.changeRequestId,
    unsubmittedDocuments: state => state.unsubmittedDocuments,
  },
  mutations: {
    model(state, value) {
      state.model = value;
    },
    addChangeActionToStore: (state, {changeActionId, model} ) => {
      if (changeActionId) {
        state.changeActionStore[changeActionId] = model;
      }
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
    async loadChangeRequest({getters, commit}, applicationId) {
      console.log('loading change req for: ', applicationId);

      checkSession();

      try {
        console.log('');
        let response = await ApiService.apiAxios.get(ApiRoutes.APPLICATION_CHANGE_REQUEST + '/' + applicationId);
        console.log(response);
        if (!isEmpty(response.data)) {

          response.data.forEach(element => {
            commit('addChangeActionToStore', {changeActionId: element.changeRequestId, model: element});
          });


          //commit('setLoadedModel', deepCloneObject(response.data));
        }
        // else {

        //   commit('addRfiToStore', {ccfriId: ccfriId, model: rfi});
        //   commit('setRfiModel', rfi);
        //   commit('setLoadedModel', deepCloneObject(rfi));
        // }
      } catch(e) {
        console.log(`Failed to get load change reqz with error - ${e}`);
        throw e;
      }
    },


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
