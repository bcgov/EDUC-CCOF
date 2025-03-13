<!-- eslint-disable vue/no-v-html -->
<template>
  <v-container fluid class="pa-12">
    <MessagesToolbar />
    <div v-if="organizationAccountNumber || organizationName" class="font-weight-bold pb-6 text-h5 text-center">
      <p v-if="organizationAccountNumber">Organization ID: {{ organizationAccountNumber }}</p>
      <p v-if="organizationName">Organization Name: {{ organizationName }}</p>
    </div>
  </v-container>
</template>
<script>
import { isEmpty, orderBy } from 'lodash';
import { mapState, mapActions } from 'pinia';
import { useAuthStore } from '@/store/auth.js';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { useReportChangesStore } from '@/store/reportChanges.js';
import { useMessageStore } from '@/store/message.js';

import CancelApplicationDialog from '@/components/CancelApplicationDialog.vue';
import SmallCard from '@/components/guiComponents/SmallCard.vue';
import MessagesToolbar from '@/components/guiComponents/MessagesToolbar.vue';
import FiscalYearSlider from '@/components/guiComponents/FiscalYearSlider.vue';
import {
  PATHS,
  pcfUrl,
  pcfUrlGuid,
  CHANGE_REQUEST_EXTERNAL_STATUS,
  ORGANIZATION_PROVIDER_TYPES,
} from '@/utils/constants.js';
import alertMixin from '@/mixins/alertMixin.js';
import { checkApplicationUnlocked } from '@/utils/common.js';
import { formatFiscalYearName } from '@/utils/format';

export default {
  name: 'LandingPage',
  components: { CancelApplicationDialog, SmallCard, MessagesToolbar, FiscalYearSlider },
  mixins: [alertMixin],
  data() {
    return {
      input: '',
      PATHS: PATHS,
      results: {},
      showCancelDialog: false,
      ccofNewApplicationText: [
        {
          title: 'CCOF Base Funding',
          body: '<p><strong>(CCOF)</strong> Base Funding assists eligible licensed family and group child care providers with the day-to-day costs of running a facility.</p><strong> CCOF Base Funding is a prerequisite to participate in CCFRI and ECE-WE.</strong>',
        },
        {
          title: 'Child Care Fee Reduction Initiative (CCFRI) Funding',
          body: 'The CCFRI offers funding to eligible, licensed child care providers to reduce and stabilize parents’ monthly child care fees.',
        },
        {
          title: 'Early Childhood Educator Wage Enhancement (ECE-WE) Funding',
          body: 'Providers with licensed care facilities can apply for a wage enhancement for Early Childhood Educators (ECEs) they employ directly.',
        },
      ],
      CCOFCardTitle: 'Apply for Child Care Operating Funding (CCOF) including:',
      isLoadingComplete: false,
      selectedProgramYear: undefined,
    };
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useAppStore, ['renewalYearLabel', 'programYearList']),
    ...mapState(useApplicationStore, [
      'latestProgramYearId',
      'applicationIds',
      'getFacilityListForPCFByProgramYearId',
      'formattedProgramYear',
      'applicationType',
      'programYearId',
      'programYearLabel',
      'ccofApplicationStatus',
      'unlockBaseFunding',
      'isRenewal',
      'unlockDeclaration',
      'unlockEcewe',
      'unlockLicenseUpload',
      'unlockSupportingDocuments',
      'applicationStatus',
      'applicationMap',
      'applicationId',
    ]),
    ...mapState(useNavBarStore, ['navBarList']),
    ...mapState(useOrganizationStore, [
      'organizationAccountNumber',
      'organizationProviderType',
      'organizationId',
      'organizationName',
      'organizationAccountNumber',
    ]),
    ...mapState(useReportChangesStore, ['changeRequestStore']),
    getNextProgramYear() {
      return this.programYearList?.list?.find((el) => el.previousYearId == this.latestProgramYearId);
    },
    getRenewYearLabel() {
      if ((this.applicationType == 'NEW' && this.applicationStatus == 'DRAFT') || !this.applicationId) {
        //console.log('no year');
        return '';
      }
      //show the year ahead because we can't pull from application year YET
      else if (this.ccofRenewStatus === this.RENEW_STATUS_NEW) {
        let nameToReturn = this.getNextProgramYear?.name;
        return formatFiscalYearName(nameToReturn);
      } else if (
        this.ccofRenewStatus === this.RENEW_STATUS_CONTINUE ||
        this.ccofRenewStatus === this.RENEW_STATUS_ACTION_REQUIRED
      ) {
        return this.formattedProgramYear;
      }
      //should not reach here- perhaps change-
      return this.formattedProgramYear;
    },
    getFundingAgreementNumberByYear() {
      if (this.selectedProgramYear)
        return this.applicationMap?.get(this.selectedProgramYear.programYearId)?.fundingAgreementNumber;
      return this.applicationMap?.get(this.programYearId)?.fundingAgreementNumber;
    },
    getActionRequiredApplicationsForCCOFCard() {
      const applicationList = Array.from(this.applicationMap?.values());
      return applicationList?.filter((application) => {
        const isLatestRenewApplication =
          application.ccofProgramYearId === this.latestProgramYearId &&
          this.ccofRenewStatus !== this.RENEW_STATUS_NEW &&
          application.applicationType === 'RENEW';
        const isApplicationUnlocked = checkApplicationUnlocked(application);
        return !isLatestRenewApplication && isApplicationUnlocked;
      });
    },
    facilityListForFacilityCards() {
      if (this.selectedProgramYear)
        return this.getFacilityListForPCFByProgramYearId(this.selectedProgramYear?.programYearId);
      return this.getFacilityListForPCFByProgramYearId(this.programYearId);
    },
    programYearNameForFacilityCards() {
      if (this.selectedProgramYear) return this.selectedProgramYear?.name;
      return this.programYearLabel?.slice(0, -3);
    },
    filteredFacilityListForFacilityCards() {
      if (this.input === '' || this.input === ' ' || this.input === null) {
        return this.facilityListForFacilityCards;
      }
      return this.facilityListForFacilityCards?.filter((fac) =>
        fac.facilityName.toLowerCase().includes(this.input.toLowerCase()),
      );
    },
    isWithinRenewDate() {
      let isEnabled =
        this.userInfo.serverTime > this.getNextProgramYear?.intakeStart &&
        this.userInfo.serverTime < this.getNextProgramYear?.intakeEnd;
      return isEnabled;
    },
    isRenewEnabled() {
      //renew disabled because current NEW application is in progress
      if (this.applicationType === 'NEW' && this.applicationStatus === 'DRAFT') {
        return false;
      }
      //continue renewal application
      else if (this.applicationStatus === 'DRAFT') {
        return true;
      } else if (
        (this.applicationStatus === 'SUBMITTED' || this.applicationStatus === 'APPROVED') &&
        this.organizationAccountNumber &&
        this.ccofApplicationStatus === 'ACTIVE'
      ) {
        let isEnabled =
          this.isWithinRenewDate &&
          //&& this.programYearId == this.programYearList?.renewal?.previousYearId // can only renew if the last application was for the previous year
          this.programYearId != this.programYearList?.renewal?.programYearId; // cannot renew if current application program year is the same as renewal program year
        return isEnabled;
      }
      //}
      return false;
      //return (this.applicationType === 'RENEW');
    },
    ccofStatus() {
      if (!this.applicationType) {
        return this.CCOF_STATUS_NEW;
      }
      if (this.applicationType === 'NEW') {
        switch (this.applicationStatus) {
          case 'DRAFT':
            return this.CCOF_STATUS_CONTINUE;
          case 'SUBMITTED':
            if (this.isOrganizationUnlock) return this.CCOF_STATUS_ACTION_REQUIRED;
            else return this.ccofApplicationStatus === 'ACTIVE' ? this.CCOF_STATUS_APPROVED : this.CCOF_STATUS_COMPLETE;
          default:
            return this.CCOF_STATUS_NEW;
        }
      } else {
        return this.CCOF_STATUS_APPROVED;
      }
    },
    ccofRenewStatus() {
      if (this.applicationType === 'RENEW') {
        if (this.applicationStatus === 'DRAFT') {
          return this.RENEW_STATUS_CONTINUE;
        } else if (this.isWithinRenewDate) {
          return this.RENEW_STATUS_NEW;
        } else if (this.isOrganizationUnlock) {
          return this.RENEW_STATUS_ACTION_REQUIRED;
        } else if (this.applicationStatus === 'SUBMITTED' && this.ccofApplicationStatus === 'ACTIVE') {
          return this.RENEW_STATUS_APPROVED;
        } else {
          return this.RENEW_STATUS_COMPLETE;
        }
      } else {
        return this.RENEW_STATUS_NEW;
      }
    },
    isOrganizationUnlock() {
      return (
        (this.unlockBaseFunding && this.applicationType === 'NEW') ||
        this.unlockDeclaration ||
        this.unlockEcewe ||
        this.unlockLicenseUpload ||
        this.unlockSupportingDocuments ||
        !isEmpty(this.unlockCCFRIList) ||
        !isEmpty(this.unlockNMFList) ||
        !isEmpty(this.unlockRFIList) ||
        !isEmpty(this.unlockAFSList)
      );
    },
    unlockCCFRIList() {
      return this.getUnlockCCFRIList(this.navBarList);
    },
    unlockNMFList() {
      return this.getUnlockNMFList(this.navBarList);
    },
    unlockRFIList() {
      return this.getUnlockRFIList(this.navBarList);
    },
    unlockAFSList() {
      return this.getUnlockAFSList(this.navBarList);
    },
    isCCOFApproved() {
      return this.applicationType === 'RENEW' || this.ccofStatus === this.CCOF_STATUS_APPROVED;
    },
    isReportChangeButtonEnabled() {
      if (this.applicationType === 'RENEW' && this.organizationAccountNumber) {
        return true;
      }
      return !!(this.organizationAccountNumber && this.applicationMap?.get(this.programYearId)?.fundingAgreementNumber);
    },
    isUpdateChangeRequestDisplayed() {
      const index = this.changeRequestStore?.findIndex(
        (changeRequest) => changeRequest.externalStatus === CHANGE_REQUEST_EXTERNAL_STATUS.ACTION_REQUIRED,
      );
      return index > -1;
    },
    isSubmissionHistoryDisplayed() {
      const applicationList = Array.from(this.applicationMap?.values());
      const index = applicationList?.findIndex((application) => application.applicationStatus != 'DRAFT');
      return index > -1;
    },
    mtfiChangeRequestList() {
      let result = [];
      if (this.changeRequestStore?.length > 0) {
        result = this.changeRequestStore.filter((changeRequest) => {
          if (changeRequest.programYearId === this.selectedProgramYear?.programYearId) {
            let index = changeRequest.changeActions?.findIndex(
              (changeAction) => changeAction.changeType === 'PARENT_FEE_CHANGE',
            );
            return index > -1;
          }
          return false;
        });
      }
      return result;
    },
    isCancelPcfButtonEnabled() {
      return (
        this.applicationStatus === 'DRAFT' && this.applicationType === 'NEW' && this.ccofApplicationStatus === 'NEW'
      );
    },
    isCCOFStatusNew() {
      return this.ccofStatus === this.CCOF_STATUS_NEW;
    },
  },
  async created() {
    this.CCOF_STATUS_NEW = 'NEW';
    this.CCOF_STATUS_COMPLETE = 'COMPLETE';
    this.CCOF_STATUS_CONTINUE = 'CONTINUE';
    this.CCOF_STATUS_APPROVED = 'APPROVED';
    this.CCOF_STATUS_ACTION_REQUIRED = 'ACTION_REQUIRED';

    this.RENEW_STATUS_NEW = 'NEW';
    this.RENEW_STATUS_COMPLETE = 'COMPLETE';
    this.RENEW_STATUS_CONTINUE = 'CONTINUE';
    this.RENEW_STATUS_APPROVED = 'APPROVED';
    this.RENEW_STATUS_ACTION_REQUIRED = 'ACTION_REQUIRED';

    this.isLoadingComplete = false;
    this.getAllMessagesVuex();
    this.refreshNavBarList();
    await this.getChangeRequestList();
    this.isLoadingComplete = true;
  },
  methods: {
    ...mapActions(useApplicationStore, ['setIsRenewal']),
    ...mapActions(useMessageStore, ['getAllMessages']),
    ...mapActions(useNavBarStore, ['refreshNavBarList']),
    ...mapActions(useReportChangesStore, ['getChangeRequestList']),
    toggleCancelApplicationDialog() {
      this.showCancelDialog = !this.showCancelDialog;
    },
    newApplicationIntermediatePage() {
      this.setIsRenewal(false);
      this.$router.push(pcfUrl(PATHS.NEW_APPLICATION_INTERMEDIATE, this.programYearList.newApp.programYearId));
    },
    renewApplication() {
      this.setIsRenewal(true);
      this.$router.push(pcfUrl(PATHS.RENEW_CONFIRM, this.getNextProgramYear?.programYearId));
    },
    goToChangeRequestHistory() {
      this.$router.push(PATHS.ROOT.CHANGE_LANDING + '#change-request-history');
    },
    continueRenewal() {
      this.goToLicenseUpload();
    },
    newApplication() {
      this.setIsRenewal(false);
      this.$router.push(pcfUrl(PATHS.SELECT_APPLICATION_TYPE, this.programYearList.newApp.programYearId));
    },
    goToCCOFOrganizationInfo() {
      this.setIsRenewal(false);
      this.$router.push(
        pcfUrl(
          this.organizationProviderType === ORGANIZATION_PROVIDER_TYPES.GROUP
            ? PATHS.CCOF_GROUP_ORG
            : PATHS.CCOF_FAMILY_ORG,
          this.programYearId,
        ),
      );
    },
    goToCCOFFunding(programYearId, facilityList) {
      if (facilityList?.length > 0) {
        const ccofBaseFundingId = facilityList[0].ccofBaseFundingId;
        if (ccofBaseFundingId && programYearId) {
          this.$router.push(
            pcfUrlGuid(
              this.organizationProviderType === ORGANIZATION_PROVIDER_TYPES.GROUP
                ? PATHS.CCOF_GROUP_FUNDING
                : PATHS.CCOF_FAMILY_FUNDING,
              programYearId,
              ccofBaseFundingId,
            ),
          );
        }
      }
    },
    goToLicenseUpload(programYearId = this.programYearId) {
      this.$router.push(pcfUrl(PATHS.LICENSE_UPLOAD, programYearId));
    },
    goToCCFRI(ccfriApplicationId, application) {
      let path = application?.isRenewal ? PATHS.CCFRI_CURRENT_FEES : PATHS.CCFRI_NEW_FEES;
      this.$router.push(pcfUrlGuid(path, application?.ccofProgramYearId, ccfriApplicationId));
    },
    goToNMF(ccfriApplicationId, programYearId) {
      this.$router.push(pcfUrlGuid(PATHS.CCFRI_NMF, programYearId, ccfriApplicationId));
    },
    goToRFI(ccfriApplicationId, programYearId) {
      this.$router.push(pcfUrlGuid(PATHS.CCFRI_RFI, programYearId, ccfriApplicationId));
    },
    goToAFS(ccfriApplicationId, programYearId) {
      this.$router.push(pcfUrlGuid(PATHS.CCFRI_AFS, programYearId, ccfriApplicationId));
    },
    goToECEWE(programYearId) {
      this.$router.push(pcfUrl(PATHS.ECEWE_ELIGIBILITY, programYearId));
    },
    goToSupportingDocumentUpload(programYearId = this.programYearId) {
      this.$router.push(pcfUrl(PATHS.SUPPORTING_DOCS, programYearId));
    },
    goToSummaryDeclaration(programYearId = this.programYearId) {
      this.$router.push(pcfUrl(PATHS.SUMMARY_DECLARATION, programYearId));
    },
    viewApplication(type) {
      if (type === 'NEW') {
        this.goToCCOFOrganizationInfo();
      } else {
        this.goToLicenseUpload();
      }
    },
    async getAllMessagesVuex() {
      try {
        await this.getAllMessages(this.organizationId);
      } catch (error) {
        console.info(error);
      }
    },

    actionRequiredOrganizationRoute(programYearId = this.programYearId) {
      let application = this.applicationMap?.get(programYearId);
      const facilityList = this.getFacilityListForPCFByProgramYearId(programYearId);
      const unlockCCFRIList = this.getUnlockCCFRIList(facilityList);
      const unlockRFIList = this.getUnlockRFIList(facilityList);
      const unlockNMFList = this.getUnlockNMFList(facilityList);
      const unlockAFSList = this.getUnlockAFSList(facilityList);
      if (application?.unlockLicenseUpload) this.goToLicenseUpload(programYearId);
      else if (application?.unlockBaseFunding && application?.applicationType === 'NEW')
        this.goToCCOFFunding(programYearId, facilityList);
      else if (application?.unlockEcewe) this.goToECEWE(programYearId);
      else if (application?.unlockSupportingDocuments) this.goToSupportingDocumentUpload(programYearId);
      else if (!isEmpty(unlockCCFRIList)) this.goToCCFRI(unlockCCFRIList[0], application);
      else if (!isEmpty(unlockNMFList)) this.goToNMF(unlockNMFList[0], programYearId);
      else if (!isEmpty(unlockRFIList)) this.goToRFI(unlockRFIList[0], programYearId);
      else if (!isEmpty(unlockAFSList)) this.goToAFS(unlockAFSList[0], programYearId);
      else if (application?.unlockDeclaration) this.goToSummaryDeclaration(programYearId);
    },
    actionRequiredFacilityRoute(ccfriApplicationId) {
      const programYearId = this.selectedProgramYear?.programYearId
        ? this.selectedProgramYear?.programYearId
        : this.programYearId;
      const application = this.applicationMap?.get(programYearId);
      if (this.isCCFRIUnlock(ccfriApplicationId, application)) this.goToCCFRI(ccfriApplicationId, application);
      else if (this.isNMFUnlock(ccfriApplicationId, application)) this.goToNMF(ccfriApplicationId, programYearId);
      else if (this.isRFIUnlock(ccfriApplicationId, application)) this.goToRFI(ccfriApplicationId, programYearId);
      else if (this.isAFSUnlock(ccfriApplicationId, application)) this.goToAFS(ccfriApplicationId, programYearId);
    },
    buttonColor(isDisabled) {
      return isDisabled ? 'disabledButton' : 'blueButton';
    },
    isFacilityCardUnlock(ccfriApplicationId) {
      const programYearId = this.selectedProgramYear?.programYearId
        ? this.selectedProgramYear?.programYearId
        : this.programYearId;
      let application = this.applicationMap?.get(programYearId);
      return (
        this.isCCFRIUnlock(ccfriApplicationId, application) ||
        this.isNMFUnlock(ccfriApplicationId, application) ||
        this.isRFIUnlock(ccfriApplicationId, application) ||
        this.isAFSUnlock(ccfriApplicationId, application)
      );
    },
    isCCFRIUnlock(ccfriApplicationId, application) {
      const facilityList = this.getFacilityListForPCFByProgramYearId(application?.ccofProgramYearId);
      const unlockCCFRIList = this.getUnlockCCFRIList(facilityList);
      return application?.applicationStatus === 'SUBMITTED' && unlockCCFRIList.includes(ccfriApplicationId);
    },
    isNMFUnlock(ccfriApplicationId, application) {
      const facilityList = this.getFacilityListForPCFByProgramYearId(application?.ccofProgramYearId);
      const unlockNMFList = this.getUnlockNMFList(facilityList);
      return application?.applicationStatus === 'SUBMITTED' && unlockNMFList.includes(ccfriApplicationId);
    },
    isRFIUnlock(ccfriApplicationId, application) {
      const facilityList = this.getFacilityListForPCFByProgramYearId(application?.ccofProgramYearId);
      const unlockRFIList = this.getUnlockRFIList(facilityList);
      return application?.applicationStatus === 'SUBMITTED' && unlockRFIList.includes(ccfriApplicationId);
    },
    isAFSUnlock(ccfriApplicationId, application) {
      const facilityList = this.getFacilityListForPCFByProgramYearId(application?.ccofProgramYearId);
      const unlockAFSList = this.getUnlockAFSList(facilityList);
      return application?.applicationStatus === 'SUBMITTED' && unlockAFSList?.includes(ccfriApplicationId);
    },
    getUnlockCCFRIList(facilityList) {
      const unlockList = [];
      facilityList?.forEach((facility) => {
        if (facility.unlockCcfri) unlockList.push(facility.ccfriApplicationId);
      });
      return unlockList;
    },
    getUnlockNMFList(facilityList) {
      const unlockList = [];
      facilityList?.forEach((facility) => {
        if (facility.unlockNmf) unlockList.push(facility.ccfriApplicationId);
      });
      return unlockList;
    },
    getUnlockRFIList(facilityList) {
      const unlockList = [];
      facilityList?.forEach((facility) => {
        if (facility.unlockRfi) unlockList.push(facility.ccfriApplicationId);
      });
      return unlockList;
    },
    getUnlockAFSList(facilityList) {
      const unlockList = [];
      facilityList?.forEach((facility) => {
        if (facility.unlockAfs && facility.enableAfs) unlockList.push(facility.ccfriApplicationId);
      });
      return unlockList;
    },
    selectProgramYear(programYear) {
      this.selectedProgramYear = programYear;
    },
    getLastSubmittedMTFIChangeRequest(facilityId) {
      let lastMTFIChangeRequest;
      if (this.mtfiChangeRequestList?.length > 0) {
        let mtfiChangeRequestListForFacility = this.mtfiChangeRequestList?.filter((item) => {
          if (item.firstSubmissionDate) {
            const mtfiChangeAction = item.changeActions?.find(
              (changeAction) => changeAction.changeType === 'PARENT_FEE_CHANGE',
            );
            const index = mtfiChangeAction?.mtfiFacilities?.findIndex((fac) => fac.facilityId === facilityId);
            return index > -1;
          }
          return false;
        });
        if (mtfiChangeRequestListForFacility?.length > 0) {
          mtfiChangeRequestListForFacility = orderBy(mtfiChangeRequestListForFacility, 'firstSubmissionDate', 'desc');
          lastMTFIChangeRequest = mtfiChangeRequestListForFacility[0];
        }
      }
      return lastMTFIChangeRequest;
    },
    getCcfriStatusForFacilityCard(facility) {
      if (facility?.ccfriOptInStatus === 0) return 'OPTED OUT';
      else {
        const lastMTFIChangeRequest = this.getLastSubmittedMTFIChangeRequest(facility?.facilityId);
        if (lastMTFIChangeRequest?.changeActions?.length > 0) {
          const mtfiFacility = lastMTFIChangeRequest.changeActions[0].mtfiFacilities?.find(
            (item) => item.facilityId === facility?.facilityId,
          );
          return mtfiFacility?.ccfriStatus;
        }
        return facility?.ccfriStatus;
      }
    },
    getEceweStatusForFacilityCard(facility) {
      if (facility?.eceweOptInStatus === 0) return 'OPTED OUT';
      else {
        return facility?.eceweStatus;
      }
    },
  },
};
</script>

<style scoped>
.blueBorder {
  border-top: 5px solid #003366 !important;
}
.blueButton {
  background-color: #003366 !important;
}
.red-button {
  background-color: #d8292f;
  color: white;
}
.blueText {
  color: rgb(0, 52, 102) !important;
}
</style>
