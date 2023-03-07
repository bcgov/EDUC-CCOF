import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';
import { checkSession } from '@/utils/session';

export default {
  namespaced: true,
  state: {
    isValidForm: undefined,
    model: {},
    summaryModel: {},

  },
  getters: {
    isCCFRIComplete: (state) => {
      return state.summaryModel?.facilities?.length > 0 ? state.summaryModel?.facilities.every(facility =>
        facility.ccfri?.ccof_formcomplete && (facility.ccfri?.ccfriOptInStatus === 1 || facility.ccfri?.ccfriOptInStatus === 0)
        && ((facility.ccfri?.unlockRfi === 1 || facility.ccfri?.hasRfi) ? facility.ccfri?.isRfiComplete : true)
        && ((facility.ccfri?.unlockNmf === 1 || facility.ccfri?.hasNmf) ? facility.ccfri?.isNmfComplete : true)) : false;
    },
    isECEWEComplete: (state) => {
      return state.summaryModel?.application?.isEceweComplete
        && state.summaryModel?.facilities?.length > 0 ? state.summaryModel?.facilities.every(facility => (facility.ecewe?.optInOrOut === 1 || facility.ecewe?.optInOrOut === 0)) : false;
    },
    isFacilityComplete: (state) => {
      return state.summaryModel?.facilities?.length > 0 ? state.summaryModel?.facilities.every(facility => (facility.facilityInfo?.isFacilityComplete == true)) : false;
    },
    areCheckBoxesComplete: (state, getters) => {
      let isComplete = (state.summaryModel?.application?.isEceweComplete
        && state.summaryModel?.application?.isLicenseUploadComplete
        && getters.isCCFRIComplete);
      return isComplete;
    },
  },
  mutations: {
    model(state, value) {
      state.model = value;
    },
    summaryModel(state, value) {
      state.summaryModel = value;
    },
    isValidForm(state, value) {
      state.isValidForm = value;
    },
  },
  actions: {
    async loadDeclaration({ commit, rootState }) {
      checkSession();
      try {
        let payload = (await ApiService.apiAxios.get(ApiRoutes.APPLICATION_DECLARATION + '/' + rootState.application.applicationId)).data;
        commit('model', payload);
      } catch (error) {
        console.log(`Failed to get Declaration - ${error}`);
        throw error;
      }
    },
    async updateDeclaration({ commit, state, rootState}, reLockPayload) {
      checkSession();
      let payload = { agreeConsentCertify:state.model.agreeConsentCertify,
        orgContactName:state.model.orgContactName,
        declarationAStatus:state.model?.declarationAStatus,
        declarationBStatus:state.model?.declarationBStatus };
      try {
        if ((Object.keys(reLockPayload).length > 0)) {
          payload = {...payload, ...reLockPayload};
        }
        let response = await ApiService.apiAxios.patch(ApiRoutes.APPLICATION_DECLARATION_SUBMIT + '/' + rootState.application.applicationId, payload);
        commit('application/setApplicationStatus', 'SUBMITTED', { root: true });
        commit('auth/setIsUserInfoLoaded', false, { root: true });
        return response;
      } catch (error) {
        console.log(`Failed to SUBMIT application - ${error}`);
        throw error;
      }
    },
    async loadSummary({ commit, state, rootState }) {
      checkSession();
      try {
        let payload = (await ApiService.apiAxios.get(ApiRoutes.APPLICATION_SUMMARY + '/' + rootState.application.applicationId)).data;
        let summaryModel = {
          organization: undefined,
          application: payload.application,
          facilities: payload.facilities,
        };
        commit('summaryModel', summaryModel);
        if (!rootState.app.isRenewal && payload.application?.organizationId) {
          summaryModel.organization = (await ApiService.apiAxios.get(ApiRoutes.ORGANIZATION + '/' + payload.application.organizationId)).data;
          commit('summaryModel', summaryModel);
        }
        summaryModel.facilities?.forEach(async (facility, index) =>  {
          if (facility.ccfri?.ccfriId) {
            let ccfriResponse = (await ApiService.apiAxios.get(ApiRoutes.CCFRIFACILITY + '/' + facility.ccfri.ccfriId)).data;
            summaryModel.facilities[index].ccfri.childCareTypes = ccfriResponse.childCareTypes;
            summaryModel.facilities[index].ccfri.dates = ccfriResponse.dates;
            commit('summaryModel', summaryModel);
          }
          if (!rootState.app.isRenewal) {
            summaryModel.facilities[index].facilityInfo = (await ApiService.apiAxios.get(ApiRoutes.FACILITY + '/' + facility.facilityId)).data;
            commit('summaryModel', summaryModel);
          }
        });
      } catch (error) {
        console.log(`Failed to load Summary - ${error}`);
        throw error;
      }
    },
  },

};
