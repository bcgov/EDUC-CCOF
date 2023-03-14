<template>
  <v-row no-gutters class="d-flex flex-column">
<v-card>
  <v-row no-gutters class="d-flex flex-column">
    <v-row class="d-flex justify-start" >
      <v-col cols="6" lg="5" class="pb-1 pt-1 ml-5">
        <v-row no-gutters class="d-flex justify-start">
          <v-col cols="12" class="d-flex justify-start">
            <span class="summary-label" >Facility Name</span>
          </v-col>
          <v-col  class="d-flex justify-start">
            <span  class="summary-value">{{ this.facilityInfo.facilityName }}</span>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6" lg="5" class="pb-1 pt-1 ml-5">
        <v-row  no-gutters class="d-flex justify-start">
          <v-col cols="12" class="d-flex justify-start">
            <span class="summary-label">Facility ID</span>
          </v-col>
          <v-col class="d-flex justify-start">
            <span  class="summary-value">{{ this.facilityId }}</span>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6" lg="5" class="pb-1 pt-1 ml-5">
        <v-row no-gutters class="d-flex justify-start">
          <v-col cols="12" class="d-flex justify-start">
            <span class="summary-label" >Licence Number</span>
          </v-col>
          <v-col  class="d-flex justify-start">
            <span  class="summary-value">{{ this.facilityInfo?.licenseNumber }}</span>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6" lg="5" class="pb-1 pt-1 ml-5">
        <v-row no-gutters class="d-flex justify-start">
          <v-col cols="12" class="d-flex justify-start">
            <span class="summary-label" >Licence Category</span>
          </v-col>
          <v-col  class="d-flex justify-start">
            <span  class="summary-value">TBD</span>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6" lg="5" class="pb-1 pt-1 ml-5">
        <v-row  no-gutters class="d-flex justify-start">
          <v-col cols="12" class="d-flex justify-start">
            <span class="summary-label">CCFRI</span>
          </v-col>
          <v-col class="d-flex justify-start">
            <span  class="summary-value">{{this.getOptInOptOut(this.ccfriStatus)}}</span>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6" lg="5" class="pb-1 pt-1 ml-5">
        <v-row  no-gutters class="d-flex justify-start">
          <v-col cols="12" class="d-flex justify-start">
            <span class="summary-label">ECE-WE</span>
          </v-col>
          <v-col class="d-flex justify-start">
            <span  class="summary-value">{{this.getOptInOptOut(this.eceweStatus)}}</span>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-row>
</v-card>
    <v-form ref="informationSummaryForm" v-model="isValidForm">
    <v-expansion-panel-header>
      <h4 style="color:#003466;">Facility Information
      <v-icon v-if="isValidForm" color="green" large>mdi-check-circle-outline</v-icon>
      <v-icon v-if="!isValidForm" color="red" large>mdi-alert-circle-outline</v-icon>
      <span v-if="!isValidForm" style="color:#D40D19;">Facility Information has errors please check - Text TBD</span>
      </h4>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
    <v-row no-gutters class="d-flex flex-column">
      <v-row class="d-flex justify-start">
        <v-col cols="8" lg="6" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start">
              <span class="summary-label" >Facility Name (as it appears on the Community Care Assisted Living Act Licence)</span>
            </v-col>
            <v-col  class="d-flex justify-start">
              <v-text-field :value="this.facilityInfo?.facilityName" class="summary-value" dense flat solo hide-details readonly required :rules="rules.required" ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6" lg="4" class="pb-0 pt-0">
          <v-row  no-gutters class="d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start">
              <span class="summary-label">Year Facility Began Operation (YYYY)</span>
            </v-col>
            <v-col class="d-flex justify-start">
              <v-text-field :value="this.facilityInfo?.yearBeganOperation" class="summary-value" dense flat solo hide-details readonly required :rules="rules.required" ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-start">
        <v-col  cols="8" lg="6" class="pb-0 pt-0">
          <v-row  no-gutters class="d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start">
              <span class="summary-label">Facility Street Address</span>
            </v-col>
            <v-col class="d-flex justify-start">
              <v-text-field :value="this.facilityInfo?.facilityAddress" class="summary-value" dense flat solo hide-details readonly required :rules="rules.required" ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6" lg="4" class="pb-0 pt-0">
          <v-row  no-gutters class="d-flex justify-start">
            <v-col cols="6" class="d-flex justify-start">
              <span class="summary-label">Facility Contact Name</span>
            </v-col>
            <v-col cols="6" class="d-flex justify-start">
              <span class="summary-label">Position</span>
            </v-col>
            <v-col class="d-flex justify-start">
              <v-text-field :value="this.facilityInfo?.contactName" class="summary-value" dense flat solo hide-details readonly required :rules="rules.required" ></v-text-field>
            </v-col>
            <v-col class="d-flex justify-start">
              <v-text-field :value="this.facilityInfo?.position" class="summary-value" dense flat solo hide-details readonly required :rules="rules.required" ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-start">
        <v-col cols="8" lg="6" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="4" class="d-flex justify-start">
              <span class="summary-label">City/Town</span>
            </v-col>
            <v-col cols="6" class="d-flex justify-start">
              <span class="summary-label">Postal Code</span>
            </v-col>
            <v-col cols="4" class="d-flex justify-start">
              <v-text-field :value="this.facilityInfo?.city" class="summary-value" dense flat solo hide-details readonly required :rules="rules.required" ></v-text-field>
            </v-col>
            <v-col cols="6" class="d-flex justify-start">
              <v-text-field :value="this.facilityInfo?.postalCode" class="summary-value" dense flat solo hide-details readonly required :rules="rules.required" ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6" lg="4" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="6" class="d-flex justify-start">
              <span class="summary-label">Business phone</span>
            </v-col>
            <v-col cols="6" class="d-flex justify-start">
              <span class="summary-label">Facility E-mail Address</span>
            </v-col>
            <v-col cols="6" class="d-flex justify-start">
              <v-text-field :value="this.facilityInfo?.phone" class="summary-value" dense flat solo hide-details readonly required :rules="rules.required" ></v-text-field>
            </v-col>
            <v-col cols="6" class="d-flex justify-start">
              <v-text-field :value="this.facilityInfo?.email" class="summary-value" dense flat solo hide-details readonly required :rules="rules.required" ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-start">
        <v-col cols="8" lg="6" class="pb-0 pt-0">
          <v-row  no-gutters class="d-flex justify-start pt-2">
            <v-col cols="10" class="d-flex justify-start">
              <span class="summary-label">Facility Licence Number</span>
            </v-col>
            <v-col cols="10" class="d-flex justify-start">
              <v-text-field :value="this.facilityInfo?.licenseNumber" class="summary-value" dense flat solo hide-details readonly required :rules="rules.required" ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6" lg="4" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start pt-2 flex-column">
            <v-col cols="10" class="d-flex justify-start">
              <span class="summary-label">Effective Date of Current Licence (YYYY-MM-DD)</span>
            </v-col>
            <v-col class="d-flex justify-start">
              <v-text-field :value="this.facilityInfo?.licenseEffectiveDate" class="summary-value" dense flat solo hide-details readonly required :rules="rules.required" ></v-text-field>
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
import {PATHS} from '@/utils/constants';
import rules from '@/utils/rules';

export default {
  props: {
    facilityInfo: {
      type: Object,
      required: true
    },
    facilityId: {
      type: String,
      required: true
    },
    ccfriStatus: {
      type: Number,
      required: true
    },
    eceweStatus: {
      type: Number,
      required: true
    },
  },
  methods: {
    getOptInOptOut(status) {
      if (status === 1) {
        return 'Opt-In';
      } else if (status === 0) {
        return 'Opt-Out';
      } else {
        return '';
      }
    }
  },
  data() {
    return {
      PATHS,
      rules,
      isValidForm: true,
    };
  },
};
</script>
<style>
.summary-label {
  color: grey; font-size: small;
}
.summary-value {
  font-size: medium;
  color: black;
}
.summary-label-smaller{
  color: grey; font-size: x-small;
}
</style>
