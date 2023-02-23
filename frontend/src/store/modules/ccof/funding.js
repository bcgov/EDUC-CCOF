import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';
import { checkSession } from '@/utils/session';
import { isEmpty, isEqual } from 'lodash';

export default {
  namespaced: true,
  state: {
    isValidForm: undefined,
    ccofBaseFundingId: undefined,
    fundingModel: {},
    loadedModel: {},
    modelStore: {},
  },
  mutations: {
    setFundingModel(state, value) {
      state.fundingModel = value;
    },
    setLoadedModel(state, value) {
      state.loadedModel = value;
    },
    setIsValidForm(state, value) {
      state.isValidForm = value;
    },
    setCcofBaseFundingId(state, value) {
      state.ccofBaseFundingId = value;
    },
    setModelStore(state, value) {
      state.modelStore = value;
    },
    addModelToStore: (state, { fundingId, model }) => {
      if (fundingId) {
        state.modelStore[fundingId] = model;
      }
    },
    deleteFromStore: (state, fundingId) => {
      delete state.modelStore[fundingId];
    }
  },
  getters: {
    isNewFundingStarted: state => !isEmpty(state.fundingModel),
    getModelById: (state) => (fundingId) => {
      return state.modelStore[fundingId];
    },

  },
  actions: {
    async saveFunding({ state, commit }) {

      checkSession();

      if (isEqual(state.fundingModel, state.loadedModel)) {
        console.info('no model changes');
        return;
      }

      let payload = { ...state.fundingModel };
      commit('setLoadedModel', state.fundingModel);

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

      deleteFields.forEach(field => delete payload[field]);

      console.log('save group funding', payload);
      let response = await ApiService.apiAxios.put(ApiRoutes.GROUP_FUND_AMOUNT + '/' + state.ccofBaseFundingId, payload);
      return response;

    },
    async loadFunding({ commit, getters }, fundingId) {
      commit('setCcofBaseFundingId', fundingId);
      let model = getters.getModelById(fundingId);
      if (model) {
        console.log('found model for guid: ', fundingId);
        commit('setFundingModel', model);
        commit('setLoadedModel', model);
      } else {
        checkSession();

        try {
          let response = await ApiService.apiAxios.get(ApiRoutes.GROUP_FUND_AMOUNT + '/' + fundingId);
          let model = response.data;
          //V-Radio expects numbers to be strings
          if (model.familyLicenseType) {
            model.familyLicenseType = ''+ model.familyLicenseType;
          }
          console.log('response', model);
          commit('setFundingModel', model);
          commit('setLoadedModel', model);
          commit('addModelToStore', { fundingId, model });

        } catch (error) {
          console.log(`Failed to get Funding - ${error}`);
          throw error;
        }
      }
    }
  }
};
