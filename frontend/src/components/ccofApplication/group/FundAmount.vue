<template>
  <v-form ref="form" v-model="model.isCCOFComplete">
    <v-container>
      <v-skeleton-loader :loading="loading" type="table-tbody" class="mb-12">
        <v-row justify="space-around">
          <v-card class="cc-top-level-card" width="1200">
            <v-container>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="model.maxDaysPerWeek"
                    :disabled="isLocked"
                    type="number"
                    min="0"
                    max="7"
                    variant="outlined"
                    required
                    :rules="[...rules.required, rules.min(0), rules.max(7), rules.wholeNumber]"
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
                    min="0"
                    max="52"
                    variant="outlined"
                    required
                    :rules="[...rules.required, rules.min(0), rules.max(52), rules.wholeNumber]"
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

          <v-card class="cc-top-level-card" width="1200">
            <v-card-subtitle class="pt-8">
              Complete the licence information using your Community Care and Assisted Living Act Licence.
            </v-card-subtitle>

            <v-container>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model.number="model.maxLicensesCapacity"
                    :disabled="isLocked"
                    type="number"
                    min="0"
                    variant="outlined"
                    required
                    :rules="[...rules.required, rules.wholeNumber]"
                    label="Maximum Licensed Capacity"
                    @wheel="$event.target.blur()"
                    @update:model-value="convertBlankNumberToNull(model, 'maxLicensesCapacity')"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <v-text-field
                    v-model.number="model.maxGroupChildCareUnder36"
                    :disabled="isLocked"
                    type="number"
                    min="0"
                    variant="outlined"
                    required
                    :rules="[...rules.required, groupValueRuleMaxGroupChildCareUnder36(), rules.wholeNumber]"
                    label="Maximum Number for Group Child Care (under 36 months)"
                    @wheel="$event.target.blur()"
                    @update:model-value="convertBlankNumberToNull(model, 'maxGroupChildCareUnder36')"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <v-text-field
                    v-model.number="model.maxGroupChildCare36"
                    :disabled="isLocked"
                    type="number"
                    min="0"
                    variant="outlined"
                    required
                    :rules="[...rules.required, groupValueRuleMaxGroupChildCare36(), rules.wholeNumber]"
                    label="Maximum Number for Group Child Care (30 months to School Age)"
                    @wheel="$event.target.blur()"
                    @update:model-value="convertBlankNumberToNull(model, 'maxGroupChildCare36')"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model.number="model.maxPreschool"
                    :disabled="isLocked"
                    type="number"
                    min="0"
                    variant="outlined"
                    required
                    :rules="[...rules.required, groupValueRuleMaxPreschool(), rules.wholeNumber]"
                    label="Maximum Number for Preschool"
                    @wheel="$event.target.blur()"
                    @update:model-value="convertBlankNumberToNull(model, 'maxPreschool')"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model.number="model.maxGroupChildCareSchool"
                    :disabled="isLocked"
                    type="number"
                    min="0"
                    variant="outlined"
                    required
                    :rules="[...rules.required, groupValueRuleMaxGroupChildCareSchool(), rules.wholeNumber]"
                    label="Maximum Number for Group Child Care (School Age / School Age Care on School Grounds)"
                    @wheel="$event.target.blur()"
                    @update:model-value="convertBlankNumberToNull(model, 'maxGroupChildCareSchool')"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model.number="model.maxGroupChildCareMultiAge"
                    :disabled="isLocked"
                    type="number"
                    min="0"
                    variant="outlined"
                    required
                    :rules="[...rules.required, groupValueRuleMaxGroupChildCareMultiAge(), rules.wholeNumber]"
                    label="Maximum Multi-Age Child Care"
                    @wheel="$event.target.blur()"
                    @update:model-value="convertBlankNumberToNull(model, 'maxGroupChildCareMultiAge')"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card>

          <v-card v-if="model.maxPreschool > 0" class="cc-top-level-card" width="1200">
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
                    required
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
                    required
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
                    required
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
                    required
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
                    required
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

          <v-card class="cc-top-level-card" width="1200">
            <v-container>
              <v-row>
                <v-col>
                  <v-radio-group
                    v-model="model.isExtendedHours"
                    required
                    :rules="rules.required"
                    :disabled="isLocked"
                    inline
                    label="Do you regularly offer extended daily hours of child care (before 6 am, after 7 pm or overnight)?"
                  >
                    <v-radio label="Yes" value="yes" />
                    <v-radio label="No" value="no" />
                  </v-radio-group>
                </v-col>
              </v-row>

              <v-row v-show="model.isExtendedHours === 'yes'">
                <v-col>
                  <v-text-field
                    v-model.number="model.maxDaysPerWeekExtended"
                    :disabled="isLocked"
                    type="number"
                    min="0"
                    max="7"
                    variant="outlined"
                    required
                    :rules="
                      model.isExtendedHours === 'yes'
                        ? [...rules.required, rules.min(0), rules.max(7), rules.wholeNumber]
                        : []
                    "
                    label="Maximum number of days per week you offer extended hours of child care?"
                    @wheel="$event.target.blur()"
                    @update:model-value="convertBlankNumberToNull(model, 'maxDaysPerWeekExtended')"
                  />
                </v-col>
              </v-row>

              <v-row v-show="model.isExtendedHours === 'yes'">
                <v-col>
                  <v-text-field
                    v-model.number="model.maxWeeksPerYearExtended"
                    :disabled="isLocked"
                    type="number"
                    min="0"
                    max="52"
                    variant="outlined"
                    required
                    :rules="
                      model.isExtendedHours === 'yes'
                        ? [...rules.required, rules.min(0), rules.max(52), rules.wholeNumber]
                        : []
                    "
                    label="Maximum number of weeks per year you offer extended hours of child care?"
                    @wheel="$event.target.blur()"
                    @update:model-value="convertBlankNumberToNull(model, 'maxWeeksPerYearExtended')"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card>

          <v-card class="cc-top-level-card" width="1200">
            <v-card-subtitle>
              Write the maximum <strong>number of spaces</strong> you offer extended hours of child care for each type
              of service
            </v-card-subtitle>
            <v-container>
              <v-row>
                <v-col cols="12" md="6">
                  <v-card-subtitle><strong>4 hours or less</strong> extended child care</v-card-subtitle>
                  <v-row class="padded-row">
                    <v-text-field
                      v-model.number="model.extendedChildCareUnder36Months4OrLess"
                      :disabled="isLocked"
                      variant="outlined"
                      type="number"
                      :rules="[...rules.notRequired, rules.wholeNumber]"
                      label="Group Child Care (under 36 months)"
                      @wheel="$event.target.blur()"
                      @update:model-value="convertBlankNumberToNull(model, 'extendedChildCareUnder36Months4OrLess')"
                    />
                  </v-row>
                  <v-row class="padded-row">
                    <v-text-field
                      v-model.number="model.extendedChildCare36MonthsToSchoolAge4OrLess"
                      :disabled="isLocked"
                      variant="outlined"
                      type="number"
                      :rules="[...rules.notRequired, rules.wholeNumber]"
                      label="Group Child Care (30 months to School Age)"
                      @wheel="$event.target.blur()"
                      @update:model-value="
                        convertBlankNumberToNull(model, 'extendedChildCare36MonthsToSchoolAge4OrLess')
                      "
                    />
                  </v-row>
                  <v-row class="padded-row">
                    <v-text-field
                      v-model.number="model.extendedChildCareSchoolAge4OrLess"
                      :disabled="isLocked"
                      variant="outlined"
                      type="number"
                      :rules="[...rules.notRequired, rules.wholeNumber]"
                      label="Group Child Care (School Age / School Age Care on School Grounds)"
                      @wheel="$event.target.blur()"
                      @update:model-value="convertBlankNumberToNull(model, 'extendedChildCareSchoolAge4OrLess')"
                    />
                  </v-row>
                  <v-row class="padded-row">
                    <v-text-field
                      v-model.number="model.multiAgeCare4OrLess"
                      :disabled="isLocked"
                      variant="outlined"
                      type="number"
                      :rules="[...rules.notRequired, rules.wholeNumber]"
                      label="Multi-Age Child Care"
                      @wheel="$event.target.blur()"
                      @update:model-value="convertBlankNumberToNull(model, 'multiAgeCare4OrLess')"
                    />
                  </v-row>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card-subtitle><strong>More than 4</strong> extended child care</v-card-subtitle>
                  <v-row class="padded-row">
                    <v-text-field
                      v-model.number="model.extendedChildCareUnder36Months4OrMore"
                      :disabled="isLocked"
                      variant="outlined"
                      type="number"
                      :rules="[...rules.notRequired, rules.wholeNumber]"
                      label="Group Child Care (under 36 months)"
                      @wheel="$event.target.blur()"
                      @update:model-value="convertBlankNumberToNull(model, 'extendedChildCareUnder36Months4OrMore')"
                    />
                  </v-row>
                  <v-row class="padded-row">
                    <v-text-field
                      v-model.number="model.extendedChildCare36MonthsToSchoolAge4OrMore"
                      :disabled="isLocked"
                      variant="outlined"
                      type="number"
                      :rules="[...rules.notRequired, rules.wholeNumber]"
                      label="Group Child Care (30 months to School Age)"
                      @wheel="$event.target.blur()"
                      @update:model-value="
                        convertBlankNumberToNull(model, 'extendedChildCare36MonthsToSchoolAge4OrMore')
                      "
                    />
                  </v-row>
                  <v-row class="padded-row">
                    <v-text-field
                      v-model.number="model.extendedChildCareSchoolAge4OrMore"
                      :disabled="isLocked"
                      variant="outlined"
                      type="number"
                      :rules="[...rules.notRequired, rules.wholeNumber]"
                      label="Group Child Care (School Age/ School Age Care on School Grounds)"
                      @wheel="$event.target.blur()"
                      @update:model-value="convertBlankNumberToNull(model, 'extendedChildCareSchoolAge4OrMore')"
                    />
                  </v-row>
                  <v-row class="padded-row">
                    <v-text-field
                      v-model.number="model.multiAgeCare4more"
                      :disabled="isLocked"
                      variant="outlined"
                      type="number"
                      :rules="[...rules.notRequired, rules.wholeNumber]"
                      label="Multi-Age Child Care"
                      @wheel="$event.target.blur()"
                      @update:model-value="convertBlankNumberToNull(model, 'multiAgeCare4more')"
                    />
                  </v-row>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-row>
      </v-skeleton-loader>

      <NavButton
        :is-next-displayed="true"
        :is-save-displayed="true"
        :is-save-disabled="isLocked"
        :is-next-disabled="!model.isCCOFComplete"
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

export default {
  components: { AppTimeInput },
  mixins: [fundMixing, globalMixin],
  async beforeRouteLeave(_to, _from, next) {
    await this.save(false);
    next();
  },
};
</script>

<style scoped>
.padded-row {
  margin: 10px 0;
  padding-top: 10px;
}
</style>
