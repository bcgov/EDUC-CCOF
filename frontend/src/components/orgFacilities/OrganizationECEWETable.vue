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
        <v-data-table
          :headers="headers"
          :items="mappedItems"
          :loading="isLoading"
          density="compact"
          :items-per-page="10"
        />
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
  YES_NO_VALUES,
  OPT_STATUSES,
  ECEWE_DESCRIBE_ORG_TYPES,
  ECEWE_IS_PUBLIC_SECTOR_EMPLOYER,
  ECEWE_FACILITY_UNION_TYPES,
  ECEWE_APPLICATION_STATUS,
} from '@/utils/constants.js';
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
          isPublicSectorEmployer: this.mapYesNo(item.isPublicSectorEmployer),
          isCsseaMember: this.mapCssea(item.isCsseaMember),
          unionStatus: this.mapUnion(item.unionStatus),
          eceweOptStatus: this.mapOptStatus(item.eceweOptStatus),
          eceweApplicationStatus: this.mapEceweApplicationStatus(item.eceweApplicationStatus),
          eceweStartDate: formatUTCDateToMonthYear(item.eceweStartDate),
        }));
    },
    headers() {
      return [
        { title: 'Facility Name', key: 'facilityName' },
        { title: 'Facility ID', key: 'facilityAccountNumber' },
        { title: 'Licence #', key: 'licenseNumber' },
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
    mapYesNo(value) {
      if (value === YES_NO_VALUES.YES) return 'Yes';
      if (value === YES_NO_VALUES.NO) return 'No';
      return '';
    },
    mapOptStatus(value) {
      if (value === OPT_STATUSES.OPT_IN) return 'Opt-In';
      if (value === OPT_STATUSES.OPT_OUT) return 'Opt-Out';
      return '';
    },
    mapUnion(value) {
      if (value === ECEWE_FACILITY_UNION_TYPES.UNIONIZED) return 'Yes';
      if (value === ECEWE_FACILITY_UNION_TYPES.NON_UNIONIZED) return 'No';
      return '';
    },
    mapCssea(value) {
      if (value === ECEWE_DESCRIBE_ORG_TYPES.MEMBER_OF_CSSEA) return 'Yes';
      if (value === ECEWE_DESCRIBE_ORG_TYPES.NOT_A_MEMBER_OF_CSSEA) return 'No';
      return '';
    },
    mapPsa(value) {
      if (value === ECEWE_IS_PUBLIC_SECTOR_EMPLOYER.YES) return 'Yes';
      if (value === ECEWE_IS_PUBLIC_SECTOR_EMPLOYER.NO) return 'No';
      return '';
    },
    mapEceweApplicationStatus(status) {
      switch (status) {
        case ECEWE_APPLICATION_STATUS.NEW:
          return 'New';
        case ECEWE_APPLICATION_STATUS.SUBMITTED:
          return 'Submitted';
        case ECEWE_APPLICATION_STATUS.APPROVED:
          return 'Approved';
        case ECEWE_APPLICATION_STATUS.INELIGIBLE:
          return 'Ineligible';
        case ECEWE_APPLICATION_STATUS.ACTION_REQUIRED:
          return 'Action Required';
        case ECEWE_APPLICATION_STATUS.OPT_OUT:
          return 'Opted Out';
        default:
          return '';
      }
    },
  },
};
</script>
