<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-form ref="eceweSummaryForm" v-model="isValidForm">
    <v-expansion-panel-header>
      <h4 style="color:#003466;">Early Childhood Educator-Wage Enhancement (ECE-WE)
        <v-icon v-if="isValidForm && !this.isProcessing" color="green" large>mdi-check-circle-outline</v-icon>
        <v-icon v-if="!isValidForm && !this.isProcessing" color="#ff5252" large>mdi-alert-circle-outline</v-icon>
        <span v-if="!isValidForm && !this.isProcessing" style="color:#ff5252;">Your form is missing required information. Click here to view.</span>
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
      <v-col cols="12" lg="6" class="pb-0 pt-0">
        <v-row no-gutters class="d-flex justify-start">
          <v-col cols="12" class="d-flex justify-start ">
            <span class="summary-label pt-2">For the {{this.formattedProgramYear}} funding term, would you like to opt-in to ECE-WE for any facility in your organization</span>
            <v-text-field placeholder="Required"  :value="this.getYesNoValue(ecewe?.optInECEWE)" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="ecewe?.optInECEWE == 1" cols="12" lg="6" class="pb-0 pt-0">
        <v-row no-gutters class="d-flex justify-start">
          <v-col cols="12" class="d-flex justify-start">
            <span class="summary-label pt-3">Do any of the ECE employees at any facility in your organization belong to a union</span>
            <v-text-field placeholder="Required"  :value="this.getYesNoValue(ecewe?.belongsToUnion)" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
      <v-row v-if="!facilityInformationExists()" class="d-flex justify-start">
        <div v-if="languageYearLabel != programYearTypes.HISTORICAL">
          <v-col v-if="ecewe?.optInECEWE == 1" cols="12" lg="6" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label pt-3">Are you a public sector employer, as defined in the Public Sector Employers Act?</span>
                <v-text-field placeholder="Required"  :value="this.getYesNoValue(ecewe?.publicSector)" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </div>
        <v-col v-if="(ecewe?.belongsToUnion == 1 && ecewe?.optInECEWE == 1 && ecewe?.publicSector == 1 && languageYearLabel != programYearTypes.HISTORICAL) || (ecewe?.belongsToUnion == 1 && ecewe?.optInECEWE == 1 && languageYearLabel == programYearTypes.HISTORICAL) " cols="12" lg="6" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start">
              <span class="summary-label pt-3">Applicable Sector:</span>
              <v-textarea placeholder="Required"  :value="this.getSectorValue(ecewe?.applicableSector)" class="summary-value" dense flat solo hide-details readonly no-resize rows="2" :rules="rules.required" ></v-textarea>
            </v-col>
          </v-row>
        </v-col>
        <v-col v-if="ecewe?.optInECEWE == 1 && ecewe?.belongsToUnion == 1 && ecewe?.applicableSector == 100000000" cols="12" lg="6" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start">
              <span class="summary-label pt-3">Funding model:</span>
              <v-textarea placeholder="Required"  :value="this.getFundingModel(ecewe?.fundingModel)" class="summary-value" dense flat solo hide-details readonly no-resize rows="3" :rules="rules.required" ></v-textarea>
            </v-col>
          </v-row>
          <v-row no-gutters class="d-flex justify-start" v-if="ecewe?.fundingModel === fundingModelTypeList[1].id || ecewe?.fundingModel === fundingModelTypeList[2].id">
            <v-col cols="12" class="d-flex justify-start">
              <span class="summary-label pt-3">I confirm that my organization/facilities pay the Joint Job Evaluation Plan (JJEP) wage rates or, if a lesser amount, a side agreement is being concluded to implement the ECE Wage Enhancement.</span>
              <v-text-field placeholder="Required"  :value="this.getYesNoValue(ecewe?.confirmation)" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col v-else-if="ecewe?.optInECEWE == 1 && ecewe?.belongsToUnion == 1 && ecewe?.applicableSector == 100000001" cols="12" lg="6" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start">
              <span class="summary-label pt-3">I confirm our organization/facilities has reached an agreement with the union to amend the collective agreement(s) in order to implement the ECE Wage Enhancement.</span>
              <v-text-field placeholder="Required"  :value="this.getYesNoValue(ecewe?.confirmation)" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-row>
      <v-row v-if="!isValidForm" class="d-flex justify-start">
        <v-col cols="12" lg="6" class="pb-0 pt-0 ml-2">
          <v-row  no-gutters class="d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start">
              <router-link :to="getRoutingPath()" > <span style="color:#ff5252; text-underline: black"><u>To add this information, click here. This will bring you to a different page.</u></span></router-link>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-expansion-panel-content>
    </v-form>
  </v-row>
</template>
<script>

import {mapState, mapGetters} from 'vuex';
import { isChangeRequest } from '@/utils/common';
import { PATHS, pcfUrl, changeUrl, PROGRAM_YEAR_LANGUAGE_TYPES } from '@/utils/constants';
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
    isProcessing: {
      type: Boolean,
      required: false
    },
    changeRecGuid: {
      type: String,
      required: false
    },
    programYearId: {
      type: String,
      required: false
    }
  },
  computed: {
    ...mapState('application', ['formattedProgramYear']),
    ...mapState('summaryDeclaration', ['isLoadingComplete']),
    ...mapState('app', ['fundingModelTypeList']),
    ...mapGetters('app', ['getFundingUrl', 'getLanguageYearLabel']),
    languageYearLabel(){
      return this.getLanguageYearLabel;
    },
    programYearTypes(){
      return PROGRAM_YEAR_LANGUAGE_TYPES;
    },
  },
  data() {
    return {
      isChangeRequest: isChangeRequest(this),
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
        return 'All of our facilities have provincially funded ECEs and receive Low-Wage Redress Funding';
      }else if(value === 100000001){
        return 'All of our facilities have only non-provincially funded ECEs and do not receive Low-Wage Redress Funding';
      }else if(value === 100000002){
        return 'Some of our facilities have both non-provincially funded ECEs that do not receive Low-Wage Redress Funding AND provincially funded ECEs receiving Low-Wage Redress Funding';
      }else{
        return null;
      }
    },
    facilityInformationExists(){
      return !!(this.eceweFacility);
    },
    getRoutingPath(){
      if (this.isChangeRequest) {
        if (!this.eceweFacility) {
          return changeUrl(PATHS.ECEWE_ELIGIBILITY, this.$route.params?.changeRecGuid);
        }
        return changeUrl(PATHS.ECEWE_FACILITITES, this.$route.params?.changeRecGuid);
      }
      else {
        if (!this.eceweFacility) {
          return pcfUrl(PATHS.ECEWE_ELIGIBILITY, this.programYearId);
        }
        return pcfUrl(PATHS.ECEWE_FACILITITES, this.programYearId);
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
  watch: {
    isLoadingComplete: {
      handler: function (val) {
        if (val && !this.facilityInformationExists()) {
          this.$emit('isSummaryValid', this.formObj, this.isValidForm);
        }
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

