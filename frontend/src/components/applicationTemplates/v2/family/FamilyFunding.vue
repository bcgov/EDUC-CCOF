<template>
  <v-form ref="form" v-model="fundingModel.isCCOFComplete">
    <v-card class="cc-top-level-card pa-2">
      <v-card-title class="text-center pb-0">
        <h3>Facility Licence and Service Details</h3>
      </v-card-title>
      <v-container>
        <v-card class="cc-top-level-card pa-2">
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
              <p>
                Select the licence category that is listed on your Community Care and Assisted Living Act Facility
                Licence:
              </p>
              <v-radio-group
                v-model="fundingModel.licenceCategoryNumber"
                :disabled="isLocked"
                :rules="rules.required"
                :hide-details="isEmpty(fundingModel.licenceCategoryNumber)"
              >
                <div v-for="item in sortedFamilyLicenseCategories" :key="item.ccof_categorynumber">
                  <v-radio
                    :label="getLicenceCategoryName(item.ccof_categorynumber)"
                    :value="item.ccof_categorynumber"
                  />
                  <v-text-field
                    v-if="item.ccof_categorynumber === fundingModel.licenceCategoryNumber"
                    v-model.number="fundingModel.maxLicensesCapacity"
                    :disabled="isLocked"
                    type="number"
                    variant="outlined"
                    :rules="[...rules.required, rules.wholeNumber, rules.min(1)]"
                    label="Maximum Licensed Capacity"
                    class="pt-2"
                    @wheel="$event.target.blur()"
                    @update:model-value="convertBlankNumberToNull(fundingModel, 'maxSpaces')"
                  />
                </div>
              </v-radio-group>
            </div>

            <div v-if="fundingModel.licenceCategoryNumber" class="mt-4">
              <p class="mb-2">Maximum Licensed Capacity</p>
              <v-text-field
                :model-value="fundingModel.maxLicensesCapacity"
                :disabled="true"
                type="number"
                variant="outlined"
                label="Maximum Licensed Capacity"
                @wheel="$event.target.blur()"
                @update:model-value="convertBlankNumberToNull(fundingModel, 'maxLicensesCapacity')"
              />

              <v-row no-gutters class="pb-1">
                <p>Enter maximum number of child care spaces you offer</p>
                <div class="pl-1">
                  <AppTooltip
                    tooltip-content="Your maximum licensed capacity minus any children living in your home age 12 and under."
                  />
                </div>
              </v-row>
              <v-text-field
                v-model.number="fundingModel.maxSpaces"
                :disabled="isLocked"
                type="number"
                variant="outlined"
                :rules="[
                  ...rules.required,
                  rules.min(0),
                  rules.wholeNumber,
                  rules.max(fundingModel.maxLicensesCapacity),
                ]"
                label="Maximum Number of Child Care Spaces"
                @wheel="$event.target.blur()"
                @update:model-value="convertBlankNumberToNull(fundingModel, 'maxSpaces')"
              />
            </div>
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
            <p>
              Enter the number of spaces for which you offer extended hours (care before 6:00 AM, after 7:00 PM or
              overnight service regularly offered)
            </p>
            <v-radio-group :model-value="fundingModel.licenceCategoryNumber" hide-details>
              <div v-for="item in sortedFamilyLicenseCategories" :key="item.id">
                <v-radio
                  :label="getLicenceCategoryName(item.ccof_categorynumber)"
                  :value="item.ccof_categorynumber"
                  :disabled="true"
                />
                <v-row v-if="item.ccof_categorynumber === fundingModel.licenceCategoryNumber">
                  <v-col cols="12" lg="6" class="py-0">
                    <p class="pl-4"><strong>4 hours or less extended child care</strong></p>
                    <v-text-field
                      v-model.number="fundingModel[maxSpaces4OrLessExtendedCC]"
                      :disabled="isLocked"
                      variant="outlined"
                      type="number"
                      :rules="[rules.wholeNumber, rules.max(fundingModel.maxLicensesCapacity * 2)]"
                      :error="showInvalidMaxSpacesErrorMessage"
                      :hide-details="showInvalidMaxSpacesErrorMessage"
                      label="Maximum Spaces Offered"
                      class="my-2"
                      @wheel="$event.target.blur()"
                      @update:model-value="convertBlankNumberToNull(fundingModel, maxSpaces4OrLessExtendedCC)"
                    />
                  </v-col>
                  <v-col cols="12" lg="6" class="py-0">
                    <p class="pl-4"><strong>Over 4 hours extended child care</strong></p>
                    <v-text-field
                      v-model.number="fundingModel[maxSpaces4OrMoreExtendedCC]"
                      :disabled="isLocked"
                      variant="outlined"
                      type="number"
                      :rules="[rules.wholeNumber, rules.max(fundingModel.maxLicensesCapacity)]"
                      :error="showInvalidMaxSpacesErrorMessage"
                      :hide-details="showInvalidMaxSpacesErrorMessage"
                      label="Maximum Spaces Offered"
                      class="my-2"
                      @wheel="$event.target.blur()"
                      @update:model-value="convertBlankNumberToNull(fundingModel, maxSpaces4OrMoreExtendedCC)"
                    />
                  </v-col>
                  <div v-if="showInvalidMaxSpacesErrorMessage" class="error-message pl-4">
                    {{ ERROR_MESSAGES.EMPTY_MAX_SPACES_EXTENDED_CC }}
                  </div>
                </v-row>
              </div>
            </v-radio-group>
          </v-container>
        </v-card>
      </v-container>
    </v-card>
  </v-form>
</template>

<script>
import { orderBy } from 'lodash';
import fundMixin from '@/mixins/fundMixin.js';
import globalMixin from '@/mixins/globalMixin.js';
import ApplicationService from '@/services/applicationService';

export default {
  mixins: [fundMixin, globalMixin],
  computed: {
    maxSpaces4OrLessExtendedCC() {
      return ApplicationService.getFieldNameOfMaxSpaces4OrLessExtendedCC(this.fundingModel?.licenceCategoryNumber);
    },
    maxSpaces4OrMoreExtendedCC() {
      return ApplicationService.getFieldNameOfMaxSpaces4OrMoreExtendedCC(this.fundingModel?.licenceCategoryNumber);
    },
    showInvalidMaxSpacesErrorMessage() {
      return (
        this.showErrorMessage &&
        !this.fundingModel[this.maxSpaces4OrLessExtendedCC] &&
        !this.fundingModel[this.maxSpaces4OrMoreExtendedCC]
      );
    },
    sortedFamilyLicenseCategories() {
      return orderBy(this.lookupInfo.familyLicenseCategory, ['ccof_categorynumber'], ['desc']);
    },
  },
  watch: {
    isApplicationFormValidated: {
      handler() {
        this.isFormValidated = true;
        this.$refs.form?.validate();
      },
    },
  },
  methods: {
    getLicenceCategoryName(licenceCategoryNumber) {
      return ApplicationService.getFamilyLicenceCategoryNameByNumber(licenceCategoryNumber);
    },
  },
};
</script>

<style scoped>
:deep(.v-selection-control-group) {
  padding-left: 0 !important;
}
</style>
