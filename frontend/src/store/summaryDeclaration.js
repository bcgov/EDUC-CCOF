import { defineStore } from 'pinia';

import ApiService from '@/common/apiService.js';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useAuthStore } from '@/store/auth.js';
import { useCcfriAppStore } from '@/store/ccfriApp.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useReportChangesStore } from '@/store/reportChanges.js';
import { ApiRoutes, CHANGE_REQUEST_TYPES } from '@/utils/constants.js';
import { checkSession } from '@/utils/session.js';

function parseLicenseCategories(licenseCategories) {
  const appStore = useAppStore();
  const uniqueLicenseCategories = [...new Set(licenseCategories.map((item) => item.licenseCategoryId))];
  const lookupCategories = [...appStore.lookupInfo.familyLicenseCategory, ...appStore.lookupInfo.groupLicenseCategory];
  let categories = lookupCategories
    .filter((item) => uniqueLicenseCategories.includes(item.ccof_license_categoryid))
    .map((a) => a.ccof_name);
  return categories ? categories.toString() : '';
}

function getProgramYear(selectedGuid, programYearList) {
  const programYear = programYearList.find(({ programYearId }) => programYearId == selectedGuid);

  if (!programYear) {
    throw 'SELECTED PROGRAM YEAR GUID NOT FOUND ';
  }

  return programYear;
}

/**
 * Add a few missing datapoints to a facility
 *
 * @param {Object} facility - The facility to add details to
 */
function mapFacility(facility) {
  const applicationStore = useApplicationStore();
  const appStore = useAppStore();
  facility.licenseCategories = parseLicenseCategories(facility.childCareLicenses);

  // check for opt out - no need for more calls if opt-out
  if (facility.ccfri?.ccfriId && facility.ccfri?.ccfriOptInStatus == 1) {
    const ccofProgramYearId = applicationStore.programYearId;
    const programYearList = appStore.programYearList.list;
    facility.ccfri.currentYear = getProgramYear(ccofProgramYearId, programYearList);
    facility.ccfri.prevYear = getProgramYear(facility.ccfri.currentYear.previousYearId, programYearList);
  }

  return facility;
}

export const useSummaryDeclarationStore = defineStore('summaryDeclaration', {
  state: () => ({
    isValidForm: undefined,
    declarationModel: {},
    summaryModel: {},
    facilities: [],
    isSummaryLoading: [],
    isMainLoading: true,
    isLoadingComplete: false,
  }),
  getters: {
    isCCFRIComplete: (state) => {
      return state.summaryModel?.facilities?.length > 0
        ? state.summaryModel?.facilities.every(
            (facility) =>
              facility.ccfri?.ccof_formcomplete &&
              (facility.ccfri?.ccfriOptInStatus === 1 || facility.ccfri?.ccfriOptInStatus === 0) &&
              (facility.ccfri?.unlockRfi === 1 || facility.ccfri?.hasRfi ? facility.ccfri?.isRfiComplete : true) &&
              (facility.ccfri?.unlockNmf === 1 || facility.ccfri?.hasNmf ? facility.ccfri?.isNmfComplete : true),
          )
        : false;
    },

    isFacilityComplete: (state) => {
      return state.summaryModel?.facilities?.length > 0
        ? state.summaryModel?.facilities.every((facility) => facility.facilityInfo?.isFacilityComplete == true)
        : false;
    },
    areCheckBoxesComplete: (state, getters) => {
      let isComplete =
        state.summaryModel?.application?.isEceweComplete &&
        state.summaryModel?.application?.isLicenseUploadComplete &&
        getters.isCCFRIComplete;
      return isComplete;
    },
  },
  actions: {
    setDeclarationModel(value) {
      this.declarationModel = value;
    },
    setSummaryModel(value) {
      this.summaryModel = value;
    },
    setIsSummaryLoading(value) {
      this.isSummaryLoading = value;
    },
    setIsMainLoading(value) {
      this.isMainLoading = value;
    },
    isValidForm(value) {
      this.isValidForm = value;
    },
    setIsLoadingComplete(value) {
      this.isLoadingComplete = value;
    },
    async loadDeclaration() {
      checkSession();
      const applicationStore = useApplicationStore();
      try {
        let payload = (
          await ApiService.apiAxios.get(`${ApiRoutes.APPLICATION_DECLARATION}/${applicationStore.applicationId}`)
        ).data;
        if (payload && applicationStore.unlockDeclaration) {
          payload.agreeConsentCertify = null;
          payload.orgContactName = null;
        }
        this.setDeclarationModel(payload);
      } catch (error) {
        console.log(`Failed to get Declaration - ${error}`);
        throw error;
      }
    },
    async loadChangeRequestDeclaration(changeRequestId) {
      checkSession();
      try {
        let payload = (await ApiService.apiAxios.get(`${ApiRoutes.CHANGE_REQUEST}/${changeRequestId}`)).data;
        //clear the old decleration data out so provider can sign again for Dec B
        if (payload.unlockDeclaration) {
          payload.agreeConsentCertify = null;
          payload.orgContactName = null;
        }
        this.setDeclarationModel(payload);
      } catch (error) {
        console.log(`Failed to get Declaration - ${error}`);
        throw error;
      }
    },
    async updateDeclaration({ changeRequestId, reLockPayload }) {
      checkSession();
      const authStore = useAuthStore();
      const applicationStore = useApplicationStore();
      const reportChangesStore = useReportChangesStore();

      let payload = {
        agreeConsentCertify: this.declarationModel?.agreeConsentCertify,
        orgContactName: this.declarationModel?.orgContactName,
        declarationAStatus: this.declarationModel?.declarationAStatus,
        declarationBStatus: this.declarationModel?.declarationBStatus,
        summaryDeclarationApplicationName: this.summaryModel?.application?.name,
      };
      try {
        if (Object.keys(reLockPayload).length > 0) {
          payload = { ...payload, ...reLockPayload };
        }

        if (changeRequestId) {
          //technically submit should be disabled until both these are filled in, so maybe don't need this?
          if (this.declarationModel?.agreeConsentCertify && this.declarationModel?.orgContactName) {
            payload.externalStatus = 2;
          }

          let response = await ApiService.apiAxios.patch(`${ApiRoutes.CHANGE_REQUEST}/${changeRequestId}`, payload);
          this.declarationModel.externalStatus = 'SUBMITTED';
          this.setDeclarationModel(this.declarationModel);
          reportChangesStore.updateExternalStatusInChangeRequestStore({
            changeRequestId: changeRequestId,
            newStatus: 2,
          });
          reportChangesStore.updateExternalStatusInChangeRequestMap({
            changeRequestId: changeRequestId,
            newStatus: 'SUBMITTED',
          });

          return response;
        } else {
          //PCF application submit
          let response = await ApiService.apiAxios.patch(
            `${ApiRoutes.APPLICATION_DECLARATION_SUBMIT}/${applicationStore.applicationId}`,
            payload,
          );

          applicationStore.setApplicationStatus('SUBMITTED');
          authStore.setIsUserInfoLoaded(false);
          return response;
        }
      } catch (error) {
        console.log(`Failed to SUBMIT application - ${error}`);
        throw error;
      }
    },
    async loadSummary(changeRecGuid = undefined) {
      checkSession();
      const applicationStore = useApplicationStore();
      const ccfriAppStore = useCcfriAppStore();
      const navBarStore = useNavBarStore();

      let appID = applicationStore?.applicationMap?.get(applicationStore?.programYearId)?.applicationId;

      if (!appID) {
        appID = applicationStore.applicationId;
      }
      try {
        this.setIsMainLoading(true);

        const filterNavBarIds = navBarStore.navBarList.map((item) => item.facilityId);

        this.setIsSummaryLoading(['loadSummary is loading facilities all at once']);

        let applicationSummaryResponse = await ApiService.apiAxios.post(`${ApiRoutes.APPLICATION_SUMMARY}/${appID}`, {
          facilities: filterNavBarIds,
        });

        const payload = applicationSummaryResponse.data;

        let summaryModel = {
          organization: undefined,
          application: payload.application,
          ecewe: undefined,
        };

        const facilities = payload.facilities.map(mapFacility);

        this.facilities = facilities;

        this.setSummaryModel(summaryModel);
        this.setIsMainLoading(false);

        await Promise.all([
          ccfriAppStore.getApprovableFeeSchedulesForFacilities(navBarStore.userProfileList),
          applicationStore.getApplicationUploadedDocuments(),
        ]);

        //ccfri 3912 show ECEWE org questions for all applications
        if (payload.application?.organizationId) {
          summaryModel.organization = (
            await ApiService.apiAxios.get(`${ApiRoutes.ORGANIZATION}/${payload.application.organizationId}`)
          ).data;
          this.setSummaryModel(summaryModel);
          summaryModel.ecewe = (
            await ApiService.apiAxios.get(`${ApiRoutes.APPLICATION_ECEWE}/${payload.application.applicationId}`)
          ).data;

          this.setSummaryModel(summaryModel);
        }

        this.setSummaryModel(summaryModel);
        this.setIsSummaryLoading([]);

        if (!changeRecGuid) this.setIsLoadingComplete(true);
      } catch (error) {
        console.log(`Failed to load Summary - ${error}`);
        throw error;
      }
    },
    async updateApplicationStatus(applicationObj) {
      checkSession();
      try {
        await ApiService.apiAxios.put(
          `${ApiRoutes.APPLICATION_STATUS}/${applicationObj.applicationId}`,
          applicationObj,
        );
      } catch (error) {
        console.log(`Failed to update application status - ${error}`);
        throw error;
      }
    },
    async loadChangeRequestSummaryDeclaration(changeRequestId) {
      checkSession();
      try {
        this.setIsLoadingComplete(false);
        if (!this.summaryModel) this.setIsMainLoading(true);
        const payload = (await ApiService.apiAxios.get(`${ApiRoutes.CHANGE_REQUEST}/${changeRequestId}`))?.data;
        const changeRequestTypes = [];
        payload?.changeActions?.forEach((item) => {
          if (!changeRequestTypes.includes(item.changeType)) {
            changeRequestTypes.push(item.changeType);
          }
        });

        // Load Declaration model
        const declarationModel = {
          unlockDeclaration: payload?.unlockDeclaration,
          agreeConsentCertify: payload?.unlockDeclaration ? null : payload?.agreeConsentCertify,
          orgContactName: payload?.unlockDeclaration ? null : payload?.orgContactName,
          externalStatus: payload?.externalStatus,
          enabledDeclarationB: payload?.enabledDeclarationB,
          declarationAStatus: payload?.declarationAStatus,
          declarationBStatus: payload?.declarationBStatus,
        };
        this.setDeclarationModel(declarationModel);

        // Load Summary model
        const summaryModel = {
          ...this.summaryModel,
          changeActions: payload?.changeActions,
          changeRequestTypes: changeRequestTypes,
        };
        this.setSummaryModel(summaryModel);
        await Promise.all(
          changeRequestTypes.map(async (changeType) => {
            switch (changeType) {
              case CHANGE_REQUEST_TYPES.NEW_FACILITY:
                await this.loadChangeRequestSummaryForAddNewFacility(payload);
                break;
              case CHANGE_REQUEST_TYPES.PARENT_FEE_CHANGE:
                await this.loadChangeRequestSummaryForMtfi(payload);
                break;
              case CHANGE_REQUEST_TYPES.PDF_CHANGE:
                await this.loadChangeRequestSummaryForChangeNotiForm(payload);
                break;
              default:
                throw `Not found change request type - ${changeType}`;
            }
          }),
        );
        this.setIsLoadingComplete(true);
      } catch (error) {
        console.log(`Failed to load Summary and Declaration for Change Request - ${error}`);
        throw error;
      }
    },

    async loadChangeRequestSummaryForAddNewFacility(payload) {
      try {
        const summaryModel = this.summaryModel;
        const changeRequestECEWE = {
          optInECEWE: payload?.optInECEWE,
          belongsToUnion: payload?.belongsToUnion,
          publicSector: payload?.publicSector,
          applicableSector: payload?.applicableSector,
          fundingModel: payload?.fundingModel,
          confirmation: payload?.confirmation,
          describeOrgCSSEA: payload?.describeOrgCSSEA,
          isUnionAgreementReached: payload?.isUnionAgreementReached,
        };
        summaryModel.ecewe = changeRequestECEWE;
        this.setSummaryModel(summaryModel);
      } catch (error) {
        console.log(`Failed to load Summary for change request Add New Facility - ${error}`);
        throw error;
      }
    },
    // Assumption: a change request can only have 1 MTFI change action
    async loadChangeRequestSummaryForMtfi(payload) {
      const navBarStore = useNavBarStore();
      const applicationStore = useApplicationStore();

      try {
        let summaryModel = this.summaryModel;
        let mtfiChangeAction = payload.changeActions?.find(
          (item) => item.changeType === CHANGE_REQUEST_TYPES.PARENT_FEE_CHANGE,
        );
        summaryModel.mtfiFacilities = mtfiChangeAction?.mtfi;

        let isSummaryLoading = new Array(summaryModel.mtfiFacilities.length).fill(true);
        this.setIsSummaryLoading(isSummaryLoading);

        await Promise.all(
          summaryModel.mtfiFacilities.map(async (mtfiFacility, index) => {
            let userProfileListFacility = navBarStore.userProfileList.find(
              (item) => item.facilityId === mtfiFacility.facilityId,
            );
            if (userProfileListFacility) {
              mtfiFacility.facilityName = userProfileListFacility.facilityName;
              mtfiFacility.facilityAccountNumber = userProfileListFacility.facilityAccountNumber;
              mtfiFacility.licenseNumber = userProfileListFacility.licenseNumber;

              mtfiFacility.oldCcfriApplicationId = applicationStore?.applicationMap
                ?.get(applicationStore?.programYearId)
                ?.facilityList?.find((el) => el.facilityId == mtfiFacility.facilityId).ccfriApplicationId;
              mtfiFacility.oldCcfri = (
                await ApiService.apiAxios.get(`${ApiRoutes.CCFRIFACILITY}/${mtfiFacility.oldCcfriApplicationId}`)
              ).data;
              mtfiFacility.oldCcfri.childCareTypes = mtfiFacility.oldCcfri?.childCareTypes?.filter(
                (item) => item.programYearId === applicationStore.programYearId,
              );
              mtfiFacility.oldCcfri?.childCareTypes?.sort((a, b) => a.orderNumber - b.orderNumber);

              mtfiFacility.newCcfri = (
                await ApiService.apiAxios.get(`${ApiRoutes.CCFRIFACILITY}/${mtfiFacility.ccfriApplicationId}`)
              ).data;
              mtfiFacility.newCcfri.childCareTypes = mtfiFacility.newCcfri?.childCareTypes?.filter(
                (item) => item.programYearId === applicationStore.programYearId,
              );
              mtfiFacility.newCcfri?.childCareTypes?.sort((a, b) => a.orderNumber - b.orderNumber);

              if (mtfiFacility.hasRfi || mtfiFacility.unlockRfi)
                mtfiFacility.rfiApp = (
                  await ApiService.apiAxios.get(`${ApiRoutes.APPLICATION_RFI}/${mtfiFacility.ccfriApplicationId}/rfi`)
                ).data;
              isSummaryLoading.splice(index, 1, false);
              this.setIsSummaryLoading(isSummaryLoading);
              if (this.isMainLoading) this.setIsMainLoading(false);
            }
            this.setSummaryModel(summaryModel);
          }),
        );
      } catch (error) {
        console.log(`Failed to load Summary for change request MTFI - ${error}`);
        throw error;
      }
    },
    // Assumption: a change request can only have 1 Change Notification Form change action
    async loadChangeRequestSummaryForChangeNotiForm(payload) {
      const reportChangesStore = useReportChangesStore();
      try {
        let summaryModel = this.summaryModel;
        let changeNotiChangeAction = payload.changeActions?.find(
          (item) => item.changeType === CHANGE_REQUEST_TYPES.PDF_CHANGE,
        );
        summaryModel.changeNotificationFormDocuments = await reportChangesStore.loadChangeRequestDocs(
          changeNotiChangeAction?.changeActionId,
        );
        this.setSummaryModel(summaryModel);
        this.setIsMainLoading(false);
      } catch (error) {
        console.log(`Failed to load Summary for change request Change Notification Form - ${error}`);
        throw error;
      }
    },
  },
});
