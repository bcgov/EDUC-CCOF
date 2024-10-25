<template>
  <v-form ref="form" v-model="model.isCCOFComplete">
    <v-container>
      <v-skeleton-loader :loading="loading" type="table-tbody" class="mb-12">
        <v-container fluid class="pa-0">
          <v-row justify="space-around">
            <v-card class="cc-top-level-card" width="1200">
              <v-container>
                <v-row>
                  <v-col>
                    <div v-show="loading" style="height: 175px">
                      <v-skeleton-loader class="mx-auto" max-width="300" type="text@3" />
                    </div>

                    <v-radio-group
                      v-show="!loading"
                      v-model="model.familyLicenseType"
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
                  <v-col>
                    <v-radio-group
                      v-model="model.hasClosedMonth"
                      :disabled="isLocked"
                      :rules="rules.required"
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

                <v-row v-show="model.hasClosedMonth === 'yes'">
                  <v-col>
                    <v-checkbox v-model="model.closedIn1" :disabled="isLocked" label="Jan" />
                  </v-col>
                  <v-col>
                    <v-checkbox v-model="model.closedIn2" :disabled="isLocked" label="Feb" />
                  </v-col>
                  <v-col>
                    <v-checkbox v-model="model.closedIn3" :disabled="isLocked" label="Mar" />
                  </v-col>
                  <v-col>
                    <v-checkbox v-model="model.closedIn4" :disabled="isLocked" label="Apr" />
                  </v-col>
                  <v-col>
                    <v-checkbox v-model="model.closedIn5" :disabled="isLocked" label="May" />
                  </v-col>
                  <v-col>
                    <v-checkbox v-model="model.closedIn6" :disabled="isLocked" label="Jun" />
                  </v-col>
                </v-row>

                <v-row v-show="model.hasClosedMonth === 'yes'">
                  <v-col>
                    <v-checkbox v-model="model.closedIn7" :disabled="isLocked" label="Jul" />
                  </v-col>
                  <v-col>
                    <v-checkbox v-model="model.closedIn8" :disabled="isLocked" label="Aug" />
                  </v-col>
                  <v-col>
                    <v-checkbox v-model="model.closedIn9" :disabled="isLocked" label="Sep" />
                  </v-col>
                  <v-col>
                    <v-checkbox v-model="model.closedIn10" :disabled="isLocked" label="Oct" />
                  </v-col>
                  <v-col>
                    <v-checkbox v-model="model.closedIn11" :disabled="isLocked" label="Nov" />
                  </v-col>
                  <v-col>
                    <v-checkbox v-model="model.closedIn12" :disabled="isLocked" label="Dec" />
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
              </v-container>
            </v-card>

            <v-card class="cc-top-level-card" width="1200">
              <v-container>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.number="model.maxSpaces"
                      :disabled="isLocked"
                      type="number"
                      min="0"
                      :max="model.maxLicensesCapacity"
                      variant="outlined"
                      required
                      :rules="[
                        ...rules.required,
                        rules.min(0),
                        rules.wholeNumber,
                        rules.max(model.maxLicensesCapacity),
                      ]"
                      label="Maximum number of child care spaces you offer"
                      @wheel="$event.target.blur()"
                      @update:model-value="convertBlankNumberToNull(model, 'maxSpaces')"
                    />
                    <label>Note: DO NOT include any children living in your home, under the age of 12.</label>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.number="model.maxLicensesCapacity"
                      :disabled="isLocked"
                      type="number"
                      min="0"
                      variant="outlined"
                      required
                      :rules="[...rules.required, rules.wholeNumber, rules.min(0)]"
                      label="Maximum licensed capacity"
                      @wheel="$event.target.blur()"
                      @update:model-value="convertBlankNumberToNull(model, 'maxLicensesCapacity')"
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
                      v-model.number="model.maxCapacityExtended"
                      :disabled="isLocked"
                      type="number"
                      variant="outlined"
                      required
                      :rules="model.isExtendedHours === 'yes' ? [...rules.required, rules.wholeNumber] : []"
                      label="Maximum number of spaces you offer extended hours of child care?"
                      @wheel="$event.target.blur()"
                      @update:model-value="convertBlankNumberToNull(model, 'maxCapacityExtended')"
                    />
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
                        label="Family Child Care (under 36 months)"
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
                        label="Family Child Care (36 months to School Age)"
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
                        label="Family Child Care (School Age / School Age Care on School Grounds)"
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
                        label="Family Child Care (under 36 months)"
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
                        label="Family Child Care (36 months to School Age)"
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
                        label="Family Child Care (School Age/ School Age Care on School Grounds)"
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
        </v-container>
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
import { ORGANIZATION_PROVIDER_TYPES } from '@/utils/constants.js';

export default {
  components: { AppTimeInput },
  mixins: [fundMixing, globalMixin],
  async beforeRouteLeave(_to, _from, next) {
    await this.save(false);
    next();
  },
  data() {
    return {
      providerType: ORGANIZATION_PROVIDER_TYPES.FAMILY,
    };
  },
};
</script>
<style scoped>
.padded-row {
  margin: 10px 0;
  padding-top: 10px;
}
</style>
