import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';

export default {
  namespaced: true,
  state: {
    isValidForm: undefined,
    model: undefined,
  },
  mutations: {
    model(state, value) {
      state.model = value;
    },
    isValidForm(state, value) {
      state.isValidForm = value;
    },
  },
  actions: {
    async saveFamilyEligibility({ state }) {
      
      let payload = { ...state.model };
      
      if (payload.hasReceivedFunding !== 'yes') {
        delete payload.facilityName;
      }

      console.log('saveFamilyEligibility', payload);

      return await ApiService.apiAxios.post(ApiRoutes.FAMILY_ELIGIBILITY, payload);
    }
  }
};
