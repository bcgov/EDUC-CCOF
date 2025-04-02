<template>
  <v-form ref="documentSummaryForm" v-model="isValidForm">
    <v-expansion-panel-title>
      <SummaryExpansionPanelTitle title="Uploaded Documents" :is-complete="isValidForm" />
    </v-expansion-panel-title>
    <v-expansion-panel-text eager>
      <v-row no-gutters>
        <v-col cols="12" lg="6">
          <span class="summary-label">Licence:</span>
          <v-text-field
            placeholder="Required"
            class="summary-value"
            :model-value="licenceDocumentFileName"
            density="compact"
            flat
            variant="solo"
            hide-details
            readonly
            :rules="rules.required"
          />
        </v-col>
        <v-col v-if="supportingDocuments?.length > 0" cols="12" lg="6">
          <span class="summary-label">Supporting Documents:</span>
          <v-data-table
            :headers="headers"
            :items="supportingDocuments"
            item-key="annotationId"
            hide-default-footer
            :items-per-page="-1"
          />
        </v-col>
      </v-row>
      <router-link v-if="!isValidForm" :to="pcfLink">
        <u class="text-error">To add this information, click here. This will bring you to a different page.</u>
      </router-link>
    </v-expansion-panel-text>
  </v-form>
</template>
<script>
import { mapState } from 'pinia';
import { useNavBarStore } from '@/store/navBar.js';
import { DOCUMENT_TYPES, PATHS, pcfUrl, changeUrl } from '@/utils/constants.js';
import summaryMixin from '@/mixins/summaryMixin.js';

export default {
  name: 'UploadedDocumentsSummary',
  mixins: [summaryMixin],
  props: {
    facilityId: {
      type: String,
      default: '',
    },
    programYearId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isValidForm: false,
      headers: [
        {
          title: 'Document',
          sortable: false,
          value: 'fileName',
        },
        {
          title: 'Description',
          sortable: false,
          value: 'description',
        },
      ],
    };
  },
  computed: {
    ...mapState(useNavBarStore, ['isChangeRequest']),
    uploadedDocuments() {
      return this.applicationUploadedDocuments?.filter((document) => this.facilityId === document.facilityId);
    },
    supportingDocuments() {
      return this.uploadedDocuments?.filter((doc) => doc.documentType === DOCUMENT_TYPES.APPLICATION_SUPPORTING);
    },
    licenceDocumentFileName() {
      return this.uploadedDocuments?.find((doc) => doc.documentType === DOCUMENT_TYPES.APPLICATION_LICENCE)?.fileName;
    },
    pcfLink() {
      return this.isChangeRequest
        ? changeUrl(PATHS.LICENSE_UPLOAD, this.$route.params?.changeRecGuid)
        : pcfUrl(PATHS.LICENSE_UPLOAD, this.programYearId);
    },
  },
};
</script>

<style scoped>
.table-header {
  background-color: #f2f2f2;
}

:deep(::placeholder) {
  color: #d8292f !important;
  opacity: 1 !important;
}

:deep(.v-field__input) {
  padding-left: 0px;
}
</style>
