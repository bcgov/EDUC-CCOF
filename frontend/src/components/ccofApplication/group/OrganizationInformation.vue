<template>
  <v-form ref="form" v-model="isValidForm">
    <v-skeleton-loader :loading="loading" type="table-tbody" class="mb-12">
      <v-container class="mx-lg-16">
        <v-card class="cc-top-level-card pa-2">
          <v-card-title class="text-center pb-0">
            <h3>Organization Information</h3>
          </v-card-title>
          <v-container>
            <v-row>
              <v-card v-if="isSomeChangeRequestActive() && isLocked" width="100%" class="mx-3 my-10">
                <v-row>
                  <v-col class="py-0">
                    <v-card-title class="py-1 noticeAlert">
                      <span style="float: left">
                        <v-icon size="x-large" class="py-1 px-3 noticeAlertIcon"> mdi-alert-octagon </v-icon>
                      </span>
                      You have a change request in progress.
                    </v-card-title>
                  </v-col>
                </v-row>
                <v-card-text>
                  We will complete the assessment of your Program Confirmation Form once your change has been
                  processed.<br /><br />
                  <br />
                </v-card-text>
              </v-card>
            </v-row>

            <div class="ma-4 mb-2">Type of Organization</div>
            <v-radio-group
              v-model="model.organizationType"
              :disabled="isLocked"
              :rules="rules.required"
              color="primary"
            >
              <v-radio v-for="item in organizationTypeList" :key="item.id" :label="item.name" :value="item.id" />
            </v-radio-group>

            <template v-if="model.organizationType">
              <v-divider class="my-2 mb-8" />
              <v-text-field
                v-model="model.legalName"
                :disabled="isLocked"
                variant="outlined"
                :rules="rules.required"
                label="Legal Name (first, middle and last) or Organization (as it appears in BC Registries and Online Services)"
                class="my-4"
              >
                <template #prepend>
                  <AppTooltip
                    tooltip-content="Legal Name as it appears as the licensee on your Community Care & Assisted Living Act Licence"
                  />
                </template>
              </v-text-field>
              <v-text-field
                v-if="hasIncorporationNumber"
                v-model="model.incNumber"
                :disabled="isLocked"
                variant="outlined"
                :rules="rules.required"
                label="Incorporation Number (as it appears in BC Registries and Online Services)"
              >
                <template #prepend>
                  <AppTooltip
                    tooltip-content="If you're unsure of your Incorporation Number (IN), please search for it on the  <a href='https://www.bcregistry.gov.bc.ca/' target='_blank' rel='noopener noreferrer' style='color: white; text-decoration: underline;'>BC Registry</a>"
                  />
                </template>
              </v-text-field>

              <div class="pl-lg-11">
                <v-divider class="my-4" />
                <div class="mb-0">Organization Mailing Address</div>
              </div>
              <AppAddressForm
                :disabled="isLocked"
                :manual-entry="model.isOrgMailingAddressEnteredManually"
                :address="model.address1"
                :city="model.city1"
                :province="model.province1"
                :postal-code="model.postalCode1"
                :has-left-padding="true"
                address-label="Mailing Address"
                @update="updateMailingAddress"
              />

              <div class="pl-lg-11">
                <v-divider />
                <v-radio-group
                  id="same-mailing-address-button"
                  v-model="model.isSameAsMailing"
                  :disabled="isLocked"
                  :rules="rules.required"
                  inline
                  color="primary"
                  label="Organization Street Address same as Mailing Address"
                  class="application-label mt-6"
                  @update:model-value="resetStreetAddress"
                >
                  <v-radio label="Yes" :value="true" />
                  <v-radio label="No" :value="false" />
                </v-radio-group>
              </div>
              <AppAddressForm
                v-if="model.isSameAsMailing === false"
                :disabled="isLocked"
                :manual-entry="model.isOrgStreetAddressEnteredManually"
                :address="model.address2"
                :city="model.city2"
                :province="model.province2"
                :postal-code="model.postalCode2"
                :has-left-padding="true"
                address-label="Street Address"
                @update="updateStreetAddress"
              />
              <div class="pl-lg-11">
                <v-divider />
                <div class="my-4">Organization's Authorized Signing Authority Information</div>
              </div>

              <v-row v-if="!isSoleProprietorshipPartnership">
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="model.contactName"
                    :disabled="isLocked"
                    variant="outlined"
                    required
                    :rules="rules.required"
                    label="Organization Contact Name"
                  >
                    <template #prepend>
                      <AppTooltip tooltip-content="The full name of the signing authority" />
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="model.position"
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
                    v-model="model.phone"
                    :disabled="isLocked"
                    variant="outlined"
                    required
                    :rules="[...rules.required, rules.phone]"
                    label="Phone Number of the Organization's Authorized Signing Authority"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="businessId"
                    readonly
                    :disabled="isLocked"
                    variant="outlined"
                    required
                    label="Business BCeID"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6" class="pl-lg-14">
                  <v-text-field
                    v-model="model.email"
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
      </v-container>
    </v-skeleton-loader>
    <NavButton
      :is-next-displayed="true"
      :is-save-displayed="true"
      :is-save-disabled="isLocked"
      :is-next-disabled="!isValidForm"
      :is-processing="processing"
      @previous="back"
      @next="next"
      @validate-form="validateForm()"
      @save="save(true)"
    />
  </v-form>
</template>

<script>
import { mapState } from 'pinia';
import { useReportChangesStore } from '@/store/reportChanges.js';
import organizationMixin from '@/mixins/organizationMixin.js';
import { isAnyChangeRequestActive } from '@/utils/common.js';

export default {
  mixins: [organizationMixin],
  async beforeRouteLeave(_to, _from, next) {
    await this.save(false);
    next();
  },
  computed: {
    ...mapState(useReportChangesStore, ['changeRequestStore']),
  },
  methods: {
    isSomeChangeRequestActive() {
      //Status of : "Submitted" "Action Required";
      return isAnyChangeRequestActive(this.changeRequestStore);
    },
  },
};
</script>
<style scoped>
:deep(.v-icon) {
  opacity: 1 !important;
}
</style>
