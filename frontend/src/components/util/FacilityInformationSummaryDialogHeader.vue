<template>
  <v-card class="facility-info px-6 py-2">
    <v-row>
      <v-col cols="12">
        <p class="summary-label">Facility Name</p>
        <p :class="isEmpty(facilityInfo?.facilityName) ? 'text-error' : ''">
          {{ isEmpty(facilityInfo?.facilityName) ? 'Required' : facilityInfo?.facilityName }}
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4" sm="6">
        <p class="summary-label">Facility ID</p>
        <p>{{ facilityInfo?.facilityAccountNumber ?? EMPTY_PLACEHOLDER }}</p>
      </v-col>
      <v-col cols="12" md="4" sm="6">
        <p class="summary-label">Licence Number</p>
        <p :class="isEmpty(facilityInfo?.licenseNumber) ? 'text-error' : ''">
          {{ isEmpty(facilityInfo?.licenseNumber) ? 'Required' : facilityInfo?.licenseNumber }}
        </p>
      </v-col>
      <v-col v-if="!showApplicationTemplateV1" cols="12" md="4" sm="6">
        <p class="summary-label">Health Authority</p>
        <p :class="facilityInfo.healthAuthority ? '' : 'text-error'">
          {{ getHealthAuthorityNameById(facilityInfo.healthAuthority) ?? 'Required' }}
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <p class="summary-label">Licence Categories</p>
        <p class="pr-4">{{ licenseCategories }}</p>
      </v-col>
      <v-col cols="12" md="3" sm="6">
        <p class="summary-label">CCFRI</p>
        <p :class="ccfriStatus != null ? '' : 'text-error'">{{ getOptInOptOut(ccfriStatus) ?? 'Required' }}</p>
      </v-col>
      <v-col cols="12" md="3" sm="6">
        <p class="summary-label">ECE-WE</p>
        <p :class="eceweStatus != null ? '' : 'text-error'">{{ getOptInOptOut(eceweStatus) ?? 'Required' }}</p>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mapState } from 'pinia';
import summaryMixin from '@/mixins/summaryMixin.js';
import { useApplicationStore } from '@/store/application.js';

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
  computed: {
    ...mapState(useApplicationStore, ['showApplicationTemplateV1']),
  },
};
</script>
<style scoped>
.facility-info {
  border-top: 5px solid grey !important;
}
</style>
