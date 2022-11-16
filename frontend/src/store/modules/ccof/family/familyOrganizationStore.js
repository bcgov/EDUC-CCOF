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
    async saveFamilyOrganization({ state }) {
      
      let payload = { ...state.model };
      

      console.log('saveFamilyOrganization', payload);

      return await ApiService.apiAxios.post(ApiRoutes.FAMILY_ORGANIZATION, payload);
    }
  }
};
