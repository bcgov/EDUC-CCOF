<template>
  <v-form ref="form" v-model="model.isCCOFComplete" :class="loading ? 'ccof-skeleton-loader' : ''">
    <v-container>
      <v-row justify="space-around">
        <v-card class="cc-top-level-card" width="1200">
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field :disabled="isLocked" type="number" @wheel="$event.target.blur()" min="0" max="7" outlined required :rules="[...rules.required, rules.min(0), rules.max(7)]"
                  v-model.number="model.maxDaysPerWeek" @input="convertBlankNumberToNull(model,'maxDaysPerWeek')" label="Maximum number of days per week you provide child care" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field :disabled="isLocked" type="number" @wheel="$event.target.blur()" min="0" max="52" outlined required :rules="[...rules.required, rules.min(0), rules.max(52)]"
                  v-model.number="model.maxWeeksPerYear" @input="convertBlankNumberToNull(model,'maxWeeksPerYear')" label="Maximum number of weeks per year you provide child care" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-menu v-if="!isLocked" ref="menu1" v-model="model.menu1" :close-on-content-click="false" :nudge-right="40" :return-value.sync="model.hoursFrom" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field readonly outlined required :rules="rules.required" v-model="model.hoursFrom12hr" label="Facility hours of operation from" v-bind="attrs" v-on="on" />
                  </template>
                  <v-time-picker v-if="model.menu1" v-model="model.hoursFrom" full-width @click:minute="$refs.menu1.save(model.hoursFrom); model.hoursFrom12hr = formatTime(model.hoursFrom)" :allowed-minutes="allowedStep" />
                </v-menu>

                <v-text-field v-if="isLocked" disabled outlined required v-model="model.hoursFrom12hr" label="Facility hours of operation from" />
              </v-col>
              <v-col cols="12" md="6">
                <v-menu v-if="!isLocked" ref="menu2" v-model="model.menu2" :close-on-content-click="false" :nudge-right="40" :return-value.sync="model.hoursTo" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field readonly outlined required :rules="rules.required" v-model="model.hoursTo12hr" label="Facility hours of operation to" v-bind="attrs" v-on="on" />
                  </template>
                  <v-time-picker v-if="model.menu2" v-model="model.hoursTo" full-width @click:minute="$refs.menu2.save(model.hoursTo); model.hoursTo12hr = formatTime(model.hoursTo)" :allowed-minutes="allowedStep" />
                </v-menu>

                <v-text-field v-if="isLocked" disabled outlined required v-model="model.hoursTo12hr" label="Facility hours of operation to" />
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-radio-group :disabled="isLocked" row v-model="model.hasClosedMonth" label="Are there months when ALL of the programs at this facility are closed for the entire month?">
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
                <v-checkbox :disabled="isLocked" v-model="model.closedIn1" label="Jan" />
              </v-col>
              <v-col>
                <v-checkbox :disabled="isLocked" v-model="model.closedIn2" label="Feb" />
              </v-col>
              <v-col>
                <v-checkbox :disabled="isLocked" v-model="model.closedIn3" label="Mar" />
              </v-col>
              <v-col>
                <v-checkbox :disabled="isLocked" v-model="model.closedIn4" label="Apr" />
              </v-col>
              <v-col>
                <v-checkbox :disabled="isLocked" v-model="model.closedIn5" label="May" />
              </v-col>
              <v-col>
                <v-checkbox :disabled="isLocked" v-model="model.closedIn6" label="Jun" />
              </v-col>
            </v-row>

            <v-row v-show="model.hasClosedMonth === 'yes'">
              <v-col>
                <v-checkbox :disabled="isLocked" v-model="model.closedIn7" label="Jul" />
              </v-col>
              <v-col>
                <v-checkbox :disabled="isLocked" v-model="model.closedIn8" label="Aug" />
              </v-col>
              <v-col>
                <v-checkbox :disabled="isLocked" v-model="model.closedIn9" label="Sep" />
              </v-col>
              <v-col>
                <v-checkbox :disabled="isLocked" v-model="model.closedIn10" label="Oct" />
              </v-col>
              <v-col>
                <v-checkbox :disabled="isLocked" v-model="model.closedIn11" label="Nov" />
              </v-col>
              <v-col>
                <v-checkbox :disabled="isLocked" v-model="model.closedIn12" label="Dec" />
              </v-col>
            </v-row>
          </v-container>
        </v-card>

        <v-card class="cc-top-level-card" width="1200">
          <v-card-subtitle>Complete the licence information using your Community Care and Assisted Living Act Licence.</v-card-subtitle>

          <v-container>
            <v-row>
              <v-col>
                <v-text-field :disabled="isLocked" type="number" @wheel="$event.target.blur()" min="0" outlined required :rules="rules.required"
                  v-model.number="model.maxLicensesCapacity" @input="convertBlankNumberToNull(model,'maxLicensesCapacity')" label="Maximum Licensed Capacity" />
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-text-field :disabled="isLocked" type="number" @wheel="$event.target.blur()" min="0" outlined required :rules="[...rules.required,groupValueRuleMaxGroupChildCareUnder36()]"
                  v-model.number="model.maxGroupChildCareUnder36" @input="convertBlankNumberToNull(model,'maxGroupChildCareUnder36')" label="Maximum Number for Group Child Care (under 36 months)" />
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-text-field :disabled="isLocked" type="number" @wheel="$event.target.blur()" min="0" outlined required :rules="[...rules.required,groupValueRuleMaxGroupChildCare36()]"
                  v-model.number="model.maxGroupChildCare36" @input="convertBlankNumberToNull(model,'maxGroupChildCare36')" label="Maximum Number for Group Child Care (30 months to School Age)" />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field :disabled="isLocked" type="number" @wheel="$event.target.blur()" min="0" outlined required :rules="[...rules.required,groupValueRuleMaxPreschool()]"
                  v-model.number="model.maxPreschool" @input="convertBlankNumberToNull(model,'maxPreschool')" label="Maximum Number for Preschool" />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field :disabled="isLocked" type="number" @wheel="$event.target.blur()" min="0" outlined required :rules="[...rules.required,groupValueRuleMaxGroupChildCareSchool()]"
                  v-model.number="model.maxGroupChildCareSchool" @input="convertBlankNumberToNull(model,'maxGroupChildCareSchool')" label="Maximum Number for Group Child Care (School Age / School Age Care on School Grounds)" />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field :disabled="isLocked" type="number" @wheel="$event.target.blur()" min="0" outlined required :rules="[...rules.required,groupValueRuleMaxGroupChildCareMultiAge()]"
                  v-model.number="model.maxGroupChildCareMultiAge" @input="convertBlankNumberToNull(model,'maxGroupChildCareMultiAge')" label="Maximum Multi-Age Child Care" />
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
                  <v-text-field :disabled="isLocked" type="number" @wheel="$event.target.blur()" outlined required :rules="rules.required"
                    v-model.number="model.monday" @input="convertBlankNumberToNull(model,'monday')" label="Monday" />
                </v-col>
                <v-col>
                  <v-text-field :disabled="isLocked" type="number" @wheel="$event.target.blur()" outlined required :rules="rules.required"
                    v-model.number="model.tusday" @input="convertBlankNumberToNull(model,'tusday')" label="Tuesday" />
                </v-col>
                <v-col>
                  <v-text-field :disabled="isLocked" type="number" @wheel="$event.target.blur()" outlined required :rules="rules.required"
                    v-model.number="model.wednesday" @input="convertBlankNumberToNull(model,'wednesday')" label="Wednesday" />
                </v-col>
                <v-col>
                  <v-text-field :disabled="isLocked" type="number" @wheel="$event.target.blur()" outlined required :rules="rules.required"
                    v-model.number="model.thursday" @input="convertBlankNumberToNull(model,'thursday')" label="Thursday" />
                </v-col>
                <v-col>
                  <v-text-field :disabled="isLocked" type="number" @wheel="$event.target.blur()" outlined required :rules="rules.required"
                    v-model.number="model.friday" @input="convertBlankNumberToNull(model,'friday')" label="Friday" />
                </v-col>
                <v-col>
                  <v-text-field :readonly="!isLocked" :disabled="isLocked" type="number" @wheel="$event.target.blur()" outlined v-bind:value="(model.monday || 0) + (model.tusday || 0) + (model.wednesday || 0) + (model.thursday || 0) + (model.friday || 0)" label="Total" />
                </v-col>
              </v-row>
            </v-container>
        </v-card>

        <v-card v-if="model.maxGroupChildCareSchool > 0" class="cc-top-level-card" width="1200">
          <v-container>


            <v-row>
            <v-col>
              <v-radio-group :disabled="isLocked" row v-model="model.isSchoolProperty" :rules="rules.required" label="Is the facility located on school property?">
                <v-radio label="Yes" value="yes" />
                <v-radio label="No" value="no" />
              </v-radio-group>
            </v-col>
          </v-row>
        </v-container>

          <v-card-title v-show="model.isSchoolProperty === 'yes'">Group Child Care (School Age Care on School Grounds)</v-card-title>

          <v-card-subtitle v-show="model.isSchoolProperty === 'yes'">Please indicate each service that your facility offers</v-card-subtitle>

          <v-container v-show="model.isSchoolProperty === 'yes'">
            <v-row>
              <v-col>
                <v-checkbox :disabled="isLocked" v-model="model.beforeSchool" label="Before School" />
              </v-col>
              <v-col>
                <v-checkbox :disabled="isLocked" v-model="model.afterSchool" label="After School" />
              </v-col>
              <v-col>
                <v-checkbox :disabled="isLocked" v-model="model.beforeKindergarten" label="Before Kindergarten" />
              </v-col>
              <v-col>
                <v-checkbox :disabled="isLocked" v-model="model.afterKindergarten" label="After Kindergarten" />
              </v-col>
            </v-row>
          </v-container>
        </v-card>

        <v-card class="cc-top-level-card" width="1200">
          <v-container>
            <v-row>
              <v-col>
                <v-radio-group required :rules="rules.required" :disabled="isLocked" row v-model="model.isExtendedHours" label="Do you regularly offer extended daily hours of child care (before 6 am, after 7 pm or overnight)?">
                  <v-radio label="Yes" value="yes" />
                  <v-radio label="No" value="no" />
                </v-radio-group>
              </v-col>
            </v-row>

            <v-row v-show="model.isExtendedHours === 'yes'">
              <v-col>
                <v-text-field :disabled="isLocked" type="number" @wheel="$event.target.blur()" min="0" max="7" outlined required :rules="model.isExtendedHours === 'yes' ? [...rules.required, rules.min(0), rules.max(7)] : []"
                  v-model.number="model.maxDaysPerWeekExtended" @input="convertBlankNumberToNull(model,'maxDaysPerWeekExtended')" label="Maximum number of days per week you offer extended hours of child care?" />
              </v-col>
            </v-row>

            <v-row v-show="model.isExtendedHours === 'yes'">
              <v-col>
                <v-text-field :disabled="isLocked" type="number" @wheel="$event.target.blur()" min="0" max="52" outlined required :rules="model.isExtendedHours === 'yes' ? [...rules.required, rules.min(0), rules.max(52)] : []"
                  v-model.number="model.maxWeeksPerYearExtended" @input="convertBlankNumberToNull(model,'maxWeeksPerYearExtended')" label="Maximum number of weeks per year you offer extended hours of child care?" />
              </v-col>
            </v-row>

          </v-container>
        </v-card>

        <v-card class="cc-top-level-card" width="1200">
          <v-card-subtitle>Write the maximum <strong>number of spaces</strong> you offer extended hours of child care
            for
            each type of service</v-card-subtitle>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-card-subtitle><strong>4 hours or less</strong> extended child care</v-card-subtitle>
                <v-row class="padded-row">
                  <v-text-field :disabled="isLocked" outlined type="number" @wheel="$event.target.blur()"
                    v-model.number="model.extendedChildCareUnder36Months4OrLess" @input="convertBlankNumberToNull(model,'extendedChildCareUnder36Months4OrLess')" :rules="rules.required" label="Group Child Care (under 36 months)" />
                </v-row>
                <v-row class="padded-row">
                  <v-text-field :disabled="isLocked" outlined type="number" @wheel="$event.target.blur()"
                    v-model.number="model.extendedChildCare36MonthsToSchoolAge4OrLess" @input="convertBlankNumberToNull(model,'extendedChildCare36MonthsToSchoolAge4OrLess')" :rules="rules.required" label="Group Child Care (30 months to School Age)" />
                </v-row>
                <v-row class="padded-row">
                  <v-text-field :disabled="isLocked" outlined type="number" @wheel="$event.target.blur()"
                    v-model.number="model.extendedChildCareSchoolAge4OrLess" @input="convertBlankNumberToNull(model,'extendedChildCareSchoolAge4OrLess')" :rules="rules.required" label="Group Child Care (School Age / School Age Care on School Grounds)" />
                </v-row>
                <v-row class="padded-row">
                  <v-text-field :disabled="isLocked" outlined type="number" @wheel="$event.target.blur()"
                    v-model.number="model.multiAgeCare4OrLess" @input="convertBlankNumberToNull(model,'multiAgeCare4OrLess')" :rules="rules.required" label="Multi-Age Child Care" />
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-card-subtitle><strong>More than 4</strong> extended child care</v-card-subtitle>
                <v-row class="padded-row">
                  <v-text-field :disabled="isLocked" outlined type="number" @wheel="$event.target.blur()"
                    v-model.number="model.extendedChildCareUnder36Months4OrMore" @input="convertBlankNumberToNull(model,'extendedChildCareUnder36Months4OrMore')" :rules="rules.required" label="Group Child Care (under 36 months)" />
                </v-row>
                <v-row class="padded-row">
                  <v-text-field :disabled="isLocked" outlined type="number" @wheel="$event.target.blur()"
                    v-model.number="model.extendedChildCare36MonthsToSchoolAge4OrMore" @input="convertBlankNumberToNull(model,'extendedChildCare36MonthsToSchoolAge4OrMore')" :rules="rules.required" label="Group Child Care (30 months to School Age)" />
                </v-row>
                <v-row class="padded-row">
                  <v-text-field :disabled="isLocked" outlined type="number" @wheel="$event.target.blur()"
                    v-model.number="model.extendedChildCareSchoolAge4OrMore" @input="convertBlankNumberToNull(model,'extendedChildCareSchoolAge4OrMore')" :rules="rules.required" label="Group Child Care (School Age/ School Age Care on School Grounds)" />
                </v-row>
                <v-row class="padded-row">
                  <v-text-field :disabled="isLocked" outlined type="number" @wheel="$event.target.blur()"
                    v-model.number="model.multiAgeCare4more" @input="convertBlankNumberToNull(model,'multiAgeCare4more')" :rules="rules.required" label="Multi-Age Child Care" />
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-row>

      <NavButton :isNextDisplayed="true" :isSaveDisplayed="true"
        :isSaveDisabled="isLocked" :isNextDisabled="!model.isCCOFComplete" :isProcessing="processing"
        @previous="previous" @next="next" @validateForm="validateForm()" @save="save(true)"></NavButton>
    </v-container>
  </v-form>
</template>

<style>
.padded-row {
  margin: 10px 0;
}
</style>

<script>

import fundMixing from '@/mixins/fundMixing';
import globalMixin from '@/mixins/globalMixin';
import { ORGANIZATION_PROVIDER_TYPES } from '@/utils/constants';

export default {
  mixins: [fundMixing, globalMixin],
  data() {
    return {
      providerType: ORGANIZATION_PROVIDER_TYPES.GROUP
    };
  }
};

</script>
