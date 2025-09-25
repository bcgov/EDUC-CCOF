<template>
  <v-form ref="ccofSummaryForm" v-model="isValidForm">
    <v-expansion-panel-title>
      <SummaryExpansionPanelTitle
        title="Child Care Operating Funding (CCOF)"
        :loading="isApplicationProcessing"
        :is-complete="isFormComplete"
      />
    </v-expansion-panel-title>
    <v-expansion-panel-text eager>
      <v-row class="d-flex justify-start">
        <v-col cols="12" md="6">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start">
              <span class="summary-label pt-3">Maximum number of <b>days per week</b> you provide child care: </span>
              <v-text-field
                placeholder="Required"
                :model-value="funding?.maxDaysPerWeek"
                class="summary-value ma-0 pa-0 px-0"
                density="compact"
                flat
                variant="solo"
                :hide-details="isNullOrBlank(funding?.maxDaysPerWeek) || isValidForm"
                readonly
                :rules="[...rules.required, rules.min(1), rules.max(7), rules.wholeNumber]"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="6">
          <v-row no-gutters class="d-flex justify-start">
            <v-col cols="12" class="d-flex justify-start">
              <span class="summary-label pt-3">Maximum number of <b>weeks per year</b> you provide child care: </span>
              <v-text-field
                placeholder="Required"
                :model-value="funding?.maxWeeksPerYear"
                class="summary-value"
                density="compact"
                flat
                variant="solo"
                :hide-details="isNullOrBlank(funding?.maxWeeksPerYear) || isValidForm"
                readonly
                :rules="[...rules.required, rules.min(1), rules.max(52), rules.wholeNumber]"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" lg="6">
          <span class="summary-label">
            Are there months when ALL of the programs at this facility are closed for the entire month?
          </span>
          <v-text-field
            placeholder="Required"
            :model-value="getYesNoValue(funding?.hasClosedMonth)"
            class="summary-value no-padding-left"
            density="compact"
            flat
            variant="solo"
            hide-details
            readonly
            :rules="rules.required"
          />
        </v-col>

        <v-col v-if="funding?.hasClosedMonth" cols="12" lg="6">
          <span class="summary-label">
            Months where ALL of the programs at this facility are closed for the entire month:
          </span>
          <v-row no-gutters>
            <v-col v-if="funding?.closedIn1" cols="6" sm="4">
              <v-text-field
                model-value="January"
                class="summary-value no-padding-left"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
              />
            </v-col>
            <v-col v-if="funding?.closedIn2" cols="6" sm="4">
              <v-text-field
                model-value="February"
                class="summary-value no-padding-left"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
              />
            </v-col>
            <v-col v-if="funding?.closedIn3" cols="6" sm="4">
              <v-text-field
                model-value="March"
                class="summary-value no-padding-left"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
              />
            </v-col>
            <v-col v-if="funding?.closedIn4" cols="6" sm="4">
              <v-text-field
                model-value="April"
                class="summary-value no-padding-left"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
              />
            </v-col>
            <v-col v-if="funding?.closedIn5" cols="6" sm="4">
              <v-text-field
                model-value="May"
                class="summary-value no-padding-left"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
              />
            </v-col>
            <v-col v-if="funding?.closedIn6" cols="6" sm="4">
              <v-text-field
                model-value="June"
                class="summary-value no-padding-left"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
              />
            </v-col>
            <v-col v-if="funding?.closedIn7" cols="6" sm="4">
              <v-text-field
                model-value="July"
                class="summary-value no-padding-left"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
              />
            </v-col>
            <v-col v-if="funding?.closedIn8" cols="6" sm="4">
              <v-text-field
                model-value="August"
                class="summary-value no-padding-left"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
              />
            </v-col>
            <v-col v-if="funding?.closedIn9" cols="6" sm="4">
              <v-text-field
                model-value="September"
                class="summary-value no-padding-left"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
              />
            </v-col>
            <v-col v-if="funding?.closedIn10" cols="6" sm="4">
              <v-text-field
                model-value="October"
                class="summary-value no-padding-left"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
              />
            </v-col>
            <v-col v-if="funding?.closedIn11" cols="6" sm="4">
              <v-text-field
                model-value="November"
                class="summary-value no-padding-left"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
              />
            </v-col>
            <v-col v-if="funding?.closedIn12" cols="6" sm="4">
              <v-text-field
                model-value="December"
                class="summary-value no-padding-left"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
              />
            </v-col>
          </v-row>
          <div class="text-error pt-2">
            <p v-if="hasAllMonthsClosed">{{ ERROR_MESSAGES.FACILITY_MUST_OPERATE_ONE_MONTH }}</p>
            <p v-if="hasNoMonthClosed">{{ ERROR_MESSAGES.NO_MONTH_SELECTED }}</p>
          </div>
        </v-col>
      </v-row>
      <v-row no-gutters class="d-flex justify-start">
        <v-col cols="12" md="4" class="d-flex justify-start flex-nowrap">
          <span class="summary-label pt-3">Facility hours of operation:</span>
        </v-col>
        <v-col cols="12" sm="6" md="4" class="d-flex justify-start">
          <span class="summary-label pt-3">From:</span>
          <v-text-field
            placeholder="Required"
            :model-value="formatTime24to12(funding?.hoursFrom)"
            class="summary-value"
            density="compact"
            flat
            variant="solo"
            hide-details
            readonly
            :rules="rules.required"
          />
        </v-col>
        <v-col cols="12" sm="6" md="4" class="d-flex justify-start">
          <span class="summary-label pt-3">To:</span>
          <v-text-field
            placeholder="Required"
            :model-value="formatTime24to12(funding?.hoursTo)"
            class="summary-value"
            density="compact"
            flat
            variant="solo"
            readonly
            :hide-details="isNullOrBlank(funding?.hoursTo) || isValidForm"
            :rules="[...rules.required, rules.validHourTo(funding?.hoursFrom)]"
          />
        </v-col>
      </v-row>

      <div>
        <v-row class="pt-4" no-gutters>
          <v-col cols="6" class="summary-value">Type of Service</v-col>
          <v-col cols="6" class="summary-value">Maximum Number</v-col>
        </v-row>
        <template v-if="!funding.licenceCategoryId">
          <div class="text-error">Required</div>
        </template>
        <template v-else>
          <v-row no-gutters>
            <v-col cols="6" class="summary-label pt-3">
              {{ licenceCategoryName }}
            </v-col>
            <v-col cols="6" class="summary-value">
              <v-text-field
                placeholder="Required"
                :model-value="funding?.maxLicensesCapacity"
                class="summary-value"
                density="compact"
                flat
                variant="solo"
                :hide-details="isNullOrBlank(funding?.maxLicensesCapacity) || isValidForm"
                readonly
                :rules="[...rules.required, rules.wholeNumber, rules.min(1)]"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="6" class="summary-label pt-3">Maximum Licensed Capacity</v-col>
            <v-col cols="6" class="summary-value">
              <v-text-field
                placeholder="Required"
                :model-value="funding?.maxLicensesCapacity"
                class="summary-value"
                density="compact"
                flat
                variant="solo"
                :hide-details="isNullOrBlank(funding?.maxLicensesCapacity) || isValidForm"
                readonly
                :rules="[...rules.required, rules.wholeNumber, rules.min(1)]"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="6" class="summary-label pt-3">Maximum Number of Child Care Spaces</v-col>
            <v-col cols="6" class="summary-value">
              <v-text-field
                placeholder="Required"
                :model-value="funding?.maxSpaces"
                class="summary-value"
                density="compact"
                flat
                variant="solo"
                :hide-details="isNullOrBlank(funding?.maxSpaces) || isValidForm"
                readonly
                :rules="[...rules.required, rules.min(0), rules.wholeNumber, rules.max(funding.maxLicensesCapacity)]"
              />
            </v-col>
          </v-row>
        </template>
      </div>

      <v-row no-gutters class="pb-2">
        <v-col cols="12" md="6" class="summary-label pt-2">
          Do you <b>regularly offer</b> extended hours of child care
          <b>(care before 6:00 AM, after 7:00 PM, or overnight service)</b>?
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            placeholder="Required"
            :model-value="getYesNoValue(funding?.isExtendedHours)"
            class="summary-value"
            density="compact"
            flat
            variant="solo"
            hide-details
            readonly
            :rules="rules.required"
          />
        </v-col>
      </v-row>

      <template v-if="funding?.isExtendedHours">
        <v-row no-gutters>
          <v-col cols="12" md="6" class="summary-label pt-2">
            Maximum number of days per week you offer extended hours of child care?
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              placeholder="Required"
              :rules="[...rules.required, rules.min(1), rules.max(7), rules.wholeNumber]"
              :model-value="funding?.maxDaysPerWeekExtended"
              class="summary-value"
              density="compact"
              flat
              variant="solo"
              :hide-details="isNullOrBlank(funding?.maxDaysPerWeekExtended) || isValidForm"
              readonly
            />
          </v-col>
          <v-col cols="12" md="6" class="summary-label pt-2">
            Maximum number of weeks per year you offer extended hours of child care?
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              placeholder="Required"
              :rules="[...rules.required, rules.min(1), rules.max(52), rules.wholeNumber]"
              :model-value="funding?.maxWeeksPerYearExtended"
              class="summary-value"
              density="compact"
              flat
              variant="solo"
              :hide-details="isNullOrBlank(funding?.maxWeeksPerYearExtended) || isValidForm"
              readonly
            />
          </v-col>
        </v-row>

        <div class="pt-2">
          <div class="summary-label">
            For each type of service, indicate the <b>maximum number of spaces</b> for which you offer extended hours of
            child care:
          </div>
          <v-row no-gutters>
            <v-col cols="4" class="summary-value">Type of Service</v-col>
            <v-col cols="4" class="summary-value"><b>4 hours or less </b>extended child care</v-col>
            <v-col cols="4" class="summary-value"><b>More than 4 hours</b> extended child care</v-col>
          </v-row>
          <p v-if="!funding.licenceCategoryId" class="text-error">Required</p>

          <v-row v-else no-gutters>
            <v-col cols="4" class="summary-label pt-3">
              {{ licenceCategoryName }}
            </v-col>
            <template v-if="funding[maxSpaces4OrLessExtendedCC] + funding[maxSpaces4OrMoreExtendedCC] > 0">
              <v-col cols="4" class="summary-value">
                <v-text-field
                  :model-value="funding[maxSpaces4OrLessExtendedCC]"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  :rules="[rules.wholeNumber, rules.max(funding?.maxLicensesCapacity * 2)]"
                  :hide-details="isValidForm"
                  readonly
                />
              </v-col>
              <v-col cols="4" class="summary-value">
                <v-text-field
                  :model-value="funding[maxSpaces4OrMoreExtendedCC]"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  :rules="[rules.wholeNumber, rules.max(funding?.maxLicensesCapacity)]"
                  :hide-details="isValidForm"
                  readonly
                />
              </v-col>
            </template>
            <v-col v-else cols="6" class="text-error text-center">Required</v-col>
          </v-row>
        </div>
      </template>
      <router-link v-if="!isFormComplete" :to="routingPath">
        <u class="text-error"> To add this information, click here. This will bring you to a different page. </u>
      </router-link>
    </v-expansion-panel-text>
  </v-form>
</template>
<script>
import ApplicationService from '@/services/applicationService';
import summaryMixin from '@/mixins/summaryMixin.js';
import { PATHS, pcfUrlGuid, pcfUrl } from '@/utils/constants.js';

export default {
  name: 'FamilyFundingSummary',
  mixins: [summaryMixin],
  props: {
    funding: {
      type: Object,
      required: true,
    },
    programYearId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isValidForm: false,
    };
  },
  computed: {
    licenceCategoryNumber() {
      return this.getFamilyLicenceCategoryNumberById(this.funding?.licenceCategoryId);
    },
    licenceCategoryName() {
      return ApplicationService.getFamilyLicenceCategoryNameByNumber(this.licenceCategoryNumber);
    },
    maxSpaces4OrLessExtendedCC() {
      return ApplicationService.getFieldNameOfMaxSpaces4OrLessExtendedCC(this.licenceCategoryNumber);
    },
    maxSpaces4OrMoreExtendedCC() {
      return ApplicationService.getFieldNameOfMaxSpaces4OrMoreExtendedCC(this.licenceCategoryNumber);
    },
    routingPath() {
      return this.funding.ccofBaseFundingId
        ? pcfUrlGuid(PATHS.CCOF_FAMILY_FUNDING, this.programYearId, this.funding.ccofBaseFundingId)
        : pcfUrl(this.PATHS.CCOF_FAMILY_ORG, this.programYearId);
    },
    hasAllMonthsClosed() {
      return ApplicationService.hasAllMonthsClosed(this.funding);
    },
    hasNoMonthClosed() {
      return ApplicationService.hasNoMonthClosed(this.funding);
    },
    isFormComplete() {
      return ApplicationService.isCCOFCompleteFamilyV2(this.funding);
    },
  },
  mounted() {
    this.$refs.ccofSummaryForm.validate();
  },
};
</script>
<style scoped>
:deep(.summary-value .v-label) {
  color: #d8292f !important;
  opacity: 1 !important;
}

:deep(::placeholder) {
  color: #d8292f !important;
  opacity: 1 !important;
}

:deep(.no-padding-left .v-field__input) {
  padding-left: 0 !important;
}
</style>
