import { isEmpty } from 'lodash';
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
    showErrorMessage() {
      return !this.isLocked && this.isValidated;
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
    hasSchoolAgeCareServices() {
      return (
        this.model.beforeSchool ||
        this.model.afterSchool ||
        this.model.beforeKindergarten ||
        this.model.afterKindergarten
      );
    },
    hasLicenceCategoryWithExtendedChildCare() {
      return (
        this.model.hasUnder36MonthsExtendedCC ||
        this.model.has30MonthToSchoolAgeExtendedCC ||
        this.model.hasSchoolAgeCareOnSchoolGroundsExtendedCC ||
        this.model.hasMultiAgeExtendedCC
      );
    },
    totalMaxSpacesUnder36ExtendedChildCare() {
      return this.model.extendedChildCareUnder36Months4OrLess + this.model.extendedChildCareUnder36Months4OrMore;
    },
    totalMaxSpaces30MonthToSchoolAgeExtendedChildCare() {
      return (
        this.model.extendedChildCare36MonthsToSchoolAge4OrLess + this.model.extendedChildCare36MonthsToSchoolAge4OrMore
      );
    },
    totalMaxSpacesSchoolAgeCareOnSchoolGroundsExtendedChildCare() {
      return this.model.extendedChildCareSchoolAge4OrLess + this.model.extendedChildCareSchoolAge4OrMore;
    },
    totalMaxSpacesMultiAgeExtendedChildCare() {
      return this.model.multiAgeCare4OrLess + this.model.multiAgeCare4more;
    },
    isUnder36ExtendedChildCareValid() {
      return !this.model.hasUnder36MonthsExtendedCC || this.totalMaxSpacesUnder36ExtendedChildCare > 0;
    },
    is30MonthToSchoolAgeExtendedChildCareValid() {
      return !this.model.has30MonthToSchoolAgeExtendedCC || this.totalMaxSpaces30MonthToSchoolAgeExtendedChildCare > 0;
    },
    isSchoolAgeCareOnSchoolGroundsExtendedChildCareValid() {
      return (
        !this.model.hasSchoolAgeCareOnSchoolGroundsExtendedCC ||
        this.totalMaxSpacesSchoolAgeCareOnSchoolGroundsExtendedChildCare > 0
      );
    },
    isMultiAgeExtendedChildCareValid() {
      return !this.model.hasMultiAgeExtendedCC || this.totalMaxSpacesMultiAgeExtendedChildCare > 0;
    },
    isFormComplete() {
      return (
        this.model.isCCOFComplete &&
        this.hasLicenceCategory &&
        (!this.model.hasSchoolAgeCareOnSchoolGrounds || this.hasSchoolAgeCareServices) &&
        (this.model.isExtendedHours === 0 ||
          (this.hasLicenceCategoryWithExtendedChildCare &&
            this.isUnder36ExtendedChildCareValid &&
            this.is30MonthToSchoolAgeExtendedChildCareValid &&
            this.isSchoolAgeCareOnSchoolGroundsExtendedChildCareValid &&
            this.isMultiAgeExtendedChildCareValid))
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
      this.model.isCCOFComplete = this.isFormComplete;
      this.setFundingModel({ ...this.model });
      this.addModelToStore({ fundingId: this.$route.params.urlGuid, model: this.model });
      this.setNavBarFundingComplete({ fundingId: this.$route.params.urlGuid, complete: this.model.isCCOFComplete });
      try {
        await this.saveFunding();

        if (this.changeType == CHANGE_TYPES.NEW_FACILITY) {
          let newFac = this.getChangeActionNewFacByFacilityId(this.fundingModel.facilityId);

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
    resetSelectedClosedMonths() {
      if (isEmpty(this.model)) return;
      for (let i = 1; i <= 12; i++) {
        this.model[`closedIn${i}`] = null;
      }
    },
    resetGroupChildCareSchoolAgeRelatedFields() {
      if (isEmpty(this.model)) return;
      this.model.maxGroupChildCareSchool = null;
      this.model.beforeSchool = null;
      this.model.beforeKindergarten = null;
      this.model.afterKindergarten = null;
      this.model.afterSchool = null;
    },
    resetPreschoolRelatedFields() {
      if (isEmpty(this.model)) return;
      this.model.maxPreschool = null;
      this.model.monday = null;
      this.model.tusday = null;
      this.model.wednesday = null;
      this.model.thursday = null;
      this.model.friday = null;
    },
    resetExtendedHoursFields() {
      if (isEmpty(this.model)) return;
      this.model.maxDaysPerWeekExtended = null;
      this.model.maxWeeksPerYearExtended = null;
      this.model.hasUnder36MonthsExtendedCC = null;
      this.resetUnder36MonthsExtendedCCRelatedFields();
      this.model.has30MonthToSchoolAgeExtendedCC = null;
      this.reset30MonthsToSchoolAgeExtendedCCRelatedFields();
      this.model.hasSchoolAgeCareOnSchoolGroundsExtendedCC = null;
      this.resetSchoolAgeExtendedCCRelatedFields();
      this.model.hasMultiAgeExtendedCC = null;
      this.resetMultiAgeExtendedCCRelatedFields();
    },
    resetUnder36MonthsExtendedCCRelatedFields() {
      if (isEmpty(this.model)) return;
      this.model.extendedChildCareUnder36Months4OrLess = null;
      this.model.extendedChildCareUnder36Months4OrMore = null;
    },
    reset30MonthsToSchoolAgeExtendedCCRelatedFields() {
      if (isEmpty(this.model)) return;
      this.model.extendedChildCare36MonthsToSchoolAge4OrLess = null;
      this.model.extendedChildCare36MonthsToSchoolAge4OrMore = null;
    },
    resetSchoolAgeExtendedCCRelatedFields() {
      if (isEmpty(this.model)) return;
      this.model.extendedChildCareSchoolAge4OrLess = null;
      this.model.extendedChildCareSchoolAge4OrMore = null;
    },
    resetMultiAgeExtendedCCRelatedFields() {
      if (isEmpty(this.model)) return;
      this.model.multiAgeCare4OrLess = null;
      this.model.multiAgeCare4more = null;
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
