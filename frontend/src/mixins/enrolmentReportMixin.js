import EnrolmentReportHeader from '@/components/enrolmentReports/EnrolmentReportHeader.vue';
import EnrolmentReportNavButtons from '@/components/enrolmentReports/EnrolmentReportNavButtons.vue';
import alertMixin from '@/mixins/alertMixin.js';
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
      return this.loading || this.processing || this.isSubmitted;
    },
    isSubmitted() {
      return (
        this.enrolmentReport?.externalCcofStatusCode !== ENROLMENT_REPORT_STATUSES.DRAFT ||
        this.enrolmentReport?.externalCcfriStatusCode !== ENROLMENT_REPORT_STATUSES.DRAFT
      );
    },
  },
  created() {
    this.PATHS = PATHS;
  },
};
