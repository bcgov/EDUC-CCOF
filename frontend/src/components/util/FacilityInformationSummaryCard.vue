<template>
  <v-card :class="facility.isComplete ? 'success-card' : 'error-card'" elevation="4" class="pa-4 d-flex flex-column">
    <v-row no-gutters class="pb-2">
      <v-col cols="8" class="px-2">
        <p class="summary-label">Facility Name</p>
        <p :class="facility.facilityName ? '' : 'text-error'" class="summary-value">
          {{ facility.facilityName ?? 'Required' }}
        </p>
      </v-col>
      <v-col cols="3" class="px-2">
        <p class="summary-label">Facility ID</p>
        <p class="summary-value">
          {{ facility.facilityAccountNumber ?? EMPTY_PLACEHOLDER }}
        </p>
      </v-col>
      <v-col cols="1" class="d-flex justify-end">
        <v-icon size="small">mdi-open-in-new</v-icon>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="6" md="4" class="pa-2">
        <p class="summary-label">Licence Number</p>
        <p :class="facility.licenseNumber ? '' : 'text-error'" class="summary-value">
          {{ facility.licenseNumber ?? 'Required' }}
        </p>
      </v-col>
      <v-col cols="6" md="4" class="pa-2">
        <p class="summary-label">CCFRI</p>
        <p :class="facility.ccfriOptInStatus != null ? '' : 'text-error'" class="summary-value">
          {{ getOptInOptOut(facility.ccfriOptInStatus) ?? 'Required' }}
        </p>
      </v-col>
      <v-col cols="6" md="4" class="pa-2">
        <p class="summary-label">ECE-WE</p>
        <p :class="facility.eceweOptInStatus != null ? '' : 'text-error'" class="summary-value">
          {{ getOptInOptOut(facility.eceweOptInStatus) ?? 'Required' }}
        </p>
      </v-col>
    </v-row>
    <v-row v-if="!showApplicationTemplateV1" no-gutters>
      <v-col cols="6" md="4" class="pa-2">
        <p class="summary-label">Health Authority</p>
        <p :class="facility.healthAuthority ? '' : 'text-error'" class="summary-value">
          {{ getHealthAuthorityNameById(facility.healthAuthority) ?? 'Required' }}
        </p>
      </v-col>
    </v-row>
    <div class="pa-2 pb-0">
      <template v-if="facility.isComplete">
        <v-icon class="text-success" size="large"> mdi-check-circle-outline </v-icon>
        <span class="text-success pl-2">Click to view.</span>
      </template>
      <template v-else>
        <v-icon class="text-error" size="large"> mdi-alert-circle-outline </v-icon>
        <span class="text-error pl-2">
          Your form is missing required information. Click to view and complete form.
        </span>
      </template>
    </div>
  </v-card>
</template>

<script>
import { mapState } from 'pinia';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { getOptInOptOut } from '@/utils/common.js';
import { EMPTY_PLACEHOLDER } from '@/utils/constants.js';

export default {
  props: {
    facility: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    ...mapState(useAppStore, ['getHealthAuthorityNameById']),
    ...mapState(useApplicationStore, ['showApplicationTemplateV1']),
  },
  created() {
    this.EMPTY_PLACEHOLDER = EMPTY_PLACEHOLDER;
  },
  methods: {
    getOptInOptOut,
  },
};
</script>
<style scoped>
.error-card {
  border-top: 5px solid #d8292f !important;
}

.success-card {
  border-top: 5px solid #2e8540 !important;
}
</style>
