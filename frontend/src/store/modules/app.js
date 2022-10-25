import ApiService from '@/common/apiService';

export default {
  namespaced: true,
  state: {
    pageTitle: null,
    alertNotificationText: '',
    alertNotificationQueue: [],
    alertNotification: false,
    programYears: [],
    childCareCategories: [],
    organizationType: []
  },
  getters: {
    programYears: state => state.programYears,
    childCareCategories: state => state.childCareCategories,
    organizationType: state => state.organizationType,

  },
  mutations: {
    setPageTitle: (state, pageTitle) => {
      state.pageTitle = pageTitle;
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
    setProgramYears: (state, programYears) => {
      state.programYears = programYears;
    },
    setChildCareCategories: (state, childCareCategories) => {
      state.childCareCategories = childCareCategories;
    },
    setOrganizationType: (state, organizationType) => {
      state.organizationType = organizationType;
    }

  },
  actions: {
    async getLookupInfo({commit}){
      if(localStorage.getItem('jwtToken')) { // DONT Call api if there is no token.
        const lookupInfo = await ApiService.getLookupInfo();
        commit('setProgramYears', lookupInfo.data?.programYear);
        commit('setChildCareCategories', lookupInfo.data?.childCareCategory);
        commit('setOrganizationType', lookupInfo.data?.organizationType);
      }
    },

  },
};
