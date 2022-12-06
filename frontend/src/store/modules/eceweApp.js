import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';
import axios from 'axios';

export default {
  namespaced: true,
  state: {
    applicationId: null,
    q1OptInECEWE: null,
    q2BelongsToUnion: null,
    q3FundingModel: null,
    facilities: null,
    userDeclaration: null,
    isValidForm: false,
    isStarted: false
  },
  getters: {
    isEceweComplete: state => state.isValidForm,
  },  
  mutations: {
    setApplicationId: (state, applicationId) => { state.applicationId = applicationId; },
    setQ1OptInECEWE: (state, q1OptInECEWE) => { state.q1OptInECEWE = q1OptInECEWE; },
    setQ2BelongsToUnion: (state, q2BelongsToUnion) => { state.q2BelongsToUnion = q2BelongsToUnion; },
    setQ3FundingModel: (state, q3FundingModel) => { state.q3FundingModel = q3FundingModel; },
    setFacilities: (state, facilities) => { state.facilities = facilities; },
    setUserDeclaration: (state, userDeclaration) => { state.userDeclaration = userDeclaration; },
    setIsValidForm: (state, isValidForm) => { state.isValidForm = isValidForm; },
    setIsStarted: (state, isStarted) => { state.isStarted = isStarted; }
  },
  actions: {
    async loadEceweApp({ commit }, applicationId) {
      if (!localStorage.getItem('jwtToken')) { // DONT Call api if there is no token.
        console.log('unable to load ECEWE Application because you are not logged in');
        throw 'unable to load ECEWE Application because you are not logged in';
      }
      try {
        console.log('about to call = '+ApiRoutes.APPLICATION_ECEWE + '/' + applicationId);
        //let response = (await ApiService.apiAxios.get(ApiRoutes.ECEWE_APPLICATION + '/' + applicationId)).data;
        let payload = (await axios.get('/api/application/ecewe/'+applicationId)).data;
        commitToState(commit, payload);
      } catch (error) {
        console.log(`Failed to get ECEWE Application - ${error}`);
        throw error;
      }
    },
    async saveApplication({ state, commit }) {
      if (!localStorage.getItem('jwtToken')) { // DONT Call api if there is no token.
        console.log('unable to save because you are not logged in');
        throw 'unable to save ecewe application because you are not logged in';
      }
      let payload = JSON.parse(JSON.stringify(state));
      if (state.applicationId) {
        // has an application ID, so update the data
        try {
          let response = await ApiService.apiAxios.patch(ApiRoutes.APPLICATION_ECEWE + '/' + state.applicationId, payload);
          return response;
        } catch (error) {
          console.log(`Failed to update existing ECEWE application - ${error}`);
          throw error;
        }
      } else {
        console.log('NO APPLICATION ID... INSERTING.');
        /*
        try {
          let response = await ApiService.apiAxios.post(ApiRoutes.ORGANIZATION, payload);
          commit('setOrganizationId', response.data?.organizationId);
          commit('setApplicationId', response.data?.applicationId);
          commit('setApplicationStatus', response.data?.applicationStatus);
          return response;
        } catch (error) {
          console.log(`Failed to save new Organization - ${error}`);
          throw error;
        }
        */
      }
    },
    async saveECEWEFacilityApplications({ state, commit }) {
      if (!localStorage.getItem('jwtToken')) { // DONT Call api if there is no token.
        console.log('unable to save because you are not logged in');
        throw 'unable to save ecewe facility application because you are not logged in';
      }
      let payload = JSON.parse(JSON.stringify(state.facilities));
      if (state.applicationId) {
        // has an application ID, so update the data
        try {
          // remove attributes we are not updating before sending payload.
          for (var key in payload) {
            delete payload[key].facilityId;
            delete payload[key].name;
          }
          let response = await ApiService.apiAxios.patch(ApiRoutes.APPLICATION_ECEWE_FACILITY + '/' + state.applicationId, payload);
          return response;
        } catch (error) {
          console.log(`Failed to update existing ECEWE facility application - ${error}`);
          throw error;
        }
      } else {
        console.log('NO APPLICATION ID... INSERTING.');
        /*
        try {
          let response = await ApiService.apiAxios.post(ApiRoutes.ORGANIZATION, payload);
          commit('setOrganizationId', response.data?.organizationId);
          commit('setApplicationId', response.data?.applicationId);
          commit('setApplicationStatus', response.data?.applicationStatus);
          return response;
        } catch (error) {
          console.log(`Failed to save new Organization - ${error}`);
          throw error;
        }
        */
      }
    }
  },
};

function commitToState(commit, data) {
  commit('setApplicationId', data?.applicationId);
  commit('setQ1OptInECEWE', String(data?.q1OptInECEWE));
  commit('setQ2BelongsToUnion', String(data?.q2BelongsToUnion));
  commit('setQ3FundingModel', String(data?.q3FundingModel));
  commit('setFacilities', data?.facilities);
  commit('setUserDeclaration', data?.userDeclaration);
}

