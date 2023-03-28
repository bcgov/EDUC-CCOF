<template>
  <v-row no-gutters class="d-flex flex-column">
<v-card>
  <v-row no-gutters class="d-flex flex-column">
    <v-row class="d-flex justify-start" >
      <v-col cols="6" lg="3" class="pb-1 pt-1 ml-5">
        <v-row no-gutters class="d-flex justify-start">
          <v-col cols="12" class="d-flex justify-start ml-3">
            <span class="summary-label" >Facility Name</span>
          </v-col>
          <v-col  class="d-flex justify-start">
            <v-text-field placeholder="Required" :value="this.facilityInfo.facilityName" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6" lg="3" class="pb-1 pt-1 ml-5">
        <v-row  no-gutters class="d-flex justify-start">
          <v-col cols="12" class="d-flex justify-start ml-3">
            <span class="summary-label">Facility ID</span>
          </v-col>
          <v-col class="d-flex justify-start">
            <!-- Facility ID is assigned in dynamics, and may not exist as far as I know, so no required is implemented here -- JB -->
            <v-text-field label="--" :value="this.facilityInfo?.facilityAccountNumber" class="summary-value" dense flat solo hide-details readonly  ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6" lg="3" class="pb-1 pt-1 ml-5">
        <v-row no-gutters class="d-flex justify-start">
          <v-col cols="12" class="d-flex justify-start ml-3">
            <span class="summary-label" >Licence Number</span>
          </v-col>
          <v-col  class="d-flex justify-start">
            <v-text-field placeholder="Required" :value="this.facilityInfo?.licenseNumber" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6" lg="3" class="pb-1 pt-1 ml-5">
        <v-row no-gutters class="d-flex justify-start">
          <v-col cols="12" class="d-flex justify-start ml-3">
            <span class="summary-label" >Licence Category</span>
          </v-col>
          <v-col  class="d-flex justify-start">
            <!-- change below value to :value -->
            <v-text-field :value="this.licenseCategories" class="summary-value" dense flat solo hide-details readonly ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6" lg="3" class="pb-1 pt-1 ml-5">
        <v-row  no-gutters class="d-flex justify-start">
          <v-col cols="12" class="d-flex justify-start ml-3">
            <span class="summary-label">CCFRI</span>
          </v-col>
          <v-col class="d-flex justify-start">
            <v-text-field placeholder="Required" :value="this.getOptInOptOut(this.ccfriStatus)" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6" lg="3" class="pb-1 pt-1 ml-5">
        <v-row  no-gutters class="d-flex justify-start">
          <v-col cols="12" class="d-flex justify-start ml-3">
            <span class="summary-label">ECE-WE</span>
          </v-col>
          <v-col class="d-flex justify-start">
            <v-text-field placeholder="Required" :value="this.getOptInOptOut(this.eceweStatus)" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-row>
</v-card>
<!-- JB here to make this work with renewels-->
    <v-form ref="informationSummaryForm" v-model="isValidForm" v-if="!this.isRenewal">
    <v-expansion-panel-header>
      <h4 style="color:#003466;">Facility Information
      <v-icon v-if="isValidForm" color="green" large>mdi-check-circle-outline</v-icon>
      <v-icon v-if="!isValidForm" color="#ff5252" large>mdi-alert-circle-outline</v-icon>
      <span v-if="!isValidForm" style="color:#ff5252;">Facility Information has errors please check - Text TBD</span>
      </h4>
    </v-expansion-panel-header>
    <v-expansion-panel-content eager variant="accordion">
    <v-row no-gutters class="d-flex flex-column">
      <v-row class="d-flex justify-start">
        <v-col cols="8" lg="6" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start ml-3">
              <span class="summary-label" >Facility Name (as it appears on the Community Care Assisted Living Act Licence)</span>
            </v-col>
            <v-col  class="d-flex justify-start">
               <v-text-field placeholder="Required" :value="this.facilityInfo.facilityName" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6" lg="4" class="pb-0 pt-0">
          <v-row  no-gutters class="d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start ml-3">
              <span class="summary-label">Year Facility Began Operation (YYYY)</span>
            </v-col>
            <v-col class="d-flex justify-start">
               <v-text-field placeholder="Required" :value="this.facilityInfo?.yearBeganOperation" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-start">
        <v-col  cols="8" lg="6" class="pb-0 pt-0">
          <v-row  no-gutters class="d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start ml-3">
              <span class="summary-label">Facility Street Address</span>
            </v-col>
            <v-col class="d-flex justify-start">
               <v-text-field placeholder="Required" :value="this.facilityInfo?.facilityAddress" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6" lg="4" class="pb-0 pt-0">
          <v-row  no-gutters class="d-flex justify-start ml-3">
            <v-col cols="6" class="d-flex justify-start">
              <span class="summary-label">Facility Contact Name</span>
            </v-col>
            <v-col cols="6" class="d-flex justify-start">
              <span class="summary-label">Position</span>
            </v-col>
            <v-col class="d-flex justify-start ml-n3">
               <v-text-field placeholder="Required" :value="this.facilityInfo?.contactName" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
            </v-col>
            <v-col class="d-flex justify-start">
               <v-text-field placeholder="Required" :value="this.facilityInfo?.position" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-start">
        <v-col cols="8" lg="6" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="4" class="d-flex justify-start ml-3">
              <span class="summary-label">City/Town</span>
            </v-col>
            <v-col cols="6" class="d-flex justify-start">
              <span class="summary-label">Postal Code</span>
            </v-col>
            <v-col cols="4" class="d-flex justify-start">
               <v-text-field placeholder="Required" :value="this.facilityInfo?.city" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
            </v-col>
            <v-col cols="6" class="d-flex justify-start">
               <v-text-field placeholder="Required" :value="this.facilityInfo?.postalCode" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6" lg="4" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start ml-3">
            <v-col cols="6" class="d-flex justify-start">
              <span class="summary-label">Business phone</span>
            </v-col>
            <v-col cols="6" class="d-flex justify-start">
              <span class="summary-label">Facility E-mail Address</span>
            </v-col>
            <v-col cols="6" class="d-flex justify-start ml-n3">
               <v-text-field placeholder="Required" :value="this.facilityInfo?.phone" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
            </v-col>
            <v-col cols="6" class="d-flex justify-start">
               <v-text-field placeholder="Required" :value="this.facilityInfo?.email" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-start">
        <v-col cols="8" lg="6" class="pb-0 pt-0">
          <v-row  no-gutters class="d-flex justify-start pt-2">
            <v-col cols="10" class="d-flex justify-start ml-3">
              <span class="summary-label">Facility Licence Number</span>
            </v-col>
            <v-col cols="10" class="d-flex justify-start">
               <v-text-field placeholder="Required" :value="this.facilityInfo?.licenseNumber" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6" lg="4" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start pt-2 flex-column">
            <v-col cols="10" class="d-flex justify-start ml-3">
              <span class="summary-label">Effective Date of Current Licence (YYYY-MM-DD)</span>
            </v-col>
            <v-col class="d-flex justify-start">
               <v-text-field placeholder="Required" class="summary-value" :value="this.facilityInfo?.licenseEffectiveDate"  dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-row>
      <v-row v-if="!isValidForm" class="d-flex justify-start">
        <v-col cols="6" lg="4" class="pb-0 pt-0">
          <v-row  no-gutters class="d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start">
              <!-- ccof base funding CAN be undefined if new app, so send them to page before if that is the case.  -->
              <a :href="this.PATHS.family.orgInfo" v-if=" !getCCOFBaseFundingGuid() && this.summaryModel.application.organizationProviderType == 'FAMILY'"> <span style="color:#ff5252; text-underline: black"><u>Click here to fix the issue(s)- Text TBD</u></span></a>
              <a :href="this.PATHS.family.fundAmount + '/' + getCCOFBaseFundingGuid()" v-else-if="getCCOFBaseFundingGuid() && this.summaryModel.application.organizationProviderType == 'FAMILY'"> <span style="color:#ff5252; text-underline: black"><u>Click here to fix the issue(s)- Text TBD</u></span></a>
              <a :href="this.PATHS.group.facInfo + '/' + facilityId" v-else > <span style="color:#ff5252; text-underline: black"><u>Click here to fix the issue(s)- Text TBD</u></span></a>
              <!-- <a :href="this.PATHS.group.facInfo + '/' + facilityId" v-else> <span style="color:#ff5252; text-underline: black"><u>Click here to fix the issue(s)- Text TBD</u></span></a> -->
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
import {mapState} from 'vuex';

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
      required: false
    },
    eceweStatus: {
      type: Number,
      required: false
    },
    licenseCategories: {
      type: String,
      required: true,
    }


  },
  mounted() {
    this.$emit('isSummaryValid', 'FacilityInformationSummary', this.isValidForm);
  },
  watch: {
    isValidForm: {
      handler: function (val) {
        this.$emit('isSummaryValid', 'FacilityInformationSummary', val);
      },

    }
  },
  computed: {
    ...mapState('application', ['isRenewal',]),
    ...mapState('app', ['navBarList',]),
    ...mapState('summaryDeclaration', ['summaryModel',])
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
    },
    getCCOFBaseFundingGuid(){
      for (const fac of this.navBarList){
        if (fac.facilityId === this.facilityId){
          return fac.ccofBaseFundingId; //this COULD be undefined, if user has filled nothing and tries to go to decleration so check for undefined above
        }
      }
    },
  },
  data() {
    return {
      PATHS,
      rules,
      isValidForm: true,
      legal:null,
    };
  },
};
</script>
<style scoped>
.summary-label {
  color: grey; font-size: small;
}
.summary-value {
  font-size: medium;
  color: black;
}
>>>::placeholder {
  color: #ff5252!important;
  opacity: 1;
}
.summary-label-smaller{
  color: grey; font-size: x-small;
}

</style>
