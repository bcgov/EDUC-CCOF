<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-form ref="eceweSummaryForm" v-model="isValidForm">
    <v-expansion-panel-header>
      <h4 style="color:#003466;">Early Childhood Educator-Wage Enhancement (ECE-WE)
        <v-icon v-if="isValidForm" color="green" large>mdi-check-circle-outline</v-icon>
        <v-icon v-if="!isValidForm" color="#ff5252" large>mdi-alert-circle-outline</v-icon>
        <span v-if="!isValidForm" style="color:#ff5252;">(ECE-WE) Information has errors please check - Text TBD</span>
      </h4>
    </v-expansion-panel-header>
    <v-expansion-panel-content eager  >
    <v-row no-gutters class="d-flex flex-column pb-1 pt-1 ml-2">
      <v-row v-if="facilityInformationExists()" class="d-flex justify-start">
        <v-col cols="8" lg="6" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start ">
              <span class="summary-label pt-3">Facility Opt-In/Opt-Out for ECE-WE:</span>
              <v-text-field placeholder="Required"  :value="this.getOptInOptOut()" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    <v-row v-if="!facilityInformationExists()" class="d-flex justify-start">
      <v-col cols="6" lg="4" class="pb-0 pt-0">
        <v-row no-gutters class="d-flex justify-start">
          <v-col cols="12" class="d-flex justify-start ">
            <span class="summary-label pt-2">For the {{this.formattedProgramYear}} funding term, would you like to opt-in to ECE-WE for any facility in your organization</span>
            <v-text-field placeholder="Required"  :value="this.getYesNoValue(ecewe?.optInECEWE)" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6" lg="4" class="pb-0 pt-0">
        <v-row no-gutters class="d-flex justify-start">
          <v-col cols="12" class="d-flex justify-start">
            <span class="summary-label pt-3">Do any of the ECE employees at any facility in your organization belong to a union</span>
            <v-text-field placeholder="Required"  :value="this.getYesNoValue(ecewe?.belongsToUnion)" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
      <v-row v-if="!facilityInformationExists()" class="d-flex justify-start">
        <v-col v-if="isApplicableSectorRequired(ecewe?.belongsToUnion)" cols="6" lg="4" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start">
              <span class="summary-label pt-3">Applicable Sector :</span>
              <v-text-field placeholder="Required"  :value="this.getSectorValue(ecewe?.applicableSector)" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col v-if="isFundingModelRequired(ecewe?.belongsToUnion)" cols="6" lg="4" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start">
              <span class="summary-label pt-3">Funding model:</span>
              <v-text-field placeholder="Required"  :value="this.getFundingModel(ecewe?.fundingModel)" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-row>
      <v-row v-if="!isValidForm" class="d-flex justify-start">
        <v-col cols="6" lg="4" class="pb-0 pt-0 ml-2">
          <v-row  no-gutters class="d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start">
              <a :href="getRoutingPath()" > <span style="color:#ff5252; text-underline: black"><u>Click here to fix the issue(s)- Text TBD</u></span></a>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-expansion-panel-content>
    </v-form>
  </v-row>
</template>
<script>

import {mapState} from 'vuex';
import {PATHS} from '@/utils/constants';
import rules from '@/utils/rules';

export default {

  props: {
    ecewe: {
      type: Object,
      required: false
    },
    eceweFacility: {
      type: Object,
      required: false
    },
  },
  computed: {
    ...mapState('application', ['formattedProgramYear']),
  },
  data() {
    return {
      PATHS,
      rules,
      isValidForm: true,
      formObj:{
        formName: 'ECEWESummary',
      }
    };
  },
  methods:{
    getYesNoValue(value){
      if(value === 1){
        return 'Yes';
      }else if(value === 0){
        return 'No';
      }else{
        return null;
      }
    },
    isApplicableSectorRequired(value){
      return value === 1;
    },
    isFundingModelRequired(value){
      return value === 0;
    },
    getSectorValue(value) {
      if (value === 100000001) {
        return 'Other Unionized Employee';
      } else if (value === 100000000) {
        return 'Community Social Services Employers\' Association (CSSEA) Member';
      } else {
        return null;
      }
    },
    getFundingModel(value){
      if(value === 100000000){
        return 'All of our facilities have provincially funded ECEs and receive Low-Wage Redress Funding.';
      }else if(value === 100000001){
        return 'All of our facilities have only non-provincially funded ECEs and do not receive Low-Wage Redress Funding.';
      }else if(value === 100000002){
        return 'Some of our facilities have both non-provincially funded ECEs that do not receive Low-Wage Redress Funding AND provincially funded ECEs receiving Low-Wage Redress Funding.';
      }else{
        return null;
      }
    },
    facilityInformationExists(){
      return !!(this.eceweFacility);
    },
    getRoutingPath(){
      if(this.eceweFacility){
        return PATHS.eceweFacilities;
      }else {
        return PATHS.eceweEligibility;
      }
    },
    getOptInOptOut() {
      if (this.eceweFacility?.optInOrOut === 1) {
        return 'Opt-In';
      } else if (this.eceweFacility?.optInOrOut === 0) {
        return 'Opt-Out';
      } else {
        return '';
      }
    }
  },
  mounted() {
    this.$emit('isSummaryValid', this.formObj, this.isValidForm);
  },
  watch: {
    isValidForm: {
      handler: function (val) {
        this.$emit('isSummaryValid', this.formObj, val);
      },
    }
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
.summary-value-small{
  color: black;
  font-size: small;
  font-weight: bold
}
>>>::placeholder {
  color: #ff5252!important;
  opacity: 1;
}
</style>

