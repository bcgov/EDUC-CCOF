import { mapState } from 'pinia';

import SummaryExpansionPanelTitle from '@/components/guiComponents/SummaryExpansionPanelTitle.vue';
import NavButton from '@/components/util/NavButton.vue';
import alertMixin from '@/mixins/alertMixin.js';
import { useApplicationStore } from '@/store/application.js';
import { useAuthStore } from '@/store/auth';
import { useSummaryDeclarationStore } from '@/store/summaryDeclaration.js';
import { getOptInOptOut, isNullOrBlank } from '@/utils/common.js';
import { ORGANIZATION_PROVIDER_TYPES, ORGANIZATION_TYPES, PATHS } from '@/utils/constants.js';
import rules from '@/utils/rules.js';

export default {
  components: { NavButton, SummaryExpansionPanelTitle },
  mixins: [alertMixin],
  computed: {
    ...mapState(useApplicationStore, [
      'applicationUploadedDocuments',
      'isApplicationProcessing',
      'isRenewal',
      'showApplicationTemplateV1',
    ]),
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useSummaryDeclarationStore, ['summaryModel']),
    isSoleProprietorshipPartnership() {
      return this.summaryModel?.organization?.organizationType === ORGANIZATION_TYPES.SOLE_PROPRIETORSHIP_PARTNERSHIP;
    },
    isGroup() {
      return this.summaryModel?.application?.organizationProviderType === ORGANIZATION_PROVIDER_TYPES.GROUP;
    },
    organizationType() {
      switch (this.summaryModel?.organization?.organizationType) {
        case ORGANIZATION_TYPES.NON_PROFIT_SOCIETY:
          return 'Non-Profit Society';
        case ORGANIZATION_TYPES.PUBLIC_INSTITUTION:
          return 'Public Institution(college/university)';
        case ORGANIZATION_TYPES.REGISTERED_COMPANY:
          return 'Registered Company';
        case ORGANIZATION_TYPES.LOCAL_GOVERNMENT:
          return 'Local Government';
        case ORGANIZATION_TYPES.FIRST_NATIONS_GOVERNMENT:
          return 'First Nations Government';
        case ORGANIZATION_TYPES.SOLE_PROPRIETORSHIP_PARTNERSHIP:
          return 'Sole Proprietorship or Partnership';
        default:
          return '';
      }
    },
  },
  created() {
    this.rules = rules;
    this.ORGANIZATION_PROVIDER_TYPES = ORGANIZATION_PROVIDER_TYPES;
    this.ORGANIZATION_TYPES = ORGANIZATION_TYPES;
    this.PATHS = PATHS;
  },
  methods: {
    getOptInOptOut,
    isNullOrBlank,
  },
};
