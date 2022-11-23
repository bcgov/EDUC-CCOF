import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';
import { checkSession } from '@/utils/session';

export default {
  namespaced: true,
  state: {
    isValidForm: undefined,
    model: {}
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
    async saveFunding({ state }) {
      console.log('store model', state.model);
      let payload = { ...state.model };

      let deleteFields = [];
      if (payload.hasClosedMonth !== 'yes') {

        for (let i = 1; i <= 12; i++) {
          deleteFields.push('closedIn' + i);
        }
      }

      if (payload.isSchoolProperty !== 'yes') {
        deleteFields.push('beforeSchool', 'afterSchool', 'beforeKindergarten', 'afterKindergarten');
        payload.isSchoolProperty = 0;
      } else {
        payload.isSchoolProperty = 1;

        ['beforeSchool', 'afterSchool', 'beforeKindergarten', 'afterKindergarten'].forEach(item => {
          payload[item] = payload[item] ? 1 : 0;
        });
      }

      if (payload.isExtendedHours !== 'yes') {
        deleteFields.push('maxDaysPerWeekExtended', 'maxDaysPerYearExtended');
      }

      deleteFields.forEach(field => delete payload[field]);

      console.log('save group funding', payload);

      return await ApiService.apiAxios.post(ApiRoutes.GROUP_FUND_AMOUNT, payload);
    },
    async loadFunding({ commit }, fundingId) {
      checkSession();

      try {
        let response = await ApiService.apiAxios.get(ApiRoutes.GROUP_FUND_AMOUNT + '/' + fundingId);
        let model = response.data;
        model.ccofBaseFundingId = fundingId;

        for (let i = 1; i <= 12; i++) {
          if (model[`closedIn${i}`] === 1) {
            model.hasClosedMonth = 'yes';
          }
        }

        console.log('response', model);
        commit('model', model);
      } catch (error) {
        console.log(`Failed to get Funding - ${error}`);
        throw error;
      }
    }
  }
};
