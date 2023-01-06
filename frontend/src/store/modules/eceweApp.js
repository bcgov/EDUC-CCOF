import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';

export default {
  namespaced: true,
  state: {
    optInECEWE: null,
    belongsToUnion: null,
    fundingModel: null,
    facilities: [],
    confirmation: null,
    isValidForm: false,
    isStarted: false
  },
  getters: {
    isEceweComplete: state => state.isValidForm,
  },  
  mutations: {
    setOptInECEWE: (state, optInECEWE) => { state.optInECEWE = optInECEWE; },
    setBelongsToUnion: (state, belongsToUnion) => { state.belongsToUnion = belongsToUnion; },
    setFundingModel: (state, fundingModel) => { state.fundingModel = fundingModel; },
    setFacilities: (state, facilities) => { state.facilities = facilities; },
    setConfirmation: (state, confirmation) => { state.confirmation = confirmation; },
    setIsValidForm: (state, isValidForm) => { state.isValidForm = isValidForm; },
    setIsStarted: (state, isStarted) => { state.isStarted = isStarted; }
  },
  actions: {
    async loadECEWE({ commit }, applicationId) {
      if (!localStorage.getItem('jwtToken')) { // DONT Call api if there is no token.
        console.log('unable to load ECEWE Application because you are not logged in');
        throw 'unable to load ECEWE Application because you are not logged in';
      }
      try {
        console.log('about to call = '+ApiRoutes.APPLICATION_ECEWE + '/' + applicationId);
        let payload = (await ApiService.apiAxios.get('/api/application/ecewe/' + applicationId)).data;
        commitToState(commit, payload);
      } catch (error) {
        console.log(`Failed to get ECEWE Application - ${error}`);
        throw error;
      }
    },
    async saveECEWE({ state, rootState, dispatch }) {
      if (!localStorage.getItem('jwtToken')) { // DONT Call api if there is no token.
        console.log('unable to save because you are not logged in');
        throw 'unable to save ecewe application because you are not logged in';
      }

      try {
        // Flag if user is opting out of ECEWE and has previously saved ECEWE facilities with
        // opt-in/out values. We will check this flag after saving the parent ECEWE record below.
        let updateFacilities = false;
        if (state.facilities != null || state.facilities?.length > 0) {
          state.facilities.find(facility => {
            if (facility.eceweApplicationId != null && facility.optInOrOut != null) {
              facility.optInOrOut = null;
              updateFacilities = true;
            }
          });
        }
        let payload = JSON.parse(JSON.stringify(state));
        // remove attributes we are not updating before sending payload.
        delete payload.facilities;
        // Save ECEWE parent record.
        let response = await ApiService.apiAxios.patch(ApiRoutes.APPLICATION_ECEWE + '/' + rootState.organization.applicationId, payload);

        // If parent ECEWE save was successfull and ECEWE facilties have been flagged for update, issue update on ECEWE facilties as their
        // previous optinout responses are no longer applicable.
        if (response?.status == '200' && updateFacilities) {
          dispatch('saveECEWEFacilities');
        }
        return response;
      } catch (error) {
        console.log(`Failed to update existing ECEWE application - ${error}`);
        throw error;
      }
    },
    async saveECEWEFacilities({ state, rootState, commit }) {
      if (!localStorage.getItem('jwtToken')) { // DONT Call api if there is no token.
        console.log('unable to save because you are not logged in');
        throw 'unable to save ecewe facility application because you are not logged in';
      }
      let facilitiesForBackend = state.facilities;
      let payload = JSON.parse(JSON.stringify(facilitiesForBackend));
      // has an application ID, so update the data
      try {
        let response = await ApiService.apiAxios.post(ApiRoutes.APPLICATION_ECEWE_FACILITY + '/' + rootState.organization.applicationId, payload);
        commit('setFacilities', response.data.facilities);
        return response;
      } catch (error) {
        console.log(`Failed to update existing ECEWE facility application - ${error}`);
        throw error;
      }
    },
    /* Initalizes\creates the facilities payload depending on if ecewe facilities exist or not. */
    initECEWEFacilities({ state, rootState }, navBarList) {
      if (state.facilities?.length == 0 || state.facilities == null) {
        state.facilities = new Array(navBarList.length).fill({});
        for (let i = 0; i < navBarList.length; i++) {
          state.facilities[i] = {applicationid: rootState.organization.applicationId, facilityId: navBarList[i].facilityId, optInOrOut: null, statuscode: 1};
        }
        state.facilities = state.facilities.map(obj => ({ ...obj, update: true }));
      } else {
        let tempFacilities = new Array(navBarList.length).fill({});
        for (let j = 0; j < navBarList.length; j++) {
          tempFacilities[j] = {facilityId: navBarList[j].facilityId,
            eceweApplicationId: getEceweApplicationId(navBarList[j].facilityId),
            optInOrOut: getOptInOrOut(navBarList[j].facilityId),
            statuscode: getStatuscode(navBarList[j].facilityId),
            update: getUpdate(navBarList[j].facilityId)};
        }
        state.facilities = tempFacilities;
      }
      function getEceweApplicationId(facilityId) {
        const index = state.facilities.map(facilty => facilty.facilityId).indexOf(facilityId);
        return (index >= 0)?state.facilities[index].eceweApplicationId:null;
      }
      
      function getOptInOrOut(facilityId) {
        const index = state.facilities.map(facilty => facilty.facilityId).indexOf(facilityId);
        return (index >= 0)?state.facilities[index].optInOrOut:null;
      }
      
      function getStatuscode(facilityId) {
        const index = state.facilities.map(facilty => facilty.facilityId).indexOf(facilityId);
        return (index >= 0)?state.facilities[index].statuscode:null;
      }
      
      function getUpdate(facilityId) {
        const index = state.facilities.map(facilty => facilty.facilityId).indexOf(facilityId);
        return (index >= 0)?(state.facilities[index].optInOrOut !=null?false:true):true;
      }
    }
  },
};

function commitToState(commit, data) {
  commit('setOptInECEWE', data?.optInECEWE);
  commit('setBelongsToUnion', data?.belongsToUnion);
  commit('setFundingModel', data?.fundingModel);
  commit('setConfirmation', data?.confirmation);
  commit('setFacilities', data?.facilities);
}

