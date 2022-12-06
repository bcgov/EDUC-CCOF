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
    async saveFamilyFunding({ state }) {
      
      let payload = { ...state.model };
      
      if (payload.hasClosedMonth !== 'yes') {
        delete payload.closedMonths;
      }
      
      if (payload.isExtendedHours !== 'yes') {
        delete payload.maxCapacityExtended;
        delete payload.maxDaysPerWeekExtended;
        delete payload.maxDaysPerYearExtended;
      }

      console.log('saveFamilyFunding', payload);

      return await ApiService.apiAxios.post(ApiRoutes.FAMILY_FUND_AMOUNT, payload);
    }
  }
};
