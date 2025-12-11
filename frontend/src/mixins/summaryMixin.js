import { isEmpty } from 'lodash';
import { mapState } from 'pinia';

import SummaryExpansionPanelTitle from '@/components/guiComponents/SummaryExpansionPanelTitle.vue';
import NavButton from '@/components/util/NavButton.vue';
import alertMixin from '@/mixins/alertMixin.js';
import ApplicationService from '@/services/applicationService';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useAuthStore } from '@/store/auth';
import { useSummaryDeclarationStore } from '@/store/summaryDeclaration.js';
import { getOptInOptOut, getYesNoValue, isNullOrBlank } from '@/utils/common.js';
import {
  CCFRI_MAX_FEE,
  CCFRI_MIN_FEE,
  DEFAULT_NUMBER_OF_PARTNERS,
  EMPTY_PLACEHOLDER,
  ERROR_MESSAGES,
  FACILITY_HAS_RECEIVE_FUNDING_VALUES,
  OPT_STATUSES,
  ORGANIZATION_PROVIDER_TYPES,
  ORGANIZATION_TYPES,
  PATHS,
  PROGRAM_YEAR_LANGUAGE_TYPES,
  YES_NO_VALUES,
} from '@/utils/constants.js';
import { formatTime24to12 } from '@/utils/format';
import rules from '@/utils/rules.js';

export default {
  components: { NavButton, SummaryExpansionPanelTitle },
  mixins: [alertMixin],
  computed: {
    ...mapState(useAppStore, [
      'getFamilyLicenceCategoryNumberById',
      'getHealthAuthorityNameById',
      'getLanguageYearLabel',
    ]),
    ...mapState(useApplicationStore, [
      'applicationUploadedDocuments',
      'isApplicationProcessing',
      'isRenewal',
      'showApplicationTemplateV1',
    ]),
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useSummaryDeclarationStore, ['summaryModel']),
    isPartnership() {
      return this.summaryModel?.organization?.organizationType === ORGANIZATION_TYPES.PARTNERSHIP;
    },
    isSoleProprietorship() {
      return this.summaryModel?.organization?.organizationType === ORGANIZATION_TYPES.SOLE_PROPRIETORSHIP;
    },
    isGroup() {
      return this.summaryModel?.application?.organizationProviderType === ORGANIZATION_PROVIDER_TYPES.GROUP;
    },
    numberOfPartners() {
      return Math.max(
        ApplicationService.getNumberOfPartners(this.summaryModel?.organization),
        DEFAULT_NUMBER_OF_PARTNERS,
      );
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
        case ORGANIZATION_TYPES.SOLE_PROPRIETORSHIP:
          return 'Sole Proprietorship';
        case ORGANIZATION_TYPES.PARTNERSHIP:
          return 'Partnership';
        default:
          return '';
      }
    },
    facilityHasReceivedFundingLabels() {
      switch (this.facilityInfo?.hasReceivedFunding) {
        case FACILITY_HAS_RECEIVE_FUNDING_VALUES.NO:
          return 'No';
        case FACILITY_HAS_RECEIVE_FUNDING_VALUES.YES:
          return 'Yes';
        case FACILITY_HAS_RECEIVE_FUNDING_VALUES.YES_FACILITY:
          return 'Yes, as facility';
        default:
          return null;
      }
    },
  },
  created() {
    this.rules = rules;
    this.ccfriFeeRules = [
      rules.isNumber,
      rules.max(CCFRI_MAX_FEE, `Max fee is $${CCFRI_MAX_FEE}.00`),
      rules.min(CCFRI_MIN_FEE, 'Input a positive number'),
    ];
    this.formatTime24to12 = formatTime24to12;
    this.EMPTY_PLACEHOLDER = EMPTY_PLACEHOLDER;
    this.ERROR_MESSAGES = ERROR_MESSAGES;
    this.FACILITY_HAS_RECEIVE_FUNDING_VALUES = FACILITY_HAS_RECEIVE_FUNDING_VALUES;
    this.OPT_STATUSES = OPT_STATUSES;
    this.ORGANIZATION_PROVIDER_TYPES = ORGANIZATION_PROVIDER_TYPES;
    this.ORGANIZATION_TYPES = ORGANIZATION_TYPES;
    this.PATHS = PATHS;
    this.PROGRAM_YEAR_LANGUAGE_TYPES = PROGRAM_YEAR_LANGUAGE_TYPES;
    this.YES_NO_VALUES = YES_NO_VALUES;
  },
  methods: {
    getOptInOptOut,
    getYesNoValue,
    isEmpty,
    isNullOrBlank,
  },
};
