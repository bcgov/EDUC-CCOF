import { mapActions, mapState } from 'pinia';

import NavButton from '../components/util/NavButton.vue';
import { useAppStore } from '../store/app.js';
import { useApplicationStore } from '../store/application.js';
import { useFundingStore } from '../store/ccof/funding.js';
import { useOrganizationStore } from '../store/ccof/organization.js';
import { useNavBarStore } from '../store/navBar.js';
import { useReportChangesStore } from '../store/reportChanges.js';
import { isNullOrBlank } from '../utils/common.js';
import { CHANGE_TYPES, ORGANIZATION_PROVIDER_TYPES } from '../utils/constants.js';
import formatTime from '../utils/formatTime.js';
import rules from '../utils/rules.js';
import alertMixin from './alertMixin.js';

export default {
  components: { NavButton },
  mixins: [alertMixin],
  computed: {
    ...mapState(useFundingStore, ['fundingModel']),
    ...mapState(useOrganizationStore, ['organizationProviderType']),
    ...mapState(useAppStore, ['familyLicenseCategory']),
    ...mapState(useApplicationStore, ['unlockBaseFunding', 'applicationStatus']),
    ...mapState(useNavBarStore, [
      'changeRequestId',
      'changeType',
      'nextPath',
      'previousPath',
      'isChangeRequest',
      'getChangeActionNewFacByFacilityId',
    ]),
    ...mapState(useReportChangesStore, ['isCCOFUnlocked', 'changeRequestStatus']),
    isLocked() {
      if (this.isChangeRequest) {
        if (this.isCCOFUnlocked || !this.changeRequestStatus) {
          return false;
        } else if (this.changeRequestStatus !== 'INCOMPLETE') {
          return true;
        }
        return false;
      }
      if (this.unlockBaseFunding) {
        return false;
      }
      return this.applicationStatus === 'SUBMITTED' && !this.isChangeRequest;
    },
  },
  data() {
    return {
      processing: false,
      loading: true,
      model: {},
      rules,
    };
  },
  methods: {
    ...mapActions(useFundingStore, ['saveFunding', 'loadFunding', 'fundingId', 'setFundingModel', 'addModelToStore']),
    ...mapActions(useNavBarStore, ['setNavBarFundingComplete']),
    isGroup() {
      return this.organizationProviderType === ORGANIZATION_PROVIDER_TYPES.GROUP;
    },
    previous() {
      this.$router.push(this.previousPath);
    },
    next() {
      this.$router.push(this.nextPath);
    },
    validateForm() {
      this.$refs.form?.validate();
    },
    async save(isSave) {
      this.processing = true;
      this.setFundingModel({ ...this.model });
      this.addModelToStore({ fundingId: this.$route.params.urlGuid, model: this.model });
      this.setNavBarFundingComplete({ fundingId: this.$route.params.urlGuid, complete: this.model.isCCOFComplete });
      try {
        await this.saveFunding();

        if (this.changeType == CHANGE_TYPES.NEW_FACILITY) {
          let newFac = this.getChangeActionNewFacByFacilityId(this.fundingModel.facilityId);
          console.log(newFac);

          newFac.baseFunding.isCCOFComplete = this.model.isCCOFComplete;
        }
        if (isSave) {
          this.setSuccessAlert('Success! Funding information has been saved.');
        }
      } catch (error) {
        this.setFailureAlert('An error occurred while saving. Please try again later.');
        console.log(error);
      }
      this.processing = false;
    },
    allowedStep: (m) => m % 5 === 0,
    formatTime,
    groupValueRuleMaxGroupChildCareUnder36() {
      return this.groupValueRule(
        'maxGroupChildCareUnder36',
        'maxGroupChildCare36',
        'maxPreschool',
        'maxGroupChildCareSchool',
        'maxGroupChildCareMultiAge',
      );
    },
    groupValueRuleMaxGroupChildCare36() {
      return this.groupValueRule(
        'maxGroupChildCare36',
        'maxGroupChildCareUnder36',
        'maxPreschool',
        'maxGroupChildCareSchool',
        'maxGroupChildCareMultiAge',
      );
    },
    groupValueRuleMaxPreschool() {
      return this.groupValueRule(
        'maxPreschool',
        'maxGroupChildCareUnder36',
        'maxGroupChildCare36',
        'maxGroupChildCareSchool',
        'maxGroupChildCareMultiAge',
      );
    },
    groupValueRuleMaxGroupChildCareSchool() {
      return this.groupValueRule(
        'maxGroupChildCareSchool',
        'maxGroupChildCareUnder36',
        'maxGroupChildCare36',
        'maxPreschool',
        'maxGroupChildCareMultiAge',
      );
    },
    groupValueRuleMaxGroupChildCareMultiAge() {
      return this.groupValueRule(
        'maxGroupChildCareMultiAge',
        'maxGroupChildCareUnder36',
        'maxGroupChildCare36',
        'maxPreschool',
        'maxGroupChildCareSchool',
      );
    },
    groupValueRule(forFieldName, otherFieldNAme1, otherFieldNAme2, otherFieldNAme3, otherFieldNAme4) {
      if (!isNullOrBlank(this.model[`${forFieldName}`])) {
        if (this.model[`${forFieldName}`] > 0) {
          return true;
        } else if (
          !isNullOrBlank(this.model[`${otherFieldNAme1}`]) &&
          !isNullOrBlank(this.model[`${otherFieldNAme2}`]) &&
          !isNullOrBlank(this.model[`${otherFieldNAme3}`]) &&
          !isNullOrBlank(this.model[`${otherFieldNAme4}`])
        ) {
          const sum =
            (this.model[`${otherFieldNAme1}`] || 0) +
            (this.model[`${otherFieldNAme2}`] || 0) +
            (this.model[`${otherFieldNAme3}`] || 0) +
            (this.model[`${otherFieldNAme4}`] || 0);
          if (sum > 0) {
            return true;
          } else {
            return 'At least one Licence Type should have a maximum capacity above zero.';
          }
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
  },
  async beforeRouteLeave(_to, _from, next) {
    await this.save(false);
    next();
  },
  watch: {
    '$route.params.urlGuid': {
      async handler() {
        let ccofBaseFundingId = this.$route.params.urlGuid;
        if (ccofBaseFundingId) {
          await this.loadFunding(ccofBaseFundingId);
        }

        this.loading = false;
      },
      immediate: true,
      deep: true,
    },
    fundingModel: {
      handler() {
        this.model = { ...this.fundingModel };
        this.$refs.form?.resetValidation();
      },
      immediate: true,
      deep: true,
    },
  },
};
