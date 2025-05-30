<template>
  <v-container fluid class="pa-0">
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

    <template v-if="facilityModel.isFacilityContactSameAsOrgContact">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="organizationModel.contactName"
            :rules="rules.required"
            readonly
            variant="outlined"
            label="Facility Contact Name"
            class="disabled-field"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="organizationModel.position"
            :rules="rules.required"
            readonly
            variant="outlined"
            label="Position"
            placeholder="Position (e.g., owner, manager)"
            class="disabled-field"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="organizationModel.phone"
            :rules="[...rules.required, rules.phone]"
            readonly
            variant="outlined"
            label="Facility Phone Number"
            class="disabled-field"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="organizationModel.email"
            :rules="[...rules.required, ...rules.email]"
            readonly
            variant="outlined"
            label="Facility Email Address"
            class="disabled-field"
          />
        </v-col>
      </v-row>
    </template>

    <template v-else>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="facilityModel.contactName"
            :disabled="isLocked"
            variant="outlined"
            :rules="rules.required"
            label="Facility Contact Name"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="facilityModel.position"
            :disabled="isLocked"
            variant="outlined"
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
            :rules="[...rules.required, rules.phone]"
            label="Facility Phone Number"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="facilityModel.email"
            :disabled="isLocked"
            variant="outlined"
            :rules="[...rules.required, ...rules.email]"
            label="Facility Email Address"
          />
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script>
import facilityMixin from '@/mixins/facilityMixin.js';

export default {
  mixins: [facilityMixin],
};
</script>

<style scoped>
.disabled-field {
  pointer-events: none;
}
</style>
