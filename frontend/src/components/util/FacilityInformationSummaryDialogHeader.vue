<template>
  <v-card class="facility-info pa-4 pb-2">
    <v-row no-gutters>
      <v-col cols="12">
        <div class="summary-label">Facility Name</div>
        <v-textarea
          placeholder="Required"
          :model-value="facilityInfo.facilityName"
          class="summary-value"
          auto-grow
          rows="2"
          density="compact"
          flat
          variant="solo"
          hide-details
          readonly
        />
      </v-col>
      <v-col cols="12" md="3">
        <div class="summary-label">Facility ID</div>
        <!-- Facility ID is assigned in dynamics, and may not exist as far as I know, so no required is implemented here -- JB -->
        <v-text-field
          :model-value="facilityInfo?.facilityAccountNumber"
          class="summary-value"
          density="compact"
          flat
          variant="solo"
          hide-details
          readonly
        />
      </v-col>
      <v-col cols="12" md="3">
        <div class="summary-label">Licence Number</div>
        <v-text-field
          placeholder="Required"
          :model-value="facilityInfo?.licenseNumber"
          class="summary-value"
          density="compact"
          flat
          variant="solo"
          hide-details
          readonly
        />
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12" md="6">
        <div class="summary-label">Licence Categories</div>
        <v-textarea
          :model-value="licenseCategories"
          class="summary-value"
          density="compact"
          flat
          variant="solo"
          hide-details
          readonly
          no-resize
          rows="3"
        />
      </v-col>
      <v-col cols="12" md="3">
        <div class="summary-label">CCFRI</div>
        <v-text-field
          placeholder="Required"
          :model-value="getOptInOptOut(ccfriStatus)"
          class="summary-value"
          density="compact"
          flat
          variant="solo"
          hide-details
          readonly
        />
      </v-col>
      <v-col cols="12" md="3">
        <div class="summary-label">ECE-WE</div>
        <v-text-field
          placeholder="Required"
          :model-value="getOptInOptOut(eceweStatus)"
          class="summary-value"
          density="compact"
          flat
          variant="solo"
          hide-details
          readonly
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import summaryMixin from '@/mixins/summaryMixin.js';

export default {
  name: 'FacilityInformationSummaryDialogHeader',
  mixins: [summaryMixin],
  props: {
    facilityInfo: {
      type: Object,
      required: true,
    },
    ccfriStatus: {
      type: Number,
      default: 0,
    },
    eceweStatus: {
      type: Number,
      default: 0,
    },
    licenseCategories: {
      type: String,
      default: '',
    },
  },
};
</script>
<style scoped>
.facility-info {
  border-top: 5px solid grey !important;
}
:deep(::placeholder) {
  color: #d8292f !important;
  opacity: 1 !important;
}
:deep(.v-field__input) {
  padding-left: 0px;
}
</style>
