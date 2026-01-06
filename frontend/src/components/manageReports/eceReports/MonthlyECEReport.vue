<template>
  <div v-if="loading" class="text-center">
    <v-progress-circular indeterminate size="100" :width="6" color="#003366" class="min-height-screen" />
  </div>
  <div v-else class="px-12 mb-12">
    <MonthlyECEReportHeader :ece-report="eceReport" />
  </div>
  <NavButton :is-processing="loading" @previous="$router.push(`${PATHS.ROOT.MANAGE_ECE_REPORTS}`)" />
</template>

<script>
import MonthlyECEReportHeader from '@/components/manageReports/eceReports/MonthlyECEReportHeader.vue';
import NavButton from '@/components/util/NavButton.vue';
import alertMixin from '@/mixins/alertMixin.js';
import ECEReportService from '@/services/eceReportService.js';
import { PATHS } from '@/utils/constants.js';

export default {
  name: 'MonthlyECEReport',
  components: { MonthlyECEReportHeader, NavButton },
  mixins: [alertMixin],
  data() {
    return {
      loading: false,
      eceReport: null,
    };
  },
  async created() {
    this.PATHS = PATHS;
    await this.loadData();
  },
  methods: {
    async loadData() {
      try {
        this.loading = true;
        this.eceReport = await ECEReportService.getECEReport(this.$route.params.eceReportId);
      } catch (error) {
        console.error(error);
        this.setFailureAlert('Failed to load ECE report');
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
<style scoped>
.min-height-screen {
  min-height: 70vh;
}
</style>
