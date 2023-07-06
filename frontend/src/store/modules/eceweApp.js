import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';
import { checkSession } from '@/utils/session';
import { isEqual } from 'lodash';
import { sortByFacilityId } from '@/utils/common';

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
        let response = await ApiService.apiAxios.get('/api/application/ecewe/' + state.applicationId);
        let payload = response?.data;
        commit('setEceweModel', payload);
        commit('setLoadedModel', payload);
        commit('setLoadedFacilities', payload.facilities);
        commit('setFacilities', payload.facilities);
        return response;
      } catch (error) {
        console.info(`Failed to get ECEWE Application - ${error}`);
        commit('setIsStarted', false);
        throw error;
      }
    },
    async saveECEWE({ state, commit }, isFormComplete) {
      try {
        if (isEqual(state.eceweModel, state.loadedModel)) {
          return;
        }
        checkSession();
        let payload = JSON.parse(JSON.stringify(state.eceweModel));
        delete payload.facilities;
        payload.isEceweComplete = isFormComplete;
        commit('setLoadedModel', {...state.eceweModel});
        let response = await ApiService.apiAxios.patch(ApiRoutes.APPLICATION_ECEWE + '/' + state.applicationId, payload);
        return response;
      } catch (error) {
        console.info(`Failed to update existing ECEWE application - ${error}`);
        commit('setIsStarted', false);
        throw error;
      }
    },
    async saveECEWEFacilities({ state, commit }) {
      let sortedLoadedFacilities = sortByFacilityId(state.loadedFacilities);
      let sortedFacilities = sortByFacilityId(state.facilities);
      let payload = [];
      sortedFacilities?.forEach((facility, index) => {
        if (!isEqual(facility,sortedLoadedFacilities[index]) || !facility.eceweApplicationId) {
          payload.push(facility);
        }
      });
      if (payload?.length > 0) {
        checkSession();
        payload = JSON.parse(JSON.stringify(payload));
        try {
          let response = await ApiService.apiAxios.post(ApiRoutes.APPLICATION_ECEWE_FACILITY + '/' + state.applicationId, payload);
          let updatedFacilities = state.facilities;
          response?.data?.facilities?.forEach(facility => {
            updatedFacilities[updatedFacilities.findIndex(el => el.facilityId === facility.facilityId)] = facility;
          });
          commit('setFacilities', updatedFacilities);
          commit('setLoadedFacilities', updatedFacilities);
          return response;
        } catch (error) {
          console.info(`Failed to update existing ECEWE facility application - ${error}`);
          commit('setIsStarted', false);
          throw error;
        }
      }
    },
    /* Initalizes\creates the facilities payload depending on if ecewe facilities exist or not. */
    async initECEWEFacilities({ state, commit }, navBarList) {
      let facilityPayload;
      if (state.facilities?.length == 0) {
        console.log(' No facilities payload, create from the narBarList.');
        // No facilities payload, create from the narBarList.
        facilityPayload = navBarList.map(facility => ({
          eceweApplicationId: null,
          facilityId: facility.facilityId,
          optInOrOut: state.eceweModel.fundingModel === state.fundingModelTypes[0].id ? 0 : null,
          changeRequestId: facility.changeRequestId,
          changeRequestNewFacilityId: facility.changeRequestNewFacilityId
        }));
      } else {
        // A payload already exists, recreate to include any new facilities which could have been added to navBarList
        // since last creation.
        console.log('A payload already exists, recreate');
        facilityPayload = navBarList.map(facility => ({
          facilityId: facility.facilityId,
          eceweApplicationId: getEceweApplicationId(facility.facilityId),
          optInOrOut: getOptInOrOut(facility.facilityId),
          changeRequestId: facility.changeRequestId,
          changeRequestNewFacilityId: facility.changeRequestNewFacilityId
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
