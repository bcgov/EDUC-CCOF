import { isEmpty } from 'lodash';
import { mapActions, mapState } from 'pinia';

import AppTimeInput from '@/components/guiComponents/AppTimeInput.vue';
import AppTooltip from '@/components/guiComponents/AppTooltip.vue';
import NavButton from '@/components/util/NavButton.vue';
import alertMixin from '@/mixins/alertMixin.js';
import ApplicationService from '@/services/applicationService';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useFundingStore } from '@/store/ccof/funding.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useReportChangesStore } from '@/store/reportChanges.js';
import { isNullOrBlank } from '@/utils/common.js';
import {
  CHANGE_TYPES,
  ERROR_MESSAGES,
  FAMILY_LICENCE_CATEGORIES,
  GROUP_LICENCE_CATEGORIES,
  ORGANIZATION_PROVIDER_TYPES,
} from '@/utils/constants.js';
import rules from '@/utils/rules.js';

export default {
  components: { AppTimeInput, AppTooltip, NavButton },
  mixins: [alertMixin],
  data() {
    return {
      isFormValidated: false,
    };
  },
  computed: {
    ...mapState(useAppStore, ['getFamilyLicenceCategoryNumberById', 'lookupInfo']),
    ...mapState(useFundingStore, ['fundingModel']),
    ...mapState(useOrganizationStore, ['organizationProviderType']),
    ...mapState(useApplicationStore, [
      'unlockBaseFunding',
      'applicationStatus',
      'isApplicationFormValidated',
      'isApplicationProcessing',
      'showApplicationTemplateV1',
    ]),
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
      return this.isFormValidated && !this.isLocked;
    },
    hasAllMonthsClosed() {
      return ApplicationService.hasAllMonthsClosed(this.fundingModel);
    },
    hasNoMonthClosed() {
      return ApplicationService.hasNoMonthClosed(this.fundingModel);
    },
    hasLicenceCategory() {
      return ApplicationService.hasLicenceCategory(this.fundingModel);
    },
    hasSchoolAgeCareLicenceCategory() {
      return ApplicationService.hasSchoolAgeCareLicenceCategory(this.fundingModel);
    },
    hasSchoolAgeCareServices() {
      return ApplicationService.hasSchoolAgeCareServices(this.fundingModel);
    },
    hasLicenceCategoryWithExtendedChildCare() {
      return ApplicationService.hasLicenceCategoryWithExtendedChildCare(this.fundingModel);
    },
    isUnder36ExtendedCCMaxSpacesEntered() {
      return ApplicationService.isGroupExtendedCCMaxSpacesEntered(
        this.fundingModel,
        GROUP_LICENCE_CATEGORIES.GROUP_CHILD_CARE_UNDER_36_MONTHS,
      );
    },
    is30MonthToSchoolAgeExtendedCCMaxSpacesEntered() {
      return ApplicationService.isGroupExtendedCCMaxSpacesEntered(
        this.fundingModel,
        GROUP_LICENCE_CATEGORIES.GROUP_CHILD_CARE_30_MONTHS_TO_SCHOOL_AGE,
      );
    },
    isSchoolAgeExtendedCCMaxSpacesEntered() {
      return ApplicationService.isGroupExtendedCCMaxSpacesEntered(
        this.fundingModel,
        GROUP_LICENCE_CATEGORIES.GROUP_CHILD_CARE_SCHOOL_AGE,
      );
    },
    isSchoolAgeCareOnSchoolGroundsExtendedCCMaxSpacesEntered() {
      return ApplicationService.isGroupExtendedCCMaxSpacesEntered(
        this.fundingModel,
        GROUP_LICENCE_CATEGORIES.SCHOOL_AGE_CARE_ON_SCHOOL_GROUNDS,
      );
    },
    isMultiAgeExtendedCCMaxSpacesEntered() {
      return ApplicationService.isGroupExtendedCCMaxSpacesEntered(
        this.fundingModel,
        GROUP_LICENCE_CATEGORIES.MULTI_AGE_CHILD_CARE,
      );
    },
    isFormComplete() {
      if (this.showApplicationTemplateV1) {
        return this.fundingModel.isCCOFComplete;
      }
      return this.organizationProviderType === ORGANIZATION_PROVIDER_TYPES.FAMILY
        ? ApplicationService.isCCOFCompleteFamilyV2(this.fundingModel)
        : ApplicationService.isCCOFCompleteGroupV2(this.fundingModel);
    },
  },
  created() {
    this.rules = rules;
    this.ERROR_MESSAGES = ERROR_MESSAGES;
    this.FAMILY_LICENCE_CATEGORIES = FAMILY_LICENCE_CATEGORIES;
  },
  methods: {
    ...mapActions(useApplicationStore, ['setIsApplicationProcessing', 'validateApplicationForm']),
    ...mapActions(useFundingStore, ['saveFunding', 'loadFunding', 'fundingId', 'setFundingModel', 'addModelToStore']),
    ...mapActions(useNavBarStore, ['setNavBarFundingComplete']),
    isEmpty,
    async loadData() {
      try {
        if (!this.$route.params.urlGuid) return;
        this.setIsApplicationProcessing(true);
        await this.loadFunding(this.$route.params.urlGuid);
      } catch (error) {
        console.error(`Failed to get Licence and Service details with error - ${error}`);
        this.setFailureAlert('An error occurred while loading Licence and Service details. Please try again later.');
      } finally {
        this.setIsApplicationProcessing(false);
      }
    },
    previous() {
      this.$router.push(this.previousPath);
    },
    next() {
      this.$router.push(this.nextPath);
    },
    async save(showConfirmation) {
      try {
        if (this.isLocked || this.isApplicationProcessing) return;
        this.setIsApplicationProcessing(true);
        this.fundingModel.isCCOFComplete = this.isFormComplete;
        this.setNavBarFundingComplete({
          fundingId: this.$route.params.urlGuid,
          complete: this.fundingModel.isCCOFComplete,
        });

        if (this.organizationProviderType === ORGANIZATION_PROVIDER_TYPES.FAMILY) {
          this.processFamilyFunding();
        }

        await this.saveFunding(this.$route.params.urlGuid);

        if (this.changeType === CHANGE_TYPES.NEW_FACILITY) {
          const newFac = this.getChangeActionNewFacByFacilityId(this.fundingModel.facilityId);

          newFac.baseFunding.isCCOFComplete = this.fundingModel.isCCOFComplete;
        }
        if (showConfirmation) {
          this.setSuccessAlert('Application saved successfully.');
        }
      } catch (error) {
        this.setFailureAlert('An error occurred while saving. Please try again later.');
        console.log(error);
      } finally {
        this.setIsApplicationProcessing(false);
      }
    },

    processFamilyFunding() {
      if (this.isEmpty(this.fundingModel)) return;
      const resetValues = function (model, fieldNames) {
        fieldNames.forEach((field) => (model[field] = null));
      };
      const FAMILY_CC_FIELDS = ['maxFamilyChildCare', 'familyExtendedCC4OrLess', 'familyExtendedCC4OrMore'];
      const IN_HOME_MULTI_AGE_CC_FIELDS = [
        'maxInHomeMultiAgeChildCare',
        'inHomeMultiAgeExtendedCC4OrLess',
        'inHomeMultiAgeExtendedCC4OrMore',
      ];
      const MULTI_AGE_CC_FIEDS = ['maxGroupChildCareMultiAge', 'multiAgeCare4OrLess', 'multiAgeCare4more'];
      if (this.fundingModel.licenceCategoryNumber === FAMILY_LICENCE_CATEGORIES.FAMILY_CHILD_CARE) {
        this.fundingModel.maxFamilyChildCare = this.fundingModel.maxLicensesCapacity;
        resetValues(this.fundingModel, IN_HOME_MULTI_AGE_CC_FIELDS);
        resetValues(this.fundingModel, MULTI_AGE_CC_FIEDS);
      } else if (this.fundingModel.licenceCategoryNumber === FAMILY_LICENCE_CATEGORIES.IN_HOME_MULTI_AGE_CHILD_CARE) {
        this.fundingModel.maxInHomeMultiAgeChildCare = this.fundingModel.maxLicensesCapacity;
        resetValues(this.fundingModel, FAMILY_CC_FIELDS);
        resetValues(this.fundingModel, MULTI_AGE_CC_FIEDS);
      } else if (this.fundingModel.licenceCategoryNumber === FAMILY_LICENCE_CATEGORIES.MULTI_AGE_CHILD_CARE) {
        this.fundingModel.maxGroupChildCareMultiAge = this.fundingModel.maxLicensesCapacity;
        resetValues(this.fundingModel, FAMILY_CC_FIELDS);
        resetValues(this.fundingModel, IN_HOME_MULTI_AGE_CC_FIELDS);
      }
    },

    resetSelectedClosedMonths() {
      if (isEmpty(this.fundingModel)) return;
      for (let i = 1; i <= 12; i++) {
        this.fundingModel[`closedIn${i}`] = null;
      }
    },
    resetGroupChildCareSchoolAgeRelatedFields() {
      if (isEmpty(this.fundingModel)) return;
      this.fundingModel.maxGroupChildCareSchool = null;
      this.resetSchoolAgeCareServiceDetails();
    },
    resetSchoolAgeCareOnSchoolGroundsRelatedFields() {
      if (isEmpty(this.fundingModel)) return;
      this.fundingModel.maxSchoolAgeCareOnSchoolGrounds = null;
      this.resetSchoolAgeCareServiceDetails();
    },
    resetSchoolAgeCareServiceDetails() {
      if (this.hasSchoolAgeCareLicenceCategory) return;
      this.fundingModel.beforeSchool = null;
      this.fundingModel.beforeKindergarten = null;
      this.fundingModel.afterKindergarten = null;
      this.fundingModel.afterSchool = null;
    },
    resetPreschoolRelatedFields() {
      if (isEmpty(this.fundingModel)) return;
      this.fundingModel.maxPreschool = null;
      this.fundingModel.monday = null;
      this.fundingModel.tusday = null;
      this.fundingModel.wednesday = null;
      this.fundingModel.thursday = null;
      this.fundingModel.friday = null;
      this.fundingModel.total = null;
    },
    resetExtendedHoursFields() {
      if (isEmpty(this.fundingModel)) return;
      this.fundingModel.maxDaysPerWeekExtended = null;
      this.fundingModel.maxWeeksPerYearExtended = null;
      this.fundingModel.hasUnder36MonthsExtendedCC = null;
      this.resetUnder36MonthsExtendedCCRelatedFields();
      this.fundingModel.has30MonthToSchoolAgeExtendedCC = null;
      this.reset30MonthsToSchoolAgeExtendedCCRelatedFields();
      this.fundingModel.hasSchoolAgeExtendedCC = null;
      this.resetSchoolAgeExtendedCCRelatedFields();
      this.fundingModel.hasSchoolAgeCareOnSchoolGroundsExtendedCC = null;
      this.resetSchoolAgeCareOnSchoolGroundsExtendedCCRelatedFields();
      this.fundingModel.hasMultiAgeExtendedCC = null;
      this.resetMultiAgeExtendedCCRelatedFields();
    },
    resetUnder36MonthsExtendedCCRelatedFields() {
      if (isEmpty(this.fundingModel)) return;
      this.fundingModel.extendedChildCareUnder36Months4OrLess = null;
      this.fundingModel.extendedChildCareUnder36Months4OrMore = null;
    },
    reset30MonthsToSchoolAgeExtendedCCRelatedFields() {
      if (isEmpty(this.fundingModel)) return;
      this.fundingModel.extendedChildCare36MonthsToSchoolAge4OrLess = null;
      this.fundingModel.extendedChildCare36MonthsToSchoolAge4OrMore = null;
    },
    resetSchoolAgeExtendedCCRelatedFields() {
      if (isEmpty(this.fundingModel)) return;
      this.fundingModel.extendedChildCareSchoolAge4OrLess = null;
      this.fundingModel.extendedChildCareSchoolAge4OrMore = null;
    },
    resetSchoolAgeCareOnSchoolGroundsExtendedCCRelatedFields() {
      if (isEmpty(this.fundingModel)) return;
      this.fundingModel.extendedSchoolAgeCareOnSchoolGrounds4OrLess = null;
      this.fundingModel.extendedSchoolAgeCareOnSchoolGrounds4OrMore = null;
    },
    resetMultiAgeExtendedCCRelatedFields() {
      if (isEmpty(this.fundingModel)) return;
      this.fundingModel.multiAgeCare4OrLess = null;
      this.fundingModel.multiAgeCare4more = null;
    },

    /*
      CCFRI-4682 - Legacy code to support application template (V1).
    */
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
      if (isNullOrBlank(this.fundingModel[`${forFieldName}`]) || this.fundingModel[`${forFieldName}`] > 0) return true;
      if (
        isNullOrBlank(this.fundingModel[`${otherFieldNAme1}`]) ||
        isNullOrBlank(this.fundingModel[`${otherFieldNAme2}`]) ||
        isNullOrBlank(this.fundingModel[`${otherFieldNAme3}`]) ||
        isNullOrBlank(this.fundingModel[`${otherFieldNAme4}`])
      )
        return true;
      const sum =
        (this.fundingModel[`${otherFieldNAme1}`] || 0) +
        (this.fundingModel[`${otherFieldNAme2}`] || 0) +
        (this.fundingModel[`${otherFieldNAme3}`] || 0) +
        (this.fundingModel[`${otherFieldNAme4}`] || 0);
      return sum > 0 ? true : 'At least one Licence Type should have a maximum capacity above zero.';
    },
    /*
      CCFRI-4682 - END OF Legacy code to support application template (V1).
    */
  },
};
