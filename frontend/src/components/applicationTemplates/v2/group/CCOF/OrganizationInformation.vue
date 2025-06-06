<template>
  <v-skeleton-loader
    v-if="isApplicationProcessing"
    :loading="isApplicationProcessing"
    type="table-tbody"
    class="mb-12"
  />
  <v-form v-else ref="form" v-model="organizationModel.isOrganizationComplete">
    <v-card class="cc-top-level-card pa-2">
      <v-card-title class="text-center pb-0">
        <h3>Organization Information</h3>
      </v-card-title>
      <v-container fluid>
        <v-card v-if="isSomeChangeRequestActive && isLocked" elevation="4" class="mt-4 mb-8">
          <v-card-title class="rounded-t-lg py-3 noticeAlert">
            <v-icon size="x-large" class="py-1 px-3 noticeAlertIcon"> mdi-alert-octagon </v-icon>
            You have a change request in progress.
          </v-card-title>
          <p class="pa-4">
            We will complete the assessment of your Program Confirmation Form once your change has been processed.
          </p>
        </v-card>
        <div class="mx-8">
          <p class="ma-2">Type of Organization</p>
          <v-radio-group v-model="organizationModel.organizationType" :disabled="isLocked" :rules="rules.required">
            <v-radio v-for="item in organizationTypes" :key="item.id" :label="item.name" :value="item.id" />
          </v-radio-group>
        </div>

        <template v-if="organizationModel.organizationType">
          <template v-if="isPartnership">
            <v-row v-for="index in numberOfPartners" :key="index" no-gutters>
              <v-col class="py-6" style="max-width: 100px">Partner {{ index }}</v-col>
              <v-col cols="12" lg="3" class="px-lg-2 py-2">
                <v-text-field
                  v-model.trim="organizationModel[`partner${index}FirstName`]"
                  :disabled="isLocked"
                  variant="outlined"
                  :rules="rules.required"
                  label="First Name"
                />
              </v-col>
              <v-col cols="12" lg="4" class="px-lg-2 py-2">
                <v-text-field
                  v-model.trim="organizationModel[`partner${index}MiddleName`]"
                  :disabled="isLocked"
                  variant="outlined"
                  label="Middle Name (if applicable)"
                />
              </v-col>
              <v-col cols="12" lg class="px-lg-2 py-2">
                <v-text-field
                  v-model.trim="organizationModel[`partner${index}LastName`]"
                  :disabled="isLocked"
                  variant="outlined"
                  :rules="rules.required"
                  label="Last Name"
                />
              </v-col>
              <v-col v-if="numberOfPartners > 2" align="right" style="max-width: 50px">
                <v-btn
                  v-if="!isLocked && index > 2"
                  variant="text"
                  icon="mdi-trash-can-outline"
                  class="mb-6 my-lg-3"
                  @click="removePartner(index)"
                />
              </v-col>
            </v-row>
            <v-row v-if="numberOfPartners < MAX_NUMBER_OF_PARTNERS" class="justify-right">
              <AppButton
                id="add-partner-button"
                :disabled="isLocked"
                :primary="false"
                size="medium"
                @click="numberOfPartners++"
              >
                Add Additional Partner
              </AppButton>
            </v-row>
            <v-text-field
              :model-value="partnershipLegalOrganizationName"
              :disabled="true"
              variant="outlined"
              :label="legalNameLabel"
              hide-details
              class="pl-lg-11 mt-8"
            />
            <v-row no-gutters class="pt-8">
              <div class="pt-4">
                <AppTooltip tooltip-content="If a registered partnership, the registered business name" />
              </div>
              <v-text-field
                v-model="organizationModel.doingBusinessAs"
                :disabled="isLocked"
                variant="outlined"
                :rules="rules.required"
                label="Doing Business As"
                class="ml-4"
              />
            </v-row>
          </template>

          <template v-if="isSoleProprietorship">
            <v-text-field
              v-model="organizationModel.legalName"
              :disabled="isLocked"
              variant="outlined"
              :rules="rules.required"
              :label="legalNameLabel"
              class="pl-lg-11 mt-4"
            />
            <v-row>
              <v-col cols="12" md="6" class="pl-lg-14">
                <v-text-field
                  v-model="organizationModel.phone"
                  :disabled="isLocked"
                  variant="outlined"
                  required
                  :rules="[...rules.required, rules.phone]"
                  label="Phone Number"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="userInfo.userName" disabled variant="outlined" label="Business BCeID" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6" class="pl-lg-14 pt-0">
                <v-text-field
                  v-model="organizationModel.email"
                  :disabled="isLocked"
                  variant="outlined"
                  required
                  type="email"
                  :rules="[...rules.required, ...rules.email]"
                  label="Email Address"
                />
              </v-col>
            </v-row>
          </template>

          <v-row v-if="!isPartnership && !isSoleProprietorship" no-gutters class="pt-4">
            <div class="pt-4">
              <AppTooltip
                tooltip-content="Legal Name as it appears as the licensee on your Community Care and Assisted Living Act Licence"
              />
            </div>
            <v-text-field
              v-model="organizationModel.legalName"
              :disabled="isLocked"
              variant="outlined"
              :rules="rules.required"
              :label="legalNameLabel"
              class="ml-4"
            />
          </v-row>

          <v-row v-if="hasIncorporationNumber" no-gutters class="pt-4">
            <div class="pt-4">
              <AppTooltip
                tooltip-content="If you're unsure of your Incorporation Number (IN), please search for it on the  <a href='https://www.bcregistry.gov.bc.ca/' target='_blank' rel='noopener noreferrer' style='color: white; text-decoration: underline;'>BC Registries and Online Services</a>."
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

          <template v-if="!isSoleProprietorship">
            <div class="pl-lg-11">
              <v-divider />
              <div class="my-4">Organization's Authorized Signing Authority Information</div>
            </div>
            <v-row>
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
  async created() {
    await this.loadData();
  },
};
</script>
<style scoped>
:deep(.v-icon) {
  opacity: 1 !important;
}
</style>
