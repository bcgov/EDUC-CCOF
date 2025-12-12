<template>
  <v-col cols="12" class="mt-8">
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
  </v-col>
</template>
<script>
import { mapState } from 'pinia';
import FiscalYearSlider from '@/components/guiComponents/FiscalYearSlider.vue';
import facilityService from '@/services/facilityService';
import { useApplicationStore } from '@/store/application.js';
import { formatUTCDateToMonthYear } from '@/utils/format.js';
import {
  OPT_STATUSES,
  ECEWE_DESCRIBE_ORG_TYPES,
  ECEWE_IS_PUBLIC_SECTOR_EMPLOYER,
  ECEWE_FACILITY_UNION_TYPES,
  ECEWE_APPLICATION_STATUS,
  BASE_FACILITY_HEADERS,
} from '@/utils/constants.js';
const LOOKUP = {
  OPT_STATUS: {
    [OPT_STATUSES.OPT_IN]: 'Opt-In',
    [OPT_STATUSES.OPT_OUT]: 'Opt-Out',
  },
  UNION: {
    [ECEWE_FACILITY_UNION_TYPES.UNIONIZED]: 'Yes',
    [ECEWE_FACILITY_UNION_TYPES.NON_UNIONIZED]: 'No',
  },
  CSSEA: {
    [ECEWE_DESCRIBE_ORG_TYPES.MEMBER_OF_CSSEA]: 'Yes',
    [ECEWE_DESCRIBE_ORG_TYPES.NOT_A_MEMBER_OF_CSSEA]: 'No',
  },
  PSE: {
    [ECEWE_IS_PUBLIC_SECTOR_EMPLOYER.YES]: 'Yes',
    [ECEWE_IS_PUBLIC_SECTOR_EMPLOYER.NO]: 'No',
  },
  APPLICATION_STATUS: {
    [ECEWE_APPLICATION_STATUS.NEW]: 'New',
    [ECEWE_APPLICATION_STATUS.SUBMITTED]: 'Submitted',
    [ECEWE_APPLICATION_STATUS.INACTIVE]: 'Inactive',
    [ECEWE_APPLICATION_STATUS.APPROVED]: 'Approved',
    [ECEWE_APPLICATION_STATUS.INELIGIBLE]: 'Ineligible',
    [ECEWE_APPLICATION_STATUS.ACTION_REQUIRED]: 'Action Required',
    [ECEWE_APPLICATION_STATUS.OPT_OUT]: 'Opted Out',
  },
};
export default {
  name: 'OrganizationECEWETable',
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
      return this.selectedProgramYearIdLocal || this.programYearId;
    },
    mappedItems() {
      return [...this.items]
        .sort((a, b) => {
          if (a.eceweOptStatus !== b.eceweOptStatus) {
            return b.eceweOptStatus - a.eceweOptStatus;
          }
          return a.facilityName.localeCompare(b.facilityName, undefined, {
            sensitivity: 'base',
          });
        })
        .map((item) => ({
          ...item,
          isPublicSectorEmployer: this.mapValue('PSE', item.isPublicSectorEmployer),
          isCsseaMember: this.mapValue('CSSEA', item.isCsseaMember),
          unionStatus: this.mapValue('UNION', item.unionStatus),
          eceweOptStatus: this.mapValue('OPT_STATUS', item.eceweOptStatus),
          eceweApplicationStatus: this.mapValue('APPLICATION_STATUS', item.eceweApplicationStatus),
          eceweStartDate: formatUTCDateToMonthYear(item.eceweStartDate),
        }));
    },
    headers() {
      return [
        ...BASE_FACILITY_HEADERS,
        { title: 'Public Sector Employer', key: 'isPublicSectorEmployer' },
        { title: 'CSSEA Member', key: 'isCsseaMember' },
        { title: 'Unionized', key: 'unionStatus' },
        { title: 'Opt-In/Out Status', key: 'eceweOptStatus' },
        { title: 'ECE-WE Application', key: 'eceweApplicationStatus' },
        { title: 'ECE-WE Start Date', key: 'eceweStartDate' },
      ];
    },
  },
  methods: {
    async onProgramYearChange(programYear) {
      this.selectedProgramYearIdLocal = programYear.programYearId;
      await this.fetchData();
    },
    async fetchData() {
      if (!this.organizationId || !this.selectedProgramYearId) return;
      try {
        this.isLoading = true;
        this.items = await facilityService.getEceweFacilities(this.organizationId, this.selectedProgramYearId);
      } catch (error) {
        console.error('Failed to load ECE-WE facilities', error);
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
