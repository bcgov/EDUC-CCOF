<template>
  <v-form ref="form" v-model="facilityModel.isFacilityComplete">
    <v-card class="cc-top-level-card pa-2">
      <v-card-title class="text-center text-wrap pb-0">
        <h3>Information to Determine Eligibility</h3>
      </v-card-title>
      <v-container class="pa-8">
        <v-text-field
          v-model="facilityModel.facilityName"
          :disabled="isLocked"
          variant="outlined"
          :rules="rules.required"
          label="Facility Name"
        />
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="facilityModel.licenseNumber"
              :disabled="isLocked"
              variant="outlined"
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
        <v-radio-group
          v-model="facilityModel.hasReceivedFunding"
          :disabled="isLocked"
          inline
          :rules="rules.required"
          label="Has this facility or you as the applicant ever received funding under the Child Care Operating Funding Program?"
        >
          <v-radio label="No" :value="FACILITY_HAS_RECEIVE_FUNDING_VALUES.NO" />
          <v-radio label="Yes" :value="FACILITY_HAS_RECEIVE_FUNDING_VALUES.YES" />
        </v-radio-group>

        <v-text-field
          v-if="facilityModel.hasReceivedFunding === FACILITY_HAS_RECEIVE_FUNDING_VALUES.YES"
          v-model="facilityModel.fundingFacility"
          :disabled="isLocked"
          variant="outlined"
          :rules="facilityModel.hasReceivedFunding === FACILITY_HAS_RECEIVE_FUNDING_VALUES.YES ? rules.required : []"
          label="Facility Name"
        />
      </v-container>
    </v-card>
  </v-form>
</template>

<script>
import AppDateInput from '@/components/guiComponents/AppDateInput.vue';
import facilityMixin from '@/mixins/facilityMixin.js';

export default {
  name: 'FacilityEligibility',
  components: { AppDateInput },
  mixins: [facilityMixin],
  watch: {
    isApplicationFormValidated: {
      handler() {
        this.$refs.form?.validate();
      },
    },
  },
};
</script>
