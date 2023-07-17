import ApiService from '@/common/apiService';

export default {
  namespaced: true,
  state: {
    pageTitle: null,
    subtitleBanner: '',
    showNavBar: false,
    isRenewal: false,

    //Notification Details
    alertNotificationText: '',
    alertNotificationQueue: [],
    alertNotification: false,

    //Lookup Table Details
    programYearList: {},
    childCareCategoryList: [],
    organizationTypeList: [],
    fundingModelTypeList: [],
    lookupInfo: null,
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
    setSubtitleBanner:(state,subtitleBanner) =>{
      state.subtitleBanner=subtitleBanner;
    },
    setAlertNotificationText: (state, alertNotificationText) => {
      state.alertNotificationText = alertNotificationText;
    },
    setAlertNotification: (state, alertNotification) => {
      state.alertNotification = alertNotification;
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
    setIsRenewal: (state, isRenewal) => {
      state.isRenewal = isRenewal;
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
