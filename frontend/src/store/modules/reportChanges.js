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
    changeRequestStore : {},
    uploadedDocuments: []


  },
  getters: {
    changeRequestStore: state => state.changeRequestStore,
    changeActions: state => state.changeActions,
    changeRequestId: state => state.changeRequestId,
    getUploadedDocuments: state => state.uploadedDocuments,
  },
  mutations: {
    addChangeRequestToStore: (state, {changeRequestId, model} ) => {
      if (changeRequestId) {
        state.changeRequestStore[changeRequestId] = model;
      }
    },
    setChangeRequestId: (state, changeRequestId) => {
      state.changeRequestId = changeRequestId;
    },
    setUploadedDocument: (state, documents) => {
      state.uploadedDocuments = documents;
    },
  },
  actions: {
    async loadChangeRequest({getters, commit, rootState}, ) {

      //is it better/ worse to load from route state vs. passing in application ID?
      console.log('loading change req for: ', rootState.application.applicationId);

      checkSession();

      try {
        console.log('');
        let response = await ApiService.apiAxios.get(ApiRoutes.APPLICATION_CHANGE_REQUEST + '/' + rootState.application.applicationId);
        console.log(response);
        if (!isEmpty(response.data)) {
          response.data.forEach(element => {
            commit('addChangeRequestToStore', {changeRequestId: element.changeRequestId, model: element});
          });
        }

        console.log('No change requests found.'); //it says this when I load from the router... but then it is actually loaded. Timing issue?
      } catch(e) {
        console.log(`Failed to get load change req with error - ${e}`);
        throw e;
      }
    },

    //TODO: add it to the store
    async createChangeRequest({ state, commit, rootState }) {

      checkSession();
      let payload = {
        'applicationId': rootState.application.applicationId,
        'programYearId': rootState.application.programYearId,
        'providerType': rootState.organization.organizationProviderType == 'GROUP' ?  100000000 : 100000001,
      };
      try {
        let response = await ApiService.apiAxios.post('http://localhost:8080/api/changeRequest/documents', payload);

        commit('setChangeRequestId', response.data.changeRequestId);
        console.log(response);
        return response.data;
      } catch (error) {
        console.info(`Failed to create a change request  - ${error}`);
        throw error;
      }

    },
    async deleteChangeRequest({state, getters, commit}, changeRequestId) {
      console.log('trying to delete req for: ', changeRequestId);

      checkSession();

      try {
        let response = await ApiService.apiAxios.delete(ApiRoutes.CHANGE_REQUEST + '/' + changeRequestId);
        console.log(response);
        delete state.changeRequestStore[changeRequestId];
      } catch(e) {
        console.log(`Failed to delete change req with error - ${e}`);
        throw e;
      }
    },

    //to load the documents, you need the change action ID. Everything else so far... you need the change REQUEST ID.
    //change action id will return arr of docs
    async loadChangeRequestDocs({getters, commit}, changeActionId) {
      console.log('loading change req DOCS for: ', changeActionId);

      checkSession();

      try {
        let response = await ApiService.apiAxios.get(ApiRoutes.CHANGE_REQUEST + '/documents/' + changeActionId);
        //console.log(response.data);

        commit('setUploadedDocument', response.data);
      } catch(e) {
        console.log(`Failed to get load req docs with error - ${e}`);
        throw e;
      }
    },

    // eslint-disable-next-line no-unused-vars
    async saveUploadedDocuments({state, rootState}, payload) {
      console.log('save uploaded documents called');
      console.log('this is the payload:');
      console.log(payload);

      //testing the endpoint
      // let obj = [{
      //   "ccof_change_requestid":"04cb1f2f-82eb-ed11-a7c6-000d3a09d699",
      //   "filename":"smallPinkPixels.jpg",
      //   "subject":"NOTIFICATION_FORM",
      //   "documentbody":"iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAIAAAB7QOjdAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAPSURBVBhXY/i/7uT/dScBEa0E7bj5DnsAAAAASUVORK5CYII=",
      // }];
      try {
        let response = await ApiService.apiAxios.post(ApiRoutes.CHANGE_REQUEST + '/documentUpload', payload);
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    //we can use the Supporting Doc route here because dynamics doc delete works off annotation ID - it does not have a different endpoint
    async deleteDocuments({state}, deletedFiles){
      console.log('DELETE files payload:' , deletedFiles);
      try {
        await ApiService.apiAxios.delete(ApiRoutes.SUPPORTING_DOCUMENT_UPLOAD, { data: deletedFiles} );
        console.log('delete uploaded documents called');
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  },

};
