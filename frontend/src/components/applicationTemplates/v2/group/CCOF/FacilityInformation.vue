<template>
  <v-form ref="form" v-model="facilityModel.isFacilityComplete">
    <v-card class="cc-top-level-card pa-2">
      <v-card-title class="text-center pb-0"><h3>Facility Information</h3></v-card-title>
      <v-container>
        <div class="pl-lg-11">
          <v-row>
            <v-col>
              <v-text-field
                v-model="facilityModel.facilityName"
                :disabled="isLocked"
                variant="outlined"
                required
                :rules="rules.required"
                label="Facility Name (as it appears on the Community Care and Assisted Living Act Licence)"
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
          </v-row>

          <v-divider class="mb-2" />
        </div>

        <FacilityInformationAddressForm />

        <div class="pl-lg-11">
          <v-divider class="my-2" />
          <FacilityInformationContactForm />
          <v-divider class="my-2" />
        </div>

        <v-row>
          <v-col cols="12" md="6">
            <v-row no-gutters>
              <div class="pt-4 pr-4">
                <AppTooltip tooltip-content="As this appears on the Community Care and Assisted Living Act Licence" />
              </div>
              <v-text-field
                v-model="facilityModel.licenseNumber"
                :disabled="isLocked"
                variant="outlined"
                required
                :rules="rules.required"
                label="Facility Licence Number"
              />
            </v-row>
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
        <div class="pl-lg-11">
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="facilityModel.healthAuthority"
                :items="healthAuthorities"
                item-title="description"
                item-value="id"
                label="Select Health Authority that Issued Licence"
                :disabled="isLocked"
                :hide-details="isLocked"
                :rules="rules.required"
                variant="outlined"
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
                class="application-label"
              >
                <v-radio label="No" :value="FACILITY_HAS_RECEIVE_FUNDING_VALUES.NO" />
                <v-radio label="Yes" :value="FACILITY_HAS_RECEIVE_FUNDING_VALUES.YES" />
                <v-radio label="Yes, as facility" :value="FACILITY_HAS_RECEIVE_FUNDING_VALUES.YES_FACILITY" />
              </v-radio-group>
            </v-col>
          </v-row>

          <v-row v-if="facilityModel.hasReceivedFunding === FACILITY_HAS_RECEIVE_FUNDING_VALUES.YES_FACILITY">
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
        </div>
      </v-container>
    </v-card>
  </v-form>
</template>

<script>
import FacilityInformationAddressForm from '@/components/applicationTemplates/v2/group/CCOF/FacilityInformationAddressForm.vue';
import FacilityInformationContactForm from '@/components/applicationTemplates/v2/group/CCOF/FacilityInformationContactForm.vue';
import AppDateInput from '@/components/guiComponents/AppDateInput.vue';
import facilityMixin from '@/mixins/facilityMixin.js';

export default {
  components: { AppDateInput, FacilityInformationAddressForm, FacilityInformationContactForm },
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
