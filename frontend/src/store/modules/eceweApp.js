import ApiService from '@/common/apiService';
import { ApiRoutes, CHANGE_REQUEST_TYPES } from '@/utils/constants';
import { checkSession } from '@/utils/session';
import { isEqual } from 'lodash';
import { sortByFacilityId, isNullOrBlank } from '@/utils/common';

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
    optinECEWEChangeRequestReadonly: false,
    belongsToUnionChangeRequestReadonly: false,
  },
  mutations: {
    setIsStarted: (state, isStarted) => { state.isStarted = isStarted; },
    setApplicationId: (state, applicationId) => { state.applicationId = applicationId; },
    setEceweModel: (state, model) => { state.eceweModel = model; },
    setLoadedModel: (state, model) => { state.loadedModel = model; },
    setFacilities: (state, facilities) => { state.facilities = facilities; },
    setLoadedFacilities: (state, loadedFacilities) => { state.loadedFacilities = loadedFacilities; },
    setFundingModelTypes: (state, fundingModelTypes) => { state.fundingModelTypes = fundingModelTypes; },
    setOptinECEWEChangeRequestReadonly: (state, optinECEWEChangeRequestReadonly) => { state.optinECEWEChangeRequestReadonly = optinECEWEChangeRequestReadonly; },
    setBelongsToUnionChangeRequestReadonly: (state, belongsToUnionChangeRequestReadonly) => { state.belongsToUnionChangeRequestReadonly = belongsToUnionChangeRequestReadonly; },
  },
  actions: {
    async loadECEWE({state, commit}) {
      checkSession();
      try {
        let response = await ApiService.apiAxios.get('/api/application/ecewe/' + state.applicationId);
        let payload = response?.data;
        commit('setOptinECEWEChangeRequestReadonly', (payload?.optInECEWE === 1));
        commit('setBelongsToUnionChangeRequestReadonly', (payload?.belongsToUnion === 1));
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
    async loadECEWEModelFromChangeRequest({commit, state}, loadedChangeRequest) {
      if (!isNullOrBlank(loadedChangeRequest?.optInECEWE)) {
        let eceweModel = {
          applicationId: state.eceweModel?.applicationId,
          optInECEWE: loadedChangeRequest.optInECEWE,
          belongsToUnion: loadedChangeRequest.belongsToUnion,
          applicableSector: loadedChangeRequest.applicableSector,
          fundingModel: loadedChangeRequest.fundingModel,
          confirmation: loadedChangeRequest.confirmation,
          publicSector: loadedChangeRequest.publicSector,
          facilities: state.eceweModel?.facilities
        };
        commit('setEceweModel', eceweModel);
        commit('setLoadedModel', eceweModel);
      }
    },
    async saveECEWE({ state, commit, dispatch, }, {isFormComplete, isChangeRequest, changeRequestId}) {
      try {
        if (isEqual(state.eceweModel, state.loadedModel) && state.isStarted) {
          return;
        }
        checkSession();
        let payload = JSON.parse(JSON.stringify(state.eceweModel));
        delete payload.facilities;
        payload.isEceweComplete = isFormComplete;
        commit('setLoadedModel', {...state.eceweModel});
        let response;
        if (isChangeRequest) {
          delete payload.applicationId;
          //update the ChangeRequest Map with new ECEWE values
          let existingChangeRequest = await dispatch('reportChanges/getChangeRequest', changeRequestId, { root: true });
          existingChangeRequest.optInECEWE = payload.optInECEWE;
          existingChangeRequest.belongsToUnion = payload.belongsToUnion;
          existingChangeRequest.applicableSector = payload.applicableSector;
          existingChangeRequest.fundingModel = payload.fundingModel;
          existingChangeRequest.confirmation = payload.confirmation;
          existingChangeRequest.publicSector = payload.publicSector;
          response = await ApiService.apiAxios.patch(ApiRoutes.CHANGE_REQUEST + '/' + changeRequestId, payload);
        } else {
          response = await ApiService.apiAxios.patch(ApiRoutes.APPLICATION_ECEWE + '/' + state.applicationId, payload);
        }
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
      // check if there is any new/updated facility
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
            commit('navBar/setNavBarValue', {
              facilityId: facility.facilityId,
              property: 'eceweApplicationId',
              value: facility.eceweApplicationId,
            }, { root: true });
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
    async initECEWEFacilities({ state, commit, rootState, rootGetters }, navBarList) {
      let facilityPayload;
      if (state.facilities?.length == 0) {
        console.log(' No facilities payload, create from the narBarList.');

        if(rootGetters['navBar/isChangeRequest']){
          console.log('this is a change req, build from newFacilities list');

          let newFac = rootState?.reportChanges?.changeRequestMap?.get(rootState?.navBar?.changeRequestId).changeActions[0]?.newFacilities;

          facilityPayload =  newFac?.map(facility => ({
            eceweApplicationId: null,
            facilityId: facility.facilityId,
            optInOrOut: state.eceweModel.fundingModel === state.fundingModelTypes[0].id ? 0 : null,
            changeRequestId: rootState.navBar.changeRequestId ? rootState.navBar.changeRequestId: null,
            changeRequestNewFacilityId: facility.changeRequestNewFacilityId ? facility.changeRequestNewFacilityId : null
          }));
        }
        else{

          // No facilities payload, create from the narBarList.
          facilityPayload = navBarList.map(facility => ({
            eceweApplicationId: null,
            facilityId: facility.facilityId,
            optInOrOut: state.eceweModel.fundingModel === state.fundingModelTypes[0].id ? 0 : null,
          }));
        }
      }

      else {
        // A payload already exists, recreate to include any new facilities which could have been added to navBarList
        // since last creation.
        console.log('A payload already exists, recreate');

        if(rootGetters['navBar/isChangeRequest']){
          console.log('this is a change req, build from newFacilities list');

          // let newFac = rootState?.reportChanges?.changeRequestMap?.get(rootState?.navBar?.changeRequestId).changeActions[0]?.newFacilities;
          let newFac = rootState?.reportChanges?.changeRequestMap?.get(rootState?.navBar?.changeRequestId).changeActions?.find(el => el.changeType == CHANGE_REQUEST_TYPES.NEW_FACILITY)?.newFacilities;
          console.log('newFac is: ', newFac);
          facilityPayload =  newFac?.map(facility => ({
            eceweApplicationId: getEceweApplicationId(facility.facilityId),
            facilityId: facility.facilityId,
            optInOrOut:  getOptInOrOut(facility.facilityId),
            changeRequestId: rootState.navBar.changeRequestId ? rootState.navBar.changeRequestId: null,
            changeRequestNewFacilityId: facility.changeRequestNewFacilityId ? facility.changeRequestNewFacilityId : null
          }));
        }
        else{
          facilityPayload = navBarList.map(facility => ({
            facilityId: facility.facilityId,
            eceweApplicationId: getEceweApplicationId(facility.facilityId),
            optInOrOut: getOptInOrOut(facility.facilityId),
          }));
        }
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
