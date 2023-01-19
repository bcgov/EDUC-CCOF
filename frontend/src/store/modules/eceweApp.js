import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';
import { checkSession } from '@/utils/session';
import { isEqual } from 'lodash';

export default {
  namespaced: true,
  state: {
    isStarted: false,
    applicationId: null,
    facilities: null,
    loadedFacilities: null,
    eceweModel: null,
    loadedModel: null,
    fundingModelTypes: null,
  },
  mutations: {
    setIsStarted: (state, isStarted) => { state.isStarted = isStarted; },
    setApplicationId: (state, applicationId) => { state.applicationId = applicationId; },
    setEceweModel: (state, model) => { state.eceweModel = model; },
    setLoadedModel: (state, model) => { state.loadedModel = model; },
    setFacilities: (state, facilities) => { state.facilities = facilities; },
    setLoadedFacilities: (state, loadedFacilities) => { state.loadedFacilities = loadedFacilities; },
    setFundingModelTypes: (state, fundingModelTypes) => { state.fundingModelTypes = fundingModelTypes; },
  },
  actions: {
    async loadECEWE({state, commit}) {
      checkSession();
      try {
        let payload = (await ApiService.apiAxios.get('/api/application/ecewe/' + state.applicationId)).data;
        commit('setEceweModel', payload);
        commit('setLoadedModel', payload);
        commit('setFacilities', payload.facilities);
      } catch (error) {
        console.info(`Failed to get ECEWE Application - ${error}`);
        throw error;
      }
    },
    async saveECEWE({ state, commit }, isFormComplete) {
      try {
        if (isEqual(state.eceweModel, state.loadedModel)) {
          return;
        }
        checkSession();
        console.log('save ecewe: is form complete', isFormComplete);
        let payload = JSON.parse(JSON.stringify(state.eceweModel));
        delete payload.facilities;
        payload.isEceweComplete = isFormComplete;
        commit('setLoadedModel', {...state.eceweModel});
        let response = await ApiService.apiAxios.patch(ApiRoutes.APPLICATION_ECEWE + '/' + state.applicationId, payload);
        return response;
      } catch (error) {
        console.info(`Failed to update existing ECEWE application - ${error}`);
        throw error;
      }
    },
    async saveECEWEFacilities({ state, commit }) {
      if (isEqual(state.loadedFacilities, state.facilities)) {
        return;
      }      
      checkSession();
      let payload = JSON.parse(JSON.stringify(state.facilities));
      try {
        // TODO test if deep copy is needed or not....
        commit('setLoadedFacilities', {...state.facilities});
        let response = await ApiService.apiAxios.post(ApiRoutes.APPLICATION_ECEWE_FACILITY + '/' + state.applicationId, payload);
        commit('setFacilities', response.data.facilities);
        return response;
      } catch (error) {
        console.info(`Failed to update existing ECEWE facility application - ${error}`);
        throw error;
      }
    },
    /* Initalizes\creates the facilities payload depending on if ecewe facilities exist or not. */
    initECEWEFacilities({ state, commit }, navBarList) {
      let facilityPayload;
      if (state.facilities?.length == 0) {
        // No facilities payload, create from the narBarList.
        facilityPayload = navBarList.map(facility => ({
          eceweApplicationId: null,
          facilityId: facility.facilityId,
          optInOrOut: state.eceweModel.fundingModel === state.fundingModelTypes[0].id ? 0 : null
        }));
      } else {
        // A payload already exists, recreate to include any new facilities which could have been added to navBarList
        // since last creation.
        facilityPayload = navBarList.map(facility => ({
          facilityId: facility.facilityId,
          eceweApplicationId: getEceweApplicationId(facility.facilityId),
          optInOrOut: getOptInOrOut(facility.facilityId)
        }));
      }
      commit('setFacilities', facilityPayload);
      function getEceweApplicationId(facilityId) {
        const index = state.facilities.map(facilty => facilty.facilityId).indexOf(facilityId);
        return (index >= 0)?state.facilities[index].eceweApplicationId:null;
      }
      function getOptInOrOut(facilityId) {
        if (state.eceweModel.fundingModel == state.fundingModelTypes[0].id) {
          return 0;
        } else {
          const index = state.facilities.map(facilty => facilty.facilityId).indexOf(facilityId);
          return (index >= 0)?state.facilities[index].optInOrOut:null;
        }
      }
    }
  },
};
