<template>
  <v-col cols="12">
    <h2>Child Care Fee Reduction Initiative (CCFRI)</h2>

    <v-row class="align-center">
      <h3 class="mr-3">Select fiscal year:</h3>
      <FiscalYearSlider @select-program-year="onProgramYearChange" />
    </v-row>

    <v-card variant="outlined" class="mt-3">
      <v-data-table :headers="headers" :items="items" :loading="isLoading" density="compact" />
    </v-card>
  </v-col>
</template>

<script>
import FiscalYearSlider from '@/components/guiComponents/FiscalYearSlider.vue';
import facilityService from '@/services/facilityService';

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
        { title: 'Opt-In/Out Status', key: 'ccfriStatus' },
        { title: 'Start Date', key: 'ccfriStartDate' },
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
        this.items = await facilityService.getCcfriFacilities(this.organizationId, this.selectedProgramYearId);
      } catch (err) {
        console.error('Failed to load CCFRI facilities', err);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
