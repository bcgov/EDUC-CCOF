import ApiService from '@/common/apiService';

export default {
  namespaced: true,
  state: {
    pageTitle: null,
    showNavBar: false,
    navBarGroup: '',
    alertNotificationText: '',
    alertNotificationQueue: [],
    alertNotification: false,
    programYearList: [],
    childCareCategoryList: [],
    organizationTypeList: []
  },
  mutations: {
    setPageTitle: (state, pageTitle) => {
      state.pageTitle = pageTitle;
    },
    setShowNavBar: (state, showNavBar) => {
      state.showNavBar = showNavBar;
    },
    setNavBarGroup: (state, navBarGroup) => {
      state.navBarGroup = navBarGroup;
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
    }

  },
  actions: {
    async getLookupInfo({ commit }) {
      if (localStorage.getItem('jwtToken')) { // DONT Call api if there is no token.
        const lookupInfo = await ApiService.getLookupInfo();
        commit('setProgramYearList', lookupInfo.data?.programYear);
        commit('setChildCareCategoryList', lookupInfo.data?.childCareCategory);
        commit('setOrganizationTypeList', lookupInfo.data?.organizationType);
      }
    },

  },
};
