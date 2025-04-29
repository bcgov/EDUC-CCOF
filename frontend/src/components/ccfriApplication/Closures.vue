<template>
  <v-form ref="form">
    <v-container fluid>
      <ApplicationPCFHeader
        page-title="Child Care Fee Reduction Initiative (CCFRI)"
        :program-year="formattedProgramYear"
        :facility="currentFacility"
      />
      <div class="mx-lg-16 mb-12">
        <div class="text-center px-4 px-lg-8 my-8">
          <p>
            It is important to tell us your planned closures for the {{ formattedProgramYear }} funding term to avoid
            any impacts on payments. Only report closures for which parent fees will be charged. For CCFRI approval,
            facilities must not charge parent fees for periods greater than two consecutive weeks per month, up to a
            maximum of four weeks per funding agreement term. See the Funding Guidelines for more information.
          </p>
        </div>
        <v-skeleton-loader :loading="isApplicationProcessing" type="table-tbody">
          <v-card elevation="6" width="100%" class="rounded-lg my-4 mb-12">
            <p class="rounded-t-lg px-6 py-3 card-title font-weight-bold">
              Do you charge parent fees at this facility for any closures on business days?
            </p>
            <div class="py-4 px-8">
              <div class="span-label font-regular">
                <p v-if="getLanguageYearLabel == PROGRAM_YEAR_LANGUAGE_TYPES.HISTORICAL">
                  Do you charge parent fees at this facility for any closures on business days (other than designated
                  holidays)? Only indicate the date of closures where parent fees are charged.
                </p>
                <p v-else>
                  Do you charge parent fees at this facility for any closures on business days (other than provincial
                  statutory holidays)? Only indicate the date of closures where parent fees are charged.
                </p>
              </div>
              <v-radio-group
                v-model="CCFRIFacilityModel.hasClosureFees"
                :disabled="isReadOnly"
                :rules="rules.required"
                color="primary"
              >
                <v-radio label="Yes" :value="CCFRI_HAS_CLOSURE_FEE_TYPES.YES" @click="addRow(false)" />
                <v-radio label="No" :value="CCFRI_HAS_CLOSURE_FEE_TYPES.NO" />
              </v-radio-group>

              <template v-if="CCFRIFacilityModel.hasClosureFees === CCFRI_FEE_CORRECT_TYPES.YES">
                <v-card v-for="(obj, index) in updatedClosures" :key="obj.closureId" class="px-6 py-4 pl-md-0 mb-8">
                  <v-row no-gutters class="align-center">
                    <v-col cols="12" md="1" class="close-column text-center">
                      <v-btn
                        :disabled="isReadOnly"
                        variant="text"
                        size="large"
                        icon="mdi-close"
                        color="primary"
                        @click="removeClosure(index)"
                      />
                    </v-col>
                    <v-col cols="12" md="11">
                      <v-row>
                        <v-col cols="12" md="4">
                          <AppDateInput
                            v-model="obj.startDate"
                            :min="fiscalStartAndEndDates.startDate"
                            :max="fiscalStartAndEndDates.endDate"
                            :rules="[
                              ...rules.required,
                              rules.min(fiscalStartAndEndDates.startDate, 'Must exceed fiscal year start date'),
                              rules.max(fiscalStartAndEndDates.endDate, 'Must be before fiscal year end date'),
                            ]"
                            :disabled="isReadOnly"
                            :hide-details="isReadOnly"
                            label="Start Date"
                            clearable
                            @input="validateClosureDates(obj)"
                          />
                        </v-col>

                        <v-col cols="12" md="4">
                          <AppDateInput
                            v-model="obj.endDate"
                            :min="obj.startDate"
                            :max="fiscalStartAndEndDates.endDate"
                            :rules="[
                              ...rules.required,
                              rules.min(obj.startDate, 'Must exceed start date'),
                              rules.max(fiscalStartAndEndDates.endDate, 'Must be before fiscal year end date'),
                            ]"
                            :disabled="isReadOnly"
                            :hide-details="isReadOnly"
                            clearable
                            label="End Date"
                            @input="validateClosureDates(obj)"
                          />
                        </v-col>

                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="obj.closureReason"
                            :disabled="isReadOnly"
                            label="Closure Reason"
                            variant="outlined"
                            clearable
                            :rules="rules.required"
                          />
                        </v-col>
                      </v-row>

                      <v-row no-gutters>
                        <p class="span-label font-regular pt-2 pr-4">
                          Is this a full facility closure?
                          <AppTooltip tooltip-content="Select no if only some care categories will be affected." />
                        </p>
                        <v-radio-group
                          v-model="obj.fullClosure"
                          :disabled="isReadOnly"
                          inline
                          color="primary"
                          :rules="rules.required"
                        >
                          <v-radio label="Yes" :value="true" />
                          <v-radio label="No" :value="false" />
                        </v-radio-group>
                      </v-row>

                      <v-row v-if="obj.fullClosure === false" no-gutters class="py-2">
                        <p class="span-label font-regular pt-md-4 pr-8 mb-2">
                          Select all care categories that are affected by the closure:
                        </p>
                        <AppMultiSelectInput
                          v-model="obj.ageGroups"
                          :items="childCareCategories"
                          item-title="label"
                          item-value="value"
                          label="Care Categories"
                          :disabled="isApplicationProcessing"
                          :rules="rules.required"
                          min-width="250"
                        />
                      </v-row>

                      <v-card v-if="obj.datesOverlap || obj.datesInvalid" class="my-4">
                        <AppAlertBanner type="error" class="mb-4">Invalid Dates</AppAlertBanner>

                        <v-card-text v-if="obj.datesInvalid">
                          Closure Start Date: {{ obj.startDate }}
                          <br />
                          Closure End Date: {{ obj.endDate }} <br /><br />

                          Please review your facility closure dates.
                          <br />
                        </v-card-text>
                        <v-card-text v-else-if="obj.datesOverlap">
                          It appears that the closure start and end dates you've selected for this facility overlap with
                          dates you've previously selected.
                          <br /><br />
                          Closure Start Date: {{ obj.startDate }}
                          <br />
                          Closure End Date: {{ obj.endDate }} <br /><br />

                          Please review your existing facility closure dates to ensure consistency and avoid any
                          potential overlap of Facility closure dates.
                          <br />
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card>

                <AppButton id="add-new-closure-button" :disabled="isReadOnly" class="my-4" @click="addRow(true)">
                  Add New Closure
                </AppButton>
              </template>
            </div>
          </v-card>
        </v-skeleton-loader>
      </div>

      <NavButton
        :is-next-displayed="true"
        :is-save-displayed="true"
        :is-save-disabled="isReadOnly || hasIllegalDates"
        :is-next-disabled="isApplicationProcessing || !isFormComplete"
        :is-processing="isApplicationProcessing"
        @previous="previous"
        @next="next"
        @validate-form="validateApplicationForm"
        @save="save(true)"
      />
    </v-container>
  </v-form>
</template>
<script>
import moment from 'moment';
import { cloneDeep, isEmpty, isEqual } from 'lodash';
import { mapState, mapActions } from 'pinia';

import AppAlertBanner from '@/components/guiComponents/AppAlertBanner.vue';
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDateInput from '@/components/guiComponents/AppDateInput.vue';
import AppMultiSelectInput from '@/components/guiComponents/AppMultiSelectInput.vue';
import AppTooltip from '@/components/guiComponents/AppTooltip.vue';
import ApplicationPCFHeader from '@/components/util/ApplicationPCFHeader.vue';
import NavButton from '@/components/util/NavButton.vue';

import ClosureService from '@/services/closureService.js';
import ApplicationService from '@/services/applicationService';

import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useCcfriAppStore } from '@/store/ccfriApp.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { useReportChangesStore } from '@/store/reportChanges.js';

import rules from '@/utils/rules.js';

import {
  CHANGE_TYPES,
  PROGRAM_YEAR_LANGUAGE_TYPES,
  CCFRI_HAS_CLOSURE_FEE_TYPES,
  CCFRI_FEE_CORRECT_TYPES,
  CLOSURE_AFFECTED_AGE_GROUPS,
  CLOSURE_PAYMENT_ELIGIBILITIES,
  CLOSURE_STATUSES,
  CLOSURE_TYPES,
} from '@/utils/constants.js';
import alertMixin from '@/mixins/alertMixin.js';
import globalMixin from '@/mixins/globalMixin.js';

//builds an array of dates to keep track of all days of the selected closure period.
//this array is used to check if a user selects an overlapping date
function dateFunction(date1, date2) {
  const startDate = new Date(date1);
  const endDate = new Date(date2);
  const dates = [];
  const currentDate = new Date(startDate.getTime());

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().substring(0, 10));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

export default {
  components: {
    AppAlertBanner,
    AppButton,
    AppDateInput,
    AppMultiSelectInput,
    ApplicationPCFHeader,
    AppTooltip,
    NavButton,
  },
  mixins: [alertMixin, globalMixin],
  async beforeRouteLeave(_to, _from, next) {
    await this.save(false);
    next();
  },
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
  watch: {
    '$route.params.urlGuid': {
      async handler() {
        window.scrollTo(0, 0);
        try {
          this.setIsApplicationProcessing(true);
          await this.loadCCFRIFacility(this.$route.params.urlGuid);
          this.closures = await ClosureService.getApplicationClosures(this.$route.params.urlGuid);
          this.updatedClosures = cloneDeep(this.closures);
          this.addRow(false);
        } catch (error) {
          console.log(error);
          this.setFailureAlert('An error occurred while loading. Please try again later.');
        } finally {
          this.setIsApplicationProcessing(false);
        }
      },
      immediate: true,
    },
    isApplicationFormValidated: {
      handler() {
        this.$refs.form?.validate();
      },
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
    validateClosureDates(obj) {
      // Get all closure dates except for the currently edited row
      const otherClosureDates = this.updatedClosures
        .filter((dateObj) => dateObj.id !== obj.id || dateObj.closureId !== obj.closureId)
        .reduce((acc, dateObj) => {
          return [...acc, ...dateFunction(dateObj.startDate, dateObj.endDate)];
        }, []);

      const dates = dateFunction(obj.startDate, obj.endDate);

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
</script>
<style scoped>
.close-column {
  max-width: 90px;
}
</style>
