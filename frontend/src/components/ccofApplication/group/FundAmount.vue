<template>
  <v-form ref="form" v-model="model.isCCOFComplete">
    <v-container>
      <v-skeleton-loader :loading="loading" type="table-tbody" class="mb-12">
        <v-row justify="space-around">
          <v-card class="cc-top-level-card pa-2" width="1200">
            <v-container>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="model.maxDaysPerWeek"
                    :disabled="isLocked"
                    type="number"
                    variant="outlined"
                    :rules="[...rules.required, rules.min(1), rules.max(7), rules.wholeNumber]"
                    label="Maximum number of days per week you provide child care"
                    @wheel="$event.target.blur()"
                    @update:model-value="convertBlankNumberToNull(model, 'maxDaysPerWeek')"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="model.maxWeeksPerYear"
                    :disabled="isLocked"
                    type="number"
                    variant="outlined"
                    :rules="[...rules.required, rules.min(1), rules.max(52), rules.wholeNumber]"
                    label="Maximum number of weeks per year you provide child care"
                    @wheel="$event.target.blur()"
                    @update:model-value="convertBlankNumberToNull(model, 'maxWeeksPerYear')"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <AppTimeInput
                    v-model="model.hoursFrom"
                    :rules="rules.required"
                    :disabled="isLocked"
                    :hide-details="isLocked"
                    label="Facility hours of operation from"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <AppTimeInput
                    v-model="model.hoursTo"
                    :rules="[...rules.required, rules.validHourTo(model.hoursFrom)]"
                    :disabled="isLocked"
                    :hide-details="isLocked"
                    label="Facility hours of operation to"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <v-radio-group
                    v-model="model.hasClosedMonth"
                    :disabled="isLocked"
                    inline
                    label="Are there months when ALL of the programs at this facility are closed for the entire month?"
                    color="primary"
                    class="no-margin-left"
                  >
                    <v-radio label="Yes" value="yes" />
                    <v-radio label="No" value="no" />
                  </v-radio-group>
                </v-col>
              </v-row>

              <v-row v-show="model.hasClosedMonth === 'yes'">
                <v-col>
                  <label>If YES, check all the applicable months:</label>
                </v-col>
              </v-row>

              <template v-if="model.hasClosedMonth === 'yes'">
                <v-row>
                  <v-col>
                    <v-checkbox
                      v-model="model.closedIn1"
                      :true-value="1"
                      :false-value="0"
                      :disabled="isLocked"
                      label="Jan"
                    />
                  </v-col>
                  <v-col>
                    <v-checkbox
                      v-model="model.closedIn2"
                      :true-value="1"
                      :false-value="0"
                      :disabled="isLocked"
                      label="Feb"
                    />
                  </v-col>
                  <v-col>
                    <v-checkbox
                      v-model="model.closedIn3"
                      :true-value="1"
                      :false-value="0"
                      :disabled="isLocked"
                      label="Mar"
                    />
                  </v-col>
                  <v-col>
                    <v-checkbox
                      v-model="model.closedIn4"
                      :true-value="1"
                      :false-value="0"
                      :disabled="isLocked"
                      label="Apr"
                    />
                  </v-col>
                  <v-col>
                    <v-checkbox
                      v-model="model.closedIn5"
                      :true-value="1"
                      :false-value="0"
                      :disabled="isLocked"
                      label="May"
                    />
                  </v-col>
                  <v-col>
                    <v-checkbox
                      v-model="model.closedIn6"
                      :true-value="1"
                      :false-value="0"
                      :disabled="isLocked"
                      label="Jun"
                    />
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-checkbox
                      v-model="model.closedIn7"
                      :true-value="1"
                      :false-value="0"
                      :disabled="isLocked"
                      label="Jul"
                    />
                  </v-col>
                  <v-col>
                    <v-checkbox
                      v-model="model.closedIn8"
                      :true-value="1"
                      :false-value="0"
                      :disabled="isLocked"
                      label="Aug"
                    />
                  </v-col>
                  <v-col>
                    <v-checkbox
                      v-model="model.closedIn9"
                      :true-value="1"
                      :false-value="0"
                      :disabled="isLocked"
                      label="Sep"
                    />
                  </v-col>
                  <v-col>
                    <v-checkbox
                      v-model="model.closedIn10"
                      :true-value="1"
                      :false-value="0"
                      :disabled="isLocked"
                      label="Oct"
                    />
                  </v-col>
                  <v-col>
                    <v-checkbox
                      v-model="model.closedIn11"
                      :true-value="1"
                      :false-value="0"
                      :disabled="isLocked"
                      label="Nov"
                    />
                  </v-col>
                  <v-col>
                    <v-checkbox
                      v-model="model.closedIn12"
                      :true-value="1"
                      :false-value="0"
                      :disabled="isLocked"
                      label="Dec"
                    />
                  </v-col>
                </v-row>
              </template>
            </v-container>
          </v-card>

          <v-card class="cc-top-level-card pa-2" width="1200">
            <v-container>
              <div>Select the licence category(ies) that apply to your facility(ies).</div>
              <v-checkbox
                id="under-36months-checkbox"
                v-model="model.hasUnder36Months"
                label="Under 36 months"
                color="primary"
                :disabled="isLocked"
                hide-details
              />
              <v-text-field
                v-if="model.hasUnder36Months"
                v-model.number="model.maxGroupChildCareUnder36"
                :disabled="isLocked"
                type="number"
                variant="outlined"
                :rules="[...rules.required, rules.wholeNumber, rules.min(1)]"
                label="Maximum Number for Group Child Care (under 36 months)"
                @wheel="$event.target.blur()"
                @update:model-value="convertBlankNumberToNull(model, 'maxGroupChildCareUnder36')"
              />

              <v-checkbox
                id="30months-to-schoolage-checkbox"
                v-model="model.has30MonthToSchoolAge"
                label="Group Child Care (30 months to School Age)"
                color="primary"
                :disabled="isLocked"
                hide-details
              />
              <v-text-field
                v-if="model.has30MonthToSchoolAge"
                v-model.number="model.maxGroupChildCare36"
                :disabled="isLocked"
                type="number"
                variant="outlined"
                :rules="[...rules.required, rules.wholeNumber, rules.min(1)]"
                label="Maximum Number for Group Child Care (30 months to School Age)"
                @wheel="$event.target.blur()"
                @update:model-value="convertBlankNumberToNull(model, 'maxGroupChildCare36')"
              />

              <v-checkbox
                id="schoolage-care-checkbox"
                v-model="model.hasSchoolAgeCareOnSchoolGrounds"
                label="Group Child Care (School Age / School Age Care on School Grounds)"
                color="primary"
                :disabled="isLocked"
                hide-details
              />
              <v-text-field
                v-if="model.hasSchoolAgeCareOnSchoolGrounds"
                v-model.number="model.maxGroupChildCareSchool"
                :disabled="isLocked"
                type="number"
                variant="outlined"
                :rules="[...rules.required, rules.wholeNumber, rules.min(1)]"
                label="Maximum Number for Group Child Care (School Age / School Age Care on School Grounds)"
                @wheel="$event.target.blur()"
                @update:model-value="convertBlankNumberToNull(model, 'maxGroupChildCareSchool')"
              />

              <v-checkbox
                id="preschool-checkbox"
                v-model="model.hasPreschool"
                label="Preschool"
                color="primary"
                :disabled="isLocked"
                hide-details
              />
              <v-text-field
                v-if="model.hasPreschool"
                v-model.number="model.maxPreschool"
                :disabled="isLocked"
                type="number"
                variant="outlined"
                :rules="[...rules.required, rules.wholeNumber, rules.min(1)]"
                label="Maximum Number for Preschool"
                @wheel="$event.target.blur()"
                @update:model-value="convertBlankNumberToNull(model, 'maxPreschool')"
              />

              <v-checkbox
                id="multi-age-checkbox"
                v-model="model.hasMultiAge"
                label="Multi-Age Child Care"
                color="primary"
                :disabled="isLocked"
                hide-details
              />
              <v-text-field
                v-if="model.hasMultiAge"
                v-model.number="model.maxGroupChildCareMultiAge"
                :disabled="isLocked"
                type="number"
                variant="outlined"
                :rules="[...rules.required, rules.wholeNumber, rules.min(1)]"
                label="Maximum Number for Multi-Age Child Care"
                @wheel="$event.target.blur()"
                @update:model-value="convertBlankNumberToNull(model, 'maxGroupChildCareMultiAge')"
              />

              <div v-if="!isLocked && showErrorMessage && !hasLicenceCategory" class="error-message pl-4">
                {{ ERROR_MESSAGES.REQUIRED }}
              </div>

              <div v-if="hasLicenceCategory" class="mt-4">
                <div class="mb-2">Enter the Maximum Licensed Capacity</div>
                <v-text-field
                  v-model.number="model.maxLicensesCapacity"
                  :disabled="isLocked"
                  type="number"
                  variant="outlined"
                  :rules="[...rules.required, rules.wholeNumber, rules.min(1)]"
                  label="Maximum Licensed Capacity"
                  @wheel="$event.target.blur()"
                  @update:model-value="convertBlankNumberToNull(model, 'maxLicensesCapacity')"
                />
              </div>
            </v-container>
          </v-card>

          <v-card v-if="model.hasPreschool" class="cc-top-level-card" width="1200">
            <v-card-title>Preschool</v-card-title>
            <v-card-subtitle>Please indicate how many preschool sessions your facility offers per day</v-card-subtitle>

            <v-container>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model.number="model.monday"
                    :disabled="isLocked"
                    type="number"
                    variant="outlined"
                    :rules="[...rules.required, rules.wholeNumber]"
                    label="Monday"
                    @wheel="$event.target.blur()"
                    @update:model-value="convertBlankNumberToNull(model, 'monday')"
                  />
                </v-col>
                <v-col>
                  <v-text-field
                    v-model.number="model.tusday"
                    :disabled="isLocked"
                    type="number"
                    variant="outlined"
                    :rules="[...rules.required, rules.wholeNumber]"
                    label="Tuesday"
                    @wheel="$event.target.blur()"
                    @update:model-value="convertBlankNumberToNull(model, 'tusday')"
                  />
                </v-col>
                <v-col>
                  <v-text-field
                    v-model.number="model.wednesday"
                    :disabled="isLocked"
                    type="number"
                    variant="outlined"
                    :rules="[...rules.required, rules.wholeNumber]"
                    label="Wednesday"
                    @wheel="$event.target.blur()"
                    @update:model-value="convertBlankNumberToNull(model, 'wednesday')"
                  />
                </v-col>
                <v-col>
                  <v-text-field
                    v-model.number="model.thursday"
                    :disabled="isLocked"
                    type="number"
                    variant="outlined"
                    :rules="[...rules.required, rules.wholeNumber]"
                    label="Thursday"
                    @wheel="$event.target.blur()"
                    @update:model-value="convertBlankNumberToNull(model, 'thursday')"
                  />
                </v-col>
                <v-col>
                  <v-text-field
                    v-model.number="model.friday"
                    :disabled="isLocked"
                    type="number"
                    variant="outlined"
                    :rules="[...rules.required, rules.wholeNumber]"
                    label="Friday"
                    @wheel="$event.target.blur()"
                    @update:model-value="convertBlankNumberToNull(model, 'friday')"
                  />
                </v-col>
                <v-col>
                  <v-text-field
                    :readonly="!isLocked"
                    :disabled="isLocked"
                    type="number"
                    variant="outlined"
                    :model-value="
                      (model.monday || 0) +
                      (model.tusday || 0) +
                      (model.wednesday || 0) +
                      (model.thursday || 0) +
                      (model.friday || 0)
                    "
                    label="Total"
                    @wheel="$event.target.blur()"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card>

          <v-card v-if="model.maxGroupChildCareSchool > 0" class="cc-top-level-card" width="1200">
            <v-container>
              <v-row>
                <v-col>
                  <v-radio-group
                    v-model="model.isSchoolProperty"
                    :disabled="isLocked"
                    inline
                    label="Is the facility located on school property?"
                    color="primary"
                    class="no-margin-left"
                  >
                    <v-radio label="Yes" value="yes" />
                    <v-radio label="No" value="no" />
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-container>

            <v-card-title v-show="model.isSchoolProperty === 'yes'">
              Group Child Care (School Age Care on School Grounds)
            </v-card-title>

            <v-card-subtitle v-show="model.isSchoolProperty === 'yes'">
              Please indicate each service that your facility offers
            </v-card-subtitle>

            <v-container v-show="model.isSchoolProperty === 'yes'">
              <v-row>
                <v-col>
                  <v-checkbox v-model="model.beforeSchool" :disabled="isLocked" label="Before School" />
                </v-col>
                <v-col>
                  <v-checkbox v-model="model.afterSchool" :disabled="isLocked" label="After School" />
                </v-col>
                <v-col>
                  <v-checkbox v-model="model.beforeKindergarten" :disabled="isLocked" label="Before Kindergarten" />
                </v-col>
                <v-col>
                  <v-checkbox v-model="model.afterKindergarten" :disabled="isLocked" label="After Kindergarten" />
                </v-col>
              </v-row>
            </v-container>
          </v-card>

          <v-card class="cc-top-level-card pa-2" width="1200">
            <v-container>
              <v-radio-group
                v-model="model.isExtendedHours"
                :rules="rules.required"
                :disabled="isLocked"
                inline
                label="Do you regularly offer extended daily hours of child care (before 6 am, after 7 pm or overnight)?"
                color="primary"
                class="no-margin-left"
              >
                <v-radio label="Yes" value="yes" />
                <v-radio label="No" value="no" />
              </v-radio-group>

              <template v-if="hasExtendedHoursChildCare">
                <v-text-field
                  v-model.number="model.maxDaysPerWeekExtended"
                  :disabled="isLocked"
                  type="number"
                  variant="outlined"
                  :rules="[...rules.required, rules.min(1), rules.max(7), rules.wholeNumber]"
                  label="Maximum number of days per week you offer extended hours of child care?"
                  @wheel="$event.target.blur()"
                  @update:model-value="convertBlankNumberToNull(model, 'maxDaysPerWeekExtended')"
                />
                <v-text-field
                  v-model.number="model.maxWeeksPerYearExtended"
                  :disabled="isLocked"
                  type="number"
                  variant="outlined"
                  :rules="[...rules.required, rules.min(1), rules.max(52), rules.wholeNumber]"
                  label="Maximum number of weeks per year you offer extended hours of child care?"
                  class="mt-4"
                  @wheel="$event.target.blur()"
                  @update:model-value="convertBlankNumberToNull(model, 'maxWeeksPerYearExtended')"
                />
              </template>
            </v-container>
          </v-card>

          <v-card v-if="hasExtendedHoursChildCare" class="cc-top-level-card pa-2" width="1200">
            <v-container>
              <div>Select the licence category(ies) that you provide extended hours of child care.</div>

              <v-checkbox
                id="under-36months-extendedCC-checkbox"
                v-model="model.hasUnder36MonthsExtendedCC"
                label="Under 36 months"
                color="primary"
                :disabled="isLocked"
                hide-details
              />
              <template v-if="model.hasUnder36MonthsExtendedCC">
                <v-row>
                  <v-col cols="12" lg="6" class="py-0">
                    <v-card-subtitle><strong>4 hours or less extended child care</strong></v-card-subtitle>
                    <v-text-field
                      v-model.number="model.extendedChildCareUnder36Months4OrLess"
                      :disabled="isLocked"
                      variant="outlined"
                      type="number"
                      :rules="[rules.wholeNumber, rules.max(model.maxGroupChildCareUnder36)]"
                      :error="showErrorMessage && !isUnder36ExtendedChildCareValid"
                      :hide-details="showErrorMessage && !isUnder36ExtendedChildCareValid"
                      label="Maximum Spaces Offered"
                      class="my-2"
                      @wheel="$event.target.blur()"
                      @update:model-value="convertBlankNumberToNull(model, 'extendedChildCareUnder36Months4OrLess')"
                    />
                  </v-col>
                  <v-col cols="12" lg="6" class="py-0">
                    <v-card-subtitle><strong>Over 4 hours extended child care</strong></v-card-subtitle>
                    <v-text-field
                      v-model.number="model.extendedChildCareUnder36Months4OrMore"
                      :disabled="isLocked"
                      variant="outlined"
                      type="number"
                      :rules="[rules.wholeNumber, rules.max(model.maxGroupChildCareUnder36)]"
                      :error="showErrorMessage && !isUnder36ExtendedChildCareValid"
                      :hide-details="showErrorMessage && !isUnder36ExtendedChildCareValid"
                      label="Maximum Spaces Offered"
                      class="my-2"
                      @wheel="$event.target.blur()"
                      @update:model-value="convertBlankNumberToNull(model, 'extendedChildCareUnder36Months4OrMore')"
                    />
                  </v-col>
                </v-row>
                <div v-if="showErrorMessage && !isUnder36ExtendedChildCareValid" class="error-message pl-4">
                  {{ ERROR_MESSAGES.INVALID_MAX_SPACES_EXTENDED_CC }}
                </div>
              </template>

              <v-checkbox
                id="30months-to-schoolage-extendedCC-checkbox"
                v-model="model.has30MonthToSchoolAgeExtendedCC"
                label="Group Child Care (30 months to School Age)"
                color="primary"
                :disabled="isLocked"
                hide-details
              />
              <template v-if="model.has30MonthToSchoolAgeExtendedCC">
                <v-row>
                  <v-col cols="12" lg="6" class="py-0">
                    <v-card-subtitle><strong>4 hours or less extended child care</strong></v-card-subtitle>
                    <v-text-field
                      v-model.number="model.extendedChildCare36MonthsToSchoolAge4OrLess"
                      :disabled="isLocked"
                      variant="outlined"
                      type="number"
                      :rules="[rules.wholeNumber, rules.max(model.maxGroupChildCare36)]"
                      :error="showErrorMessage && !is30MonthToSchoolAgeExtendedChildCareValid"
                      :hide-details="showErrorMessage && !is30MonthToSchoolAgeExtendedChildCareValid"
                      label="Maximum Spaces Offered"
                      class="my-2"
                      @wheel="$event.target.blur()"
                      @update:model-value="
                        convertBlankNumberToNull(model, 'extendedChildCare36MonthsToSchoolAge4OrLess')
                      "
                    />
                  </v-col>
                  <v-col cols="12" lg="6" class="py-0">
                    <v-card-subtitle><strong>Over 4 hours extended child care</strong></v-card-subtitle>
                    <v-text-field
                      v-model.number="model.extendedChildCare36MonthsToSchoolAge4OrMore"
                      :disabled="isLocked"
                      variant="outlined"
                      type="number"
                      :rules="[rules.wholeNumber, rules.max(model.maxGroupChildCare36)]"
                      :error="showErrorMessage && !is30MonthToSchoolAgeExtendedChildCareValid"
                      :hide-details="showErrorMessage && !is30MonthToSchoolAgeExtendedChildCareValid"
                      label="Maximum Spaces Offered"
                      class="my-2"
                      @wheel="$event.target.blur()"
                      @update:model-value="
                        convertBlankNumberToNull(model, 'extendedChildCare36MonthsToSchoolAge4OrMore')
                      "
                    />
                  </v-col>
                </v-row>
                <div v-if="showErrorMessage && !is30MonthToSchoolAgeExtendedChildCareValid" class="error-message pl-4">
                  {{ ERROR_MESSAGES.INVALID_MAX_SPACES_EXTENDED_CC }}
                </div>
              </template>

              <v-checkbox
                id="schoolage-care-extendedCC-checkbox"
                v-model="model.hasSchoolAgeCareOnSchoolGroundsExtendedCC"
                label="Group Child Care (School Age / School Age Care on School Grounds)"
                color="primary"
                :disabled="isLocked"
                hide-details
              />
              <template v-if="model.hasSchoolAgeCareOnSchoolGroundsExtendedCC">
                <v-row>
                  <v-col cols="12" lg="6" class="py-0">
                    <v-card-subtitle><strong>4 hours or less extended child care</strong></v-card-subtitle>
                    <v-text-field
                      v-model.number="model.extendedChildCareSchoolAge4OrLess"
                      :disabled="isLocked"
                      variant="outlined"
                      type="number"
                      :rules="[rules.wholeNumber, rules.max(model.maxGroupChildCareSchool)]"
                      :error="showErrorMessage && !isSchoolAgeCareOnSchoolGroundsExtendedChildCareValid"
                      :hide-details="showErrorMessage && !isSchoolAgeCareOnSchoolGroundsExtendedChildCareValid"
                      label="Maximum Spaces Offered"
                      class="my-2"
                      @wheel="$event.target.blur()"
                      @update:model-value="convertBlankNumberToNull(model, 'extendedChildCareSchoolAge4OrLess')"
                    />
                  </v-col>
                  <v-col cols="12" lg="6" class="py-0">
                    <v-card-subtitle><strong>Over 4 hours extended child care</strong></v-card-subtitle>
                    <v-text-field
                      v-model.number="model.extendedChildCareSchoolAge4OrMore"
                      :disabled="isLocked"
                      variant="outlined"
                      type="number"
                      :rules="[rules.wholeNumber, rules.max(model.maxGroupChildCareSchool)]"
                      :error="showErrorMessage && !isSchoolAgeCareOnSchoolGroundsExtendedChildCareValid"
                      :hide-details="showErrorMessage && !isSchoolAgeCareOnSchoolGroundsExtendedChildCareValid"
                      label="Maximum Spaces Offered"
                      class="my-2"
                      @wheel="$event.target.blur()"
                      @update:model-value="convertBlankNumberToNull(model, 'extendedChildCareSchoolAge4OrMore')"
                    />
                  </v-col>
                </v-row>
                <div
                  v-if="showErrorMessage && !isSchoolAgeCareOnSchoolGroundsExtendedChildCareValid"
                  class="error-message pl-4"
                >
                  {{ ERROR_MESSAGES.INVALID_MAX_SPACES_EXTENDED_CC }}
                </div>
              </template>

              <v-checkbox
                id="multi-age-extendedCC-checkbox"
                v-model="model.hasMultiAgeExtendedCC"
                label="Multi-Age Child Care"
                color="primary"
                :disabled="isLocked"
                hide-details
              />
              <template v-if="model.hasMultiAgeExtendedCC">
                <v-row>
                  <v-col cols="12" lg="6" class="py-0">
                    <v-card-subtitle><strong>4 hours or less extended child care</strong></v-card-subtitle>
                    <v-text-field
                      v-model.number="model.multiAgeCare4OrLess"
                      :disabled="isLocked"
                      variant="outlined"
                      type="number"
                      :rules="[rules.wholeNumber, rules.max(model.maxGroupChildCareMultiAge)]"
                      :error="showErrorMessage && !isMultiAgeExtendedChildCareValid"
                      :hide-details="showErrorMessage && !isMultiAgeExtendedChildCareValid"
                      label="Maximum Spaces Offered"
                      class="my-2"
                      @wheel="$event.target.blur()"
                      @update:model-value="convertBlankNumberToNull(model, 'multiAgeCare4OrLess')"
                    />
                  </v-col>
                  <v-col cols="12" lg="6" class="py-0">
                    <v-card-subtitle><strong>Over 4 hours extended child care</strong></v-card-subtitle>
                    <v-text-field
                      v-model.number="model.multiAgeCare4more"
                      :disabled="isLocked"
                      variant="outlined"
                      type="number"
                      :rules="[rules.wholeNumber, rules.max(model.maxGroupChildCareMultiAge)]"
                      :error="showErrorMessage && !isMultiAgeExtendedChildCareValid"
                      :hide-details="showErrorMessage && !isMultiAgeExtendedChildCareValid"
                      label="Maximum Spaces Offered"
                      class="my-2"
                      @wheel="$event.target.blur()"
                      @update:model-value="convertBlankNumberToNull(model, 'multiAgeCare4more')"
                    />
                  </v-col>
                </v-row>
                <div v-if="showErrorMessage && !isMultiAgeExtendedChildCareValid" class="error-message pl-4">
                  {{ ERROR_MESSAGES.INVALID_MAX_SPACES_EXTENDED_CC }}
                </div>
              </template>

              <div v-if="showErrorMessage && !hasLicenceCategoryWithExtendedChildCare" class="error-message pl-4">
                {{ ERROR_MESSAGES.REQUIRED }}
              </div>
            </v-container>
          </v-card>
        </v-row>
      </v-skeleton-loader>

      <NavButton
        :is-next-displayed="true"
        :is-save-displayed="true"
        :is-save-disabled="isLocked"
        :is-next-disabled="!isFormComplete"
        :is-processing="processing"
        @previous="previous"
        @next="next"
        @validate-form="validateForm()"
        @save="save(true)"
      />
    </v-container>
  </v-form>
</template>

<script>
import AppTimeInput from '@/components/guiComponents/AppTimeInput.vue';

import fundMixing from '@/mixins/fundMixing.js';
import globalMixin from '@/mixins/globalMixin.js';
import { ERROR_MESSAGES } from '@/utils/constants.js';

export default {
  components: { AppTimeInput },
  mixins: [fundMixing, globalMixin],
  async beforeRouteLeave(_to, _from, next) {
    await this.save(false);
    next();
  },
  computed: {
    isFormComplete() {
      return (
        this.model.isCCOFComplete &&
        this.hasLicenceCategory &&
        (this.model.isExtendedHours !== 'yes' ||
          (this.hasLicenceCategoryWithExtendedChildCare &&
            this.isUnder36ExtendedChildCareValid &&
            this.is30MonthToSchoolAgeExtendedChildCareValid &&
            this.isSchoolAgeCareOnSchoolGroundsExtendedChildCareValid &&
            this.isMultiAgeExtendedChildCareValid))
      );
    },
  },
  created() {
    this.ERROR_MESSAGES = ERROR_MESSAGES;
  },
};
</script>

<style scoped>
:deep(.no-margin-left .v-label) {
  margin-left: 0 !important;
}
:deep(.v-selection-control-group) {
  padding-left: 0 !important;
}
</style>
