<template>
  <!-- CCFRI SECTION -->
  <v-col cols="12" sm="7">
    <h2>Child Care Fee Reduction Initiative (CCFRI)</h2>
  </v-col>

  <v-row class="justify-md-end">
    <h3 class="ml-5">Select fiscal year:</h3>
    <FiscalYearSlider class="mx-4" @select-program-year="onProgramYearChange" />
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-card variant="outlined" class="soft-outline px-2 py-4">
        <v-data-table :headers="ccfriHeaders" :items="ccfriItems" density="compact" :items-per-page="10" />
      </v-card>
    </v-col>
  </v-row>

  <!-- ECE-WE SECTION -->
  <v-col cols="12" sm="7" class="mt-8">
    <h2>Early Childhood Educator Wage Enhancement (ECE-WE)</h2>
  </v-col>

  <v-row>
    <v-col cols="12">
      <v-card variant="outlined" class="soft-outline px-2 py-4">
        <v-data-table :headers="eceweHeaders" :items="eceweItems" density="compact" :items-per-page="10" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import FiscalYearSlider from '@/components/guiComponents/FiscalYearSlider.vue';
import facilityService from '@/services/facilityService';

export default {
  name: 'OrganizationFundingTables',

  components: {
    FiscalYearSlider,
  },

  props: {
    organizationId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      selectedProgramYearId: null,
      facilities: [],
      isLoading: false,
    };
  },

  computed: {
    ccfriHeaders() {
      return [
        { title: 'Facility Name', key: 'facilityName' },
        { title: 'Facility ID', key: 'facilityAccountNumber' },
        { title: 'Licence #', key: 'licenseNumber' },
        { title: 'Opt-In/Out Status', key: 'ccfriStatus' },
        { title: 'Start Date', key: 'ccfriStartDate' },
      ];
    },

    eceweHeaders() {
      return [
        { title: 'Facility Name', key: 'facilityName' },
        { title: 'Facility ID', key: 'facilityAccountNumber' },
        { title: 'Licence #', key: 'licenseNumber' },
        { title: 'Public Sector Employer', key: 'isPublicSector' },
        { title: 'CSSEA Member', key: 'isCsseaMember' },
        { title: 'Unionized', key: 'isUnionized' },
        { title: 'Opt-In/Out Status', key: 'eceweStatus' },
        { title: 'Application Status', key: 'eceweApplicationStatus' },
        { title: 'ECE-WE Start Date', key: 'eceweStartDate' },
      ];
    },

    ccfriItems() {
      return this.facilities.map((f) => ({
        facilityName: f.facilityName,
        facilityAccountNumber: f.facilityAccountNumber,
        licenseNumber: f.licenseNumber,
        ccfriStatus: f.ccfriOptStatus,
        ccfriStartDate: f.ccfriStartDate,
      }));
    },

    eceweItems() {
      return this.facilities.map((f) => ({
        facilityName: f.facilityName,
        facilityAccountNumber: f.facilityAccountNumber,
        licenseNumber: f.licenseNumber,
        isPublicSector: f.isPublicSector,
        isCsseaMember: f.isCsseaMember,
        isUnionized: f.isUnionized,
        eceweStatus: f.eceweOptStatus,
        eceweApplicationStatus: f.eceweApplicationStatus,
        eceweStartDate: f.eceweStartDate,
      }));
    },
  },

  methods: {
    async onProgramYearChange(programYear) {
      this.selectedProgramYearId = programYear.programYearId;
      await this.fetchFacilities();
    },

    async fetchFacilities() {
      if (!this.organizationId || !this.selectedProgramYearId) return;

      try {
        this.isLoading = true;
        this.facilities = await facilityService.getEceweCcfriFacilities(
          this.organizationId,
          this.selectedProgramYearId,
        );
      } catch (error) {
        console.error('Failed to load facility funding data', error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
