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
      <v-row no-gutters class="d-flex justify-start">
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
      <v-row no-gutters class="pt-2">
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
          <div>
            <p v-if="hasAllMonthsClosed" class="text-error pt-2">
              {{ ERROR_MESSAGES.FACILITY_MUST_OPERATE_ONE_MONTH }}
            </p>
            <p v-else-if="hasNoMonthClosed" class="text-error pt-2">{{ ERROR_MESSAGES.NO_MONTH_SELECTED }}</p>
          </div>
        </v-col>
      </v-row>
      <v-row no-gutters class="d-flex justify-start pt-2">
        <v-col cols="12" md="4" class="d-flex justify-start flex-nowrap">
          <span class="summary-label pt-md-3">Facility hours of operation:</span>
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

      <div class="pt-2">
        <v-row no-gutters>
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
          <v-row v-if="funding?.hasSchoolAge" no-gutters>
            <v-col cols="6" class="summary-label pt-3">Group Child Care (School Age)</v-col>
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
          <v-row v-if="funding?.hasSchoolAgeCareOnSchoolGrounds" no-gutters>
            <v-col cols="6" class="summary-label pt-3">School Age Care on School Grounds</v-col>
            <v-col cols="6" class="summary-value">
              <v-text-field
                placeholder="Required"
                :model-value="funding?.maxSchoolAgeCareOnSchoolGrounds"
                class="summary-value"
                density="compact"
                flat
                variant="solo"
                :hide-details="isNullOrBlank(funding?.maxSchoolAgeCareOnSchoolGrounds) || isValidForm"
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
              :model-value="funding?.preschoolSessionsTotal"
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

      <v-row v-if="hasSchoolAgeCareLicenceCategory" no-gutters class="pt-2">
        <v-col cols="12" md="6" class="summary-label"> Please indicate each service that your facility offers: </v-col>
        <v-col cols="12" md="6" class="summary-value">
          <p v-if="schoolPropertyLabel" class="pl-4">{{ schoolPropertyLabel }}</p>
          <v-text-field
            v-else
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

      <v-row no-gutters class="pt-2">
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

        <div class="py-2">
          <div class="summary-label pb-2">
            For each type of service, indicate the <b>maximum number of spaces</b> for which you offer extended hours of
            child care:
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
              <template v-if="isUnder36ExtendedCCMaxSpacesEntered">
                <v-col cols="4" class="summary-value">
                  <v-text-field
                    :model-value="funding?.extendedChildCareUnder36Months4OrLess"
                    class="summary-value"
                    density="compact"
                    flat
                    variant="solo"
                    :rules="[rules.wholeNumber, rules.max(funding?.maxGroupChildCareUnder36 * 2)]"
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
              <template v-if="is30MonthToSchoolAgeExtendedCCMaxSpacesEntered">
                <v-col cols="4" class="summary-value">
                  <v-text-field
                    :model-value="funding?.extendedChildCare36MonthsToSchoolAge4OrLess"
                    class="summary-value"
                    density="compact"
                    flat
                    variant="solo"
                    :rules="[rules.wholeNumber, rules.max(funding?.maxGroupChildCare36 * 2)]"
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
            <v-row v-if="funding?.hasSchoolAgeExtendedCC" no-gutters>
              <v-col cols="4" class="summary-label pt-3">Group Child Care (School Age)</v-col>
              <template v-if="isSchoolAgeExtendedCCMaxSpacesEntered">
                <v-col cols="4" class="summary-value">
                  <v-text-field
                    :model-value="funding?.extendedChildCareSchoolAge4OrLess"
                    class="summary-value"
                    density="compact"
                    flat
                    variant="solo"
                    :rules="[rules.wholeNumber, rules.max(funding?.maxGroupChildCareSchool * 2)]"
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
            <v-row v-if="funding?.hasSchoolAgeCareOnSchoolGroundsExtendedCC" no-gutters>
              <v-col cols="4" class="summary-label pt-3">School Age Care on School Grounds</v-col>
              <template v-if="isSchoolAgeCareOnSchoolGroundsExtendedCCMaxSpacesEntered">
                <v-col cols="4" class="summary-value">
                  <v-text-field
                    :model-value="funding?.extendedSchoolAgeCareOnSchoolGrounds4OrLess"
                    class="summary-value"
                    density="compact"
                    flat
                    variant="solo"
                    :rules="[rules.wholeNumber, rules.max(funding?.maxSchoolAgeCareOnSchoolGrounds * 2)]"
                    :hide-details="isValidForm"
                    readonly
                  />
                </v-col>
                <v-col cols="4" class="summary-value">
                  <v-text-field
                    :model-value="funding?.extendedSchoolAgeCareOnSchoolGrounds4OrMore"
                    class="summary-value"
                    density="compact"
                    flat
                    variant="solo"
                    :rules="[rules.wholeNumber, rules.max(funding?.maxSchoolAgeCareOnSchoolGrounds)]"
                    :hide-details="isValidForm"
                    readonly
                  />
                </v-col>
              </template>
              <v-col v-else cols="6" class="text-error text-center">Required</v-col>
            </v-row>
            <v-row v-if="funding?.hasMultiAgeExtendedCC" no-gutters>
              <v-col cols="4" class="summary-label pt-3">Multi-Age Child Care</v-col>
              <template v-if="isMultiAgeExtendedCCMaxSpacesEntered">
                <v-col cols="4" class="summary-value">
                  <v-text-field
                    :model-value="funding?.multiAgeCare4OrLess"
                    class="summary-value"
                    density="compact"
                    flat
                    variant="solo"
                    :rules="[rules.wholeNumber, rules.max(funding?.maxGroupChildCareMultiAge * 2)]"
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
      <router-link v-if="!isFormComplete" :to="routingPath">
        <u class="text-error"> To add this information, click here. This will bring you to a different page. </u>
      </router-link>
    </v-expansion-panel-text>
  </v-form>
</template>
<script>
import ApplicationService from '@/services/applicationService';
import summaryMixin from '@/mixins/summaryMixin.js';
import { isChangeRequest } from '@/utils/common.js';
import { GROUP_LICENCE_CATEGORIES, PATHS, pcfUrlGuid, pcfUrl, changeUrlGuid } from '@/utils/constants.js';

export default {
  name: 'CCOFSummary',
  mixins: [summaryMixin],
  props: {
    funding: {
      type: Object,
      required: true,
    },
    changeRecGuid: {
      type: String,
      default: '',
    },
    programYearId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isChangeRequest: isChangeRequest(this),
      isValidForm: true,
    };
  },
  computed: {
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
    routingPath() {
      if (this.isChangeRequest) {
        return changeUrlGuid(PATHS.CCOF_GROUP_FUNDING, this.changeRecGuid, this.funding.ccofBaseFundingId);
      }
      return this.funding.ccofBaseFundingId
        ? pcfUrlGuid(PATHS.CCOF_GROUP_FUNDING, this.programYearId, this.funding.ccofBaseFundingId)
        : pcfUrl(PATHS.CCOF_GROUP_FACILITY, this.programYearId);
    },
    showSchoolPropertyQuestion() {
      return this.funding?.maxGroupChildCareSchool > 0;
    },
    hasAllMonthsClosed() {
      return ApplicationService.hasAllMonthsClosed(this.funding);
    },
    hasNoMonthClosed() {
      return ApplicationService.hasNoMonthClosed(this.funding);
    },
    hasLicenceCategory() {
      return ApplicationService.hasLicenceCategory(this.funding);
    },
    hasLicenceCategoryWithExtendedChildCare() {
      return ApplicationService.hasLicenceCategoryWithExtendedChildCare(this.funding);
    },
    hasSchoolAgeCareLicenceCategory() {
      return ApplicationService.hasSchoolAgeCareLicenceCategory(this.funding);
    },
    isUnder36ExtendedCCMaxSpacesEntered() {
      return ApplicationService.isGroupExtendedCCMaxSpacesEntered(
        this.funding,
        GROUP_LICENCE_CATEGORIES.GROUP_CHILD_CARE_UNDER_36_MONTHS,
      );
    },
    is30MonthToSchoolAgeExtendedCCMaxSpacesEntered() {
      return ApplicationService.isGroupExtendedCCMaxSpacesEntered(
        this.funding,
        GROUP_LICENCE_CATEGORIES.GROUP_CHILD_CARE_30_MONTHS_TO_SCHOOL_AGE,
      );
    },
    isSchoolAgeExtendedCCMaxSpacesEntered() {
      return ApplicationService.isGroupExtendedCCMaxSpacesEntered(
        this.funding,
        GROUP_LICENCE_CATEGORIES.GROUP_CHILD_CARE_SCHOOL_AGE,
      );
    },
    isSchoolAgeCareOnSchoolGroundsExtendedCCMaxSpacesEntered() {
      return ApplicationService.isGroupExtendedCCMaxSpacesEntered(
        this.funding,
        GROUP_LICENCE_CATEGORIES.SCHOOL_AGE_CARE_ON_SCHOOL_GROUNDS,
      );
    },
    isMultiAgeExtendedCCMaxSpacesEntered() {
      return ApplicationService.isGroupExtendedCCMaxSpacesEntered(
        this.funding,
        GROUP_LICENCE_CATEGORIES.MULTI_AGE_CHILD_CARE,
      );
    },
    isFormComplete() {
      return ApplicationService.isCCOFCompleteGroupV2(this.funding);
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
