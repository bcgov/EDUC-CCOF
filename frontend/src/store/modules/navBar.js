import { PATHS, CHANGE_REQUEST_TYPES } from '@/utils/constants';
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
function getFacilityListFromNewFacilityCR(userProfileList, changeAction) {
  const navBarFacilities = [];
  if (changeAction) {
    changeAction.newFacilities?.forEach(el => {
      const facility = userProfileList.find(f => f.facilityId === el.facilityId);
      if (facility) {
        console.log(el.baseFunding?.ccofBaseFundingId);
        navBarFacilities.push({
          facilityId: facility.facilityId,
          facilityName: facility.facilityName,
          facilityAccountNumber: facility.facilityAccountNumber,
          isFacilityComplete: facility.isFacilityComplete,
          licenseNumber: facility.licenseNumber,
          facilityStatus: facility.facilityStatus,
          unlockRfi: el.unlockRfi,
          unlockCcfri: el.unlockCcfri,
          unlockNmf: el.unlockNmf,
          ccfriStatus: el.ccfri?.ccfriStatus,
          ccfriOptInStatus: el.ccfri?.ccfriOptInStatus,
          ccfriApplicationId: el.ccfri?.ccfriApplicationId,
          ccfriFacilityId: el.ccfri?.ccfriFacilityId,
          isCCFRIComplete: el.ccfri?.isCCFRIComplete,
          hasNmf: el.ccfri?.hasNmf,
          hasRfi: el.ccfri?.hasRfi,
          isNmfComplete: el.ccfri?.isNmfComplete,
          isRfiComplete: el.ccfri?.isRfiComplete,
          eceweStatus: el.ecewe?.eceweStatus,
          eceweOptInStatus: el.ecewe?.eceweOptInStatus,
          eceweApplicationId: el.ecewe?.eceweApplicationId,
          eceweFacilityId: el.ecewe?.eceweFacilityId,
          ccofBaseFundingId: el.baseFunding?.ccofBaseFundingId,
          ccofBaseFundingStatus: el.baseFunding?.ccofBaseFundingStatus,
          isCCOFComplete: el.baseFunding?.isCCOFComplete
        });
      }
    });
  }
  //console.log(navBarFacilities);
  return navBarFacilities;
}
function filterNavBar(state) {
  //Mitchel - Since most CRs will be making changes to existing facilities
  //only grabs facilities from specific change request when new facility CR so far

  console.log(state.changeRequestMap);
  if (state.changeType ==='nf') {
    const newFacilityChangeAction = state.changeRequestMap.get(state.changeRequestId)?.changeActions?.find(item => item.changeType === CHANGE_REQUEST_TYPES.NEW_FACILITY);
    //console.log('change action: ', newFacilityChangeAction);
    //const newFacilityChangeAction = changeActions?.find(item => item.changeType === CHANGE_REQUEST_TYPES.NEW_FACILITY);
    const navBa = getFacilityListFromNewFacilityCR(state.userProfileList, newFacilityChangeAction);
    //console.log('nav bar list: ----', navBa);
    state.navBarList = navBa;
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
    const applicationStatus = (state.applicationStatus === 'SUBMITTED' && state.ccofApplicationStatus === 'ACTIVE')
                              ? 'APPROVED' : state.applicationStatus;
    state.navBarList = filterFacilityListForPCF(state.userProfileList, state.isRenewal, applicationStatus);
  }
}

export default {
  namespaced: true,
  state: {
    navBarItems: [], // The UI Navbar list structure shown on the left panel
    navBarList: [], // the filtered list  used by the navBar to generate the left panel
    userProfileList: [], // the full list of items loaded by user profile
    refreshNavBar: 1,  //The navbar watches this value and refreshes itself when this changes.
    canSubmit: true,
    changeRequestId: null,
    changeType: null,
    programYearId: null,
    currentUrl: null,
    navBarGroup: '', //defines which nav bar group is opened (CCOF, CCFRI, ECEWE)
    isRenewal: false,
    applicationStatus: null,
    changeRequestMap: new Map(), //TODO: merge these two

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
      console.log('nav refersh?');
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
      console.log('set navBar called with value: ' + property + ' , ' + value);
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
    updateNavBar: (state, payload) => {
      let navBarItem = state.userProfileList.find(item => item.facilityId == payload.facilityId);
      if (navBarItem) {
        navBarItem.facilityName = payload.facilityName;
        navBarItem.licenseNumber = payload.licenseNumber;
        filterNavBar(state);
        state.refreshNavBar++;
      }
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
    },
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
    getChangeActionNewFacByFacilityId: (state) => (facilityId) => {
      //this fn returns the data structure of the newFac data in the navbar. We can use this to update it on the individual pages so the navbar works
      //correctly before refresh and reload from dynamics.
      return state?.changeRequestMap.get(state.changeRequestId)?.changeActions?.find(el => el.changeType == CHANGE_REQUEST_TYPES.NEW_FACILITY).newFacilities?.find(el => el.facilityId == facilityId);
    }

  },
  actions: {
    // preload change request details needed for the navBar
    async loadChangeRequest({commit, dispatch, rootState}, changeRequestId) {
      let changeRequest = await dispatch('reportChanges/getChangeRequest', changeRequestId, { root: true});
      if (changeRequest?.programYearId) {
        console.log();
        commit('application/setProgramYearId', changeRequest?.programYearId, { root: true });
        commit('application/setProgramYearLabel', rootState.app.programYearList.list.find(el => el.programYearId == changeRequest.programYearId).name, { root: true });
        commit('application/setApplicationId', rootState.application?.applicationMap?.get(changeRequest?.programYearId).applicationId, { root: true });
      }
      let changeNotificationAction = changeRequest?.changeActions?.find(item => item.changeType === CHANGE_REQUEST_TYPES.PDF_CHANGE);
      if (changeNotificationAction) {
        await dispatch('reportChanges/loadChangeRequestDocs', changeNotificationAction.changeActionId, { root: true });
      }
      commit('addChangeRequestToStore', {changeRequestId: changeRequestId, changeRequestModel: changeRequest});
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
        await dispatch('loadChangeRequest', to.params.changeRecGuid);
        commit('setChangeRequestId', to.params.changeRecGuid);
      } else if (to?.params?.programYearGuid) {
        await dispatch('application/loadApplicationFromStore', to.params.programYearGuid, { root: true });
        commit('setProgramYearId', to.params.programYearGuid);
      } else {
        commit('clearNavBarList');
      }
    },
  }
};
