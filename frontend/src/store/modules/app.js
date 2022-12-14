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
    isLicenseUploadComplete: null,
    ccofLicenseUploadComplete:false,
    ccofApplicationComplete: false,
    ccofConfirmationEnabled: false,
    rfiList: [],
    //Notification Details
    
    alertNotificationText: '',
    alertNotificationQueue: [],
    alertNotification: false,
    supportingDocumentUploadComplete:false,

    //Lookup Table Details
    programYearList: [],
    childCareCategoryList: [],
    organizationTypeList: [],
    fundingModelTypeList: [],
    lookupInfo: null,
    navBarRefresh: 1,
  },
  mutations: {
    setLookupInfo: (state, lookupInfo) => {
      if(lookupInfo){
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
    refreshNavBar(state) {
      state.navBarRefresh = state.navBarRefresh + 1;
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
      state.navBarList = facilityList;
    },
    setNavBarFacilityComplete: (state, {facilityId, complete} ) => {
      let navBarItem = state.navBarList.find(item => item.facilityId == facilityId);
      if (navBarItem) {
        navBarItem.isFacilityComplete = complete;
      }
    },
    setNavBarFundingComplete: (state, {fundingId, complete} ) => {
      let navBarItem = state.navBarList.find(item => item.ccofBaseFundingId == fundingId);
      if (navBarItem) {
        navBarItem.isCCOFComplete = complete;
      }
    },
    addToNavBarList: (state, payload) => {
      state.navBarList.push (payload);
    },
    setRfiList: (state, rfiList) => {
      state.rfiList = rfiList;
    },

    setCcofApplicationComplete: (state, ccofApplicationComplete) => {
      state.ccofApplicationComplete = ccofApplicationComplete;
    },
    // setCcfriOptInComplete: (state, ccfriOptInComplete) => {
    //   state.ccfriOptInComplete = ccfriOptInComplete;
    // },
    setCcofConfirmationEnabled: (state, ccofConfirmationEnabled) => {
      state.ccofConfirmationEnabled = ccofConfirmationEnabled;
    },
    setIsLicenseUploadComplete: (state, isLicenseUploadComplete) => {
      state.isLicenseUploadComplete = isLicenseUploadComplete;
    },
    setIsRenewal: (state, isRenewal) => {
      state.isRenewal = isRenewal;
    },
    setCcofLicenseUploadComplete:(state, ccofLicenseUploadComplete) => {
      state.ccofLicenseUploadComplete = ccofLicenseUploadComplete;
    },
    setSupportingDocumentUploadComplete:(state, supportingDocumentUploadComplete) => {
      state.supportingDocumentUploadComplete = supportingDocumentUploadComplete;
    },
  },
  getters: {
    currentYearLabel: state => state.programYearList?.current?.name,
    futureYearLabel: state => state.programYearList?.future?.name,
    childCareCategoryList: state => state.childCareCategoryList,
    organizationTypeList: state => state.organizationTypeList,
    fundingModelTypeList: state => state.fundingModelTypeList,
    lookupInfo: state => state.lookupInfo,

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

  },
};
