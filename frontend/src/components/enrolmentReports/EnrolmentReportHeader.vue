<template>
  <div>
    <p class="text-h4 font-weight-bold">Enrolment Report</p>
    <div class="text-h6 text-primary">
      <p class="font-weight-bold mt-2">{{ facility?.facilityName }}</p>
      <p>{{ facility?.facilityAccountNumber }}</p>
      <p>Licence #: {{ facility?.licenseNumber }}</p>
    </div>
    <div>
      <p class="py-2">Reporting month: {{ formatMonthYearToString(enrolmentReport?.month, enrolmentReport?.year) }}</p>
      <p>Version number: {{ enrolmentReport.versionText }}</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'pinia';
import { useApplicationStore } from '@/store/application.js';
import { formatMonthYearToString } from '@/utils/format';

export default {
  name: 'EnrolmentReportHeader',
  props: {
    enrolmentReport: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState(useApplicationStore, ['getFacilityListForPCFByProgramYearId']),
    facility() {
      const facilities = this.getFacilityListForPCFByProgramYearId(this.enrolmentReport?.programYearId);
      return facilities?.find((item) => item.facilityId === this.enrolmentReport?.facilityId);
    },
  },
  methods: {
    formatMonthYearToString,
  },
};
</script>
