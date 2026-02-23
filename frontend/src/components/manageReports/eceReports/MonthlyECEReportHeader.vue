<template>
  <div>
    <p class="text-h4 font-weight-bold">Monthly ECE Report</p>
    <v-card class="mt-6 rounded-lg" elevation="4">
      <v-card-title class="rounded-t-lg py-3 card-title font-weight-bold"> Summary </v-card-title>
      <v-row no-gutters class="px-4 pb-2">
        <v-col cols="12" sm="6" md="4" class="pt-2">
          <p class="font-weight-bold">Facility Name</p>
          <p>{{ facility?.facilityName }}</p>
        </v-col>
        <v-col cols="12" sm="6" md="4" class="pt-2">
          <p class="font-weight-bold">Facility ID</p>
          <p>{{ facility?.facilityAccountNumber }}</p>
        </v-col>
        <v-col cols="12" sm="6" md="4" class="pt-2">
          <p class="font-weight-bold">Licence Number</p>
          <p>{{ facility?.licenseNumber }}</p>
        </v-col>
        <v-col cols="12" sm="6" md="4" class="pt-2">
          <p class="font-weight-bold">Public Sector Employer</p>
          <p>{{ publicSectorText }}</p>
        </v-col>
        <v-col cols="12" sm="6" md="4" class="pt-2">
          <p class="font-weight-bold">Month of Service</p>
          <p>{{ formatMonthYearToString(eceReport?.month, eceReport?.year) }}</p>
        </v-col>
        <v-col cols="12" sm="6" md="4" class="pt-2">
          <p class="font-weight-bold">Version Number</p>
          <p>{{ eceReport?.versionText }}</p>
        </v-col>
        <v-col cols="12" sm="6" md="4" class="pt-2">
          <p class="font-weight-bold">Status</p>
          <p>{{ reportStatus }}</p>
        </v-col>
        <v-col cols="12" sm="6" md="4" class="pt-2">
          <p class="font-weight-bold">Submitted Date</p>
          <p>{{ formatUTCDate(eceReport?.submittedDate) ?? 'N/A' }}</p>
        </v-col>
      </v-row>
    </v-card>
    <p class="mt-4">
      <strong>Important:</strong> Only staff who hold an active Early Childhood Educator, Infant and Toddler Educator,
      or Special Needs Educator certificate are eligible for the ECE Wage Enhancement.
    </p>
  </div>
</template>

<script>
import { mapState } from 'pinia';
import { useApplicationStore } from '@/store/application.js';
import { getStatusText, getYesNoValue } from '@/utils/common.js';
import { ECE_REPORT_STATUS_OPTIONS } from '@/utils/constants.js';
import { formatMonthYearToString, formatUTCDate } from '@/utils/format';

export default {
  name: 'MonthlyECEReportHeader',
  props: {
    eceReport: {
      type: Object,
      required: true,
    },
    publicSector: { type: [Number, null], default: null },
  },
  computed: {
    ...mapState(useApplicationStore, ['getFacilityListForPCFByProgramYearId']),
    facility() {
      const facilities = this.getFacilityListForPCFByProgramYearId(this.eceReport?.programYearId);
      return facilities?.find((item) => item.facilityId === this.eceReport?.facilityId);
    },
    reportStatus() {
      return getStatusText(this.eceReport?.statusCode, ECE_REPORT_STATUS_OPTIONS);
    },
    publicSectorText() {
      return getYesNoValue(this.publicSector);
    },
  },
  methods: {
    formatMonthYearToString,
    formatUTCDate,
  },
};
</script>
