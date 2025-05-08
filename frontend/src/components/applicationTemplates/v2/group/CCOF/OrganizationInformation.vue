<template>
  <v-form ref="form" v-model="organizationModel.isOrganizationComplete">
    <v-card class="cc-top-level-card pa-2">
      <v-card-title class="text-center pb-0">
        <h3>Organization Information</h3>
      </v-card-title>
      <v-container>
        <v-card v-if="isSomeChangeRequestActive && isLocked" elevation="4" class="mt-4 mb-8">
          <v-card-title class="rounded-t-lg py-3 noticeAlert">
            <v-icon size="x-large" class="py-1 px-3 noticeAlertIcon"> mdi-alert-octagon </v-icon>
            You have a change request in progress.
          </v-card-title>
          <p class="pa-4">
            We will complete the assessment of your Program Confirmation Form once your change has been processed.
          </p>
        </v-card>
        <div class="ma-4 mb-2">Type of Organization</div>
        <v-radio-group v-model="organizationModel.organizationType" :disabled="isLocked" :rules="rules.required">
          <v-radio v-for="item in organizationTypeList" :key="item.id" :label="item.name" :value="item.id" />
        </v-radio-group>

        <template v-if="organizationModel.organizationType">
          <v-divider class="my-2 mb-8" />
          <v-row v-if="!isPartnership" no-gutters>
            <div class="pt-4">
              <AppTooltip
                tooltip-content="Legal Name as it appears as the licensee on your Community Care & Assisted Living Act Licence"
              />
            </div>
            <v-text-field
              v-model="organizationModel.legalName"
              :disabled="isLocked"
              variant="outlined"
              :rules="rules.required"
              label="Legal Name (first, middle and last) or Organization (as it appears in BC Registries and Online Services)"
              class="ml-4"
            />
          </v-row>

          <v-row v-if="hasIncorporationNumber" no-gutters class="pt-4">
            <div class="pt-4">
              <AppTooltip
                tooltip-content="If you're unsure of your Incorporation Number (IN), please search for it on the  <a href='https://www.bcregistry.gov.bc.ca/' target='_blank' rel='noopener noreferrer' style='color: white; text-decoration: underline;'>BC Registry</a>"
              />
            </div>
            <v-text-field
              v-model="organizationModel.incNumber"
              :disabled="isLocked"
              variant="outlined"
              :rules="rules.required"
              label="Incorporation Number (as it appears in BC Registries and Online Services)"
              class="ml-4"
            />
          </v-row>

          <div class="pl-lg-11">
            <v-divider class="my-4" />
            <div class="mb-0">Organization Mailing Address</div>
          </div>
          <AppAddressForm
            :disabled="isLocked"
            :manual-entry="organizationModel.isOrgMailingAddressEnteredManually"
            :address="organizationModel.address1"
            :city="organizationModel.city1"
            :province="organizationModel.province1"
            :postal-code="organizationModel.postalCode1"
            :has-left-padding="true"
            address-label="Mailing Address"
            @update="updateMailingAddress"
          />

          <div class="pl-lg-11">
            <v-divider />
            <v-radio-group
              id="same-mailing-address-button"
              v-model="organizationModel.isSameAsMailing"
              :disabled="isLocked"
              :rules="rules.required"
              inline
              label="Organization Street Address same as Mailing Address"
              class="application-label mt-6"
              @update:model-value="resetStreetAddress"
            >
              <v-radio label="Yes" :value="true" />
              <v-radio label="No" :value="false" />
            </v-radio-group>
          </div>
          <AppAddressForm
            v-if="organizationModel.isSameAsMailing === false"
            :disabled="isLocked"
            :manual-entry="organizationModel.isOrgStreetAddressEnteredManually"
            :address="organizationModel.address2"
            :city="organizationModel.city2"
            :province="organizationModel.province2"
            :postal-code="organizationModel.postalCode2"
            :has-left-padding="true"
            address-label="Street Address"
            @update="updateStreetAddress"
          />
          <div class="pl-lg-11">
            <v-divider />
            <div class="my-4">Organization's Authorized Signing Authority Information</div>
          </div>

          <v-row v-if="!isSoleProprietorship">
            <v-col cols="12" md="6">
              <v-row no-gutters>
                <div class="pt-4">
                  <AppTooltip tooltip-content="The full name of the signing authority" />
                </div>
                <v-text-field
                  v-model="organizationModel.contactName"
                  :disabled="isLocked"
                  variant="outlined"
                  required
                  :rules="rules.required"
                  label="Organization Contact Name"
                  class="ml-4"
                />
              </v-row>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="organizationModel.position"
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
            <v-col cols="12" md="6" class="pl-lg-14">
              <v-text-field
                v-model="organizationModel.phone"
                :disabled="isLocked"
                variant="outlined"
                required
                :rules="[...rules.required, rules.phone]"
                label="Phone Number of the Organization's Authorized Signing Authority"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="userInfo.userName" disabled variant="outlined" label="Business BCeID" />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6" class="pl-lg-14">
              <v-text-field
                v-model="organizationModel.email"
                :disabled="isLocked"
                variant="outlined"
                required
                type="email"
                :rules="[...rules.required, ...rules.email]"
                label="Email Address of the Organization's Authorized Signing Authority"
              />
            </v-col>
          </v-row>
        </template>
      </v-container>
    </v-card>
  </v-form>
</template>

<script>
import { mapState } from 'pinia';
import { useReportChangesStore } from '@/store/reportChanges.js';
import organizationMixin from '@/mixins/organizationMixin.js';
import { isAnyChangeRequestActive } from '@/utils/common.js';

export default {
  mixins: [organizationMixin],
  computed: {
    ...mapState(useReportChangesStore, ['changeRequestStore']),
    isSomeChangeRequestActive() {
      //Status of : "Submitted" "Action Required";
      return isAnyChangeRequestActive(this.changeRequestStore);
    },
  },
  watch: {
    isApplicationFormValidated: {
      handler() {
        this.$refs.form?.validate();
      },
    },
  },
};
</script>
<style scoped>
:deep(.v-icon) {
  opacity: 1 !important;
}
</style>
