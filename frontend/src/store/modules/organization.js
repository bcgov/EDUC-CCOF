import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';


export default {
  namespaced: true,
  state: {
    organizationId: null,
    ccofApplicationId: null,
    legalName: null,
    address1: null,
    city1: null,
    postalCode1: null,
    address2: null,
    city2: null,
    postalCode2: null,
    contactName: null,
    position: null,
    phone: null,
    businessId: null,
    email: null,
    incNumber: null,
    organizationType: null,
    providerType: null,
    isValidForm: false,
    isStarted: false
  },
  getters: {
    isOrganizationComplete: state => state.isValidForm,
  },  
  mutations: {
    setOrganizationId: (state, organizationId) => { state.organizationId = organizationId; },
    setCcofApplicationId: (state, ccofApplicationId) => { state.ccofApplicationId = ccofApplicationId; },
    setLegalName: (state, legalName) => { state.legalName = legalName; },
    setAddress1: (state, address1) => { state.address1 = address1; },
    setCity1: (state, city1) => { state.city1 = city1; },
    setPostalCode1: (state, postalCode1) => { state.postalCode1 = postalCode1; },
    setAddress2: (state, address2) => { state.address2 = address2; },
    setCity2: (state, city2) => { state.city2 = city2; },
    setPostalCode2: (state, postalCode2) => { state.postalCode2 = postalCode2; },
    setContactName: (state, contactName) => { state.contactName = contactName; },
    setPosition: (state, position) => { state.position = position; },
    setPhone: (state, phone) => { state.phone = phone; },
    setBusinessId: (state, businessId) => { state.businessId = businessId; },
    setEmail: (state, email) => { state.email = email; },
    setIncNumber: (state, incNumber) => { state.incNumber = incNumber; },
    setOrganizationType: (state, organizationType) => { state.organizationType = organizationType; },
    setProviderType: (state, providerType) => { state.providerType = providerType; },
    setIsValidForm: (state, isValidForm) => { state.isValidForm = isValidForm; },
    setIsStarted: (state, isStarted) => { state.isStarted = isStarted; },
  },
  actions: {
    async saveOrganization({ state, commit, rootState }) {

      if (!localStorage.getItem('jwtToken')) { // DONT Call api if there is no token.
        console.log('unable to save because you are not logged in');
        throw 'unable to save because you are not logged in';
      }

      let payload = JSON.parse(JSON.stringify(state));
      if (payload.incNumber) {
        payload.incNumber = '' + payload.incNumber; // need to ensure it's a string
      }
      
      //set program year:
      payload.programYearId = rootState.app.programYearList[0].ccof_program_yearid;
      console.log('payload', payload);

      if (state.organizationId) {
        // has an orgaization ID, so update the data
        try {
          let response = await ApiService.apiAxios.put(ApiRoutes.ORGANIZATION + '/' + state.organizationId, payload);
          commitToState(commit, response.data);
          return response;
        } catch (error) {
          console.log(`Failed to update existing Organization - ${error}`);
          throw error;
        }
      } else {
        try {
          let response = await ApiService.apiAxios.post(ApiRoutes.ORGANIZATION, payload);
          commit('setOrganizationId', response.data?.organizationId);
          commit('setCcofApplicationId', response.data?.ccofApplicationId);
          return response;
        } catch (error) {
          console.log(`Failed to save new Organization - ${error}`);
          throw error;
        }
      }
    },
    async loadOrganization({ commit }, organizationId) {
      if (!localStorage.getItem('jwtToken')) { // DONT Call api if there is no token.
        console.log('unable to load organization because you are not logged in');
        throw 'unable to load organization because you are not logged in';
      }
      try {
        let response = await ApiService.apiAxios.get(ApiRoutes.ORGANIZATION + '/' + organizationId);
        commitToState(commit, response.data);
      } catch (error) {
        console.log(`Failed to get Organization - ${error}`);
        throw error;
      }
    }    
  },
};

function commitToState(commit, data) {
  commit('setLegalName', data?.legalName);
  commit('setAddress1', data?.address1);
  commit('setCity1', data?.city1);
  commit('setPostalCode1', data?.postalCode1);
  commit('setAddress2', data?.address2);
  commit('setCity2', data?.city2);
  commit('setPostalCode2', data?.postalCode2);
  commit('setContactName', data?.contactName);
  commit('setPosition', data?.position);
  commit('setPhone', data?.phone);
  // don't update business Id just yet
  // commit('setBusinessId', response.data?.businessId); 
  commit('setEmail', data?.email);
  commit('setIncNumber', data?.incNumber);
  commit('setOrganizationType', data?.organizationType);

}

