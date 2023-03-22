<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-form ref="ccfriSummaryForm" v-model="isValidForm">
    <v-expansion-panel-header>
      <h4 style="color:#003466;">Child Care Fee Reduction Initiative (CCFRI)
        <v-icon v-if="isValidForm" color="green" large>mdi-check-circle-outline</v-icon>
        <v-icon v-if="!isValidForm" color="#ff5252" large>mdi-alert-circle-outline</v-icon>
        <span v-if="!isValidForm" style="color:#ff5252;">CCFRI Information has errors please check - Text TBD</span>
      </h4>
    </v-expansion-panel-header>
    <v-expansion-panel-content eager>
    <v-row v-if="ccfri.ccfriOptInStatus != 0" no-gutters class="d-flex flex-column">
      <div v-for="ccType in ccfriChildCareTypes" :key="ccType?.ccfriId">
      <v-row class="d-flex justify-start">
        <v-col cols="6" lg="6" class="pb-0 pt-2">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start">
              <span class="summary-label pt-3" v-if="!!ccType.programYear && !!ccType.childCareCategory">Parent Fees {{ ccType.programYear }}: {{ ccType.childCareCategory }}:</span>
              <v-text-field placeholder="Required"  v-else :value="generateProgYearText(ccType.programYear,ccType.childCareCategory)" class="summary-label" dense flat solo hide-details readonly :rules="rules.required" prefix="Parent Fees" ></v-text-field>
              <v-text-field placeholder="Required"  :value="ccType.feeFrequency" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
            </v-col>
            <v-col cols="12" class="d-flex justify-start">
              <span v-if="!!ccType.feeFrequency" class="summary-label">Your <b>highest {{ ccType.feeFrequency.toLowerCase() }} parent fee before CCFRI is applied</b> in every month below. </span>
              <v-text-field placeholder="Required"  v-else :value="ccType.feeFrequency" class="summary-value" dense flat solo hide-details readonly :rules="rules.required"></v-text-field>
            </v-col>
            <v-col  cols="2" class="d-flex justify-start">
              <span class="summary-label pt-3">Apr:</span>
              <v-text-field placeholder="Required"  :value="ccType.approvedFeeApr" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" prefix="$"></v-text-field>
            </v-col>
            <v-col cols="2" class="d-flex justify-start">
              <span class="summary-label pt-3">May:</span>
              <v-text-field placeholder="Required"  :value="ccType.approvedFeeMay" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" prefix="$"></v-text-field>
            </v-col>
            <v-col  cols="2" class="d-flex justify-start">
              <span class="summary-label pt-3">Jun:</span>
              <v-text-field placeholder="Required"  :value="ccType.approvedFeeJun" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" prefix="$"></v-text-field>
            </v-col>
            <v-col  cols="2" class="d-flex justify-start">
              <span class="summary-label pt-3">Jul:</span>
              <v-text-field placeholder="Required"  :value="ccType.approvedFeeJul" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" prefix="$"></v-text-field>
            </v-col>
            <v-col  cols="2" class="d-flex justify-start">
              <span class="summary-label pt-3">Aug:</span>
              <v-text-field placeholder="Required"  :value="ccType.approvedFeeAug" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" prefix="$"></v-text-field>
            </v-col>
            <v-col  cols="2" class="d-flex justify-start">
              <span class="summary-label pt-3">Sep:</span>
              <v-text-field placeholder="Required"  :value="ccType.approvedFeeSep" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" prefix="$"></v-text-field>
            </v-col>
            <v-col  cols="2" class="d-flex justify-start">
              <span class="summary-label pt-3">Oct:</span>
              <v-text-field placeholder="Required"  :value="ccType.approvedFeeOct" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" prefix="$"></v-text-field>
            </v-col>
            <v-col cols="2" class="d-flex justify-start">
              <span class="summary-label pt-3">Nov:</span>
              <v-text-field placeholder="Required"  :value="ccType.approvedFeeNov" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" prefix="$"></v-text-field>
            </v-col>
            <v-col  cols="2" class="d-flex justify-start">
              <span class="summary-label pt-3">Dec:</span>
              <v-text-field placeholder="Required"  :value="ccType.approvedFeeDec" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" prefix="$"></v-text-field>
            </v-col>
            <v-col  cols="2" class="d-flex justify-start">
              <span class="summary-label pt-3">Jan:</span>
              <v-text-field placeholder="Required"  :value="ccType.approvedFeeJan" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" prefix="$"></v-text-field>
            </v-col>
            <v-col  cols="2" class="d-flex justify-start">
              <span class="summary-label pt-3">Feb:</span>
              <v-text-field placeholder="Required"  :value="ccType.approvedFeeFeb" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" prefix="$"></v-text-field>
            </v-col>
            <v-col  cols="2" class="d-flex justify-start">
              <span class="summary-label pt-3">Mar:</span>
              <v-text-field placeholder="Required"  :value="ccType.approvedFeeMar" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" prefix="$"></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      </div>
      <v-row class="d-flex justify-start">
        <v-col cols="6" lg="6" class="pb-2 pt-2">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="6" class="d-flex justify-start">
              <span class="summary-label">Do you charge parent fees at this facility to any closures on business days (other than statutory holidays)</span>
              <v-text-field placeholder="Required"  :value="this.getClosureFees(this.ccfri.hasClosureFees)" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" class="pb-2 pt-2">
          <v-row no-gutters class="d-flex justify-start">

              <span class="summary-label">Is there any other information about this facility you would like us to know?</span>
              <v-textarea placeholder="" class="col-12 summary-value-small"  :value="this.ccfri.ccfriApplicationNotes"  dense flat solo hide-details readonly  ></v-textarea>

          </v-row>
        </v-col>
      </v-row>
    </v-row>
    <v-row v-else class="d-flex justify-start">
      <v-col cols="8" lg="6" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start mt-5 ">
              <span class="summary-label mr-5">CCFRI Opt In Status: </span>
              <p class="summary-value-small">Opt Out</p>
            </v-col>
          </v-row>
        </v-col>

    </v-row>
      <v-row v-if="!isValidForm" class="d-flex justify-start">
        <v-col cols="6" lg="4" class="pb-0 pt-0">
          <v-row  no-gutters class="d-flex justify-start">
            <v-col cols="12" v-if="this.isRenewal" class="d-flex justify-start">
              <a :href="PATHS.currentFees + '/' + ccfriId" > <span style="color:#ff5252; text-underline: black"><u>Click here to fix the issue(s)- Text TBD</u></span></a>
            </v-col>
            <v-col cols="12" v-else class="d-flex justify-start">
              <a :href="PATHS.addNewFees + '/' + ccfriId" > <span style="color:#ff5252; text-underline: black"><u>Click here to fix the issue(s)- Text TBD</u></span></a>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-expansion-panel-content>
    </v-form>
  </v-row>
</template>
<script>
import _ from 'lodash';
import {PATHS} from '@/utils/constants';
import rules from '@/utils/rules';
import {mapState} from 'vuex';


export default {
  props: {
    ccfri: {
      type: Object,
      required: true
    },
    ccfriId: {
      type: String,
      required: true
    },
  },
  data() {
    return {

      PATHS,
      rules,
      isValidForm: true,
      route_facility: PATHS.group.facInfo+'/'+this.facilityId,

    };
  },
  computed:{
    ...mapState('application', ['isRenewal',]),
    ccfriChildCareTypes() {
      return _.sortBy(this.ccfri?.childCareTypes, 'orderNumber');
    },
  },
  methods: {
    getClosureFees(value) {
      if (value === 100000000) {
        return 'Yes';
      } else if(value === 100000001) {
        return 'No';
      }
    },
    generateProgYearText(programYear,childCareCategory){
      if(programYear && childCareCategory){
        return 'Parent Fees '+programYear+': '+childCareCategory+':';
      }
      return null;
    },
    generateFeeFrequencyText(feeFrequency){
      if(feeFrequency){
        return 'Your <b>highest' +feeFrequency.toLowerCase()  +'parent fee before CCFRI is applied</b> in every month below.';
      }
      return null;
    },
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
  color: black !important;
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

