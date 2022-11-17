import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';

export default {
  namespaced: true,
  state: {
    //Vuex doesn't handle maps. so keep track of the list of facilities
    //and update the facility details with the current selected facility
    facilityList: [],
    facilityStore: {},
    facilityName: null,
    facilityId: null,
    yearBeginOperation: null,
    facilityAddress: null,
    city: null,
    postalCode: null,
    contactName: null,
    position: null,
    phone: null,
    email: null,
    licenseNumber: null,
    // licenseEffectiveDate: null,
    // hasReceivedFunding: null,

    isValidForm: false,
    isStarted: false,
    ccfriOptInStatus : null,
    isFacilityComplete: false,
  },
  getters: {
    isCurrentFacilityComplete: state => state.isValidForm,
    getFacilityById: (state) => (facilityId) => { 
      return state.facilityStore[facilityId];
    }
  },  
  mutations: {
    setFacilityList: (state, facilityList) => { state.facilityList = facilityList; },
    addToFacilityList: (state, payload) => { state.facilityList.push (payload); },
    setFacilityName: (state, facilityName) => { state.facilityName = facilityName; },
    setFacilityId: (state, facilityId) => { state.facilityId = facilityId; },
    setYearBeginOperation: (state, yearBeginOperation) => { state.yearBeginOperation = yearBeginOperation; },
    setFacilityAddress: (state, facilityAddress) => { state.facilityAddress = facilityAddress; },
    setCity: (state, city) => { state.city = city; },
    setPostalCode: (state, postalCode) => { state.postalCode = postalCode; },
    setLicenseNumber: (state, licenseNumber) => { state.licenseNumber = licenseNumber; },
    setContactName: (state, contactName) => { state.contactName = contactName; },
    setPosition: (state, position) => { state.position = position; },
    setPhone: (state, phone) => { state.phone = phone; },
    setEmail: (state, email) => { state.email = email; },
    setIsValidForm: (state, isValidForm) => { state.isValidForm = isValidForm; },
    setIsStarted: (state, isStarted) => { state.isStarted = isStarted; },
    setIsFacilityComplete: (state, isFacilityComplete) => { state.isFacilityComplete = isFacilityComplete; },
    setCcfriOptInStatus: (state, ccfriOptInStatus) => {state.ccfriOptInStatus = ccfriOptInStatus;},
    addFacilityToStore: (state, facilityModel) => {
      if (facilityModel?.facilityId) {
        state.facilityStore[facilityModel.facilityId] = facilityModel;  
      }
    }
  },
  actions: {
    async saveFacility({ state, commit, rootState }) {
      let organizationId = rootState.organization.organizationId;
      if (!organizationId) {
        console.log('unable to save facility because you are not associated to an organization');
        throw 'unable to save facility because you are not associated to an organization';
      }
      if (!localStorage.getItem('jwtToken')) { // DONT Call api if there is no token.
        console.log('unable to save because you are not logged in');
        throw 'unable to save because you are not logged in';
      }
      let payload = JSON.parse(JSON.stringify(state));
      payload.organizationId = organizationId;
      payload.applicationId = rootState.organization.applicationId;

      delete payload['facilityList'];
      console.log('payload', payload);
      if (state.facilityId) {
        // has an orgaization ID, so update the data
        try {
          let response = await ApiService.apiAxios.put(ApiRoutes.FACILITY + '/' + state.facilityId, payload);
          commitToState(commit, response.data);
          return response;
        } catch (error) {
          console.log(`Failed to update existing Facility - ${error}`);
          throw error;
        }
      } else {
        // else create a new facility
        try {
          let response = await ApiService.apiAxios.post(ApiRoutes.FACILITY, payload);
          commit('setFacilityId', response.data?.facilityId);
          console.log('FacilityID??? ', response.data?.facilityId);
          commit('addToFacilityList', {
            facilityName: state.facilityName,
            facilityId: state.facilityId,
            ccofBaseFundingId: response.data?.ccofBaseFundingId,
            ccofBaseFundingStatus: response.data?.ccofBaseFundingStatus
          });
          return response;
        } catch (error) {
          console.log(`Failed to save new Facility - ${error}`);
          throw error;
        }
      }
    },
    async loadFacility({getters, commit}, facilityId) {
      if (!getters.getFacilityById(facilityId)) {
        return new Promise((resolve, reject) => {
          if (!localStorage.getItem('jwtToken')) { // DONT Call api if there is no token.
            console.log('unable to load facility because you are not logged in');
            reject('unable to  load facility because you are not logged in');
          }
          ApiService.apiAxios.get(ApiRoutes.FACILITY + '/' + facilityId)
            .then((response) => {
              response.data['facilityId'] = facilityId;
              commit('addFacilityToStore', response.data);
              state.facilityStore[facilityId] = response.data;
              // commitToState(commit, response.data);
              // commit('setFacilityId', facilityId);
              resolve(response);
            })
            .catch((e) => {
              console.log(`Failed to get existing Facility - ${e}`);
              reject(e);
            });
        });
      }
    },
    newFacility({commit}) {
      commit('setFacilityId', null);
      commitToState(commit, null);
    }
  },
};

function commitToState(commit, data) {
  commit('setFacilityName', data? data.facilityName: null);
  commit('setYearBeginOperation', data? data.yearBeginOperation: null);
  commit('setFacilityAddress', data? data.facilityAddress: null);
  commit('setCity', data? data.city: null);
  commit('setPostalCode', data? data.postalCode: null);
  commit('setLicenseNumber', data? data.licenseNumber: null);
  commit('setContactName', data? data.contactName: null);
  commit('setPosition', data? data.position: null);
  commit('setPhone', data? data.phone: null);
  commit('setEmail', data? data.email: null);
  commit('setCcfriOptInStatus', data? data.ccfriOptInStatus: null);  
}
