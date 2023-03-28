<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-form ref="ccofSummaryForm" v-model="isValidForm">
    <v-expansion-panel-header>
      <h4 style="color:#003466;">Child Care Operating Funding (CCOF)
        <v-icon v-if="isValidForm" color="green" large>mdi-check-circle-outline</v-icon>
        <v-icon v-if="!isValidForm" color="#ff5252" large>mdi-alert-circle-outline</v-icon>
        <span v-if="!isValidForm" style="color:#ff5252;">CCOF Information has errors please check - Text TBD</span>
      </h4>
    </v-expansion-panel-header>
    <v-expansion-panel-content eager  >
      <v-row no-gutters class="d-flex flex-column pb-1 pt-1 ml-2">
        <v-row class="d-flex justify-start ">
          <v-col cols="8" lg="6" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label pt-3">Maximum number of <b>days per week</b> you provide child care: </span>
                <v-text-field placeholder="Required" :value="this.funding?.maxDaysPerWeek" class="summary-value ma-0 pa-0 px-0"  dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6" lg="4" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label pt-3">Maximum number of <b>weeks per year</b> you provide child care: </span>
                <v-text-field placeholder="Required" :value="this.funding?.maxWeeksPerYear" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="d-flex justify-start">
          <v-col cols="8" lg="6" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label pt-3">Are there months when ALL of the programs at this facility are closed for the entire month? </span>
                <v-text-field placeholder="Required" :value="this.funding?.hasClosedMonth?.toUpperCase()" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="4" lg="6" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="4" class="d-flex justify-start flex-nowrap">
                <span class="summary-label pt-3">Facility hours of operation:</span>
              </v-col>
              <v-col class="d-flex justify-start">
                <span class="summary-label pt-3">From:</span>
                <v-text-field placeholder="Required" :value="this.funding?.hoursFrom12hr" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
              </v-col>
              <v-col class="d-flex justify-start">
                <span class="summary-label pt-3">To:</span>
                <v-text-field placeholder="Required" :value="this.funding?.hoursTo12hr" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="d-flex justify-start">
          <v-col cols="8" lg="6" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="10" class="d-flex justify-start">
                <span class="summary-value">Type of Service</span>
              </v-col>
              <v-col cols="10" class="d-flex justify-start pb-2 pt-2">
                <span class="summary-label">Maximum Licenced Capacity</span>
              </v-col>
              <v-col cols="10" class="d-flex justify-start pb-2 pt-2">
                <span class="summary-label">Group Child Care (Under 36 months)</span>
              </v-col>
              <v-col cols="10" class="d-flex justify-start pb-2 pt-3">
                <span class="summary-label">Group Child Care (30 Months to School Age)</span>
              </v-col>
              <v-col cols="10" class="d-flex justify-start pb-2 pt-3">
                <span class="summary-label">Preschool</span>
              </v-col>
              <v-col cols="10" class="d-flex justify-start pb-2 pt-3">
                <span class="summary-label">Group Child Care (School Age/ School Age Care on School Grounds)</span>
              </v-col>
              <v-col cols="10" class="d-flex justify-start pb-2 pt-3">
                <span class="summary-label">Multi-Age Child Care</span>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6" lg="6" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="10" class="d-flex justify-start">
                <span class="summary-value">Maximum Number</span>
              </v-col>
              <v-col cols="10" class="d-flex justify-start">
                <v-text-field placeholder="Required" :value="this.funding?.maxLicensesCapacity" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
              </v-col>
              <v-col cols="10" class="d-flex justify-start">
                <v-text-field placeholder="Required" :value="this.funding?.maxGroupChildCareUnder36" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
              </v-col>
              <v-col cols="10" class="d-flex justify-start">
                <v-text-field placeholder="Required" :value="this.funding?.maxGroupChildCare36" class="summary-value" dense flat solo hide-details readonly  :rules="rules.required" ></v-text-field>
              </v-col>
              <v-col cols="10" class="d-flex justify-start">
                <v-text-field placeholder="Required" :value="this.funding?.maxPreschool" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
              </v-col>
              <v-col cols="10" class="d-flex justify-start">
                <v-text-field placeholder="Required" :value="this.funding?.maxGroupChildCareSchool" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
              </v-col>
              <v-col cols="10" class="d-flex justify-start">
                <v-text-field placeholder="Required" :value="this.funding?.maxGroupChildCareMultiAge" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="d-flex justify-start">
          <v-col cols="12" lg="12" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start pt-2">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label">Preschool sessions your facility offers per day:</span>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="d-flex justify-start pt-2">
          <v-col cols="2" lg="1" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label">Monday</span>
              </v-col>
              <v-col class="d-flex justify-start">
                <v-text-field placeholder="Required" :value="this.funding?.monday" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="2" lg="1" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label">Tuesday</span>
              </v-col>
              <v-col class="d-flex justify-left">
                <v-text-field placeholder="Required" :value="this.funding?.tusday" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="2" lg="1" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label">Wednesday</span>
              </v-col>
              <v-col class="d-flex justify-start">
                <v-text-field placeholder="Required" :value="this.funding?.wednesday" class="summary-value" dense flat solo hide-details readonly required :rules="rules.required" ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="2" lg="1" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label">Thursday</span>
              </v-col>
              <v-col class="d-flex justify-start">
                <v-text-field placeholder="Required" :value="this.funding?.thursday" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="2" lg="1" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label">Friday</span>
              </v-col>
              <v-col class="d-flex justify-start">
                <v-text-field placeholder="Required" :value="this.funding?.friday" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="2" lg="1" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label">Total</span>
              </v-col>
              <v-col class="d-flex justify-start">
                <v-text-field placeholder="Required" :value="this.calculateTotal()" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="4" lg="3" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label pt-1">Is the facility located on school property?</span>
                <v-text-field placeholder="Required" :value="this.funding?.isSchoolProperty?.toUpperCase()" class="summary-value ml-n5" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="d-flex justify-start">
          <v-col cols="12" lg="12" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start pt-2">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label pt-2">Do you <b>regularly offer</b> extended daily hours of child care <b>(before 6am, after 7pm or overnight)</b>?</span>
                <v-text-field placeholder="Required" :value="this.funding?.isExtendedHours?.toUpperCase()" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="d-flex justify-start">
          <v-col cols="12" lg="12" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label">For each type of service, indicate the <b>maximum number of spaces</b> for which you offer extended hours of child care:</span>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="d-flex justify-start">
          <v-col cols="4" lg="4" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-value pt-1">Type of Service</span>
              </v-col>
              <v-col cols="12" class="d-flex justify-start pb-2 pt-7">
                <span class="summary-label">Group Child Care (Under 36 months)</span>
              </v-col>
              <v-col cols="12" class="d-flex justify-start  pb-2 pt-2">
                <span class="summary-label">Group Child Care (30 Months to School Age)</span>
              </v-col>
              <v-col cols="12" class="d-flex justify-start pb-2 pt-2">
                <span class="summary-label">Group Child Care (School Age/ School Age Care on School Grounds)</span>
              </v-col>
              <v-col cols="12" class="d-flex justify-start pb-2 pt-3">
                <span class="summary-label">Multi-Age Child Care</span>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="4" lg="4" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="5" class="d-flex justify-start">
                <span class="summary-value"><b>4 hours or less </b>extended child care</span>
              </v-col>
              <v-col cols="12" class="d-flex justify-end">
                <v-text-field   :value="this.funding?.groupChildCareUnder36Months4OrLess" class="summary-value" dense flat solo hide-details readonly></v-text-field>
              </v-col>
              <v-col cols="12" class="d-flex">
                <v-text-field   :value="this.funding?.groupChildCare36MonthsToSchoolAge4OrLess" class="summary-value" dense flat solo hide-details readonly></v-text-field>
              </v-col>
              <v-col cols="12" class="d-flex justify-center">
                <v-text-field   :value="this.funding?.groupChildCareSchoolAge4OrLess" class="summary-value" dense flat solo hide-details readonly></v-text-field>
              </v-col>
              <v-col cols="12" class="d-flex justify-center">
                <v-text-field  :value="this.funding?.multiAgeCare4OrLess" class="summary-value" dense flat solo hide-details readonly></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="4" lg="4" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="5" class="d-flex justify-start">
                <span class="summary-value"><b>More than 4 hours</b> extended child care</span>
              </v-col>
              <v-col cols="12" class="d-flex justify-center">
                <v-text-field  :value="this.funding?.groupChildCareUnder36Months4OrMore" class="summary-value" dense flat solo hide-details readonly></v-text-field>
              </v-col>
              <v-col cols="12" class="d-flex justify-center">
                <v-text-field  :value="this.funding?.groupChildCare36MonthsToSchoolAge4OrMore" class="summary-value" dense flat solo hide-details readonly></v-text-field>
              </v-col>
              <v-col cols="12" class="d-flex justify-center">
                <v-text-field  :value="this.funding?.groupChildCareSchoolAge4OrMore" class="summary-value" dense flat solo hide-details readonly></v-text-field>
              </v-col>
              <v-col cols="12" class="d-flex justify-center">
                <v-text-field  :value="this.funding?.multiAgeCare4more" class="summary-value" dense flat solo hide-details readonly></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-row>
      <v-row v-if="!isValidForm" class="d-flex justify-start">
        <v-col cols="6" lg="4" class="pb-0 pt-0 ml-2">
          <v-row  no-gutters class="d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start">

              <!-- ccof base funding CAN be undefined if new app, so send them to page before if that is the case.  -->
              <a :href="this.PATHS.family.orgInfo" v-if=" !getCCOFBaseFundingGuid() && this.summaryModel.application.organizationProviderType == 'FAMILY'"> <span style="color:#ff5252; text-underline: black"><u>Click here to fix the issue(s)- Text TBD</u></span></a>
              <a :href="this.PATHS.family.fundAmount + '/' + getCCOFBaseFundingGuid()" v-else-if="getCCOFBaseFundingGuid() && this.summaryModel.application.organizationProviderType == 'FAMILY'"> <span style="color:#ff5252; text-underline: black"><u>Click here to fix the issue(s)- Text TBD</u></span></a>
              <a :href="this.PATHS.group.fundAmount + '/' + getCCOFBaseFundingGuid()" v-else-if="getCCOFBaseFundingGuid() && this.summaryModel.application.organizationProviderType == 'GROUP'"> <span style="color:#ff5252; text-underline: black"><u>Click here to fix the issue(s)- Text TBD</u></span></a>
              <a :href="this.PATHS.group.facInfo + '/' + facilityId" v-else > <span style="color:#ff5252; text-underline: black"><u>Click here to fix the issue(s)- Text TBD</u></span></a>
              <!-- <a :href="this.PATHS.group.facInfo + '/' + facilityId" v-else> <span style="color:#ff5252; text-underline: black"><u>Click here to fix the issue(s)- Text TBD</u></span></a> -->
            </v-col>
          </v-row>
        </v-col>
      </v-row>


      <!-- <v-row v-if="!isValidForm" class="d-flex justify-start">
        <v-col cols="6" lg="4" class="pb-0 pt-0">
          <v-row  no-gutters class="d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start">
              <a :href="PATHS.group.orgInfo" > <span style="color:#ff5252; text-underline: black"><u>Click here to fix the issue(s)- Text TBD</u></span></a>
            </v-col>
          </v-row>
        </v-col>
      </v-row> -->
    </v-expansion-panel-content>
    </v-form>
  </v-row>
</template>
<script>
import {PATHS} from '@/utils/constants';
import rules from '@/utils/rules';
import {mapState} from 'vuex';

export default {
  name: 'CCOFSummary',
  props: {
    funding: {
      type: Object,
      required: true
    },
    facilityId: {
      type: String,
      required: true
    },
  },
  methods: {
    calculateTotal() {
      let total = 0;
      total = (this.funding.monday + this.funding.tusday + this.funding.wednesday + this.funding.thursday + this.funding.friday);
      return total;
    },
    getCCOFBaseFundingGuid(){
      for (const fac of this.navBarList){
        //console.log(this.facilityId, 'fac ID prop');
        if (fac.facilityId === this.facilityId){
          //console.log('!!');
          return fac.ccofBaseFundingId; //this COULD be undefined, if user has filled nothing and tries to go to decleration so check for undefined above
        }
      }
    },
  },
  computed: {
    ...mapState('summaryDeclaration', ['summaryModel',]),
    ...mapState('app', ['navBarList',]),
  },
  data() {
    return {
      PATHS,
      rules,
      isValidForm: true,
      route_funding:PATHS.group.fundAmount+'/'+this.facilityId,
    };
  },
  mounted() {
    this.$emit('isSummaryValid', 'CCOFSummary', this.isValidForm);
  },
  watch: {
    isValidForm: {
      handler: function (val) {
        this.$emit('isSummaryValid', 'CCOFSummary', val);
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
>>>.summary-value .v-label {
  color: #ff5252;
  opacity: 1;
}
>>>::placeholder {
  color: #ff5252!important;
  opacity: 1;
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
  font-weight: bold
}

</style>
