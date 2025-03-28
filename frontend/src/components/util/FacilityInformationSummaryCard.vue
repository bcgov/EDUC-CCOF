<template>
  <v-card :class="facility.isComplete ? 'success-card' : 'error-card'" elevation="4">
    <div class="px-2 py-4">
      <v-row no-gutters>
        <v-col cols="8" class="px-2">
          <div class="summary-label">Facility Name</div>
          <div :class="facility.facilityName ? '' : 'text-error'" class="summary-value">
            {{ facility.facilityName ?? 'Required' }}
          </div>
        </v-col>
        <v-col cols="3" class="px-2">
          <div class="summary-label">Facility ID</div>
          <div class="summary-value">
            {{ facility.facilityAccountNumber ?? '--' }}
          </div>
        </v-col>
        <v-col cols="1" class="d-flex justify-end">
          <v-icon size="small">mdi-open-in-new</v-icon>
        </v-col>
      </v-row>
      <v-row no-gutters class="pt-2">
        <v-col cols="6" md="4" class="px-2">
          <div class="summary-label">Licence Number</div>
          <div :class="facility.licenseNumber ? '' : 'text-error'" class="summary-value">
            {{ facility.licenseNumber ?? 'Required' }}
          </div>
        </v-col>
        <v-col cols="6" md="4" class="px-2">
          <div class="summary-label">CCFRI</div>
          <div :class="facility.ccfriOptInStatus != null ? '' : 'text-error'" class="summary-value">
            {{ getOptInOptOut(facility.ccfriOptInStatus) ?? 'Required' }}
          </div>
        </v-col>
        <v-col cols="6" md="4" class="px-2">
          <div class="summary-label">ECE-WE</div>
          <div :class="facility.eceweOptInStatus != null ? '' : 'text-error'" class="summary-value">
            {{ getOptInOptOut(facility.eceweOptInStatus) ?? 'Required' }}
          </div>
        </v-col>
      </v-row>
      <v-row no-gutters class="pa-2 pb-0">
        <template v-if="facility.isComplete">
          <v-icon class="text-success" size="large"> mdi-check-circle-outline </v-icon>
          <span class="text-success pl-2">Click here to view.</span>
        </template>
        <template v-else>
          <v-icon class="text-error" size="large"> mdi-alert-circle-outline </v-icon>
          <span class="text-error pl-2"> Your form is missing required information. Click here to view. </span>
        </template>
      </v-row>
    </div>
  </v-card>
</template>

<script>
import { getOptInOptOut } from '@/utils/common.js';

export default {
  props: {
    facility: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  methods: {
    getOptInOptOut,
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

:deep(::placeholder) {
  color: red !important;
  opacity: 1 !important;
}

.summary-label-smaller {
  color: grey;
  font-size: x-small;
}

.error-card {
  border-top: 5px solid #d8292f !important;
}

.success-card {
  border-top: 5px solid #2e8540 !important;
}

:deep(.v-field__input) {
  padding-left: 0px;
}
</style>
