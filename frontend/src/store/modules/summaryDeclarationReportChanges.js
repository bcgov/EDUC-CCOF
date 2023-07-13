import ApiService from '@/common/apiService';
import {ApiRoutes} from '@/utils/constants';
import {checkSession} from '@/utils/session';

function getProgramYear(selectedGuid, programYearList){
  const programYear = programYearList.find(({ programYearId }) =>  programYearId == selectedGuid );

  if(!programYear){
    ///console.log('SELECTED PROGRAM YEAR GUID NOT FOUND :( ');
    throw 'SELECTED PROGRAM YEAR GUID NOT FOUND ';
  }

  return programYear;
}

export default {
  namespaced: true,
  state: {
    isValidForm: undefined,
    model: {},
    summaryModel: {},
    isSummaryLoading: [],
    isMainLoading: true,
    isLoadingComplete: false,
  },
  getters: {
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
    isSummaryLoading(state, value) {
      state.isSummaryLoading = value;
    },
    isMainLoading(state, value) {
      state.isMainLoading = value;
    },
    isValidForm(state, value) {
      state.isValidForm = value;
    },
    isLoadingComplete(state, value) {
      state.isLoadingComplete = value;
    }
  },
  actions: {

    // TO - DO
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

    // TO - DO
    async updateDeclaration({ commit, state, rootState}, reLockPayload) {
      checkSession();
      let payload = {
        agreeConsentCertify:state.model.agreeConsentCertify,
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

    async loadSummary({ commit, rootState }) {
      checkSession();
      try {
        commit('isMainLoading', true);
        let payload = await this.loadChangeRequestDocs(this.$route.params.urlGuid);
        this.uploadedDocuments = payload?.map(document => ({
          name: document.filename,
          subject: document.subject
        }));
        await commit('isLoadingComplete', true );
      } catch (error) {
        console.log(`Failed to load Summary - ${error}`);
        throw error;
      }
    },

    // eslint-disable-next-line no-empty-pattern
    async updateApplicationStatus({}, applicationObj) {
      checkSession();
      try {
        await ApiService.apiAxios.put('/api/application/status/'  + applicationObj.applicationId, applicationObj);
      } catch (error) {
        console.log(`Failed to update application status - ${error}`);
        throw error;
      }

    }
  },

};
