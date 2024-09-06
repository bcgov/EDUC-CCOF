import { filterFacilityListForPCF, checkApplicationUnlocked } from '../../utils/common';
import ApiService from '../../common/apiService';
import { ApiRoutes } from '../../utils/constants';

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
      //it should almost always have an app.. this just solves for the case where it's a brand new PCF application, and they haven't refreshed yet
      if(app){
        app.isEceweComplete = value;
      }
    },
    setIsLicenseUploadComplete(state, value) { state.isLicenseUploadComplete = value; },
    setIsLicenseUploadCompleteInMap(state, value) {
      let app = state.applicationMap?.get(state.programYearId);

      if (app){
        app.isLicenseUploadComplete = value;
      }
    },
    addApplicationsToMap: (state, applicationList) => {
      const map = new Map(state.applicationMap);
      applicationList?.forEach(el => {
        map.set(el.ccofProgramYearId, el);
      });
      state.applicationMap = map;
    },
    removeFacilityFromMap: (state, facilityId) => {
      let app = state.applicationMap?.get(state.programYearId);
      //it should almost always have an app.. this just solves for the case where it's a brand new PCF application, and they haven't refreshed yet
      if(app){
        app.facilityList = app.facilityList?.filter(fac => fac.facilityId != facilityId);
        const map = new Map(state.applicationMap);
        state.applicationMap = map;
      }
    },
  },
  getters: {
    formattedProgramYear: state => state.programYearLabel?.replace(/[^\d/]/g, ''),
    fiscalStartAndEndDates: state => {
      //set fiscal year dates to prevent user from choosing dates outside the current FY
      //ASSUMPTION that fiscal year start / end dates will not move from April / March
      if (state.programYearLabel?.length > 3 ) {
        let currYear =  state.programYearLabel?.substring(0,4);
        let fiscalYearStartDate = `${currYear}-04-01`;
        currYear = +currYear + 1;
        let fiscalYearEndDate = `${currYear}-03-31`;
        return {startDate: fiscalYearStartDate, endDate: fiscalYearEndDate };
      }
      //should never get here
      return {startDate: null, endDate: null };
    },
    latestProgramYearId: (state, getters, rootState) => { //TODO: figure out async issue that happens intermittently.
      console.log(rootState.app.programYearList.list);
      let currentGuid;
      let futureGuid;
      let lastGuid;

      let highestOrder = 1; //2020/21 default
      state.applicationMap.forEach((value, key) => {
        if (value.ccofProgramYearStatus === 'FUTURE') {
          futureGuid = key;
        }
        else if (value.ccofProgramYearStatus === 'CURRENT') {
          currentGuid = key;
        }
        else if ((rootState.app.programYearList.list.find(el => el.programYearId == key)?.order) > highestOrder){
          highestOrder = rootState.app.programYearList.list.find(el => el.programYearId == key)?.order;
          lastGuid = key;
        }
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
    async deletePcfApplication({ state}){
      //this should only be used on NEW PCF applications - usually in the case where the user incorrectly selects "GROUP or FAMILY"
      console.log(state?.applicationId);
      await ApiService.apiAxios.delete(ApiRoutes.APPLICATION + '/' + state?.applicationId);
    }

  }
};
