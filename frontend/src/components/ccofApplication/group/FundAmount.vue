<template>
  <v-form ref="form" v-model="model.isCCOFComplete">
    <v-container>
      <v-row justify="space-around">
        <v-card class="cc-top-level-card" width="1200">
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field type="number" outlined required :rules="rules.required" v-model.number="model.maxDaysPerWeek" label="Maximum number of days per week you provide child care" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field type="number" outlined required :rules="rules.required" v-model.number="model.maxWeeksPerYear" label="Maximum of weeks per year you provide child care" />
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-radio-group row v-model="model.hasClosedMonth" label="Are there months when ALL of the programs at this facility are closed for the entire month?">
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
                <v-checkbox v-model="model.closedIn1" label="Jan" />
              </v-col>
              <v-col>
                <v-checkbox v-model="model.closedIn2" label="Feb" />
              </v-col>
              <v-col>
                <v-checkbox v-model="model.closedIn3" label="Mar" />
              </v-col>
              <v-col>
                <v-checkbox v-model="model.closedIn4" label="Apr" />
              </v-col>
              <v-col>
                <v-checkbox v-model="model.closedIn5" label="May" />
              </v-col>
              <v-col>
                <v-checkbox v-model="model.closedIn6" label="Jun" />
              </v-col>
            </v-row>

            <v-row v-show="model.hasClosedMonth === 'yes'">
              <v-col>
                <v-checkbox v-model="model.closedIn7" label="Jul" />
              </v-col>
              <v-col>
                <v-checkbox v-model="model.closedIn8" label="Aug" />
              </v-col>
              <v-col>
                <v-checkbox v-model="model.closedIn9" label="Sep" />
              </v-col>
              <v-col>
                <v-checkbox v-model="model.closedIn10" label="Oct" />
              </v-col>
              <v-col>
                <v-checkbox v-model="model.closedIn11" label="Nov" />
              </v-col>
              <v-col>
                <v-checkbox v-model="model.closedIn12" label="Dec" />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-menu ref="menu1" v-model="model.menu1" :close-on-content-click="false" :nudge-right="40" :return-value.sync="model.hoursFrom" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field readonly outlined required :rules="rules.required" v-model="model.hoursFrom12hr" label="Facility hours of operation From" v-bind="attrs" v-on="on">
                    </v-text-field>
                  </template>
                  <v-time-picker v-if="model.menu1" v-model="model.hoursFrom" full-width @click:minute="$refs.menu1.save(model.hoursFrom); model.hoursFrom12hr = formatTime(model.hoursFrom)" :allowed-minutes="allowedStep" />
                </v-menu>
              </v-col>
              <v-col cols="12" md="6">
                <v-menu ref="menu2" v-model="model.menu2" :close-on-content-click="false" :nudge-right="40" :return-value.sync="model.hoursTo" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field readonly outlined required :rules="rules.required" v-model="model.hoursTo12hr" label="Facility hours of operation To" v-bind="attrs" v-on="on">
                    </v-text-field>
                  </template>
                  <v-time-picker v-if="model.menu2" v-model="model.hoursTo" full-width @click:minute="$refs.menu2.save(model.hoursTo); model.hoursTo12hr = formatTime(model.hoursTo)" :allowed-minutes="allowedStep" />
                </v-menu>
              </v-col>
            </v-row>
          </v-container>
        </v-card>

        <v-card class="cc-top-level-card" width="1200">
          <v-card-subtitle>Complete the licence information using your Community Care and Assisted Living Act Licence.</v-card-subtitle>

          <v-container>
            <v-row>
              <v-col>
                <v-text-field type="number" outlined required :rules="rules.required" v-model.number="model.maxLicensesCapacity" label="Maximum Licensed Capacity" />
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-text-field type="number" outlined required :rules="rules.required" v-model.number="model.maxGroupChildCareUnder36" label="Maximum Number for Group Child Care (under 36 months)" />
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-text-field type="number" outlined required :rules="rules.required" v-model.number="model.maxGroupChildCare36" label="Maximum Number for Group Child Care (36 months to School Age)" />
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-text-field type="number" outlined required :rules="rules.required" v-model.number="model.maxPreschool" label="Maximum Number for Preschool" />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field type="number" outlined required :rules="rules.required" v-model.number="model.maxGroupChildCareSchool" label="Maximum Number for Group Child Care (School Age / School age care on School Grounds)" />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field type="number" outlined required :rules="rules.required" v-model.number="model.maxGroupChildCareMultiAge" label="Maximum Multi-Age Child Care" />
              </v-col>
            </v-row>

          </v-container>
        </v-card>

        <v-card class="cc-top-level-card" width="1200">
          <v-card-title>Preschool</v-card-title>

          <v-container>
            <v-row>
              <v-col>
                <label>Please indicate how many preschool sessions your facility offers per day</label>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field type="number" outlined required :rules="rules.required" v-model.number="model.monday" label="Monday" />
              </v-col>
              <v-col>
                <v-text-field type="number" outlined required :rules="rules.required" v-model.number="model.tusday" label="Tuesday" />
              </v-col>
              <v-col>
                <v-text-field type="number" outlined required :rules="rules.required" v-model.number="model.wednesday" label="Wednesday" />
              </v-col>
              <v-col>
                <v-text-field type="number" outlined required :rules="rules.required" v-model.number="model.thursday" label="Thursday" />
              </v-col>
              <v-col>
                <v-text-field type="number" outlined required :rules="rules.required" v-model.number="model.friday" label="Friday" />
              </v-col>
              <v-col>
                <v-text-field readonly type="number" outlined  v-bind:value="(model.monday || 0) + (model.tusday || 0) + (model.wednesday || 0) + (model.thursday || 0) + (model.friday || 0)" label="Total" />
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-radio-group row v-model="model.isSchoolProperty" label="Is the facility located on school property?">
                  <v-radio label="Yes" value="yes" />
                  <v-radio label="No" value="no" />
                </v-radio-group>
              </v-col>
            </v-row>
          </v-container>

          <v-card-title v-show="model.isSchoolProperty === 'yes'">Group Child Care (School Age Care on School Grounds)</v-card-title>

          <v-container v-show="model.isSchoolProperty === 'yes'">
            <v-row>
              <v-col>
                <label>Please indicate each service that your facility offers</label>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-checkbox v-model="model.beforeSchool" label="Before School" />
              </v-col>
              <v-col>
                <v-checkbox v-model="model.afterSchool" label="After School" />
              </v-col>
              <v-col>
                <v-checkbox v-model="model.beforeKindergarten" label="Before Kindergarten" />
              </v-col>
              <v-col>
                <v-checkbox v-model="model.afterKindergarten" label="After Kindergarten" />
              </v-col>
            </v-row>
          </v-container>
        </v-card>

        <v-card class="cc-top-level-card" width="1200">
          <v-container>
            <v-row>
              <v-col>
                <v-radio-group row v-model="model.isExtendedHours" label="Do you regularly offer extended daily hours of child care (before 6 am, after 7pm or overnight)?">
                  <v-radio label="Yes" value="yes" />
                  <v-radio label="No" value="no" />
                </v-radio-group>
              </v-col>
            </v-row>

            <v-row v-show="model.isExtendedHours === 'yes'">
              <v-col>
                <v-text-field type="number" outlined required :rules="model.isExtendedHours === 'yes' ? rules.required : []" v-model.number="model.maxDaysPerWeekExtended" label="Maximum number of days per week you offer extended hours of child care?" />
              </v-col>
            </v-row>

            <v-row v-show="model.isExtendedHours === 'yes'">
              <v-col>
                <v-text-field type="number" outlined required :rules="model.isExtendedHours === 'yes' ? rules.required : []" v-model.number="model.maxWeeksPerYearExtended" label="Maximum number of weeks per year you offer extended hours of child care?" />
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
                  <v-text-field outlined type="number" v-model.number="model.groupChildCareUnder36Months4OrLess" :rules="rules.notRequired" label="Group Child Care (under 36 months)" />
                </v-row>
                <v-row class="padded-row">
                  <v-text-field outlined type="number" v-model.number="model.groupChildCare36MonthsToSchoolAge4OrLess" :rules="rules.notRequired" label="Group Child Care (36 months to School Age)" />
                </v-row>
                <v-row class="padded-row">
                  <v-text-field outlined type="number" v-model.number="model.groupChildCareSchoolAge4OrLess" :rules="rules.notRequired" label="Group Child Care (School Age / School age care on School Grounds)" />
                </v-row>
                <v-row class="padded-row">
                  <v-text-field outlined type="number" v-model.number="model.multiAgeCare4OrLess" :rules="rules.notRequired" label="Multi-Age Care" />
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-card-subtitle><strong>More than 4</strong> extended child care</v-card-subtitle>
                <v-row class="padded-row">
                  <v-text-field outlined type="number" v-model.number="model.groupChildCareUnder36Months4OrMore" :rules="rules.notRequired" label="Group Child Care (under 36 months)" />
                </v-row>
                <v-row class="padded-row">
                  <v-text-field outlined type="number" v-model.number="model.groupChildCare36MonthsToSchoolAge4OrMore" :rules="rules.notRequired" label="Group Child Care (36 months to School Age)" />
                </v-row>
                <v-row class="padded-row">
                  <v-text-field outlined type="number" v-model.number="model.groupChildCareSchoolAge4OrMore" :rules="rules.notRequired" label="Group Child Care (School Age/ School age care on School Grounds)" />
                </v-row>
                <v-row class="padded-row">
                  <v-text-field outlined type="number" v-model.number="model.multiAgeCare4more" :rules="rules.notRequired" label="Multi-Age Care" />
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-row>

      <v-row justify="space-around">
        <v-btn color="info" outlined x-large :loading="processing" @click="previous()">Back</v-btn>
        <v-btn color="secondary" outlined x-large :loading="processing" :disabled="!model.isCCOFComplete" @click="next()">Next</v-btn>
        <v-btn color="primary" outlined x-large :loading="processing" @click="save(true)">Save</v-btn>
      </v-row>

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
import { ORGANIZATION_PROVIDER_TYPES } from '@/utils/constants';

export default {
  mixins: [fundMixing],
  data() {
    return {
      providerType: ORGANIZATION_PROVIDER_TYPES.GROUP
    };
  }
};

</script>
