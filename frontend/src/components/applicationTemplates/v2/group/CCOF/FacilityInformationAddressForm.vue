<template>
  <v-container fluid class="pa-0">
    <div class="pl-lg-11">
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

    <div v-if="facilityModel.isFacilityAddressSameAsOrgStreetAddress" class="pl-lg-11">
      <v-row>
        <v-col>
          <v-text-field
            :model-value="organizationModel.address2"
            readonly
            variant="outlined"
            :rules="rules.required"
            label="Facility Street Address"
            class="disabled-field"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            :model-value="organizationModel.city2"
            readonly
            variant="outlined"
            :rules="rules.required"
            label="City/Town"
            class="disabled-field"
          />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            :model-value="organizationModel.province2"
            :rules="[...rules.required, rules.equalTo('BC', 'Facilities must be located within BC')]"
            readonly
            label="Province"
            variant="outlined"
            class="disabled-field"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            :model-value="organizationModel.postalCode2"
            readonly
            variant="outlined"
            :rules="[...rules.required, ...rules.postalCode]"
            label="Postal Code"
            class="disabled-field"
          />
        </v-col>
      </v-row>
    </div>

    <AppAddressForm
      v-else
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
  </v-container>
</template>

<script>
import { isEmpty } from 'lodash';
import facilityMixin from '@/mixins/facilityMixin.js';

export default {
  mixins: [facilityMixin],
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

<style scoped>
.disabled-field {
  pointer-events: none;
}
</style>
