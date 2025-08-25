import EnrolmentReportHeader from '@/components/enrolmentReports/EnrolmentReportHeader.vue';
import EnrolmentReportNavButtons from '@/components/enrolmentReports/EnrolmentReportNavButtons.vue';
import alertMixin from '@/mixins/alertMixin.js';
import EnrolmentReportService from '@/services/enrolmentReportService.js';
import { ENROLMENT_REPORT_STATUSES, PATHS } from '@/utils/constants.js';

export default {
  components: {
    EnrolmentReportHeader,
    EnrolmentReportNavButtons,
  },
  mixins: [alertMixin],
  data() {
    return {
      loading: true,
      processing: false,
      enrolmentReport: {},
    };
  },
  computed: {
    readonly() {
      return (
        this.loading ||
        this.processing ||
        this.enrolmentReport?.externalCcofStatusCode !== ENROLMENT_REPORT_STATUSES.DRAFT ||
        EnrolmentReportService.isSubmissionDeadlinePassed(this.enrolmentReport)
      );
    },
  },
  created() {
    this.PATHS = PATHS;
  },
};
