import ApiService from '@/common/apiService';
import {ApiRoutes} from '@/utils/constants';
import {checkSession} from '@/utils/session';
import {isEmpty} from 'lodash';
import {deepCloneObject} from '@/utils/common';


//TODO : remove unneeded state vars after restructure

//change REQUEST guid is what we need for saving and loading. Change action guid does...?
export default {
  namespaced: true,
  state: {
    changeRequestId: undefined,
    unsubmittedDocuments: [],
    model: {},
    changeActionStore : {},
    uploadedDocuments: []


  },
  getters: {
    changeActionStore: state => state.changeActionStore,
    changeActions: state => state.changeActions,
    changeRequestId: state => state.changeRequestId,
    unsubmittedDocuments: state => state.unsubmittedDocuments,
    getUploadedDocuments: state => state.uploadedDocuments,
  },
  mutations: {
    model(state, value) {
      state.model = value;
    },
    addChangeActionToStore: (state, {changeRequestId, model} ) => {
      if (changeRequestId) {
        state.changeActionStore[changeRequestId] = model;
      }
    },
    setChangeRequestId: (state, changeRequestId) => {
      state.changeRequestId = changeRequestId;
    },
    setUnsubmittedDocuments: (state, unsubmittedDocuments) => {
      state.unsubmittedDocuments = unsubmittedDocuments || [];
    },
    setUploadedDocument: (state, documents) => {
      state.uploadedDocuments = documents;
    },

    // setUploadedDocument: (state, document) => {
    //   state.unsubmittedDocuments = [...state.unsubmittedDocuments, document];
    // },
    //    this is what sukanya had, orig. Changing above for now, leaving for ref.
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
            commit('addChangeActionToStore', {changeRequestId: element.changeRequestId, model: element});
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

    //TODO: add it to the store
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

        commit('setChangeRequestId', response.data.changeRequestId);
        console.log(response);
        return response;
      } catch (error) {
        console.info(`Failed to create a change notification  - ${error}`);
        throw error;
      }

    },
    async deleteChangeRequest({state, getters, commit}, changeRequestId) {
      console.log('trying to delete req for: ', changeRequestId);

      checkSession();

      try {
        console.log('');
        let response = await ApiService.apiAxios.delete(ApiRoutes.CHANGE_REQUEST + '/' + changeRequestId);
        console.log(response);
        delete state.changeActionStore[changeRequestId];
      } catch(e) {
        console.log(`Failed to delete change reqz with error - ${e}`);
        throw e;
      }
    },

    //to load the documents, you need the change action ID. Everything else so far... you need the change REQUEST ID. idk why
    //change action id will return arr of docs
    async loadChangeRequestDocs({getters, commit}, changeActionId) {
      console.log('loading change req DOCS for: ', changeActionId);

      checkSession();

      try {
        console.log('');
        let response = await ApiService.apiAxios.get(ApiRoutes.CHANGE_REQUEST + '/documents/' + changeActionId);
        //console.log(response.data);

        commit('setUploadedDocument', response.data);
        if (!isEmpty(response.data)) {



          //commit('setLoadedModel', deepCloneObject(response.data));
        }
         else {


        commit('setUploadedDocument', response.data);
        //   commit('setLoadedModel', deepCloneObject(rfi));
         }
      } catch(e) {
        console.log(`Failed to get load change reqz with error - ${e}`);
        throw e;
      }
    },

    // eslint-disable-next-line no-unused-vars
    async saveUploadedDocuments({state, rootState}, payload) {

      console.log('this is the payload:');
      console.log(payload);
      console.log('save uploaded documents called');
      try {
        let response = await ApiService.apiAxios.post(ApiRoutes.CHANGE_REQUEST + 'documentUpload', payload);
        console.log('save uploaded documents called');
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },

};
