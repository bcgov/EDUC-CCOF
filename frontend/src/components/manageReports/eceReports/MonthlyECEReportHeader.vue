<template>
  <div>
    <p class="text-h4 font-weight-bold">Monthly ECE Report</p>
    <div class="text-h6 text-primary">
      <p class="font-weight-bold mt-2">{{ facility?.facilityName }}</p>
      <p>{{ facility?.facilityAccountNumber }}</p>
      <p>Licence #: {{ facility?.licenseNumber }}</p>
    </div>
    <div>
      <p class="py-2">Reporting month: {{ formatMonthYearToString(eceReport?.month, eceReport?.year) }}</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'pinia';
import { useApplicationStore } from '@/store/application.js';
import { formatMonthYearToString } from '@/utils/format';

export default {
  name: 'MonthlyECEReportHeader',
  props: {
    eceReport: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState(useApplicationStore, ['getFacilityListForPCFByProgramYearId']),
    facility() {
      const facilities = this.getFacilityListForPCFByProgramYearId(this.eceReport?.programYearId);
      return facilities?.find((item) => item.facilityId === this.eceReport?.facilityId);
    },
  },
  methods: {
    formatMonthYearToString,
  },
};
</script>
