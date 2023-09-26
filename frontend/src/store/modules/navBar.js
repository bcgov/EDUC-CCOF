import { PATHS, CHANGE_REQUEST_TYPES } from '@/utils/constants';
import {checkSession} from '@/utils/session';
import ApiService from '@/common/apiService';
import {ApiRoutes} from '@/utils/constants';
import { filterFacilityListForPCF } from '@/utils/common';

function getActiveIndex(items) {
  let foundIndex = -1;
  for (let i = 0; (i < items.length && foundIndex < 0); i++) {
    if (items[i].isActive) {
      foundIndex = items[i].position;
    } else if (items[i].items) {
      let index = getActiveIndex(items[i].items);
      if (index > 0) {
        foundIndex = index;
      }
    }
  }
  return foundIndex;
}
function getNavBarAtPositionIndex(items, index) {
  let foundItem = null;
  for (let i = 0; (i < items.length && !foundItem); i++) {
    if (items[i].position == index) {
      foundItem = items[i];
    } else if (items[i].items) {
      let navBarItem = getNavBarAtPositionIndex(items[i].items, index);
      if (navBarItem) {
        foundItem = navBarItem;
      }
    }
  }
  return foundItem;
}
//Add additional facility details to the navBar
function decoarateNavBar(state, facilityKey) {
  state.navBarList.forEach(nav => {
    const facility = state.userProfileList.find(el => el.facilityId === nav[facilityKey]);
    if (facility) {
      nav.facilityName = facility.facilityName;
      nav.facilityId = facility.facilityId;
    }
  });
}
//find the change action details details(the data element below change Action)
function getChangeActionDetails(state, detailsProperty, detailsKey, detailsId) {
  let item = null;
  let change = state.changeRequestMap.get(state.changeRequestId);
  if (change?.changeActions && change.changeActions.length > 0) {
    let details = change.changeActions[0][detailsProperty];
    item = details?.find(el => el[detailsKey] == detailsId);
  }
  return item;
}

function filterNavBar(state) {
  //Mitchel - Since most CRs will be making changes to existing facilities
  //only grabs facilities from specific change request when new facility CR so far
  if (state.changeType ==='nf') {
    const changeActions = state.changeRequestMap.get(state.changeRequestId)?.changeActions;
    const newFacilityChangeAction = changeActions?.find(item => item.changeType === CHANGE_REQUEST_TYPES.NEW_FACILITY);
    state.navBarList = newFacilityChangeAction?.newFacilities;
  } else if (state.changeType === 'mtfi') {
    const changeActions = state.changeRequestMap.get(state.changeRequestId)?.changeActions;
    if (changeActions && changeActions.length > 0) {
      state.navBarList = changeActions[0].mtfi; //for there is only 1 change action for the MTFI
      decoarateNavBar(state, 'ccfriFacilityId');
    } else {
      state.navBarList = null;
    }
  // PCF
  } else {
    state.navBarList = filterFacilityListForPCF(state.userProfileList, state.isRenewal, state.applicationStatus);
  }
}

export default {
  namespaced: true,
  state: {
    navBarItems: [], // The UI Navbar list structure shown on the left panel
    navBarList: [], // the filtered list  used by the navBar to generate the left panel
    userProfileList: [], // the full list of items loaded by user profile
    changeRequestMap: new Map(),
    refreshNavBar: 1,  //The navbar watches this value and refreshes itself when this changes.
    canSubmit: true,
    changeRequestId: null,
    changeType: null,
    programYearId: null,
    currentUrl: null,
    navBarGroup: '', //defines which nav bar group is opened (CCOF, CCFRI, ECEWE)
    isRenewal: false,
    applicationStatus: null,
  },
  mutations: {
    setNavBarItems: (state, value) => { state.navBarItems = value; },
    setCanSubmit: (state, value) => { state.canSubmit = value; },
    setIsRenewal(state, value) { state.isRenewal = value; },
    setApplicationStatus(state, [applicationStatus, ccofApplicationStatus]) {
      state.applicationStatus = (applicationStatus === 'SUBMITTED' && ccofApplicationStatus === 'ACTIVE') ? 'APPROVED' : applicationStatus;
    },
    setCurrentUrl(state, value) { state.currentUrl = value; },
    setChangeType(state, value) { state.changeType = value; },
    setChangeRequestId: (state, value) => {
      state.programYearId = null;
      state.changeRequestId = value;
      filterNavBar(state);
    },
    setProgramYearId: (state, value) => {
      state.programYearId = value;
      state.changeRequestId = null;
      filterNavBar(state);
    },
    clearNavBarList: state => {
      state.programYearId = null;
      state.changeRequestId = null;
      state.navBarList = [];
    },
    forceNavBarRefresh(state) {
      state.refreshNavBar = state.refreshNavBar + 1;
    },
    setUserProfileList: (state, value) => {state.userProfileList = value; },
    setNavBarGroup: (state, navBarGroup) => { state.navBarGroup = navBarGroup; },
    /***********************************************
     * Some methods to to update the NavBar
     * These methods will refilter the navbar
     * and reforce the navbar to refresh
    ************************************************/
    setNavBarValue: (state, { facilityId, property, value}) => {
      let userProfileItem;
      if (state.changeType === 'mtfi') {
        userProfileItem =  getChangeActionDetails(state, 'mtfi', 'ccfriFacilityId', facilityId);
      } else {
        userProfileItem = state.userProfileList.find(item => item.facilityId == facilityId);
      }
      if (userProfileItem) {
        userProfileItem[property] = value;
        filterNavBar(state);
        state.refreshNavBar++;
      }
    },
    setNavBarFacilityComplete: (state, { facilityId, complete }) => {
      let userProfileItem = state.userProfileList.find(item => item.facilityId == facilityId);
      if (userProfileItem) {
        userProfileItem.isFacilityComplete = complete;
        filterNavBar(state);
        state.refreshNavBar++;
      }
    },
    setNavBarFundingComplete: (state, { fundingId, complete }) => {
      let userProfileItem = state.userProfileList.find(item => item.ccofBaseFundingId == fundingId);
      if (userProfileItem) {
        userProfileItem.isCCOFComplete = complete;
        filterNavBar(state);
        state.refreshNavBar++;
      }
    },
    setNavBarCCFRIComplete: (state, { ccfriId, complete }) => {
      let userProfileItem;
      if (state.changeType === 'mtfi') {
        userProfileItem =  getChangeActionDetails(state, 'mtfi', 'ccfriApplicationId', ccfriId);
      } else {
        userProfileItem = state.userProfileList.find(item => item.ccfriApplicationId == ccfriId);
      }
      if (userProfileItem) {
        userProfileItem.isCCFRIComplete = complete;
        filterNavBar(state);
        state.refreshNavBar++;
      }
    },
    setNavBarNMFComplete: (state, { ccfriId, complete }) => {
      let userProfileItem = state.userProfileList.find(item => item.ccfriApplicationId == ccfriId);
      if (userProfileItem) {
        userProfileItem.isNmfComplete = complete;
        filterNavBar(state);
        state.refreshNavBar++;
      }
    },
    setNavBarRFIComplete: (state, { ccfriId, complete }) => {
      let userProfileItem;
      if (state.changeType === 'mtfi') {
        userProfileItem =  getChangeActionDetails(state, 'mtfi', 'ccfriApplicationId', ccfriId);
      } else {
        userProfileItem = state.userProfileList.find(item => item.ccfriApplicationId == ccfriId);
      }
      if (userProfileItem) {
        userProfileItem.isRfiComplete = complete;
        filterNavBar(state);
        state.refreshNavBar++;
      }
    },
    addToNavBar: (state, payload) => {
      state.userProfileList.push(payload);
      filterNavBar(state);
      state.refreshNavBar++;
    },
    deleteFromNavBar: (state, facilityId) => {
      state.userProfileList = state.userProfileList.filter(item => item.facilityId !== facilityId);
      filterNavBar(state);
      state.refreshNavBar++;
    },
    setNavBarFacilityChangeRequest: (state, { facilityId, changeRequestNewFacilityId }) => {
      let navBarItem = state.userProfileList.find(item => item.facilityId == facilityId);
      if (navBarItem) {
        navBarItem.changeRequestNewFacilityId = changeRequestNewFacilityId;
        filterNavBar(state);
      }
    },
    refreshNavBarList:(state) => {
      filterNavBar(state);
      state.refreshNavBar++;
    },
    addChangeRequestToStore: (state, {changeRequestId, changeRequestModel}) => {
      state.changeRequestMap.set(changeRequestId, changeRequestModel);
    },
    removeChangeMap:(state) => {
      state.changeRequestMap.clear();
    },
    removeChangeRequest:(state, changeRequestId) => {
      state.changeRequestMap.delete(changeRequestId);
    }
  },
  getters: {
    isChangeRequest: (state) => {
      return state.currentUrl?.startsWith(PATHS.PREFIX.CHANGE_REQUEST);
    },
    nextPath: (state) => {
      const index = getActiveIndex(state.navBarItems);
      const  link = getNavBarAtPositionIndex(state.navBarItems, (index + 1))?.link;
      return link;
    },
    previousPath: (state) => {
      let index = getActiveIndex(state.navBarItems);
      return getNavBarAtPositionIndex(state.navBarItems, (index - 1))?.link;
    },
    getNavByFacilityId: (state) => (facilityId) => {
      if (!facilityId) {
        return null;
      }
      return state.userProfileList.find(item => item.facilityId == facilityId);
    },
    getNavByFundingId: (state) => (fundingId) => {
      if (!fundingId) {
        return null;
      }
      return state.userProfileList.find(item => item.ccofBaseFundingId == fundingId);
    },
    getNavByCCFRIId: (state) => (ccfriId) => {
      if (!ccfriId) {
        return null;
      }
      if(state.changeType==='mtfi'){
        return getChangeActionDetails(state, 'mtfi', 'ccfriApplicationId', ccfriId);
      }
      else{
        return state.userProfileList.find(item => item.ccfriApplicationId == ccfriId);
      }
    },

  },
  actions: {
    // preload change request details needed for the navBar
    async loadChangeRequest({state, commit, dispatch}, changeRequestId) {
      if (!state.changeRequestMap.get(changeRequestId)) {
        checkSession();
        try {
          let response = (await ApiService.apiAxios.get(ApiRoutes.CHANGE_REQUEST + '/' + changeRequestId))?.data;
          commit('addChangeRequestToStore', {changeRequestId: changeRequestId, changeRequestModel: response});
          let changeNotificationAction = response?.changeActions?.find(item => item.changeType === CHANGE_REQUEST_TYPES.PDF_CHANGE);
          if (changeNotificationAction)
            await dispatch('reportChanges/loadChangeRequestDocs', changeNotificationAction.changeActionId, { root: true });
        } catch(e) {
          console.log(`Failed to get change request with error - ${e}`);
          throw e;
        }
      }
    },
    async reloadChangeRequest({commit, dispatch}, changeRequestId) {
      commit('removeChangeRequest', changeRequestId);
      await dispatch('loadChangeRequest', changeRequestId);
    },
    async setUrlDetails({commit, dispatch}, to) {
      console.log('to url is: ', to);
      commit('setCurrentUrl', to.fullPath);

      if (to.fullPath?.startsWith(PATHS.PREFIX.CHANGE_REQUEST)) {
        const arr = to.fullPath.split('/');
        if (arr?.length > 2) {
          commit('setChangeType', arr[2]);
        } else {
          commit('setChangeType', null);
        }
      } else {
        commit('setChangeType', null);
      }
      if (to?.params?.changeRecGuid) {
        commit('setChangeRequestId', to.params.changeRecGuid);
      } else if (to?.params?.programYearGuid) {
        commit('setProgramYearId', to.params.programYearGuid);
        await dispatch('application/loadApplicationFromStore', to.params.programYearGuid, { root: true });
      } else {
        commit('clearNavBarList');
      }
    },
  }
};
