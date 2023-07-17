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

  },
  mutations: {
    setApplicationId(state, value) { state.applicationId = value; },
    setApplicationType(state, value) { state.applicationType = value; },
    setApplicationStatus(state, value) { state.applicationStatus = value; },
    setCcofApplicationStatus(state, value) { state.ccofApplicationStatus = value; },
    setProgramYearId(state, value) { state.programYearId = value; },
    setProgramYearLabel(state, value) { state.programYearLabel = value; },
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

    setFromUserInfo(state, userInfo) {
      console.log('setFromUserInfo called: ', userInfo);
      state.applicationId = userInfo.applicationId;
      state.applicationStatus = userInfo.applicationStatus;
      state.applicationType = userInfo.applicationType;
      state.ccofApplicationStatus = userInfo.ccofApplicationStatus;
      state.programYearId = userInfo.ccofProgramYearId;
      state.programYearLabel = userInfo.ccofProgramYearName;
      state.isRenewal = (userInfo.applicationType === 'RENEW');
      state.formattedProgramYear = userInfo.ccofProgramYearName?.replace(/[^\d/]/g, '');

      state.unlockBaseFunding = userInfo.unlockBaseFunding;
      state.unlockDeclaration = userInfo.unlockDeclaration;
      state.unlockEcewe = userInfo.unlockEcewe;
      state.unlockLicenseUpload = userInfo.unlockLicenseUpload;
      state.unlockSupportingDocuments = userInfo.unlockSupportingDocuments;

      state.isEceweComplete = userInfo.isEceweComplete;
      state.isLicenseUploadComplete = userInfo.isLicenseUploadComplete;
    }
  },
  getters: {
    formattedProgramYear: state => state.programYearLabel?.replace(/[^\d/]/g, '')
  },
  actions: {
    loadFromUserinfo({ commit }, userInfo) {
      commit('setAapplicationId', userInfo.applicationId);
      commit('setApplicationStatus', userInfo.applicationStatus);
      commit('setApplicationType', userInfo.applicationType);
      commit('setCcofApplicationStatus', userInfo.ccofApplicationStatus);
      commit('setProgramYearId', userInfo.ccofProgramYearId);
      commit('setProgramYearLabel', userInfo.ccofProgramYearName);
      commit('setIsRenewal', (userInfo.applicationType === 'RENEW'));

      commit('setUnlockBaseFunding', userInfo.unlockBaseFunding);
      commit('setUnlockDeclaration', userInfo.unlockDeclaration);
      commit('setUnlockEcewe', userInfo.unlockEcewe);
      commit('setUnlockLicenseUpload', userInfo.unlockLicenseUpload);
      commit('setUnlockSupportingDocuments', userInfo.unlockSupportingDocuments);

      commit('setIsEceweComplete', userInfo.isEceweComplete);
      commit('setIsLicenseUploadComplete', userInfo.isLicenseUploadComplete);
    },

  },
};
