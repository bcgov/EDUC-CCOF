import { filterFacilityListForPCF, checkApplicationUnlocked } from '@/utils/common';
import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';

export default {
  namespaced: true,
  state: {
    applicationId: null,
    applicationStatus: null,
    applicationType: null,
    ccofApplicationStatus: null,
    programYearId: null,
    programYearLabel: null,
    isRenewal: false,

    unlockBaseFunding: false,
    unlockDeclaration: false,
    unlockEcewe: false,
    unlockLicenseUpload: false,
    unlockSupportingDocuments: false,

    isEceweComplete: false,
    isLicenseUploadComplete: false,

    ccofConfirmationEnabled: false,
    applicationMap: new Map(),

  },
  mutations: {
    setApplicationId(state, value) { state.applicationId = value; },
    setApplicationType(state, value) { state.applicationType = value; },
    setApplicationStatus(state, value) { state.applicationStatus = value; },
    setCcofApplicationStatus(state, value) { state.ccofApplicationStatus = value; },
    setProgramYearId(state, value) { state.programYearId = value; },
    setProgramYearLabel(state, value) {
      state.programYearLabel = value;
      state.formattedProgramYear = value?.replace(/[^\d/]/g, '');
    },
    setIsRenewal(state, value) { state.isRenewal = value; },
    setFormattedProgramYear(state, value) { state.formattedProgramYear = value; },
    setCcofConfirmationEnabled(state, value) { state.ccofConfirmationEnabled = value; },
    setUnlockBaseFunding(state, value) { state.unlockBaseFunding = value; },
    setUnlockDeclaration(state, value) { state.unlockDeclaration = value; },
    setUnlockEcewe(state, value) { state.unlockEcewe = value; },
    setUnlockLicenseUpload(state, value) { state.unlockLicenseUpload = value; },
    setUnlockSupportingDocuments(state, value) { state.unlockSupportingDocuments = value; },

    setIsEceweComplete(state, value) { state.isEceweComplete = value; },
    setIsEceweCompleteInMap(state, value){
      let app = state.applicationMap?.get(state.programYearId);
      app.isEceweComplete = value;
    },
    setIsLicenseUploadComplete(state, value) { state.isLicenseUploadComplete = value; },
    setIsLicenseUploadCompleteInMap(state, value) {
      let app = state.applicationMap?.get(state.programYearId);
      app.isLicenseUploadComplete = value;
    },

    addApplicationsToMap: (state, applicationList) => {
      const map = new Map(state.applicationMap);
      applicationList?.forEach(el => {
        map.set(el.ccofProgramYearId, el);
      });
      state.applicationMap = map;
    },
    async deletePcfApplication({state}){
      //this should only be used on NEW PCF applications - usually in the case where the user incorrectly selects "GROUP or FAMILY"
      await ApiService.apiAxios.delete(ApiRoutes.APPLICATION + '/' + state.applicationId);
      window.reload();
    }
  },
  getters: {
    formattedProgramYear: state => state.programYearLabel?.replace(/[^\d/]/g, ''),
    latestProgramYearId: state => { //TODO: figure out async issue that happens intermittently.
      let currentGuid;
      let futureGuid;
      let lastGuid;
      state.applicationMap.forEach((value, key) => {
        if (value.ccofProgramYearStatus === 'FUTURE') {
          futureGuid = key;
        }
        if (value.ccofProgramYearStatus === 'CURRENT') {
          currentGuid = key;
        }
        lastGuid = key;
      });
      return futureGuid ? futureGuid : currentGuid ? currentGuid : lastGuid; //TODO: add order to provider fiscal profile and then return the latest one based on the order.

    },
    applicationIds: state => {
      const applicationIds = [];
      state.applicationMap.forEach(value => {
        applicationIds.push(value.applicationId);
      });
      return applicationIds;
    },
    latestApplicationId: (state, getters) => state.applicationMap.get(getters.latestProgramYearId)?.applicationId,
    getFacilityListForPCFByProgramYearId: state => (selectedProgramYearId) => {
      const programYearId = selectedProgramYearId ? selectedProgramYearId : state.latestProgramYearId;
      const selectedApplication = state.applicationMap?.get(programYearId);
      let facilityList = selectedApplication?.facilityList;

      const isApplicationUnlocked = checkApplicationUnlocked(selectedApplication);
      const isRenewal = selectedApplication?.applicationType === 'RENEW';
      let applicationStatus = selectedApplication?.applicationStatus;
      if (isApplicationUnlocked) {
        applicationStatus = 'ACTION_REQUIRED'
      } else if (selectedApplication?.applicationStatus === 'SUBMITTED' && selectedApplication?.ccofApplicationStatus === 'ACTIVE') {
        applicationStatus = 'APPROVED';
      }

      facilityList = facilityList ? filterFacilityListForPCF(facilityList, isRenewal, applicationStatus) : facilityList;
      return facilityList;
    },
  },
  actions: {
    async loadApplicationFromStore({ state, commit, rootState}, programYearId) {
      console.log('loadApplicationFromStore called with programYearId: ', programYearId);
      const application = state.applicationMap.get(programYearId);
      if (application) {
        console.log('loadApplicationFromStore found for guid : ', application);
        commit('setApplicationId', application.applicationId);
        commit('setApplicationStatus', application.applicationStatus);
        commit('setApplicationType', application.applicationType);
        commit('setCcofApplicationStatus', application.ccofApplicationStatus);
        commit('setProgramYearId', application.ccofProgramYearId);
        commit('setProgramYearLabel', application.ccofProgramYearName);
        commit('setIsRenewal', (application.applicationType === 'RENEW'));
        commit('setUnlockBaseFunding', application.unlockBaseFunding);
        commit('setUnlockDeclaration', application.unlockDeclaration);
        commit('setUnlockEcewe', application.unlockEcewe);
        commit('setUnlockLicenseUpload', application.unlockLicenseUpload);
        commit('setUnlockSupportingDocuments', application.unlockSupportingDocuments);

        commit('setIsEceweComplete', application.isEceweComplete);
        commit('setIsLicenseUploadComplete', application.isLicenseUploadComplete);

        commit('navBar/setIsRenewal', (application.applicationType === 'RENEW'), { root: true });

        commit('navBar/setUserProfileList', rootState.application?.applicationMap?.get(programYearId).facilityList, { root: true });
      }
    },

  }
};
