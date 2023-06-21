import ApiService from '@/common/apiService';

export default {
  namespaced: true,
  state: {
    pageTitle: null,
    //NavBar Details
    showNavBar: false,
    navBarGroup: '', //defines which nav bar group is opened (CCOF, CCFRI, ECEWE)
    navBarList: [], //holds the generated nav bar
    isRenewal: false,
    isOrganizationComplete: false,
    isLicenseUploadComplete: false,
    ccofApplicationComplete: false,
    ccofConfirmationEnabled: false,

    //Notification Details
    alertNotificationText: '',
    alertNotificationQueue: [],
    alertNotification: false,
    supportingDocumentUploadComplete: false,

    //Lookup Table Details
    programYearList: {},
    childCareCategoryList: [],
    organizationTypeList: [],
    fundingModelTypeList: [],
    lookupInfo: null,
    forceNavBarRefresh: 1,
    logoutTimerEnabled: false,
    logoutTime: undefined,
    logoutCounter: 120,
  },
  mutations: {
    setLookupInfo: (state, lookupInfo) => {
      if (lookupInfo) {
        state.lookupInfo = lookupInfo;
      } else {
        state.lookupInfo = null;
      }
    },
    setPageTitle: (state, pageTitle) => {
      state.pageTitle = pageTitle;
    },
    setAlertNotificationText: (state, alertNotificationText) => {
      state.alertNotificationText = alertNotificationText;
    },
    setAlertNotification: (state, alertNotification) => {
      state.alertNotification = alertNotification;
    },
    forceNavBarRefresh(state) {
      state.forceNavBarRefresh = state.forceNavBarRefresh + 1;
    },
    addAlertNotification(state, text) {
      state.alertNotificationQueue.push(text);
      if (!state.alertNotification) {
        state.alertNotification = true;
      }
    },
    setProgramYearList: (state, programYearList) => {
      state.programYearList = programYearList;
    },
    setChildCareCategoryList: (state, childCareCategoryList) => {
      state.childCareCategoryList = childCareCategoryList;
    },
    setOrganizationTypeList: (state, organizationTypeList) => {
      state.organizationTypeList = organizationTypeList;
    },

    setFundingModelTypeList: (state, fundingModelTypeList) => {
      state.fundingModelTypeList = fundingModelTypeList;
    },
    //Nav bar stuff
    setShowNavBar: (state, showNavBar) => {
      state.showNavBar = showNavBar;
    },
    setNavBarGroup: (state, navBarGroup) => {
      state.navBarGroup = navBarGroup;
    },
    setIsOrganizationComplete: (state, isOrganizationComplete) => {
      state.isOrganizationComplete = isOrganizationComplete;
    },
    bulkAddToNavNBar: (state, facilityList) => {
      if (facilityList) {
        state.navBarList = facilityList;
      }
    },
    setNavBarFacilityComplete: (state, { facilityId, complete }) => {
      let navBarItem = state.navBarList.find(item => item.facilityId == facilityId);
      if (navBarItem) {
        navBarItem.isFacilityComplete = complete;
      }
    },
    setNavBarFundingComplete: (state, { fundingId, complete }) => {
      let navBarItem = state.navBarList.find(item => item.ccofBaseFundingId == fundingId);
      if (navBarItem) {
        navBarItem.isCCOFComplete = complete;
      }
    },
    addToNavBarList: (state, payload) => {
      state.navBarList.push(payload);
    },
    deleteFromNavBarList: (state, facilityId) => {
      console.log('deleteFromNavBarList', state.navBarList, facilityId);
      state.navBarList = state.navBarList.filter(item => item.facilityId !== facilityId);
    },
    setCcofApplicationComplete: (state, ccofApplicationComplete) => {
      state.ccofApplicationComplete = ccofApplicationComplete;
    },
    setCcofConfirmationEnabled: (state, ccofConfirmationEnabled) => {
      state.ccofConfirmationEnabled = ccofConfirmationEnabled;
    },
    setIsLicenseUploadComplete: (state, isLicenseUploadComplete) => {
      state.isLicenseUploadComplete = isLicenseUploadComplete;
    },
    setIsRenewal: (state, isRenewal) => {
      state.isRenewal = isRenewal;
    },
    setSupportingDocumentUploadComplete: (state, supportingDocumentUploadComplete) => {
      state.supportingDocumentUploadComplete = supportingDocumentUploadComplete;
    },
    setLogoutTimerEnabled: (state, value) => {
      state.logoutTimerEnabled = value;
    },
    setLogoutTime: (state, value) => {
      state.logoutTime = value;
    },
    setLogoutCounter: (state, value) => {
      state.logoutCounter = value;
    },
  },
  getters: {
    currentYearLabel: state => state.programYearList?.current?.name,
    renewalYearLabel: state => state.programYearList?.renewal?.name?.replace(/[^\d/]/g, ''),
    childCareCategoryList: state => state.childCareCategoryList,
    organizationTypeList: state => state.organizationTypeList,
    fundingModelTypeList: state => state.fundingModelTypeList,
    lookupInfo: state => state.lookupInfo,
    logoutCounter: state => state.logoutCounter < 0 ? 0 : state.logoutCounter,

    getNavByFacilityId: (state) => (facilityId) => {
      if (!facilityId) {
        return null;
      }
      return state.navBarList.find(item => item.facilityId == facilityId);
    },
    getNavByFundingId: (state) => (fundingId) => {
      if (!fundingId) {
        return null;
      }
      return state.navBarList.find(item => item.ccofBaseFundingId == fundingId);
    },

    getNavByCCFRIId: (state) => (ccfriId) => {
      if (!ccfriId) {
        return null;
      }
      return state.navBarList.find(item => item.ccfriApplicationId == ccfriId);
    },

    getNextNavByFacilityId: (state) => (facilityId) => {
      if (!facilityId) {
        return null;
      }
      let index = state.navBarList.findIndex(item => item.facilityId == facilityId);
      if (index < state.navBarList?.length - 1) {
        return state.navBarList[index + 1];
      }
      return null;
    },
    getNextNavByFundingId: (state) => (funding) => {
      if (!funding) {
        return null;
      }
      let index = state.navBarList.findIndex(item => item.ccofBaseFundingId == funding);
      if (index < state.navBarList?.length - 1) {
        return state.navBarList[index + 1];
      }
      return null;
    },

    getNextPrevByFacilityId: (state) => (facilityId) => {
      if (!facilityId) {
        return null;
      }
      let index = state.navBarList.findIndex(item => item.facilityId == facilityId);
      if (index > 0) {
        return state.navBarList[index - 1];
      }
      return null;
    }
  },
  actions: {
    async getLookupInfo({ commit }) {
      if (localStorage.getItem('jwtToken')) { // DONT Call api if there is no token.
        const lookupInfo = await ApiService.getLookupInfo();
        commit('setLookupInfo', lookupInfo.data); //TODO: remove this one
        commit('setProgramYearList', lookupInfo.data?.programYear);
        commit('setChildCareCategoryList', lookupInfo.data?.childCareCategory);
        commit('setOrganizationTypeList', lookupInfo.data?.organizationType);
        commit('setFundingModelTypeList', lookupInfo.data?.fundingModelType);
      }
    },
    async startCounter({ state, commit }) {
      const d = new Date();
      const time = d.getTime() + (1000 * 120); //add 120 secons to current time
      commit('setLogoutTime', time);
      commit('setLogoutTimerEnabled', true);
      let logoutCount = Math.floor((state.logoutTime - new Date().getTime() ) / 1000);
      commit('setLogoutCounter', (logoutCount));
      while (state.logoutCounter > 0 && state.logoutTimerEnabled) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (state.logoutTimerEnabled) {
          let logoutCount = Math.floor((state.logoutTime - new Date().getTime() ) / 1000);
          commit('setLogoutCounter', (logoutCount));
        }
      }
      commit('setLogoutTimerEnabled', false);
    },
    stopCounter({ commit }) {
      commit('setLogoutCounter', 120);
      commit('setLogoutTimerEnabled', false);
    }
  },
};
