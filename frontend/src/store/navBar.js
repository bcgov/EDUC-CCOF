import { isEmpty } from 'lodash';
import { defineStore } from 'pinia';

import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useReportChangesStore } from '@/store/reportChanges.js';
import { filterFacilityListForPCF } from '@/utils/common.js';
import { CHANGE_REQUEST_TYPES, PATHS } from '@/utils/constants.js';

function getActiveIndex(items) {
  let foundIndex = -1;
  for (let i = 0; i < items.length && foundIndex < 0; i++) {
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
  for (let i = 0; i < items.length && !foundItem; i++) {
    if (items[i].position === index) {
      foundItem = items[i];
    } else if (items[i].items) {
      const navBarItem = getNavBarAtPositionIndex(items[i].items, index);
      if (navBarItem) {
        foundItem = navBarItem;
      }
    }
  }
  return foundItem;
}

function getFacilityListFromNewFacilityCR(userProfileList, changeAction) {
  const navBarFacilities = [];
  if (changeAction) {
    changeAction.newFacilities?.forEach((el) => {
      const facility = userProfileList.find((f) => f.facilityId === el.facilityId);
      if (facility) {
        navBarFacilities.push({
          facilityId: facility.facilityId,
          facilityName: facility.facilityName,
          facilityAccountNumber: facility.facilityAccountNumber,
          healthAuthority: facility.healthAuthority,
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
          isCCFRIClosuresComplete: el.ccfri?.isCCFRIClosuresComplete,
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
          isCCOFComplete: el.baseFunding?.isCCOFComplete,
        });
      }
    });
  }
  return navBarFacilities;
}

export const useNavBarStore = defineStore('navBar', {
  state: () => ({
    navBarItems: [], // The UI Navbar list structure shown on the left panel
    navBarList: [], // the filtered list  used by the navBar to generate the left panel
    userProfileList: [], // the full list of items loaded by user profile
    refreshNavBar: 1, //The navbar watches this value and refreshes itself when this changes.
    changeRequestId: null,
    changeType: null,
    programYearId: null,
    currentUrl: null,
    navBarGroup: '', //defines which nav bar group is opened (CCOF, CCFRI, ECEWE)
    isRenewal: false,
    applicationStatus: null,
    changeRequestMap: new Map(),
  }),
  getters: {
    isChangeRequest: (state) => {
      return state.currentUrl?.startsWith(PATHS.PREFIX.CHANGE_REQUEST);
    },
    nextPath: (state) => {
      const index = getActiveIndex(state.navBarItems);
      const link = getNavBarAtPositionIndex(state.navBarItems, index + 1)?.link;
      return link;
    },
    previousPath: (state) => {
      let index = getActiveIndex(state.navBarItems);
      return getNavBarAtPositionIndex(state.navBarItems, index - 1)?.link;
    },
    getNavByFacilityId: (state) => (facilityId) => {
      if (!facilityId) {
        return null;
      }
      return state.userProfileList.find((item) => item.facilityId === facilityId);
    },
    getNavByFundingId: (state) => (fundingId) => {
      if (!fundingId) {
        return null;
      }
      return state.userProfileList.find((item) => item.ccofBaseFundingId === fundingId);
    },
    getNavByCCFRIId: (state) => (ccfriId) => {
      if (!ccfriId) {
        return null;
      }
      if (state.changeType === 'mtfi') {
        return state.getChangeActionDetails('mtfi', 'ccfriApplicationId', ccfriId);
      } else {
        return state.userProfileList.find((item) => item.ccfriApplicationId === ccfriId);
      }
    },
    getChangeActionNewFacByFacilityId: (state) => (facilityId) => {
      //this fn returns the data structure of the newFac data in the navbar. We can use this to update it on the individual pages so the navbar works
      //correctly before refresh and reload from dynamics.
      return state?.changeRequestMap
        .get(state.changeRequestId)
        ?.changeActions?.find((el) => el.changeType === CHANGE_REQUEST_TYPES.NEW_FACILITY)
        .newFacilities?.find((el) => el.facilityId === facilityId);
    },
    //find the change action details details(the data element below change Action)
    getChangeActionDetails: (state) => (detailsProperty, detailsKey, detailsId) => {
      let item = null;
      const change = state.changeRequestMap.get(state.changeRequestId);
      if (change?.changeActions && change.changeActions.length > 0) {
        const details = change.changeActions[0][detailsProperty];
        item = details?.find((el) => el[detailsKey] === detailsId);
      }
      return item;
    },
  },
  actions: {
    setNavBarItems(value) {
      this.navBarItems = value;
    },

    setIsRenewal(value) {
      this.isRenewal = value;
    },
    setApplicationStatus([applicationStatus, ccofApplicationStatus]) {
      this.applicationStatus =
        applicationStatus === 'SUBMITTED' && ccofApplicationStatus === 'ACTIVE' ? 'APPROVED' : applicationStatus;
    },
    setCurrentUrl(value) {
      this.currentUrl = value;
    },
    setChangeType(value) {
      this.changeType = value;
    },
    setChangeRequestId(value) {
      this.programYearId = null;
      this.changeRequestId = value;
      this.filterNavBar();
    },
    setProgramYearId(value) {
      this.programYearId = value;
      this.changeRequestId = null;
      this.filterNavBar();
    },
    clearNavBarList() {
      this.programYearId = null;
      this.changeRequestId = null;
      this.navBarList = [];
    },
    forceNavBarRefresh() {
      this.refreshNavBar = this.refreshNavBar + 1;
    },
    setUserProfileList(value) {
      this.userProfileList = value;
    },
    setNavBarGroup(navBarGroup) {
      this.navBarGroup = navBarGroup;
    },
    /***********************************************
     * Some methods to to update the NavBar
     * These methods will refilter the navbar
     * and reforce the navbar to refresh
     ************************************************/
    setNavBarValue({ facilityId, property, value }) {
      let userProfileItem;
      if (this.changeType === 'mtfi') {
        userProfileItem = this.getChangeActionDetails('mtfi', 'ccfriFacilityId', facilityId);
      } else {
        userProfileItem = this.userProfileList.find((item) => item.facilityId === facilityId);
      }
      if (userProfileItem) {
        userProfileItem[property] = value;
        this.filterNavBar();
        this.refreshNavBar++;
      }
    },
    setNavBarFacilityComplete({ facilityId, complete }) {
      const userProfileItem = this.userProfileList.find((item) => item.facilityId === facilityId);
      if (userProfileItem) {
        userProfileItem.isFacilityComplete = complete;
        this.filterNavBar();
        this.refreshNavBar++;
      }
    },
    setNavBarFundingComplete({ fundingId, complete }) {
      const userProfileItem = this.userProfileList.find((item) => item.ccofBaseFundingId === fundingId);
      if (userProfileItem) {
        userProfileItem.isCCOFComplete = complete;
        this.filterNavBar();
        this.refreshNavBar++;
      }
    },
    setNavBarCCFRIComplete({ ccfriId, complete }) {
      let userProfileItem;
      if (this.changeType === 'mtfi') {
        userProfileItem = this.getChangeActionDetails('mtfi', 'ccfriApplicationId', ccfriId);
      } else {
        userProfileItem = this.userProfileList.find((item) => item.ccfriApplicationId === ccfriId);
      }
      if (userProfileItem) {
        userProfileItem.isCCFRIComplete = complete;
        this.filterNavBar();
        this.refreshNavBar++;
      }
    },
    setNavBarNMFComplete({ ccfriId, complete }) {
      const userProfileItem = this.userProfileList.find((item) => item.ccfriApplicationId === ccfriId);
      if (userProfileItem) {
        userProfileItem.isNmfComplete = complete;
        this.filterNavBar();
        this.refreshNavBar++;
      }
    },
    setNavBarRFIComplete({ ccfriId, complete }) {
      let userProfileItem;
      if (this.changeType === 'mtfi') {
        userProfileItem = this.getChangeActionDetails('mtfi', 'ccfriApplicationId', ccfriId);
      } else {
        userProfileItem = this.userProfileList.find((item) => item.ccfriApplicationId === ccfriId);
      }
      if (userProfileItem) {
        userProfileItem.isRfiComplete = complete;
        this.filterNavBar();
        this.refreshNavBar++;
      }
    },
    setNavBarCCFRIClosuresComplete({ ccfriId, complete }) {
      const userProfileItem = this.userProfileList.find((item) => item.ccfriApplicationId === ccfriId);
      if (isEmpty(userProfileItem)) return;
      userProfileItem.isCCFRIClosuresComplete = complete;
      this.refreshNavBarList();
    },
    setNavBarAfsComplete({ ccfriId, complete }) {
      let userProfileItem;
      if (this.changeType === 'mtfi') {
        userProfileItem = this.getChangeActionDetails('mtfi', 'ccfriApplicationId', ccfriId);
      } else {
        userProfileItem = this.userProfileList.find((item) => item.ccfriApplicationId === ccfriId);
      }
      if (isEmpty(userProfileItem)) return;
      userProfileItem.isAFSComplete = complete;
      this.refreshNavBarList();
    },
    addToNavBar(payload) {
      this.userProfileList.push(payload);
      this.filterNavBar();
      this.refreshNavBar++;
    },
    updateNavBar(payload) {
      const navBarItem = this.userProfileList.find((item) => item.facilityId === payload.facilityId);
      if (navBarItem) {
        navBarItem.facilityName = payload.facilityName;
        navBarItem.healthAuthority = payload.healthAuthority;
        navBarItem.licenseNumber = payload.licenseNumber;
        this.filterNavBar();
        this.refreshNavBar++;
      }
    },
    deleteFromNavBar(facilityId) {
      this.userProfileList = this.userProfileList.filter((item) => item.facilityId !== facilityId);
      this.filterNavBar();
      this.refreshNavBar++;
    },
    setNavBarFacilityChangeRequest({ facilityId, changeRequestNewFacilityId }) {
      const navBarItem = this.userProfileList.find((item) => item.facilityId === facilityId);
      if (navBarItem) {
        navBarItem.changeRequestNewFacilityId = changeRequestNewFacilityId;
        this.filterNavBar();
      }
    },
    refreshNavBarList() {
      this.filterNavBar();
      this.refreshNavBar++;
    },
    addChangeRequestToStore({ changeRequestId, changeRequestModel }) {
      this.changeRequestMap.set(changeRequestId, changeRequestModel);
    },
    removeChangeMap() {
      this.changeRequestMap.clear();
    },
    removeChangeRequest(changeRequestId) {
      this.changeRequestMap.delete(changeRequestId);
    },
    // preload change request details needed for the navBar
    async loadChangeRequest(changeRequestId) {
      const reportChangesStore = useReportChangesStore();
      const applicationStore = useApplicationStore();
      const appStore = useAppStore();

      const changeRequest = await reportChangesStore.getChangeRequest(changeRequestId);

      if (changeRequest?.programYearId) {
        applicationStore.setProgramYearId(changeRequest?.programYearId);
        applicationStore.setProgramYearLabel(
          appStore.programYearList.list.find((el) => el.programYearId === changeRequest.programYearId).name,
        );
        const applicationForChangeRequest = applicationStore?.applicationMap?.get(changeRequest.programYearId);
        applicationStore.setApplicationId(applicationForChangeRequest?.applicationId);
        applicationStore.setApplicationTemplateVersion(applicationForChangeRequest?.applicationTemplateVersion);
      }
      const changeNotificationAction = changeRequest?.changeActions?.find(
        (item) => item.changeType === CHANGE_REQUEST_TYPES.PDF_CHANGE,
      );
      if (changeNotificationAction) {
        await reportChangesStore.loadChangeRequestDocs(changeNotificationAction.changeActionId);
      }
      this.addChangeRequestToStore({ changeRequestId: changeRequestId, changeRequestModel: changeRequest });
    },
    async reloadChangeRequest(changeRequestId) {
      this.removeChangeRequest(changeRequestId);
      await this.loadChangeRequest(changeRequestId);
    },
    async setUrlDetails(to) {
      this.setCurrentUrl(to.fullPath);
      const applicationStore = useApplicationStore();

      if (to.fullPath?.startsWith(PATHS.PREFIX.CHANGE_REQUEST)) {
        const arr = to.fullPath.split('/');
        if (arr?.length > 2) {
          this.setChangeType(arr[2]);
        } else {
          this.setChangeType(null);
        }
      } else {
        this.setChangeType(null);
      }
      if (to?.params?.changeRecGuid) {
        await this.loadChangeRequest(to.params.changeRecGuid);
        this.setChangeRequestId(to.params.changeRecGuid);
      } else if (to?.params?.programYearGuid) {
        await applicationStore.loadApplicationFromStore(to.params.programYearGuid);
        this.setProgramYearId(to.params.programYearGuid);
      } else {
        this.clearNavBarList();
      }
    },

    decorateNavBar(facilityKey) {
      this.navBarList.map((nav) => {
        const facility = this.userProfileList.find((el) => el.facilityId === nav[facilityKey]);
        if (facility) {
          nav.facilityName = facility.facilityName;
          nav.facilityId = facility.facilityId;
        }
      });
    },
    filterNavBar() {
      if (this.changeType === 'nf') {
        const newFacilityChangeAction = this.changeRequestMap
          .get(this.changeRequestId)
          ?.changeActions?.find((item) => item.changeType === CHANGE_REQUEST_TYPES.NEW_FACILITY);
        const navBar = getFacilityListFromNewFacilityCR(this.userProfileList, newFacilityChangeAction);
        this.navBarList = navBar;
      } else if (this.changeType === 'mtfi') {
        const changeActions = this.changeRequestMap.get(this.changeRequestId)?.changeActions;
        if (changeActions && changeActions.length > 0) {
          this.navBarList = changeActions[0].mtfi; //for there is only 1 change action for the MTFI
          this.decorateNavBar('ccfriFacilityId');
        } else {
          this.navBarList = null;
        }
      } else {
        const applicationStatus =
          this.applicationStatus === 'SUBMITTED' && this.ccofApplicationStatus === 'ACTIVE'
            ? 'APPROVED'
            : this.applicationStatus;
        this.navBarList = filterFacilityListForPCF(this.userProfileList, this.isRenewal, applicationStatus);
      }
    },
  },
});
