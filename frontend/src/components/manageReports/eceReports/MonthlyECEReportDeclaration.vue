<template>
  <v-container fluid class="px-8 px-xl-12 pt-0 mb-12">
    <div v-if="loading" class="text-center">
      <v-progress-circular indeterminate size="100" :width="6" color="#003366" class="min-height-screen" />
    </div>
    <template v-else>
      <MonthlyECEReportHeader :ece-report="eceReport" :public-sector="publicSector" class="mb-8" />
      <v-card variant="outlined" class="px-8 px-md-12 py-6 mt-4">
        <h2 class="text-center mb-6">Declaration and Submission</h2>
        <div class="declaration-content px-md-4 px-xl-12 pb-2">
          <p>By submitting this Monthly ECE Report, I confirm that:</p>
          <ul class="ml-8">
            <li>The information provided in this report is true, accurate and complete to the best of my knowledge;</li>
            <li>I am authorized to submit Monthly ECE Reports for this facility;</li>
            <li>
              I understand that the Ministry relies on the content of these reports for its decision to disburse funds
              to this organization;
            </li>
            <li>
              ECEs submitted on this report are ECE Employees (as defined in the CCOF Funding Agreement) at this
              facility;
            </li>
            <li>
              ECEs submitted on this report have signed a written acknowledgement authorizing this facility to collect
              and disclose to the Ministry the ECE Employee's personal information and confirming their knowledge that
              the Ministry may contact them directly to verify any information this facility provides to the Ministry
              and that the ECE Wage Enhancement Funding is distributed as required by the CCOF Funding Agreement;
            </li>
            <li>
              The report accurately represents the Hours Worked (as defined in the CCOF Funding Agreement) by ECE
              Employees at this facility; and
            </li>
            <li>
              I keep accurate records of each ECE Employee's signed written acknowledgement and the Hours Worked by, and
              payments distributed to, ECE Employees.
            </li>
          </ul>
        </div>
      </v-card>
    </template>
  </v-container>
  <SubmitConfirmationDialog v-model="showSubmitConfirmationDialog" />
  <ReportNavButtons
    :loading="loading || processing"
    :is-submit-displayed="true"
    :is-submit-disabled="isSubmitDisabled"
    @previous="previous"
    @submit="submit"
  />
</template>

<script>
import { mapState } from 'pinia';
import ReportNavButtons from '@/components/guiComponents/ReportNavButtons.vue';
import MonthlyECEReportHeader from '@/components/manageReports/eceReports/MonthlyECEReportHeader.vue';
import SubmitConfirmationDialog from '@/components/manageReports/eceReports/SubmitConfirmationDialog.vue';
import alertMixin from '@/mixins/alertMixin.js';
import ApplicationService from '@/services/applicationService.js';
import ECEReportService from '@/services/eceReportService.js';
import { useApplicationStore } from '@/store/application.js';
import { useAuthStore } from '@/store/auth.js';
import { ECE_REPORT_STATUSES, PATHS } from '@/utils/constants.js';
import { isReportReadOnly } from '@/utils/eceReport.js';

export default {
  name: 'MonthlyECEReportDeclaration',
  components: {
    MonthlyECEReportHeader,
    ReportNavButtons,
    SubmitConfirmationDialog,
  },
  mixins: [alertMixin],
  data() {
    return {
      eceReport: null,
      loading: false,
      processing: false,
      showSubmitConfirmationDialog: false,
      publicSector: globalThis.history?.state?.publicSector ?? null,
    };
  },
  computed: {
    ...mapState(useApplicationStore, ['getApplicationIdByProgramYearId']),
    ...mapState(useAuthStore, ['isMinistryUser']),
    eceReportId() {
      return this.$route.params.eceReportId;
    },
    isSubmitDisabled() {
      return (
        isReportReadOnly({ loading: this.loading || this.processing, eceReport: this.eceReport }) || this.isMinistryUser
      );
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
        this.eceReport = await ECEReportService.getECEReport(this.eceReportId);
        const programYearId = this.eceReport?.programYearId;
        const applicationId = programYearId ? this.getApplicationIdByProgramYearId(programYearId) : null;
        if (this.publicSector === null && applicationId) {
          this.publicSector = await ApplicationService.getEceweHeader(applicationId);
        }
      } catch (error) {
        console.error(error);
        this.setFailureAlert('Failed to load ECE report');
      } finally {
        this.loading = false;
      }
    },
    previous() {
      this.$router.push(`${PATHS.ROOT.MONTHLY_ECE_REPORTS}/${this.eceReportId}`);
    },
    async submit() {
      if (this.isSubmitDisabled) return;
      try {
        this.processing = true;
        await ECEReportService.submitECEReport(this.eceReportId);
        this.showSubmitConfirmationDialog = true;
      } catch (error) {
        console.log(error);
        this.setFailureAlert('An error occurred while submitting.');
      } finally {
        this.processing = false;
      }
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
