<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-form ref="documentSummaryForm" v-model="isValidForm">
      <v-expansion-panel-title>
        <h4 style="color: #003466">
          Uploaded Documents
          <v-icon v-if="isValidForm" color="green" size="large"> mdi-check-circle-outline </v-icon>
          <v-icon v-if="!isValidForm" color="#ff5252" size="large"> mdi-alert-circle-outline </v-icon>
          <span v-if="!isValidForm" style="color: #ff5252"
            >Your form is missing required information. Click here to view.</span
          >
        </h4>
      </v-expansion-panel-title>
      <v-expansion-panel-text eager>
        <v-row no-gutters class="d-flex flex-column">
          <v-row class="d-flex justify-start">
            <v-col cols="6" lg="4" class="pb-0 pt-2">
              <v-row no-gutters class="d-flex justify-start">
                <v-col cols="12" class="d-flex justify-start">
                  <span class="summary-label pt-3">Licence: </span>
                  <v-text-field
                    placeholder="Required"
                    class="summary-value"
                    :model-value="getLicenceDocumentFileName()"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    readonly
                    :rules="rules.required"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col v-if="supportingDocumentItems?.length > 0" cols="6" lg="4" class="pb-0 pt-2">
              <v-row no-gutters class="d-flex justify-start">
                <v-col cols="12" class="d-flex justify-start">
                  <span class="summary-label pt-3">Supporting Documents:</span>
                </v-col>
                <v-col cols="12" class="d-flex justify-start">
                  <v-data-table
                    :headers="headers"
                    :items="supportingDocumentItems"
                    item-key="annotationid"
                    hide-default-footer
                    :items-per-page="-1"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-row>
        <v-row v-if="!isValidForm" class="d-flex justify-start">
          <v-col cols="6" lg="4" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <router-link :to="getLink()">
                  <span style="color: #ff5252; text-underline: black"
                    ><u>To add this information, click here. This will bring you to a different page.</u></span
                  >
                </router-link>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-expansion-panel-text>
    </v-form>
  </v-row>
</template>
<script>
import { mapState } from 'pinia';
import { useSummaryDeclarationStore } from '../../../store/summaryDeclaration.js';
import { useNavBarStore } from '../../../store/navBar.js';

import { PATHS, pcfUrl, changeUrl } from '../../../utils/constants.js';
import rules from '../../../utils/rules.js';

export default {
  name: 'UploadedDocumentsSummary',
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
      PATHS,
      rules,
      isValidForm: true,
      legal: null,
      supportingDocumentItems: [],
      headers: [
        {
          text: 'Document',
          align: 'start',
          sortable: false,
          value: 'filename',
        },
        {
          text: 'Description',
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
  },
  watch: {
    isLoadingComplete: {
      handler: function (val) {
        if (val) {
          this.$emit('isSummaryValid', this.formObj, this.isValidForm);
        }
      },
    },
  },
  mounted() {
    this.getSupportingDocuments();
  },
  methods: {
    getLink() {
      if (this.isChangeRequest) {
        return changeUrl(PATHS.LICENSE_UPLOAD, this.$route.params?.changeRecGuid);
      }
      return pcfUrl(PATHS.LICENSE_UPLOAD, this.programYearId);
    },
    getLicenceDocumentFileName() {
      return this.documents.find((doc) => doc.documentType === 'Facility License')?.filename;
    },
    getSupportingDocuments() {
      this.supportingDocumentItems = this.documents.filter((doc) => doc.documentType !== 'Facility License');
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

>>> ::placeholder {
  color: #ff5252 !important;
  opacity: 1;
}
</style>
