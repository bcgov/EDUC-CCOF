<template>
  <v-form ref="form" v-model="fundingModel.isCCOFComplete">
    <v-container>
      <v-skeleton-loader :loading="isApplicationProcessing" type="table-tbody" class="mb-12">
        <v-container fluid class="pa-0">
          <v-row justify="space-around">
            <v-card class="cc-top-level-card" width="1200">
              <v-container>
                <v-row>
                  <v-col>
                    <div v-show="isApplicationProcessing" style="height: 175px">
                      <v-skeleton-loader class="mx-auto" max-width="300" type="text@3" />
                    </div>

                    <v-radio-group
                      v-show="!isApplicationProcessing"
                      v-model="fundingModel.familyLicenseType"
                      :disabled="isLocked"
                      required
                      :rules="rules.required"
                      label="Licence type"
                    >
                      <v-radio label="Family child care" value="7" />
                      <v-radio label="In-Home Multi-Age Child Care" value="6" />
                      <v-radio label="Multi-Age Care" value="5" />
                    </v-radio-group>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>

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
                  <v-col>
                    <v-radio-group
                      v-model="fundingModel.hasClosedMonth"
                      :disabled="isLocked"
                      :rules="rules.required"
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
                    <label>If YES, check all the applicable months:</label>
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
              </v-container>
            </v-card>

            <v-card class="cc-top-level-card" width="1200">
              <v-container>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.number="fundingModel.maxSpaces"
                      :disabled="isLocked"
                      type="number"
                      min="0"
                      :max="fundingModel.maxLicensesCapacity"
                      variant="outlined"
                      required
                      :rules="[
                        ...rules.required,
                        rules.min(0),
                        rules.wholeNumber,
                        rules.max(fundingModel.maxLicensesCapacity),
                      ]"
                      label="Maximum number of child care spaces you offer"
                      @wheel="$event.target.blur()"
                      @update:model-value="convertBlankNumberToNull(fundingModel, 'maxSpaces')"
                    />
                    <label>Note: DO NOT include any children living in your home, under the age of 12.</label>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.number="fundingModel.maxLicensesCapacity"
                      :disabled="isLocked"
                      type="number"
                      min="0"
                      variant="outlined"
                      required
                      :rules="[...rules.required, rules.wholeNumber, rules.min(0)]"
                      label="Maximum licensed capacity"
                      @wheel="$event.target.blur()"
                      @update:model-value="convertBlankNumberToNull(fundingModel, 'maxLicensesCapacity')"
                      @change="$refs.form?.validate()"
                    />
                    <label>(as indicated on your Community care and assisted Living Act Licence)</label>
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

                <template v-if="fundingModel.isExtendedHours">
                  <v-text-field
                    v-model.number="fundingModel.maxCapacityExtended"
                    :disabled="isLocked"
                    type="number"
                    variant="outlined"
                    required
                    :rules="[...rules.required, rules.wholeNumber]"
                    label="Maximum number of spaces you offer extended hours of child care?"
                    @wheel="$event.target.blur()"
                    @update:model-value="convertBlankNumberToNull(fundingModel, 'maxCapacityExtended')"
                  />

                  <v-text-field
                    v-model.number="fundingModel.maxDaysPerWeekExtended"
                    :disabled="isLocked"
                    type="number"
                    min="0"
                    max="7"
                    variant="outlined"
                    required
                    :rules="[...rules.required, rules.min(0), rules.max(7), rules.wholeNumber]"
                    label="Maximum number of days per week you offer extended hours of child care?"
                    class="my-4"
                    @wheel="$event.target.blur()"
                    @update:model-value="convertBlankNumberToNull(fundingModel, 'maxDaysPerWeekExtended')"
                  />

                  <v-text-field
                    v-model.number="fundingModel.maxWeeksPerYearExtended"
                    :disabled="isLocked"
                    type="number"
                    min="0"
                    max="52"
                    variant="outlined"
                    required
                    :rules="[...rules.required, rules.min(0), rules.max(52), rules.wholeNumber]"
                    label="Maximum number of weeks per year you offer extended hours of child care?"
                    @wheel="$event.target.blur()"
                    @update:model-value="convertBlankNumberToNull(fundingModel, 'maxWeeksPerYearExtended')"
                  />
                </template>
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
                        v-model.number="fundingModel.extendedChildCareUnder36Months4OrLess"
                        :disabled="isLocked"
                        variant="outlined"
                        type="number"
                        :rules="[...rules.notRequired, rules.wholeNumber]"
                        label="Family Child Care (under 36 months)"
                        @wheel="$event.target.blur()"
                        @update:model-value="
                          convertBlankNumberToNull(fundingModel, 'extendedChildCareUnder36Months4OrLess')
                        "
                      />
                    </v-row>
                    <v-row class="padded-row">
                      <v-text-field
                        v-model.number="fundingModel.extendedChildCare36MonthsToSchoolAge4OrLess"
                        :disabled="isLocked"
                        variant="outlined"
                        type="number"
                        :rules="[...rules.notRequired, rules.wholeNumber]"
                        label="Family Child Care (36 months to School Age)"
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
                        label="Family Child Care (School Age / School Age Care on School Grounds)"
                        @wheel="$event.target.blur()"
                        @update:model-value="
                          convertBlankNumberToNull(fundingModel, 'extendedChildCareSchoolAge4OrLess')
                        "
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
                        label="Family Child Care (under 36 months)"
                        @wheel="$event.target.blur()"
                        @update:model-value="
                          convertBlankNumberToNull(fundingModel, 'extendedChildCareUnder36Months4OrMore')
                        "
                      />
                    </v-row>
                    <v-row class="padded-row">
                      <v-text-field
                        v-model.number="fundingModel.extendedChildCare36MonthsToSchoolAge4OrMore"
                        :disabled="isLocked"
                        variant="outlined"
                        type="number"
                        :rules="[...rules.notRequired, rules.wholeNumber]"
                        label="Family Child Care (36 months to School Age)"
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
                        label="Family Child Care (School Age/ School Age Care on School Grounds)"
                        @wheel="$event.target.blur()"
                        @update:model-value="
                          convertBlankNumberToNull(fundingModel, 'extendedChildCareSchoolAge4OrMore')
                        "
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
        </v-container>
      </v-skeleton-loader>
      <NavButton
        :is-next-displayed="true"
        :is-save-displayed="true"
        :is-save-disabled="isLocked"
        :is-next-disabled="!isFormComplete"
        :is-processing="isApplicationProcessing"
        @previous="previous"
        @next="next"
        @validate-form="validateApplicationForm"
        @save="save(true)"
      />
    </v-container>
  </v-form>
</template>

<script>
import AppTimeInput from '@/components/guiComponents/AppTimeInput.vue';

import fundMixin from '@/mixins/fundMixin.js';
import globalMixin from '@/mixins/globalMixin.js';

export default {
  components: { AppTimeInput },
  mixins: [fundMixin, globalMixin],
  async beforeRouteLeave(_to, _from, next) {
    await this.save(false);
    next();
  },
  watch: {
    isApplicationFormValidated: {
      handler() {
        this.$refs.form?.validate();
      },
    },
  },
  async created() {
    try {
      if (!this.$route.params.urlGuid) return;
      this.setIsApplicationProcessing(true);
      await this.loadFunding(this.$route.params.urlGuid);
    } catch (error) {
      console.error(`Failed to get Licence and Service details with error - ${error}`);
      this.setFailureAlert('An error occurred while loading Licence and Service details. Please try again later.');
    } finally {
      this.setIsApplicationProcessing(false);
    }
  },
};
</script>
<style scoped>
.padded-row {
  margin: 10px 0;
  padding-top: 10px;
}
</style>
