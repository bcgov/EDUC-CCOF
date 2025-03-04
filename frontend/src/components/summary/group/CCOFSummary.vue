<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-form ref="ccofSummaryForm" v-model="isValidForm">
      <v-expansion-panel-title>
        <SummaryExpansionPanelTitle title="Child Care Operating Funding (CCOF)" :is-complete="isFormComplete" />
      </v-expansion-panel-title>
      <v-expansion-panel-text eager>
        <v-row no-gutters class="d-flex flex-column pb-1 pt-1 ml-2">
          <v-row class="d-flex justify-start">
            <v-col cols="12" md="6" class="pb-0 pt-0">
              <v-row no-gutters class="d-flex justify-start">
                <v-col cols="12" class="d-flex justify-start">
                  <span class="summary-label pt-3"
                    >Maximum number of <b>days per week</b> you provide child care:
                  </span>
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
            <v-col cols="12" md="6" class="pb-0 pt-0">
              <v-row no-gutters class="d-flex justify-start">
                <v-col cols="12" class="d-flex justify-start">
                  <span class="summary-label pt-3"
                    >Maximum number of <b>weeks per year</b> you provide child care:
                  </span>
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
          <v-row class="d-flex justify-start">
            <v-col v-if="funding?.hasClosedMonth" cols="12" lg="6" class="pb-0 pt-0">
              <v-row no-gutters class="d-flex justify-start">
                <v-col cols="12" class="d-flex justify-start">
                  <span class="summary-label pt-3"
                    >Months where ALL of the programs at this facility are closed for the entire month:
                  </span>
                </v-col>
                <v-col v-if="funding?.closedIn1" cols="6" sm="4" class="d-flex justify-start">
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
                <v-col v-if="funding?.closedIn2" cols="6" sm="4" class="d-flex justify-start">
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
                <v-col v-if="funding?.closedIn3" cols="6" sm="4" class="d-flex justify-start">
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
                <v-col v-if="funding?.closedIn4" cols="6" sm="4" class="d-flex justify-start">
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
                <v-col v-if="funding?.closedIn5" cols="6" sm="4" class="d-flex justify-start">
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
                <v-col v-if="funding?.closedIn6" cols="6" sm="4" class="d-flex justify-start">
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
                <v-col v-if="funding?.closedIn7" cols="6" sm="4" class="d-flex justify-start">
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
                <v-col v-if="funding?.closedIn8" cols="6" sm="4" class="d-flex justify-start">
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
                <v-col v-if="funding?.closedIn9" cols="6" sm="4" class="d-flex justify-start">
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
                <v-col v-if="funding?.closedIn10" cols="6" sm="4" class="d-flex justify-start">
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
                <v-col v-if="funding?.closedIn11" cols="6" sm="4" class="d-flex justify-start">
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
                <v-col v-if="funding?.closedIn12" cols="6" sm="4" class="d-flex justify-start">
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
            <v-col cols="12" lg="6" class="pb-0 pt-0">
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
            </v-col>
          </v-row>

          <div>
            <v-row class="pt-4" no-gutters>
              <v-col cols="6" class="summary-value">Type of Service</v-col>
              <v-col cols="6" class="summary-value">Maximum Number</v-col>
            </v-row>
            <template v-if="!hasLicenceCategory">
              <div class="text-error">Required</div>
            </template>
            <template v-else>
              <v-row v-if="funding?.hasUnder36Months" no-gutters>
                <v-col cols="6" class="summary-label pt-3">Group Child Care (Under 36 Months)</v-col>
                <v-col cols="6" class="summary-value">
                  <v-text-field
                    placeholder="Required"
                    :model-value="funding?.maxGroupChildCareUnder36"
                    class="summary-value"
                    density="compact"
                    flat
                    variant="solo"
                    :hide-details="isNullOrBlank(funding?.maxGroupChildCareUnder36) || isValidForm"
                    readonly
                    :rules="[...rules.required, rules.wholeNumber, rules.min(1)]"
                  />
                </v-col>
              </v-row>
              <v-row v-if="funding?.has30MonthToSchoolAge" no-gutters>
                <v-col cols="6" class="summary-label pt-3">Group Child Care (30 Months to School Age)</v-col>
                <v-col cols="6" class="summary-value">
                  <v-text-field
                    placeholder="Required"
                    :model-value="funding?.maxGroupChildCare36"
                    class="summary-value"
                    density="compact"
                    flat
                    variant="solo"
                    :hide-details="isNullOrBlank(funding?.maxGroupChildCare36) || isValidForm"
                    readonly
                    :rules="[...rules.required, rules.wholeNumber, rules.min(1)]"
                  />
                </v-col>
              </v-row>
              <v-row v-if="funding?.hasSchoolAgeCareOnSchoolGrounds" no-gutters>
                <v-col cols="6" class="summary-label pt-3">
                  Group Child Care (School Age/ School Age Care on School Grounds)
                </v-col>
                <v-col cols="6" class="summary-value">
                  <v-text-field
                    placeholder="Required"
                    :model-value="funding?.maxGroupChildCareSchool"
                    class="summary-value"
                    density="compact"
                    flat
                    variant="solo"
                    :hide-details="isNullOrBlank(funding?.maxGroupChildCareSchool) || isValidForm"
                    readonly
                    :rules="[...rules.required, rules.wholeNumber, rules.min(1)]"
                  />
                </v-col>
              </v-row>
              <v-row v-if="funding?.hasPreschool" no-gutters>
                <v-col cols="6" class="summary-label pt-3">Preschool</v-col>
                <v-col cols="6" class="summary-value">
                  <v-text-field
                    placeholder="Required"
                    :model-value="funding?.maxPreschool"
                    class="summary-value"
                    density="compact"
                    flat
                    variant="solo"
                    :hide-details="isNullOrBlank(funding?.maxPreschool) || isValidForm"
                    readonly
                    :rules="[...rules.required, rules.wholeNumber, rules.min(1)]"
                  />
                </v-col>
              </v-row>
              <v-row v-if="funding?.hasMultiAge" no-gutters>
                <v-col cols="6" class="summary-label pt-3">Multi-Age Child Care</v-col>
                <v-col cols="6" class="summary-value">
                  <v-text-field
                    placeholder="Required"
                    :model-value="funding?.maxGroupChildCareMultiAge"
                    class="summary-value"
                    density="compact"
                    flat
                    variant="solo"
                    :hide-details="isNullOrBlank(funding?.maxGroupChildCareMultiAge) || isValidForm"
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
            </template>
          </div>

          <template v-if="funding?.hasPreschool">
            <div class="summary-label">Preschool sessions your facility offers per day:</div>
            <v-row no-gutters class="pt-2">
              <v-col cols="4" lg="2">
                <v-row no-gutters class="summary-label">Monday</v-row>
                <v-text-field
                  placeholder="Required"
                  :model-value="funding?.monday"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                  class="summary-value no-padding-left"
                />
              </v-col>
              <v-col cols="4" lg="2">
                <v-row no-gutters class="summary-label">Tuesday</v-row>
                <v-text-field
                  placeholder="Required"
                  :model-value="funding?.tusday"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                  class="summary-value no-padding-left"
                />
              </v-col>
              <v-col cols="4" lg="2">
                <v-row no-gutters class="summary-label">Wednesday</v-row>
                <v-text-field
                  placeholder="Required"
                  :model-value="funding?.wednesday"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                  class="summary-value no-padding-left"
                />
              </v-col>
              <v-col cols="4" lg="2">
                <v-row no-gutters class="summary-label">Thursday</v-row>
                <v-text-field
                  placeholder="Required"
                  :model-value="funding?.thursday"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                  class="summary-value no-padding-left"
                />
              </v-col>
              <v-col cols="4" lg="2">
                <v-row no-gutters class="summary-label">Friday</v-row>
                <v-text-field
                  placeholder="Required"
                  :model-value="funding?.friday"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                  class="summary-value no-padding-left"
                />
              </v-col>
              <v-col cols="4" lg="2">
                <v-row no-gutters class="summary-label">Total</v-row>
                <v-text-field
                  placeholder="Required"
                  :model-value="calculateTotal"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                  class="summary-value no-padding-left"
                />
              </v-col>
            </v-row>
          </template>

          <v-row no-gutters>
            <v-col cols="12" md="6" class="summary-label pt-2">Is the facility located on school property?</v-col>
            <v-col cols="12" md="6">
              <v-text-field
                placeholder="Required"
                :model-value="getYesNoValue(funding?.isSchoolProperty)"
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

          <v-row v-if="funding?.hasSchoolAgeCareOnSchoolGrounds" no-gutters>
            <v-col cols="12" md="6" class="summary-label pt-2">
              Please indicate each service that your facility offers:
            </v-col>
            <v-col cols="12" md="6" class="summary-label">
              <v-text-field
                placeholder="Required"
                :model-value="schoolPropertyLabel"
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

          <v-row no-gutters class="pb-2">
            <v-col cols="12" md="6" class="summary-label pt-2">
              Do you <b>regularly offer</b> extended hours of child care
              <b>(care before 6:00 am, after 7:00pm or overnight service regularly offered)</b>?
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
                For each type of service, indicate the <b>maximum number of spaces</b> for which you offer extended
                hours of child care:
              </div>
              <v-row no-gutters>
                <v-col cols="4" class="summary-value">Type of Service</v-col>
                <v-col cols="4" class="summary-value"><b>4 hours or less </b>extended child care</v-col>
                <v-col cols="4" class="summary-value"><b>More than 4 hours</b> extended child care</v-col>
              </v-row>
              <template v-if="!hasLicenceCategoryWithExtendedChildCare">
                <div class="text-error">Required</div>
              </template>
              <template v-else>
                <v-row v-if="funding?.hasUnder36MonthsExtendedCC" no-gutters>
                  <v-col cols="4" class="summary-label pt-3">Group Child Care (Under 36 Months)</v-col>
                  <template v-if="isUnder36ExtendedChildCareValid">
                    <v-col cols="4" class="summary-value">
                      <v-text-field
                        :model-value="funding?.extendedChildCareUnder36Months4OrLess"
                        class="summary-value"
                        density="compact"
                        flat
                        variant="solo"
                        :rules="[rules.wholeNumber, rules.max(funding?.maxGroupChildCareUnder36)]"
                        :hide-details="isValidForm"
                        readonly
                      />
                    </v-col>
                    <v-col cols="4" class="summary-value">
                      <v-text-field
                        :model-value="funding?.extendedChildCareUnder36Months4OrMore"
                        class="summary-value"
                        density="compact"
                        flat
                        variant="solo"
                        :rules="[rules.wholeNumber, rules.max(funding?.maxGroupChildCareUnder36)]"
                        :hide-details="isValidForm"
                        readonly
                      />
                    </v-col>
                  </template>
                  <v-col v-else cols="6" class="text-error text-center">Required</v-col>
                </v-row>
                <v-row v-if="funding?.has30MonthToSchoolAgeExtendedCC" no-gutters>
                  <v-col cols="4" class="summary-label pt-3">Group Child Care (30 Months to School Age)</v-col>
                  <template v-if="is30MonthToSchoolAgeExtendedChildCareValid">
                    <v-col cols="4" class="summary-value">
                      <v-text-field
                        :model-value="funding?.extendedChildCare36MonthsToSchoolAge4OrLess"
                        class="summary-value"
                        density="compact"
                        flat
                        variant="solo"
                        :rules="[rules.wholeNumber, rules.max(funding?.maxGroupChildCare36)]"
                        :hide-details="isValidForm"
                        readonly
                      />
                    </v-col>
                    <v-col cols="4" class="summary-value">
                      <v-text-field
                        :model-value="funding?.extendedChildCare36MonthsToSchoolAge4OrMore"
                        class="summary-value"
                        density="compact"
                        flat
                        variant="solo"
                        :rules="[rules.wholeNumber, rules.max(funding?.maxGroupChildCare36)]"
                        :hide-details="isValidForm"
                        readonly
                      />
                    </v-col>
                  </template>
                  <v-col v-else cols="6" class="text-error text-center">Required</v-col>
                </v-row>
                <v-row v-if="funding?.hasSchoolAgeCareOnSchoolGroundsExtendedCC" no-gutters>
                  <v-col cols="4" class="summary-label pt-3">
                    Group Child Care (School Age/ School Age Care on School Grounds)
                  </v-col>
                  <template v-if="isSchoolAgeCareOnSchoolGroundsExtendedChildCareValid">
                    <v-col cols="4" class="summary-value">
                      <v-text-field
                        :model-value="funding?.extendedChildCareSchoolAge4OrLess"
                        class="summary-value"
                        density="compact"
                        flat
                        variant="solo"
                        :rules="[rules.wholeNumber, rules.max(funding?.maxGroupChildCareSchool)]"
                        :hide-details="isValidForm"
                        readonly
                      />
                    </v-col>
                    <v-col cols="4" class="summary-value">
                      <v-text-field
                        :model-value="funding?.extendedChildCareSchoolAge4OrMore"
                        class="summary-value"
                        density="compact"
                        flat
                        variant="solo"
                        :rules="[rules.wholeNumber, rules.max(funding?.maxGroupChildCareSchool)]"
                        :hide-details="isValidForm"
                        readonly
                      />
                    </v-col>
                  </template>
                  <v-col v-else cols="6" class="text-error text-center">Required</v-col>
                </v-row>
                <v-row v-if="funding?.hasMultiAgeExtendedCC" no-gutters>
                  <v-col cols="4" class="summary-label pt-3">Multi-Age Child Care</v-col>
                  <template v-if="isMultiAgeExtendedChildCareValid">
                    <v-col cols="4" class="summary-value">
                      <v-text-field
                        :model-value="funding?.multiAgeCare4OrLess"
                        class="summary-value"
                        density="compact"
                        flat
                        variant="solo"
                        :rules="[rules.wholeNumber, rules.max(funding?.maxGroupChildCareMultiAge)]"
                        :hide-details="isValidForm"
                        readonly
                      />
                    </v-col>
                    <v-col cols="4" class="summary-value">
                      <v-text-field
                        :model-value="funding?.multiAgeCare4more"
                        class="summary-value"
                        density="compact"
                        flat
                        variant="solo"
                        :rules="[rules.wholeNumber, rules.max(funding?.maxGroupChildCareMultiAge)]"
                        :hide-details="isValidForm"
                        readonly
                      />
                    </v-col>
                  </template>
                  <v-col v-else cols="6" class="text-error text-center">Required</v-col>
                </v-row>
              </template>
            </div>
          </template>
        </v-row>
        <div v-if="!isFormComplete">
          <router-link v-if="summaryModel?.application" :to="routingPath">
            <u class="text-error"> To add this information, click here. This will bring you to a different page. </u>
          </router-link>
        </div>
      </v-expansion-panel-text>
    </v-form>
  </v-row>
</template>
<script>
import { mapActions, mapState } from 'pinia';

import SummaryExpansionPanelTitle from '@/components/guiComponents/SummaryExpansionPanelTitle.vue';

import { useNavBarStore } from '@/store/navBar.js';
import { useSummaryDeclarationStore } from '@/store/summaryDeclaration';

import globalMixin from '@/mixins/globalMixin.js';
import { isChangeRequest, isNullOrBlank } from '@/utils/common.js';
import { PATHS, pcfUrlGuid, pcfUrl, changeUrlGuid, ORGANIZATION_PROVIDER_TYPES } from '@/utils/constants.js';
import { formatTime24to12 } from '@/utils/format';

import rules from '@/utils/rules.js';

export default {
  name: 'CCOFSummary',
  components: { SummaryExpansionPanelTitle },
  mixins: [globalMixin],
  props: {
    funding: {
      type: Object,
      required: true,
    },
    facilityId: {
      type: String,
      required: true,
    },
    changeRecGuid: {
      type: String,
      required: false,
      default: '',
    },
    programYearId: {
      type: String,
      required: false,
      default: '',
    },
  },
  emits: ['isSummaryValid'],
  data() {
    return {
      isChangeRequest: isChangeRequest(this),
      PATHS,
      rules,
      isValidForm: true,
      formObj: {
        formName: 'CCOFSummary',
        formId: this.funding?.ccofBaseFundingId,
      },
    };
  },
  computed: {
    ...mapState(useNavBarStore, ['navBarList']),
    ...mapState(useSummaryDeclarationStore, ['summaryModel', 'isLoadingComplete']),
    schoolPropertyLabel() {
      const arr = [];
      if (this.funding?.beforeSchool) {
        arr.push('BEFORE SCHOOL');
      }
      if (this.funding?.afterSchool) {
        arr.push('AFTER SCHOOL');
      }
      if (this.funding?.beforeKindergarten) {
        arr.push('BEFORE KINDERGARTEN');
      }
      if (this.funding?.afterKindergarten) {
        arr.push('AFTER KINDERGARTEN');
      }
      return String(arr);
    },
    calculateTotal() {
      let total = 0;
      total =
        this.funding.monday +
        this.funding.tusday +
        this.funding.wednesday +
        this.funding.thursday +
        this.funding.friday;
      return total;
    },
    routingPath() {
      if (
        !this.funding.ccofBaseFundingId &&
        this.summaryModel.application.organizationProviderType === ORGANIZATION_PROVIDER_TYPES.FAMILY
      ) {
        return pcfUrl(PATHS.CCOF_FAMILY_ORG, this.programYearId);
      } else if (
        this.funding.ccofBaseFundingId &&
        this.summaryModel.application.organizationProviderType === ORGANIZATION_PROVIDER_TYPES.FAMILY
      ) {
        pcfUrlGuid(PATHS.CCOF_FAMILY_FUNDING, this.programYearId, this.funding.ccofBaseFundingId);
      } else if (this.isChangeRequest) {
        return changeUrlGuid(PATHS.CCOF_GROUP_FUNDING, this.changeRecGuid, this.funding.ccofBaseFundingId);
      } else if (
        this.funding.ccofBaseFundingId &&
        this.summaryModel.application.organizationProviderType === ORGANIZATION_PROVIDER_TYPES.GROUP
      ) {
        return pcfUrlGuid(PATHS.CCOF_GROUP_FUNDING, this.programYearId, this.funding.ccofBaseFundingId);
      }
      return pcfUrl(PATHS.CCOF_GROUP_FACILITY, this.programYearId);
    },
    showSchoolPropertyQuestion() {
      return this.funding?.maxGroupChildCareSchool > 0;
    },
    hasLicenceCategory() {
      return (
        this.funding?.hasUnder36Months ||
        this.funding?.has30MonthToSchoolAge ||
        this.funding?.hasSchoolAgeCareOnSchoolGrounds ||
        this.funding?.hasPreschool ||
        this.funding?.hasMultiAge
      );
    },
    hasLicenceCategoryWithExtendedChildCare() {
      return (
        this.funding?.hasUnder36MonthsExtendedCC ||
        this.funding?.has30MonthToSchoolAgeExtendedCC ||
        this.funding?.hasSchoolAgeCareOnSchoolGroundsExtendedCC ||
        this.funding?.hasMultiAgeExtendedCC
      );
    },
    isUnder36ExtendedChildCareValid() {
      return (
        !this.funding?.hasUnder36MonthsExtendedCC ||
        this.funding?.extendedChildCareUnder36Months4OrLess + this.funding?.extendedChildCareUnder36Months4OrMore > 0
      );
    },
    is30MonthToSchoolAgeExtendedChildCareValid() {
      return (
        !this.funding?.has30MonthToSchoolAgeExtendedCC ||
        this.funding?.extendedChildCare36MonthsToSchoolAge4OrLess +
          this.funding?.extendedChildCare36MonthsToSchoolAge4OrMore >
          0
      );
    },
    isSchoolAgeCareOnSchoolGroundsExtendedChildCareValid() {
      return (
        !this.funding?.hasSchoolAgeCareOnSchoolGroundsExtendedCC ||
        this.funding?.extendedChildCareSchoolAge4OrLess + this.funding?.extendedChildCareSchoolAge4OrMore > 0
      );
    },
    isMultiAgeExtendedChildCareValid() {
      return (
        !this.funding?.hasMultiAgeExtendedCC || this.funding?.multiAgeCare4OrLess + this.funding?.multiAgeCare4more > 0
      );
    },
    isFormComplete() {
      return (
        this.isValidForm &&
        this.hasLicenceCategory &&
        (this.funding?.isExtendedHours === 0 ||
          (this.hasLicenceCategoryWithExtendedChildCare &&
            this.isUnder36ExtendedChildCareValid &&
            this.is30MonthToSchoolAgeExtendedChildCareValid &&
            this.isSchoolAgeCareOnSchoolGroundsExtendedChildCareValid &&
            this.isMultiAgeExtendedChildCareValid))
      );
    },
  },
  watch: {
    isValidForm: {
      handler() {
        this.$refs.ccofSummaryForm.validate();
        if (this.isLoadingComplete && this.isValidForm !== null) {
          this.$emit('isSummaryValid', this.formObj, this.isValidForm);
        }
      },
    },
  },
  created() {
    this.formatTime24to12 = formatTime24to12;
  },
  mounted() {
    this.$refs.ccofSummaryForm?.validate();
  },
  methods: {
    ...mapActions(useSummaryDeclarationStore, ['setIsLoadingComplete']),
    isNullOrBlank,
  },
};
</script>
<style scoped>
.summary-label {
  color: grey;
  font-size: small;
}

.summary-value {
  font-size: medium;
  color: black;
}
:deep(.summary-value .v-label) {
  color: #d8292f !important;
  opacity: 1 !important;
}
:deep(::placeholder) {
  color: #d8292f !important;
  opacity: 1 !important;
}
.summary-label-smaller {
  color: grey;
  font-size: x-small;
}

.summary-label-bold {
  color: black;
  font-size: small;
  font-style: initial;
}

.summary-value-small {
  color: black;
  font-size: small;
  font-weight: bold;
}

:deep(.no-padding-left .v-field__input) {
  padding-left: 0 !important;
}
</style>
