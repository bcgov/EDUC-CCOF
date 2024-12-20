import { isEmpty, isEqual } from 'lodash';
import { defineStore } from 'pinia';

import ApiService from '@/common/apiService.js';
import { useApplicationStore } from '@/store/application.js';
import { useFundingStore } from '@/store/ccof/funding.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useReportChangesStore } from '@/store/reportChanges.js';
import { CHANGE_REQUEST_TYPES } from '@/utils/constants';
import { ApiRoutes, ORGANIZATION_PROVIDER_TYPES } from '@/utils/constants.js';
import { checkSession } from '@/utils/session.js';

// FIXME: getModel getter was removed and will break all over. All it did was return state.model
export const useFacilityStore = defineStore('facility', {
  state: () => ({
    model: [],
    foo: 'bar',
    facilityStore: {},
    facilityModel: {},
    facilityId: null,
    isValidForm: false,
    loadedModel: {},
  }),
  getters: {
    isCurrentFacilityComplete: (state) => state.isValidForm,
    getFacilityById: (state) => (facilityId) => {
      return state.facilityStore[facilityId];
    },
    isNewFacilityStarted: (state) => !isEmpty(state.facilityModel),
  },
  actions: {
    model(value) {
      this.model = value;
    },
    isValidForm(value) {
      this.isValidForm = value;
    },
    setFacilityModel(facilityModel) {
      this.facilityModel = facilityModel;
    },
    setLoadedModel(model) {
      this.loadedModel = model;
    },
    setFacilityId(facilityId) {
      this.facilityId = facilityId;
    },
    addFacilityToStore({ facilityId, facilityModel }) {
      if (facilityId) {
        this.facilityStore[facilityId] = facilityModel;
      }
    },
    deleteFromStore(facilityId) {
      delete this.facilityStore[facilityId];
    },
    async saveFacility({ isChangeRequest, changeRequestId }) {
      checkSession();
      const applicationStore = useApplicationStore();
      const navBarStore = useNavBarStore();
      const reportChangesStore = useReportChangesStore();
      const organizationStore = useOrganizationStore();

      if (isEqual(this.facilityModel, this.loadedModel)) {
        return;
      }

      let organizationId = organizationStore.organizationId;
      if (!organizationId) {
        throw 'unable to save facility because you are not associated to an organization';
      }

      let payload = { ...this.facilityModel, organizationId, applicationId: applicationStore.applicationId };

      //CMS was having a workflow issue related to saving the same post code repeatadly. Don't save postcode unless it has changed
      try {
        if (
          this?.facilityModel?.postalCode?.replace(/\s/g, '').toUpperCase() ==
          this?.loadedModel?.postalCode?.replace(/\s/g, '').toUpperCase()
        ) {
          delete payload.postalCode;
        } else {
          //format the post code nice for Dynamics
          payload.postalCode = this.facilityModel.postalCode.replace(/\s/g, '').toUpperCase();
        }
      } catch (e) {
        console.log(e);
      }
      this.setLoadedModel(this.facilityModel);

      if (this.facilityId) {
        // has an orgaization ID, so update the data
        try {
          let response = await ApiService.apiAxios.put(ApiRoutes.FACILITY + '/' + this.facilityId, payload);
          this.addFacilityToStore({ facilityId: this.facilityId, facilityModel: this.facilityModel });
          // TODO: also find the existing value in the nav bar and update the facility Name and license number
          navBarStore.updateNavBar({
            facilityId: this.facilityId,
            facilityName: this.facilityModel.facilityName,
            licenseNumber: this.facilityModel.licenseNumber,
          });
          return response;
        } catch (error) {
          console.log(`Failed to update existing Facility - ${error}`);
          throw error;
        }
      } else if (isChangeRequest) {
        try {
          let changeActionId;
          if (changeRequestId) {
            //If there is a changeRequestId, get the change action from the store.
            changeActionId = reportChangesStore.changeActionId;
            if (!changeActionId) {
              //If there is no changeActionID, then maybe the user refreshed.  Get it from the navBar
              changeActionId = navBarStore.navBarList.find(
                (el) => el.changeRequestId == changeRequestId,
              )?.changeActionId;
            }
          }
          if (!changeActionId) {
            const changeRequestPayload = {
              applicationId: applicationStore.applicationId,
              programYearId: applicationStore.programYearId,
              changeType: 'NEW_FACILITY',
            };
            const changeRequestResponse = await ApiService.apiAxios.post(
              ApiRoutes.CHANGE_REQUEST_NEW_FAC,
              changeRequestPayload,
            );
            reportChangesStore.setChangeRequestId(changeRequestResponse.data?.changeRequestId);
            reportChangesStore.setChangeActionId(changeRequestResponse.data?.changeActionId);
            navBarStore.setChangeRequestId(changeRequestResponse.data?.changeRequestId);
            const changeRequestNewFacilityModel = {
              changeRequestId: changeRequestResponse.data?.changeRequestId,
              agreeConsentCertify: null,
              applicableSector: null,
              applicationId: applicationStore.applicationId,
              belongsToUnion: null,
              changeActions: [
                {
                  applicationStatus: 1,
                  changeActionId: changeRequestResponse.data?.changeActionId,
                  changeType: CHANGE_REQUEST_TYPES.NEW_FACILITY,
                  isCCOFUnlocked: false,
                  isChangeRequestUnlocked: false,
                  isEceweUnlocked: false,
                  isLicenseUploadUnlocked: false,
                  isOtherDocumentsUnlocked: false,
                  isSupportingDocumentsUnlocked: false,
                  newFacilities: [],
                },
              ],
              confirmation: null,
              enabledDeclarationB: false,
              externalStatus: 'INCOMPLETE',
              firstSubmissionDate: null,
              fundingModel: null,
              isChangeRequestUnlocked: false,
              isEceweComplete: false,
              isLicenseUploadComplete: false,
              latestSubmissionDate: null,
              optInECEWE: null,
              orgContactName: null,
              programYearId: applicationStore.programYearId,
              providerType: ORGANIZATION_PROVIDER_TYPES.GROUP,
              status: 1,
              unlockDeclaration: false,
            };
            reportChangesStore.addNewChangeRequestToMap(changeRequestNewFacilityModel);
            changeActionId = changeRequestResponse.data?.changeActionId;
          }
          let response = await ApiService.apiAxios.post(
            `${ApiRoutes.CHANGE_REQUEST_NEW_FAC}/${changeActionId}`,
            payload,
          );
          this.setFacilityId(response.data?.facilityId);
          const navBarPayload = {
            facilityName: this.facilityModel.facilityName,
            facilityId: this.facilityId,
            ccofBaseFundingId: response.data?.ccofBaseFundingId,
            ccofBaseFundingStatus: response.data?.ccofBaseFundingStatus,
            licenseNumber: this.facilityModel.licenseNumber,
            changeRequestId: reportChangesStore.changeRequestId,
            changeActionId: reportChangesStore.changeActionId,
            changeRequestNewFacilityId: response.data?.changeRequestNewFacilityId,
            facilityStatus: 'New',
            isCCOFComplete: false, //funding page must be complete to be true
          };
          reportChangesStore.addNewFacilityDataToCRMap(navBarPayload);
          navBarStore.addToNavBar(navBarPayload);
          this.addFacilityToStore({ facilityId: response.data?.facilityId, facilityModel: this.facilityModel });

          return response;
        } catch (error) {
          console.log(`Failed to save new Facility - ${error}`);
          throw error;
        }
      } else {
        try {
          let response = await ApiService.apiAxios.post(ApiRoutes.FACILITY, payload);
          this.setFacilityId(response.data?.facilityId);
          const navBarPayload = {
            facilityName: this.facilityModel.facilityName,
            facilityId: this.facilityId,
            ccofBaseFundingId: response.data?.ccofBaseFundingId,
            ccofBaseFundingStatus: response.data?.ccofBaseFundingStatus,
            licenseNumber: this.facilityModel.licenseNumber,
            facilityStatus: 'New',
            isCCOFComplete: false, //funding page must be complete to be true
          };
          navBarStore.addToNavBar(navBarPayload);
          this.addFacilityToStore({ facilityId: response.data?.facilityId, facilityModel: this.facilityModel });

          return response;
        } catch (error) {
          console.log(`Failed to save new Facility - ${error}`);
          throw error;
        }
      }
    },
    async loadFacility(facilityId) {
      this.setFacilityId(facilityId);
      let facilityModel = this.getFacilityById(facilityId);
      if (facilityModel) {
        this.setFacilityModel(facilityModel);
        this.setLoadedModel(facilityModel);
      } else {
        checkSession();
        try {
          let response = await ApiService.apiAxios.get(ApiRoutes.FACILITY + '/' + facilityId);
          this.addFacilityToStore({ facilityId: facilityId, facilityModel: response.data });
          this.setFacilityModel(response.data);
          this.setLoadedModel(response.data);
          return response;
        } catch (e) {
          console.log(`Failed to get existing Facility with error - ${e}`);
          throw e;
        }
      }
    },
    async deleteFacility(facilityObj) {
      checkSession();
      const applicationStore = useApplicationStore();
      const fundingStore = useFundingStore();
      const navBarStore = useNavBarStore();

      await ApiService.apiAxios.delete(ApiRoutes.FACILITY + '/' + facilityObj.facilityId, { data: facilityObj });

      this.deleteFromStore(facilityObj.facilityId);
      applicationStore.removeFacilityFromMap(facilityObj.facilityId);
      fundingStore.deleteFromStore(facilityObj.facilityId);
      navBarStore.deleteFromNavBar(facilityObj.facilityId);
    },
    newFacility() {
      this.setFacilityId(null);
      this.setFacilityModel({});
      this.setLoadedModel({});
    },
  },
});
