import { cloneDeep, isEmpty, isEqual } from 'lodash';
import moment from 'moment';
import { mapState, mapWritableState } from 'pinia';

import AppAlertBanner from '@/components/guiComponents/AppAlertBanner.vue';
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDateInput from '@/components/guiComponents/AppDateInput.vue';
import ApplicationClosureCard from '@/components/util/ApplicationClosureCard.vue';
import ApplicationPCFHeader from '@/components/util/ApplicationPCFHeader.vue';
import NavButton from '@/components/util/NavButton.vue';
import ClosureService from '@/services/closureService.js';
import { useApplicationStore } from '@/store/application.js';
import { useCcfriAppStore } from '@/store/ccfriApp.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useReportChangesStore } from '@/store/reportChanges.js';
import {
  CCFRI_FEE_CORRECT_TYPES,
  CCFRI_HAS_CLOSURE_FEE_TYPES,
  CLOSURE_PAYMENT_ELIGIBILITIES,
  CLOSURE_STATUSES,
  CLOSURE_TYPES,
  PROGRAM_YEAR_LANGUAGE_TYPES,
  YES_NO_VALUES,
} from '@/utils/constants.js';
import rules from '@/utils/rules.js';

export default {
  components: {
    AppAlertBanner,
    AppButton,
    AppDateInput,
    ApplicationClosureCard,
    ApplicationPCFHeader,
    NavButton,
  },
  computed: {
    ...mapState(useApplicationStore, [
      'applicationStatus',
      'fiscalStartAndEndDates',
      'formattedProgramYear',
      'isApplicationFormValidated',
      'isApplicationProcessing',
      'programYearId',
      'showApplicationTemplateV1',
    ]),
    ...mapState(useNavBarStore, ['navBarList', 'changeType', 'isChangeRequest', 'getChangeActionNewFacByFacilityId']),
    ...mapState(useCcfriAppStore, ['CCFRIFacilityModel', 'loadedModel']),
    ...mapState(useOrganizationStore, ['organizationId']),
    ...mapState(useReportChangesStore, ['changeRequestStatus']),
    ...mapWritableState(useCcfriAppStore, [
      'areClosureItemsComplete',
      'hasIllegalClosureDates',
      'loadedClosures',
      'updatedClosures',
    ]),
    isClosuresSectionComplete() {
      return (
        this.CCFRIFacilityModel.hasClosureFees === CCFRI_HAS_CLOSURE_FEE_TYPES.NO ||
        (this.CCFRIFacilityModel.hasClosureFees === CCFRI_HAS_CLOSURE_FEE_TYPES.YES && this.areClosureItemsComplete)
      );
    },
  },
  created() {
    this.rules = rules;
    this.CCFRI_HAS_CLOSURE_FEE_TYPES = CCFRI_HAS_CLOSURE_FEE_TYPES;
    this.CCFRI_FEE_CORRECT_TYPES = CCFRI_FEE_CORRECT_TYPES;
    this.PROGRAM_YEAR_LANGUAGE_TYPES = PROGRAM_YEAR_LANGUAGE_TYPES;
  },
  methods: {
    async loadClosures(ccfriApplicationId) {
      try {
        if (!ccfriApplicationId) return;
        this.loadedClosures = await ClosureService.getApplicationClosures(ccfriApplicationId);
        this.updatedClosures = cloneDeep(this.loadedClosures);
      } catch (e) {
        console.log(`Failed to load closures with error - ${e}`);
        throw e;
      }
    },
    updateClosures(updatedClosures) {
      if (isEmpty(updatedClosures)) return;
      this.updatedClosures = cloneDeep(updatedClosures);
    },
    updateClosuresComplete(areClosureItemsComplete) {
      this.areClosureItemsComplete = areClosureItemsComplete;
    },
    updateHasIllegalClosureDates(hasIllegalClosureDates) {
      this.hasIllegalClosureDates = hasIllegalClosureDates;
    },
    hasClosureChanged(originalClosure, updatedClosure) {
      const isAgeGroupsUpdated =
        (!isEmpty(originalClosure?.ageGroups) || !isEmpty(updatedClosure?.ageGroups)) &&
        !isEqual(originalClosure?.ageGroups, updatedClosure?.ageGroups);
      return (
        originalClosure?.closureReason !== updatedClosure?.closureReason ||
        originalClosure?.fullClosure !== updatedClosure?.fullClosure ||
        originalClosure?.paidClosure !== updatedClosure?.paidClosure ||
        moment.utc(originalClosure?.startDate).format('YYYY-MM-DD') !== updatedClosure?.startDate ||
        moment.utc(originalClosure?.endDate).format('YYYY-MM-DD') !== updatedClosure?.endDate ||
        isAgeGroupsUpdated
      );
    },
    buildClosurePayload(closure) {
      if (!closure) return {};
      const payload = cloneDeep(closure);
      const DEFAULT_TIME_SUFFIX = 'T12:00:00-07:00';
      const appendDefaultTimeSuffix = (date) =>
        date?.includes(DEFAULT_TIME_SUFFIX) ? date : `${date}${DEFAULT_TIME_SUFFIX}`;
      payload.closureStatus = closure.closureStatus ?? CLOSURE_STATUSES.PENDING;
      payload.closureType = closure.closureType ?? CLOSURE_TYPES.KNOWN_CLOSURES;
      payload.paymentEligibility = closure.paymentEligibility ?? String(CLOSURE_PAYMENT_ELIGIBILITIES.CCFRI);
      payload.startDate = closure.startDate ? appendDefaultTimeSuffix(closure.startDate) : null;
      payload.endDate = closure.endDate ? appendDefaultTimeSuffix(closure.endDate) : null;
      payload.ccfriApplicationId = closure.ccfriApplicationId ?? this.$route.params.urlGuid;
      payload.facilityId = closure.facilityId ?? this.CCFRIFacilityModel.facilityId;
      payload.organizationId = closure.organizationId ?? this.organizationId;
      payload.programYearId = closure.programYearId ?? this.programYearId;
      if (this.showApplicationTemplateV1) {
        payload.paidClosure = closure.paidClosure ?? null;
      } else {
        payload.paidClosure =
          this.CCFRIFacilityModel.hasClosureFees === CCFRI_FEE_CORRECT_TYPES.YES ? YES_NO_VALUES.YES : YES_NO_VALUES.NO;
        if (closure.fullClosure === false && !isEmpty(closure.ageGroups)) {
          payload.ageGroups = Array.isArray(closure.ageGroups) ? closure.ageGroups.join(',') : closure.ageGroups;
        } else {
          payload.ageGroups = null;
        }
      }
      return payload;
    },
    async processUpdatedClosures() {
      const closuresToCreate = this.updatedClosures?.filter((closure) => {
        delete closure.datesOverlap;
        delete closure.datesInvalid;
        return !closure.closureId && !isEmpty(closure);
      });
      const closuresToUpdate = this.updatedClosures?.filter((updatedClosure) =>
        this.loadedClosures?.some(
          (originalClosure) =>
            originalClosure.closureId === updatedClosure.closureId &&
            this.hasClosureChanged(originalClosure, updatedClosure),
        ),
      );
      const closuresToDelete =
        this.CCFRIFacilityModel.hasClosureFees === CCFRI_HAS_CLOSURE_FEE_TYPES.YES
          ? this.loadedClosures?.filter(
              (originalClosure) =>
                !this.updatedClosures?.some((updatedClosure) => updatedClosure.closureId === originalClosure.closureId),
            )
          : this.loadedClosures;
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
    },
  },
};
