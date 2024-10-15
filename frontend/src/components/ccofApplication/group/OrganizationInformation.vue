<template>
  <v-form ref="form" v-model="isValidForm">
    <v-container>
      <v-skeleton-loader :loading="loading" type="table-tbody" class="mb-12">
        <v-row justify="space-around">
          <v-card class="cc-top-level-card" width="1200">
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

              <v-card-subtitle class="my-2">Organization Mailing Address</v-card-subtitle>

              <v-row>
                <v-col>
                  <v-text-field
                    v-model="model.address1"
                    :disabled="isLocked"
                    variant="outlined"
                    required
                    :rules="rules.required"
                    label="Mailing Address"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="model.city1"
                    :disabled="isLocked"
                    variant="outlined"
                    :rules="rules.required"
                    label="City/Town"
                  />
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-select
                    v-model="model.province1"
                    :items="PROVINCES"
                    item-value="value"
                    :rules="rules.required"
                    :disabled="isLocked"
                    label="Province"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="model.postalCode1"
                    :disabled="isLocked"
                    variant="outlined"
                    :rules="[...rules.required, ...rules.postalCode]"
                    label="Postal Code"
                  />
                </v-col>
              </v-row>

              <v-divider />

              <v-card-subtitle
                ><v-checkbox
                  v-model="model.isSameAsMailing"
                  :disabled="isLocked"
                  label="Organization Street Address same as Mailing Address"
                  @click="isSameAddressChecked()"
              /></v-card-subtitle>
              <div v-if="!model.isSameAsMailing">
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="model.address2"
                      :disabled="isLocked"
                      :rules="rules.required"
                      variant="outlined"
                      label="Street Address"
                    />
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="model.city2"
                      :disabled="isLocked"
                      variant="outlined"
                      :rules="rules.required"
                      label="City/Town"
                    />
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      v-model="model.province2"
                      :items="PROVINCES"
                      item-value="value"
                      :rules="rules.required"
                      :disabled="isLocked"
                      label="Province"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="model.postalCode2"
                      :disabled="isLocked"
                      variant="outlined"
                      :rules="[...rules.required, ...rules.postalCode]"
                      label="Postal Code"
                    />
                  </v-col>
                </v-row>
              </div>

              <v-divider />

              <v-card-subtitle class="my-2">Contact Information</v-card-subtitle>
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

              <v-divider />

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
                <v-card-subtitle class="my-2">Type of Organization</v-card-subtitle>
                <v-radio-group v-model="model.organizationType" :disabled="isLocked" :rules="rules.required" label="">
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
import { useAppStore } from '@/store/app.js';
import { useReportChangesStore } from '@/store/reportChanges.js';

import organizationMixin from '@/mixins/organizationMixin.js';
import { ORGANIZATION_PROVIDER_TYPES, PROVINCES } from '@/utils/constants.js';
import { isAnyChangeRequestActive } from '@/utils/common.js';

export default {
  mixins: [organizationMixin],
  async beforeRouteLeave(_to, _from, next) {
    await this.save(false);
    next();
  },
  data() {
    return {
      providerType: ORGANIZATION_PROVIDER_TYPES.GROUP,
    };
  },
  computed: {
    ...mapState(useAppStore, ['renewalYearLabel', 'currentYearLabel']),
    ...mapState(useReportChangesStore, ['changeRequestStore']),
  },
  created() {
    this.PROVINCES = PROVINCES;
    this.model.province = this.model.province ?? PROVINCES.BC;
  },
  methods: {
    isSomeChangeRequestActive() {
      //Status of : "Submitted" "Action Required";
      return isAnyChangeRequestActive(this.changeRequestStore);
    },
  },
};
</script>
