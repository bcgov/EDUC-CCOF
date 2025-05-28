<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-form ref="ccofSummaryForm" v-model="isValidForm">
      <v-expansion-panel-title>
        <SummaryExpansionPanelTitle title="Child Care Operating Funding (CCOF)" :is-complete="isValidForm" />
      </v-expansion-panel-title>
      <v-expansion-panel-text eager>
        <v-row no-gutters class="d-flex flex-column pb-1 pt-1 ml-2">
          <v-row class="d-flex justify-start">
            <v-col cols="8" lg="6" class="pb-0 pt-0">
              <v-row no-gutters class="d-flex justify-start">
                <v-col cols="12" class="d-flex justify-start">
                  <span class="summary-label pt-3">
                    Maximum number of <b>days per week</b> you provide child care:
                  </span>
                  <v-text-field
                    placeholder="Required"
                    :model-value="funding?.maxDaysPerWeek"
                    class="summary-value ma-0 pa-0"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    readonly
                    :rules="rules.required"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6" lg="4" class="py-0">
              <v-row no-gutters class="d-flex justify-start">
                <v-col cols="12" class="d-flex justify-start">
                  <span class="summary-label pt-3">
                    Maximum number of <b>weeks per year</b> you provide child care:
                  </span>
                  <v-text-field
                    placeholder="Required"
                    :model-value="funding?.maxWeeksPerYear"
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
            </v-col>
          </v-row>
          <v-row class="d-flex justify-start">
            <v-col cols="8" lg="6" class="pb-0 pt-0">
              <v-row no-gutters class="d-flex justify-start">
                <v-col cols="12" class="d-flex justify-start">
                  <span class="summary-label pt-3">
                    Are there months when ALL of the programs at this facility are closed for the entire month?
                  </span>
                </v-col>
                <v-col cols="12" class="d-flex justify-start">
                  <v-text-field
                    placeholder="Required"
                    :model-value="getYesNoValue(funding?.hasClosedMonth)"
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
            </v-col>
            <v-col cols="8" lg="6" class="pb-0 pt-0">
              <v-row v-if="funding?.hasClosedMonth" no-gutters class="d-flex justify-start">
                <v-col cols="12" class="d-flex justify-start">
                  <span class="summary-label pt-3">
                    Months where ALL of the programs at this facility are closed for the entire month:
                  </span>
                </v-col>
                <v-col v-if="funding?.closedIn1" cols="4" class="d-flex justify-start">
                  <v-text-field
                    model-value="January"
                    class="summary-value"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    readonly
                    :rules="rules.required"
                  />
                </v-col>
                <v-col v-if="funding?.closedIn2" cols="4" class="d-flex justify-start">
                  <v-text-field
                    model-value="February"
                    class="summary-value"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    readonly
                    :rules="rules.required"
                  />
                </v-col>
                <v-col v-if="funding?.closedIn3" cols="4" class="d-flex justify-start">
                  <v-text-field
                    model-value="March"
                    class="summary-value"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    readonly
                    :rules="rules.required"
                  />
                </v-col>
                <v-col v-if="funding?.closedIn4" cols="4" class="d-flex justify-start">
                  <v-text-field
                    model-value="April"
                    class="summary-value"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    readonly
                    :rules="rules.required"
                  />
                </v-col>
                <v-col v-if="funding?.closedIn5" cols="4" class="d-flex justify-start">
                  <v-text-field
                    model-value="May"
                    class="summary-value"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    readonly
                    :rules="rules.required"
                  />
                </v-col>
                <v-col v-if="funding?.closedIn6" cols="4" class="d-flex justify-start">
                  <v-text-field
                    model-value="June"
                    class="summary-value"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    readonly
                    :rules="rules.required"
                  />
                </v-col>
                <v-col v-if="funding?.closedIn7" cols="4" class="d-flex justify-start">
                  <v-text-field
                    model-value="July"
                    class="summary-value"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    readonly
                    :rules="rules.required"
                  />
                </v-col>
                <v-col v-if="funding?.closedIn8" cols="4" class="d-flex justify-start">
                  <v-text-field
                    model-value="August"
                    class="summary-value"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    readonly
                    :rules="rules.required"
                  />
                </v-col>
                <v-col v-if="funding?.closedIn9" cols="4" class="d-flex justify-start">
                  <v-text-field
                    model-value="September"
                    class="summary-value"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    readonly
                    :rules="rules.required"
                  />
                </v-col>
                <v-col v-if="funding?.closedIn10" cols="4" class="d-flex justify-start">
                  <v-text-field
                    model-value="October"
                    class="summary-value"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    readonly
                    :rules="rules.required"
                  />
                </v-col>
                <v-col v-if="funding?.closedIn11" cols="4" class="d-flex justify-start">
                  <v-text-field
                    model-value="November"
                    class="summary-value"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    readonly
                    :rules="rules.required"
                  />
                </v-col>
                <v-col v-if="funding?.closedIn12" cols="4" class="d-flex justify-start">
                  <v-text-field
                    model-value="December"
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
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4" lg="6" class="py-0">
              <v-row no-gutters class="d-flex justify-start">
                <v-col cols="4" class="d-flex justify-start flex-nowrap">
                  <span class="summary-label pt-3">Facility hours of operation:</span>
                </v-col>
                <v-col class="d-flex justify-start">
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
                <v-col class="d-flex justify-start">
                  <span class="summary-label pt-3">To:</span>
                  <v-text-field
                    placeholder="Required"
                    :model-value="formatTime24to12(funding?.hoursTo)"
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
            </v-col>
          </v-row>

          <v-row class="d-flex justify-start">
            <v-col cols="4" lg="4" class="py-0">
              <v-row no-gutters class="d-flex justify-start">
                <v-col cols="12" class="d-flex justify-start pb-2 pt-7">
                  <span class="summary-label">Maximum number of child care spaces you offer</span>
                </v-col>
                <v-col cols="12" class="d-flex justify-start pb-2 pt-2">
                  <span class="summary-label">Maximum licensed capacity </span>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="4" lg="4" class="pb-0 pt-3">
              <v-row no-gutters class="d-flex justify-start">
                <v-col cols="12" class="d-flex justify-center">
                  <v-text-field
                    placeholder="Required"
                    :model-value="funding?.maxSpaces"
                    class="summary-value"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    readonly
                    :rules="rules.required"
                  />
                </v-col>
                <v-col cols="12" class="d-flex justify-center">
                  <v-text-field
                    placeholder="Required"
                    :model-value="funding?.maxLicensesCapacity"
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
            </v-col>
          </v-row>
          <br />

          <v-row class="d-flex justify-start">
            <v-col cols="12" lg="12" class="pb-0 pt-0">
              <v-row no-gutters class="d-flex justify-start pt-2">
                <v-col cols="12" class="d-flex justify-start">
                  <span class="summary-label pt-2">
                    Do you <b>regularly offer</b> extended daily hours of child care
                    <b>(before 6am, after 7pm or overnight)</b>?
                  </span>
                </v-col>
                <v-col cols="12" class="d-flex justify-start">
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
            </v-col>
          </v-row>
          <span v-if="funding?.isExtendedHours">
            <v-row class="d-flex justify-start">
              <v-col cols="6" lg="6" class="pb-0 pt-0">
                <v-row no-gutters class="d-flex justify-start">
                  <v-col cols="12" class="d-flex justify-start pb-2 pt-7">
                    <span class="summary-label">Maximum number of spaces you offer extended hours of child care</span>
                  </v-col>
                  <v-col cols="12" class="d-flex justify-start pb-2 pt-2">
                    <span class="summary-label">
                      Maximum number of days per week you offer extended hours of child care
                    </span>
                  </v-col>
                  <v-col cols="12" class="d-flex justify-start pb-2 pt-2">
                    <span class="summary-label">
                      Maximum number of weeks per year you offer extended hours of child care
                    </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="4" lg="4" class="pb-0 pt-3">
                <v-row no-gutters class="d-flex justify-start">
                  <v-col cols="12" class="d-flex justify-center">
                    <v-text-field
                      placeholder="Required"
                      :rules="rules.required"
                      :model-value="funding?.maxCapacityExtended"
                      class="summary-value"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      readonly
                    />
                  </v-col>
                  <v-col cols="12" class="d-flex justify-center">
                    <v-text-field
                      placeholder="Required"
                      :rules="rules.required"
                      :model-value="funding?.maxDaysPerWeekExtended"
                      class="summary-value"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      readonly
                    />
                  </v-col>
                  <v-col cols="12" class="d-flex justify-center">
                    <v-text-field
                      placeholder="Required"
                      :rules="rules.required"
                      :model-value="funding?.maxWeeksPerYearExtended"
                      class="summary-value"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      readonly
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </span>
          <v-row class="d-flex justify-start mt-2">
            <v-col cols="12" lg="12" class="pb-0 pt-0">
              <v-row no-gutters class="d-flex justify-start">
                <v-col cols="12" class="d-flex justify-start">
                  <span class="summary-label">
                    For each type of service, indicate the <b>maximum number of spaces</b> for which you offer extended
                    hours of child care:
                  </span>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row class="d-flex justify-start">
            <v-col cols="4" lg="4" class="pb-0 pt-0">
              <v-row no-gutters class="d-flex justify-start">
                <v-col cols="12" class="d-flex justify-start">
                  <span class="summary-value pt-1">Type of Service</span>
                </v-col>
                <v-col cols="12" class="d-flex justify-start pb-2 pt-7">
                  <span class="summary-label">Family Child Care (Under 36 months)</span>
                </v-col>
                <v-col cols="12" class="d-flex justify-start pb-2 pt-2">
                  <span class="summary-label">Family Child Care (30 Months to School Age)</span>
                </v-col>
                <v-col cols="12" class="d-flex justify-start pb-2 pt-2">
                  <span class="summary-label">Family Child Care (School Age/ School Age Care on School Grounds)</span>
                </v-col>
                <v-col cols="12" class="d-flex justify-start pb-2 pt-3">
                  <span class="summary-label">Multi-Age Child Care</span>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="4" lg="4" class="pb-0 pt-0">
              <v-row no-gutters class="d-flex justify-start">
                <v-col cols="5" class="d-flex justify-start">
                  <span class="summary-value"><b>4 hours or less </b>extended child care</span>
                </v-col>
                <v-col cols="12" class="d-flex justify-end">
                  <v-text-field
                    :model-value="funding?.extendedChildCareUnder36Months4OrLess"
                    class="summary-value"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    readonly
                  />
                </v-col>
                <v-col cols="12" class="d-flex">
                  <v-text-field
                    :model-value="funding?.extendedChildCare36MonthsToSchoolAge4OrLess"
                    class="summary-value"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    readonly
                  />
                </v-col>
                <v-col cols="12" class="d-flex justify-center">
                  <v-text-field
                    :model-value="funding?.extendedChildCareSchoolAge4OrLess"
                    class="summary-value"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    readonly
                  />
                </v-col>
                <v-col cols="12" class="d-flex justify-center">
                  <v-text-field
                    :model-value="funding?.multiAgeCare4OrLess"
                    class="summary-value"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    readonly
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="4" lg="4" class="pb-0 pt-0">
              <v-row no-gutters class="d-flex justify-start">
                <v-col cols="5" class="d-flex justify-start">
                  <span class="summary-value"><b>More than 4 hours</b> extended child care</span>
                </v-col>
                <v-col cols="12" class="d-flex justify-center">
                  <v-text-field
                    :model-value="funding?.extendedChildCareUnder36Months4OrMore"
                    class="summary-value"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    readonly
                  />
                </v-col>
                <v-col cols="12" class="d-flex justify-center">
                  <v-text-field
                    :model-value="funding?.extendedChildCare36MonthsToSchoolAge4OrMore"
                    class="summary-value"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    readonly
                  />
                </v-col>
                <v-col cols="12" class="d-flex justify-center">
                  <v-text-field
                    :model-value="funding?.extendedChildCareSchoolAge4OrMore"
                    class="summary-value"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    readonly
                  />
                </v-col>
                <v-col cols="12" class="d-flex justify-center">
                  <v-text-field
                    :model-value="funding?.multiAgeCare4more"
                    class="summary-value"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    readonly
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-row>
        <div v-if="!isValidForm">
          <router-link :to="routingPath">
            <u class="text-error"> To add this information, click here. This will bring you to a different page. </u>
          </router-link>
        </div>
      </v-expansion-panel-text>
    </v-form>
  </v-row>
</template>
<script>
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
    routingPath() {
      return this.funding.ccofBaseFundingId
        ? pcfUrlGuid(PATHS.CCOF_FAMILY_FUNDING, this.programYearId, this.funding.ccofBaseFundingId)
        : pcfUrl(this.PATHS.CCOF_FAMILY_ORG, this.programYearId);
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
</style>
