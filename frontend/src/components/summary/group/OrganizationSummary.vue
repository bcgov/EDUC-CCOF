<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-expansion-panel-header>
      <h4 style="color:#003466;">Organization Information</h4>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row no-gutters class="d-flex flex-column">
        <v-row class="d-flex justify-start">
          <v-col cols="8" lg="5" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label" >Legal Name (first, middle and last) or Organization (As it appears in BC Corporate Registry)</span>
              </v-col>
              <v-col  class="d-flex justify-start">
                <span  class="summary-value">{{this.summaryModel?.organization?.legalName}}</span>
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
              <v-col cols="12" class="d-flex justify-start">
                <span  class="summary-value"> {{this.summaryModel?.organization?.address1}}</span>
              </v-col>
              <v-col class="d-flex justify-start">
                <span  class="summary-value">{{this.summaryModel?.organization?.address2}}</span>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6" lg="4" class="pb-0 pt-0">
            <v-row  no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label">Organization Contact Name</span>
              </v-col>
              <v-col class="d-flex justify-start">
                <span class="summary-value">{{this.summaryModel?.application?.orgContactName}}</span>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6" lg="4" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start flex-column">
              <v-col cols="10" class="d-flex justify-start">
                <span class="summary-label">Position</span>
              </v-col>
              <v-col class="d-flex justify-start">
                <span  class="summary-value">{{this.summaryModel?.organization?.position}}</span>
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
                <span  class="summary-value">{{this.summaryModel?.organization?.city1}}</span>
              </v-col>
              <v-col cols="5" class="d-flex justify-start">
                <span  class="summary-value">{{this.summaryModel?.organization?.postalCode1}}</span>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6" lg="4" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label">Business phone</span>
              </v-col>
              <v-col class="d-flex justify-start">
                <span  class="summary-value">{{this.summaryModel?.organization?.phone}}</span>
              </v-col>
            </v-row>
          </v-col>
          <v-col  cols="6" lg="4" class="pb-0 pt-0">
            <v-row  no-gutters class="d-flex justify-start">
              <v-col cols="10" class="d-flex justify-start">
                <span class="summary-label">E-mail Address of Signing Authority</span>
              </v-col>
              <v-col class="d-flex justify-start">
                <span  class="summary-value">{{this.summaryModel?.organization?.email}}</span>
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
                <span  class="summary-value">{{this.summaryModel?.application?.organizationProviderType}}</span>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6" lg="4" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="10" class="d-flex justify-start">
                <span class="summary-label">Business BCeID</span>
              </v-col>
              <v-col class="d-flex justify-start">
                <span class="summary-value">Businessbceid</span>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="4" lg="3" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="10" class="d-flex justify-start">
                <span class="summary-label">Incorporation Number</span>
              </v-col>
              <v-col class="d-flex justify-start">
                <span  class="summary-value">{{this.summaryModel?.organization?.incNumber}}</span>
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
    programYear: {
      type: String,
      required: true
    },
    summaryModel: {
      type: Object,
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

