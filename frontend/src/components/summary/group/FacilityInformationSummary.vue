<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-expansion-panel-header>
      <h4 style="color:#003466;">Facility Information</h4>
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
              <span  class="summary-value">{{ this.facilityInfo?.facilityName }}</span>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6" lg="4" class="pb-0 pt-0">
          <v-row  no-gutters class="d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start">
              <span class="summary-label">Year Facility Began Operation (YYYY)</span>
            </v-col>
            <v-col class="d-flex justify-start">
              <span  class="summary-value">{{ this.facilityInfo?.yearBeganOperation }}</span>
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
              <span  class="summary-value">{{ this.facilityInfo?.facilityAddress }}</span>
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
              <span class="summary-value">{{ this.facilityInfo?.contactName }}</span>
            </v-col>
            <v-col class="d-flex justify-start">
              <span  class="summary-value">{{ this.facilityInfo?.position }}</span>
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
              <span  class="summary-value">{{ this.facilityInfo?.city }}</span>
            </v-col>
            <v-col cols="6" class="d-flex justify-start">
              <span  class="summary-value">{{ this.facilityInfo?.postalCode }}</span>
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
              <span  class="summary-value">{{ this.facilityInfo?.phone }}</span>
            </v-col>
            <v-col cols="6" class="d-flex justify-start">
              <span  class="summary-value">{{ this.facilityInfo?.email }}</span>
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
              <span  class="summary-value">{{ this.facilityInfo?.licenseNumber }}</span>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6" lg="4" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start pt-2 flex-column">
            <v-col cols="10" class="d-flex justify-start">
              <span class="summary-label">Effective Date of Current Licence (YYYY-MM-DD)</span>
            </v-col>
            <v-col class="d-flex justify-start">
              <span class="summary-value">{{ this.facilityInfo?.licenseEffectiveDate }}</span>
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
  props: {
    facilityInfo: {
      type: Object,
      required: true
    }
  }
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
