import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';
import { checkSession } from '@/utils/session';
import { isEmpty, isEqual } from 'lodash';

export default {
  namespaced: true,
  state: {
    model: [
    ],
    foo: 'bar',
    // facilityList: [],
    facilityStore: {},
    facilityModel: {},
    facilityId: null,
    // CCFRIFacilityModel : {}, //jb
    // ccfriId: {},//jb
    // ccfriStore :{},
    isValidForm: false,
    loadedModel: {}
  },
  getters: {
    isCurrentFacilityComplete: state => state.isValidForm,
    getFacilityById: (state) => (facilityId) => {
      return state.facilityStore[facilityId];
    },
    // getCCFRIById: (state) => (ccfriId) => {
    //   return state.ccfriStore[ccfriId];
    // },
    isNewFacilityStarted: state => !isEmpty(state.facilityModel),

    getModel: state => { return state.model; }
  },
  mutations: {
    model(state, value) {
      state.model = value;
    },
    isValidForm(state, value) {
      state.isValidForm = value;
    },
    // setFacilityList: (state, facilityList) => { state.facilityList = facilityList; },
    // addToFacilityList: (state, payload) => { state.facilityList.push (payload); },
    setFacilityModel(state, facilityModel) { state.facilityModel = facilityModel; },
    setLoadedModel(state, model) { state.loadedModel = model; },
    // setCCFRIFacilityModel: (state, CCFRIFacilityModel) => { state.CCFRIFacilityModel = CCFRIFacilityModel; }, //jb
    setFacilityId: (state, facilityId) => { state.facilityId = facilityId; },
    // setCcfriId: (state, ccfriId) => { state.ccfriId = ccfriId; },
    addFacilityToStore: (state, { facilityId, facilityModel }) => {
      if (facilityId) {
        state.facilityStore[facilityId] = facilityModel;
      }
    },
    deleteFromStore: (state, facilityId) => {
      delete state.facilityStore[facilityId];
    },
    // addCCFRIToStore: (state, {ccfriId, CCFRIFacilityModel} ) => {
    //   if (ccfriId) {
    //     state.ccfriStore[ccfriId] = CCFRIFacilityModel;
    //   }
    // }
  },
  actions: {
    async saveFacility({ state, commit, rootState }, { isChangeRequest, changeRequestId }) {

      checkSession();
      console.log('saveFacility- state model: ', state.facilityModel);
      console.log('saveFacility- loaded model: ', state.loadedModel);
      if (isEqual(state.facilityModel, state.loadedModel)) {
        console.info('no model changes');
        return;
      }

      let organizationId = rootState.organization.organizationId;
      if (!organizationId) {
        console.log('unable to save facility because you are not associated to an organization');
        throw 'unable to save facility because you are not associated to an organization';
      }

      let payload = { ...state.facilityModel, organizationId, applicationId: rootState.application.applicationId };
      commit('setLoadedModel', state.facilityModel);

      if (state.facilityId) {
        // has an orgaization ID, so update the data
        try {
          let response = await ApiService.apiAxios.put(ApiRoutes.FACILITY + '/' + state.facilityId, payload);
          commit('addFacilityToStore', { facilityId: state.facilityId, facilityModel: state.facilityModel });
          //TODO: also find the existing value in the nav bar and update the facility Name and license number
          return response;
        } catch (error) {
          console.log(`Failed to update existing Facility - ${error}`);
          throw error;
        }
      } else {
        console.log('creating change request?', isChangeRequest);
        // else create a new facility.  If is a change request, hit the change request endpoint
        if (isChangeRequest) {
          console.log('changeRequestId: ', changeRequestId);
          try {
            let changeActionId;
            if (changeRequestId) {
              //If there is a changeRequestId, get the change action from the store.
              changeActionId = rootState.reportChanges.changeActionId;
              if (!changeActionId) {  //If there is no changeActionID, then maybe the user refreshed.  Get it from the navBar
                changeActionId = rootState.navBar.navBarList.find(el => el.changeRequestId == changeRequestId)?.changeActionId;
              }
              console.log('Change ActionId is ', changeActionId);
            }
            if (!changeActionId) {
              const changeRequestPayload = {
                applicationId: rootState.application.applicationId,
                programYearId: rootState.application.programYearId
              };
              const changeRequestResponse = await ApiService.apiAxios.post(ApiRoutes.CHANGE_REQUEST_NEW_FAC, changeRequestPayload);
              commit('reportChanges/setChangeRequestId', changeRequestResponse.data?.changeRequestId, { root: true });
              commit('reportChanges/setChangeActionId', changeRequestResponse.data?.changeActionId, { root: true });
              changeActionId = changeRequestResponse.data?.changeActionId;
            }
            let response = await ApiService.apiAxios.post(`${ApiRoutes.CHANGE_REQUEST_NEW_FAC}/${changeActionId}`, payload);
            commit('setFacilityId', response.data?.facilityId);
            commit('navBar/addToNavBar', {
              facilityName: state.facilityModel.facilityName,
              facilityId: state.facilityId,
              ccofBaseFundingId: response.data?.ccofBaseFundingId,
              ccofBaseFundingStatus: response.data?.ccofBaseFundingStatus,
              licenseNumber: state.facilityModel.licenseNumber,
              changeRequestId: rootState.reportChanges.changeRequestId,
              changeActionId: rootState.reportChanges.changeActionId,
              changeRequestNewFacilityId: response.data?.changeRequestNewFacilityId,
              facilityStatus: 'New',
            }, { root: true });
            commit('addFacilityToStore', { facilityId: response.data?.facilityId, facilityModel: state.facilityModel });

            return response;
          } catch (error) {
            console.log(`Failed to save new Facility - ${error}`);
            throw error;
          }
        } else {
          console.log('trying new facility');
          try {
            let response = await ApiService.apiAxios.post(ApiRoutes.FACILITY, payload);
            commit('setFacilityId', response.data?.facilityId);
            commit('navBar/addToNavBar', {
              facilityName: state.facilityModel.facilityName,
              facilityId: state.facilityId,
              ccofBaseFundingId: response.data?.ccofBaseFundingId,
              ccofBaseFundingStatus: response.data?.ccofBaseFundingStatus,
              licenseNumber: state.facilityModel.licenseNumber,
              facilityStatus: 'New',
            }, { root: true });
            commit('addFacilityToStore', { facilityId: response.data?.facilityId, facilityModel: state.facilityModel });

            return response;
          } catch (error) {
            console.log(`Failed to save new Facility - ${error}`);
            throw error;
          }
        }
      }
    },
    async loadFacility({ getters, commit }, facilityId) {
      commit('setFacilityId', facilityId);
      let facilityModel = getters.getFacilityById(facilityId);
      if (facilityModel) {
        console.log('found facility for guid: ', facilityId);
        commit('setFacilityModel', facilityModel);
        commit('setLoadedModel', facilityModel);
      } else {
        checkSession();
        try {
          let response = await ApiService.apiAxios.get(ApiRoutes.FACILITY + '/' + facilityId);
          commit('addFacilityToStore', { facilityId: facilityId, facilityModel: response.data });
          commit('setFacilityModel', response.data);
          commit('setLoadedModel', response.data);
          return response;

        } catch (e) {
          console.log(`Failed to get existing Facility with error - ${e}`);
          throw e;
        }
      }
    },
    async deleteFacility({ commit }, facilityObj) {
      checkSession();

      await ApiService.apiAxios.delete(ApiRoutes.FACILITY + '/' + facilityObj.facilityId, {data: facilityObj});

      commit('deleteFromStore', facilityObj.facilityId);
      commit('funding/deleteFromStore', facilityObj.facilityId, { root: true });
      commit('navBar/deleteFromNavBar', facilityObj.facilityId, { root: true });
    },
    newFacility({ commit }) {
      commit('setFacilityId', null);
      commit('setFacilityModel', {});
      commit('setLoadedModel', {});
    }
  },
};
