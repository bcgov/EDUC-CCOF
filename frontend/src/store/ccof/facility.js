import { defineStore } from 'pinia';
import { isEmpty, isEqual } from 'lodash';

import { useApplicationStore } from '../application.js';
import { useFundingStore } from './funding.js';
import { useNavBarStore } from '../navBar.js';
import { useReportChangesStore } from '../reportChanges.js';
import { useOrganizationStore } from './organization.js';

import ApiService from '../../common/apiService.js';
import { ApiRoutes } from '../../utils/constants.js';
import { checkSession } from '../../utils/session.js';

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
    // setFacilityList: (facilityList) => { this.facilityList = facilityList; },
    // addToFacilityList: (payload) => { this.facilityList.push (payload); },
    setFacilityModel(facilityModel) {
      this.facilityModel = facilityModel;
    },
    setLoadedModel(model) {
      this.loadedModel = model;
    },
    // setCCFRIFacilityModel: (CCFRIFacilityModel) => { this.CCFRIFacilityModel = CCFRIFacilityModel; }, //jb
    setFacilityId(facilityId) {
      this.facilityId = facilityId;
    },
    // setCcfriId: (ccfriId) => { this.ccfriId = ccfriId; },
    addFacilityToStore({ facilityId, facilityModel }) {
      if (facilityId) {
        this.facilityStore[facilityId] = facilityModel;
      }
    },
    deleteFromStore(facilityId) {
      delete this.facilityStore[facilityId];
    },
    // addCCFRIToStore: ({ccfriId, CCFRIFacilityModel} ) => {
    //   if (ccfriId) {
    //     this.ccfriStore[ccfriId] = CCFRIFacilityModel;
    //   }
    // }
    async saveFacility({ isChangeRequest, changeRequestId }) {
      checkSession();
      const applicationStore = useApplicationStore();
      const navBarStore = useNavBarStore();
      const reportChangesStore = useReportChangesStore();
      const organizationStore = useOrganizationStore();

      // console.log('saveFacility- state model: ', this.facilityModel);
      // console.log('saveFacility- loaded model: ', this.loadedModel);
      if (isEqual(this.facilityModel, this.loadedModel)) {
        console.info('no model changes');
        return;
      }

      let organizationId = organizationStore.organizationId;
      if (!organizationId) {
        console.log('unable to save facility because you are not associated to an organization');
        throw 'unable to save facility because you are not associated to an organization';
      }

      let payload = { ...this.facilityModel, organizationId, applicationId: applicationStore.applicationId };

      //CMS was having a workflow issue related to saving the same post code repeatadly. Don't save postcode unless it has changed
      try {
        if (
          this?.facilityModel?.postalCode?.replace(/\s/g, '').toUpperCase() ==
          this?.loadedModel?.postalCode?.replace(/\s/g, '').toUpperCase()
        ) {
          console.info('no post code changes, do not save post code');
          delete payload.postalCode;
        } else {
          //format the post code nice for Dynamics
          payload.postalCode = this.facilityModel.postalCode.replace(/\s/g, '').toUpperCase();
        }
      } catch (e) {
        console.log(e);
      }
      console.log(payload);
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
      } else {
        console.log('creating change request?', isChangeRequest);
        // else create a new facility.  If is a change request, hit the change request endpoint
        if (isChangeRequest) {
          // console.log('changeRequestId: ', changeRequestId);
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
              console.log('Change ActionId is ', changeActionId);
            }
            if (!changeActionId) {
              const changeRequestPayload = {
                applicationId: applicationStore.applicationId,
                programYearId: applicationStore.programYearId,
                changeType: 'NEW_FACILITY',
              };
              console.log('calling create change rec new fac');
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
                    changeType: 100000005,
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
                providerType: 'GROUP',
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
          console.log('trying new facility');
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
      }
    },
    async loadFacility(facilityId) {
      this.setFacilityId(facilityId);
      let facilityModel = this.getFacilityById(facilityId);
      if (facilityModel) {
        console.log('found facility for guid: ', facilityId);
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
