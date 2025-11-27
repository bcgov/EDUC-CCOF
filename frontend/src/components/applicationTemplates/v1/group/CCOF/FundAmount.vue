<!--
* NOTE (vietle-cgi):  
* This file contains **legacy code** from the previous application layout, which was deprecated and replaced as of March 2025.  
* **DO NOT modify this file** to maintain compatibility with submitted PCF application/change request.
*  
* Source: Copied from commit 1146a77 on Dec 19, 2024 with some changes.
-->
<template>
  <v-form ref="form" v-model="fundingModel.isCCOFComplete">
    <v-row justify="space-around">
      <v-card class="cc-top-level-card" width="1200">
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="fundingModel.maxDaysPerWeek"
                :disabled="isLocked"
                type="number"
                min="0"
                max="7"
                variant="outlined"
                required
                :rules="[...rules.required, rules.min(0), rules.max(7), rules.wholeNumber]"
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
                min="0"
                max="52"
                variant="outlined"
                required
                :rules="[...rules.required, rules.min(0), rules.max(52), rules.wholeNumber]"
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
                inline
                label="Are there months when ALL of the programs at this facility are closed for the entire month?"
              >
                <v-radio label="Yes" :value="1" />
                <v-radio label="No" :value="0" />
              </v-radio-group>
            </v-col>
          </v-row>

          <v-row v-show="fundingModel.hasClosedMonth">
            <v-col>
              <p>If YES, check all the applicable months:</p>
            </v-col>
          </v-row>

          <template v-if="fundingModel.hasClosedMonth">
            <v-row>
              <v-col>
                <v-checkbox
                  v-model="fundingModel.closedIn1"
                  :true-value="1"
                  :false-value="0"
                  :disabled="isLocked"
                  label="Jan"
                />
              </v-col>
              <v-col>
                <v-checkbox
                  v-model="fundingModel.closedIn2"
                  :true-value="1"
                  :false-value="0"
                  :disabled="isLocked"
                  label="Feb"
                />
              </v-col>
              <v-col>
                <v-checkbox
                  v-model="fundingModel.closedIn3"
                  :true-value="1"
                  :false-value="0"
                  :disabled="isLocked"
                  label="Mar"
                />
              </v-col>
              <v-col>
                <v-checkbox
                  v-model="fundingModel.closedIn4"
                  :true-value="1"
                  :false-value="0"
                  :disabled="isLocked"
                  label="Apr"
                />
              </v-col>
              <v-col>
                <v-checkbox
                  v-model="fundingModel.closedIn5"
                  :true-value="1"
                  :false-value="0"
                  :disabled="isLocked"
                  label="May"
                />
              </v-col>
              <v-col>
                <v-checkbox
                  v-model="fundingModel.closedIn6"
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
                  v-model="fundingModel.closedIn7"
                  :true-value="1"
                  :false-value="0"
                  :disabled="isLocked"
                  label="Jul"
                />
              </v-col>
              <v-col>
                <v-checkbox
                  v-model="fundingModel.closedIn8"
                  :true-value="1"
                  :false-value="0"
                  :disabled="isLocked"
                  label="Aug"
                />
              </v-col>
              <v-col>
                <v-checkbox
                  v-model="fundingModel.closedIn9"
                  :true-value="1"
                  :false-value="0"
                  :disabled="isLocked"
                  label="Sep"
                />
              </v-col>
              <v-col>
                <v-checkbox
                  v-model="fundingModel.closedIn10"
                  :true-value="1"
                  :false-value="0"
                  :disabled="isLocked"
                  label="Oct"
                />
              </v-col>
              <v-col>
                <v-checkbox
                  v-model="fundingModel.closedIn11"
                  :true-value="1"
                  :false-value="0"
                  :disabled="isLocked"
                  label="Nov"
                />
              </v-col>
              <v-col>
                <v-checkbox
                  v-model="fundingModel.closedIn12"
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

      <v-card class="cc-top-level-card" width="1200">
        <v-card-subtitle class="pt-8">
          Complete the licence information using your Community Care and Assisted Living Act Licence.
        </v-card-subtitle>

        <v-container>
          <v-row>
            <v-col>
              <v-text-field
                v-model.number="fundingModel.maxLicensesCapacity"
                :disabled="isLocked"
                type="number"
                min="0"
                variant="outlined"
                required
                :rules="[...rules.required, rules.wholeNumber]"
                label="Maximum Licensed Capacity"
                @wheel="$event.target.blur()"
                @update:model-value="convertBlankNumberToNull(fundingModel, 'maxLicensesCapacity')"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-text-field
                v-model.number="fundingModel.maxGroupChildCareUnder36"
                :disabled="isLocked"
                type="number"
                min="0"
                variant="outlined"
                required
                :rules="[...rules.required, groupValueRuleMaxGroupChildCareUnder36(), rules.wholeNumber]"
                label="Maximum Number for Group Child Care (under 36 months)"
                @wheel="$event.target.blur()"
                @update:model-value="convertBlankNumberToNull(fundingModel, 'maxGroupChildCareUnder36')"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-text-field
                v-model.number="fundingModel.maxGroupChildCare36"
                :disabled="isLocked"
                type="number"
                min="0"
                variant="outlined"
                required
                :rules="[...rules.required, groupValueRuleMaxGroupChildCare36(), rules.wholeNumber]"
                label="Maximum Number for Group Child Care (30 months to School Age)"
                @wheel="$event.target.blur()"
                @update:model-value="convertBlankNumberToNull(fundingModel, 'maxGroupChildCare36')"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model.number="fundingModel.maxPreschool"
                :disabled="isLocked"
                type="number"
                min="0"
                variant="outlined"
                required
                :rules="[...rules.required, groupValueRuleMaxPreschool(), rules.wholeNumber]"
                label="Maximum Number for Preschool"
                @wheel="$event.target.blur()"
                @update:model-value="convertBlankNumberToNull(fundingModel, 'maxPreschool')"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model.number="fundingModel.maxGroupChildCareSchool"
                :disabled="isLocked"
                type="number"
                min="0"
                variant="outlined"
                required
                :rules="[...rules.required, groupValueRuleMaxGroupChildCareSchool(), rules.wholeNumber]"
                label="Maximum Number for Group Child Care (School Age / School Age Care on School Grounds)"
                @wheel="$event.target.blur()"
                @update:model-value="convertBlankNumberToNull(fundingModel, 'maxGroupChildCareSchool')"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model.number="fundingModel.maxGroupChildCareMultiAge"
                :disabled="isLocked"
                type="number"
                min="0"
                variant="outlined"
                required
                :rules="[...rules.required, groupValueRuleMaxGroupChildCareMultiAge(), rules.wholeNumber]"
                label="Maximum Multi-Age Child Care"
                @wheel="$event.target.blur()"
                @update:model-value="convertBlankNumberToNull(fundingModel, 'maxGroupChildCareMultiAge')"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card>

      <v-card v-if="fundingModel.maxPreschool > 0" class="cc-top-level-card" width="1200">
        <v-card-title>Preschool</v-card-title>
        <v-card-subtitle>Please indicate how many preschool sessions your facility offers per day</v-card-subtitle>

        <v-container>
          <v-row>
            <v-col>
              <v-text-field
                v-model.number="fundingModel.monday"
                :disabled="isLocked"
                type="number"
                variant="outlined"
                required
                :rules="[...rules.required, rules.wholeNumber]"
                label="Monday"
                @wheel="$event.target.blur()"
                @update:model-value="convertBlankNumberToNull(fundingModel, 'monday')"
              />
            </v-col>
            <v-col>
              <v-text-field
                v-model.number="fundingModel.tusday"
                :disabled="isLocked"
                type="number"
                variant="outlined"
                required
                :rules="[...rules.required, rules.wholeNumber]"
                label="Tuesday"
                @wheel="$event.target.blur()"
                @update:model-value="convertBlankNumberToNull(fundingModel, 'tusday')"
              />
            </v-col>
            <v-col>
              <v-text-field
                v-model.number="fundingModel.wednesday"
                :disabled="isLocked"
                type="number"
                variant="outlined"
                required
                :rules="[...rules.required, rules.wholeNumber]"
                label="Wednesday"
                @wheel="$event.target.blur()"
                @update:model-value="convertBlankNumberToNull(fundingModel, 'wednesday')"
              />
            </v-col>
            <v-col>
              <v-text-field
                v-model.number="fundingModel.thursday"
                :disabled="isLocked"
                type="number"
                variant="outlined"
                required
                :rules="[...rules.required, rules.wholeNumber]"
                label="Thursday"
                @wheel="$event.target.blur()"
                @update:model-value="convertBlankNumberToNull(fundingModel, 'thursday')"
              />
            </v-col>
            <v-col>
              <v-text-field
                v-model.number="fundingModel.friday"
                :disabled="isLocked"
                type="number"
                variant="outlined"
                required
                :rules="[...rules.required, rules.wholeNumber]"
                label="Friday"
                @wheel="$event.target.blur()"
                @update:model-value="convertBlankNumberToNull(fundingModel, 'friday')"
              />
            </v-col>
            <v-col>
              <v-text-field
                v-model.number="fundingModel.total"
                :readonly="!isLocked"
                :disabled="isLocked"
                type="number"
                variant="outlined"
                :model-value="
                  (fundingModel.total =
                    (fundingModel.monday || 0) +
                    (fundingModel.tusday || 0) +
                    (fundingModel.wednesday || 0) +
                    (fundingModel.thursday || 0) +
                    (fundingModel.friday || 0))
                "
                label="Total"
                @wheel="$event.target.blur()"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card>

      <v-card v-if="fundingModel.maxGroupChildCareSchool > 0" class="cc-top-level-card" width="1200">
        <v-container>
          <v-row>
            <v-col>
              <v-radio-group
                v-model="fundingModel.isSchoolProperty"
                :disabled="isLocked"
                inline
                label="Is the facility located on school property?"
              >
                <v-radio label="Yes" :value="1" />
                <v-radio label="No" :value="0" />
              </v-radio-group>
            </v-col>
          </v-row>
        </v-container>

        <v-card-title v-show="fundingModel.isSchoolProperty">
          Group Child Care (School Age Care on School Grounds)
        </v-card-title>

        <v-card-subtitle v-show="fundingModel.isSchoolProperty">
          Please indicate each service that your facility offers
        </v-card-subtitle>

        <v-container v-show="fundingModel.isSchoolProperty">
          <v-row>
            <v-col>
              <v-checkbox
                v-model="fundingModel.beforeSchool"
                :true-value="1"
                :false-value="0"
                :disabled="isLocked"
                label="Before School"
              />
            </v-col>
            <v-col>
              <v-checkbox
                v-model="fundingModel.afterSchool"
                :true-value="1"
                :false-value="0"
                :disabled="isLocked"
                label="After School"
              />
            </v-col>
            <v-col>
              <v-checkbox
                v-model="fundingModel.beforeKindergarten"
                :true-value="1"
                :false-value="0"
                :disabled="isLocked"
                label="Before Kindergarten"
              />
            </v-col>
            <v-col>
              <v-checkbox
                v-model="fundingModel.afterKindergarten"
                :true-value="1"
                :false-value="0"
                :disabled="isLocked"
                label="After Kindergarten"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card>

      <v-card class="cc-top-level-card" width="1200">
        <v-container>
          <v-row>
            <v-col>
              <v-radio-group
                v-model="fundingModel.isExtendedHours"
                required
                :rules="rules.required"
                :disabled="isLocked"
                inline
                label="Do you regularly offer extended daily hours of child care (before 6 am, after 7 pm or overnight)?"
              >
                <v-radio label="Yes" :value="1" />
                <v-radio label="No" :value="0" />
              </v-radio-group>
            </v-col>
          </v-row>

          <v-row v-show="fundingModel.isExtendedHours">
            <v-col>
              <v-text-field
                v-model.number="fundingModel.maxDaysPerWeekExtended"
                :disabled="isLocked"
                type="number"
                min="0"
                max="7"
                variant="outlined"
                required
                :rules="
                  fundingModel.isExtendedHours ? [...rules.required, rules.min(0), rules.max(7), rules.wholeNumber] : []
                "
                label="Maximum number of days per week you offer extended hours of child care?"
                @wheel="$event.target.blur()"
                @update:model-value="convertBlankNumberToNull(fundingModel, 'maxDaysPerWeekExtended')"
              />
            </v-col>
          </v-row>

          <v-row v-show="fundingModel.isExtendedHours">
            <v-col>
              <v-text-field
                v-model.number="fundingModel.maxWeeksPerYearExtended"
                :disabled="isLocked"
                type="number"
                min="0"
                max="52"
                variant="outlined"
                required
                :rules="
                  fundingModel.isExtendedHours
                    ? [...rules.required, rules.min(0), rules.max(52), rules.wholeNumber]
                    : []
                "
                label="Maximum number of weeks per year you offer extended hours of child care?"
                @wheel="$event.target.blur()"
                @update:model-value="convertBlankNumberToNull(fundingModel, 'maxWeeksPerYearExtended')"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card>

      <v-card class="cc-top-level-card" width="1200">
        <v-card-subtitle>
          Write the maximum <strong>number of spaces</strong> you offer extended hours of child care for each type of
          service
        </v-card-subtitle>
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <v-card-subtitle><strong>4 hours or less</strong> extended child care</v-card-subtitle>
              <v-row class="padded-row">
                <v-text-field
                  v-model.number="fundingModel.extendedChildCareUnder36Months4OrLess"
                  :disabled="isLocked"
                  variant="outlined"
                  type="number"
                  :rules="[...rules.notRequired, rules.wholeNumber]"
                  label="Group Child Care (under 36 months)"
                  @wheel="$event.target.blur()"
                  @update:model-value="convertBlankNumberToNull(fundingModel, 'extendedChildCareUnder36Months4OrLess')"
                />
              </v-row>
              <v-row class="padded-row">
                <v-text-field
                  v-model.number="fundingModel.extendedChildCare36MonthsToSchoolAge4OrLess"
                  :disabled="isLocked"
                  variant="outlined"
                  type="number"
                  :rules="[...rules.notRequired, rules.wholeNumber]"
                  label="Group Child Care (30 months to School Age)"
                  @wheel="$event.target.blur()"
                  @update:model-value="
                    convertBlankNumberToNull(fundingModel, 'extendedChildCare36MonthsToSchoolAge4OrLess')
                  "
                />
              </v-row>
              <v-row class="padded-row">
                <v-text-field
                  v-model.number="fundingModel.extendedChildCareSchoolAge4OrLess"
                  :disabled="isLocked"
                  variant="outlined"
                  type="number"
                  :rules="[...rules.notRequired, rules.wholeNumber]"
                  label="Group Child Care (School Age / School Age Care on School Grounds)"
                  @wheel="$event.target.blur()"
                  @update:model-value="convertBlankNumberToNull(fundingModel, 'extendedChildCareSchoolAge4OrLess')"
                />
              </v-row>
              <v-row class="padded-row">
                <v-text-field
                  v-model.number="fundingModel.multiAgeCare4OrLess"
                  :disabled="isLocked"
                  variant="outlined"
                  type="number"
                  :rules="[...rules.notRequired, rules.wholeNumber]"
                  label="Multi-Age Child Care"
                  @wheel="$event.target.blur()"
                  @update:model-value="convertBlankNumberToNull(fundingModel, 'multiAgeCare4OrLess')"
                />
              </v-row>
            </v-col>
            <v-col cols="12" md="6">
              <v-card-subtitle><strong>More than 4</strong> extended child care</v-card-subtitle>
              <v-row class="padded-row">
                <v-text-field
                  v-model.number="fundingModel.extendedChildCareUnder36Months4OrMore"
                  :disabled="isLocked"
                  variant="outlined"
                  type="number"
                  :rules="[...rules.notRequired, rules.wholeNumber]"
                  label="Group Child Care (under 36 months)"
                  @wheel="$event.target.blur()"
                  @update:model-value="convertBlankNumberToNull(fundingModel, 'extendedChildCareUnder36Months4OrMore')"
                />
              </v-row>
              <v-row class="padded-row">
                <v-text-field
                  v-model.number="fundingModel.extendedChildCare36MonthsToSchoolAge4OrMore"
                  :disabled="isLocked"
                  variant="outlined"
                  type="number"
                  :rules="[...rules.notRequired, rules.wholeNumber]"
                  label="Group Child Care (30 months to School Age)"
                  @wheel="$event.target.blur()"
                  @update:model-value="
                    convertBlankNumberToNull(fundingModel, 'extendedChildCare36MonthsToSchoolAge4OrMore')
                  "
                />
              </v-row>
              <v-row class="padded-row">
                <v-text-field
                  v-model.number="fundingModel.extendedChildCareSchoolAge4OrMore"
                  :disabled="isLocked"
                  variant="outlined"
                  type="number"
                  :rules="[...rules.notRequired, rules.wholeNumber]"
                  label="Group Child Care (School Age/ School Age Care on School Grounds)"
                  @wheel="$event.target.blur()"
                  @update:model-value="convertBlankNumberToNull(fundingModel, 'extendedChildCareSchoolAge4OrMore')"
                />
              </v-row>
              <v-row class="padded-row">
                <v-text-field
                  v-model.number="fundingModel.multiAgeCare4more"
                  :disabled="isLocked"
                  variant="outlined"
                  type="number"
                  :rules="[...rules.notRequired, rules.wholeNumber]"
                  label="Multi-Age Child Care"
                  @wheel="$event.target.blur()"
                  @update:model-value="convertBlankNumberToNull(fundingModel, 'multiAgeCare4more')"
                />
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-row>
  </v-form>
</template>

<script>
import AppTimeInput from '@/components/guiComponents/AppTimeInput.vue';
import fundMixin from '@/mixins/fundMixin.js';
import globalMixin from '@/mixins/globalMixin.js';

export default {
  components: { AppTimeInput },
  mixins: [fundMixin, globalMixin],
  watch: {
    isApplicationFormValidated: {
      handler() {
        this.$refs.form?.validate();
      },
    },
  },
};
</script>

<style scoped>
.padded-row {
  margin: 10px 0;
  padding-top: 10px;
}
</style>
