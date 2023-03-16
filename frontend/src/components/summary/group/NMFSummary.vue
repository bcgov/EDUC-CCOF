<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-expansion-panel-header>
      <h4 style="color:#003466;">NMF</h4>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
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
            <v-textarea placeholder="" :value="this.nmfApp?.supportNeedsComments" class="" dense flat solo hide-details readonly :rules="rules.required" ></v-textarea>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-start">
        <v-col cols="8" lg="6" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="10" class="d-flex justify-start">
              <span class="summary-label pt-3">Does your facility provide additional services (such as meals or other wrap-around services), to support families experiencing vulnerability and/or underserved populations, such as Indigenous or low-income families?</span>
            </v-col>
            <v-col cols="3" class="d-flex justify-left">
              <v-text-field placeholder="Required" :value="this.nmfApp?.lowIncomeFamilies" class="" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="10">
          <v-textarea placeholder="" :value="this.nmfApp?.lowIncomeFamiliesComments" class="" dense flat solo hide-details readonly :rules="rules.required" ></v-textarea>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-start">
        <v-col cols="8" lg="6" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="10" class="d-flex justify-start">
              <span class="summary-label pt-3">Do you provide transportation to/from your facility to support families in rural or remote communities who may not otherwise be able to access child care?</span>
            </v-col>
            <v-col cols="3" class="d-flex justify-start">
              <v-text-field placeholder="Required" :value="this.nmfApp?.remoteCommunities" class="" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="10">
          <v-textarea placeholder="" :value="this.nmfApp?.remoteCommunitiesComments" class="" dense flat solo hide-details readonly :rules="rules.required" ></v-textarea>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-start">
        <v-col cols="8" lg="6" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="10" class="d-flex justify-start">
              <span class="summary-label pt-3">Please tell us anything else you'd like us to know about how your facility's business case supports setting fees higher than the Affordability Benchmarks outlined in the 2023/24 Funding Guidelines.</span>
            </v-col>
            <v-col cols="3" class="d-flex justify-left">
              <v-textarea placeholder="" :value="this.nmfApp?.otherComments" class="" dense flat solo hide-details readonly :rules="rules.required" ></v-textarea>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-row>
    </v-expansion-panel-content>
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
  props: {
    programYear: {
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
<style>

>>>::placeholder {
  color: red!important;
}

>>>.summary-value .v-label {
  color: #ff5252;
  opacity: 1;
}

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

