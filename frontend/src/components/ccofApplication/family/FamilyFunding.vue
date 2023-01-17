<template>
  <v-form ref="form" v-model="model.isCCOFComplete" :class="loading ? 'ccof-skeleton-loader' : ''">
    <v-container>
      <v-row justify="space-around">

        <v-card class="cc-top-level-card" width="1200">
          <v-container>
            <v-row>
              <v-col>
                <v-radio-group :disabled="isLocked" v-model="model.familyLicenseType" label="License type">
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
                <v-text-field :disabled="isLocked" type="number" min="0" max="7" outlined required :rules="[...rules.required, rules.min(0), rules.max(7)]" v-model.number="model.maxDaysPerWeek" label="Maximum number of days per week you provide child care" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field :disabled="isLocked" type="number" min="0" max="52" outlined required :rules="[...rules.required, rules.min(0), rules.max(52)]" v-model.number="model.maxWeeksPerYear" label="Maximum of weeks per year you provide child care" />
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

            <v-row>
              <v-col cols="12" md="6">
                <v-menu v-if="!isLocked" ref="menu1" v-model="model.menu1" :close-on-content-click="false" :nudge-right="40" :return-value.sync="model.hoursFrom" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field readonly outlined required :rules="rules.required" v-model="model.hoursFrom12hr" label="Facility hours of operation From" v-bind="attrs" v-on="on" />
                  </template>
                  <v-time-picker v-if="model.menu1" v-model="model.hoursFrom" full-width @click:minute="$refs.menu1.save(model.hoursFrom); model.hoursFrom12hr = formatTime(model.hoursFrom)" :allowed-minutes="allowedStep" />
                </v-menu>

                <v-text-field v-if="isLocked" disabled outlined required v-model="model.hoursFrom12hr" label="Facility hours of operation From" />
              </v-col>

              <v-col cols="12" md="6">
                <v-menu v-if="!isLocked" ref="menu2" v-model="model.menu2" :close-on-content-click="false" :nudge-right="40" :return-value.sync="model.hoursTo" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field readonly outlined required :rules="rules.required" v-model="model.hoursTo12hr" label="Facility hours of operation To" v-bind="attrs" v-on="on" />
                  </template>
                  <v-time-picker v-if="model.menu2" v-model="model.hoursTo" full-width @click:minute="$refs.menu2.save(model.hoursTo); model.hoursTo12hr = formatTime(model.hoursTo)" :allowed-minutes="allowedStep" />

                  <v-text-field v-if="isLocked" disabled outlined required v-model="model.hoursTo12hr" label="Facility hours of operation To" />
                </v-menu>
              </v-col>
            </v-row>
          </v-container>
        </v-card>

        <v-card class="cc-top-level-card" width="1200">
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field :disabled="isLocked" type="number" outlined required :rules="rules.required" v-model.number="model.maxSpaces" label="Maximum number of child care spaces you offer" />
                <label>Note: DO NOT include any children living in your home, under the age of 12.</label>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field :disabled="isLocked" type="number" outlined required :rules="rules.required" v-model.number="model.maxLicensesCapacity" label="Maximum licensed capacity" />
                <label>(as indicated on your Community care and assisted Living Act License)</label>
              </v-col>
            </v-row>
          </v-container>
        </v-card>

        <v-card class="cc-top-level-card" width="1200">
          <v-container>
            <v-row>
              <v-col>
                <v-radio-group :disabled="isLocked" row v-model="model.isExtendedHours" label="Do you regularly offer extended daily hours of child care (before 6 am, after 7pm or overnight)?">
                  <v-radio label="Yes" value="yes" />
                  <v-radio label="No" value="no" />
                </v-radio-group>
              </v-col>
            </v-row>

            <v-row v-show="model.isExtendedHours === 'yes'">
              <v-col>
                <v-text-field :disabled="isLocked" type="number" outlined required :rules="model.isExtendedHours === 'yes' ? rules.required : []" v-model.number="model.maxCapacityExtended" label="Maximum number of spaces you offer extended hours of child care?" />
              </v-col>
            </v-row>

            <v-row v-show="model.isExtendedHours === 'yes'">
              <v-col>
                <v-text-field :disabled="isLocked" type="number" min="0" max="7" outlined required :rules="model.isExtendedHours === 'yes' ? [...rules.required, rules.min(0), rules.max(7)] : []" v-model.number="model.maxDaysPerWeekExtended" label="Maximum number of days per week you offer extended hours of child care?" />
              </v-col>
            </v-row>

            <v-row v-show="model.isExtendedHours === 'yes'">
              <v-col>
                <v-text-field :disabled="isLocked" type="number" min="0" max="52" outlined required :rules="model.isExtendedHours === 'yes' ? [...rules.required, rules.min(0), rules.max(52)] : []" v-model.number="model.maxWeeksPerYearExtended" label="Maximum number of weeks per year you offer extended hours of child care?" />
              </v-col>
            </v-row>

          </v-container>
        </v-card>

      </v-row>

      <v-row justify="space-around">
        <v-btn color="info" outlined x-large :loading="processing" @click="previous()">Back</v-btn>
        <v-btn color="secondary" outlined x-large :disabled="!model.isCCOFComplete" :loading="processing" @click="next()">Next</v-btn>
        <v-btn :disabled="isLocked" color="primary" outlined x-large :loading="processing" @click="save(true)">Save</v-btn>
      </v-row>

    </v-container>
  </v-form>
</template>

<script>

import fundMixing from '@/mixins/fundMixing';
import { ORGANIZATION_PROVIDER_TYPES } from '@/utils/constants';

export default {
  mixins: [fundMixing],
  data() {
    return {
      providerType: ORGANIZATION_PROVIDER_TYPES.FAMILY
    };
  }
};

</script>
