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
          <router-link v-if="!isValidForm" :to="getLink()">
            <u class="error-message">To add this information, click here. This will bring you to a different page.</u>
          </router-link>
        </div>
      </v-expansion-panel-text>
    </v-form>
  </v-row>
</template>
<script>
import { isEmpty } from 'lodash';
import { mapState } from 'pinia';

import AfsDecisionCard from '@/components/ccfriApplication/AFS/AfsDecisionCard.vue';
import ApprovableParentFeesCards from '@/components/ccfriApplication/AFS/ApprovableParentFeesCards.vue';
import AppDocumentUpload from '@/components/util/AppDocumentUpload.vue';
import { useApplicationStore } from '@/store/application.js';
import { useCcfriAppStore } from '@/store/ccfriApp.js';
import { useSummaryDeclarationStore } from '@/store/summaryDeclaration';
import { AFS_STATUSES, DOCUMENT_TYPES, PATHS, pcfUrlGuid } from '@/utils/constants.js';

export default {
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
    };
  },
  computed: {
    ...mapState(useApplicationStore, ['applicationUploadedDocuments']),
    ...mapState(useCcfriAppStore, ['approvableFeeSchedules']),
    ...mapState(useSummaryDeclarationStore, ['isLoadingComplete']),
    filteredUploadedDocuments() {
      return this.applicationUploadedDocuments?.filter(
        (document) =>
          document.documentType === DOCUMENT_TYPES.APPLICATION_AFS && document.facilityId === this.facilityId,
      );
    },
    isValidForm() {
      return (
        [AFS_STATUSES.ACCEPT, AFS_STATUSES.DECLINE].includes(this.afs?.afsStatus) ||
        (this.afs?.afsStatus === AFS_STATUSES.UPLOAD_DOCUMENTS && !isEmpty(this.filteredUploadedDocuments))
      );
    },
  },
  watch: {
    isLoadingComplete: {
      handler: function (val) {
        if (val) {
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
  created() {
    this.AFS_STATUSES = AFS_STATUSES;
    this.DOCUMENT_TYPES = DOCUMENT_TYPES;
    this.PATHS = PATHS;
    this.reloadAfs();
  },
  methods: {
    isEmpty,
    reloadAfs() {
      this.afs = this.approvableFeeSchedules?.find((item) => item.ccfriApplicationId === this.ccfriId);
    },
    getLink() {
      return pcfUrlGuid(PATHS.CCFRI_AFS, this.programYearId, this.ccfriId);
    },
  },
};
</script>
<style scoped>
.summary-label {
  color: grey;
  font-size: small;
}

:deep(::placeholder) {
  color: red !important;
  opacity: 1 !important;
}

.summary-value {
  font-size: medium;
  color: black;
}

.summary-label-smaller {
  color: grey;
  font-size: x-small;
}

.summary-label-bold {
  color: black;
  font-size: small;
  font-style: initial;
}
.summary-value-small {
  color: black;
  font-size: small;
  font-weight: bold;
}

.error-message {
  color: #ff5252;
}
</style>
