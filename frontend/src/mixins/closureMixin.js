import { cloneDeep, isEmpty, isEqual } from 'lodash';
import moment from 'moment';
import { mapActions, mapState } from 'pinia';

import AppAlertBanner from '@/components/guiComponents/AppAlertBanner.vue';
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDateInput from '@/components/guiComponents/AppDateInput.vue';
import ApplicationPCFHeader from '@/components/util/ApplicationPCFHeader.vue';
import NavButton from '@/components/util/NavButton.vue';
import alertMixin from '@/mixins/alertMixin.js';
import globalMixin from '@/mixins/globalMixin.js';
import ApplicationService from '@/services/applicationService';
import ClosureService from '@/services/closureService.js';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useCcfriAppStore } from '@/store/ccfriApp.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useReportChangesStore } from '@/store/reportChanges.js';
import {
  CCFRI_FEE_CORRECT_TYPES,
  CCFRI_HAS_CLOSURE_FEE_TYPES,
  CLOSURE_AFFECTED_AGE_GROUPS,
  CLOSURE_PAYMENT_ELIGIBILITIES,
  CLOSURE_STATUSES,
  CLOSURE_TYPES,
  PROGRAM_YEAR_LANGUAGE_TYPES,
} from '@/utils/constants.js';
import rules from '@/utils/rules.js';

export default {
  components: {
    AppAlertBanner,
    AppButton,
    AppDateInput,
    ApplicationPCFHeader,
    NavButton,
  },
  mixins: [alertMixin, globalMixin],
  data() {
    return {
      closures: [],
      updatedClosures: [],
    };
  },
  computed: {
    ...mapState(useAppStore, ['getLanguageYearLabel']),
    ...mapState(useApplicationStore, [
      'applicationStatus',
      'fiscalStartAndEndDates',
      'formattedProgramYear',
      'isApplicationFormValidated',
      'isApplicationProcessing',
      'programYearId',
      'showApplicationTemplateV1',
    ]),
    ...mapState(useNavBarStore, [
      'navBarList',
      'changeType',
      'nextPath',
      'previousPath',
      'isChangeRequest',
      'getChangeActionNewFacByFacilityId',
    ]),
    ...mapState(useCcfriAppStore, ['CCFRIFacilityModel', 'loadedModel']),
    ...mapState(useOrganizationStore, ['organizationId']),
    ...mapState(useReportChangesStore, ['changeRequestStatus']),
    currentFacility() {
      return this.navBarList.find((el) => el.ccfriApplicationId == this.$route.params.urlGuid);
    },
    isReadOnly() {
      if (this.currentFacility.unlockCcfri) {
        return false;
      }
      if (this.isChangeRequest) {
        return this.changeRequestStatus && this.changeRequestStatus !== 'INCOMPLETE';
      }
      return this.applicationStatus === 'SUBMITTED';
    },
    childCareCategories() {
      const ageGroups = [];
      this.CCFRIFacilityModel?.childCareTypes
        ?.filter((careType) => careType.programYearId === this.$route.params.programYearGuid)
        ?.forEach((ageGroup) => {
          ageGroups.push({
            label: ageGroup.childCareCategory,
            value: CLOSURE_AFFECTED_AGE_GROUPS[ageGroup.childCareCategory],
          });
        });
      return ageGroups;
    },
    hasIllegalDates() {
      return this.updatedClosures?.some((el) => el.datesOverlap || el.datesInvalid);
    },
    isFormComplete() {
      const model = {
        hasClosureFees: this.CCFRIFacilityModel.hasClosureFees,
        closures: this.updatedClosures,
      };
      return ApplicationService.isClosuresComplete(model);
    },
  },
  created() {
    this.rules = rules;
    this.CCFRI_HAS_CLOSURE_FEE_TYPES = CCFRI_HAS_CLOSURE_FEE_TYPES;
    this.CCFRI_FEE_CORRECT_TYPES = CCFRI_FEE_CORRECT_TYPES;
    this.PROGRAM_YEAR_LANGUAGE_TYPES = PROGRAM_YEAR_LANGUAGE_TYPES;
  },
  methods: {
    ...mapActions(useApplicationStore, ['setIsApplicationProcessing', 'validateApplicationForm']),
    ...mapActions(useCcfriAppStore, ['loadCCFRIFacility', 'updateApplicationCCFRI']),
    ...mapActions(useNavBarStore, ['setNavBarCCFRIClosuresComplete']),
    addRow(isAddButtonClicked) {
      if (!isAddButtonClicked && this.updatedClosures.length > 0) return;
      this.updatedClosures.push({});
    },

    dateFunction(date1, date2) {
      const startDate = new Date(date1);
      const endDate = new Date(date2);
      const dates = [];
      const currentDate = new Date(startDate.getTime());

      while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().substring(0, 10));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return dates;
    },
    validateClosureDates(obj) {
      // Get all closure dates except for the currently edited row
      const otherClosureDates = this.updatedClosures
        .filter((dateObj) => dateObj.id !== obj.id || dateObj.closureId !== obj.closureId)
        .reduce((acc, dateObj) => {
          return [...acc, ...this.dateFunction(dateObj.startDate, dateObj.endDate)];
        }, []);

      const dates = this.dateFunction(obj.startDate, obj.endDate);

      //datesOverlap flag is true if the selected dates are part of an overlap of other dates.
      //datesInvalid is true if user breaks any other date rule.

      //We do not let users save invalid dates of any kind so there is no risk of a mis-calculation in Dynamics
      //Rules are: end date cannot be before start date
      //start date for either field cannot be before the start of fiscal year
      //end dates for either field cannot be after end of fiscal year

      if (
        obj.endDate < obj.startDate ||
        obj.startDate < this.fiscalStartAndEndDates.startDate ||
        obj.endDate < this.fiscalStartAndEndDates.startDate ||
        obj.startDate > this.fiscalStartAndEndDates.endDate ||
        obj.endDate > this.fiscalStartAndEndDates.endDate
      ) {
        obj.datesInvalid = true;
        return;
      }

      obj.datesOverlap = false;
      obj.datesInvalid = false;
      dates.forEach((date) => {
        if (otherClosureDates.includes(date)) {
          obj.datesOverlap = true;
        }
      });
    },
    removeClosure(index) {
      this.updatedClosures.splice(index, 1);
      if (isEmpty(this.updatedClosures)) this.addRow(false);
    },
    previous() {
      this.$router.push(this.previousPath);
    },
    next() {
      this.$router.push(this.nextPath);
    },
    hasClosureChanged(closure, updatedClosure) {
      // console.log(closure);
      // console.log(updatedClosure);
      const isAgeGroupsUpdated =
        (!isEmpty(closure?.ageGroups) || !isEmpty(updatedClosure?.ageGroups)) &&
        !isEqual(closure?.ageGroups, updatedClosure?.ageGroups);
      return (
        closure?.closureReason !== updatedClosure?.closureReason ||
        closure?.fullClosure !== updatedClosure?.fullClosure ||
        moment.utc(closure?.startDate).format('YYYY-MM-DD') !== updatedClosure?.startDate ||
        moment.utc(closure?.endDate).format('YYYY-MM-DD') !== updatedClosure?.endDate ||
        isAgeGroupsUpdated
      );
    },
    async save(showMessage) {
      if (this.isReadonly) return;
      try {
        this.setIsApplicationProcessing(true);
        if (this.loadedModel?.hasClosureFees !== this.CCFRIFacilityModel?.hasClosureFees) {
          await this.updateApplicationCCFRI(this.$route.params.urlGuid, {
            hasClosureFees: this.CCFRIFacilityModel.hasClosureFees,
          });
          this.loadedModel.hasClosureFees = this.CCFRIFacilityModel.hasClosureFees;
        }
        await this.processUpdatedClosures();
        console.log('SAVE: ');
        console.log(this.isFormComplete);
        this.setNavBarCCFRIClosuresComplete({ ccfriId: this.$route.params.urlGuid, complete: this.isFormComplete });
        // if (this.changeType == CHANGE_TYPES.NEW_FACILITY) {
        //   const newFac = this.getChangeActionNewFacByFacilityId(this.CCFRIFacilityModel.facilityId);
        //   newFac.ccfri.isCCFRIComplete = this.isFormComplete();
        // }
        if (showMessage) {
          this.setSuccessAlert('Application saved successfully.');
        }
      } catch (error) {
        console.log(error);
        this.setFailureAlert('An error occurred while saving.');
      } finally {
        this.setIsApplicationProcessing(false);
      }
    },
    buildClosurePayload(closure) {
      if (!closure) return {};
      const payload = cloneDeep(closure);
      const DEFAULT_TIME_SUFFIX = 'T12:00:00-07:00';
      const appendDefaultTimeSuffix = (date) =>
        date?.includes(DEFAULT_TIME_SUFFIX) ? date : `${date}${DEFAULT_TIME_SUFFIX}`;
      if (closure.fullClosure === false && !isEmpty(closure.ageGroups)) {
        payload.ageGroups = Array.isArray(closure.ageGroups) ? closure.ageGroups.join(',') : closure.ageGroups;
      } else {
        payload.ageGroups = null;
      }
      payload.closureStatus = closure.closureStatus ?? CLOSURE_STATUSES.PENDING;
      payload.closureType = closure.closureType ?? CLOSURE_TYPES.KNOWN_CLOSURES;
      payload.feesPaidWhileClosed = closure.feesPaidWhileClosed ?? 1;
      payload.paymentEligibility = closure.paymentEligibility ?? String(CLOSURE_PAYMENT_ELIGIBILITIES.CCFRI);
      payload.startDate = closure.startDate ? appendDefaultTimeSuffix(closure.startDate) : null;
      payload.endDate = closure.endDate ? appendDefaultTimeSuffix(closure.endDate) : null;
      payload.ccfriApplicationId = closure.ccfriApplicationId ?? this.$route.params.urlGuid;
      payload.facilityId = closure.facilityId ?? this.CCFRIFacilityModel.facilityId;
      payload.organizationId = closure.organizationId ?? this.organizationId;
      payload.programYearId = closure.programYearId ?? this.programYearId;
      return payload;
    },
    async processUpdatedClosures() {
      const closuresToCreate = this.updatedClosures?.filter(
        (updatedClosure) => !updatedClosure.closureId && !isEmpty(updatedClosure),
      );
      const closuresToUpdate = this.updatedClosures?.filter((updatedClosure) => {
        const found = this.closures?.find(
          (closure) =>
            closure.closureId === updatedClosure.closureId && this.hasClosureChanged(closure, updatedClosure),
        );
        return found;
      });
      const closuresToDelete = this.closures?.filter((closure) => {
        const found = this.updatedClosures?.find((updatedClosure) => updatedClosure.closureId === closure.closureId);
        return !found;
      });
      // console.log('closuresToCreate');
      // console.log(closuresToCreate);
      // console.log('closuresToUpdate');
      // console.log(closuresToUpdate);
      // console.log('closuresToDelete');
      // console.log(closuresToDelete);
      await Promise.all(
        closuresToCreate?.map(async (closure) => {
          const payload = this.buildClosurePayload(closure);
          await ClosureService.createClosure(payload);
        }),
      );
      await Promise.all(
        closuresToUpdate?.map(async (closure) => {
          const payload = this.buildClosurePayload(closure);
          await ClosureService.updateClosure(payload);
        }),
      );
      await ClosureService.deleteClosures(closuresToDelete);
      this.closures = cloneDeep(this.updatedClosures);
    },
  },
};
