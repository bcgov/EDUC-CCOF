<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-expansion-panel-header>
      <h4 style="color:#003466;">Uploaded Documents</h4>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row no-gutters class="d-flex flex-column">
        <v-row class="d-flex justify-start">
          <v-col cols="6" lg="4" class="pb-0 pt-2">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="10" class="d-flex justify-start">
                <span class="summary-label">Licence: </span>
                <span class="summary-value">Licence File name</span>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="8" lg="6" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <span class="summary-label">Supporting Documents:</span>
                <span class="summary-value">SupportingDocumentsCommaSeparated:</span>
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
  name: 'UploadedDocumentsSummary',




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
