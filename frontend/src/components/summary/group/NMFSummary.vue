<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-form ref="nmfSummaryForm" v-model="isValidForm">
    <v-expansion-panel-header>
      <h4 style="color:#003466;">NMF
        <v-icon v-if="isValidForm" color="green" large>mdi-check-circle-outline</v-icon>
        <v-icon v-if="!isValidForm" color="#ff5252" large>mdi-alert-circle-outline</v-icon>
        <span v-if="!isValidForm" style="color:#ff5252;">CCFRI Information has errors please check - Text TBD</span>
      </h4>
    </v-expansion-panel-header>
    <v-expansion-panel-content eager>
    <v-row no-gutters class="d-flex flex-column">
      <v-row class="d-flex justify-start">
        <v-col cols="8" lg="6" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="10" class="d-flex justify-start">
              <span class="summary-label pt-3"> Did you apply for Ministry funding to create new licensed spaces prior to April 1, 2021 (e.g. New Spaces Fund, UBCM Community Child Care Space Creation Program, Start-up Grants, Rapid Renovation Funding)?</span>
            </v-col>
            <v-col cols="3" class="d-flex justify-start">
              <v-text-field placeholder="Required" :value="this.nmfApp?.supportNeeds" class="" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="10">
            <v-textarea placeholder="Required" v-if="this.nmfApp?.supportNeeds" :value="this.nmfApp?.supportNeedsComments" class="" dense flat solo hide-details no-resize rows="3" readonly :rules="rules.required"></v-textarea>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-start">
        <v-col cols="8" lg="6" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="10" class="d-flex justify-start">
              <span class="summary-label pt-3">Does your facility provide additional services (such as meals or other wrap-around services), to support families experiencing vulnerability and/or underserved populations, such as Indigenous or low-income families?</span>
            </v-col>
            <v-col cols="3" class="d-flex justify-left">
              <v-text-field placeholder="Required" :value="this.nmfApp?.lowIncomeFamilies" class="" dense flat solo hide-details readonly no-resize rows="3" :rules="rules.required" ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="10">
          <v-textarea placeholder="Required"  v-if="this.nmfApp?.lowIncomeFamilies == 'Yes'" :value="this.nmfApp?.lowIncomeFamiliesComments" class="" dense flat solo hide-details readonly no-resize rows="3" :rules="rules.required" ></v-textarea>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-start">
        <v-col cols="8" lg="6" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="10" class="d-flex justify-start">
              <span class="summary-label pt-3">Do you provide transportation to/from your facility to support families in rural or remote communities who may not otherwise be able to access child care?</span>
            </v-col>
            <v-col cols="3" class="d-flex justify-start">
              <v-text-field placeholder="Required" :value="this.nmfApp?.remoteCommunities" class="" dense flat solo hide-details readonly no-resize rows="3" :rules="rules.required" ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="10">
          <v-textarea placeholder="Required" v-if="this.nmfApp?.remoteCommunities == 'Yes'" :value="this.nmfApp?.remoteCommunitiesComments" class="" dense flat solo hide-details  no-resize rows="3" readonly :rules="rules.required" ></v-textarea>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-start">
        <v-col cols="8" lg="6" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="10" class="d-flex justify-start">
              <span class="summary-label pt-3">Please tell us anything else you'd like us to know about how your facility's business case supports setting fees higher than the Affordability Benchmarks outlined in the 2023/24 Funding Guidelines.</span>
            </v-col>
            <v-col cols="3" class="d-flex justify-left">
              <v-textarea placeholder="Required" :value="this.nmfApp?.otherComments" class="" dense flat solo hide-details readonly no-resize rows="3" :rules="rules.required" ></v-textarea>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-row>
    <v-row v-if="!isValidForm" class="d-flex justify-start">
        <v-col cols="6" lg="4" class="pb-0 pt-0">
          <v-row  no-gutters class="d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start">
              <a :href="PATHS.NMF + '/' + ccfriId" > <span style="color:#ff5252; text-underline: black"><u>Click here to fix the issue(s)- Text TBD</u></span></a>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-expansion-panel-content>
  </v-form>
  </v-row>
</template>
<script>

import rules from '@/utils/rules';
import {PATHS} from '@/utils/constants';

export default {
  name: 'NMFSummary',
  data() {
    return {
      PATHS,
      rules,
      isValidForm: true,
    };
  },
  mounted() {
    this.$emit('isSummaryValid', 'NMFSummary', this.isValidForm);
  },
  watch: {
    isValidForm: {
      handler: function (val) {
        this.$emit('isSummaryValid', 'NMFSummary', val);
      },
    }
  },
  props: {
    programYear: {
      type: String,
      required: true
    },
    ccfriId: {
      type: String,
      required: true
    },
    nmfApp: {
      type: Object,
      required: true
    }
  },

};
</script>
<style scoped>




.summary-label {
  color: grey;
  font-size: small;
}

>>>::placeholder {
  color: #ff5252!important;
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
.summary-value-small{
  color: black;
  font-size: small;
  font-weight: bold
}
</style>

