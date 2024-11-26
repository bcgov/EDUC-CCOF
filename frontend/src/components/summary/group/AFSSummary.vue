<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-form ref="afsSummaryForm" v-model="isValidForm">
      <v-expansion-panel-title>
        <h4 style="color: #003466">
          Approvable Fee Schedule
          <v-icon v-if="isValidForm" color="green" size="large"> mdi-check-circle-outline </v-icon>
          <v-icon v-if="!isValidForm" color="#ff5252" size="large"> mdi-alert-circle-outline </v-icon>
          <span v-if="!isValidForm" style="color: #ff5252"
            >Your form is missing required information. Click here to view</span
          >
        </h4>
      </v-expansion-panel-title>
      <v-expansion-panel-text eager class="ml-2">
        <span class="summary-label pt-3">
          Did you apply for Ministry funding to create new licensed spaces prior to April 1, 2021 (e.g. New Spaces Fund,
          UBCM Community Child Care Space Creation Program, Start-up Grants, Rapid Renovation Funding)?</span
        >
        <ApprovableFeeSchedule :read-only="true" :facility-id="facilityId" :ccfri-application-id="ccfriId" />
      </v-expansion-panel-text>
    </v-form>
  </v-row>
</template>
<script>
import { mapState } from 'pinia';

import ApprovableFeeSchedule from '@/components/ccfriApplication/AFS/ApprovableFeeSchedule.vue';
import rules from '../../../utils/rules.js';
import { PATHS, pcfUrlGuid } from '../../../utils/constants.js';

export default {
  name: 'AFSSummary',
  components: {
    ApprovableFeeSchedule,
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
      PATHS,
      rules,
      isValidForm: true,
      formObj: {
        formName: 'AFSSummary',
        formId: this.facilityId,
      },
    };
  },
  computed: {
    ...mapState('summaryDeclaration', ['isLoadingComplete']),
  },
  // watch: {
  //   isLoadingComplete: {
  //     handler: function (val) {
  //       if (val) {
  //         this.$emit('isSummaryValid', this.formObj, this.isValidForm);
  //       }
  //     },
  //   },
  // },
  methods: {
    getLink() {
      return pcfUrlGuid(PATHS.CCFRI_NMF, this.programYearId, this.ccfriId);
    },
  },
};
</script>
<style scoped>
.summary-label {
  color: grey;
  font-size: small;
}

>>> ::placeholder {
  color: #ff5252 !important;
  opacity: 1;
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
</style>
