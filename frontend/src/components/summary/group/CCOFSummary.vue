<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-form ref="ccofSummaryForm" v-model="isValidForm">
    <v-expansion-panel-header>
      <h4 style="color:#003466;">Child Care Operating Funding (CCOF)
        <v-icon v-if="isValidForm" color="green" large>mdi-check-circle-outline</v-icon>
        <v-icon v-if="!isValidForm" color="#ff5252" large>mdi-alert-circle-outline</v-icon>
        <span v-if="!isValidForm" style="color:#ff5252;">Your form is missing required information. Click here to view.</span>
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
            <v-row v-if ="this.funding?.hasClosedMonth?.toUpperCase() == 'YES'" no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label pt-3">Months where ALL of the programs at this facility are closed for the entire month: </span>
              </v-col>
              <v-col cols="4" v-if="this.funding?.closedIn1" class="d-flex justify-start">
                <v-text-field  value="January" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
              </v-col>
              <v-col cols="4" v-if="this.funding?.closedIn2" class="d-flex justify-start">
                <v-text-field  value="February" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
              </v-col>
              <v-col cols="4" v-if="this.funding?.closedIn3" class="d-flex justify-start">
                <v-text-field  value="March" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
              </v-col>
              <v-col cols="4" v-if="this.funding?.closedIn4" class="d-flex justify-start">
                <v-text-field  value="April" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
              </v-col>
              <v-col cols="4" v-if="this.funding?.closedIn5" class="d-flex justify-start">
                <v-text-field  value="May" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
              </v-col>
              <v-col cols="4" v-if="this.funding?.closedIn6" class="d-flex justify-start">
                <v-text-field  value="June" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
              </v-col>
              <v-col cols="4" v-if="this.funding?.closedIn7" class="d-flex justify-start">
                <v-text-field  value="July" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
              </v-col>
              <v-col cols="4" v-if="this.funding?.closedIn8" class="d-flex justify-start">
                <v-text-field value="August" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
              </v-col>
              <v-col cols="4" v-if="this.funding?.closedIn9" class="d-flex justify-start">
                <v-text-field  value="September" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
              </v-col>
              <v-col cols="4" v-if="this.funding?.closedIn10" class="d-flex justify-start">
                <v-text-field  value="October" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
              </v-col>
              <v-col cols="4" v-if="this.funding?.closedIn11" class="d-flex justify-start">
                <v-text-field  value="November" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
              </v-col>
              <v-col cols="4"  v-if="this.funding?.closedIn12" class="d-flex justify-start">
                <v-text-field value="December" class="summary-value" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
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
                <span class="summary-label">Maximum Licensed Capacity</span>
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
        <span v-if="this.funding?.maxPreschool > 0">
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
          </v-row>
        </span>
        <v-row v-if="this.funding?.maxGroupChildCareSchool > 0" class="pb-0 pt-0">
          <v-col cols="6" lg="6" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="6" class="d-flex justify-start">
                <span class="summary-label pt-1">Is the facility located on school property?</span>
              </v-col>
              <v-col cols="6" class="d-flex justify-start">
                <v-text-field placeholder="Required" :value="this.funding?.isSchoolProperty?.toUpperCase()" class="summary-value ml-n5" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
              </v-col>
            </v-row>
            <span v-if="this.funding?.maxGroupChildCareSchool > 0 && this.funding?.isSchoolProperty?.toUpperCase() === 'YES'">
              <v-row no-gutters class="d-flex justify-start">
                <v-col cols="12" class="d-flex justify-start">
                  <span class="summary-label pt-1">Please indicate each service that your facility offers:</span>
                </v-col>
              </v-row>
              <v-row no-gutters class="d-flex justify-start">
                <v-col cols="12" class="d-flex justify-start">
                  <v-text-field placeholder="Required" :value="schoolPropertyLabel" class="summary-value ml-n5 pl-2" dense flat solo hide-details readonly :rules="rules.required" ></v-text-field>
                </v-col>
              </v-row>
            </span>
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
        <span v-if="this.funding?.isExtendedHours?.toUpperCase() === 'YES'">
          <v-row class="d-flex justify-start">
            <v-col cols="6" lg="6" class="pb-0 pt-0">
              <v-row no-gutters class="d-flex justify-start">
                <v-col cols="12" class="d-flex justify-start pb-2 pt-7">
                  <span class="summary-label">Maximum number of days per week you offer extended hours of child care?</span>
                </v-col>
                <v-col cols="12" class="d-flex justify-start  pb-2 pt-2">
                  <span class="summary-label">Maximum number of weeks per year you offer extended hours of child care?</span>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="4" lg="4" class="pb-0 pt-3">
              <v-row no-gutters class="d-flex justify-start">

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
                <v-text-field   :value="this.funding?.extendedChildCareUnder36Months4OrLess" class="summary-value" dense flat solo hide-details readonly></v-text-field>
              </v-col>
              <v-col cols="12" class="d-flex">
                <v-text-field   :value="this.funding?.extendedChildCare36MonthsToSchoolAge4OrLess" class="summary-value" dense flat solo hide-details readonly></v-text-field>
              </v-col>
              <v-col cols="12" class="d-flex justify-center">
                <v-text-field   :value="this.funding?.extendedChildCareSchoolAge4OrLess" class="summary-value" dense flat solo hide-details readonly></v-text-field>
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
                <v-text-field  :value="this.funding?.extendedChildCareUnder36Months4OrMore" class="summary-value" dense flat solo hide-details readonly></v-text-field>
              </v-col>
              <v-col cols="12" class="d-flex justify-center">
                <v-text-field  :value="this.funding?.extendedChildCare36MonthsToSchoolAge4OrMore" class="summary-value" dense flat solo hide-details readonly></v-text-field>
              </v-col>
              <v-col cols="12" class="d-flex justify-center">
                <v-text-field  :value="this.funding?.extendedChildCareSchoolAge4OrMore" class="summary-value" dense flat solo hide-details readonly></v-text-field>
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
              <router-link :to="this.getRoutingPath()"> <span style="color:#ff5252; text-underline: black"><u>To add this information, click here. This will bring you to a different page.</u></span></router-link >
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
import { PATHS, pcfUrlGuid, pcfUrl, changeUrlGuid } from '../../../utils/constants.js';
import rules from '../../../utils/rules.js';


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
    changeRecGuid: {
      type: String,
      required: false
    },
    programYearId: {
      type: String,
      required: false
    }
  },
  methods: {
    calculateTotal() {
      let total = 0;
      total = (this.funding.monday + this.funding.tusday + this.funding.wednesday + this.funding.thursday + this.funding.friday);
      return total;
    },
    getRoutingPath(){
      if(!this.funding.ccofBaseFundingId && this.summaryModel.application.organizationProviderType == 'FAMILY'){
        return pcfUrl(PATHS.CCOF_FAMILY_ORG ,this.programYearId);
      }
      else if(this.funding.ccofBaseFundingId && this.summaryModel.application.organizationProviderType == 'FAMILY'){
        pcfUrlGuid(PATHS.CCOF_FAMILY_FUNDING, this.programYearId, this.funding.ccofBaseFundingId);
      }
      else if(this.isChangeRequest){
        return changeUrlGuid(PATHS.CCOF_GROUP_FUNDING, this.changeRecGuid, this.funding.ccofBaseFundingId);
      }
      else if(this.funding.ccofBaseFundingId && this.summaryModel.application.organizationProviderType == 'GROUP'){
        return pcfUrlGuid(PATHS.CCOF_GROUP_FUNDING, this.programYearId, this.funding.ccofBaseFundingId);
      }
      else {
        return pcfUrl(PATHS.CCOF_GROUP_FACILITY, this.programYearId);
      }
    },
  },
  computed: {
    ...mapState('summaryDeclaration', ['summaryModel', 'isLoadingComplete',]),
    ...mapState('navBar', ['navBarList',]),
    schoolPropertyLabel() {
      const arr = [];
      if (this.funding?.beforeSchool) {
        arr.push('BEFORE SCHOOL');
      }
      if (this.funding?.afterSchool) {
        arr.push('AFTER SCHOOL');
      }
      if (this.funding?.beforeKindergarten) {
        arr.push('BEFORE KINDERGARTEN');
      }
      if (this.funding?.afterKindergarten) {
        arr.push('AFTER KINDERGARTEN');
      }
      return String(arr);
    }
  },
  data() {
    return {
      isChangeRequest: isChangeRequest(this),
      PATHS,
      rules,
      isValidForm: true,
      formObj:{
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
