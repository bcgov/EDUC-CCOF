<template>
  <v-col cols="12" class="mt-8">
    <h2>Early Childhood Educator Wage Enhancement (ECE-WE)</h2>

    <v-row class="align-center">
      <h3 class="mr-3">Select fiscal year:</h3>
      <FiscalYearSlider @select-program-year="onProgramYearChange" />
    </v-row>

    <v-card variant="outlined" class="mt-3">
      <v-data-table :headers="headers" :items="items" :loading="isLoading" density="compact" :items-per-page="10" />
    </v-card>
  </v-col>
</template>

<script>
import FiscalYearSlider from '@/components/guiComponents/FiscalYearSlider.vue';
import facilityService from '@/services/facilityService';

export default {
  name: 'OrganizationECEWETable',

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
      items: [],
      isLoading: false,
    };
  },

  computed: {
    headers() {
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
  },

  methods: {
    async onProgramYearChange(programYear) {
      this.selectedProgramYearId = programYear.programYearId;
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
  },
};
</script>
