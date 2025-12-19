<template>
  <h2>Child Care Fee Reduction Initiative (CCFRI)</h2>
  <v-card variant="outlined" class="mt-3">
    <v-card-text>
      <v-row class="align-center">
        <h3 class="ml-5 mr-3">Select fiscal year:</h3>
        <FiscalYearSlider always-display @select-program-year="selectProgramYear" />
      </v-row>
    </v-card-text>
    <v-skeleton-loader :loading="isLoading" type="table-tbody">
      <v-data-table :headers="headers" :items="mappedItems" density="compact" />
    </v-skeleton-loader>
  </v-card>
</template>
<script>
import FiscalYearSlider from '@/components/guiComponents/FiscalYearSlider.vue';
import alertMixin from '@/mixins/alertMixin.js';
import { mapState } from 'pinia';
import FacilityService from '@/services/facilityService';
import { useApplicationStore } from '@/store/application.js';
import { BASE_FACILITY_HEADERS, OPT_STATUSES } from '@/utils/constants.js';
import { formatUTCDateToMonthYear } from '@/utils/format.js';

export default {
  components: { FiscalYearSlider },
  mixins: [alertMixin],
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
  },
  created() {
    this.headers = [
      ...BASE_FACILITY_HEADERS,
      { title: 'Opt-In/Out Status', key: 'ccfriOptStatus' },
      { title: 'CCFRI Start Date', key: 'ccfriStartDate' },
    ];
  },
  methods: {
    async selectProgramYear(programYear) {
      this.selectedProgramYearIdLocal = programYear.programYearId;
      await this.loadData();
    },
    async loadData() {
      if (!this.organizationId || !this.selectedProgramYearId) return;

      try {
        this.isLoading = true;
        this.items = await FacilityService.getCcfriFacilities(this.organizationId, this.selectedProgramYearId);
      } catch (err) {
        console.log(err);
        this.setFailureAlert('Failed to load CCFRI facilities');
      } finally {
        this.isLoading = false;
      }
    },
    mapOptStatus(value) {
      switch (value) {
        case OPT_STATUSES.OPT_IN:
          return 'Opt-In';
        case OPT_STATUSES.OPT_OUT:
          return 'Opt-Out';
        default:
          return '';
      }
    },
  },
};
</script>
