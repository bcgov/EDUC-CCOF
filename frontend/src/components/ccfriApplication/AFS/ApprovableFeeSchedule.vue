<template>
  <v-form ref="form">
    <v-container fluid>
      <v-row justify="space-around">
        <v-card class="mx-12 mb-12 pa-8">
          <template v-if="isChangeRequest">
            <div class="row pt-4 text-center">
              <span class="text-h5">Child Care Operating Funding Program - Request a Parent Fee Increase</span>
            </div>
            <br />
            <div class="row pt-4 text-center">
              <span class="text-h5">Child Care Fee Reduction Initiative (CCFRI)</span>
            </div>
          </template>
          <template v-else>
            <div class="text-center">
              <div class="text-h5">
                Child Care Operating Funding Program - {{ formattedProgramYear }} Program Confirmation Form
              </div>
              <div class="text-h5 my-6"><strong>Approvable Fee Schedule</strong></div>
            </div>
          </template>
          <br />
          <FacilityHeader
            v-if="currentFacility"
            :facility-account-number="currentFacility?.facilityAccountNumber"
            :facility-name="currentFacility?.facilityName"
            :license-number="currentFacility?.licenseNumber"
            class="mb-10"
          />
          <div class="mt-8">
            <div class="mb-4">
              Thank you for working with us while we completed the assessment of your application for the Child Care Fee
              Reduction Initiative (CCFRI). This schedule is to inform you of the approvable parent fees for your
              facility.
            </div>
            <div>
              Based on the information you provided and the policies in the
              <a
                :href="getFundingUrl(programYearId)"
                target="_blank"
                rel="noopener"
                class="ccfri-funding-guideline-link"
              >
                {{ formattedProgramYear }} CCFRI Funding Guidelines
              </a>
              <span>, we can approve the following parent fee schedule:</span>
            </div>
          </div>

          <ApprovableParentFeesCards
            :loading="isEmpty(afs)"
            :approvable-fee-schedules="afs?.approvableFeeSchedules"
            class="my-4"
          />
          <div class="mb-8">
            <div class="mb-4">Next steps:</div>
            <ul class="pl-4">
              <li>
                <strong class="text-decoration-underline">Accept the fee schedule</strong>: By selecting "I accept", you
                confirm that you agree to the approvable fee schedule as indicated above. These fees will replace your
                requested Parent Fees and are the maximum Parent Fees you may charge.
              </li>
              <li>
                <strong class="text-decoration-underline">Upload Supporting Documents</strong>: By selecting "I want to
                upload supporting documents", you confirm that you decline the approvable fee schedule and have new
                information to submit for review. This will require additional processing time for your application.
              </li>
              <li v-if="!isChangeRequest">
                <strong class="text-decoration-underline">Decline the fee schedule</strong>: By selecting "I decline",
                you confirm that you decline the approvable fee schedule and confirm your decision not to participate in
                the Child Care Fee Reduction Initiative (CCFRI). Your facility will remain eligible to receive Child
                Care Operating Funding Base Funding and may re-apply to CCFRI at any time.
              </li>
            </ul>
            <div class="mt-2">
              Please call us at 1-888-338-6622 (Option 2) if you have any questions or require assistance.
            </div>
          </div>
          <v-skeleton-loader :loading="isEmpty(afs)" type="table-tbody">
            <v-container fluid class="pa-0">
              <AfsDecisionCard v-model="afs.afsStatus" :readonly="isReadOnly" />
              <AppDocumentUpload
                v-if="afs?.afsStatus === AFS_STATUSES.UPLOAD_DOCUMENTS"
                :loading="isLoading"
                :readonly="isReadOnly"
                :uploaded-documents="filteredUploadedDocuments"
                :document-type="DOCUMENT_TYPES.APPLICATION_AFS"
                :show-error-message="showErrorMessage && !isSupportingDocumentsUploaded"
                title="Upload Supporting Documents (for example receipts, quotes, invoices and/or budget/finance documents here)."
                class="mt-8"
                @update-documents-to-upload="updateDocumentsToUpload"
                @delete-uploaded-document="updateUploadedDocumentsToDelete"
              />
            </v-container>
          </v-skeleton-loader>
        </v-card>
      </v-row>
      <NavButton
        :is-next-displayed="true"
        :is-save-displayed="true"
        :is-save-disabled="isReadOnly"
        :is-next-disabled="!isFormComplete"
        :is-processing="isLoading"
        @previous="back"
        @next="next"
        @validate-form="validateForm"
        @save="save(true)"
      />
    </v-container>
  </v-form>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { isEmpty, cloneDeep } from 'lodash';

import AfsDecisionCard from '@/components/ccfriApplication/AFS/AfsDecisionCard.vue';
import ApprovableParentFeesCards from '@/components/ccfriApplication/AFS/ApprovableParentFeesCards.vue';
import FacilityHeader from '@/components/guiComponents/FacilityHeader.vue';
import AppDocumentUpload from '@/components/util/AppDocumentUpload.vue';
import NavButton from '@/components/util/NavButton.vue';

import alertMixin from '@/mixins/alertMixin.js';
import DocumentService from '@/services/documentService';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useCcfriAppStore } from '@/store/ccfriApp.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useSupportingDocumentUploadStore } from '@/store/supportingDocumentUpload.js';

import { AFS_STATUSES, DOCUMENT_TYPES } from '@/utils/constants.js';
import rules from '@/utils/rules.js';

export default {
  name: 'ApprovableFeeSchedule',
  components: { AppDocumentUpload, AfsDecisionCard, ApprovableParentFeesCards, FacilityHeader, NavButton },
  mixins: [alertMixin],
  async beforeRouteLeave(_to, _from, next) {
    await this.save(false);
    next();
  },
  data() {
    return {
      afs: {},
      documentsToUpload: [],
      uploadedDocumentsToDelete: [],
      processing: false,
      showErrorMessage: false,
      changeRequestDocs: [],
    };
  },
  computed: {
    ...mapState(useAppStore, ['getFundingUrl']),
    ...mapState(useSupportingDocumentUploadStore, ['uploadedDocuments']),
    ...mapState(useApplicationStore, [
      'applicationId',
      'formattedProgramYear',
      'isApplicationSubmitted',
      'programYearId',
      'applicationUploadedDocuments',
    ]),
    ...mapState(useCcfriAppStore, ['approvableFeeSchedules']),
    ...mapState(useNavBarStore, ['navBarList', 'nextPath', 'previousPath', 'isChangeRequest']),
    currentFacility() {
      return this.navBarList?.find((el) => el.ccfriApplicationId === this.$route.params.urlGuid);
    },
    filteredUploadedDocuments() {
      //console.log(this.applicationUploadedDocuments);
      if (this.isChangeRequest) {
        return this.changeRequestDocs;
      }
      return this.applicationUploadedDocuments?.filter(
        (document) =>
          [DOCUMENT_TYPES.APPLICATION_AFS, DOCUMENT_TYPES.APPLICATION_AFS_SUBMITTED].includes(document.documentType) &&
          document.facilityId === this.currentFacility?.facilityId,
      );
    },
    isLoading() {
      return isEmpty(this.afs) || this.processing;
    },
    isReadOnly() {
      if (!this.isChangeRequest) {
        return this.isLoading || (this.isApplicationSubmitted && !this.currentFacility?.unlockAfs);
      }
      return this.isLoading || !this.currentFacility?.unlockAfs;
    },
    isSupportingDocumentsUploaded() {
      return this.filteredUploadedDocuments?.length + this.documentsToUpload?.length > 0;
    },
    isFormComplete() {
      return (
        [AFS_STATUSES.ACCEPT, AFS_STATUSES.DECLINE].includes(this.afs?.afsStatus) ||
        (this.afs?.afsStatus === AFS_STATUSES.UPLOAD_DOCUMENTS && this.isSupportingDocumentsUploaded)
      );
    },
  },
  watch: {
    approvableFeeSchedules: {
      handler() {
        this.reloadAfs();
      },
    },
    '$route.params.urlGuid': {
      handler() {
        this.reloadAfs();
        this.$refs.form?.validate();
      },
    },
  },
  async created() {
    this.rules = rules;
    this.AFS_STATUSES = AFS_STATUSES;
    this.DOCUMENT_TYPES = DOCUMENT_TYPES;
    this.reloadAfs();

    if (this.isChangeRequest) {
      await this.getChangeDocs();
    }
  },
  methods: {
    ...mapActions(useApplicationStore, ['getApplicationUploadedDocuments']),
    ...mapActions(useCcfriAppStore, ['updateApplicationCCFRI']),
    ...mapActions(useNavBarStore, ['setNavBarAfsComplete', 'refreshNavBarList']),
    //...mapActions(useReportChangesStore, ['loadChangeRequestDocs']),
    ...mapActions(useSupportingDocumentUploadStore, ['saveUploadedDocuments', 'getDocuments']),
    isEmpty,

    async getChangeDocs() {
      this.processing = true;
      await this.getDocuments(this.applicationId);

      this.changeRequestDocs = this.uploadedDocuments?.filter(
        (document) =>
          [DOCUMENT_TYPES.APPLICATION_AFS, DOCUMENT_TYPES.APPLICATION_AFS_SUBMITTED].includes(document.documentType) &&
          document.ccof_facility === this.currentFacility?.facilityId,
      );

      this.changeRequestDocs.forEach((document) => {
        document.fileName = document.filename;
        document.annotationId = document.annotationid;
      });
      this.processing = false;
    },
    reloadAfs() {
      this.afs = this.approvableFeeSchedules?.find((item) => item.ccfriApplicationId === this.$route.params.urlGuid);
    },
    next() {
      this.$router.push(this.nextPath);
    },
    validateForm() {
      this.$refs.form?.validate();
      this.showErrorMessage = true;
    },
    back() {
      this.$router.push(this.previousPath);
    },
    async save(showMessage) {
      try {
        if (this.isReadOnly) return;
        this.processing = true;
        const payload = {
          afsStatus: this.afs?.afsStatus,
        };
        await Promise.all([
          this.updateApplicationCCFRI(this.$route.params.urlGuid, payload),
          this.processDocumentsToUpload(),
          DocumentService.deleteDocuments(this.uploadedDocumentsToDelete),
        ]);

        if (this.isChangeRequest) {
          await this.getChangeDocs();
        } else {
          await this.getApplicationUploadedDocuments();
        }

        this.setNavBarAfsComplete({ ccfriId: this.$route.params.urlGuid, complete: this.isFormComplete });
        if (showMessage) {
          this.setSuccessAlert('Changes Successfully Saved');
        }
      } catch (error) {
        console.log(error);
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      } finally {
        this.processing = false;
      }
    },
    updateDocumentsToUpload(updatedDocuments) {
      this.documentsToUpload = updatedDocuments;
    },
    async processDocumentsToUpload() {
      const payload = cloneDeep(this.documentsToUpload);
      if (this.isChangeRequest) {
        payload.forEach((document) => {
          document.ccof_applicationid = this.applicationId;
          document.ccof_facility = this.currentFacility?.facilityId;
          document.documentType = DOCUMENT_TYPES.APPLICATION_AFS;
          document.subject = DOCUMENT_TYPES.APPLICATION_AFS;
          document.notetext = document.description;
          delete document.file;
        });

        await this.saveUploadedDocuments(payload);
      } else {
        payload.forEach((document) => {
          document.ccof_applicationid = this.applicationId;
          document.ccof_facility = this.currentFacility?.facilityId;
          delete document.file;
        });
        await DocumentService.createApplicationDocuments(payload);
      }
    },
    updateUploadedDocumentsToDelete(annotationId) {
      if (this.isChangeRequest) {
        console.log(annotationId, 'from params');
        const index = this.changeRequestDocs?.findIndex((item) => item.annotationid === annotationId);
        console.log('indexx');
        console.log(index);
        console.log(annotationId);
        if (index > -1) {
          this.changeRequestDocs?.splice(index, 1);
        }
        this.uploadedDocumentsToDelete?.push(annotationId);
        return;
      }

      const index = this.applicationUploadedDocuments?.findIndex((item) => item.annotationId === annotationId);
      if (index > -1) {
        this.applicationUploadedDocuments?.splice(index, 1);
      }
      this.uploadedDocumentsToDelete?.push(annotationId);
    },
  },
};
</script>
<style scoped>
.ccfri-funding-guideline-link {
  display: inline-block;
  text-decoration: underline;
}

:deep(.v-label) {
  opacity: 1;
}
</style>
