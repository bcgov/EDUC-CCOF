import ReportNavButtons from '@/components/guiComponents/ReportNavButtons.vue';
import EnrolmentReportHeader from '@/components/manageReports/enrolmentReports/EnrolmentReportHeader.vue';
import alertMixin from '@/mixins/alertMixin.js';
import permissionsMixin from '@/mixins/permissionsMixin.js';
import EnrolmentReportService from '@/services/enrolmentReportService.js';
import { ENROLMENT_REPORT_STATUSES, PATHS } from '@/utils/constants.js';

export default {
  components: {
    EnrolmentReportHeader,
    ReportNavButtons,
  },
  mixins: [alertMixin, permissionsMixin],
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
        EnrolmentReportService.isSubmissionDeadlinePassed(this.enrolmentReport) ||
        !this.hasPermission([this.PERMISSIONS.EDIT_DRAFT_ER, this.PERMISSIONS.ADJUST_EXISTING_ER])
      );
    },
  },
  created() {
    this.PATHS = PATHS;
  },
};
