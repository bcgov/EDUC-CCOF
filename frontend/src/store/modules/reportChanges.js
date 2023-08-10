import ApiService from '@/common/apiService';
import {ApiRoutes} from '@/utils/constants';
import {checkSession} from '@/utils/session';
import {isEmpty, update} from 'lodash';
import { CHANGE_REQUEST_TYPES } from '@/utils/constants';

/*
change REQUEST guid is what we need for saving and loading.
A change request can have MANY change actions.
IE: one change request to add a new facility, may have multiple change ACTIONS to add a facility.
*/
export default {
  namespaced: true,
  state: {
    changeRequestId: undefined,
    changeActionId: undefined,
    loadedChangeRequest: undefined,
    changeRequestStore : {},
    uploadedDocuments: [],
    newFacilityList: [], //may not need this now
    userProfileChangeRequests: [],
    mtfiFacilities: [],
  },
  getters: {
    changeRequestStore: state => state.changeRequestStore,
    changeActions: state => state.changeActions,
    changeRequestId: state => state.changeRequestId,
    loadedChangeRequest: state => state.loadedChangeRequest,
    getUploadedDocuments: state => state.uploadedDocuments,
    getChangeRequestFacilities: state => state.newFacilityList,
    // eslint-disable-next-line no-unused-vars
    isCREceweComplete: (state, getters, rootState) => {
      return state.userProfileChangeRequests.find(el => el.changeRequestId === rootState.navBar.changeRequestId)?.isEceweComplete;
    },
    // eslint-disable-next-line no-unused-vars
    isCRLicenseComplete: (state, getters, rootState) => {
      return state.userProfileChangeRequests.find(el => el.changeRequestId === rootState.navBar.changeRequestId)?.isLicenseUploadComplete;
    },
    // eslint-disable-next-line no-unused-vars
    changeRequestStatus: (state, getters, rootState) => {
      return state.userProfileChangeRequests.find(el => el.changeRequestId === rootState.navBar.changeRequestId)?.externalStatus;
    },
    // eslint-disable-next-line no-unused-vars
    isCCOFUnlocked:(state,getters,rootState) => {
      return state.userProfileChangeRequests.find(el => el.changeRequestId === rootState.navBar.changeRequestId)?.unlockCCOF;
    },
    // eslint-disable-next-line no-unused-vars
    isEceweUnlocked:(state,getters,rootState) => {
      return state.userProfileChangeRequests.find(el => el.changeRequestId === rootState.navBar.changeRequestId)?.unlockEcewe;
    },
    // eslint-disable-next-line no-unused-vars
    isLicenseUploadUnlocked:(state,getters,rootState) => {
      return state.userProfileChangeRequests.find(el => el.changeRequestId === rootState.navBar.changeRequestId)?.unlockLicenseUpload;
    },
    // eslint-disable-next-line no-unused-vars
    isSupportingDocumentsUnlocked:(state,getters,rootState) => {
      return state.userProfileChangeRequests.find(el => el.changeRequestId === rootState.navBar.changeRequestId)?.unlockSupportingDocuments;
    },
    // eslint-disable-next-line no-unused-vars
    isDeclarationUnlocked:(state,getters,rootState) => {
      return state.userProfileChangeRequests.find(el => el.changeRequestId === rootState.navBar.changeRequestId)?.unlockDeclaration;
    },
    // eslint-disable-next-line no-unused-vars
    isChangeRequestUnlocked:(state,getters,rootState) => {
      return state.userProfileChangeRequests.find(el => el.changeRequestId === rootState.navBar.changeRequestId)?.unlockChangeRequest;
    },
    // eslint-disable-next-line no-unused-vars
    isOtherDocumentsUnlocked:(state,getters,rootState) => {
      return state.userProfileChangeRequests.find(el => el.changeRequestId === rootState.navBar.changeRequestId)?.unlockOtherChangesDocuments;
    },
    // eslint-disable-next-line no-unused-vars
    getChangeNotificationActionId:(state,getters,rootState) => {
      return state.userProfileChangeRequests.find(el => el.changeRequestId === rootState.navBar.changeRequestId)?.changeNotificationActionId;
    }
  },
  mutations: {
    addChangeRequestToStore: (state, {changeRequestId, model} ) => {
      if (changeRequestId) {
        state.changeRequestStore[changeRequestId] = model;
      }
    },//prob take this out
    setChangeRequestStore: (state, model) => {
      state.changeRequestStore = model;
    },
    setChangeRequestId: (state, changeRequestId) => {
      state.changeRequestId = changeRequestId;
    },
    setChangeActionId: (state, changeActionId) => {
      state.changeActionId = changeActionId;
    },
    setLoadedChangeRequest: (state, loadedChangeRequest) => {
      state.loadedChangeRequest = loadedChangeRequest;
    },
    setUploadedDocument: (state, documents) => {
      state.uploadedDocuments = documents;
    },
    setNewFacilityList:(state, newFacilityList) => {
      state.newFacilityList = newFacilityList;
    },//may not need this now
    setUserProfileChangeRequests:(state, value) => {
      state.userProfileChangeRequests = value;
    },
    addUserProfileChangeRequests:(state, value) => {
      const item = {
        changeRequestId: value,
        externalStatus: 'INCOMPLETE'
      };
      state.userProfileChangeRequests.push(item);
    },
    setCRIsEceweComplete:(state, value) => {
      const index = state.userProfileChangeRequests.findIndex(el => el.changeRequestId === value.changeRequestId);
      if (index > -1) {
        let item = state.userProfileChangeRequests[index];
        item.isEceweComplete = value.isComplete;
        state.userProfileChangeRequests.splice(index, 1, item); // done to trigger reactive getter
      }
    },
    setCRIsLicenseComplete:(state, value) => {
      const index = state.userProfileChangeRequests.findIndex(el => el.changeRequestId === value.changeRequestId);
      if (index > -1) {
        let item = state.userProfileChangeRequests[index];
        item.isLicenseUploadComplete = value.isComplete;
        state.userProfileChangeRequests.splice(index, 1, item); // done to trigger reactive getter
      }
    },
    addChangeNotificationId:(state, value) => {
      const index = state.userProfileChangeRequests.findIndex(el => el.changeRequestId === value.changeRequestId);
      if (index > -1) {
        let item = state.userProfileChangeRequests[index];
        item.changeNotificationActionId = value.changeNotificationActionId;
        state.userProfileChangeRequests.splice(index, 1, item); // done to trigger reactive getter
      }
    },
    deleteChangeNotificationId:(state, value) => {
      const index = state.userProfileChangeRequests.findIndex(el => el.changeRequestId === value.changeRequestId);
      if (index > -1) {
        let item = state.userProfileChangeRequests[index];
        delete item.changeNotificationActionId;
        state.userProfileChangeRequests.splice(index, 1, item); // done to trigger reactive getter
      }
    },
    setMTFIFacilities:(state, value) => {
      state.mtfiFacilities = value;
    },
    addToMtfiFacilities: (state, payload) => {
      payload?.forEach(facility => state.mtfiFacilities.push(facility));
    },
  },
  actions: {
    // GET a list of all Change Requests for an application using applicationID
    async loadChangeRequest({commit, rootState}, ) {

      //is it better/ worse to load from route state vs. passing in application ID?
      console.log('loading change req for: ', rootState.application.applicationId);

      checkSession();
      let store = [];
      try {
        let response = await ApiService.apiAxios.get(ApiRoutes.APPLICATION_CHANGE_REQUEST + '/' + rootState.application.applicationId);
        //console.log(response);

        let newFacList = [];
        if (!isEmpty(response.data)) {
          response.data.forEach(element => {
            element.createdOnDate = new Date(element.createdOnDate).toLocaleDateString();
            store.push(element);
            //in the future we may not want to assume a new facility change is not the first of the array?

            element.changeActions.forEach((changeAction) => {
              if (changeAction.changeType == "NEW_FACILITY"){
                newFacList.push(changeAction); //we may not need this now

                //set New Facility change request ID in nav bar so we can filter by it.
                //we may not need to set it here, depends what Hoang is doing on dynamics side.
                commit('navBar/setNavBarFacilityChangeRequest', {facilityId: changeAction.facilityId, changeRequestFacilityId: changeAction.changeRequestFacilityId}, { root: true });

              }
            });

          });

          commit('setNewFacilityList', newFacList);
          //may not need this either
        }

        /*Ministry requirements want change request shown in the order of:
          Action Required
          In Progress
          All others
          priority numbers are arbitrary
        */
        store.sort((a , b) => {
          a.externalStatus === 3? a.priority = 99 : a.externalStatus === 1? a.priority = 98 : a.priority = a.externalStatus;
          b.externalStatus === 3? b.priority = 99 : b.externalStatus === 1? b.priority = 98 : b.priority = b.externalStatus;
          return b.priority - a.priority;
        });

        commit('setChangeRequestStore', store);
        console.log('sorted store:' , store);
      } catch(e) {
        console.log(`Failed to get load change req with error - ${e}`);
        throw e;
      }
    },

    // GET Change Request's details using changeRequestID
    async getChangeRequest({commit}, changeRequestId) {
      console.log('trying to get change req for: ', changeRequestId);
      checkSession();
      try {
        let response = (await ApiService.apiAxios.get(ApiRoutes.CHANGE_REQUEST + '/' + changeRequestId))?.data;
        console.log('THIS IS CHANGE REQUEST RESPONSE = ');
        console.log(response);
        commit('setLoadedChangeRequest', response);
        commit('setChangeRequestId', response?.changeRequestId);
        commit('setChangeActionId', response?.changeActions[0]?.changeActionId);
        let mtfiChangeActions =  response?.changeActions?.filter(changeAction => changeAction.changeType == CHANGE_REQUEST_TYPES.PARENT_FEE_CHANGE);
        mtfiChangeActions?.forEach(changeAction => commit('addToMtfiFacilities', changeAction.mtfi));
        return response;
      } catch(e) {
        console.log(`Failed to get change request with error - ${e}`);
        throw e;
      }
    },

    //TODO: add it to the store
    async createChangeRequest({commit, rootState }, changeType) {

      console.log('creating a change REQ');

      checkSession();
      let payload = {
        'applicationId': rootState.application.applicationId,
        'programYearId': rootState.application.programYearId,
        'providerType': rootState.organization.organizationProviderType == 'GROUP' ?  100000000 : 100000001,
        'changeType' : changeType,
      };
      try {
        let response = await ApiService.apiAxios.post('/api/changeRequest/documents', payload);

        commit('setChangeRequestId', response?.data?.changeRequestId);
        commit('setChangeActionId', response?.data?.changeActionId);
        console.log(response);
        return response.data;
      } catch (error) {
        console.info(`Failed to create a change request  - ${error}`);
        throw error;
      }

    },
    async deleteChangeRequest({state, commit}, changeRequestId) {
      console.log('trying to delete req for: ', changeRequestId);
      checkSession();
      try {
        await ApiService.apiAxios.delete(ApiRoutes.CHANGE_REQUEST + '/' + changeRequestId);
        let index = state.changeRequestStore.findIndex(changeRec => changeRec.changeRequestId === changeRequestId);
        if (index > -1)
          state.changeRequestStore.splice(index, 1);
        commit('setChangeRequestStore', state.changeRequestStore);
      } catch(e) {
        console.log(`Failed to delete change req with error - ${e}`);
        throw e;
      }
    },
    async createChangeAction({commit, rootState }, {changeRequestId, type }) {
      console.log('creating change Type');
      checkSession();
      try {
        let response = await ApiService.apiAxios.post(`/api/changeRequest/${changeRequestId}/${type}`);
        console.log(response);
        return response.data;
      } catch (error) {
        console.info(`Failed to create a change request  - ${error}`);
        throw error;
      }

    },

    async deleteChangeAction({state, commit}, changeActionId) {
      console.log('trying to delete changeActionId: ', changeActionId);
      checkSession();
      try {
        await ApiService.apiAxios.delete(ApiRoutes.CHANGE_REQUEST + '/changeAction/' + changeActionId);
      } catch(e) {
        console.log(`Failed to delete change action with error - ${e}`);
        throw e;
      }
    },

    async cancelChangeRequest({state, commit}, changeRequestId) {
      console.log('CANCEL Change request: ', changeRequestId);
      checkSession();
      if (changeRequestId){
        try {
          let payload = {
            externalStatus: 6,
          };
          let response = await ApiService.apiAxios.patch(ApiRoutes.CHANGE_REQUEST + '/' + changeRequestId, payload);
          let indexChangeRequestStore = state.changeRequestStore?.findIndex(changeRequest => changeRequest.changeRequestId == changeRequestId);
          if (indexChangeRequestStore > -1) {
            state.changeRequestStore[indexChangeRequestStore].externalStatus = 6;
            commit('setChangeRequestStore', state.changeRequestStore);
          };
          let indexUserProfileCR = state.userProfileChangeRequests?.findIndex(changeRequest => changeRequest.changeRequestId == changeRequestId);
          if (indexUserProfileCR > -1) {
            state.userProfileChangeRequests[indexUserProfileCR].externalStatus = 'CANCELLED'; 
            commit('setUserProfileChangeRequests', state.userProfileChangeRequests);
          }
          return response;
        } catch (e) {
          console.log(`Failed to cancel change request with error - ${e}`);
          throw e;
        }
      }
    },

    //to load the documents, you need the change action ID. Everything else so far... you need the change REQUEST ID.
    //change action id will return arr of docs
    async loadChangeRequestDocs({commit}, changeActionId) {
      console.log('loading change req DOCS for: ', changeActionId);

      checkSession();

      try {
        let response = await ApiService.apiAxios.get(ApiRoutes.CHANGE_REQUEST + '/documents/' + changeActionId);
        commit('setUploadedDocument', response.data);
        return response.data;
      } catch(e) {
        console.log(`Failed to get load req docs with error - ${e}`);
        throw e;
      }
    },

    // eslint-disable-next-line no-empty-pattern
    async saveUploadedDocuments({}, payload ){
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
    // eslint-disable-next-line no-empty-pattern
    async deleteDocuments({},deletedFiles){
      console.log('DELETE files payload:' , deletedFiles);
      try {
        await ApiService.apiAxios.delete(ApiRoutes.SUPPORTING_DOCUMENT_UPLOAD, { data: deletedFiles} );
        console.log('delete uploaded documents called');
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async createChangeRequestMTFI({state,commit}, payload) {
      console.log('Create MTFI Change Request:' , payload);
      checkSession();
      try {
        let ccfriResponse = await ApiService.apiAxios.patch('/api/application/ccfri/', payload);
        await Promise.all(ccfriResponse?.data?.map(async (ccfri) => {
          let mtfiResponse = await ApiService.apiAxios.get(ApiRoutes.CHANGE_REQUEST + '/mtfi/' + ccfri?.ccfriApplicationId);
          commit('addToMtfiFacilities', mtfiResponse?.data);
        }));
      } catch (error) {
        console.info(`Failed to create MTFI Change Requests - ${error}`);
        throw error;
      }
    },

    async deleteChangeRequestMTFI({state}, payload) {
      console.log('Delete MTFI Change Request:' , payload);
      checkSession();
      try {
        await Promise.all(payload.map(async (mtfiFacility) => {
          if (mtfiFacility.ccfriApplicationId)
            await ApiService.apiAxios.delete('/api/application/ccfri/' + mtfiFacility.ccfriApplicationId);
        }));
        await Promise.all(payload.map(async (mtfiFacility) => {
          if (mtfiFacility.changeRequestMtfiId)
            await ApiService.apiAxios.delete(ApiRoutes.CHANGE_REQUEST + '/mtfi/' + mtfiFacility.changeRequestMtfiId);
        }));
        payload.forEach(facility => {
          let deleteIndex = state.mtfiFacilities.findIndex(item => item.facilityId === facility.facilityId);
          if (deleteIndex >= 0)
            state.mtfiFacilities.splice(deleteIndex, 1);
        });
      } catch (error) {
        console.info(`Failed to delete MTFI Change Requests - ${error}`);
        throw error;
      }
    },

    async updateChangeRequestMTFI({state}, payload) {
      console.log('updating change req MTFI');
      checkSession();
      try {
        await ApiService.apiAxios.patch(ApiRoutes.CHANGE_REQUEST_MTFI + '/' + payload.changeRequestMtfiId);
      } catch (error) {
        console.info(`Failed to delete MTFI Change Requests - ${error}`);
        throw error;
      }
    }
  },

};
