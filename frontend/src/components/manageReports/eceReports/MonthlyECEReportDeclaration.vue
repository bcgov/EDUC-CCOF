<template>
  <v-container fluid class="px-8 px-xl-12 pt-0 mb-12">
    <div v-if="loading" class="text-center">
      <v-progress-circular indeterminate size="100" :width="6" color="#003366" class="min-height-screen" />
    </div>
    <template v-else>
      <MonthlyECEReportHeader :ece-report="eceReport" class="mb-8" />
      <v-card variant="outlined" class="px-8 px-md-12 py-6 mt-4">
        <h2 class="text-center mb-6">Declaration and Submission</h2>
        <div class="declaration-content px-md-4 px-xl-12 pb-2">
          <p>By submitting this Enrolment Report, I confirm that:</p>
          <ul class="ml-8">
            <li>The information provided in this report is true, accurate and complete to the best of my knowledge;</li>
            <li>I am authorized to submit enrolment reports for these facilities;</li>
            <li>
              I understand that the Ministry will be relying on the content of these reports for its decision to
              disburse funds to this organization;
            </li>
            <li>
              These facilities have not accepted registered or drop-in children in numbers which would violate the
              Community Care and Assisted Living Act and Child Care Licensing Regulation;
            </li>
            <li>
              These facilities have not claimed a contribution from the Province for a drop-in child who was temporarily
              occupying a space that was made available due to the absence of an enrolled child;
            </li>
            <li>
              These facilities are maintaining records that support the enrolment numbers reported and will provide them
              upon request to parties authorized by the Ministry for review or audit purposes; and
            </li>
            <li>
              These facilities have not claimed a contribution from the Province with respect to any children living in
              the licensee's own home (Family Providers Only).
            </li>
          </ul>
        </div>
      </v-card>
    </template>
  </v-container>
  <!-- TODO (vietle-cgi): Implement Submit ECE report -->
  <ReportNavButtons
    :loading="loading || processing"
    :is-submit-displayed="true"
    :is-submit-disabled="isSubmitDisabled"
    @previous="previous"
    @submit="setWarningAlert('Submit functionality is not yet implemented.')"
  />
</template>

<script>
import { mapState } from 'pinia';
import ReportNavButtons from '@/components/guiComponents/ReportNavButtons.vue';
import MonthlyECEReportHeader from '@/components/manageReports/eceReports/MonthlyECEReportHeader.vue';
import alertMixin from '@/mixins/alertMixin.js';
import ECEReportService from '@/services/eceReportService.js';
import { useAuthStore } from '@/store/auth.js';
import { PATHS } from '@/utils/constants.js';
import { isReportReadOnly } from '@/utils/eceReport.js';

export default {
  name: 'MonthlyECEReportDeclaration',
  components: {
    MonthlyECEReportHeader,
    ReportNavButtons,
  },
  mixins: [alertMixin],
  data() {
    return {
      eceReport: null,
      loading: false,
      processing: false,
    };
  },
  computed: {
    ...mapState(useAuthStore, ['isMinistryUser']),
    isSubmitDisabled() {
      return isReportReadOnly({ loading: this.loading }) || this.isMinistryUser;
    },
  },
  async created() {
    window.scrollTo(0, 0);
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
    previous() {
      this.$router.push(`${PATHS.ROOT.MONTHLY_ECE_REPORTS}/${this.$route.params.eceReportId}`);
    },
  },
};
</script>
<style scoped>
.declaration-content p {
  margin-bottom: 16px;
}

.declaration-content li {
  margin-bottom: 16px;
}
</style>
