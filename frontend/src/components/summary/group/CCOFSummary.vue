<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-row class="d-flex justify-start pt-0">
      <v-col cols="12" class="d-flex justify-start">
        <h4 style="color:#003466;">Child Care Operating Funding (CCOF)</h4>
      </v-col>
    </v-row>
    <v-row no-gutters class="d-flex flex-column">
      <v-row class="d-flex justify-start">
        <v-col cols="8" lg="6" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start">
              <span class="summary-label">Maximum number of <b>days per week</b> you provide child care: </span>
              <span class="summary-value">##</span>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6" lg="4" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start">
              <span class="summary-label">Maximum number of <b>weeks per year</b> you provide child care: </span>
              <span class="summary-value">##</span>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-start">
        <v-col cols="8" lg="6" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="10" class="d-flex justify-start">
              <span class="summary-label">Are there months when ALL of the programs at this facility are closed for the entire month? </span>
              <span class="summary-value-small"> YES</span>
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
              <span class="summary-value-small">fromtime</span>
            </v-col>
            <v-col class="d-flex justify-start">
              <span class="summary-label">To:</span>
              <span class="summary-value-small">toTime</span>
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
              <span class="summary-value">#Maximum Licenced Capacity</span>
            </v-col>
            <v-col cols="10" class="d-flex justify-start pb-2 pt-2">
              <span class="summary-value">#(Under 36 months)</span>
            </v-col>
            <v-col cols="10" class="d-flex justify-start pb-2 pt-2">
              <span class="summary-value">#(30 Months to School Age)</span>
            </v-col>
            <v-col cols="10" class="d-flex justify-start pb-2 pt-2">
              <span class="summary-value">#Preschool</span>
            </v-col>
            <v-col cols="10" class="d-flex justify-start pb-2 pt-2">
              <span class="summary-value">#(School Age/ School Age Care on School Grounds)</span>
            </v-col>
            <v-col cols="10" class="d-flex justify-start pb-2">
              <span class="summary-value">#Multi-AgeChildCare</span>
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
              <span class="summary-value">#Monday</span>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="2" lg="1" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start">
              <span class="summary-label">Tuesday</span>
            </v-col>
            <v-col cols="1" class="d-flex justify-left">
              <span class="summary-value">#Tuesday</span>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="2" lg="1" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start">
              <span class="summary-label">Wednesday</span>
            </v-col>
            <v-col cols="1" class="d-flex justify-left">
              <span class="summary-value">#Wednesday</span>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="2" lg="1" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start">
              <span class="summary-label">Thursday</span>
            </v-col>
            <v-col cols="1" class="d-flex justify-left">
              <span class="summary-value">#Thursday</span>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="2" lg="1" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start">
              <span class="summary-label">Friday</span>
            </v-col>
            <v-col cols="1" class="d-flex justify-left">
              <span class="summary-value">#Friday</span>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="2" lg="1" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start">
              <span class="summary-label">Total</span>
            </v-col>
            <v-col cols="1" class="d-flex justify-left">
              <span class="summary-value">#Total</span>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="4" lg="3" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="10" class="d-flex justify-start">
              <span class="summary-label">Is the facility located on school property?</span>
            </v-col>
            <v-col cols="1" class="d-flex justify-left">
              <span class="summary-value-small">#Yes</span>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-start">
        <v-col cols="12" lg="12" class="pb-0 pt-0">
          <v-row  no-gutters class="d-flex justify-start pt-2">
            <v-col cols="5" class="d-flex justify-start">
              <span class="summary-label">Do you <b>regularly offer</b> extended daily hours of child care <b>(before 6am, after 7pm or overnight)</b>?</span>
            </v-col>
            <v-col class="d-flex justify-start">
              <span class="summary-value-small">#Yes</span>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-start">
        <v-col cols="12" lg="12" class="pb-0 pt-0">
          <v-row  no-gutters class="d-flex justify-start">
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
              <span class="summary-value">#(Under 36 months)</span>
            </v-col>
            <v-col cols="12" class="d-flex justify-center pb-2 pt-2">
              <span class="summary-value">#(30 Months to School Age)</span>
            </v-col>
            <v-col cols="12" class="d-flex justify-center pb-2 pt-2">
              <span class="summary-value">#(School Age/ School Age Care on School Grounds)</span>
            </v-col>
            <v-col cols="12" class="d-flex justify-center pb-2 pt-2">
              <span class="summary-value">#Multi-AgeChildCare</span>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="4" lg="4" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-center">
            <v-col cols="5" class="d-flex justify-center">
              <span class="summary-value"><b>More than 4 hours</b> extended child care</span>
            </v-col>
            <v-col cols="12" class="d-flex justify-center pb-2 pt-2">
              <span class="summary-value">#(Under 36 months)</span>
            </v-col>
            <v-col cols="12" class="d-flex justify-center pb-2 pt-2">
              <span class="summary-value">#(30 Months to School Age)</span>
            </v-col>
            <v-col cols="12" class="d-flex justify-center pb-2 pt-2">
              <span class="summary-value">#(School Age/ School Age Care on School Grounds)</span>
            </v-col>
            <v-col cols="12" class="d-flex justify-center pb-2 pt-2">
              <span class="summary-value">#Multi-AgeChildCare</span>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-row>
  </v-row>
</template>
<script>
export default {
  props: {
    programYear: {
      type: String,
      required: true
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
