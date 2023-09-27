<template>
  <v-form ref="form" v-model="model.isFacilityComplete" :class="loading ? 'ccof-skeleton-loader' : ''">
    <v-container>
      <span>
        <v-row justify="space-around">
          <v-card class="cc-top-level-card" width="1200">
            <v-card-title class="justify-center pb-0"><h3>Facility Information</h3></v-card-title>
            <v-container>
              <v-row>
                <v-col>
                  <v-text-field :disabled="isLocked" outlined required v-model="model.facilityName" :rules="rules.required" label="Facility Name (as it appears on the Community Care Assisted Living Act Licence)" />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field :disabled="isLocked" outlined required v-model="model.yearBeganOperation" :rules="[...rules.required, ...rules.YYYY]" label="Year Facility Began Operation (YYYY)" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field :disabled="isLocked" outlined required v-model="model.facilityAddress" :rules="rules.required" label="Facility Street Address" />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field :disabled="isLocked" outlined required v-model="model.city" :rules="rules.required" label="City/Town" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field :disabled="isLocked" outlined required v-model="model.postalCode" :rules="[...rules.required, ...rules.postalCode]" label="Postal Code" />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field :disabled="isLocked" outlined required v-model="model.contactName" :rules="rules.required" label="Facility Contact Name" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field :disabled="isLocked" outlined required v-model="model.position" :rules="rules.required" label="Position" />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field :disabled="isLocked" outlined required v-model="model.phone" :rules="[...rules.required, rules.phone]" label="Business Phone" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field :disabled="isLocked" outlined required v-model="model.email" :rules="[...rules.required, ...rules.email]" label="Facility Email Address" />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field :disabled="isLocked" outlined required v-model="model.licenseNumber" :rules="rules.required" label="Facility Licence Number" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-menu v-if="!isLocked" v-model="model.calendarMenu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field readonly outlined required v-model="model.licenseEffectiveDate" :rules="rules.notRequired" label="Effective Date of Current Licence" v-bind="attrs" v-on="on" />
                    </template>
                    <v-date-picker v-model="model.licenseEffectiveDate" @input="model.calendarMenu = false" />
                  </v-menu>

                  <v-text-field v-if="isLocked" disabled outlined required v-model="model.licenseEffectiveDate" label="Effective Date of Current Licence" />
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <v-radio-group :disabled="isLocked" v-model="model.hasReceivedFunding" :rules="rules.required" label="Has this facility or you as the applicant ever received funding under the Child Care Operating Funding Program?">
                    <v-radio label="No" value="no"></v-radio>
                    <v-radio label="Yes" value="yes"></v-radio>
                    <v-radio label="Yes, as facility" value="yesFacility"></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>

              <v-row v-if="model.hasReceivedFunding === 'yesFacility'">
                <v-col>
                  <v-text-field :disabled="isLocked" outlined required v-model="model.fundingFacility" :rules="rules.required" label="Facility Name" />
                </v-col>
              </v-row>

            </v-container>
          </v-card>
        </v-row>
      </span>
      <NavButton :isNextDisplayed="true" :isSaveDisplayed="true"
        :isSaveDisabled="isLocked" :isNextDisabled="!model.isFacilityComplete" :isProcessing="processing"
        @previous="previous" @next="next" @validateForm="validateForm()" @save="saveClicked()"></NavButton>
    </v-container>
  </v-form>
</template>

<script>

import facilityMixin from '@/mixins/facilityMixin';
import { ORGANIZATION_PROVIDER_TYPES } from '@/utils/constants';

export default {
  mixins: [facilityMixin],
  data() {
    return {
      providerType: ORGANIZATION_PROVIDER_TYPES.GROUP
    };
  }
};

</script>
