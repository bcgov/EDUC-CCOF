<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-form ref="documentSummaryForm" v-model="isValidForm">
    <v-expansion-panel-header>
      <h4 style="color:#003466;">Uploaded Documents
        <v-icon v-if="isValidForm" color="green" large>mdi-check-circle-outline</v-icon>
        <v-icon v-if="!isValidForm" color="#ff5252" large>mdi-alert-circle-outline</v-icon>
        <span v-if="!isValidForm" style="color:#ff5252;">Organization Information has errors please check - Text TBD</span>
      </h4>
    </v-expansion-panel-header>
    <v-expansion-panel-content eager  >
      <v-row no-gutters class="d-flex flex-column">
        <v-row class="d-flex justify-start">
          <v-col cols="6" lg="4" class="pb-0 pt-2">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label pt-3">Licence: </span>
                <v-text-field placeholder="Required" class="summary-value" :value="this.getLicenceDocumentFileName()" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col v-if="supportingDocumentItems?.length>0" cols="6" lg="4" class="pb-0 pt-2">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label pt-3">Supporting Documents:</span>
              </v-col>
              <v-col cols="12" class="d-flex justify-start">
                <v-data-table
                              :headers="headers"
                              :items="this.supportingDocumentItems"
                              item-key="annotationid"
                              hide-default-footer
                              :items-per-page="-1"
                >
                </v-data-table>
              </v-col>
            </v-row>
          </v-col>
          </v-row>
      </v-row>
      <v-row v-if="!isValidForm" class="d-flex justify-start">
        <v-col cols="6" lg="4" class="pb-0 pt-0">
          <v-row  no-gutters class="d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start">
              <a :href="PATHS.group.licenseUpload" > <span style="color:#ff5252; text-underline: black"><u>Click here to fix the issue(s)- Text TBD</u></span></a>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-expansion-panel-content>
    </v-form>
  </v-row>
</template>
<script>
import {PATHS} from '@/utils/constants';
import rules from '@/utils/rules';

export default {
  name: 'UploadedDocumentsSummary',
  props: {

    documents: {
      type: Array,
      default: () => []
    }
  },
  mounted() {
    this.getSupportingDocuments();
    this.$emit('isSummaryValid',this.formObj, this.isValidForm);
  },
  watch: {
    isValidForm: {
      handler: function (val) {
        this.$emit('isSummaryValid', this.formObj, val);
      },
    }
  },
  methods: {
    getLicenceDocumentFileName() {
      return this.documents.find(doc => doc.documentType === 'Facility License').filename;
    },
    getSupportingDocuments() {
      this.supportingDocumentItems = this.documents.filter(doc => doc.documentType !== 'Facility License');
    }
  },
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
      formObj:{
        formName: 'DocumentSummary',
      }
    };
  }


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
  font-weight: bold
}
.table-header {
  background-color: #F2F2F2;
}

>>>::placeholder {
  color: #ff5252!important;
  opacity: 1;
}
</style>
