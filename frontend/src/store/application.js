import { defineStore } from 'pinia';

import ApiService from '@/common/apiService.js';
import ApplicationService from '@/services/applicationService';
import DocumentService from '@/services/documentService';
import { useAppStore } from '@/store/app.js';
import { useAuthStore } from '@/store/auth.js';
import { useNavBarStore } from '@/store/navBar.js';
import { checkApplicationUnlocked, filterFacilityListForPCF } from '@/utils/common.js';
import { APPLICATION_STATUSES, APPLICATION_TYPES, ApiRoutes } from '@/utils/constants.js';
import { PERMISSIONS } from '@/utils/constants/permissions.js';
import { formatFiscalYearName } from '@/utils/format';

export const useApplicationStore = defineStore('application', {
  state: () => ({
    applicationId: null,
    applicationStatus: null,
    applicationType: null,
    applicationTemplateVersion: null,
    ccofApplicationStatus: null,
    programYearId: null,
    programYearLabel: null,
    isRenewal: false,

    unlockBaseFunding: false,
    unlockRenewal: false,
    unlockDeclaration: false,
    unlockEcewe: false,
    unlockLicenseUpload: false,
    unlockSupportingDocuments: false,

    isEceweComplete: false,
    isLicenseUploadComplete: false,

    applicationMap: new Map(),
    renewalApplicationCCOF: null,
    applicationUploadedDocuments: [],
    isApplicationDocumentsLoading: false,

    isApplicationProcessing: false,
    isApplicationFormValidated: false,
  }),
  actions: {
    setApplicationId(value) {
      this.applicationId = value;
    },
    setApplicationType(value) {
      this.applicationType = value;
    },
    setApplicationStatus(value) {
      this.applicationStatus = value;
    },
    setApplicationTemplateVersion(value) {
      this.applicationTemplateVersion = Number(value);
    },
    setCcofApplicationStatus(value) {
      this.ccofApplicationStatus = value;
    },
    setProgramYearId(value) {
      this.programYearId = value;
    },
    setProgramYearLabel(value) {
      this.programYearLabel = value;
    },
    setIsRenewal(value) {
      this.isRenewal = value;
    },
    setFormattedProgramYear(value) {
      this.formattedProgramYear = value;
    },
    setUnlockBaseFunding(value) {
      this.unlockBaseFunding = value;
    },
    setUnlockRenewal(value) {
      this.unlockRenewal = value;
    },
    setUnlockDeclaration(value) {
      this.unlockDeclaration = value;
    },
    setUnlockEcewe(value) {
      this.unlockEcewe = value;
    },
    setUnlockLicenseUpload(value) {
      this.unlockLicenseUpload = value;
    },
    setUnlockSupportingDocuments(value) {
      this.unlockSupportingDocuments = value;
    },

    setIsEceweComplete(value) {
      this.isEceweComplete = value;
    },
    setIsEceweCompleteInMap(value) {
      let app = this.applicationMap?.get(this.programYearId);
      //it should almost always have an app.. this just solves for the case where it's a brand new PCF application, and they haven't refreshed yet
      if (app) {
        app.isEceweComplete = value;
      }
    },
    setIsLicenseUploadComplete(value) {
      this.isLicenseUploadComplete = value;
    },
    setIsLicenseUploadCompleteInMap(value) {
      let app = this.applicationMap?.get(this.programYearId);

      if (app) {
        app.isLicenseUploadComplete = value;
      }
    },
    setApplicationUploadedDocuments(value) {
      this.applicationUploadedDocuments = value;
    },
    setIsApplicationProcessing(value) {
      this.isApplicationProcessing = value;
    },
    addApplicationsToMap(applicationList) {
      const map = new Map(this.applicationMap);
      applicationList?.forEach((el) => {
        map.set(el.ccofProgramYearId, el);
      });
      this.applicationMap = map;
    },
    removeFacilityFromMap(facilityId) {
      let app = this.applicationMap?.get(this.programYearId);
      //it should almost always have an app.. this just solves for the case where it's a brand new PCF application, and they haven't refreshed yet
      if (app) {
        app.facilityList = app.facilityList?.filter((fac) => fac.facilityId != facilityId);
        const map = new Map(this.applicationMap);
        this.applicationMap = map;
      }
    },
    async loadApplicationFromStore(programYearId) {
      const application = this.applicationMap.get(programYearId);
      const appStore = useAppStore();
      const applicationStore = useApplicationStore();
      const authStore = useAuthStore();
      const navBarStore = useNavBarStore();
      if (application) {
        const isRenewal = application.applicationType === APPLICATION_TYPES.RENEWAL;
        this.setApplicationId(application.applicationId);
        this.setApplicationStatus(application.applicationStatus);
        this.setApplicationTemplateVersion(application.applicationTemplateVersion);
        this.setApplicationType(application.applicationType);
        this.setCcofApplicationStatus(application.ccofApplicationStatus);
        this.setProgramYearId(application.ccofProgramYearId);
        this.setProgramYearLabel(application.ccofProgramYearName);
        this.setIsRenewal(isRenewal);
        this.setUnlockBaseFunding(application.unlockBaseFunding);
        this.setUnlockRenewal(application.unlockRenewal);
        this.setUnlockDeclaration(application.unlockDeclaration);
        this.setUnlockEcewe(application.unlockEcewe);
        this.setUnlockLicenseUpload(application.unlockLicenseUpload);
        this.setUnlockSupportingDocuments(application.unlockSupportingDocuments);
        this.setIsEceweComplete(application.isEceweComplete);
        this.setIsLicenseUploadComplete(application.isLicenseUploadComplete);
        if (
          authStore.hasPermission(PERMISSIONS.CREATE_RENEWAL_PCF, PERMISSIONS.VIEW_SUBMITTED_PCF) &&
          isRenewal &&
          !this.renewalApplicationCCOF
        ) {
          this.renewalApplicationCCOF = await ApplicationService.getRenewalApplicationCCOF(application.applicationId);
        }
        navBarStore.setIsRenewal(isRenewal);
        navBarStore.setUserProfileList(applicationStore?.applicationMap?.get(programYearId).facilityList);
      } else {
        const applicationTemplateVersion = appStore.getApplicationTemplateVersion(programYearId);
        this.setApplicationTemplateVersion(applicationTemplateVersion);
      }
    },
    async deletePcfApplication() {
      try {
        await ApiService.apiAxios.delete(`${ApiRoutes.APPLICATION}/${this.applicationId}`);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    async getApplicationUploadedDocuments() {
      try {
        this.isApplicationDocumentsLoading = true;
        this.applicationUploadedDocuments = await DocumentService.getApplicationUploadedDocuments(this.applicationId);
      } catch (error) {
        console.log(error);
        throw error;
      } finally {
        this.isApplicationDocumentsLoading = false;
      }
    },
    validateApplicationForm() {
      this.isApplicationFormValidated = !this.isApplicationFormValidated;
    },
  },
  getters: {
    isApplicationSubmitted: (state) => state.applicationStatus !== APPLICATION_STATUSES.DRAFT,
    formattedProgramYear: (state) => formatFiscalYearName(state.programYearLabel),
    fiscalStartAndEndDates: (state) => {
      //set fiscal year dates to prevent user from choosing dates outside the current FY
      //ASSUMPTION that fiscal year start / end dates will not move from April / March
      if (state.programYearLabel?.length > 3) {
        let currYear = state.programYearLabel?.substring(0, 4);
        let fiscalYearStartDate = `${currYear}-04-01`;
        currYear = +currYear + 1;
        let fiscalYearEndDate = `${currYear}-03-31`;
        return { startDate: fiscalYearStartDate, endDate: fiscalYearEndDate };
      }
      //should never get here
      return { startDate: null, endDate: null };
    },
    latestProgramYearId: (state) => {
      const appStore = useAppStore();
      let currentGuid;
      let futureGuid;
      let lastGuid;

      let highestOrder = 1; //2020/21 default
      state.applicationMap.forEach((value, key) => {
        if (value.ccofProgramYearStatus === 'FUTURE') {
          futureGuid = key;
        } else if (value.ccofProgramYearStatus === 'CURRENT') {
          currentGuid = key;
        } else if (appStore.programYearList.list.find((el) => el.programYearId == key)?.order > highestOrder) {
          highestOrder = appStore.programYearList.list.find((el) => el.programYearId == key)?.order;
          lastGuid = key;
        }
      });
      // TODO: add order to provider fiscal profile and then return the latest one based on the order
      return futureGuid ? futureGuid : currentGuid ? currentGuid : lastGuid;
    },
    applicationIds: (state) => {
      const applicationIds = [];
      state.applicationMap.forEach((value) => {
        applicationIds.push(value.applicationId);
      });
      return applicationIds;
    },
    getFacilityListForPCFByProgramYearId: (state) => (selectedProgramYearId) => {
      const authStore = useAuthStore();
      const programYearId = selectedProgramYearId ? selectedProgramYearId : this.latestProgramYearId;
      const selectedApplication = state.applicationMap?.get(programYearId);
      let facilityList = selectedApplication?.facilityList;

      const isApplicationUnlocked = checkApplicationUnlocked(selectedApplication);
      const isRenewal = selectedApplication?.applicationType === 'RENEW';
      let applicationStatus = selectedApplication?.applicationStatus;
      if (isApplicationUnlocked) {
        applicationStatus = 'ACTION_REQUIRED';
      } else if (
        selectedApplication?.applicationStatus === 'SUBMITTED' &&
        selectedApplication?.ccofApplicationStatus === 'ACTIVE'
      ) {
        applicationStatus = 'APPROVED';
      }

      facilityList = facilityList ? filterFacilityListForPCF(facilityList, isRenewal, applicationStatus) : facilityList;

      if (authStore.isFacilityAdmin) {
        facilityList = facilityList?.filter((facility) => {
          return authStore.userInfo?.facilities?.some((f) => f.facilityId === facility?.facilityId);
        });
      }

      return facilityList;
    },
    showApplicationTemplateV1: (state) => {
      return !state.applicationTemplateVersion || state.applicationTemplateVersion === 1;
    },
  },
});
