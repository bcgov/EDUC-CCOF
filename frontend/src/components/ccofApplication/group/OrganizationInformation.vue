<template>
  <v-form ref="form" v-model="isValidForm">
    <v-container>
      <v-skeleton-loader :loading="loading" type="table-tbody" class="mb-12">
        <v-row justify="space-around">
          <v-card class="cc-top-level-card mx-12 pa-2" width="100%">
            <v-card-title class="text-center pb-0">
              <h3>Organization Information</h3>
            </v-card-title>
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
            <v-container>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="model.legalName"
                    :disabled="isLocked"
                    variant="outlined"
                    required
                    :rules="rules.required"
                    label="Legal Name (first, middle and last) or Organization (as it appears in BC corporate Registry)"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="model.incNumber"
                    :disabled="isLocked"
                    variant="outlined"
                    :rules="validateIncorporationNumber(model.organizationType, model.incNumber)"
                    label="Incorporation Number (as it appears in BC Corporate Registry)"
                  />
                </v-col>
              </v-row>
              <v-divider />

              <div class="ma-4 mb-0">Organization Mailing Address</div>
              <AppAddressForm
                :disabled="isLocked"
                :manual-entry="model.isOrgMailingAddressEnteredManually"
                :address="model.address1"
                :city="model.city1"
                :province="model.province1"
                :postal-code="model.postalCode1"
                address-label="Mailing Address"
                @update="updateMailingAddress"
              />

              <v-divider />

              <v-radio-group
                id="same-mailing-address-button"
                v-model="model.isSameAsMailing"
                :disabled="isLocked"
                :rules="rules.required"
                inline
                color="primary"
                label="Organization Street Address same as Mailing Address"
                class="mt-4"
                @update:model-value="resetStreetAddress"
              >
                <v-radio label="Yes" :value="true" />
                <v-radio label="No" :value="false" />
              </v-radio-group>

              <AppAddressForm
                v-if="model.isSameAsMailing === false"
                :disabled="isLocked"
                :manual-entry="model.isOrgStreetAddressEnteredManually"
                :address="model.address2"
                :city="model.city2"
                :province="model.province2"
                :postal-code="model.postalCode2"
                address-label="Street Address"
                @update="updateStreetAddress"
              />

              <v-divider />

              <div class="ma-4 mb-2">Contact Information</div>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="model.contactName"
                    :disabled="isLocked"
                    variant="outlined"
                    required
                    :rules="rules.required"
                    label="Organization Contact Name"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="model.position"
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
                    v-model="model.phone"
                    :disabled="isLocked"
                    variant="outlined"
                    required
                    :rules="[...rules.required, rules.phone]"
                    label="Business Phone"
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

              <v-divider class="mb-4" />

              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="model.email"
                    :disabled="isLocked"
                    variant="outlined"
                    required
                    type="email"
                    :rules="[...rules.required, ...rules.email]"
                    label="E-mail Address of Signing Authority"
                  />
                </v-col>
              </v-row>

              <v-divider />

              <div>
                <div class="ma-4 mb-2">Type of Organization</div>
                <v-radio-group
                  v-model="model.organizationType"
                  :disabled="isLocked"
                  :rules="rules.required"
                  @update:model-value="$refs.form?.validate"
                >
                  <v-radio v-for="item in organizationTypeList" :key="item.id" :label="item.name" :value="item.id" />
                </v-radio-group>
              </div>
            </v-container>
          </v-card>
        </v-row>
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
    </v-container>
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
