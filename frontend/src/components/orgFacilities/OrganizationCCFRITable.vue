<template>
  <v-col cols="12">
    <h2>Child Care Fee Reduction Initiative (CCFRI)</h2>
    <v-card variant="outlined" class="mt-3">
      <v-card-text>
        <v-row class="align-center">
          <h3 class="ml-5 mr-3 mb-0">Select fiscal year:</h3>
          <FiscalYearSlider always-display @select-program-year="selectProgramYear" />
        </v-row>
      </v-card-text>
      <v-skeleton-loader :loading="isLoading" type="table-tbody">
        <v-data-table :headers="headers" :items="mappedItems" :loading="isLoading" density="compact" />
      </v-skeleton-loader>
    </v-card>
  </v-col>
</template>
<script>
import { mapState } from 'pinia';
import FiscalYearSlider from '@/components/guiComponents/FiscalYearSlider.vue';
import facilityService from '@/services/facilityService';
import { useApplicationStore } from '@/store/application.js';
import { OPT_STATUSES } from '@/utils/constants.js';
import { formatUTCDateToMonthYear } from '@/utils/format.js';

export default {
  components: { FiscalYearSlider },
  props: {
    organizationId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      selectedProgramYearIdLocal: null,
      items: [],
      isLoading: false,
    };
  },
  computed: {
    ...mapState(useApplicationStore, ['programYearId']),
    selectedProgramYearId() {
      return this.selectedProgramYearIdLocal ?? this.programYearId;
    },
    mappedItems() {
      return [...this.items]
        .sort((a, b) => {
          if (a.ccfriOptStatus !== b.ccfriOptStatus) {
            return b.ccfriOptStatus - a.ccfriOptStatus;
          }
          return a.facilityName.localeCompare(b.facilityName, undefined, {
            sensitivity: 'base',
          });
        })
        .map((item) => ({
          ...item,
          ccfriOptStatus: this.mapOptStatus(item.ccfriOptStatus),
          ccfriStartDate: formatUTCDateToMonthYear(item.ccfriStartDate),
        }));
    },
    headers() {
      return [
        { title: 'Facility Name', key: 'facilityName' },
        { title: 'Facility ID', key: 'facilityAccountNumber' },
        { title: 'Licence #', key: 'licenseNumber' },
        { title: 'Opt-In/Out Status', key: 'ccfriOptStatus' },
        { title: 'CCFRI Start Date', key: 'ccfriStartDate' },
      ];
    },
  },
  methods: {
    async selectProgramYear(programYear) {
      this.selectedProgramYearIdLocal = programYear.programYearId;
      await this.fetchData();
    },
    async fetchData() {
      if (!this.organizationId || !this.selectedProgramYearId) return;

      try {
        this.isLoading = true;
        this.items = await facilityService.getCcfriFacilities(this.organizationId, this.selectedProgramYearId);
      } catch (err) {
        console.error('Failed to load CCFRI facilities', err);
      } finally {
        this.isLoading = false;
      }
    },
    mapOptStatus(value) {
      if (value === OPT_STATUSES.OPT_IN) return 'Opt-In';
      if (value === OPT_STATUSES.OPT_OUT) return 'Opt-Out';
      return '';
    },
  },
};
</script>
