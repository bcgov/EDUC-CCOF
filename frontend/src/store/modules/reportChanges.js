import ApiService from '../../common/apiService';
import {ApiRoutes} from '../../utils/constants';
import {checkSession} from '../../utils/session';
import {isEmpty} from 'lodash';
import { CHANGE_REQUEST_TYPES, CHANGE_TYPES } from '../../utils/constants';

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
    changeRequestStore : [],
    uploadedDocuments: [],
    mtfiFacilities: [],
    changeRequestMap: new Map(), //TODO: merge these two
  },
  getters: {
    changeRequestStore: state => state.changeRequestStore,
    changeActions: state => state.changeActions,
    changeRequestId: state => state.changeRequestId,
    loadedChangeRequest: state => state.loadedChangeRequest,
    getUploadedDocuments: state => state.uploadedDocuments,
    // eslint-disable-next-line no-unused-vars
    isCREceweComplete: (state, getters, rootState) => {
      return state.changeRequestMap.get(rootState.navBar.changeRequestId)?.isEceweComplete;
    },
    // eslint-disable-next-line no-unused-vars
    isCRLicenseComplete: (state, getters, rootState) => {
      return state.changeRequestMap.get(rootState.navBar.changeRequestId)?.isLicenseUploadComplete;
    },
    isChangeNotificationFormComplete: (state) => {
      let index = state.uploadedDocuments?.findIndex(document => document.subject === 'NOTIFICATION_FORM');
      return (index > -1);
    },
    // eslint-disable-next-line no-unused-vars
    changeRequestStatus: (state, getters, rootState) => {
      return state.changeRequestMap.get(rootState.navBar.changeRequestId)?.externalStatus;
    },
    // eslint-disable-next-line no-unused-vars
    isCCOFUnlocked:(state,getters,rootState) => {
      return state.changeRequestMap.get(rootState.navBar.changeRequestId)?.changeActions?.find(el => el.changeType == CHANGE_REQUEST_TYPES.NEW_FACILITY)?.isCCOFUnlocked;
    },
    // eslint-disable-next-line no-unused-vars
    isEceweUnlocked:(state,getters,rootState) => {
      return state.changeRequestMap.get(rootState.navBar.changeRequestId)?.changeActions?.find(el => el.changeType == CHANGE_REQUEST_TYPES.NEW_FACILITY)?.isEceweUnlocked;
    },
    // eslint-disable-next-line no-unused-vars
    isLicenseUploadUnlocked:(state,getters,rootState) => {
      return state.changeRequestMap.get(rootState.navBar.changeRequestId)?.changeActions?.find(el => el.changeType == CHANGE_REQUEST_TYPES.NEW_FACILITY)?.isLicenseUploadUnlocked;
    },
    // eslint-disable-next-line no-unused-vars
    isSupportingDocumentsUnlocked:(state,getters,rootState) => {
      return state.changeRequestMap.get(rootState.navBar.changeRequestId)?.changeActions?.find(el => el.changeType == CHANGE_REQUEST_TYPES.NEW_FACILITY)?.isSupportingDocumentsUnlocked;
    },
    // eslint-disable-next-line no-unused-vars
    isDeclarationUnlocked:(state,getters,rootState) => {
      return state.changeRequestMap.get(rootState.navBar.changeRequestId)?.unlockDeclaration;
    },
    // eslint-disable-next-line no-unused-vars
    isChangeRequestUnlocked:(state,getters,rootState) => {
      return state.changeRequestMap.get(rootState.navBar.changeRequestId)?.isChangeRequestUnlocked;
    },
    // eslint-disable-next-line no-unused-vars
    isOtherDocumentsUnlocked:(state,getters,rootState) => {
      return state.changeRequestMap.get(rootState.navBar.changeRequestId)?.changeActions?.find(el => el.changeType == CHANGE_REQUEST_TYPES.PDF_CHANGE)?.isOtherDocumentsUnlocked;
    },
    // eslint-disable-next-line no-unused-vars
    getChangeNotificationActionId:(state,getters,rootState) => {
      return state.changeRequestMap.get(rootState.navBar.changeRequestId)?.changeActions?.find(el => el.changeType == CHANGE_REQUEST_TYPES.PDF_CHANGE)?.changeActionId;
    },
  },
  mutations: {
    addChangeRequestToStore: (state, {changeRequestId, changeRequestModel}) => {
      const map = new Map(state.changeRequestMap);
      map.set(changeRequestId, changeRequestModel);
      state.changeRequestMap = map;
    },
    removeChangeMap:(state) => {
      state.changeRequestMap.clear();
    },
    removeChangeRequest:(state, changeRequestId) => {
      state.changeRequestMap.delete(changeRequestId);
    },
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
    addNewChangeRequestToMap:(state, model) => {
      state.changeRequestMap.set(model.changeRequestId, model);
      state.changeRequestMap = new Map(state.changeRequestMap); // // done to trigger reactive getter
    },
    setCRIsEceweComplete:(state, value) => {
      let cr = state.changeRequestMap.get(value.changeRequestId);
      if (cr) {
        cr.isEceweComplete = value.isComplete;
        state.changeRequestMap = new Map(state.changeRequestMap); // done to trigger reactive getter
      }
    },
    setCRIsLicenseComplete:(state, value) => {
      let cr = state.changeRequestMap.get(value.changeRequestId);
      if (cr) {
        cr.isLicenseUploadComplete = value.isComplete;
        state.changeRequestMap = new Map(state.changeRequestMap); // done to trigger reactive getter
      }
    },
    setMTFIFacilities:(state, value) => {
      state.mtfiFacilities = value;
    },
    addToMtfiFacilities: (state, payload) => {
      payload?.forEach(facility => state.mtfiFacilities.push(facility));
    },
    addChangeNotificationId:(state, value) => {
      let cr = state.changeRequestMap.get(value.changeRequestId);
      if (cr?.changeActions) {
        cr.changeActions.push({
          applicationStatus:1,
          changeActionId: value.changeNotificationActionId,
          changeType: CHANGE_REQUEST_TYPES.PDF_CHANGE,
          status: 1
        });
        state.changeRequestMap = new Map(state.changeRequestMap); // done to trigger reactive getter
      }
    },
    deleteChangeNotificationId:(state, value) => {
      let cr = state.changeRequestMap.get(value.changeRequestId);
      if (cr?.changeActions) {
        cr.changeActions = cr.changeActions.filter(el => el.changeType != CHANGE_REQUEST_TYPES.PDF_CHANGE);
        state.changeRequestMap = new Map(state.changeRequestMap); // done to trigger reactive getter
      }
    },
    addNewFacilityDataToCRMap: (state, payload) => {
      try{
        //save the newly created fac data into the change request map so it can be the source of truth

        const newFacilityObj = {
          baseFunding: {
            ccofBaseFundingId: payload.ccofBaseFundingId,
            ccofBaseFundingStatus: payload.ccofBaseFundingStatus,
            isCCOFComplete: payload.isCCOFComplete,
          },
          ccfri: {},
          changeRequestNewFacilityId: payload.changeRequestNewFacilityId,
          ecewe: {},
          facilityId: payload.facilityId,
          unlockCcfri:false,
          unlockNmf:false,
          unlockRfi:false,

        };

        state.changeRequestMap.get(payload.changeRequestId)?.changeActions?.find(el => el.changeType == CHANGE_REQUEST_TYPES.NEW_FACILITY).newFacilities.push(newFacilityObj);
      }
      catch(error) {
        // Pass.
      }

    },
  },
  actions: {
    // GET a list of all Change Requests for an application using applicationID
    async getChangeRequestList({commit, rootGetters}) {
      checkSession();
      let store = [];
      try {
        let response;
        const applicationIds = rootGetters['application/applicationIds'];
        if (applicationIds?.length > 0)
          response = await ApiService.apiAxios.get(ApiRoutes.APPLICATION_CHANGE_REQUEST + '/' + applicationIds);

        if (!isEmpty(response)) {
          for (const element of response.data) {


            if (element?.changeActions[0]?.facilities?.length === 0) {
              continue;
            }
            element.createdOnDate = new Date(
              element.createdOnDate
            ).toLocaleDateString();
            store.push(element);

            element.changeActions.forEach((changeAction) => {
              if (changeAction.changeType == "NEW_FACILITY") {
                const newFacilities = changeAction.facilities;
                newFacilities?.forEach((facility) =>
                  commit(
                    "navBar/setNavBarFacilityChangeRequest",
                    {
                      facilityId: facility.facilityId,
                      changeRequestNewFacilityId:
                        facility.changeRequestNewFacilityId,
                    },
                    { root: true }
                  )
                );
              }
            });
          }
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

      } catch(e) {
        console.log(`Failed to get load change req with error - ${e}`);
        throw e;
      }
    },

    // GET Change Request's details using changeRequestID
    async getChangeRequest({state, commit, rootState}, changeRequestId) {
      console.log('trying to get change req for: ', changeRequestId);
      let changeRequest = state.changeRequestMap.get(changeRequestId);
      if (changeRequest) {
        commit('setLoadedChangeRequest', changeRequest);
        // commit('setChangeRequestId', changeRequest.changeRequestId); TODO: discuss if we should have this
        return changeRequest;
      } else {
        checkSession();
        try {
          let response = (await ApiService.apiAxios.get(ApiRoutes.CHANGE_REQUEST + '/' + changeRequestId))?.data;
          commit('setLoadedChangeRequest', response);
          commit('setChangeRequestId', response?.changeRequestId);

          let changeAction;
          switch (rootState.navBar.changeType) {
          case CHANGE_TYPES.NEW_FACILITY:
            changeAction = response?.changeActions?.find(changeAction => changeAction.changeType == CHANGE_REQUEST_TYPES.NEW_FACILITY);
            break;
          case CHANGE_TYPES.CHANGE_NOTIFICATION:
            changeAction = response?.changeActions?.find(changeAction => changeAction.changeType == CHANGE_REQUEST_TYPES.PDF_CHANGE);
            break;
          case CHANGE_TYPES.MTFI:
            changeAction = response?.changeActions?.find(changeAction => changeAction.changeType == CHANGE_REQUEST_TYPES.PARENT_FEE_CHANGE);
            break;
          }
          commit('setChangeActionId', changeAction?.changeActionId);

          let mtfiChangeActions =  response?.changeActions?.filter(changeAction => changeAction.changeType == CHANGE_REQUEST_TYPES.PARENT_FEE_CHANGE);
          let mtfiFacilities = [];
          mtfiChangeActions?.forEach(changeAction => mtfiFacilities.push(changeAction.mtfi));
          commit('setMTFIFacilities', ...mtfiFacilities);

          const newFacilityChangeActions =  response?.changeActions?.filter(changeAction => changeAction.changeType == CHANGE_REQUEST_TYPES.NEW_FACILITY);
          newFacilityChangeActions?.forEach(changeAction => {
            let newFacilities = changeAction.newFacilities;
            newFacilities?.forEach(facility => commit('navBar/setNavBarFacilityChangeRequest', {facilityId: facility.facilityId, changeRequestNewFacilityId: facility.changeRequestNewFacilityId}, { root: true }));
          });
          commit('addChangeRequestToStore', {changeRequestId: changeRequestId, changeRequestModel: response});

          return response;
        } catch(e) {
          console.log(`Failed to get change request with error - ${e}`);
          throw e;
        }

      }
    },

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
        let response = await ApiService.apiAxios.post('/api/changeRequest/documents', payload); //does this need to be here for every change request?

        commit('setChangeRequestId', response?.data?.changeRequestId);
        commit('setChangeActionId', response?.data?.changeActionId);
        commit('addNewChangeRequestToMap', response?.data?.changeRequestId);
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

    async cancelChangeRequest({dispatch}, changeRequestId) {
      console.log('CANCEL Change request: ', changeRequestId);
      checkSession();
      if (changeRequestId){
        try {
          let payload = {
            externalStatus: 6,
          };
          let response = await ApiService.apiAxios.patch(ApiRoutes.CHANGE_REQUEST + '/' + changeRequestId, payload);
          dispatch('updateExternalStatusInChangeRequestStore', {changeRequestId: changeRequestId, newStatus: 6});
          dispatch('updateExternalStatusInChangeRequestMap', {changeRequestId: changeRequestId, newStatus: 'CANCELLED'});
          return response;
        } catch (e) {
          console.log(`Failed to cancel change request with error - ${e}`);
          throw e;
        }
      }
    },

    updateExternalStatusInChangeRequestStore({state, commit}, {changeRequestId, newStatus}) {
      if (state.changeRequestStore?.length > 0) {
        let index = state.changeRequestStore?.findIndex(changeRequest => changeRequest.changeRequestId == changeRequestId);
        if (index > -1) {
          state.changeRequestStore[index].externalStatus = newStatus;
          commit('setChangeRequestStore', state.changeRequestStore);
        }
      }
    },

    updateExternalStatusInChangeRequestMap({state}, {changeRequestId, newStatus}) {
      let cr = state.changeRequestMap.get(changeRequestId);
      if (cr) {
        cr.externalStatus = newStatus;
        state.changeRequestMap = new Map(state.changeRequestMap); // done to trigger reactive getter
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

    async createChangeRequestMTFI({commit}, payload) {
      console.log('Create MTFI Change Request:' , payload);
      checkSession();
      try {
        let ccfriResponse = await ApiService.apiAxios.patch('/api/application/ccfri/', payload);
        console.log(ccfriResponse);
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
