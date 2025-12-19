<template>
  <v-container fluid class="px-8 px-xl-12 pt-0 mb-12">
    <div v-if="loading" class="text-center">
      <v-progress-circular indeterminate size="100" :width="6" color="#003366" class="min-height-screen" />
    </div>
    <template v-else>
      <EnrolmentReportHeader :enrolment-report="enrolmentReport" />
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
  <SubmitConfirmationDialog :show="showSubmitConfirmationDialog" />
  <EnrolmentReportNavButtons
    :loading="loading || processing"
    :is-submit-displayed="isSubmitDisplayed"
    :is-submit-disabled="isSubmitDisabled"
    @previous="$router.push(`${PATHS.ROOT.ENROLMENT_REPORTS}/${$route.params.enrolmentReportId}`)"
    @submit="submit"
  />
</template>

<script>
import { mapState } from 'pinia';
import SubmitConfirmationDialog from '@/components/manageReports/enrolmentReports/SubmitConfirmationDialog.vue';
import enrolmentReportMixin from '@/mixins/enrolmentReportMixin.js';
import permissionsMixin from '@/mixins/permissionsMixin.js';
import EnrolmentReportService from '@/services/enrolmentReportService.js';
import { useAuthStore } from '@/store/auth.js';
import { ENROLMENT_REPORT_INTERNAL_STATUSES, ENROLMENT_REPORT_STATUSES } from '@/utils/constants.js';

export default {
  name: 'EnrolmentReportDeclaration',
  components: {
    SubmitConfirmationDialog,
  },
  mixins: [enrolmentReportMixin, permissionsMixin],
  data() {
    return {
      showSubmitConfirmationDialog: false,
    };
  },
  computed: {
    ...mapState(useAuthStore, ['isImpersonating']),
    isSubmitDisplayed() {
      return this.hasPermission(this.PERMISSIONS.SUBMIT_ENROLMENT_REPORT);
    },
    isSubmitDisabled() {
      return this.readonly || this.isImpersonating;
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
        this.enrolmentReport = await EnrolmentReportService.getEnrolmentReport(this.$route.params.enrolmentReportId);
      } catch (error) {
        console.log(error);
        this.setFailureAlert('Failed to load enrolment report');
      } finally {
        this.loading = false;
      }
    },

    async submit() {
      if (this.readonly) return;
      try {
        this.processing = true;
        const payload = {
          externalCcofStatusCode: ENROLMENT_REPORT_STATUSES.SUBMITTED,
          externalCcfriStatusCode: ENROLMENT_REPORT_STATUSES.SUBMITTED,
          internalCcofStatusCode: ENROLMENT_REPORT_INTERNAL_STATUSES.SUBMITTED,
          internalCcfriStatusCode: ENROLMENT_REPORT_INTERNAL_STATUSES.SUBMITTED,
        };
        await EnrolmentReportService.updateEnrolmentReport(this.$route.params.enrolmentReportId, payload);
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

.min-height-screen {
  min-height: 70vh;
}
</style>
