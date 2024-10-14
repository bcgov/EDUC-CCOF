import { defineStore } from 'pinia';
import { useApplicationStore } from './application.js';

import ApiService from '../common/apiService.js';
import { PROGRAM_YEAR_LANGUAGE_TYPES } from '../utils/constants.js';

export const useAppStore = defineStore('app', {
  state: () => ({
    pageTitle: null,
    subtitleBanner: '',
    showNavBar: false,

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
  }),
  actions: {
    setLookupInfo(lookupInfo) {
      if (lookupInfo) {
        this.lookupInfo = lookupInfo;
      } else {
        this.lookupInfo = null;
      }
    },
    setPageTitle(pageTitle) {
      this.pageTitle = pageTitle;
    },
    setSubtitleBanner(state, subtitleBanner) {
      this.subtitleBanner = subtitleBanner;
    },
    setAlertNotificationText(alertNotificationText) {
      this.alertNotificationText = alertNotificationText;
    },
    setAlertNotification(alertNotification) {
      this.alertNotification = alertNotification;
    },
    addAlertNotification(text) {
      this.alertNotificationQueue.push(text);
      if (!this.alertNotification) {
        this.alertNotification = true;
      }
    },
    setProgramYearList(programYearList) {
      this.programYearList = programYearList;
    },
    setChildCareCategoryList(childCareCategoryList) {
      this.childCareCategoryList = childCareCategoryList;
    },
    setOrganizationTypeList(organizationTypeList) {
      this.organizationTypeList = organizationTypeList;
    },

    setFundingModelTypeList(fundingModelTypeList) {
      this.fundingModelTypeList = fundingModelTypeList;
    },
    //Nav bar stuff
    setShowNavBar(showNavBar) {
      this.showNavBar = showNavBar;
    },
    setLogoutTimerEnabled(value) {
      this.logoutTimerEnabled = value;
    },
    setLogoutTime(value) {
      this.logoutTime = value;
    },
    setLogoutCounter(value) {
      this.logoutCounter = value;
    },
    async getLookupInfo() {
      if (localStorage.getItem('jwtToken')) {
        const lookupInfo = await ApiService.getLookupInfo();
        this.setLookupInfo(lookupInfo.data);
        this.setLookupInfo(lookupInfo.data); // FIXME: 2022 dev: remove this one.  2024 Trev: What??
        this.setProgramYearList(lookupInfo.data?.programYear);
        this.setChildCareCategoryList(lookupInfo.data?.childCareCategory);
        this.setOrganizationTypeList(lookupInfo.data?.organizationType);
        this.setFundingModelTypeList(lookupInfo.data?.fundingModelType);
      }
    },
    async startCounter() {
      const d = new Date();
      const time = d.getTime() + 1000 * 120; //add 120 secons to current time
      this.setLogoutTime(time);
      this.setLogoutTimerEnabled(true);
      let logoutCount = Math.floor((this.logoutTime - new Date().getTime()) / 1000);
      this.setLogoutCounter(logoutCount);
      while (this.logoutCounter > 0 && this.logoutTimerEnabled) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (this.logoutTimerEnabled) {
          let logoutCount = Math.floor((this.logoutTime - new Date().getTime()) / 1000);
          this.setLogoutCounter(logoutCount);
        }
      }
      this.setLogoutTimerEnabled(false);
    },
    stopCounter() {
      this.setLogoutCounter(120);
      this.setLogoutTimerEnabled(false);
    },
  },
  getters: {
    currentYearLabel(state) {
      return state.programYearList?.current?.name;
    },
    renewalYearLabel(state) {
      return state.programYearList?.renewal?.name?.replace(/[^\d/]/g, '');
    },
    getLogoutCounter(state) {
      return state.logoutCounter < 0 ? 0 : this.logoutCounter;
    },
    getFundingUrl(state, programYearId) {
      return state?.programYearList.list.find((el) => el.programYearId == programYearId)?.fundingGuidelinesUrl;
    },
    getLanguageYearLabel(state) {
      const applicationStore = useApplicationStore();
      const orderNumber = state?.programYearList.list.find(
        (el) => el.programYearId == applicationStore?.programYearId,
      )?.order;
      if (orderNumber < 5) {
        return PROGRAM_YEAR_LANGUAGE_TYPES.HISTORICAL;
      } else {
        return PROGRAM_YEAR_LANGUAGE_TYPES.FY2024_25;
      }
    },
  },
});