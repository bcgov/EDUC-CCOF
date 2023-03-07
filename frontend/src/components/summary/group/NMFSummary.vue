<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-expansion-panel-header>
      <h4 style="color:#003466;">NMF</h4>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
    <v-row no-gutters class="d-flex flex-column">
      <v-row class="d-flex justify-start">
        <v-col cols="8" lg="6" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="10" class="d-flex justify-start">
              <span class="summary-label">For the {{this.program_year}} funding term, would you like to opt-in to ECE-WE for any facility in your organization</span>
            </v-col>
            <v-col class="d-flex justify-start">
              <span class="summary-value-small">#Yes</span>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-start">
        <v-col cols="8" lg="6" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="10" class="d-flex justify-start">
              <span class="summary-label">Do any of the ECE employees at any facility in your organization belong to a union</span>
            </v-col>
            <v-col class="d-flex justify-left">
              <span class="summary-value-small">#Yes</span>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-start">
        <v-col cols="8" lg="6" class="pb-0 pt-0">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="3" class="d-flex justify-start">
              <span class="summary-label">Funding model:</span>
            </v-col>
            <v-col class="d-flex justify-start ml-n15">
              <span class="summary-value-small">##All of our facilities have provincially funded ECEs and receive Low</span>
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
  watch:{
    programYear: function (val) {
      this.program_year = val;
    }

  },
  props: {
    programYear: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      program_year: null,
    };
  },
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

