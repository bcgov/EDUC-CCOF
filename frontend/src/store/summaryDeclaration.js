import { cloneDeep, isEmpty, sortBy } from 'lodash';
import { defineStore } from 'pinia';

import ApiService from '@/common/apiService.js';
import ApplicationService from '@/services/applicationService';
import OrganizationService from '@/services/organizationService';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useAuthStore } from '@/store/auth.js';
import { useCcfriAppStore } from '@/store/ccfriApp.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useReportChangesStore } from '@/store/reportChanges.js';
import {
  ApiRoutes,
  CCFRI_FEE_CORRECT_TYPES,
  CHANGE_REQUEST_TYPES,
  ORGANIZATION_PROVIDER_TYPES,
  PROGRAM_YEAR_LANGUAGE_TYPES,
} from '@/utils/constants.js';
import { checkSession } from '@/utils/session.js';

function parseLicenseCategories(licenseCategories) {
  if (isEmpty(licenseCategories)) return '';
  const appStore = useAppStore();
  const uniqueLicenseCategories = [...new Set(licenseCategories.map((item) => item.licenseCategoryId))];
  const lookupCategories = [...appStore.lookupInfo.familyLicenseCategory, ...appStore.lookupInfo.groupLicenseCategory];
  const categories = lookupCategories
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
function mapFacility(facility, isGroup, eceweOrg) {
  const applicationStore = useApplicationStore();
  const appStore = useAppStore();
  const ccfriAppStore = useCcfriAppStore();
  const navBarStore = useNavBarStore();

  facility.eceweOrg = eceweOrg;
  facility.licenseCategories = parseLicenseCategories(facility.childCareLicenses);
  facility.uploadedDocuments = applicationStore.applicationUploadedDocuments?.filter(
    (document) => document.facilityId === facility.facilityId,
  );
  facility.languageYearLabel = appStore.getLanguageYearLabel;
  facility.isRenewal = applicationStore.isRenewal;
  facility.isGroup = isGroup;
  facility.applicationTemplateVersion = applicationStore.applicationTemplateVersion;
  const facilityInNavBar = navBarStore.userProfileList?.find((item) => item.facilityId === facility.facilityId);
  facility.hasRfi = facilityInNavBar?.hasRfi || facility.ccfri?.unlockRfi;
  facility.hasNmf = facilityInNavBar?.hasNmf || facility.ccfri?.unlockNmf;
  facility.enableAfs = facilityInNavBar?.enableAfs;
  facility.afs = ccfriAppStore.approvableFeeSchedules?.find(
    (item) => item.ccfriApplicationId === facility?.ccfri?.ccfriApplicationId,
  );

  // Renewal application doesn't have CCOF Funding application
  if (!isGroup && !facility.isRenewal) {
    facility.funding.licenceCategoryNumber = appStore.getFamilyLicenceCategoryNumberById(
      facility.funding.licenceCategoryId,
    );
  }

  // check for opt out - no need for more calls if opt-out
  if (facility.ccfri?.ccfriId && facility.ccfri?.ccfriOptInStatus == 1) {
    const ccofProgramYearId = applicationStore.programYearId;
    const programYearList = appStore.programYearList.list;
    facility.ccfri.currentYear = getProgramYear(ccofProgramYearId, programYearList);
    facility.ccfri.prevYear = getProgramYear(facility.ccfri.currentYear.previousYearId, programYearList);
    facility.ccfri.childCareTypes = decorateCcfriChildCareTypes(facility.ccfri, facility.childCareLicenses);
  }

  facility.facilitySummary = {
    facilityId: facility.facilityId,
    facilityName: facility.facilityInfo?.facilityName,
    facilityAccountNumber: facility.facilityInfo?.facilityAccountNumber,
    healthAuthority: facility.facilityInfo?.healthAuthority,
    licenseNumber: facility.facilityInfo?.licenseNumber,
    ccfriOptInStatus: facility.ccfri?.ccfriOptInStatus,
    eceweOptInStatus: facility.ecewe?.optInOrOut,
    isComplete: ApplicationService.isFacilityComplete(facility),
  };
  return facility;
}

/* Note (jbeckett-cgi):
- If the user has not selected fee Frequency type, the summary cards will not populate with all the correct fee cards.
- This checks for all licenses available for the facility, and displays what is missing to the user.
*/
function decorateCcfriChildCareTypes(ccfri, childCareLicenses) {
  const applicationStore = useApplicationStore();
  if (ccfri?.childCareTypes?.length < childCareLicenses?.length) {
    const childCareTypesArr = [];
    const findChildCareTypes = (yearToSearch, checkForMissingPrevFees = false) => {
      childCareLicenses?.forEach((category) => {
        const found = ccfri?.childCareTypes?.find(
          (searchItem) =>
            searchItem.childCareCategoryId === category.childCareCategoryId &&
            searchItem.programYearId === yearToSearch.programYearId,
        );

        if (found) {
          childCareTypesArr.push(found);
        } else {
          if (checkForMissingPrevFees) {
            //check to see if childcarecat exists in last years CCFRI app.
            const pastChildCareTypefound = ccfri?.prevYearCcfriApp.childCareTypes.find(
              (prevChildCareCat) =>
                prevChildCareCat.childCareCategoryId === category.childCareCategoryId &&
                prevChildCareCat.programYearId === yearToSearch.programYearId,
            );
            if (pastChildCareTypefound) {
              return;
            }
            //else we are missing fees from last year, for a child care category that the user has license for.
            //This usually happens when the facility has a new licence for this year. Add the category to the summary
          }

          const theCat = cloneDeep(category);
          theCat.programYear = yearToSearch.name;
          childCareTypesArr.push(theCat);
        }
      });
    };

    findChildCareTypes(ccfri.currentYear);

    //only show last year fees if new app or previous year fees are incorrect
    if (
      !applicationStore.isRenewal ||
      ccfri.existingFeesCorrect === CCFRI_FEE_CORRECT_TYPES.NO ||
      !ccfri.previousCcfriId
    ) {
      findChildCareTypes(ccfri.prevYear);
    }

    //check if we are missing any feed cards from the last year if previous fees are correct
    else if (
      applicationStore.isRenewal &&
      ccfri.existingFeesCorrect === CCFRI_FEE_CORRECT_TYPES.YES &&
      ccfri.previousCcfriId
    ) {
      findChildCareTypes(ccfri.prevYear, true);
    }

    //age group asc
    childCareTypesArr.sort((a, b) => a.orderNumber - b.orderNumber);

    //sort by program year
    return childCareTypesArr.sort((a, b) => {
      const nameA = a.programYear.toUpperCase(); // ignore upper and lowercase
      const nameB = b.programYear.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      // names must be equal
      return 0;
    });
  } else {
    return sortBy(ccfri.childCareTypes, 'orderNumber');
  }
}

export const useSummaryDeclarationStore = defineStore('summaryDeclaration', {
  state: () => ({
    declarationModel: {},
    summaryModel: {},
    facilities: [],
  }),
  actions: {
    setDeclarationModel(value) {
      this.declarationModel = value;
    },
    setSummaryModel(value) {
      this.summaryModel = value;
    },
    async loadDeclaration() {
      checkSession();
      const applicationStore = useApplicationStore();
      try {
        const payload = (
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
        const payload = (await ApiService.apiAxios.get(`${ApiRoutes.CHANGE_REQUEST}/${changeRequestId}`)).data;
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
        declarationAStatus: this.declarationModel?.declarationAStatus ?? null,
        declarationBStatus: this.declarationModel?.declarationBStatus ?? null,
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

          const response = await ApiService.apiAxios.patch(`${ApiRoutes.CHANGE_REQUEST}/${changeRequestId}`, payload);
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
          const response = await ApiService.apiAxios.patch(
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
    async loadSummary() {
      checkSession();
      const applicationStore = useApplicationStore();
      const ccfriAppStore = useCcfriAppStore();
      const navBarStore = useNavBarStore();

      let appID = applicationStore?.applicationMap?.get(applicationStore?.programYearId)?.applicationId;

      if (!appID) {
        appID = applicationStore.applicationId;
      }
      try {
        const filterNavBarIds = navBarStore.navBarList.map((item) => item.facilityId);

        const applicationSummaryResponse = await ApiService.apiAxios.post(`${ApiRoutes.APPLICATION_SUMMARY}/${appID}`, {
          facilities: filterNavBarIds,
        });

        const payload = applicationSummaryResponse.data;

        const summaryModel = {
          organization: undefined,
          application: payload.application,
          ecewe: undefined,
        };

        await Promise.all([
          ccfriAppStore.getApprovableFeeSchedulesForFacilities(navBarStore.userProfileList),
          applicationStore.getApplicationUploadedDocuments(),
        ]);

        //ccfri 3912 show ECEWE org questions for all applications
        if (payload.application?.organizationId) {
          summaryModel.organization = await OrganizationService.getOrganization(payload.application.organizationId);
          summaryModel.ecewe = (
            await ApiService.apiAxios.get(`${ApiRoutes.APPLICATION_ECEWE}/${payload.application.applicationId}`)
          ).data;
        }

        const isGroup = summaryModel?.application?.organizationProviderType === ORGANIZATION_PROVIDER_TYPES.GROUP;
        this.facilities = payload.facilities.map((facility) => mapFacility(facility, isGroup, summaryModel.ecewe));

        this.setSummaryModel(summaryModel);
      } catch (error) {
        console.log(`Failed to load Summary - ${error}`);
        throw error;
      }
    },
    async loadChangeRequestSummaryDeclaration(changeRequestId) {
      checkSession();
      try {
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
          latestSubmissionDate: payload?.latestSubmissionDate,
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
      const appStore = useAppStore();
      const applicationStore = useApplicationStore();
      const ccfriAppStore = useCcfriAppStore();
      const navBarStore = useNavBarStore();

      try {
        const summaryModel = this.summaryModel;
        const mtfiChangeAction = payload.changeActions?.find(
          (item) => item.changeType === CHANGE_REQUEST_TYPES.PARENT_FEE_CHANGE,
        );
        summaryModel.mtfiFacilities = mtfiChangeAction?.mtfi;

        await Promise.all([
          ccfriAppStore.getApprovableFeeSchedulesForFacilities(summaryModel.mtfiFacilities),
          applicationStore.getApplicationUploadedDocuments(),
        ]);

        await Promise.all(
          summaryModel.mtfiFacilities.map(async (mtfiFacility) => {
            const userProfileListFacility = navBarStore.userProfileList.find(
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

              mtfiFacility.afs = ccfriAppStore.approvableFeeSchedules?.find(
                (item) => item.ccfriApplicationId === mtfiFacility?.ccfriApplicationId,
              );

              mtfiFacility.uploadedDocuments = applicationStore.applicationUploadedDocuments?.filter(
                (document) => document.facilityId === mtfiFacility.facilityId,
              );

              mtfiFacility.isProgramYearLanguageHistorical =
                appStore.getLanguageYearLabel === PROGRAM_YEAR_LANGUAGE_TYPES.HISTORICAL;
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
        const changeNotiChangeAction = payload.changeActions?.find(
          (item) => item.changeType === CHANGE_REQUEST_TYPES.PDF_CHANGE,
        );
        this.summaryModel.changeNotificationFormDocuments = await reportChangesStore.loadChangeRequestDocs(
          changeNotiChangeAction?.changeActionId,
        );
      } catch (error) {
        console.log(`Failed to load Summary for change request Change Notification Form - ${error}`);
        throw error;
      }
    },
  },
});
