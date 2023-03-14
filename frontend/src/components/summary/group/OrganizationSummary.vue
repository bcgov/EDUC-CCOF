<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-form ref="organizationSummaryForm" v-model="isValidForm">
    <v-expansion-panel-header>
      <h4 style="color:#003466;">Organization Information
        <v-icon v-if="isValidForm" color="green" large>mdi-check-circle-outline</v-icon>
        <v-icon v-if="!isValidForm" color="red" large>mdi-alert-circle-outline</v-icon>
        <span v-if="!isValidForm" style="color:#D40D19;">Organization Information has errors please check - Text TBD</span>
      </h4>

    </v-expansion-panel-header>
    <v-expansion-panel-content eager>
      <v-row no-gutters class="d-flex flex-column">
        <v-row class="d-flex justify-start">
          <v-col cols="8" lg="5" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label" >Legal Name (first, middle and last) or Organization (As it appears in BC Corporate Registry)</span>
              </v-col>
              <v-col  class="d-flex justify-start">
                <v-text-field :value="this.summaryModel?.organization?.legalName" class="summary-value" dense flat solo hide-details readonly required :rules="rules.required" ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="d-flex justify-start">
          <v-col  cols="6" lg="4" class="pb-0 pt-0">
            <v-row  no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label">Organization Mailing Address</span>
              </v-col>
              <v-col cols="12" class="d-flex justify-start pb-0">
                <v-text-field class="summary-value" :value="this.summaryModel?.organization?.address1" dense flat solo hide-details readonly required :rules="rules.required" ></v-text-field>
              </v-col>
              <v-col class="d-flex justify-start">
                <v-text-field class="summary-value" :value="this.summaryModel?.organization?.address2" dense flat solo hide-details readonly required :rules="rules.required" ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6" lg="4" class="pb-0 pt-0">
            <v-row  no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label">Organization Contact Name</span>
              </v-col>
              <v-col class="d-flex justify-start">
                <v-text-field class="summary-value" :value="this.summaryModel?.application?.orgContactName" dense flat solo hide-details readonly required :rules="rules.required" ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6" lg="4" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start flex-column">
              <v-col cols="10" class="d-flex justify-start">
                <span class="summary-label">Position</span>
              </v-col>
              <v-col class="d-flex justify-start">
                <v-text-field class="summary-value" :value="this.summaryModel?.organization?.position" dense flat solo hide-details readonly required :rules="rules.required" ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="d-flex justify-start">
          <v-col cols="6" lg="4" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="5" class="d-flex justify-start">
                <span class="summary-label">City/Town</span>
              </v-col>
              <v-col cols="5" class="d-flex justify-start">
                <span class="summary-label">Postal Code</span>
              </v-col>
              <v-col cols="5" class="d-flex justify-start">
                <v-text-field class="summary-value" :value="this.summaryModel?.organization?.city1" dense flat solo hide-details readonly required :rules="rules.required" ></v-text-field>
              </v-col>
              <v-col cols="5" class="d-flex justify-start">
                <v-text-field class="summary-value" :value="this.summaryModel?.organization?.postalCode1" dense flat solo hide-details readonly required :rules="rules.required" ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6" lg="4" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label">Business phone</span>
              </v-col>
              <v-col class="d-flex justify-start">
                <v-text-field class="summary-value" :value="this.summaryModel?.organization?.phone" dense flat solo hide-details readonly required :rules="rules.required" ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col  cols="6" lg="4" class="pb-0 pt-0">
            <v-row  no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label">E-mail Address of Signing Authority</span>
              </v-col>
              <v-col class="d-flex justify-start">
                <v-text-field class="summary-value" :value="this.summaryModel?.organization?.email" dense flat solo hide-details readonly required :rules="rules.required" ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="d-flex justify-start">
          <v-col cols="6" lg="4" class="pb-0 pt-0">
            <v-row  no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label">Type of Organization</span>
              </v-col>
              <v-col class="d-flex justify-start">
                <v-text-field class="summary-value" :value="this.summaryModel?.application?.organizationProviderType" dense flat solo hide-details readonly required :rules="rules.required" ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6" lg="4" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label">Business BCeID</span>
              </v-col>
              <v-col class="d-flex justify-start">
                <v-text-field class="summary-value" :value="this.userInfo.userName" dense flat solo hide-details readonly required :rules="rules.required" ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="4" lg="3" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label">Incorporation Number</span>
              </v-col>
              <v-col class="d-flex justify-start">
                <v-text-field class="summary-value" :value="this.summaryModel?.organization?.incNumber" dense flat solo hide-details readonly required :rules="rules.required" ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-row>
      <v-row v-if="!isValidForm" class="d-flex justify-start">
        <v-col cols="6" lg="4" class="pb-0 pt-0">
          <v-row  no-gutters class="d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start">
              <a :href="PATHS.group.orgInfo" > <span style="color:#D40D19; text-underline: black"><u>Click here to fix the issue(s)- Text TBD</u></span></a>
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
import rules from '@/utils/rules';
import {PATHS} from '@/utils/constants';

export default {
  name: 'OrganizationSummary',
  props: {
    programYear: {
      type: String,
      required: true
    },
    summaryModel: {
      type: Object,
      required: true
    }
  },
  computed:{
    ...mapState('auth', ['userInfo']),
  },
  data() {
    return {
      PATHS,
      rules,
      legalName: null,
      isValidForm: true,
    };
  },
  mounted() {
    this.$refs.organizationSummaryForm.validate();
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



</style>

