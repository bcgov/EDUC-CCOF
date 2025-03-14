<template>
  <v-row no-gutters class="d-flex flex-column">
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
        <div v-if="!isValidForm" class="mt-6">
          <router-link :to="pcfLink">
            <u class="text-error">To add this information, click here. This will bring you to a different page.</u>
          </router-link>
        </div>
      </v-expansion-panel-text>
    </v-form>
  </v-row>
</template>
<script>
import { mapState } from 'pinia';
import SummaryExpansionPanelTitle from '@/components/guiComponents/SummaryExpansionPanelTitle.vue';
import { useSummaryDeclarationStore } from '@/store/summaryDeclaration.js';
import { useNavBarStore } from '@/store/navBar.js';
import { DOCUMENT_TYPES, PATHS, pcfUrl, changeUrl } from '@/utils/constants.js';
import rules from '@/utils/rules.js';

export default {
  name: 'UploadedDocumentsSummary',
  components: { SummaryExpansionPanelTitle },
  props: {
    documents: {
      type: Array,
      default: () => [],
    },
    programYearId: {
      type: String,
      required: false,
      default: '',
    },
  },
  emits: ['isSummaryValid'],
  data() {
    return {
      rules,
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
      formObj: {
        formName: 'DocumentSummary',
      },
    };
  },
  computed: {
    ...mapState(useSummaryDeclarationStore, ['isLoadingComplete']),
    ...mapState(useNavBarStore, ['isChangeRequest']),
    supportingDocuments() {
      return this.documents?.filter((doc) => doc.documentType === DOCUMENT_TYPES.APPLICATION_SUPPORTING);
    },
    licenceDocumentFileName() {
      return this.documents?.find((doc) => doc.documentType === DOCUMENT_TYPES.APPLICATION_LICENCE)?.fileName;
    },
    pcfLink() {
      return this.isChangeRequest
        ? changeUrl(PATHS.LICENSE_UPLOAD, this.$route.params?.changeRecGuid)
        : pcfUrl(PATHS.LICENSE_UPLOAD, this.programYearId);
    },
  },
  watch: {
    isValidForm: {
      handler() {
        this.$refs.documentSummaryForm.validate();
        if (this.isLoadingComplete && this.isValidForm !== null) {
          this.$emit('isSummaryValid', this.formObj, this.isValidForm);
        }
      },
    },
  },
};
</script>

<style scoped>
.summary-label {
  color: grey;
  font-size: small;
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
