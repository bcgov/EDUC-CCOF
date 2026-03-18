<template>
  <v-container fluid>
    <div class="mx-4 mx-lg-12 mb-12">
      <div class="text-center mb-8">
        <p class="text-h5">Child Care Operating Funding Program{{ pageTitle }}</p>
        <h2>Summary and Declaration</h2>
        <p class="text-primary text-h5">
          {{ userInfo.organizationName }}
        </p>
      </div>

      <v-card v-if="!isSummaryComplete && !isProcessing" class="my-8" elevation="4">
        <v-card-title class="rounded-t-lg py-3 px-8 noticeAlert">
          <v-icon size="x-large" class="py-1 px-3 noticeAlertIcon"> mdi-alert-octagon </v-icon>
          Incomplete Form
        </v-card-title>
        <div class="pa-4">
          <p>You will not be able to submit your application until it is complete.</p>
          <p>Incomplete sections are marked with a red exclamation point.</p>
        </div>
      </v-card>

      <v-card v-if="isSomeApplicationUnlocked" class="my-8" elevation="4">
        <v-card-title class="rounded-t-lg py-3 px-8 noticeAlert">
          <v-icon size="x-large" class="py-1 px-3 noticeAlertIcon"> mdi-alert-octagon </v-icon>
          You have an unlocked PCF application still in progress.
        </v-card-title>
        <p class="pa-4">
          You will be unable to submit a change request until the Program Confirmation Form is updated.
        </p>
      </v-card>

      <v-card class="rounded-lg" elevation="4">
        <v-card-title class="rounded-t-lg py-3 card-title"> Summary </v-card-title>
        <v-skeleton-loader
          v-if="isProcessing"
          :loading="isProcessing"
          type="paragraph, text@3, paragraph, text@3, paragraph, paragraph, text@2, paragraph"
        />
        <div v-else class="px-4 pb-4">
          <v-expansion-panels focusable multiple variant="accordion" class="mt-6 rounded">
            <!-- Change Notification Form Summary -->
            <v-expansion-panel
              v-if="hasChangeRequestType('PDF_CHANGE')"
              variant="accordion"
              class="mb-8"
              value="change-notification-form-summary"
            >
              <ChangeNotificationFormSummary
                :is-processing="isProcessing"
                :change-notification-form-documents="summaryModel?.changeNotificationFormDocuments"
              />
            </v-expansion-panel>

            <!-- MTFI Summary -->
            <v-row v-if="hasChangeRequestType('MTFI')" no-gutters class="d-flex flex-column mb-2 mt-10">
              <div v-for="facility in facilities" :key="facility?.facilityId" class="mt-0 py-0">
                <v-expansion-panel
                  v-if="facility"
                  :key="`${facility.facilityId}-facility-information`"
                  value="facility-name"
                  variant="accordion"
                >
                  <v-row no-gutters class="d-flex pl-6 py-5 rounded-t-lg facility-info">
                    <v-col class="col-6 col-lg-4">
                      <p class="summary-label">Facility Name</p>
                      <p class="summary-value">
                        {{ facility.facilityName ? facility.facilityName : EMPTY_PLACEHOLDER }}
                      </p>
                    </v-col>
                    <v-col class="col-6 col-lg-3">
                      <p class="summary-label">Facility ID</p>
                      <p class="summary-value">
                        {{ facility.facilityAccountNumber ? facility.facilityAccountNumber : EMPTY_PLACEHOLDER }}
                      </p>
                    </v-col>
                    <v-col class="col-6 col-lg-3">
                      <p class="summary-label">Licence Number</p>
                      <p class="summary-value">
                        {{ facility.licenseNumber ? facility.licenseNumber : EMPTY_PLACEHOLDER }}
                      </p>
                    </v-col>
                  </v-row>
                </v-expansion-panel>
                <v-expansion-panel
                  :key="`${facility.facilityId}-mtfi-summary`"
                  :value="`${facility.facilityId}-mtfi-summary`"
                  variant="accordion"
                >
                  <MTFISummary :old-ccfri="facility?.oldCcfri" :new-ccfri="facility?.newCcfri" />
                </v-expansion-panel>
                <v-expansion-panel
                  v-if="facility?.hasRfi"
                  :key="`${facility.facilityId}-ccfri-summary`"
                  :value="`${facility.facilityId}-ccfri-summary`"
                  variant="accordion"
                >
                  <RFISummary
                    :rfi-app="facility?.rfiApp"
                    :ccfri-id="facility?.ccfriApplicationId"
                    :facility-id="facility.facilityId"
                  />
                </v-expansion-panel>
                <v-expansion-panel
                  v-if="facility?.enableAfs"
                  :key="`${facility.facilityId}-afs-summary`"
                  :value="`${facility.facilityId}-afs-summary`"
                  variant="accordion"
                >
                  <AFSSummary
                    :ccfri-id="facility?.newCcfri?.ccfriApplicationId"
                    :facility-id="facility?.facilityId"
                    :program-year-id="summaryModel?.application?.programYearId"
                  />
                </v-expansion-panel>
              </div>
            </v-row>
          </v-expansion-panels>
        </div>
      </v-card>

      <!---Declaration Start--->

      <v-card class="mt-12 rounded-lg" elevation="4">
        <v-card-title class="rounded-t-lg py-3 card-title"> Declaration </v-card-title>
        <v-skeleton-loader
          v-if="isProcessing"
          :loading="isProcessing"
          type="paragraph, text@3, paragraph, text@3, paragraph, paragraph, text@2, paragraph"
        />
        <div v-else class="px-8 py-4">
          <div class="mb-4">
            <ChangeRequestDeclarationTextV2 v-if="showDeclarationV2" />
            <ChangeRequestDeclarationTextV1 v-else :enabled-declaration-b="model.enabledDeclarationB" />
          </div>
          <div>
            <v-checkbox
              v-if="!isRenewal"
              v-model="model.agreeConsentCertify"
              class="pt-0"
              :disabled="isReadOnly"
              :value="1"
              label="I, the applicant, do hereby certify that all the information provided is true and complete to the best of my knowledge and belief. By clicking this check-box, I indicate that I agree to the foregoing terms and conditions."
            />
            <v-checkbox
              v-else
              v-model="model.agreeConsentCertify"
              class="pt-0"
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
            Last submitted on: {{ submissionTimestamp }}
          </div>
        </div>
      </v-card>
    </div>

    <NavButton
      :is-submit-displayed="true"
      class="mt-10"
      :is-submit-disabled="!isPageComplete || isReadOnly || isSomeApplicationUnlocked"
      :is-processing="isProcessing"
      @previous="previous"
      @submit="submit"
    />
    <AppDialog
      v-model="dialog"
      persistent
      max-width="525px"
      title="Submission Complete"
      :loading="false"
      @close="goToDashboard"
    >
      <template #content>
        <p class="pt-4">
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
import { mapActions, mapState } from 'pinia';
import { useApplicationStore } from '@/store/application.js';
import { useAuthStore } from '@/store/auth.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useReportChangesStore } from '@/store/reportChanges.js';
import { useSummaryDeclarationStore } from '@/store/summaryDeclaration.js';
import { useSupportingDocumentUploadStore } from '@/store/supportingDocumentUpload.js';
import { useCcfriAppStore } from '@/store/ccfriApp.js';

import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';
import {
  EMPTY_PLACEHOLDER,
  PATHS,
  CHANGE_REQUEST_TYPES,
  CHANGE_TYPES,
  changeUrlGuid,
  DECLARATION_TEXT_VERSIONS,
  DOCUMENT_TYPES,
  AFS_STATUSES,
} from '@/utils/constants.js';
import alertMixin from '@/mixins/alertMixin.js';
import NavButton from '@/components/util/NavButton.vue';
import MTFISummary from '@/components/summary/changeRequest/MTFISummary.vue';
import RFISummary from '@/components/summary/group/RFISummary.vue';
import AFSSummary from '@/components/summary/group/AFSSummary.vue';
import ChangeRequestDeclarationTextV1 from '@/components/requestChanges/changeRequestDeclarationTextVersions/ChangeRequestDeclarationTextV1.vue';
import ChangeRequestDeclarationTextV2 from '@/components/requestChanges/changeRequestDeclarationTextVersions/ChangeRequestDeclarationTextV2.vue';
import ChangeNotificationFormSummary from '@/components/summary/changeRequest/ChangeNotificationFormSummary.vue';
import { deepCloneObject, isAnyApplicationUnlocked } from '@/utils/common.js';
import ChangeRequestService from '@/services/changeRequestService';
import DocumentService from '@/services/documentService';
import { formatSubmissionTimestamp } from '@/utils/format';

export default {
  components: {
    AFSSummary,
    AppDialog,
    AppButton,
    ChangeNotificationFormSummary,
    ChangeRequestDeclarationTextV1,
    ChangeRequestDeclarationTextV2,
    MTFISummary,
    NavButton,
    RFISummary,
  },
  mixins: [alertMixin],
  data() {
    return {
      isProcessing: false,
      dialog: false,
      model: {},
    };
  },
  computed: {
    ...mapState(useApplicationStore, ['isRenewal', 'applicationMap']),
    ...mapState(useAuthStore, ['userInfo', 'isMinistryUser']),
    ...mapState(useNavBarStore, ['changeType', 'previousPath']),
    ...mapState(useReportChangesStore, ['getChangeNotificationActionId', 'isChangeNotificationFormComplete']),
    ...mapState(useSupportingDocumentUploadStore, ['uploadedDocuments']),
    ...mapState(useCcfriAppStore, ['approvableFeeSchedules']),
    ...mapState(useSummaryDeclarationStore, ['summaryModel', 'declarationModel']),
    isReadOnly() {
      if (this.isMinistryUser || this.isProcessing) {
        return true;
      } else if (this.model?.unlockDeclaration) {
        return false;
      } else if (this.model?.externalStatus != 'INCOMPLETE') {
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
    isSummaryComplete() {
      if (this.hasChangeRequestType('MTFI')) {
        return ChangeRequestService.isMTFIComplete(this.summaryModel?.mtfiFacilities);
      }
      if (this.changeType === CHANGE_TYPES.CHANGE_NOTIFICATION) return this.isChangeNotificationFormComplete;
      return false;
    },
    facilities() {
      return this.summaryModel?.mtfiFacilities;
    },
    pageTitle() {
      const changeRequestTypes = this.summaryModel?.changeRequestTypes;
      return changeRequestTypes?.length === 1 && changeRequestTypes?.includes(CHANGE_REQUEST_TYPES.PARENT_FEE_CHANGE)
        ? ' - Request a Parent Fee Increase'
        : '';
    },
    isPageComplete() {
      return this.model.agreeConsentCertify && this.model.orgContactName && this.isSummaryComplete;
    },
    submissionTimestamp() {
      return formatSubmissionTimestamp(this.declarationModel?.latestSubmissionDate);
    },
  },
  async created() {
    this.EMPTY_PLACEHOLDER = EMPTY_PLACEHOLDER;
    this.PATHS = PATHS;
    await this.loadData();
  },
  methods: {
    ...mapActions(useSummaryDeclarationStore, [
      'updateDeclaration',
      'loadChangeRequestSummaryDeclaration',
      'setDeclarationModel',
    ]),
    ...mapActions(useReportChangesStore, ['updateChangeRequestMTFI']),
    ...mapActions(useNavBarStore, ['setNavBarValue']),
    async loadData() {
      try {
        this.isProcessing = true;
        await this.loadChangeRequestSummaryDeclaration(this.$route.params?.changeRecGuid);
        this.model = deepCloneObject(this.declarationModel);
      } catch (error) {
        console.error(error);
        this.setFailureAlert('An error occurred while loading the change request. Please try again later.');
      } finally {
        this.isProcessing = false;
      }
    },

    async submit() {
      this.isProcessing = true;
      try {
        this.setDeclarationModel(this.model);
        await this.updateDeclaration({ changeRequestId: this.$route.params?.changeRecGuid, reLockPayload: [] });

        if (this.facilities?.some((fac) => fac.enableAfs)) {
          await this.lockAFS();
        }
        this.dialog = true;
      } catch (error) {
        this.setFailureAlert('An error occurred while submitting the change request. Please try again later.' + error);
      } finally {
        this.isProcessing = false;
      }
    },
    async lockAFS() {
      await Promise.all(
        this.facilities.map(async (mtfiFac) => {
          if (mtfiFac.enableAfs) {
            const afs = this.approvableFeeSchedules?.find(
              (item) => item.ccfriApplicationId === mtfiFac.ccfriApplicationId,
            );

            const payload = {
              changeRequestMtfiId: mtfiFac.changeRequestMtfiId,
              unlockAfs: false,
              enableAfs: afs?.afsStatus === AFS_STATUSES.ACCEPT,
              afsStatus: afs?.afsStatus,
            };
            this.setNavBarValue({ facilityId: mtfiFac.facilityId, property: 'unlockAfs', value: payload.unlockAfs });
            this.setNavBarValue({ facilityId: mtfiFac.facilityId, property: 'enableAfs', value: payload.enableAfs });
            await this.updateChangeRequestMTFI(payload);
          }
        }),
      );

      const afsDocuments = this.uploadedDocuments?.filter(
        (document) => document.documentType === DOCUMENT_TYPES.APPLICATION_AFS,
      );
      await Promise.all(
        afsDocuments?.map(async (document) => {
          const payload = {
            documentType: DOCUMENT_TYPES.APPLICATION_AFS_SUBMITTED,
          };
          await DocumentService.updateDocument(document.annotationid, payload);
        }),
      );
    },
    previous() {
      this.isProcessing = true;
      if (this.changeType === CHANGE_TYPES.CHANGE_NOTIFICATION) {
        this.$router.push(
          changeUrlGuid(
            PATHS.CHANGE_NOTIFICATION_FORM,
            this.$route.params?.changeRecGuid,
            this.getChangeNotificationActionId,
            CHANGE_TYPES.CHANGE_NOTIFICATION,
          ),
        );
      } else {
        this.$router.push(this.previousPath);
      }
    },
    hasChangeRequestType(changeType) {
      switch (changeType) {
        case 'MTFI':
          return this.summaryModel?.changeRequestTypes?.includes(CHANGE_REQUEST_TYPES.PARENT_FEE_CHANGE);
        case 'PDF_CHANGE':
          return this.summaryModel?.changeRequestTypes?.includes(CHANGE_REQUEST_TYPES.PDF_CHANGE);
        default:
          return false;
      }
    },
    goToDashboard() {
      this.$router.push(PATHS.ROOT.HOME);
    },
  },
};
</script>

<style scoped>
li {
  padding-bottom: 12px;
}

* .card-title {
  color: #003466;
  font-size: 20px;
  font-weight: bold;
  background-color: #e5e4e4;
}

.summary-label {
  color: grey;
  font-size: small;
}

.summary-value {
  font-size: medium;
  color: black;
}

.facility-info {
  border-top: 5px solid grey !important;
}
</style>
