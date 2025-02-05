import { mapActions, mapState } from 'pinia';

import NavButton from '@/components/util/NavButton.vue';
import alertMixin from '@/mixins/alertMixin.js';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useFundingStore } from '@/store/ccof/funding.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useReportChangesStore } from '@/store/reportChanges.js';
import { CHANGE_TYPES, ORGANIZATION_PROVIDER_TYPES } from '@/utils/constants.js';
import formatTime from '@/utils/formatTime.js';
import rules from '@/utils/rules.js';

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
    hasLicenceCategory() {
      return (
        this.model.hasUnder36Months ||
        this.model.has30MonthToSchoolAge ||
        this.model.hasSchoolAgeCareOnSchoolGrounds ||
        this.model.hasPreschool ||
        this.model.hasMultiAge
      );
    },
    hasExtendedHoursChildCare() {
      return this.model.isExtendedHours === 'yes';
    },
    hasLicenceCategoryWithExtendedChildCare() {
      return (
        this.model.hasUnder36MonthsExtendedCC ||
        this.model.has30MonthToSchoolAgeExtendedCC ||
        this.model.hasSchoolAgeCareOnSchoolGroundsExtendedCC ||
        this.model.hasMultiAgeExtendedCC
      );
    },
  },
  data() {
    return {
      processing: false,
      loading: true,
      isValidated: false,
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
      this.isValidated = true;
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
    formatTime,
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
