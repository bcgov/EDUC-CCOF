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
    eceweEligibilityComplete: false,
    eceweFacilitiesComplete: false,
  },
  mutations: {
    setIsStarted: (state, isStarted) => { state.isStarted = isStarted; },
    setApplicationId: (state, applicationId) => { state.applicationId = applicationId; },
    setEceweModel: (state, model) => { state.eceweModel = model; },
    setLoadedModel: (state, model) => { state.loadedModel = model; },
    setFacilities: (state, facilities) => { state.facilities = facilities; },
    setLoadedFacilities: (state, loadedFacilities) => { state.loadedFacilities = loadedFacilities; },
    setFundingModelTypes: (state, fundingModelTypes) => { state.fundingModelTypes = fundingModelTypes; },
    setEceweEligibilityComplete: (state, model) => { state.eceweEligibilityComplete = model; },
    setEceweFacilitiesComplete: (state, model) => { state.eceweFacilitiesComplete = model; },    
  },
  actions: {
    async loadECEWE({state, commit}) {
      checkSession();
      try {
        let payload = (await ApiService.apiAxios.get('/api/application/ecewe/' + state.applicationId)).data;
        commit('setEceweModel', payload);
        commit('setLoadedModel', payload);
        commit('setFacilities', payload.facilities);
        commit('setEceweEligibilityComplete', payload.optInECEWE !== null);
        commit('setEceweFacilitiesComplete', payload.facilities ? payload.facilities.every(facility => facility.optInOrOut != null) : false);
        console.info('ECEWEApp.loadECEWE.state.facilities = ');
        console.info(JSON.parse(JSON.stringify(state.facilities)));
        console.info('ECEWEApp.loadECEWE.state.eceweModel.facilities = ');
        console.info(JSON.parse(JSON.stringify(state.eceweModel.facilities)));
      } catch (error) {
        console.info(`Failed to get ECEWE Application - ${error}`);
        throw error;
      }
    },
    async saveECEWE({ state, commit }) {
      checkSession();
      try {
        console.info('ECEWEApp.saveECEWE.state.eceweModel = ');
        console.info(JSON.parse(JSON.stringify(state.eceweModel)));
        console.info('ECEWEApp.saveECEWE.state.loadedModel = ');
        console.info(JSON.parse(JSON.stringify(state.loadedModel)));
        if (isEqual(state.eceweModel, state.loadedModel)) {
          console.info('ECEWEApp.saveECEWE: no model changes (NOT saving).');
          return;
        } else {
          console.info('ECEWEApp.saveECEWE: model changes (SAVING).');
        }
        let payload = { ...state.eceweModel };
        payload = JSON.parse(JSON.stringify(payload));
        delete payload.facilities;
        // Save ECEWE parent record.
        let response = await ApiService.apiAxios.patch(ApiRoutes.APPLICATION_ECEWE + '/' + state.applicationId, payload);
        commit('setLoadedModel', {...state.eceweModel});
        commit('setEceweEligibilityComplete', payload.optInECEWE != null);
        return response;
      } catch (error) {
        console.info(`Failed to update existing ECEWE application - ${error}`);
        throw error;
      }
    },
    async saveECEWEFacilities({ state, commit }) {
      checkSession();
      console.info('ECEWEApp.saveECEWEFacilities.state.loadedFacilities = ');
      console.info(JSON.parse(JSON.stringify(state.loadedFacilities)));
      console.info('ECEWEApp.saveECEWEFacilities.state.facilities = ');
      console.info(JSON.parse(JSON.stringify(state.facilities)));
      if (isEqual(state.loadedFacilities, state.facilities)) {
        console.info('ECEWEApp.saveECEWEFacilities: no model changes (NOT saving).');
        return;
      } else {
        console.info('ECEWEApp.saveECEWEFacilities: model changes (SAVING).');
      }      
      let payload = JSON.parse(JSON.stringify(state.facilities));
      try {
        let response = await ApiService.apiAxios.post(ApiRoutes.APPLICATION_ECEWE_FACILITY + '/' + state.applicationId, payload);
        commit('setFacilities', response.data.facilities);
        commit('setLoadedFacilities', response.data.facilities);
        commit('setEceweFacilitiesComplete', response.data.facilities ? response.data.facilities.every(facility => facility.optInOrOut != null) : false);
        return response;
      } catch (error) {
        console.info(`Failed to update existing ECEWE facility application - ${error}`);
        throw error;
      }
    },
    /* Initalizes\creates the facilities payload depending on if ecewe facilities exist or not. */
    initECEWEFacilities({ state, commit }, navBarList) {
      let facilityPayload;
      console.info('ECEWEApp.initECEWEFacilities.state.eceweModel.facilities = ');
      console.info(JSON.parse(JSON.stringify(state.eceweModel.facilities)));
      console.info('ECEWEApp.initECEWEFacilities.state.facilities = ');
      console.info(JSON.parse(JSON.stringify(state.facilities)));
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
