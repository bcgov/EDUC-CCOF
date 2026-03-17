<template>
  <v-container fluid>
    <div class="mx-4 mx-lg-12">
      <ApplicationPCFHeader
        page-title="Summary and Declaration"
        :program-year="formattedProgramYear"
        :organization-name="userInfo.organizationName"
      />

      <!-- Do not allow PCF to be submitted if CR is active -->
      <ApplicationChangeRequestInProgressAlert
        v-if="hasActiveChangeRequest && !isChangeRequest"
        :loading="isApplicationProcessing"
        class="my-8"
      />
      <!-- Do not allow CR New Fac to be submitted if PCF is unlocked -->
      <v-card v-if="isSomeApplicationUnlocked && isChangeRequest" elevation="4" class="my-8">
        <v-card-title class="rounded-t-lg py-3 noticeAlert">
          <v-icon size="x-large" class="py-1 px-3 noticeAlertIcon"> mdi-alert-octagon </v-icon>
          You have an unlocked PCF application still in progress.
        </v-card-title>
        <p class="pa-4">
          You will be unable to submit a change request until the Program Confirmation Form is updated.
        </p>
      </v-card>

      <div v-if="!hasActiveChangeRequest" class="text-center text-h5 text-primary">
        To submit your application, review this summary of your information and scroll down to sign the declaration.
      </div>
      <v-card v-if="!isApplicationFormComplete && !isApplicationProcessing" elevation="4" class="my-8">
        <v-card-title class="rounded-t-lg py-3 noticeAlert">
          <v-icon size="x-large" class="py-1 px-3 noticeAlertIcon"> mdi-alert-octagon </v-icon>
          Incomplete Form
        </v-card-title>
        <div class="pa-4">
          <p>You will not be able to submit your application until it is complete.</p>
          <p>Incomplete sections are marked with a red exclamation point.</p>
        </div>
      </v-card>
      <v-card class="mt-8 rounded-lg" elevation="4">
        <v-card-title class="rounded-t-lg py-3 card-title font-weight-bold">Summary</v-card-title>

        <v-skeleton-loader
          v-if="isApplicationProcessing"
          :loading="isApplicationProcessing"
          type="paragraph, text@3, paragraph, text@3, paragraph, paragraph, text@2, paragraph"
        />
        <v-expansion-panels v-else multiple>
          <v-expansion-panel v-if="showCCOFBaseFundingSummary" value="ccof-base-funding-summary">
            <CCOFBaseFundingSummary />
          </v-expansion-panel>
          <v-expansion-panel v-if="showOrganizationSummary" value="organization-summary">
            <OrganizationSummary />
          </v-expansion-panel>
          <v-expansion-panel value="facility-information-summary">
            <v-expansion-panel-title>
              <h4 class="text-primary">
                Facility Information
                <v-icon v-if="areAllFacilitiesComplete" size="large" class="text-success">
                  mdi-check-circle-outline
                </v-icon>
                <template v-else>
                  <v-icon size="large" class="text-error px-2">mdi-alert-circle-outline</v-icon>
                  <span class="text-error">
                    At least one of your facilities is missing required information. Click to view
                  </span>
                </template>
              </h4>
            </v-expansion-panel-title>
            <v-expansion-panel-text eager>
              <v-row v-if="facilities?.length > 2" no-gutters>
                <div class="text-primary pt-4 pb-2 mr-4">
                  <span class="mr-2">Filter by Facility</span>
                  <v-icon>mdi-filter</v-icon>
                </div>
                <v-col cols="12" lg="6">
                  <v-text-field
                    v-model="facilityFilter"
                    clearable
                    variant="outlined"
                    label="Filter by Facility Name"
                    max-width="600"
                  />
                </v-col>
              </v-row>
              <v-row class="pt-0">
                <v-col
                  v-for="facility in sortedFacilitiesToDisplay"
                  :key="facility?.facilityId"
                  cols="12"
                  lg="6"
                  class="my-1"
                >
                  <FacilityInformationSummaryCard
                    :facility="facility"
                    height="100%"
                    @click="openFacilitySummary(facility?.facilityId)"
                  />
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
          <FacilityInformationSummaryDialog
            :show="showFacilityInformationSummaryDialog"
            :facility-id="selectedFacilityId"
            :program-year-id="summaryModel?.application?.programYearId"
            max-width="85%"
            @close="toggleFacilityInformationSummaryDialog"
          />
          <v-expansion-panel value="ecewe-summary-org">
            <ECEWESummary
              :ecewe="summaryModel.ecewe"
              :ecewe-facility="null"
              :program-year-id="summaryModel?.application?.programYearId"
            />
          </v-expansion-panel>
          <v-expansion-panel v-if="hasChangeNotificationFormDocuments" value="change-notification-form-summary">
            <ChangeNotificationFormSummary
              :is-processing="isApplicationProcessing"
              :change-notification-form-documents="summaryModel?.changeNotificationFormDocuments"
            />
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card>

      <!---Declaration Start--->
      <div v-if="getFundingAgreementNumber && !isChangeRequest" class="my-8 text-h5 text-center text-primary">
        Funding Agreement Number: {{ getFundingAgreementNumber }}
      </div>
      <v-card class="my-8 rounded-lg" elevation="4">
        <v-card-title class="rounded-t-lg py-3 card-title font-weight-bold">Declaration</v-card-title>

        <v-skeleton-loader
          :loading="isApplicationProcessing"
          type="paragraph, text@3, paragraph, text@3, paragraph, paragraph, text@2, paragraph"
        >
          <v-container fluid class="px-6">
            <ApplicationDeclarationTextV2 v-if="showDeclarationV2" :enabled-declaration-b="model.enabledDeclarationB" />
            <ApplicationDeclarationTextV1 v-else />

            <div class="my-2">
              <v-checkbox
                v-if="!isRenewal"
                v-model="model.agreeConsentCertify"
                :disabled="isReadOnly"
                :value="1"
                label="I, the applicant, do hereby certify that all the information provided is true and complete to the best of my knowledge and belief. By clicking this check-box, I indicate that I agree to the foregoing terms and conditions."
              />
              <v-checkbox
                v-else
                v-model="model.agreeConsentCertify"
                :disabled="isReadOnly"
                :value="1"
                label="I agree, consent, and certify"
              />
              <v-text-field
                id="signatureTextField"
                v-model="model.orgContactName"
                variant="outlined"
                :disabled="isReadOnly"
                label="Your Organization's Authorized Signing Authority"
              />
            </div>
            <div v-if="isReadOnly && submissionTimestamp" class="text-grey mt-2">
              Last Submitted on: {{ submissionTimestamp }}
            </div>
          </v-container>
        </v-skeleton-loader>
      </v-card>
    </div>
    <NavButton
      :is-submit-displayed="!isReadOnly"
      :is-submit-disabled="isSubmitDisabled"
      :is-processing="isApplicationProcessing"
      class="mt-10"
      @previous="previous"
      @submit="submit"
    />
    <AppDialog
      v-model="showSubmissionConfirmationDialog"
      persistent
      max-width="525px"
      title="Submission Complete"
      @close="goToDashboard"
    >
      <template #content>
        <p>
          Your submission has been received. Please refer to your dashboard for updates on the progress of your
          application. We will contact you if more information is required.
        </p>
        <p>
          <AppButton class="mt-4" @click="goToDashboard"> Return to your dashboard </AppButton>
        </p>
      </template>
    </AppDialog>
  </v-container>
</template>
<script>
import { cloneDeep, isEmpty } from 'lodash';
import { mapActions, mapState } from 'pinia';
import { formatSubmissionTimestamp } from '@/utils/format';
import ChangeNotificationFormSummary from '@/components/summary/changeRequest/ChangeNotificationFormSummary.vue';
import CCOFBaseFundingSummary from '@/components/summary/group/CCOFBaseFundingSummary.vue';
import ECEWESummary from '@/components/summary/group/ECEWESummary.vue';
import OrganizationSummary from '@/components/summary/group/OrganizationSummary.vue';
import ApplicationDeclarationTextV1 from '@/components/applicationDeclarationTextVersions/ApplicationDeclarationTextV1.vue';
import ApplicationDeclarationTextV2 from '@/components/applicationDeclarationTextVersions/ApplicationDeclarationTextV2.vue';
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';
import ApplicationChangeRequestInProgressAlert from '@/components/util/ApplicationChangeRequestInProgressAlert.vue';
import ApplicationPCFHeader from '@/components/util/ApplicationPCFHeader.vue';
import FacilityInformationSummaryCard from '@/components/util/FacilityInformationSummaryCard.vue';
import FacilityInformationSummaryDialog from '@/components/util/FacilityInformationSummaryDialog.vue';
import NavButton from '@/components/util/NavButton.vue';
import alertMixin from '@/mixins/alertMixin.js';
import permissionsMixin from '@/mixins/permissionsMixin.js';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useAuthStore } from '@/store/auth.js';
import { useCcfriAppStore } from '@/store/ccfriApp.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useReportChangesStore } from '@/store/reportChanges.js';
import { useSummaryDeclarationStore } from '@/store/summaryDeclaration.js';
import ApplicationService from '@/services/applicationService';
import DocumentService from '@/services/documentService';
import FundingAgreementService from '@/services/fundingAgreementService.js';
import {
  AFS_STATUSES,
  CHANGE_REQUEST_TYPES,
  DECLARATION_TEXT_VERSIONS,
  DOCUMENT_TYPES,
  FUNDING_AGREEMENT_EXTERNAL_STATUSES,
  ORGANIZATION_PROVIDER_TYPES,
  PATHS,
} from '@/utils/constants.js';
import { isAnyApplicationUnlocked } from '@/utils/common.js';

export default {
  components: {
    AppButton,
    AppDialog,
    ApplicationChangeRequestInProgressAlert,
    ApplicationDeclarationTextV1,
    ApplicationDeclarationTextV2,
    ApplicationPCFHeader,
    CCOFBaseFundingSummary,
    ChangeNotificationFormSummary,
    ECEWESummary,
    FacilityInformationSummaryCard,
    FacilityInformationSummaryDialog,
    NavButton,
    OrganizationSummary,
  },
  mixins: [alertMixin, permissionsMixin],
  data() {
    return {
      model: {},
      showFacilityInformationSummaryDialog: false,
      showSubmissionConfirmationDialog: false,
      selectedFacilityId: null,
      facilityFilter: '',
    };
  },
  computed: {
    ...mapState(useAppStore, ['getLanguageYearLabel', 'programYearList']),
    ...mapState(useApplicationStore, [
      'applicationMap',
      'applicationUploadedDocuments',
      'applicationStatus',
      'applicationTemplateVersion',
      'formattedProgramYear',
      'isApplicationProcessing',
      'isRenewal',
      'renewalFundingAgreementId',
      'programYearId',
      'showApplicationTemplateV1',
      'unlockBaseFunding',
      'unlockRenewal',
      'unlockDeclaration',
      'unlockClosures',
      'unlockEcewe',
      'unlockLicenseUpload',
      'unlockSupportingDocuments',
    ]),
    ...mapState(useAuthStore, ['isMinistryUser', 'userInfo']),
    ...mapState(useCcfriAppStore, ['approvableFeeSchedules']),
    ...mapState(useNavBarStore, ['changeRequestId', 'isChangeRequest', 'navBarList', 'previousPath']),
    ...mapState(useReportChangesStore, ['hasActiveChangeRequest', 'isChangeNotificationFormComplete']),
    ...mapState(useSummaryDeclarationStore, ['declarationModel', 'facilities', 'summaryModel']),
    languageYearLabel() {
      return this.getLanguageYearLabel;
    },
    getFundingAgreementNumber() {
      return this.applicationMap?.get(this.programYearId)?.fundingAgreementNumber;
    },
    isReadOnly() {
      if (this.isMinistryUser) {
        return true;
      }
      if (!this.hasPermission([this.PERMISSIONS.SUBMIT_NEW_APPLICATION, this.PERMISSIONS.SUBMIT_RENEWAL_PCF])) {
        return true;
      }
      if (
        (this.model.externalStatus === 'INCOMPLETE' || this.model.externalStatus === 'ACTION_REQUIRED') &&
        !this.allFacilitiesApproved
      ) {
        //allow users to submit their Dec A Change Request form without having to manually unlock
        return false;
      } else if (
        (!this.isChangeRequest && this.unlockDeclaration) ||
        (this.isChangeRequest && this.model.unlockDeclaration)
      ) {
        //ministry unlocks declaration for PCF or Change Request New Facility
        return false;
      } else if (
        this.isChangeRequest &&
        !(this.model.externalStatus == 'INCOMPLETE' || this.model.externalStatus == 'ACTION_REQUIRED')
      ) {
        //ensure summary dec is locked for completed CR when viewing a historical record.
        return true;
      } else if (this.applicationStatus === 'SUBMITTED') {
        //ensure summary dec is locked for completed CR when viewing a historical record.
        return true;
      }
      return false;
    },
    showDeclarationV2() {
      return !this.isReadOnly || this.declarationModel?.declarationVersion === DECLARATION_TEXT_VERSIONS.V2;
    },
    isSomeApplicationUnlocked() {
      const applicationList = Array.from(this.applicationMap?.values());
      return isAnyApplicationUnlocked(applicationList);
    },
    allFacilitiesApproved() {
      return this.facilities?.every((facility) => {
        return facility.facilityInfo.facilityAccountNumber;
      });
    },
    hasChangeNotificationFormDocuments() {
      return this.summaryModel?.changeRequestTypes?.includes(CHANGE_REQUEST_TYPES.PDF_CHANGE);
    },
    submissionTimestamp() {
      return formatSubmissionTimestamp(this.declarationModel?.latestSubmissionDate);
    },
    mappedFacilities() {
      return this.facilities?.map((facility) => facility.facilitySummary);
    },
    sortedFacilitiesToDisplay() {
      return this.mappedFacilities
        ?.filter((facility) => facility.facilityName?.includes(this.facilityFilter ?? ''))
        .sort((a, b) => {
          if (a.isComplete === b.isComplete) {
            const nameA = a.facilityName?.toLowerCase() ?? '';
            const nameB = b.facilityName?.toLowerCase() ?? '';
            return nameA.localeCompare(nameB);
          }
          return a.isComplete ? 1 : -1;
        });
    },
    isGroup() {
      return this.summaryModel?.application?.organizationProviderType === ORGANIZATION_PROVIDER_TYPES.GROUP;
    },
    areAllFacilitiesComplete() {
      return this.mappedFacilities?.every((facility) => facility.isComplete);
    },
    isApplicationFormComplete() {
      const isECEWEOrganizationComplete = ApplicationService.isECEWEOrganizationComplete(
        this.summaryModel?.ecewe,
        this.isGroup,
        this.languageYearLabel,
        this.applicationTemplateVersion,
      );
      if (this.isChangeRequest) {
        const isChangeNotificationFormComplete =
          !this.hasChangeNotificationFormDocuments || this.isChangeNotificationFormComplete;
        return this.areAllFacilitiesComplete && isECEWEOrganizationComplete && isChangeNotificationFormComplete;
      }
      const isOrganizationComplete =
        !this.showOrganizationSummary ||
        ApplicationService.isOrganizationComplete(this.summaryModel?.organization, this.applicationTemplateVersion);
      const isCCOFBaseFundingComplete =
        !this.showCCOFBaseFundingSummary ||
        (ApplicationService.isBankingInformationComplete(this.summaryModel?.application) &&
          ApplicationService.isFundingAgreementComplete(this.summaryModel?.application));
      return (
        isOrganizationComplete &&
        isCCOFBaseFundingComplete &&
        isECEWEOrganizationComplete &&
        this.areAllFacilitiesComplete
      );
    },
    isSubmitDisabled() {
      return (
        this.isReadOnly ||
        (!this.isChangeRequest && this.hasActiveChangeRequest) ||
        !this.model.agreeConsentCertify ||
        !this.model.orgContactName ||
        !this.isApplicationFormComplete
      );
    },
    showCCOFBaseFundingSummary() {
      return !this.showApplicationTemplateV1 && this.isRenewal && !this.isChangeRequest;
    },
    showOrganizationSummary() {
      return !this.isRenewal && !this.isChangeRequest;
    },
  },
  async created() {
    this.PATHS = PATHS;
    await this.loadData();
  },
  methods: {
    ...mapActions(useApplicationStore, ['setIsApplicationProcessing', 'setRenewalFundingAgreementId']),
    ...mapActions(useReportChangesStore, ['getChangeRequestList']),
    ...mapActions(useSummaryDeclarationStore, [
      'loadChangeRequestSummaryDeclaration',
      'loadDeclaration',
      'loadSummary',
      'setDeclarationModel',
      'updateDeclaration',
    ]),
    openFacilitySummary(facilityId) {
      this.selectedFacilityId = facilityId;
      this.toggleFacilityInformationSummaryDialog();
    },
    toggleFacilityInformationSummaryDialog() {
      this.showFacilityInformationSummaryDialog = !this.showFacilityInformationSummaryDialog;
    },
    goToChangeRequestHistory() {
      this.$router.push(PATHS.ROOT.CHANGE_LANDING + '#change-request-history');
    },
    goToDashboard() {
      this.$router.push(PATHS.ROOT.HOME);
    },
    async loadData() {
      try {
        this.setIsApplicationProcessing(true);

        await Promise.all([this.getChangeRequestList(), this.loadSummary()]);
        await this.loadRenewalFundingAgreementId();

        if (this.isChangeRequest) {
          await this.loadChangeRequestSummaryDeclaration(this.$route.params?.changeRecGuid);
        } else {
          await this.loadDeclaration();
        }

        if (!isEmpty(this.declarationModel)) {
          this.model = cloneDeep(this.declarationModel);
        }
      } catch (error) {
        console.error('Error loading application Summary Declaration.', error);
        this.setFailureAlert('Error loading application Summary Declaration.');
      } finally {
        this.setIsApplicationProcessing(false);
      }
    },
    async submit() {
      try {
        if (this.isSubmitDisabled) return;
        this.setIsApplicationProcessing(true);
        this.model.declarationBStatus = this.isRenewal ? 1 : undefined; //currently CMS is using this value for Full Approval Automation Calculations/flows
        this.setDeclarationModel(this.model);
        if (this.isChangeRequest) {
          await this.updateDeclaration({ changeRequestId: this.$route.params?.changeRecGuid, reLockPayload: [] });
        } else {
          await this.updateRenewalFundingAgreementBeforeSubmit();
          await this.updateAfsSupportingDocuments();
          await this.updateDeclaration({ changeRequestId: undefined, reLockPayload: this.createRelockPayload() });
        }
        this.showSubmissionConfirmationDialog = true;
      } catch (error) {
        this.setFailureAlert('An error occurred while SUBMITTING application. Please try again later.' + error);
      } finally {
        this.setIsApplicationProcessing(false);
      }
    },
    createRelockPayload() {
      let applicationRelockPayload = this.createRelockPayloadForApplication();
      let ccrfiRelockPayload = this.createRelockPayloadForCCFRI();
      if (Object.keys(ccrfiRelockPayload).length > 0) {
        applicationRelockPayload['facilities'] = ccrfiRelockPayload;
      }
      return applicationRelockPayload;
    },
    createRelockPayloadForApplication() {
      let applicationRelockPayload = {
        unlockBaseFunding: this.unlockBaseFunding,
        unlockRenewal: this.unlockRenewal,
        unlockDeclaration: this.unlockDeclaration,
        unlockEcewe: this.unlockEcewe,
        unlockLicenseUpload: this.unlockLicenseUpload,
        unlockSupportingDocuments: this.unlockSupportingDocuments,
      };
      // Create payload with only unlock propteries set to 1.
      applicationRelockPayload = Object.fromEntries(
        Object.entries(applicationRelockPayload).filter(([_, v]) => v == 1),
      );
      // Update payload unlock properties from 1 to 0.
      Object.keys(applicationRelockPayload).forEach((key) => {
        applicationRelockPayload[key] = '0';
      });
      return applicationRelockPayload;
    },
    createRelockPayloadForCCFRI() {
      let ccrfiRelockPayload = new Array(0);
      for (const facility of this.navBarList) {
        let applicationIdPayload = { ccfriApplicationId: facility.ccfriApplicationId };
        let unlockPayload = {
          unlockCcfri: facility.unlockCcfri,
          unlockClosures: facility.unlockClosures,
          unlockNmf: facility.unlockNmf,
          unlockRfi: facility.unlockRfi,
          unlockAfs: facility.unlockAfs,
        };
        // Create payload with only unlock propteries set to 1.
        unlockPayload = Object.fromEntries(Object.entries(unlockPayload).filter(([_, v]) => v == 1));
        // Update payload unlock properties from 1 to 0.
        Object.keys(unlockPayload).forEach((key) => {
          unlockPayload[key] = '0';
        });

        const afs = this.approvableFeeSchedules?.find(
          (item) => item.ccfriApplicationId === facility.ccfriApplicationId,
        );
        if (afs?.afsStatus === AFS_STATUSES.UPLOAD_DOCUMENTS) {
          unlockPayload.enableAfs = '0';
        }

        if (Object.keys(unlockPayload).length > 0) {
          ccrfiRelockPayload.push({ ...applicationIdPayload, ...unlockPayload });
        }
      }
      return ccrfiRelockPayload;
    },
    previous() {
      this.$router.push(this.previousPath);
    },

    // CCFRI-3808 - This function ensures that submitted AFS documents from previous submissions cannot be deleted from the Portal when the Ministry Adjudicators re-enable/re-unlock the AFS section.
    // i.e.: Documents with documentType = APPLICATION_AFS_SUBMITTED are not deletable.
    async updateAfsSupportingDocuments() {
      const afsDocuments = this.applicationUploadedDocuments?.filter(
        (document) => document.documentType === DOCUMENT_TYPES.APPLICATION_AFS,
      );
      await Promise.all(
        afsDocuments?.map(async (document) => {
          const payload = {
            documentType: DOCUMENT_TYPES.APPLICATION_AFS_SUBMITTED,
          };
          await DocumentService.updateDocument(document.annotationId, payload);
        }),
      );
    },
    async updateRenewalFundingAgreementBeforeSubmit() {
      if (!this.isRenewal) return;
      if (!this.renewalFundingAgreementId) {
        throw new Error('Funding Agreement not found');
      }
      const payload = {
        consentCheck: this.model.agreeConsentCertify === 1,
        signedBy: this.model.orgContactName,
        signedOn: new Date().toISOString(),
        externalStatusCode: FUNDING_AGREEMENT_EXTERNAL_STATUSES.DRAFTED_WITH_MINISTRY,
      };
      await FundingAgreementService.updateFundingAgreement(this.renewalFundingAgreementId, payload);
    },
    async loadRenewalFundingAgreementId() {
      if (!this.isRenewal || this.renewalFundingAgreementId) return;

      const response = await FundingAgreementService.getFundingAgreements({
        organizationId: this.summaryModel?.application?.organizationId,
        programYearId: this.programYearId,
        fundingAgreementOrderNumber: 0,
        includePdf: false,
      });

      const fa = response?.[0];
      if (!fa?.fundingAgreementId) {
        console.warn('[SummaryDeclaration] Renewal FA not found during load');
        return;
      }

      this.setRenewalFundingAgreementId(fa.fundingAgreementId);
    },
  },
};
</script>

<style scoped>
:deep(::placeholder) {
  color: #d8292f !important;
  opacity: 1 !important;
}
</style>
