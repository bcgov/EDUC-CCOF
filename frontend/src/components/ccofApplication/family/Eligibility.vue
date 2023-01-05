<template>
  <v-form ref="form" v-model="model.isFacilityComplete">
    <v-container>
      <v-row justify="space-around">
        <v-card class="cc-top-level-card" width="1200">
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="model.licenseNumber" :rules="rules.required" label="Facility Licence Number" />
              </v-col>
              <v-col cols="12" md="6">
                <v-menu v-model="model.calendarMenu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field outlined required v-model="model.licenseEffectiveDate" :rules="rules.notRequired" label="Effective Date of Current Licence" readonly v-bind="attrs" v-on="on" />
                  </template>
                  <v-date-picker v-model="model.licenseEffectiveDate" @input="model.calendarMenu = false" />
                </v-menu>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <label>Has this facility or you as the applicant ever received funding under the Child Care Operating Funding Program?</label>
                <v-radio-group row v-model="model.hasReceivedFunding">
                  <v-radio label="No" value="no"></v-radio>
                  <v-radio label="Yes" value="yes"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>

            <v-row v-show="model.hasReceivedFunding === 'yes'">
              <v-col>
                <v-text-field outlined required v-model="model.fundingFacility" :rules="model.hasReceivedFunding === 'yes' ? rules.required : []" label="Facility Name" />
              </v-col>
            </v-row>

          </v-container>
        </v-card>
      </v-row>

      <v-row justify="space-around">
        <v-btn color="info" outlined required x-large @click="previous()">Back</v-btn>
        <v-btn color="secondary" outlined x-large @click="next()" :disabled="!model.isFacilityComplete">Next</v-btn>
        <v-btn color="primary" outlined x-large :loading="processing" @click="saveClicked()">Save</v-btn>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>

import alertMixin from '@/mixins/alertMixin';
import facilityMixin from '@/mixins/facilityMixin';
import { ORGANIZATION_PROVIDER_TYPES } from '@/utils/constants';

export default {
  mixins: [alertMixin, facilityMixin],
  data() {
    return {
      providerType: ORGANIZATION_PROVIDER_TYPES.FAMILY
    };
  }
};

</script>
