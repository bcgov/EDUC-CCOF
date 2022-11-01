import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';


export default {
  namespaced: true,
  state: {
    organizationId: null,
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
    organizationType: null
  },
  getters: {
    organizationId: state => state.organizationId,
    legalName: state => state.legalName,
    address1: state => state.address1,
    city1: state => state.city1,
    postalCode1: state => state.postalCode1,
    address2: state => state.address2,
    city2: state => state.city2,
    postalCode2: state => state.postalCode2,
    contactName: state => state.contactName,
    position: state => state.position,
    phone: state => state.phone,
    businessId: state => state.businessId,
    email: state => state.email,
    incNumber: state => state.incNumber,
    organizationType: state => state.organizationType
  },
  mutations: {
    setOrganizationId: (state, organizationId) => { state.organizationId = organizationId; },
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
  },
  actions: {
    async saveOrganization({ state, commit }) {

      if (!localStorage.getItem('jwtToken')) { // DONT Call api if there is no token.
        console.log('unable to save because you are not logged in');
        throw 'unable to save because you are not logged in';
      }

      let payload = JSON.parse(JSON.stringify(state));
      console.log('payload', payload);

      if (state.organizationId) {
        // has an orgaization ID, so update the data
        try {
          let response = await ApiService.apiAxios.put(ApiRoutes.ORGANIZATION + '/' + state.organizationId, payload);

          commit('setLegalName', response.data?.legalName);
          commit('setAddress1', response.data?.address1);
          commit('setCity1', response.data?.city1);
          commit('setPostalCode1', response.data?.postalCode1);
          commit('setAddress2', response.data?.address2);
          commit('setCity2', response.data?.city2);
          commit('setPostalCode2', response.data?.postalCode2);
          commit('setContactName', response.data?.contactName);
          commit('setPosition', response.data?.position);
          commit('setPhone', response.data?.phone);
          // don't update business Id just yet
          // commit('setBusinessId', response.data?.businessId); 
          commit('setEmail', response.data?.email);
          commit('setIncNumber', response.data?.incNumber);
          commit('setOrganizationType', response.data?.organizationType);

          return response;
        } catch (error) {
          console.log(`Failed to update existing Organization - ${error}`);
          throw error;
        }
      } else {
        try {
          let response = await ApiService.apiAxios.post(ApiRoutes.ORGANIZATION, payload);
          commit('setOrganizationId', response.data?.organizationId);
          return response;
        } catch (error) {
          console.log(`Failed to save new Organization - ${error}`);
          throw error;
        }
      }
    }
  },
};
