<template>
  <v-form ref="form" v-model="isValidForm" class="my-4">
    <v-card v-for="(obj, index) in updatedClosures" :key="obj.closureId" class="px-6 py-4 pl-md-0 mb-8">
      <v-row no-gutters class="align-center">
        <v-col cols="12" md="1" class="close-column text-center">
          <v-btn
            :disabled="readonly"
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
                  rules.minDate(fiscalStartAndEndDates.startDate, 'Must exceed fiscal year start date'),
                  rules.maxDate(fiscalStartAndEndDates.endDate, 'Must be before fiscal year end date'),
                ]"
                :disabled="readonly"
                :hide-details="readonly"
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
                  rules.minDate(obj.startDate, 'Must exceed start date'),
                  rules.maxDate(fiscalStartAndEndDates.endDate, 'Must be before fiscal year end date'),
                ]"
                :disabled="readonly"
                :hide-details="readonly"
                clearable
                label="End Date"
                @input="validateClosureDates(obj)"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model="obj.closureReason"
                :disabled="readonly"
                label="Closure Reason"
                variant="outlined"
                clearable
                :rules="rules.required"
              />
            </v-col>
          </v-row>

          <template v-if="showApplicationTemplateV1">
            <p class="span-label font-regular">Did parents pay for this closure?</p>
            <v-radio-group v-model="obj.paidClosure" :disabled="readonly" inline :rules="rules.required">
              <v-radio label="Yes" :value="YES_NO_VALUES.YES" />
              <v-radio label="No" :value="YES_NO_VALUES.NO" />
            </v-radio-group>
          </template>

          <template v-else>
            <div>
              <p class="span-label font-regular pr-4">
                Is this a full facility closure?
                <AppTooltip tooltip-content="Select no if only some care categories will be affected." />
              </p>
              <v-radio-group
                v-model="obj.fullClosure"
                :disabled="readonly"
                inline
                color="primary"
                :rules="rules.required"
              >
                <v-radio label="Yes" :value="true" />
                <v-radio label="No" :value="false" />
              </v-radio-group>
            </div>

            <div v-if="obj.fullClosure === false" class="my-2">
              <p class="span-label font-regular pr-8 mb-2">
                Select all care categories that are affected by the closure:
              </p>
              <AppMultiSelectInput
                v-model="obj.ageGroups"
                :items="childCareCategories"
                item-title="label"
                item-value="value"
                label="Care Categories"
                :disabled="readonly"
                :rules="rules.required"
                min-width="250"
              />
            </div>
          </template>

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
              It appears that the closure start and end dates you've selected for this facility overlap with dates
              you've previously selected.
              <br /><br />
              Closure Start Date: {{ obj.startDate }}
              <br />
              Closure End Date: {{ obj.endDate }} <br /><br />

              Please review your existing facility closure dates to ensure consistency and avoid any potential overlap
              of Facility closure dates.
              <br />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <AppButton id="add-new-closure-button" :disabled="readonly" class="my-4" @click="addRow(true)">
      Add New Closure
    </AppButton>
  </v-form>
</template>
<script>
import { cloneDeep, isEmpty } from 'lodash';
import moment from 'moment';
import { mapState, mapWritableState } from 'pinia';
import { uuid } from 'vue-uuid';

import AppAlertBanner from '@/components/guiComponents/AppAlertBanner.vue';
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDateInput from '@/components/guiComponents/AppDateInput.vue';
import AppMultiSelectInput from '@/components/guiComponents/AppMultiSelectInput.vue';
import AppTooltip from '@/components/guiComponents/AppTooltip.vue';

import { useApplicationStore } from '@/store/application.js';
import { useCcfriAppStore } from '@/store/ccfriApp.js';
import { CLOSURE_AFFECTED_AGE_GROUPS, YES_NO_VALUES } from '@/utils/constants.js';
import rules from '@/utils/rules.js';

export default {
  name: 'ApplicationClosureCard',
  components: {
    AppAlertBanner,
    AppButton,
    AppDateInput,
    AppMultiSelectInput,
    AppTooltip,
  },
  props: {
    closures: {
      type: Array,
      default: () => [],
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['updateClosures'],
  data() {
    return {
      updatedClosures: [],
      isValidForm: false,
    };
  },
  computed: {
    ...mapState(useApplicationStore, ['fiscalStartAndEndDates', 'programYearId', 'showApplicationTemplateV1']),
    ...mapState(useCcfriAppStore, ['CCFRIFacilityModel']),
    ...mapWritableState(useCcfriAppStore, ['areClosureItemsComplete', 'hasIllegalClosureDates']),
    childCareCategories() {
      const ageGroups = [];
      this.CCFRIFacilityModel?.childCareTypes
        ?.filter((careType) => careType.programYearId === this.programYearId)
        ?.forEach((ageGroup) => {
          ageGroups.push({
            label: ageGroup.childCareCategory,
            value: CLOSURE_AFFECTED_AGE_GROUPS[ageGroup.childCareCategory],
          });
        });
      return ageGroups;
    },
    areClosuresComplete() {
      return this.isValidForm && !this.hasIllegalClosureDates;
    },
  },
  watch: {
    updatedClosures: {
      handler() {
        if (isEmpty(this.updatedClosures)) return;
        this.hasIllegalClosureDates = this.updatedClosures?.some((el) => el.datesOverlap || el.datesInvalid);
        this.$emit('updateClosures', cloneDeep(this.updatedClosures));
      },
      deep: true,
    },
    areClosuresComplete: {
      handler() {
        this.areClosureItemsComplete = this.areClosuresComplete;
      },
    },
  },
  created() {
    this.rules = rules;
    this.YES_NO_VALUES = YES_NO_VALUES;
    this.updatedClosures = cloneDeep(this.closures);
    this.addRow(false);
    this.updatedClosures?.forEach((closure) => this.validateClosureDates(closure));
  },
  methods: {
    addRow(isAddButtonClicked) {
      if (!isAddButtonClicked && !isEmpty(this.updatedClosures)) return;
      const newClosure = { id: uuid.v1() };
      if (!this.showApplicationTemplateV1) {
        newClosure.fullClosure = true;
      }
      this.updatedClosures.push(newClosure);
    },
    //builds an array of dates to keep track of all days of the selected closure period.
    //this array is used to check if a user selects an overlapping date
    buildDateArray(start, end) {
      if (!start || !end) return [];
      const dates = [];
      const endDate = moment.utc(end).startOf('day');
      const currentDate = moment.utc(start).startOf('day');
      while (currentDate.isSameOrBefore(endDate)) {
        dates.push(currentDate.format('YYYY-MM-DD'));
        currentDate.add(1, 'day');
      }
      return dates;
    },
    validateClosureDates(obj) {
      // Get all closure dates except for the currently edited row
      const otherClosureDates = this.updatedClosures
        .filter((dateObj) => dateObj.id !== obj.id || dateObj.closureId !== obj.closureId)
        .reduce((acc, dateObj) => {
          return [...acc, ...this.buildDateArray(dateObj.startDate, dateObj.endDate)];
        }, []);
      const currentClosureDates = this.buildDateArray(obj.startDate, obj.endDate);
      const closureStartDate = obj.startDate ? moment(obj.startDate).startOf('day') : null;
      const closureEndDate = obj.endDate ? moment(obj.endDate).startOf('day') : null;
      const fiscalStartDate = moment(this.fiscalStartAndEndDates.startDate).startOf('day');
      const fiscalEndDate = moment(this.fiscalStartAndEndDates.endDate).startOf('day');

      /* We do not let users save invalid dates of any kind so there is no risk of a mis-calculation in Dynamics
      - datesOverlap is True if the selected dates are part of an overlap of other dates.
      - datesInvalid is True if user breaks any date rules:
          + Closure End Date cannot be before Closure Start Date
          + Either Closure Start/End Date is outside the fiscal year bounds
      */
      obj.datesOverlap = currentClosureDates.some((date) => otherClosureDates.includes(date));
      obj.datesInvalid =
        closureEndDate?.isBefore(closureStartDate) ||
        closureStartDate?.isBefore(fiscalStartDate) ||
        closureEndDate?.isAfter(fiscalEndDate);
    },
    removeClosure(index) {
      this.updatedClosures.splice(index, 1);
      if (isEmpty(this.updatedClosures)) this.addRow(false);
    },
    validateForm() {
      this.$refs.form?.validate();
    },
  },
};
</script>
<style scoped>
.close-column {
  max-width: 90px;
}
</style>
