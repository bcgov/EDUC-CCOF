<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-expansion-panel-header>
      <h4 style="color:#003466;">Child Care Fee Reduction Initiative (CCFRI)</h4>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
    <v-row no-gutters class="d-flex flex-column">
      <div v-for="ccType in ccfriChildCareTypes" :key="ccType?.ccfriId">
      <v-row class="d-flex justify-start">
        <v-col cols="6" lg="6" class="pb-0 pt-2">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start">
              <span class="summary-label">Parent Fees {{ ccType.programYear }}: {{ ccType.childCareCategory }}:</span>
              <span class="summary-value-small ml-5">{{ ccType.feeFrequency }}</span>
            </v-col>
            <v-col cols="12" class="d-flex justify-start">
              <span class="summary-label">Your <b>highest {{ ccType.feeFrequency.toLowerCase() }} parent fee before CCFRI is applied</b> in every month below. </span>
            </v-col>
            <v-col  cols="2" class="d-flex justify-start">
              <span class="summary-label">Apr:</span>
              <span class="summary-value-small ml-1">${{ ccType.approvedFeeApr }}</span>
            </v-col>
            <v-col cols="2" class="d-flex justify-start">
              <span class="summary-label">May:</span>
              <span class="summary-value-small ml-1">$${{ ccType.approvedFeeMay }}</span>
            </v-col>
            <v-col  cols="2" class="d-flex justify-start">
              <span class="summary-label">Jun:</span>
              <span class="summary-value-small ml-1">$${{ ccType.approvedFeeJun }}</span>
            </v-col>
            <v-col  cols="2" class="d-flex justify-start">
              <span class="summary-label">Jul:</span>
              <span class="summary-value-small ml-1">${{ ccType.approvedFeeJul }}</span>
            </v-col>
            <v-col  cols="2" class="d-flex justify-start">
              <span class="summary-label">Aug:</span>
              <span class="summary-value-small ml-1">${{ ccType.approvedFeeAug }}</span>
            </v-col>
            <v-col  cols="2" class="d-flex justify-start">
              <span class="summary-label">Sep:</span>
              <span class="summary-value-small ml-1">${{ ccType.approvedFeeSep }}</span>
            </v-col>
            <v-col  cols="2" class="d-flex justify-start">
              <span class="summary-label">Oct:</span>
              <span class="summary-value-small ml-1">${{ ccType.approvedFeeOct }}</span>
            </v-col>
            <v-col cols="2" class="d-flex justify-start">
              <span class="summary-label">Nov:</span>
              <span class="summary-value-small ml-1">${{ ccType.approvedFeeNov }}</span>
            </v-col>
            <v-col  cols="2" class="d-flex justify-start">
              <span class="summary-label">Dec:</span>
              <span class="summary-value-small ml-1">${{ ccType.approvedFeeDec }}</span>
            </v-col>
            <v-col  cols="2" class="d-flex justify-start">
              <span class="summary-label">Jan:</span>
              <span class="summary-value-small ml-1">${{ ccType.approvedFeeJan }}</span>
            </v-col>
            <v-col  cols="2" class="d-flex justify-start">
              <span class="summary-label">Feb:</span>
              <span class="summary-value-small ml-1">${{ ccType.approvedFeeFeb }}</span>
            </v-col>
            <v-col  cols="2" class="d-flex justify-start">
              <span class="summary-label">Mar:</span>
              <span class="summary-value-small ml-1">${{ ccType.approvedFeeMar }}</span>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      </div>
      <v-row class="d-flex justify-start">
        <v-col cols="6" lg="6" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="6" class="d-flex justify-start">
              <span class="summary-label">Do you charge parent fees at this facility to any closures on business days (other than statutory holidays)</span>
              <span class="summary-value-small ml-2">NO</span>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6" lg="6" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="6" class="d-flex justify-start">
              <span class="summary-label">Is there any other information about this facility you would like us to know</span>
              <span class="summary-value-small ml-2">NO</span>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-row>
    </v-expansion-panel-content>
  </v-row>
</template>
<script>
import _ from 'lodash';
export default {
  props: {
    ccfri: {
      type: Object,
      required: true
    }
  },
  computed: {
    ccfriChildCareTypes() {
      return _.sortBy(this.ccfri?.childCareTypes, 'orderNumber');
    }
  }
};
</script>
<style>
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
</style>

