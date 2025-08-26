<template>
  <v-container fluid class="px-8 px-xl-12 pt-0 mb-12">
    <div v-if="loading" class="text-center">
      <v-progress-circular indeterminate size="100" :width="6" color="#003366" class="min-height-screen" />
    </div>
    <template v-else>
      <EnrolmentReportHeader :enrolment-report="enrolmentReport" />
      <v-card variant="outlined" class="px-8 px-md-12 py-4 py-lg-8 mt-8">
        <h2 class="text-center mb-4 mb-lg-8">Declaration and Submission</h2>
        <div class="declaration-content px-md-4 px-xl-12 pb-2">
          <p>
            I have read and understand the Funding Agreement, have direct knowledge of the operation of the child care
            facilities, and am authorized to submit enrolment reports for these facilities.
          </p>
          <p>
            The Enrolment Reports being submitted have been completed with care and accurately represent the services
            provided by these facilities.
          </p>
          <p>
            I understand that the Ministry will be relying on the content of these Reports for its decision to disburse
            funds to this Organization.
          </p>
          <p>I confirm that:</p>
          <ul class="ml-12">
            <li>
              these facilities have not accepted registered or drop-in children, in numbers which would violate the
              Community Care Facility Act licence;
            </li>
            <li>
              these facilities have not claimed a contribution from the province with respect to a drop-in child who was
              occupying a space that was temporarily available due to the absence of an enrolled child; these facilities
              are maintaining records that support the enrolment numbers reported and will provide them upon request to
              parties authorized by the Ministry for review or audit purposes;
            </li>
            <li>
              these facilities have not claimed a contribution from the province with respect to any children living in
              the licencee's own home (Family Providers Only)
            </li>
          </ul>
        </div>
      </v-card>
    </template>
  </v-container>
  <EnrolmentReportNavButtons
    :loading="loading || processing"
    :is-submit-displayed="true"
    :is-submit-disabled="readonly"
    @previous="$router.push(`${PATHS.ROOT.ENROLMENT_REPORTS}/${$route.params.enrolmentReportId}`)"
    @submit="submit"
  />
</template>

<script>
import enrolmentReportMixin from '@/mixins/enrolmentReportMixin.js';
import EnrolmentReportService from '@/services/enrolmentReportService.js';

export default {
  name: 'EnrolmentReportDeclaration',
  mixins: [enrolmentReportMixin],
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

    // TODO (vietle-cgi): implement submit functionality
    async submit() {
      if (this.readonly) return;
      try {
        this.processing = true;
        this.setSuccessAlert('Report submitted successfully.');
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

.min-height-screen {
  min-height: 70vh;
}
</style>
