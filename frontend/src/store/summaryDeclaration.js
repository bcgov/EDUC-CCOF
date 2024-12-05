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

export const useSummaryDeclarationStore = defineStore('summaryDeclaration', {
  state: () => ({
    isValidForm: undefined,
    declarationModel: {},
    summaryModel: {},
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
          await ApiService.apiAxios.get(ApiRoutes.APPLICATION_DECLARATION + '/' + applicationStore.applicationId)
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
        let payload = (await ApiService.apiAxios.get(ApiRoutes.CHANGE_REQUEST + '/' + changeRequestId)).data;
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

          let response = await ApiService.apiAxios.patch(ApiRoutes.CHANGE_REQUEST + '/' + changeRequestId, payload);
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
            ApiRoutes.APPLICATION_DECLARATION_SUBMIT + '/' + applicationStore.applicationId,
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
      const appStore = useAppStore();
      const applicationStore = useApplicationStore();
      const ccfriAppStore = useCcfriAppStore();
      const navBarStore = useNavBarStore();

      let appID = applicationStore?.applicationMap?.get(applicationStore?.programYearId)?.applicationId;

      if (!appID) {
        appID = applicationStore.applicationId;
      }
      try {
        this.setIsMainLoading(true);
        //get application ID from the appMap so the page doesn't break when viewing historical CR records.
        let payload = (await ApiService.apiAxios.get(ApiRoutes.APPLICATION_SUMMARY + '/' + appID)).data;
        let summaryModel = {
          organization: undefined,
          application: payload.application,
          facilities: payload.facilities,
          ecewe: undefined,
        };

        summaryModel.facilities = summaryModel.facilities?.filter((fac) => {
          return navBarStore.navBarList?.findIndex((item) => item.facilityId === fac.facilityId) > -1;
        });

        this.setSummaryModel(summaryModel);
        this.setIsMainLoading(false);

        let isSummaryLoading = new Array(summaryModel.facilities.length).fill(true);

        this.setIsSummaryLoading(isSummaryLoading);
        await Promise.all([
          ccfriAppStore.getApprovableFeeSchedulesForFacilities(navBarStore.userProfileList),
          applicationStore.getApplicationUploadedDocuments(),
        ]);

        //new app only?
        if (!applicationStore.isRenewal && payload.application?.organizationId) {
          summaryModel.organization = (
            await ApiService.apiAxios.get(ApiRoutes.ORGANIZATION + '/' + payload.application.organizationId)
          ).data;
          this.setSummaryModel(summaryModel);
          summaryModel.ecewe = (
            await ApiService.apiAxios.get('/api/application/ecewe/' + payload.application.applicationId)
          ).data;

          this.setSummaryModel(summaryModel);
        }

        for (const facility of summaryModel.facilities) {
          const index = summaryModel.facilities.indexOf(facility);
          this.setSummaryModel(summaryModel);
          let facilityLicenseResponse = undefined;
          try {
            facilityLicenseResponse = (
              await ApiService.apiAxios.get(`${ApiRoutes.FACILITY}/${facility.facilityId}/licenseCategories`)
            ).data;
            summaryModel.facilities[index].licenseCategories = parseLicenseCategories(facilityLicenseResponse);
          } catch {
            console.log('error, unable to get childcare category for provider: ', facility.facilityId);
          }

          //check for opt out - no need for more calls if opt-out
          if (facility.ccfri?.ccfriId && facility.ccfri?.ccfriOptInStatus == 1) {
            let ccfriResponse = (await ApiService.apiAxios.get(ApiRoutes.CCFRIFACILITY + '/' + facility.ccfri.ccfriId))
              .data;
            facility.ccfri.childCareLicenses = facilityLicenseResponse; //jb - so I can build the CCFRI section
            facility.ccfri.childCareTypes = ccfriResponse.childCareTypes;
            facility.ccfri.dates = ccfriResponse.dates;
            const ccofProgramYearId = applicationStore.programYearId;
            const programYearList = appStore.programYearList.list;
            facility.ccfri.currentYear = getProgramYear(ccofProgramYearId, programYearList);
            facility.ccfri.prevYear = getProgramYear(
              summaryModel.facilities[index].ccfri.currentYear.previousYearId,
              programYearList,
            );

            //jb
            //load up the previous ccfri app if it exists, so we can check that we are not missing any child care fee categories from the last year.
            if (facility.ccfri.previousCcfriId) {
              facility.ccfri.prevYearCcfriApp = (
                await ApiService.apiAxios.get(ApiRoutes.CCFRIFACILITY + '/' + facility.ccfri.previousCcfriId)
              ).data;
            }
            if (facility.ccfri?.hasRfi || facility.ccfri?.unlockRfi)
              summaryModel.facilities[index].rfiApp = (
                await ApiService.apiAxios.get(ApiRoutes.APPLICATION_RFI + '/' + facility.ccfri.ccfriId + '/rfi')
              ).data;
            this.setSummaryModel(summaryModel);
            if (facility.ccfri?.hasNmf || facility.ccfri?.unlockNmf)
              summaryModel.facilities[index].nmfApp = (
                await ApiService.apiAxios.get(ApiRoutes.APPLICATION_NMF + '/' + facility.ccfri.ccfriId + '/nmf')
              ).data;
            //summaryModel.faciliities[index].isNMFLoading=false
            this.setSummaryModel(summaryModel);
          }

          //jb changed below to work with renewel apps
          summaryModel.facilities[index].facilityInfo = (
            await ApiService.apiAxios.get(ApiRoutes.FACILITY + '/' + facility.facilityId)
          ).data;
          this.setSummaryModel(summaryModel);

          isSummaryLoading.splice(index, 1, false);
          this.setIsSummaryLoading(isSummaryLoading);
        } // end FOR loop. FIXME: make loop brief enough to read in one view

        if (!changeRecGuid) this.setIsLoadingComplete(true);
      } catch (error) {
        console.log(`Failed to load Summary - ${error}`);
        throw error;
      }
    },
    async updateApplicationStatus(applicationObj) {
      checkSession();
      try {
        await ApiService.apiAxios.put('/api/application/status/' + applicationObj.applicationId, applicationObj);
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
        let payload = (await ApiService.apiAxios.get(ApiRoutes.CHANGE_REQUEST + '/' + changeRequestId))?.data;
        let changeRequestTypes = [];
        payload?.changeActions?.forEach((item) => {
          if (!changeRequestTypes.includes(item.changeType)) {
            changeRequestTypes.push(item.changeType);
          }
        });

        // Load Declaration model
        let declarationModel = {
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
        let summaryModel = {
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
        let summaryModel = this.summaryModel;
        let changeRequestECEWE = {
          optInECEWE: payload?.optInECEWE,
          belongsToUnion: payload?.belongsToUnion,
          publicSector: payload?.publicSector,
          applicableSector: payload?.applicableSector,
          fundingModel: payload?.fundingModel,
          confirmation: payload?.confirmation,
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
