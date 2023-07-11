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
    <v-expansion-panel-content eager>
      <v-row no-gutters class="d-flex flex-column pb-1 pt-1 ml-2">
        <v-row class="d-flex justify-start ">
          <v-col cols="8" lg="6" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label pt-3">Maximum number of <b>days per week</b> you provide child care: </span>
                <v-text-field placeholder="Required" :value="this.funding?.maxDaysPerWeek" class="summary-value ma-0 pa-0 px-0" dense flat solo hide-details readonly :rules="rules.required"></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6" lg="4" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label pt-3">Maximum number of <b>weeks per year</b> you provide child care: </span>
                <v-text-field placeholder="Required" :value="this.funding?.maxWeeksPerYear" class="summary-value" dense flat solo hide-details readonly :rules="rules.required"></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="d-flex justify-start">
          <v-col cols="8" lg="6" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label pt-3">Are there months when ALL of the programs at this facility are closed for the entire month? </span>
              </v-col>
              <v-col cols="12" class="d-flex justify-start">
                <v-text-field placeholder="Required" :value="this.funding?.hasClosedMonth?.toUpperCase()" class="summary-value" dense flat solo hide-details readonly :rules="rules.required"></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="8" lg="6" class="pb-0 pt-0">
            <v-row v-if="this.funding?.hasClosedMonth?.toUpperCase() == 'YES'" no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label pt-3">Months where ALL of the programs at this facility are closed for the entire month: </span>
              </v-col>
              <v-col cols="4" v-if="this.funding?.closedIn1" class="d-flex justify-start">
                <v-text-field value="January" class="summary-value" dense flat solo hide-details readonly :rules="rules.required"></v-text-field>
              </v-col>
              <v-col cols="4" v-if="this.funding?.closedIn2" class="d-flex justify-start">
                <v-text-field value="February" class="summary-value" dense flat solo hide-details readonly :rules="rules.required"></v-text-field>
              </v-col>
              <v-col cols="4" v-if="this.funding?.closedIn3" class="d-flex justify-start">
                <v-text-field value="March" class="summary-value" dense flat solo hide-details readonly :rules="rules.required"></v-text-field>
              </v-col>
              <v-col cols="4" v-if="this.funding?.closedIn4" class="d-flex justify-start">
                <v-text-field value="April" class="summary-value" dense flat solo hide-details readonly :rules="rules.required"></v-text-field>
              </v-col>
              <v-col cols="4" v-if="this.funding?.closedIn5" class="d-flex justify-start">
                <v-text-field value="May" class="summary-value" dense flat solo hide-details readonly :rules="rules.required"></v-text-field>
              </v-col>
              <v-col cols="4" v-if="this.funding?.closedIn6" class="d-flex justify-start">
                <v-text-field value="June" class="summary-value" dense flat solo hide-details readonly :rules="rules.required"></v-text-field>
              </v-col>
              <v-col cols="4" v-if="this.funding?.closedIn7" class="d-flex justify-start">
                <v-text-field value="July" class="summary-value" dense flat solo hide-details readonly :rules="rules.required"></v-text-field>
              </v-col>
              <v-col cols="4" v-if="this.funding?.closedIn8" class="d-flex justify-start">
                <v-text-field value="August" class="summary-value" dense flat solo hide-details readonly :rules="rules.required"></v-text-field>
              </v-col>
              <v-col cols="4" v-if="this.funding?.closedIn9" class="d-flex justify-start">
                <v-text-field value="September" class="summary-value" dense flat solo hide-details readonly :rules="rules.required"></v-text-field>
              </v-col>
              <v-col cols="4" v-if="this.funding?.closedIn10" class="d-flex justify-start">
                <v-text-field value="October" class="summary-value" dense flat solo hide-details readonly :rules="rules.required"></v-text-field>
              </v-col>
              <v-col cols="4" v-if="this.funding?.closedIn11" class="d-flex justify-start">
                <v-text-field value="November" class="summary-value" dense flat solo hide-details readonly :rules="rules.required"></v-text-field>
              </v-col>
              <v-col cols="4" v-if="this.funding?.closedIn12" class="d-flex justify-start">
                <v-text-field value="December" class="summary-value" dense flat solo hide-details readonly :rules="rules.required"></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4" lg="6" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="4" class="d-flex justify-start flex-nowrap">
                <span class="summary-label pt-3">Facility hours of operation:</span>
              </v-col>
              <v-col class="d-flex justify-start">
                <span class="summary-label pt-3">From:</span>
                <v-text-field placeholder="Required" :value="this.funding?.hoursFrom12hr" class="summary-value" dense flat solo hide-details readonly :rules="rules.required"></v-text-field>
              </v-col>
              <v-col class="d-flex justify-start">
                <span class="summary-label pt-3">To:</span>
                <v-text-field placeholder="Required" :value="this.funding?.hoursTo12hr" class="summary-value" dense flat solo hide-details readonly :rules="rules.required"></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row class="d-flex justify-start">
          <v-col cols="4" lg="4" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start pb-2 pt-7">
                <span class="summary-label">Maximum number of child care spaces you offer</span>
              </v-col>
              <v-col cols="12" class="d-flex justify-start  pb-2 pt-2">
                <span class="summary-label">Maximum licensed capacity </span>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="4" lg="4" class="pb-0 pt-3">
            <v-row no-gutters class="d-flex justify-start">

              <v-col cols="12" class="d-flex justify-center">
                <v-text-field :value="this.funding?.maxSpaces" class="summary-value" dense flat solo hide-details readonly></v-text-field>
              </v-col>
              <v-col cols="12" class="d-flex justify-center">
                <v-text-field :value="this.funding?.maxLicensesCapacity" class="summary-value" dense flat solo hide-details readonly></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <br>

        <v-row class="d-flex justify-start">
          <v-col cols="12" lg="12" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start pt-2">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label pt-2">Do you <b>regularly offer</b> extended daily hours of child care <b>(before 6am, after 7pm or overnight)</b>?</span>
              </v-col>
              <v-col cols="12" class="d-flex justify-start">
                <v-text-field placeholder="Required" :value="this.funding?.isExtendedHours?.toUpperCase()" class="summary-value" dense flat solo hide-details readonly :rules="rules.required"></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <span v-if="this.funding?.isExtendedHours?.toUpperCase() === 'YES'">
          <v-row class="d-flex justify-start">
            <v-col cols="6" lg="6" class="pb-0 pt-0">
              <v-row no-gutters class="d-flex justify-start">
                <v-col cols="12" class="d-flex justify-start pb-2 pt-7">
                  <span class="summary-label">Maximum number of spaces you offer extended hours of child care</span>
                </v-col>
                <v-col cols="12" class="d-flex justify-start  pb-2 pt-2">
                  <span class="summary-label">Maximum number of days per week you offer extended hours of child care</span>
                </v-col>
                <v-col cols="12" class="d-flex justify-start pb-2 pt-2">
                  <span class="summary-label">Maximum number of weeks per year you offer extended hours of child care</span>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="4" lg="4" class="pb-0 pt-3">
              <v-row no-gutters class="d-flex justify-start">

                <v-col cols="12" class="d-flex justify-center">
                  <v-text-field placeholder="Required" :rules="rules.required" :value="this.funding?.maxCapacityExtended" class="summary-value" dense flat solo hide-details readonly></v-text-field>
                </v-col>
                <v-col cols="12" class="d-flex justify-center">
                  <v-text-field placeholder="Required" :rules="rules.required" :value="this.funding?.maxDaysPerWeekExtended" class="summary-value" dense flat solo hide-details readonly></v-text-field>
                </v-col>
                <v-col cols="12" class="d-flex justify-center">
                  <v-text-field placeholder="Required" :rules="rules.required" :value="this.funding?.maxWeeksPerYearExtended" class="summary-value" dense flat solo hide-details readonly></v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </span>
        <v-row class="d-flex justify-start mt-2">
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
                <span class="summary-label">Family Child Care (Under 36 months)</span>
              </v-col>
              <v-col cols="12" class="d-flex justify-start  pb-2 pt-2">
                <span class="summary-label">Family Child Care (30 Months to School Age)</span>
              </v-col>
              <v-col cols="12" class="d-flex justify-start pb-2 pt-2">
                <span class="summary-label">Family Child Care (School Age/ School Age Care on School Grounds)</span>
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
                <v-text-field :value="this.funding?.extendedChildCareUnder36Months4OrLess" class="summary-value" dense flat solo hide-details readonly></v-text-field>
              </v-col>
              <v-col cols="12" class="d-flex">
                <v-text-field :value="this.funding?.extendedChildCare36MonthsToSchoolAge4OrLess" class="summary-value" dense flat solo hide-details readonly></v-text-field>
              </v-col>
              <v-col cols="12" class="d-flex justify-center">
                <v-text-field :value="this.funding?.extendedChildCareSchoolAge4OrLess" class="summary-value" dense flat solo hide-details readonly></v-text-field>
              </v-col>
              <v-col cols="12" class="d-flex justify-center">
                <v-text-field :value="this.funding?.multiAgeCare4OrLess" class="summary-value" dense flat solo hide-details readonly></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="4" lg="4" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="5" class="d-flex justify-start">
                <span class="summary-value"><b>More than 4 hours</b> extended child care</span>
              </v-col>
              <v-col cols="12" class="d-flex justify-center">
                <v-text-field :value="this.funding?.extendedChildCareUnder36Months4OrMore" class="summary-value" dense flat solo hide-details readonly></v-text-field>
              </v-col>
              <v-col cols="12" class="d-flex justify-center">
                <v-text-field :value="this.funding?.extendedChildCare36MonthsToSchoolAge4OrMore" class="summary-value" dense flat solo hide-details readonly></v-text-field>
              </v-col>
              <v-col cols="12" class="d-flex justify-center">
                <v-text-field :value="this.funding?.extendedChildCareSchoolAge4OrMore" class="summary-value" dense flat solo hide-details readonly></v-text-field>
              </v-col>
              <v-col cols="12" class="d-flex justify-center">
                <v-text-field :value="this.funding?.multiAgeCare4more" class="summary-value" dense flat solo hide-details readonly></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-row>
      <v-row v-if="!isValidForm" class="d-flex justify-start">
        <v-col cols="6" lg="4" class="pb-0 pt-0 ml-2">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start">

              <!-- ccof base funding CAN be undefined if new app, so send them to page before if that is the case.  -->
              <router-link :to="this.PATHS.family.orgInfo" v-if="!this.funding.ccofBaseFundingId && this.summaryModel.application.organizationProviderType == 'FAMILY'"> <span style="color:#ff5252; text-underline: black"><u>To add this information, click here. This will bring you to a different page.</u></span></router-link>
              <router-link :to="this.PATHS.family.fundAmount + '/' + this.funding.ccofBaseFundingId" v-else-if="this.funding.ccofBaseFundingId && this.summaryModel.application.organizationProviderType == 'FAMILY'"> <span style="color:#ff5252; text-underline: black"><u>To add this information, click here. This will bring you to a different page.</u></span></router-link>
            </v-col>
          </v-row>
        </v-col>
      </v-row>



    </v-expansion-panel-content>
    </v-form>
  </v-row>
</template>
<script>
import { PATHS } from '@/utils/constants';
import rules from '@/utils/rules';
import { mapState } from 'vuex';

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
  },
  computed: {
    ...mapState('summaryDeclaration', ['summaryModel', 'isLoadingComplete']),
    ...mapState('app', ['navBarList',]),
  },
  data() {
    return {
      PATHS,
      rules,
      isValidForm: true,
      formObj: {
        formName: 'CCOFSummary',
        formId: this.funding?.ccofBaseFundingId,
      }

    };
  },

  watch: {
    isLoadingComplete: {
      handler: function (val) {
        if (val) {
          this.$emit('isSummaryValid', this.formObj, this.isValidForm);
        }
      },
    }
  },
};
</script>
<style scoped>.summary-label {
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
  color: #ff5252 !important;
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
}</style>
