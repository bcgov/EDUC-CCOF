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
          </v-row>

          <v-divider class="mb-2" />

          <v-radio-group
            id="same-org-address-button"
            v-model="facilityModel.isFacilityAddressSameAsOrgStreetAddress"
            :disabled="isLocked"
            :rules="rules.required"
            inline
            label="Is the Facility Street Address the same as the Organization Street Address?"
            class="application-label mt-6"
            @update:model-value="resetFacilityAddress"
          >
            <v-radio label="Yes" :value="true" />
            <v-radio label="No" :value="false" />
          </v-radio-group>
        </div>
        <AppAddressForm
          v-if="showFacilityAddressForm"
          :disabled="isLocked"
          :manual-entry="facilityModel.isFacilityAddressEnteredManually"
          :address="facilityModel.facilityAddress"
          :city="facilityModel.city"
          :province="facilityModel.province"
          :postal-code="facilityModel.postalCode"
          :has-bc-province-validation="true"
          :has-left-padding="true"
          address-label="Facility Street Address"
          @update="updateStreetAddress"
        />

        <div class="pl-lg-11">
          <v-divider class="my-2" />

          <v-radio-group
            id="same-org-signing-authority-contact-button"
            v-model="facilityModel.isFacilityContactSameAsOrgContact"
            :disabled="isLocked"
            :rules="rules.required"
            inline
            label="Is the Facility Contact the same as the Organization's Authorized Signing Authority Information?"
            class="application-label mt-6"
            @update:model-value="resetFacilityContact"
          >
            <v-radio label="Yes" :value="true" />
            <v-radio label="No" :value="false" />
          </v-radio-group>
          <template v-if="showFacilityContactForm">
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
                  placeholder="Position (e.g., owner, manager)"
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
                  label="Facility Phone Number"
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
          </template>

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
                label="Select a Health Authority"
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
import { isEmpty } from 'lodash';
import AppDateInput from '@/components/guiComponents/AppDateInput.vue';
import facilityMixin from '@/mixins/facilityMixin.js';

export default {
  components: { AppDateInput },
  mixins: [facilityMixin],
  computed: {
    showFacilityAddressForm() {
      return this.facilityModel.isFacilityAddressSameAsOrgStreetAddress === false;
    },
    showFacilityContactForm() {
      return this.facilityModel.isFacilityContactSameAsOrgContact === false;
    },
  },
  watch: {
    isApplicationFormValidated: {
      handler() {
        this.$refs.form?.validate();
      },
    },
  },
  methods: {
    updateStreetAddress(updatedModel) {
      if (isEmpty(updatedModel)) return;
      this.facilityModel.isFacilityAddressEnteredManually = updatedModel.manualEntry;
      this.facilityModel.facilityAddress = updatedModel.address;
      this.facilityModel.city = updatedModel.city;
      this.facilityModel.province = updatedModel.province;
      this.facilityModel.postalCode = updatedModel.postalCode;
    },
  },
};
</script>
