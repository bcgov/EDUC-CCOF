<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-form ref="afsSummaryForm">
      <v-expansion-panel-title>
        <h4 style="color: #003466">
          Approvable Fee Schedule
          <v-icon v-if="isValidForm" color="green" size="large"> mdi-check-circle-outline </v-icon>
          <v-icon v-if="!isValidForm" color="#ff5252" size="large"> mdi-alert-circle-outline </v-icon>
          <span v-if="!isValidForm" style="color: #ff5252">
            Your form is missing required information. Click here to view
          </span>
        </h4>
      </v-expansion-panel-title>
      <v-expansion-panel-text eager class="ml-2">
        <ApprovableParentFeesCards :loading="isEmpty(afs)" :approvable-fee-schedules="afs?.approvableFeeSchedules" />
        <AfsDecisionCard v-if="!isEmpty(afs)" v-model="afs.afsStatus" :readonly="true" class="mb-4" />
        <template v-if="afs?.afsStatus === AFS_STATUSES.UPLOAD_DOCUMENTS">
          <template v-if="isEmpty(filteredUploadedDocuments)">
            <v-card elevation="2" class="pa-4">
              <h3>Uploaded Documents</h3>
              <div class="error-message mt-4">Required</div>
            </v-card>
          </template>
          <AppDocumentUpload
            v-else
            :loading="false"
            :readonly="true"
            :uploaded-documents="filteredUploadedDocuments"
            :document-type="DOCUMENT_TYPES.APPLICATION_AFS"
          />
        </template>

        <div class="mt-6">
          <router-link v-if="!isValidForm" :to="afsLink">
            <u class="error-message">To add this information, click here. This will bring you to a different page.</u>
          </router-link>
        </div>
      </v-expansion-panel-text>
    </v-form>
  </v-row>
</template>
<script>
import { isEmpty } from 'lodash';
import { mapState, mapActions } from 'pinia';

import AfsDecisionCard from '@/components/ccfriApplication/AFS/AfsDecisionCard.vue';
import ApprovableParentFeesCards from '@/components/ccfriApplication/AFS/ApprovableParentFeesCards.vue';
import AppDocumentUpload from '@/components/util/AppDocumentUpload.vue';
import { useApplicationStore } from '@/store/application.js';
import { useCcfriAppStore } from '@/store/ccfriApp.js';
import { useSummaryDeclarationStore } from '@/store/summaryDeclaration';
import { useSupportingDocumentUploadStore } from '@/store/supportingDocumentUpload.js';
import { useNavBarStore } from '@/store/navBar.js';
import { AFS_STATUSES, DOCUMENT_TYPES, PATHS, pcfUrlGuid, CHANGE_TYPES, changeUrlGuid } from '@/utils/constants.js';

export default {
  //JB TO DO - Add load and verifcations for AFS
  //
  name: 'AFSSummary',
  components: {
    AfsDecisionCard,
    ApprovableParentFeesCards,
    AppDocumentUpload,
  },
  props: {
    ccfriId: {
      type: String,
      default: '',
    },
    facilityId: {
      type: String,
      default: '',
    },
    programYearId: {
      type: String,
      default: '',
    },
  },
  emits: ['isSummaryValid'],
  data() {
    return {
      afs: {},
      formObj: {
        formName: 'AFSSummary',
        formId: this.facilityId,
      },
      processing: false,
      changeRequestDocs: [],
    };
  },
  computed: {
    ...mapState(useApplicationStore, ['applicationUploadedDocuments', 'applicationId']),
    ...mapState(useCcfriAppStore, ['approvableFeeSchedules']),
    ...mapState(useSummaryDeclarationStore, ['isLoadingComplete']),
    ...mapState(useNavBarStore, ['isChangeRequest']),
    ...mapState(useSupportingDocumentUploadStore, ['uploadedDocuments']),

    filteredUploadedDocuments() {
      if (this.isChangeRequest) {
        return this.changeRequestDocs;
      }
      return this.applicationUploadedDocuments?.filter(
        (document) =>
          [DOCUMENT_TYPES.APPLICATION_AFS, DOCUMENT_TYPES.APPLICATION_AFS_SUBMITTED].includes(document.documentType) &&
          document.facilityId === this.facilityId,
      );
    },
    isValidForm() {
      return (
        [AFS_STATUSES.ACCEPT, AFS_STATUSES.DECLINE].includes(this.afs?.afsStatus) ||
        (this.afs?.afsStatus === AFS_STATUSES.UPLOAD_DOCUMENTS && !isEmpty(this.filteredUploadedDocuments))
      );
    },
    afsLink() {
      if (this.isChangeRequest) {
        return changeUrlGuid(PATHS.MTFI_AFS, this.$route.params.changeRecGuid, this.ccfriId, CHANGE_TYPES.MTFI);
      }
      return pcfUrlGuid(PATHS.CCFRI_AFS, this.programYearId, this.ccfriId);
    },
  },
  watch: {
    isLoadingComplete: {
      handler: function (val) {
        if (val && !this.processing) {
          this.$refs.afsSummaryForm?.validate();
          this.$emit('isSummaryValid', this.formObj, this.isValidForm);
        }
      },
    },
    approvableFeeSchedules: {
      handler() {
        this.reloadAfs();
      },
    },
  },
  async created() {
    this.AFS_STATUSES = AFS_STATUSES;
    this.DOCUMENT_TYPES = DOCUMENT_TYPES;
    this.reloadAfs();

    if (this.isChangeRequest) {
      await this.getChangeDocs();
    }
  },
  methods: {
    ...mapActions(useSupportingDocumentUploadStore, ['saveUploadedDocuments', 'getDocuments']),
    isEmpty,
    reloadAfs() {
      this.afs = this.approvableFeeSchedules?.find((item) => item.ccfriApplicationId === this.ccfriId);
    },
    async getChangeDocs() {
      this.processing = true;
      await this.getDocuments(this.applicationId);

      this.changeRequestDocs = this.uploadedDocuments?.filter(
        (document) =>
          [DOCUMENT_TYPES.APPLICATION_AFS, DOCUMENT_TYPES.APPLICATION_AFS_SUBMITTED].includes(document.documentType) &&
          document.ccof_facility === this.facilityId,
      );

      this.changeRequestDocs.forEach((document) => {
        document.fileName = document.filename;
      });
      this.processing = false;
    },
  },
};
</script>
