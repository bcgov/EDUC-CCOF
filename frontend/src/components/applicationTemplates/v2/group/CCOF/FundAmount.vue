<template>
  <v-form ref="form" v-model="fundingModel.isCCOFComplete">
    <v-card class="cc-top-level-card pa-2">
      <v-card-title class="text-center pb-0">
        <h3>Facility Licence and Service Details</h3>
      </v-card-title>
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="fundingModel.maxDaysPerWeek"
              :disabled="isLocked"
              type="number"
              variant="outlined"
              :rules="[...rules.required, rules.min(1), rules.max(7), rules.wholeNumber]"
              label="Maximum number of days per week you provide child care"
              @wheel="$event.target.blur()"
              @update:model-value="convertBlankNumberToNull(fundingModel, 'maxDaysPerWeek')"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="fundingModel.maxWeeksPerYear"
              :disabled="isLocked"
              type="number"
              variant="outlined"
              :rules="[...rules.required, rules.min(1), rules.max(52), rules.wholeNumber]"
              label="Maximum number of weeks per year you provide child care"
              @wheel="$event.target.blur()"
              @update:model-value="convertBlankNumberToNull(fundingModel, 'maxWeeksPerYear')"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <AppTimeInput
              v-model="fundingModel.hoursFrom"
              :rules="rules.required"
              :disabled="isLocked"
              :hide-details="isLocked"
              label="Facility hours of operation from"
            />
          </v-col>
          <v-col cols="12" md="6">
            <AppTimeInput
              v-model="fundingModel.hoursTo"
              :rules="[...rules.required, rules.validHourTo(fundingModel.hoursFrom)]"
              :disabled="isLocked"
              :hide-details="isLocked"
              label="Facility hours of operation to"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-radio-group
              v-model="fundingModel.hasClosedMonth"
              :disabled="isLocked"
              :rules="rules.required"
              inline
              label="Are there months when ALL of the programs at this facility are closed for the entire month?"
              class="application-label"
              @update:model-value="resetSelectedClosedMonths"
            >
              <v-radio label="Yes" :value="1" />
              <v-radio label="No" :value="0" />
            </v-radio-group>
          </v-col>
        </v-row>

        <template v-if="fundingModel.hasClosedMonth">
          <div>If YES, check all the fully closed months:</div>
          <v-row>
            <v-col cols="6" md="4" xl="2" class="py-0">
              <v-checkbox
                v-model="fundingModel.closedIn1"
                :true-value="1"
                :false-value="0"
                :disabled="isLocked"
                label="January"
                color="primary"
                hide-details
              />
            </v-col>
            <v-col cols="6" md="4" xl="2" class="py-0">
              <v-checkbox
                v-model="fundingModel.closedIn2"
                :true-value="1"
                :false-value="0"
                :disabled="isLocked"
                label="February"
                color="primary"
                hide-details
              />
            </v-col>
            <v-col cols="6" md="4" xl="2" class="py-0">
              <v-checkbox
                v-model="fundingModel.closedIn3"
                :true-value="1"
                :false-value="0"
                :disabled="isLocked"
                label="March"
                color="primary"
                hide-details
              />
            </v-col>
            <v-col cols="6" md="4" xl="2" class="py-0">
              <v-checkbox
                v-model="fundingModel.closedIn4"
                :true-value="1"
                :false-value="0"
                :disabled="isLocked"
                label="April"
                color="primary"
                hide-details
              />
            </v-col>
            <v-col cols="6" md="4" xl="2" class="py-0">
              <v-checkbox
                v-model="fundingModel.closedIn5"
                :true-value="1"
                :false-value="0"
                :disabled="isLocked"
                label="May"
                color="primary"
                hide-details
              />
            </v-col>
            <v-col cols="6" md="4" xl="2" class="py-0">
              <v-checkbox
                v-model="fundingModel.closedIn6"
                :true-value="1"
                :false-value="0"
                :disabled="isLocked"
                label="June"
                color="primary"
                hide-details
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6" md="4" xl="2" class="py-0">
              <v-checkbox
                v-model="fundingModel.closedIn7"
                :true-value="1"
                :false-value="0"
                :disabled="isLocked"
                label="July"
                color="primary"
                hide-details
              />
            </v-col>
            <v-col cols="6" md="4" xl="2" class="py-0">
              <v-checkbox
                v-model="fundingModel.closedIn8"
                :true-value="1"
                :false-value="0"
                :disabled="isLocked"
                label="August"
                color="primary"
                hide-details
              />
            </v-col>
            <v-col cols="6" md="4" xl="2" class="py-0">
              <v-checkbox
                v-model="fundingModel.closedIn9"
                :true-value="1"
                :false-value="0"
                :disabled="isLocked"
                label="September"
                color="primary"
                hide-details
              />
            </v-col>
            <v-col cols="6" md="4" xl="2" class="py-0">
              <v-checkbox
                v-model="fundingModel.closedIn10"
                :true-value="1"
                :false-value="0"
                :disabled="isLocked"
                label="October"
                color="primary"
                hide-details
              />
            </v-col>
            <v-col cols="6" md="4" xl="2" class="py-0">
              <v-checkbox
                v-model="fundingModel.closedIn11"
                :true-value="1"
                :false-value="0"
                :disabled="isLocked"
                label="November"
                color="primary"
                hide-details
              />
            </v-col>
            <v-col cols="6" md="4" xl="2" class="py-0">
              <v-checkbox
                v-model="fundingModel.closedIn12"
                :true-value="1"
                :false-value="0"
                :disabled="isLocked"
                label="December"
                color="primary"
                hide-details
              />
            </v-col>
          </v-row>
          <div v-if="showErrorMessage" class="error-message pl-4">
            <p v-if="hasAllMonthsClosed">{{ ERROR_MESSAGES.FACILITY_MUST_OPERATE_ONE_MONTH }}</p>
            <p v-else-if="hasNoMonthClosed">{{ ERROR_MESSAGES.NO_MONTH_SELECTED }}</p>
          </div>
        </template>
      </v-container>
    </v-card>

    <v-card class="cc-top-level-card pa-2">
      <v-container>
        <div>
          Select each licence category that is listed on your Community Care and Assisted Living Act Facility Licence
        </div>
        <v-checkbox
          id="under-36months-checkbox"
          v-model="fundingModel.hasUnder36Months"
          label="Group Child Care (Under 36 Months)"
          color="primary"
          :disabled="isLocked"
          hide-details
          @update:model-value="fundingModel.maxGroupChildCareUnder36 = null"
        />
        <v-text-field
          v-if="fundingModel.hasUnder36Months"
          v-model.number="fundingModel.maxGroupChildCareUnder36"
          :disabled="isLocked"
          type="number"
          variant="outlined"
          :rules="[...rules.required, rules.wholeNumber, rules.min(1)]"
          label="Maximum Number for Group Child Care (Under 36 Months)"
          @wheel="$event.target.blur()"
          @update:model-value="convertBlankNumberToNull(fundingModel, 'maxGroupChildCareUnder36')"
        />

        <v-checkbox
          id="30months-to-schoolage-checkbox"
          v-model="fundingModel.has30MonthToSchoolAge"
          label="Group Child Care (30 Months to School Age)"
          color="primary"
          :disabled="isLocked"
          hide-details
          @update:model-value="fundingModel.maxGroupChildCare36 = null"
        />
        <v-text-field
          v-if="fundingModel.has30MonthToSchoolAge"
          v-model.number="fundingModel.maxGroupChildCare36"
          :disabled="isLocked"
          type="number"
          variant="outlined"
          :rules="[...rules.required, rules.wholeNumber, rules.min(1)]"
          label="Maximum Number for Group Child Care (30 Months to School Age)"
          @wheel="$event.target.blur()"
          @update:model-value="convertBlankNumberToNull(fundingModel, 'maxGroupChildCare36')"
        />

        <v-checkbox
          id="schoolage-care-checkbox"
          v-model="fundingModel.hasSchoolAge"
          label="Group Child Care (School Age)"
          color="primary"
          :disabled="isLocked"
          hide-details
          @update:model-value="resetGroupChildCareSchoolAgeRelatedFields"
        />
        <v-text-field
          v-if="fundingModel.hasSchoolAge"
          v-model.number="fundingModel.maxGroupChildCareSchool"
          :disabled="isLocked"
          type="number"
          variant="outlined"
          :rules="[...rules.required, rules.wholeNumber, rules.min(1)]"
          label="Maximum Number for Group Child Care (School Age)"
          @wheel="$event.target.blur()"
          @update:model-value="convertBlankNumberToNull(fundingModel, 'maxGroupChildCareSchool')"
        />

        <v-checkbox
          id="care-on-school-grounds-checkbox"
          v-model="fundingModel.hasSchoolAgeCareOnSchoolGrounds"
          label="School Age Care on School Grounds"
          color="primary"
          :disabled="isLocked"
          hide-details
          @update:model-value="resetSchoolAgeCareOnSchoolGroundsRelatedFields"
        />
        <v-text-field
          v-if="fundingModel.hasSchoolAgeCareOnSchoolGrounds"
          v-model.number="fundingModel.maxSchoolAgeCareOnSchoolGrounds"
          :disabled="isLocked"
          type="number"
          variant="outlined"
          :rules="[...rules.required, rules.wholeNumber, rules.min(1)]"
          label="Maximum Number for School Age Care on School Grounds"
          @wheel="$event.target.blur()"
          @update:model-value="convertBlankNumberToNull(fundingModel, 'maxSchoolAgeCareOnSchoolGrounds')"
        />

        <v-checkbox
          id="preschool-checkbox"
          v-model="fundingModel.hasPreschool"
          label="Preschool"
          color="primary"
          :disabled="isLocked"
          hide-details
          @update:model-value="resetPreschoolRelatedFields"
        />
        <v-text-field
          v-if="fundingModel.hasPreschool"
          v-model.number="fundingModel.maxPreschool"
          :disabled="isLocked"
          type="number"
          variant="outlined"
          :rules="[...rules.required, rules.wholeNumber, rules.min(1)]"
          label="Maximum Number for Preschool"
          @wheel="$event.target.blur()"
          @update:model-value="convertBlankNumberToNull(fundingModel, 'maxPreschool')"
        />

        <v-checkbox
          id="multi-age-checkbox"
          v-model="fundingModel.hasMultiAge"
          label="Multi-Age Child Care"
          color="primary"
          :disabled="isLocked"
          hide-details
          @update:model-value="fundingModel.maxGroupChildCareMultiAge = null"
        />
        <v-text-field
          v-if="fundingModel.hasMultiAge"
          v-model.number="fundingModel.maxGroupChildCareMultiAge"
          :disabled="isLocked"
          type="number"
          variant="outlined"
          :rules="[...rules.required, rules.wholeNumber, rules.min(1)]"
          label="Maximum Number for Multi-Age Child Care"
          @wheel="$event.target.blur()"
          @update:model-value="convertBlankNumberToNull(fundingModel, 'maxGroupChildCareMultiAge')"
        />

        <div v-if="showErrorMessage && !hasLicenceCategory" class="error-message pl-4">
          {{ ERROR_MESSAGES.LICENCE_CATEGORY_REQUIRED }}
        </div>

        <div v-if="hasLicenceCategory" class="mt-4">
          <div class="mb-2">Enter the Maximum Licensed Capacity</div>
          <v-text-field
            v-model.number="fundingModel.maxLicensesCapacity"
            :disabled="isLocked"
            type="number"
            variant="outlined"
            :rules="[...rules.required, rules.wholeNumber, rules.min(1)]"
            label="Maximum Licensed Capacity"
            @wheel="$event.target.blur()"
            @update:model-value="convertBlankNumberToNull(fundingModel, 'maxLicensesCapacity')"
          />
        </div>
      </v-container>
    </v-card>

    <v-card v-if="fundingModel.hasPreschool" class="cc-top-level-card">
      <v-card-title>Preschool</v-card-title>
      <v-card-subtitle>Please indicate how many preschool sessions your facility offers per day</v-card-subtitle>

      <v-container>
        <v-row>
          <v-col cols="12" md="2">
            <v-text-field
              v-model.number="fundingModel.monday"
              :disabled="isLocked"
              type="number"
              variant="outlined"
              :rules="[...rules.required, rules.wholeNumber]"
              label="Monday"
              @wheel="$event.target.blur()"
              @update:model-value="convertBlankNumberToNull(fundingModel, 'monday')"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field
              v-model.number="fundingModel.tusday"
              :disabled="isLocked"
              type="number"
              variant="outlined"
              :rules="[...rules.required, rules.wholeNumber]"
              label="Tuesday"
              @wheel="$event.target.blur()"
              @update:model-value="convertBlankNumberToNull(fundingModel, 'tusday')"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field
              v-model.number="fundingModel.wednesday"
              :disabled="isLocked"
              type="number"
              variant="outlined"
              :rules="[...rules.required, rules.wholeNumber]"
              label="Wednesday"
              @wheel="$event.target.blur()"
              @update:model-value="convertBlankNumberToNull(fundingModel, 'wednesday')"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field
              v-model.number="fundingModel.thursday"
              :disabled="isLocked"
              type="number"
              variant="outlined"
              :rules="[...rules.required, rules.wholeNumber]"
              label="Thursday"
              @wheel="$event.target.blur()"
              @update:model-value="convertBlankNumberToNull(fundingModel, 'thursday')"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field
              v-model.number="fundingModel.friday"
              :disabled="isLocked"
              type="number"
              variant="outlined"
              :rules="[...rules.required, rules.wholeNumber]"
              label="Friday"
              @wheel="$event.target.blur()"
              @update:model-value="convertBlankNumberToNull(fundingModel, 'friday')"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field
              v-model.number="fundingModel.preschoolSessionsTotal"
              disabled
              type="number"
              variant="outlined"
              :model-value="preschoolSessionsTotal"
              label="Total"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <v-card class="cc-top-level-card pa-2">
      <v-container>
        <v-radio-group
          v-model="fundingModel.isSchoolProperty"
          :disabled="isLocked"
          :rules="rules.required"
          inline
          label="Is the facility located on school property?"
          class="application-label"
        >
          <v-radio label="Yes" :value="1" />
          <v-radio label="No" :value="0" />
        </v-radio-group>

        <template v-if="hasSchoolAgeCareLicenceCategory">
          <div class="my-2">School Age Care Service Details</div>
          <v-card-subtitle class="px-0 my-2"> Please indicate each service that your facility offers </v-card-subtitle>
          <v-row>
            <v-col cols="12" sm="6" lg="3" class="py-0">
              <v-checkbox
                v-model="fundingModel.beforeSchool"
                :disabled="isLocked"
                :true-value="1"
                :false-value="0"
                hide-details
                label="Before School"
                color="primary"
              />
            </v-col>
            <v-col cols="12" sm="6" lg="3" class="py-0">
              <v-checkbox
                v-model="fundingModel.afterSchool"
                :disabled="isLocked"
                :true-value="1"
                :false-value="0"
                hide-details
                label="After School"
                color="primary"
              />
            </v-col>
            <v-col cols="12" sm="6" lg="3" class="py-0">
              <v-checkbox
                v-model="fundingModel.beforeKindergarten"
                :disabled="isLocked"
                :true-value="1"
                :false-value="0"
                hide-details
                label="Before Kindergarten"
                color="primary"
              />
            </v-col>
            <v-col cols="12" sm="6" lg="3" class="py-0">
              <v-checkbox
                v-model="fundingModel.afterKindergarten"
                :disabled="isLocked"
                :true-value="1"
                :false-value="0"
                hide-details
                label="After Kindergarten"
                color="primary"
              />
            </v-col>
          </v-row>
          <div v-if="showErrorMessage && !hasSchoolAgeCareServices" class="error-message pl-4">
            {{ ERROR_MESSAGES.REQUIRED }}
          </div>
        </template>
      </v-container>
    </v-card>

    <v-card class="cc-top-level-card pa-2">
      <v-container>
        <v-radio-group
          v-model="fundingModel.isExtendedHours"
          :rules="rules.required"
          :disabled="isLocked"
          inline
          label="Do you regularly offer extended hours of child care (care before 6:00 AM, after 7:00 PM, or overnight service)?"
          class="application-label"
          @update:model-value="resetExtendedHoursFields"
        >
          <v-radio label="Yes" :value="1" />
          <v-radio label="No" :value="0" />
        </v-radio-group>

        <template v-if="fundingModel.isExtendedHours">
          <v-text-field
            v-model.number="fundingModel.maxDaysPerWeekExtended"
            :disabled="isLocked"
            type="number"
            variant="outlined"
            :rules="[...rules.required, rules.min(1), rules.max(7), rules.wholeNumber]"
            label="Maximum number of days per week you offer extended hours of child care?"
            @wheel="$event.target.blur()"
            @update:model-value="convertBlankNumberToNull(fundingModel, 'maxDaysPerWeekExtended')"
          />
          <v-text-field
            v-model.number="fundingModel.maxWeeksPerYearExtended"
            :disabled="isLocked"
            type="number"
            variant="outlined"
            :rules="[...rules.required, rules.min(1), rules.max(52), rules.wholeNumber]"
            label="Maximum number of weeks per year you offer extended hours of child care?"
            class="mt-4"
            @wheel="$event.target.blur()"
            @update:model-value="convertBlankNumberToNull(fundingModel, 'maxWeeksPerYearExtended')"
          />
        </template>
      </v-container>
    </v-card>

    <v-card v-if="fundingModel.isExtendedHours" class="cc-top-level-card pa-2">
      <v-container>
        <div>
          Select each licence category for which you offer extended hours (care before 6:00 AM, after 7:00 PM, or
          overnight service)
        </div>

        <v-checkbox
          id="under-36months-extendedCC-checkbox"
          v-model="fundingModel.hasUnder36MonthsExtendedCC"
          label="Group Child Care (Under 36 Months)"
          color="primary"
          :disabled="isLocked"
          hide-details
          @update:model-value="resetUnder36MonthsExtendedCCRelatedFields"
        />
        <template v-if="fundingModel.hasUnder36MonthsExtendedCC">
          <v-row>
            <v-col cols="12" lg="6" class="py-0">
              <v-card-subtitle><strong>4 hours or less extended child care</strong></v-card-subtitle>
              <v-text-field
                v-model.number="fundingModel.extendedChildCareUnder36Months4OrLess"
                :disabled="isLocked"
                variant="outlined"
                type="number"
                :rules="[rules.wholeNumber, rules.max(fundingModel.maxGroupChildCareUnder36 * 2)]"
                :error="showErrorMessage && !isUnder36ExtendedCCMaxSpacesEntered"
                :hide-details="showErrorMessage && !isUnder36ExtendedCCMaxSpacesEntered"
                label="Maximum Spaces Offered"
                class="my-2"
                @wheel="$event.target.blur()"
                @update:model-value="convertBlankNumberToNull(fundingModel, 'extendedChildCareUnder36Months4OrLess')"
              />
            </v-col>
            <v-col cols="12" lg="6" class="py-0">
              <v-card-subtitle><strong>Over 4 hours extended child care</strong></v-card-subtitle>
              <v-text-field
                v-model.number="fundingModel.extendedChildCareUnder36Months4OrMore"
                :disabled="isLocked"
                variant="outlined"
                type="number"
                :rules="[rules.wholeNumber, rules.max(fundingModel.maxGroupChildCareUnder36)]"
                :error="showErrorMessage && !isUnder36ExtendedCCMaxSpacesEntered"
                :hide-details="showErrorMessage && !isUnder36ExtendedCCMaxSpacesEntered"
                label="Maximum Spaces Offered"
                class="my-2"
                @wheel="$event.target.blur()"
                @update:model-value="convertBlankNumberToNull(fundingModel, 'extendedChildCareUnder36Months4OrMore')"
              />
            </v-col>
          </v-row>
          <div v-if="showErrorMessage && !isUnder36ExtendedCCMaxSpacesEntered" class="error-message pl-4">
            {{ ERROR_MESSAGES.EMPTY_MAX_SPACES_EXTENDED_CC }}
          </div>
        </template>

        <v-checkbox
          id="30months-to-schoolage-extendedCC-checkbox"
          v-model="fundingModel.has30MonthToSchoolAgeExtendedCC"
          label="Group Child Care (30 Months to School Age)"
          color="primary"
          :disabled="isLocked"
          hide-details
          @update:model-value="reset30MonthsToSchoolAgeExtendedCCRelatedFields"
        />
        <template v-if="fundingModel.has30MonthToSchoolAgeExtendedCC">
          <v-row>
            <v-col cols="12" lg="6" class="py-0">
              <v-card-subtitle><strong>4 hours or less extended child care</strong></v-card-subtitle>
              <v-text-field
                v-model.number="fundingModel.extendedChildCare36MonthsToSchoolAge4OrLess"
                :disabled="isLocked"
                variant="outlined"
                type="number"
                :rules="[rules.wholeNumber, rules.max(fundingModel.maxGroupChildCare36 * 2)]"
                :error="showErrorMessage && !is30MonthToSchoolAgeExtendedCCMaxSpacesEntered"
                :hide-details="showErrorMessage && !is30MonthToSchoolAgeExtendedCCMaxSpacesEntered"
                label="Maximum Spaces Offered"
                class="my-2"
                @wheel="$event.target.blur()"
                @update:model-value="
                  convertBlankNumberToNull(fundingModel, 'extendedChildCare36MonthsToSchoolAge4OrLess')
                "
              />
            </v-col>
            <v-col cols="12" lg="6" class="py-0">
              <v-card-subtitle><strong>Over 4 hours extended child care</strong></v-card-subtitle>
              <v-text-field
                v-model.number="fundingModel.extendedChildCare36MonthsToSchoolAge4OrMore"
                :disabled="isLocked"
                variant="outlined"
                type="number"
                :rules="[rules.wholeNumber, rules.max(fundingModel.maxGroupChildCare36)]"
                :error="showErrorMessage && !is30MonthToSchoolAgeExtendedCCMaxSpacesEntered"
                :hide-details="showErrorMessage && !is30MonthToSchoolAgeExtendedCCMaxSpacesEntered"
                label="Maximum Spaces Offered"
                class="my-2"
                @wheel="$event.target.blur()"
                @update:model-value="
                  convertBlankNumberToNull(fundingModel, 'extendedChildCare36MonthsToSchoolAge4OrMore')
                "
              />
            </v-col>
          </v-row>
          <div v-if="showErrorMessage && !is30MonthToSchoolAgeExtendedCCMaxSpacesEntered" class="error-message pl-4">
            {{ ERROR_MESSAGES.EMPTY_MAX_SPACES_EXTENDED_CC }}
          </div>
        </template>

        <v-checkbox
          id="schoolage-care-extendedCC-checkbox"
          v-model="fundingModel.hasSchoolAgeExtendedCC"
          label="Group Child Care (School Age)"
          color="primary"
          :disabled="isLocked"
          hide-details
          @update:model-value="resetSchoolAgeExtendedCCRelatedFields"
        />
        <template v-if="fundingModel.hasSchoolAgeExtendedCC">
          <v-row>
            <v-col cols="12" lg="6" class="py-0">
              <v-card-subtitle><strong>4 hours or less extended child care</strong></v-card-subtitle>
              <v-text-field
                v-model.number="fundingModel.extendedChildCareSchoolAge4OrLess"
                :disabled="isLocked"
                variant="outlined"
                type="number"
                :rules="[rules.wholeNumber, rules.max(fundingModel.maxGroupChildCareSchool * 2)]"
                :error="showErrorMessage && !isSchoolAgeExtendedCCMaxSpacesEntered"
                :hide-details="showErrorMessage && !isSchoolAgeExtendedCCMaxSpacesEntered"
                label="Maximum Spaces Offered"
                class="my-2"
                @wheel="$event.target.blur()"
                @update:model-value="convertBlankNumberToNull(fundingModel, 'extendedChildCareSchoolAge4OrLess')"
              />
            </v-col>
            <v-col cols="12" lg="6" class="py-0">
              <v-card-subtitle><strong>Over 4 hours extended child care</strong></v-card-subtitle>
              <v-text-field
                v-model.number="fundingModel.extendedChildCareSchoolAge4OrMore"
                :disabled="isLocked"
                variant="outlined"
                type="number"
                :rules="[rules.wholeNumber, rules.max(fundingModel.maxGroupChildCareSchool)]"
                :error="showErrorMessage && !isSchoolAgeExtendedCCMaxSpacesEntered"
                :hide-details="showErrorMessage && !isSchoolAgeExtendedCCMaxSpacesEntered"
                label="Maximum Spaces Offered"
                class="my-2"
                @wheel="$event.target.blur()"
                @update:model-value="convertBlankNumberToNull(fundingModel, 'extendedChildCareSchoolAge4OrMore')"
              />
            </v-col>
          </v-row>
          <div v-if="showErrorMessage && !isSchoolAgeExtendedCCMaxSpacesEntered" class="error-message pl-4">
            {{ ERROR_MESSAGES.EMPTY_MAX_SPACES_EXTENDED_CC }}
          </div>
        </template>

        <v-checkbox
          id="care-on-school-grounds-extendedCC-checkbox"
          v-model="fundingModel.hasSchoolAgeCareOnSchoolGroundsExtendedCC"
          label="School Age Care on School Grounds"
          color="primary"
          :disabled="isLocked"
          hide-details
          @update:model-value="resetSchoolAgeCareOnSchoolGroundsExtendedCCRelatedFields"
        />
        <template v-if="fundingModel.hasSchoolAgeCareOnSchoolGroundsExtendedCC">
          <v-row>
            <v-col cols="12" lg="6" class="py-0">
              <v-card-subtitle><strong>4 hours or less extended child care</strong></v-card-subtitle>
              <v-text-field
                v-model.number="fundingModel.extendedSchoolAgeCareOnSchoolGrounds4OrLess"
                :disabled="isLocked"
                variant="outlined"
                type="number"
                :rules="[rules.wholeNumber, rules.max(fundingModel.maxSchoolAgeCareOnSchoolGrounds * 2)]"
                :error="showErrorMessage && !isSchoolAgeCareOnSchoolGroundsExtendedCCMaxSpacesEntered"
                :hide-details="showErrorMessage && !isSchoolAgeCareOnSchoolGroundsExtendedCCMaxSpacesEntered"
                label="Maximum Spaces Offered"
                class="my-2"
                @wheel="$event.target.blur()"
                @update:model-value="
                  convertBlankNumberToNull(fundingModel, 'extendedSchoolAgeCareOnSchoolGrounds4OrLess')
                "
              />
            </v-col>
            <v-col cols="12" lg="6" class="py-0">
              <v-card-subtitle><strong>Over 4 hours extended child care</strong></v-card-subtitle>
              <v-text-field
                v-model.number="fundingModel.extendedSchoolAgeCareOnSchoolGrounds4OrMore"
                :disabled="isLocked"
                variant="outlined"
                type="number"
                :rules="[rules.wholeNumber, rules.max(fundingModel.maxSchoolAgeCareOnSchoolGrounds)]"
                :error="showErrorMessage && !isSchoolAgeCareOnSchoolGroundsExtendedCCMaxSpacesEntered"
                :hide-details="showErrorMessage && !isSchoolAgeCareOnSchoolGroundsExtendedCCMaxSpacesEntered"
                label="Maximum Spaces Offered"
                class="my-2"
                @wheel="$event.target.blur()"
                @update:model-value="
                  convertBlankNumberToNull(fundingModel, 'extendedSchoolAgeCareOnSchoolGrounds4OrMore')
                "
              />
            </v-col>
          </v-row>
          <div
            v-if="showErrorMessage && !isSchoolAgeCareOnSchoolGroundsExtendedCCMaxSpacesEntered"
            class="error-message pl-4"
          >
            {{ ERROR_MESSAGES.EMPTY_MAX_SPACES_EXTENDED_CC }}
          </div>
        </template>

        <v-checkbox
          id="multi-age-extendedCC-checkbox"
          v-model="fundingModel.hasMultiAgeExtendedCC"
          label="Multi-Age Child Care"
          color="primary"
          :disabled="isLocked"
          hide-details
          @update:model-value="resetMultiAgeExtendedCCRelatedFields"
        />
        <template v-if="fundingModel.hasMultiAgeExtendedCC">
          <v-row>
            <v-col cols="12" lg="6" class="py-0">
              <v-card-subtitle><strong>4 hours or less extended child care</strong></v-card-subtitle>
              <v-text-field
                v-model.number="fundingModel.multiAgeCare4OrLess"
                :disabled="isLocked"
                variant="outlined"
                type="number"
                :rules="[rules.wholeNumber, rules.max(fundingModel.maxGroupChildCareMultiAge * 2)]"
                :error="showErrorMessage && !isMultiAgeExtendedCCMaxSpacesEntered"
                :hide-details="showErrorMessage && !isMultiAgeExtendedCCMaxSpacesEntered"
                label="Maximum Spaces Offered"
                class="my-2"
                @wheel="$event.target.blur()"
                @update:model-value="convertBlankNumberToNull(fundingModel, 'multiAgeCare4OrLess')"
              />
            </v-col>
            <v-col cols="12" lg="6" class="py-0">
              <v-card-subtitle><strong>Over 4 hours extended child care</strong></v-card-subtitle>
              <v-text-field
                v-model.number="fundingModel.multiAgeCare4more"
                :disabled="isLocked"
                variant="outlined"
                type="number"
                :rules="[rules.wholeNumber, rules.max(fundingModel.maxGroupChildCareMultiAge)]"
                :error="showErrorMessage && !isMultiAgeExtendedCCMaxSpacesEntered"
                :hide-details="showErrorMessage && !isMultiAgeExtendedCCMaxSpacesEntered"
                label="Maximum Spaces Offered"
                class="my-2"
                @wheel="$event.target.blur()"
                @update:model-value="convertBlankNumberToNull(fundingModel, 'multiAgeCare4more')"
              />
            </v-col>
          </v-row>
          <div v-if="showErrorMessage && !isMultiAgeExtendedCCMaxSpacesEntered" class="error-message pl-4">
            {{ ERROR_MESSAGES.EMPTY_MAX_SPACES_EXTENDED_CC }}
          </div>
        </template>

        <div v-if="showErrorMessage && !hasLicenceCategoryWithExtendedChildCare" class="error-message pl-4">
          {{ ERROR_MESSAGES.LICENCE_CATEGORY_REQUIRED }}
        </div>
      </v-container>
    </v-card>
  </v-form>
</template>

<script>
import fundMixin from '@/mixins/fundMixin.js';
import globalMixin from '@/mixins/globalMixin.js';

export default {
  mixins: [fundMixin, globalMixin],
  watch: {
    isApplicationFormValidated: {
      handler() {
        this.isFormValidated = true;
        this.$refs.form?.validate();
      },
    },
  },
};
</script>

<style scoped>
:deep(.v-selection-control-group) {
  padding-left: 0 !important;
}
</style>
