import { isEmpty } from 'lodash';
import { defineStore } from 'pinia';

import ApiService from '@/common/apiService.js';
import { useApplicationStore } from '@/store/application.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { useNavBarStore } from '@/store/navBar.js';
import { isAnyChangeRequestActive } from '@/utils/common.js';
import { ApiRoutes, CHANGE_REQUEST_TYPES, CHANGE_TYPES, DOCUMENT_TYPES } from '@/utils/constants.js';
import { checkSession } from '@/utils/session.js';

/*
change REQUEST guid is what we need for saving and loading.
A change request can have MANY change actions.
IE: one change request to add a new facility, may have multiple change ACTIONS to add a facility.
*/
export const useReportChangesStore = defineStore('reportChanges', {
  state: () => ({
    changeRequestId: undefined,
    changeActionId: undefined,
    changeActions: null,
    loadedChangeRequest: undefined,
    changeRequestStore: [],
    uploadedDocuments: [],
    mtfiFacilities: [],
    changeRequestMap: new Map(),
  }),
  getters: {
    isCREceweComplete: (state) => {
      return state.changeRequestMap.get(useNavBarStore().changeRequestId)?.isEceweComplete;
    },
    isCRLicenseComplete: (state) => {
      return state.changeRequestMap.get(useNavBarStore().changeRequestId)?.isLicenseUploadComplete;
    },
    isChangeNotificationFormComplete: (state) => {
      const index = state.uploadedDocuments?.findIndex(
        (document) => document.subject === DOCUMENT_TYPES.CR_NOTIFICATION_FORM,
      );
      return index > -1;
    },
    changeRequestStatus: (state) => {
      return state.changeRequestMap.get(useNavBarStore().changeRequestId)?.externalStatus;
    },
    isCCOFUnlocked: (state) => {
      return state.changeRequestMap
        .get(useNavBarStore().changeRequestId)
        ?.changeActions?.find((el) => el.changeType == CHANGE_REQUEST_TYPES.NEW_FACILITY)?.isCCOFUnlocked;
    },
    isEceweUnlocked: (state) => {
      return state.changeRequestMap
        .get(useNavBarStore().changeRequestId)
        ?.changeActions?.find((el) => el.changeType == CHANGE_REQUEST_TYPES.NEW_FACILITY)?.isEceweUnlocked;
    },
    isLicenseUploadUnlocked: (state) => {
      return state.changeRequestMap
        .get(useNavBarStore().changeRequestId)
        ?.changeActions?.find((el) => el.changeType == CHANGE_REQUEST_TYPES.NEW_FACILITY)?.isLicenseUploadUnlocked;
    },
    isSupportingDocumentsUnlocked: (state) => {
      return state.changeRequestMap
        .get(useNavBarStore().changeRequestId)
        ?.changeActions?.find((el) => el.changeType == CHANGE_REQUEST_TYPES.NEW_FACILITY)
        ?.isSupportingDocumentsUnlocked;
    },
    isDeclarationUnlocked: (state) => {
      return state.changeRequestMap.get(useNavBarStore().changeRequestId)?.unlockDeclaration;
    },
    isChangeRequestUnlocked: (state) => {
      return state.changeRequestMap.get(useNavBarStore().changeRequestId)?.isChangeRequestUnlocked;
    },
    isOtherDocumentsUnlocked: (state) => {
      return state.changeRequestMap
        .get(useNavBarStore().changeRequestId)
        ?.changeActions?.find((el) => el.changeType == CHANGE_REQUEST_TYPES.PDF_CHANGE)?.isOtherDocumentsUnlocked;
    },
    getChangeNotificationActionId: (state) => {
      return state.changeRequestMap
        .get(useNavBarStore().changeRequestId)
        ?.changeActions?.find((el) => el.changeType == CHANGE_REQUEST_TYPES.PDF_CHANGE)?.changeActionId;
    },
    hasActiveChangeRequest: (state) => {
      return isAnyChangeRequestActive(state.changeRequestStore);
    },
  },
  actions: {
    addChangeRequestToStore({ changeRequestId, changeRequestModel }) {
      const map = new Map(this.changeRequestMap);
      map.set(changeRequestId, changeRequestModel);
      this.changeRequestMap = map;
    },
    removeChangeMap() {
      this.changeRequestMap.clear();
    },
    removeChangeRequest(changeRequestId) {
      this.changeRequestMap.delete(changeRequestId);
    },
    setChangeRequestStore(model) {
      this.changeRequestStore = model;
    },
    setChangeRequestId(changeRequestId) {
      this.changeRequestId = changeRequestId;
    },
    setChangeActionId(changeActionId) {
      this.changeActionId = changeActionId;
    },
    setLoadedChangeRequest(loadedChangeRequest) {
      this.loadedChangeRequest = loadedChangeRequest;
    },
    setUploadedDocument(documents) {
      this.uploadedDocuments = documents;
    },
    addNewChangeRequestToMap(model) {
      this.changeRequestMap.set(model.changeRequestId, model);
      this.changeRequestMap = new Map(this.changeRequestMap); // // done to trigger reactive getter
    },
    setCRIsEceweComplete(value) {
      let cr = this.changeRequestMap.get(value.changeRequestId);
      if (cr) {
        cr.isEceweComplete = value.isComplete;
        this.changeRequestMap = new Map(this.changeRequestMap); // done to trigger reactive getter
      }
    },
    setCRIsLicenseComplete(value) {
      let cr = this.changeRequestMap.get(value.changeRequestId);
      if (cr) {
        cr.isLicenseUploadComplete = value.isComplete;
        this.changeRequestMap = new Map(this.changeRequestMap); // done to trigger reactive getter
      }
    },
    setMTFIFacilities(value) {
      this.mtfiFacilities = value;
    },
    addToMtfiFacilities(payload) {
      payload?.forEach((facility) => this.mtfiFacilities.push(facility));
    },
    addChangeNotificationId(value) {
      let cr = this.changeRequestMap.get(value.changeRequestId);
      if (cr?.changeActions) {
        cr.changeActions.push({
          applicationStatus: 1,
          changeActionId: value.changeNotificationActionId,
          changeType: CHANGE_REQUEST_TYPES.PDF_CHANGE,
          status: 1,
        });
        this.changeRequestMap = new Map(this.changeRequestMap); // done to trigger reactive getter
      }
    },
    deleteChangeNotificationId(value) {
      let cr = this.changeRequestMap.get(value.changeRequestId);
      if (cr?.changeActions) {
        cr.changeActions = cr.changeActions.filter((el) => el.changeType != CHANGE_REQUEST_TYPES.PDF_CHANGE);
        this.changeRequestMap = new Map(this.changeRequestMap); // done to trigger reactive getter
      }
    },
    addNewFacilityDataToCRMap(payload) {
      try {
        //save the newly created fac data into the change request map so it can be the source of truth

        const newFacilityObj = {
          baseFunding: {
            ccofBaseFundingId: payload.ccofBaseFundingId,
            ccofBaseFundingStatus: payload.ccofBaseFundingStatus,
            isCCOFComplete: payload.isCCOFComplete,
          },
          ccfri: {},
          changeRequestNewFacilityId: payload.changeRequestNewFacilityId,
          ecewe: {},
          facilityId: payload.facilityId,
          unlockCcfri: false,
          unlockNmf: false,
          unlockRfi: false,
        };

        this.changeRequestMap
          .get(payload.changeRequestId)
          ?.changeActions?.find((el) => el.changeType == CHANGE_REQUEST_TYPES.NEW_FACILITY)
          .newFacilities.push(newFacilityObj);
      } catch {
        // Pass.
      }
    },
    // GET a list of all Change Requests for an application using applicationID
    async getChangeRequestList() {
      checkSession();
      let store = [];
      try {
        let response;
        const applicationStore = useApplicationStore();
        const navBarStore = useNavBarStore();
        const applicationIds = applicationStore.applicationIds;
        if (applicationIds?.length > 0)
          response = await ApiService.apiAxios.get(ApiRoutes.APPLICATION_CHANGE_REQUEST + '/' + applicationIds);

        if (!isEmpty(response)) {
          for (const element of response.data) {
            if (element?.changeActions[0]?.facilities?.length === 0) {
              continue;
            }
            element.createdOnDate = new Date(element.createdOnDate).toLocaleDateString();
            store.push(element);

            element.changeActions.forEach((changeAction) => {
              if (changeAction.changeType == 'NEW_FACILITY') {
                const newFacilities = changeAction.facilities;
                newFacilities?.forEach((facility) =>
                  navBarStore.setNavBarFacilityChangeRequest({
                    facilityId: facility.facilityId,
                    changeRequestNewFacilityId: facility.changeRequestNewFacilityId,
                  }),
                );
              }
            });
          }
        }

        /*Ministry requirements want change request shown in the order of:
          Action Required
          In Progress
          All others
          priority numbers are arbitrary
        */
        store.sort((a, b) => {
          a.externalStatus === 3
            ? (a.priority = 99)
            : a.externalStatus === 1
              ? (a.priority = 98)
              : (a.priority = a.externalStatus);
          b.externalStatus === 3
            ? (b.priority = 99)
            : b.externalStatus === 1
              ? (b.priority = 98)
              : (b.priority = b.externalStatus);
          return b.priority - a.priority;
        });

        this.setChangeRequestStore(store);
      } catch (e) {
        console.log(`Failed to get load change req with error - ${e}`);
        throw e;
      }
    },

    // GET Change Request's details using changeRequestID
    async getChangeRequest(changeRequestId) {
      const navBarStore = useNavBarStore();

      let changeRequest = this.changeRequestMap.get(changeRequestId);
      if (changeRequest) {
        this.setLoadedChangeRequest(changeRequest);
        return changeRequest;
      } else {
        checkSession();
        try {
          let response = (await ApiService.apiAxios.get(ApiRoutes.CHANGE_REQUEST + '/' + changeRequestId))?.data;
          this.setLoadedChangeRequest(response);
          this.setChangeRequestId(response?.changeRequestId);

          let changeAction;
          switch (navBarStore.changeType) {
            case CHANGE_TYPES.NEW_FACILITY:
              changeAction = response?.changeActions?.find(
                (changeAction) => changeAction.changeType == CHANGE_REQUEST_TYPES.NEW_FACILITY,
              );
              break;
            case CHANGE_TYPES.CHANGE_NOTIFICATION:
              changeAction = response?.changeActions?.find(
                (changeAction) => changeAction.changeType == CHANGE_REQUEST_TYPES.PDF_CHANGE,
              );
              break;
            case CHANGE_TYPES.MTFI:
              changeAction = response?.changeActions?.find(
                (changeAction) => changeAction.changeType == CHANGE_REQUEST_TYPES.PARENT_FEE_CHANGE,
              );
              break;
          }
          this.setChangeActionId(changeAction?.changeActionId);

          let mtfiChangeActions = response?.changeActions?.filter(
            (changeAction) => changeAction.changeType == CHANGE_REQUEST_TYPES.PARENT_FEE_CHANGE,
          );
          let mtfiFacilities = [];
          mtfiChangeActions?.forEach((changeAction) => mtfiFacilities.push(changeAction.mtfi));
          this.setMTFIFacilities(...mtfiFacilities);

          const newFacilityChangeActions = response?.changeActions?.filter(
            (changeAction) => changeAction.changeType == CHANGE_REQUEST_TYPES.NEW_FACILITY,
          );
          newFacilityChangeActions?.forEach((changeAction) => {
            let newFacilities = changeAction.newFacilities;
            const navBarStore = useNavBarStore();
            newFacilities?.forEach((facility) =>
              navBarStore.setNavBarFacilityChangeRequest({
                facilityId: facility.facilityId,
                changeRequestNewFacilityId: facility.changeRequestNewFacilityId,
              }),
            );
          });
          this.addChangeRequestToStore({ changeRequestId: changeRequestId, changeRequestModel: response });

          return response;
        } catch (e) {
          console.log(`Failed to get change request with error - ${e}`);
          throw e;
        }
      }
    },
    async createChangeRequest(changeType) {
      const applicationStore = useApplicationStore();
      const organizationStore = useOrganizationStore();

      checkSession();
      let payload = {
        applicationId: applicationStore.applicationId,
        programYearId: applicationStore.programYearId,
        providerType: organizationStore.getOrgProviderTypeID,
        changeType: changeType,
      };
      try {
        let response = await ApiService.apiAxios.post('/api/changeRequest/documents', payload);

        this.setChangeRequestId(response?.data?.changeRequestId);
        this.setChangeActionId(response?.data?.changeActionId);
        this.addNewChangeRequestToMap(response?.data?.changeRequestId);
        return response.data;
      } catch (error) {
        console.info(`Failed to create a change request  - ${error}`);
        throw error;
      }
    },
    async deleteChangeRequest(changeRequestId) {
      checkSession();
      try {
        await ApiService.apiAxios.delete(ApiRoutes.CHANGE_REQUEST + '/' + changeRequestId);
        let index = this.changeRequestStore.findIndex((changeRec) => changeRec.changeRequestId === changeRequestId);
        if (index > -1) this.changeRequestStore.splice(index, 1);
        this.setChangeRequestStore(this.changeRequestStore);
      } catch (e) {
        console.log(`Failed to delete change req with error - ${e}`);
        throw e;
      }
    },
    async createChangeAction({ changeRequestId, type }) {
      checkSession();
      try {
        let response = await ApiService.apiAxios.post(`/api/changeRequest/${changeRequestId}/${type}`);
        return response.data;
      } catch (error) {
        console.info(`Failed to create a change request  - ${error}`);
        throw error;
      }
    },
    async deleteChangeAction(changeActionId) {
      checkSession();
      try {
        await ApiService.apiAxios.delete(ApiRoutes.CHANGE_REQUEST + '/changeAction/' + changeActionId);
      } catch (e) {
        console.log(`Failed to delete change action with error - ${e}`);
        throw e;
      }
    },
    async cancelChangeRequest(changeRequestId) {
      checkSession();
      if (changeRequestId) {
        try {
          let payload = {
            externalStatus: 6,
          };
          let response = await ApiService.apiAxios.patch(ApiRoutes.CHANGE_REQUEST + '/' + changeRequestId, payload);
          this.updateExternalStatusInChangeRequestStore({ changeRequestId: changeRequestId, newStatus: 6 });
          this.updateExternalStatusInChangeRequestMap({ changeRequestId: changeRequestId, newStatus: 'CANCELLED' });
          return response;
        } catch (e) {
          console.log(`Failed to cancel change request with error - ${e}`);
          throw e;
        }
      }
    },
    updateExternalStatusInChangeRequestStore({ changeRequestId, newStatus }) {
      if (this.changeRequestStore?.length > 0) {
        let index = this.changeRequestStore?.findIndex(
          (changeRequest) => changeRequest.changeRequestId == changeRequestId,
        );
        if (index > -1) {
          this.changeRequestStore[index].externalStatus = newStatus;
          this.setChangeRequestStore(this.changeRequestStore);
        }
      }
    },
    updateExternalStatusInChangeRequestMap({ changeRequestId, newStatus }) {
      let cr = this.changeRequestMap.get(changeRequestId);
      if (cr) {
        cr.externalStatus = newStatus;
        this.changeRequestMap = new Map(this.changeRequestMap); // done to trigger reactive getter
      }
    },
    //to load the documents, you need the change action ID. Everything else so far... you need the change REQUEST ID.
    //change action id will return arr of docs
    async loadChangeRequestDocs(changeActionId) {
      checkSession();
      try {
        let response = await ApiService.apiAxios.get(ApiRoutes.CHANGE_REQUEST + '/documents/' + changeActionId);
        this.setUploadedDocument(response.data);
        return response.data;
      } catch (e) {
        console.log(`Failed to get load req docs with error - ${e}`);
        throw e;
      }
    },
    async createChangeRequestMTFI(payload) {
      checkSession();
      try {
        let ccfriResponse = await ApiService.apiAxios.patch('/api/application/ccfri/', payload);
        await Promise.all(
          ccfriResponse?.data?.map(async (ccfri) => {
            let mtfiResponse = await ApiService.apiAxios.get(
              ApiRoutes.CHANGE_REQUEST + '/mtfi/' + ccfri?.ccfriApplicationId,
            );
            this.addToMtfiFacilities(mtfiResponse?.data);
          }),
        );
      } catch (error) {
        console.info(`Failed to create MTFI Change Requests - ${error}`);
        throw error;
      }
    },
    async deleteChangeRequestMTFI(payload) {
      checkSession();
      try {
        await Promise.all(
          payload.map(async (mtfiFacility) => {
            if (mtfiFacility.ccfriApplicationId)
              await ApiService.apiAxios.delete('/api/application/ccfri/' + mtfiFacility.ccfriApplicationId);
          }),
        );
        await Promise.all(
          payload.map(async (mtfiFacility) => {
            if (mtfiFacility.changeRequestMtfiId)
              await ApiService.apiAxios.delete(ApiRoutes.CHANGE_REQUEST + '/mtfi/' + mtfiFacility.changeRequestMtfiId);
          }),
        );
        payload.forEach((facility) => {
          let deleteIndex = this.mtfiFacilities.findIndex((item) => item.facilityId === facility.facilityId);
          if (deleteIndex >= 0) this.mtfiFacilities.splice(deleteIndex, 1);
        });
      } catch (error) {
        console.info(`Failed to delete MTFI Change Requests - ${error}`);
        throw error;
      }
    },
    async updateChangeRequestMTFI(payload) {
      checkSession();
      try {
        await ApiService.apiAxios.patch(`${ApiRoutes.CHANGE_REQUEST_MTFI}/${payload.changeRequestMtfiId}`, payload);
      } catch (error) {
        console.info(`Failed to delete MTFI Change Requests - ${error}`);
        throw error;
      }
    },
  },
});
