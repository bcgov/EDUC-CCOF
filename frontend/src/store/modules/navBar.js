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
function filterNavBar(state) {
  if (state.changeRequestId) {
    state.navBarList = state.userProfileList.filter(el => el.changeRequestId == state.changeRequestId);
  } else if (state.programYearId) {
    state.navBarList = state.userProfileList.filter(el => !el.changeRequestId); //TODO: This will take FACILITY.STATUS as well
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
    programYearId: null,
    navBarGroup: '', //defines which nav bar group is opened (CCOF, CCFRI, ECEWE)
  },
  mutations: {
    setNavBarItems: (state, value) => { state.navBarItems = value; },
    setCanSubmit: (state, value) => { state.canSubmit = value; },

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
    clearGuids: (state) => {
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
      const userProfileItem = state.userProfileList.find(item => item.facilityId == facilityId);
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
      let userProfileItem = state.userProfileList.find(item => item.ccfriApplicationId == ccfriId);
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
      let userProfileItem = state.userProfileList.find(item => item.ccfriApplicationId == ccfriId);
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
    setNavBarFacilityChangeRequest: (state, { facilityId, changeRequestFacilityId }) => {
      console.log('setting new fac ID!');
      let navBarItem = state.userProfileList.find(item => item.facilityId == facilityId);
      if (navBarItem) {
        navBarItem.changeRequestFacilityId = changeRequestFacilityId;
        filterNavBar(state);
      }
    },
    refreshNavBarList:(state) => {
      filterNavBar(state);
      state.refreshNavBar++;
    },

  },
  getters: {
    isChangeRequest: (state) => {
      return state.changeRequestId? true : false;
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
      return state.userProfileList.find(item => item.ccfriApplicationId == ccfriId);
    },

  }
};
