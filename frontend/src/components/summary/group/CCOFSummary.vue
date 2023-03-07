<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-expansion-panel-header>
      <h4 style="color:#003466;">Child Care Operating Funding (CCOF)</h4>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row no-gutters class="d-flex flex-column">
        <v-row class="d-flex justify-start">
          <v-col cols="8" lg="6" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label">Maximum number of <b>days per week</b> you provide child care: </span>
                <span class="summary-value">{{ this.funding?.maxDaysPerWeek }}</span>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6" lg="4" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label">Maximum number of <b>weeks per year</b> you provide child care: </span>
                <span class="summary-value">{{ this.funding?.maxWeeksPerYear }}</span>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="d-flex justify-start">
          <v-col cols="8" lg="6" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="10" class="d-flex justify-start">
                <span class="summary-label">Are there months when ALL of the programs at this facility are closed for the entire month? </span>
                <span class="summary-value-small">{{ this.funding?.hasClosedMonth?.toUpperCase() }}</span>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="4" lg="6" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="4" class="d-flex justify-start flex-nowrap">
                <span class="summary-label">Facility hours of operation:</span>
              </v-col>
              <v-col class="d-flex justify-start">
                <span class="summary-label">From:</span>
                <span class="summary-value-small">{{ this.funding?.hoursFrom12hr }}</span>
              </v-col>
              <v-col class="d-flex justify-start">
                <span class="summary-label">To:</span>
                <span class="summary-value-small">{{ this.funding?.hoursTo12hr }}</span>
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
              <v-col cols="10" class="d-flex justify-start pb-2 pt-2">
                <span class="summary-label">Group Child Care (30 Months to School Age)</span>
              </v-col>
              <v-col cols="10" class="d-flex justify-start pb-2 pt-2">
                <span class="summary-label">Preschool</span>
              </v-col>
              <v-col cols="10" class="d-flex justify-start pb-2 pt-2">
                <span class="summary-label">Group Child Care (School Age/ School Age Care on School Grounds)</span>
              </v-col>
              <v-col cols="10" class="d-flex justify-start pb-2 pt-2">
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
                <span class="summary-value">{{ this.funding?.maxLicensesCapacity }}</span>
              </v-col>
              <v-col cols="10" class="d-flex justify-start pb-2 pt-2">
                <span class="summary-value">{{ this.funding?.maxGroupChildCareUnder36 }}</span>
              </v-col>
              <v-col cols="10" class="d-flex justify-start pb-2 pt-2">
                <span class="summary-value">{{ this.funding?.maxGroupChildCare36 }}</span>
              </v-col>
              <v-col cols="10" class="d-flex justify-start pb-2 pt-2">
                <span class="summary-value">{{ this.funding?.maxPreschool }}</span>
              </v-col>
              <v-col cols="10" class="d-flex justify-start pb-2 pt-2">
                <span class="summary-value">{{ this.funding?.maxGroupChildCareSchool }}</span>
              </v-col>
              <v-col cols="10" class="d-flex justify-start pb-2">
                <span class="summary-value">{{ this.funding?.maxGroupChildCareMultiAge }}</span>
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
              <v-col cols="1" class="d-flex justify-left">
                <span class="summary-value">{{ this.funding?.monday }}</span>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="2" lg="1" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label">Tuesday</span>
              </v-col>
              <v-col cols="1" class="d-flex justify-left">
                <span class="summary-value">{{ this.funding?.tusday }}</span>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="2" lg="1" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label">Wednesday</span>
              </v-col>
              <v-col cols="1" class="d-flex justify-left">
                <span class="summary-value">{{ this.funding?.wednesday }}</span>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="2" lg="1" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label">Thursday</span>
              </v-col>
              <v-col cols="1" class="d-flex justify-left">
                <span class="summary-value">{{ this.funding?.thursday }}</span>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="2" lg="1" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label">Friday</span>
              </v-col>
              <v-col cols="1" class="d-flex justify-left">
                <span class="summary-value">{{ this.funding?.friday }}</span>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="2" lg="1" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label">Total</span>
              </v-col>
              <v-col cols="1" class="d-flex justify-left">
                <span class="summary-value">{{ this.calculateTotal() }}</span>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="4" lg="3" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="10" class="d-flex justify-start">
                <span class="summary-label">Is the facility located on school property?</span>
              </v-col>
              <v-col cols="1" class="d-flex justify-left">
                <span class="summary-value-small">{{ this.funding?.isSchoolProperty?.toUpperCase() }}</span>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="d-flex justify-start">
          <v-col cols="12" lg="12" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start pt-2">
              <v-col cols="5" class="d-flex justify-start">
                <span class="summary-label">Do you <b>regularly offer</b> extended daily hours of child care <b>(before 6am, after 7pm or overnight)</b>?</span>
              </v-col>
              <v-col class="d-flex justify-start">
                <span class="summary-value-small">{{ this.funding?.isExtendedHours?.toUpperCase() }}</span>
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
          <v-col cols="4" lg="3" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="10" class="d-flex justify-start">
                <span class="summary-value">Type of Service</span>
              </v-col>
              <v-col cols="12" class="d-flex justify-start pb-2 pt-7">
                <span class="summary-label">Group Child Care (Under 36 months)</span>
              </v-col>
              <v-col cols="12" class="d-flex justify-start pb-2 pt-2">
                <span class="summary-label">Group Child Care (30 Months to School Age)</span>
              </v-col>
              <v-col cols="12" class="d-flex justify-start pb-2 pt-2">
                <span class="summary-label">Group Child Care (School Age/ School Age Care on School Grounds)</span>
              </v-col>
              <v-col cols="12" class="d-flex justify-start pb-2 pt-2">
                <span class="summary-label">Multi-Age Child Care</span>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="4" lg="4" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-center">
              <v-col cols="4" class="d-flex justify-center">
                <span class="summary-value"><b>4 hours or less </b>extended child care</span>
              </v-col>
              <v-col cols="12" class="d-flex justify-center pb-1 pt-1">
                <span class="summary-value">{{ this.funding?.groupChildCareUnder36Months4OrLess }}</span>
              </v-col>
              <v-col cols="12" class="d-flex justify-center pb-2 pt-2">
                <span class="summary-value">{{ this.funding?.groupChildCare36MonthsToSchoolAge4OrLess }}</span>
              </v-col>
              <v-col cols="12" class="d-flex justify-center pb-2 pt-2">
                <span class="summary-value">{{ this.funding?.groupChildCareSchoolAge4OrLess }}</span>
              </v-col>
              <v-col cols="12" class="d-flex justify-center pb-2 pt-2">
                <span class="summary-value">{{ this.funding?.multiAgeCare4OrLess }}</span>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="4" lg="4" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-center">
              <v-col cols="5" class="d-flex justify-center">
                <span class="summary-value"><b>More than 4 hours</b> extended child care</span>
              </v-col>
              <v-col cols="12" class="d-flex justify-center pb-2 pt-2">
                <span class="summary-value">{{ this.funding?.groupChildCareUnder36Months4OrMore }}</span>
              </v-col>
              <v-col cols="12" class="d-flex justify-center pb-2 pt-2">
                <span class="summary-value">{{ this.funding?.groupChildCare36MonthsToSchoolAge4OrMore }}</span>
              </v-col>
              <v-col cols="12" class="d-flex justify-center pb-2 pt-2">
                <span class="summary-value">{{ this.funding?.groupChildCareSchoolAge4OrMore }}</span>
              </v-col>
              <v-col cols="12" class="d-flex justify-center pb-2 pt-2">
                <span class="summary-value">{{ this.funding?.multiAgeCare4more }}</span>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-row>
    </v-expansion-panel-content>
  </v-row>
</template>
<script>
export default {
  name: 'CCOFSummary',
  props: {
    funding: {
      type: Object,
      required: true
    }
  },
  methods: {
    calculateTotal() {
      let total = 0;
      total = (this.funding.monday + this.funding.tusday + this.funding.wednesday + this.funding.thursday + this.funding.friday);
      return total;
    },
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

.summary-value-small {
  color: black;
  font-size: small;
  font-weight: bold
}
</style>
