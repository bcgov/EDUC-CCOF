<template>
  <v-form ref="form" v-model="model.isCCOFComplete">
    <v-container>
      <v-row justify="space-around">

        <v-card class="cc-top-level-card" width="1200">
          <v-container>
            <v-row>
              <v-col>
                <label>Liscence type</label>
                <v-radio-group row v-model="model.licenseType">
                  <v-radio label="Family child care" value="familyChildCare" />
                  <v-radio label="In-Home Multi-Age Child Care" value="inHomeCare" />
                  <v-radio label="Multi-Age Care" value="multuAge" />
                </v-radio-group>
              </v-col>
            </v-row>
          </v-container>
        </v-card>

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
                <label>Are there months when ALL of the programs at this facility are
                  closed for the entire month?</label>
                <v-radio-group row v-model="model.hasClosedMonth">
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
                <v-checkbox v-model="model.closedMonths" value="1" label="Jan" />
              </v-col>
              <v-col>
                <v-checkbox v-model="model.closedMonths" value="2" label="Feb" />
              </v-col>
              <v-col>
                <v-checkbox v-model="model.closedMonths" value="3" label="Mar" />
              </v-col>
              <v-col>
                <v-checkbox v-model="model.closedMonths" value="4" label="Apr" />
              </v-col>
              <v-col>
                <v-checkbox v-model="model.closedMonths" value="5" label="May" />
              </v-col>
              <v-col>
                <v-checkbox v-model="model.closedMonths" value="6" label="Jun" />
              </v-col>
            </v-row>

            <v-row v-show="model.hasClosedMonth === 'yes'">
              <v-col>
                <v-checkbox v-model="model.closedMonths" value="7" label="Jul" />
              </v-col>
              <v-col>
                <v-checkbox v-model="model.closedMonths" value="8" label="Aug" />
              </v-col>
              <v-col>
                <v-checkbox v-model="model.closedMonths" value="9" label="Sep" />
              </v-col>
              <v-col>
                <v-checkbox v-model="model.closedMonths" value="10" label="Oct" />
              </v-col>
              <v-col>
                <v-checkbox v-model="model.closedMonths" value="11" label="Nov" />
              </v-col>
              <v-col>
                <v-checkbox v-model="model.closedMonths" value="12" label="Dec" />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-menu ref="menu1" v-model="model.menu1" :close-on-content-click="false" :nudge-right="40" :return-value.sync="model.hoursFrom" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field outlined required :rules="rules.required" v-model="model.hoursFrom12hr" label="Facility hours of operation From" readonly v-bind="attrs" v-on="on" />
                  </template>
                  <v-time-picker v-if="model.menu1" v-model="model.hoursFrom" full-width @click:minute="$refs.menu1.save(model.hoursFrom); model.hoursFrom12hr = formatTime(model.hoursFrom)" :allowed-minutes="allowedStep" />
                </v-menu>
              </v-col>

              <v-col cols="12" md="6">
                <v-menu ref="menu2" v-model="model.menu2" :close-on-content-click="false" :nudge-right="40" :return-value.sync="model.hoursTo" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field outlined required :rules="rules.required" v-model="model.hoursTo12hr" label="Facility hours of operation To" readonly v-bind="attrs" v-on="on" />
                  </template>
                  <v-time-picker v-if="model.menu2" v-model="model.hoursTo" full-width @click:minute="$refs.menu2.save(model.hoursTo); model.hoursTo12hr = formatTime(model.hoursTo)" :allowed-minutes="allowedStep" />
                </v-menu>
              </v-col>
            </v-row>
          </v-container>
        </v-card>

        <v-card class="cc-top-level-card" width="1200">
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field type="number" outlined required :rules="rules.required" v-model.number="model.maxSpaces" label="Maximum number of child care spaces you offer" />
                <label>Note: DO NOT include any children living in your home, under the age of 12.</label>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field type="number" outlined required :rules="rules.required" v-model.number="model.maxLicensesCapacity" label="Maximum licensed capacity" />
                <label>(as indicated on your Community care and assisted Living Act License)</label>
              </v-col>
            </v-row>
          </v-container>
        </v-card>

        <v-card class="cc-top-level-card" width="1200">
          <v-container>
            <v-row>
              <v-col>
                <label>Do you <strong>regularly offer</strong> extended daily hours of child care <strong>(before 6 am, after 7pm or overnight)</strong>?</label>
                <v-radio-group row v-model="model.isExtendedHours">
                  <v-radio label="Yes" value="yes" />
                  <v-radio label="No" value="no" />
                </v-radio-group>
              </v-col>
            </v-row>

            <v-row v-show="model.isExtendedHours === 'yes'">
              <v-col>
                <v-text-field type="number" outlined required :rules="model.isExtendedHours === 'yes' ? rules.required : []" v-model.number="model.maxCapacityExtended" label="Maximum number of spaces you offer extended hours of child care?" />
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

      </v-row>

      <v-row justify="space-around">
        <v-btn color="info" outlined x-large @click="previous()">Back</v-btn>
        <v-btn color="secondary" outlined x-large :disabled="!model.isCCOFComplete" @click="next()">Next</v-btn>
        <v-btn color="primary" outlined x-large :loading="processing" @click="save()">Save</v-btn>
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
