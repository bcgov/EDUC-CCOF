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
    async saveGroupFunding({ state }) {
      console.log('store model', state.model);
      let payload = { ...state.model };

      if (payload.hasClosedMonth !== 'yes') {
        delete payload.closedMonths;
      }

      if (payload.isSchoolProperty !== 'yes') {
        delete payload.beforeSchool;
        delete payload.afterSchool;
        delete payload.beforeKindergarten;
        delete payload.afterKindergarten;
      }

      if (payload.isExtendedHours !== 'yes') {
        delete payload.maxDaysPerWeekExtended;
        delete payload.maxDaysPerYearExtended;
      }

      console.log('saveFamilyFunding', payload);

      return await ApiService.apiAxios.post(ApiRoutes.GROUP_FUND_AMOUNT, payload);
    }
  }
};
