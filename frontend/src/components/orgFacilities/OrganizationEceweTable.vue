<template>
  <h2>Early Childhood Educator Wage Enhancement (ECE-WE)</h2>
  <v-card variant="outlined" class="mt-3">
    <v-card-text>
      <v-row class="align-center">
        <h3 class="ml-5 mr-3">Select fiscal year:</h3>
        <FiscalYearSlider always-display @select-program-year="onProgramYearChange" />
      </v-row>
    </v-card-text>
    <v-skeleton-loader :loading="isLoading" type="table-tbody">
      <v-data-table :headers="headers" :items="mappedItems" density="compact" :items-per-page="10" />
    </v-skeleton-loader>
  </v-card>
</template>
<script>
import { mapState } from 'pinia';
import FiscalYearSlider from '@/components/guiComponents/FiscalYearSlider.vue';
import { BASE_FACILITY_HEADERS, ECEWE_APPLICATION_STATUSES, OPT_STATUSES } from '@/utils/constants.js';
import alertMixin from '@/mixins/alertMixin.js';
import FacilityService from '@/services/facilityService';
import { useApplicationStore } from '@/store/application.js';
import { formatUTCDateToMonthYear } from '@/utils/format.js';

const LOOKUP = {
  APPLICATION_STATUS: {
    [ECEWE_APPLICATION_STATUSES.ACTION_REQUIRED]: 'Action Required',
    [ECEWE_APPLICATION_STATUSES.APPROVED]: 'Approved',
    [ECEWE_APPLICATION_STATUSES.INACTIVE]: 'Inactive',
    [ECEWE_APPLICATION_STATUSES.INELIGIBLE]: 'Ineligible',
    [ECEWE_APPLICATION_STATUSES.NEW]: 'New',
    [ECEWE_APPLICATION_STATUSES.OPT_OUT]: 'Opted Out',
    [ECEWE_APPLICATION_STATUSES.SUBMITTED]: 'Submitted',
  },
  OPT_STATUS: {
    [OPT_STATUSES.OPT_IN]: 'Opt-In',
    [OPT_STATUSES.OPT_OUT]: 'Opt-Out',
  },
};
export default {
  name: 'OrganizationECEWETable',
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
      return this.selectedProgramYearIdLocal || this.programYearId;
    },
    mappedItems() {
      return [...this.items]
        .sort((a, b) => {
          if (a.eceweOptStatus !== b.eceweOptStatus) {
            return b.eceweOptStatus - a.eceweOptStatus;
          }

          const nameA = a.facilityName ?? '';
          const nameB = b.facilityName ?? '';

          return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
        })
        .map((item) => ({
          ...item,
          eceweOptStatus: this.mapValue('OPT_STATUS', item.eceweOptStatus),
          eceweApplicationStatus: this.mapValue('APPLICATION_STATUS', item.eceweApplicationStatus),
          eceweStartDate: formatUTCDateToMonthYear(item.eceweStartDate),
        }));
    },
  },
  created() {
    this.headers = [
      ...BASE_FACILITY_HEADERS,
      { title: 'Opt-In/Out Status', key: 'eceweOptStatus' },
      { title: 'ECE-WE Application', key: 'eceweApplicationStatus' },
      { title: 'ECE-WE Start Date', key: 'eceweStartDate' },
    ];
  },
  methods: {
    async onProgramYearChange(programYear) {
      this.selectedProgramYearIdLocal = programYear.programYearId;
      await this.loadData();
    },
    async loadData() {
      if (!this.organizationId || !this.selectedProgramYearId) return;
      try {
        this.items = [];
        this.isLoading = true;
        this.items = await FacilityService.getEceweFacilities({
          organizationId: this.organizationId,
          programYearId: this.selectedProgramYearId,
        });
      } catch (error) {
        console.error(error);
        this.setFailureAlert('Failed to load ECE-WE facilities');
      } finally {
        this.isLoading = false;
      }
    },
    mapValue(mapKey, value) {
      return LOOKUP[mapKey][value] ?? '';
    },
  },
};
</script>
