<!--
* NOTE (vietle-cgi):  
* This file contains **legacy code** from the previous application layout, which was deprecated and replaced as of March 2025.  
* **DO NOT modify this file** to maintain compatibility with submitted PCF application/change request.
*  
* Source: Copied from commit 29a3ecd on Nov 8, 2024 with some changes.
-->
<template>
  <v-form ref="form" v-model="facilityModel.isFacilityComplete">
    <v-row justify="space-around">
      <v-card class="cc-top-level-card mx-12" width="100%">
        <v-card-title class="text-center pb-0"><h3>Facility Information</h3></v-card-title>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field
                v-model="facilityModel.facilityName"
                :disabled="isLocked"
                variant="outlined"
                required
                :rules="rules.required"
                label="Facility Name (as it appears on the Community Care Assisted Living Act Licence)"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="facilityModel.yearBeganOperation"
                :disabled="isLocked"
                variant="outlined"
                required
                :rules="[...rules.required, ...rules.YYYY]"
                label="Year Facility Began Operation (YYYY)"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="facilityModel.facilityAddress"
                :disabled="isLocked"
                variant="outlined"
                required
                :rules="rules.required"
                label="Facility Street Address"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="facilityModel.city"
                :disabled="isLocked"
                variant="outlined"
                required
                :rules="rules.required"
                label="City/Town"
              />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="facilityModel.province" variant="outlined" :disabled="true" label="Province" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="facilityModel.postalCode"
                :disabled="isLocked"
                variant="outlined"
                required
                :rules="[...rules.required, ...rules.postalCode]"
                label="Postal Code"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="facilityModel.contactName"
                :disabled="isLocked"
                variant="outlined"
                required
                :rules="rules.required"
                label="Facility Contact Name"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="facilityModel.position"
                :disabled="isLocked"
                variant="outlined"
                required
                :rules="rules.required"
                label="Position"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="facilityModel.phone"
                :disabled="isLocked"
                variant="outlined"
                required
                :rules="[...rules.required, rules.phone]"
                label="Business Phone"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="facilityModel.email"
                :disabled="isLocked"
                variant="outlined"
                required
                :rules="[...rules.required, ...rules.email]"
                label="Facility Email Address"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="facilityModel.licenseNumber"
                :disabled="isLocked"
                variant="outlined"
                required
                :rules="rules.required"
                label="Facility Licence Number"
              />
            </v-col>
            <v-col cols="12" md="6">
              <AppDateInput
                id="licence-effective-date"
                v-model="facilityModel.licenseEffectiveDate"
                :rules="[...rules.required, rules.MMDDYYYY]"
                :disabled="isLocked"
                :hide-details="isLocked"
                label="Effective Date of Current Licence"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-radio-group
                v-model="facilityModel.hasReceivedFunding"
                :disabled="isLocked"
                :rules="rules.required"
                label="Has this facility or you as the applicant ever received funding under the Child Care Operating Funding Program?"
              >
                <v-radio label="No" value="no" />
                <v-radio label="Yes" value="yes" />
                <v-radio label="Yes, as facility" value="yesFacility" />
              </v-radio-group>
            </v-col>
          </v-row>

          <v-row v-if="facilityModel.hasReceivedFunding === 'yesFacility'">
            <v-col>
              <v-text-field
                v-model="facilityModel.fundingFacility"
                :disabled="isLocked"
                variant="outlined"
                required
                :rules="rules.required"
                label="Facility Name"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-row>
  </v-form>
</template>

<script>
import AppDateInput from '@/components/guiComponents/AppDateInput.vue';
import facilityMixin from '@/mixins/facilityMixin.js';
import { PROVINCES } from '@/utils/constants.js';

export default {
  components: { AppDateInput },
  mixins: [facilityMixin],
  watch: {
    isApplicationFormValidated: {
      handler() {
        this.$refs.form?.validate();
      },
    },
  },
  created() {
    this.facilityModel.province =
      this.facilityModel.province ?? PROVINCES.find((province) => province.value === 'BC')?.value;
  },
};
</script>
