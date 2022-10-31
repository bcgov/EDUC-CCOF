import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';


export default {
  namespaced: true,
  state: {
    //Vuex doesn't handle maps. so keep track of the list of facilities
    //and update the facility details with the current selected facility
    facilityList: [],
    currentFacilityId: null,

    facilityName: null,
    facilityId: null,
    yearBeginOperation: null,
    facilityAddress: null,
    city: null,
    postalCode: null,
    // contactName: null,
    // position: null,
    // phone: null,
    // email: null,
    licenseNumber: null,
    // licenseEffectiveDate: null,
    // hasReceivedFunding: null,

    isValidForm: false,
    isStarted: false
  },
  getters: {
    isCurrentFacilityComplete: state => state.isValidForm,
  },  
  mutations: {
    setFacilityList: (state, facilityList) => { state.facilityList = facilityList; },
    setCurrentFacilityId: (state, currentFacilityId) => { state.currentFacilityId = currentFacilityId; },
    setFacilityName: (state, facilityName) => { state.facilityName = facilityName; },
    setFacilityId: (state, facilityId) => { state.facilityId = facilityId; },
    setYearBeginOperation: (state, yearBeginOperation) => { state.yearBeginOperation = yearBeginOperation; },
    setFacilityAddress: (state, facilityAddress) => { state.facilityAddress = facilityAddress; },
    setCity: (state, city) => { state.city = city; },
    setPostalCode: (state, postalCode) => { state.postalCode = postalCode; },
    setLicenseNumber: (state, licenseNumber) => { state.licenseNumber = licenseNumber; },
    setIsValidForm: (state, isValidForm) => { state.isValidForm = isValidForm; },
    setIsStarted: (state, isStarted) => { state.isStarted = isStarted; },
  },
  actions: {
    async saveFacility({ state, commit }) {
      return new Promise((resolve, reject) => {
        if (!localStorage.getItem('jwtToken')) { // DONT Call api if there is no token.
          console.log('unable to save because you are not logged in');
          reject('unable to save because you are not logged in');
        }
        const payload = {
          facilityName: state.facilityName,
          yearBeginOperation: state.yearBeginOperation,
          facilityAddress: state.facilityAddress,
          city: state.city,
          postalCode: state.postalCode,
          licenseNumber: '' + state.licenseNumber, //Make sure it's a string
        };
        if (state.facilityId) { // has an orgaization ID, so update the data
          ApiService.apiAxios.put(ApiRoutes.FACILITY + '/' + state.facilityId, payload)
            .then((response) => {
              commit('setfacilityName', response.data?.facilityName);
              commit('setyearBeginOperation', response.data?.yearBeginOperation);
              commit('setfacilityAddress', response.data?.facilityAddress);
              commit('setcity', response.data?.city);
              commit('setpostalCode', response.data?.postalCode);
              commit('setlicenseNumber', response.data?.licenseNumber);
              resolve(response);
            })
            .catch((e) => {
              console.log(`Failed to update existing Facility - ${e}`);
              reject(e);
            });

        } else {
          ApiService.apiAxios.post(ApiRoutes.Facility, payload)
            .then((response) => {
              commit('setFacilityId: null, response.data?.facilityId');
              commit('setCurrentFacilityId: null, response.data?.facilityId');
              resolve(response);
            })
            .catch((e) => {
              console.log(`Failed to save new New - ${e}`);
              reject(e);
            });
        }
      });
    }
  },
};
