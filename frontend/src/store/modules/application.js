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
    setIsLicenseUploadComplete(state, value) { state.isLicenseUploadComplete = value; },

    addApplicationsToMap: (state, applicationList) => {
      const map = new Map(state.applicationMap);
      applicationList?.forEach(el => {
        map.set(el.ccofProgramYearId, el);
      });
      state.applicationMap = map;
    },

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
    latestApplicationId: (state, getters) => state.applicationMap.get(getters.latestProgramYearId)?.applicationId
  },
  actions: {
    async loadApplicationFromStore({ state, commit}, programYearId) {
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

      }
    },

  }
};
