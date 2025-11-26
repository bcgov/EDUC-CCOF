import { isEqual } from 'lodash';
import { defineStore } from 'pinia';

import ApiService from '@/common/apiService.js';
import { useAppStore } from '@/store/app.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useReportChangesStore } from '@/store/reportChanges.js';
import { isNullOrBlank, sortByFacilityId } from '@/utils/common.js';
import { ApiRoutes, CHANGE_REQUEST_TYPES } from '@/utils/constants.js';
import { PROGRAM_YEAR_LANGUAGE_TYPES } from '@/utils/constants.js';
import { checkSession } from '@/utils/session.js';

export const useEceweAppStore = defineStore('eceweApp', {
  state: () => ({
    isStarted: false,
    applicationId: null,
    facilities: null,
    loadedFacilities: null,
    eceweModel: null,
    loadedModel: null,
    fundingModelTypes: null,
    optinECEWEChangeRequestReadonly: false,
    belongsToUnionChangeRequestReadonly: false,
  }),
  actions: {
    setIsStarted(isStarted) {
      this.isStarted = isStarted;
    },
    setApplicationId(applicationId) {
      this.applicationId = applicationId;
    },
    setEceweModel(model) {
      this.eceweModel = model;
    },
    setLoadedModel(model) {
      this.loadedModel = model;
    },
    setFacilities(facilities) {
      this.facilities = facilities;
    },
    setLoadedFacilities(loadedFacilities) {
      this.loadedFacilities = loadedFacilities;
    },
    setFundingModelTypes(fundingModelTypes) {
      this.fundingModelTypes = fundingModelTypes;
    },
    //if org has already opted-in to ECE-WE on the core application, they cannot change it on CR new facility
    setOptinECEWEChangeRequestReadonly(optinECEWEChangeRequestReadonly) {
      this.optinECEWEChangeRequestReadonly = optinECEWEChangeRequestReadonly;
    },
    //if org has already stated they are in a union, they cannot change it on CR new facility (2024 and previous question)
    setBelongsToUnionChangeRequestReadonly(belongsToUnionChangeRequestReadonly) {
      this.belongsToUnionChangeRequestReadonly = belongsToUnionChangeRequestReadonly;
    },
    async loadECEWE() {
      checkSession();
      try {
        const response = await ApiService.apiAxios.get('/api/application/ecewe/' + this.applicationId);
        const payload = response?.data;
        this.setOptinECEWEChangeRequestReadonly(payload?.optInECEWE === 1);
        this.setBelongsToUnionChangeRequestReadonly(payload?.belongsToUnion === 1);
        this.setEceweModel(payload);
        this.setLoadedModel(payload);
        this.setLoadedFacilities(payload.facilities);
        this.setFacilities(payload.facilities);
        return response;
      } catch (error) {
        console.info(`Failed to get ECEWE Application - ${error}`);
        this.setIsStarted(false);
        throw error;
      }
    },

    async loadECEWEModelFromChangeRequest(loadedChangeRequest) {
      if (!isNullOrBlank(loadedChangeRequest?.optInECEWE)) {
        let eceweModel = {
          applicationId: this.eceweModel?.applicationId,
          optInECEWE: loadedChangeRequest.optInECEWE,
          belongsToUnion: loadedChangeRequest.belongsToUnion,
          applicableSector: loadedChangeRequest.applicableSector,
          fundingModel: loadedChangeRequest.fundingModel,
          confirmation: loadedChangeRequest.confirmation,
          publicSector: loadedChangeRequest.publicSector,
          facilities: this.eceweModel?.facilities,
          describeOrgCSSEA: loadedChangeRequest.describeOrgCSSEA,
          isUnionAgreementReached: loadedChangeRequest.isUnionAgreementReached,
        };
        this.setEceweModel(eceweModel);
        this.setLoadedModel(eceweModel);
      }
    },
    async saveECEWE({ isFormComplete, isChangeRequest, changeRequestId }) {
      try {
        if (isEqual(this.eceweModel, this.loadedModel) && this.isStarted) {
          return;
        }
        checkSession();
        const payload = { ...this.eceweModel };
        delete payload.facilities;
        payload.isEceweComplete = isFormComplete;
        this.setLoadedModel({ ...this.eceweModel });
        let response;
        if (isChangeRequest) {
          delete payload.applicationId;
          //update the ChangeRequest Map with new ECEWE values
          const existingChangeRequest = await useReportChangesStore().getChangeRequest(changeRequestId);
          existingChangeRequest.optInECEWE = payload.optInECEWE;
          existingChangeRequest.belongsToUnion = payload.belongsToUnion;
          existingChangeRequest.applicableSector = payload.applicableSector;
          existingChangeRequest.fundingModel = payload.fundingModel;
          existingChangeRequest.confirmation = payload.confirmation;
          existingChangeRequest.publicSector = payload.publicSector;
          response = await ApiService.apiAxios.patch(ApiRoutes.CHANGE_REQUEST + '/' + changeRequestId, payload);
        } else {
          response = await ApiService.apiAxios.patch(ApiRoutes.APPLICATION_ECEWE + '/' + this.applicationId, payload);
        }
        return response;
      } catch (error) {
        console.info(`Failed to update existing ECEWE application - ${error}`);
        this.setIsStarted(false);
        throw error;
      }
    },
    async saveECEWEFacilities() {
      const sortedLoadedFacilities = sortByFacilityId(this.loadedFacilities);
      const sortedFacilities = sortByFacilityId(this.facilities);
      const payload = [];
      // check if there is any new/updated facility
      sortedFacilities?.forEach((facility, index) => {
        if (!isEqual(facility, sortedLoadedFacilities[index]) || !facility.eceweApplicationId) {
          payload.push(facility);
        }
      });
      if (payload?.length > 0) {
        checkSession();
        try {
          const navBarStore = useNavBarStore();
          const response = await ApiService.apiAxios.post(
            ApiRoutes.APPLICATION_ECEWE_FACILITY + '/' + this.applicationId,
            payload,
          );
          const updatedFacilities = this.facilities;
          response?.data?.facilities?.forEach((facility) => {
            updatedFacilities[updatedFacilities.findIndex((el) => el.facilityId === facility.facilityId)] = facility;
            navBarStore.setNavBarValue({
              facilityId: facility.facilityId,
              property: 'eceweApplicationId',
              value: facility.eceweApplicationId,
            });
          });
          this.setFacilities(updatedFacilities);
          this.setLoadedFacilities(updatedFacilities);
          return response;
        } catch (error) {
          console.info(`Failed to update existing ECEWE facility application - ${error}`);
          this.setIsStarted(false);
          throw error;
        }
      }
    },
    /* Initalizes\creates the facilities payload depending on if ecewe facilities exist or not. */
    async initECEWEFacilities(navBarList) {
      const reportChangesStore = useReportChangesStore();
      const navBarStore = useNavBarStore();
      let facilityPayload;

      if (this.facilities?.length === 0) {
        if (navBarStore.isChangeRequest) {
          const newFac = reportChangesStore?.changeRequestMap?.get(navBarStore?.changeRequestId).changeActions[0]
            ?.newFacilities;

          facilityPayload = newFac?.map((facility) => ({
            eceweApplicationId: null,
            facilityId: facility.facilityId,
            optInOrOut: this.getOptInOrOut(facility?.facilityId),
            changeRequestId: navBarStore.changeRequestId ? navBarStore.changeRequestId : null,
            changeRequestNewFacilityId: facility.changeRequestNewFacilityId
              ? facility.changeRequestNewFacilityId
              : null,
          }));
        } else {
          // No facilities payload, create from the narBarList.
          facilityPayload = navBarList.map((facility) => ({
            facilityUnionStatus: facility?.facilityUnionStatus ?? null,
            eceweApplicationId: null,
            facilityId: facility.facilityId,
            optInOrOut: this.getOptInOrOut(facility?.facilityId),
          }));
        }
      }
      // A payload already exists, recreate to include any new facilities which could have been added to navBarList
      // since last creation.
      else if (useNavBarStore().isChangeRequest) {
        const newFac = reportChangesStore?.changeRequestMap
          ?.get(navBarStore?.changeRequestId)
          .changeActions?.find((el) => el.changeType == CHANGE_REQUEST_TYPES.NEW_FACILITY)?.newFacilities;
        facilityPayload = newFac?.map((facility) => ({
          eceweApplicationId: this.getEceweApplicationId(facility.facilityId),
          facilityId: facility.facilityId,
          optInOrOut: this.getOptInOrOut(facility.facilityId),
          changeRequestId: navBarStore.changeRequestId ?? null,
          changeRequestNewFacilityId: facility.changeRequestNewFacilityId ? facility.changeRequestNewFacilityId : null,
        }));
      } else {
        facilityPayload = navBarList.map((facility) => ({
          facilityId: facility.facilityId,
          facilityUnionStatus: this.getFacilityUnionizedStatus(facility.facilityId),
          eceweApplicationId: this.getEceweApplicationId(facility.facilityId),
          optInOrOut: this.getOptInOrOut(facility.facilityId),
        }));
      }

      this.setFacilities(facilityPayload);
    },
    getEceweApplicationId(facilityId) {
      const index = this.facilities?.map((facilty) => facilty.facilityId).indexOf(facilityId);
      return index >= 0 ? this.facilities[index].eceweApplicationId : null;
    },
    getOptInOrOut(facilityId) {
      const appStore = useAppStore();
      console.log(appStore.getLanguageYearLabel);
      if (
        appStore.getLanguageYearLabel !== PROGRAM_YEAR_LANGUAGE_TYPES.FY2025_26 &&
        this.eceweModel.fundingModel == this.fundingModelTypes[0].id
      ) {
        return 0;
      } else {
        const facility = this.facilities?.find((fac) => fac.facilityId === facilityId);
        return facility ? facility.optInOrOut : null;
      }
    },
    getFacilityUnionizedStatus(facilityId) {
      const facility = this.facilities?.find((fac) => fac.facilityId === facilityId);
      return facility ? facility.facilityUnionStatus : null;
    },
  },
});
