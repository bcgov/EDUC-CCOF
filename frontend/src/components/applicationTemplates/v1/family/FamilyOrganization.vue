<!--
* NOTE (vietle-cgi):  
* This file contains **legacy code** from the previous application layout, which was deprecated and replaced as of March 2025.  
* **DO NOT modify this file** to maintain compatibility with submitted PCF application/change request.
*  
* Source: Copied from commit 29a3ecd on Nov 8, 2024 with some changes.
-->
<template>
  <v-skeleton-loader
    v-if="isApplicationProcessing"
    :loading="isApplicationProcessing"
    type="table-tbody"
    class="mb-12"
  />
  <v-form v-else ref="form" v-model="organizationModel.isOrganizationComplete">
    <v-container fluid class="pa-0">
      <v-row justify="space-around">
        <v-card class="cc-top-level-card" width="1200">
          <v-container>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="organizationModel.legalName"
                  :disabled="isLocked"
                  variant="outlined"
                  required
                  :rules="rules.required"
                  label="Legal Name (first, middle and last) or Organization (as it appears in BC corporate Registry)"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="organizationModel.incNumber"
                  :disabled="isLocked"
                  variant="outlined"
                  :rules="validateIncorporationNumber(organizationModel.organizationType, organizationModel.incNumber)"
                  label="Incorporation Number (as it appears in BC Corporate Registry)"
                />
              </v-col>
            </v-row>

            <v-divider />

            <v-card-subtitle> Organization Mailing Address </v-card-subtitle>

            <v-row>
              <v-col>
                <v-text-field
                  v-model="organizationModel.nameOfCareProvider"
                  :disabled="isLocked"
                  variant="outlined"
                  required
                  label="Name of Care Provider (if registered company)"
                />
              </v-col>
              <v-col>
                <v-text-field
                  v-model="organizationModel.address1"
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
                  v-model="organizationModel.city1"
                  :disabled="isLocked"
                  variant="outlined"
                  :rules="rules.required"
                  label="City/Town"
                />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="organizationModel.province1"
                  :items="PROVINCES"
                  item-value="value"
                  :rules="rules.required"
                  :disabled="true"
                  label="Province"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="organizationModel.postalCode1"
                  :disabled="isLocked"
                  variant="outlined"
                  :rules="[...rules.required, ...rules.postalCode]"
                  label="Postal Code"
                />
              </v-col>
            </v-row>

            <v-divider />

            <v-card-subtitle>
              <v-checkbox
                v-model="organizationModel.isSameAsMailing"
                :disabled="isLocked"
                label="Organization Street Address same as Mailing Address"
              />
            </v-card-subtitle>
            <div v-if="!organizationModel.isSameAsMailing">
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="organizationModel.address2"
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
                    v-model="organizationModel.city2"
                    :disabled="isLocked"
                    variant="outlined"
                    :rules="rules.required"
                    label="City/Town"
                  />
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-select
                    v-model="organizationModel.province2"
                    :items="PROVINCES"
                    item-value="value"
                    :rules="rules.required"
                    :disabled="true"
                    label="Province"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="organizationModel.postalCode2"
                    :disabled="isLocked"
                    variant="outlined"
                    :rules="[...rules.required, ...rules.postalCode]"
                    label="Postal Code"
                  />
                </v-col>
              </v-row>
            </div>
            <v-divider />
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="organizationModel.yearBeganOperation"
                  :disabled="isLocked"
                  type="number"
                  variant="outlined"
                  required
                  :rules="[...rules.required, ...rules.YYYY]"
                  label="Year Facility began Operation (YYYY)"
                  @wheel="$event.target.blur()"
                  @update:model-value="convertBlankNumberToNull(organizationModel, 'yearBeganOperation')"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="organizationModel.email"
                  :disabled="isLocked"
                  variant="outlined"
                  required
                  type="email"
                  :rules="[...rules.required, ...rules.email]"
                  label="E-mail Address of Signing Authority"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="organizationModel.phone"
                  :disabled="isLocked"
                  variant="outlined"
                  required
                  :rules="[...rules.required, rules.phone]"
                  label="Business Phone"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="userInfo.userName" disabled variant="outlined" label="Business BCeID" />
              </v-col>
            </v-row>

            <v-divider />

            <v-row>
              <v-col cols="12" md="6">
                <v-card-subtitle> Type of Organization </v-card-subtitle>
                <v-radio-group
                  v-model="organizationModel.organizationType"
                  :disabled="isLocked"
                  :rules="rules.required"
                  @update:model-value="$refs.form?.validate"
                >
                  <v-radio v-for="item in organizationTypes" :key="item.id" :label="item.name" :value="item.id" />
                </v-radio-group>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import organizationMixin from '@/mixins/organizationMixin.js';
import globalMixin from '@/mixins/globalMixin.js';
import { PROVINCES } from '@/utils/constants.js';

export default {
  mixins: [organizationMixin, globalMixin],
  watch: {
    isApplicationFormValidated: {
      handler() {
        this.$refs.form?.validate();
      },
    },
  },
  async created() {
    this.PROVINCES = PROVINCES;
    await this.loadData();
    this.organizationModel.province1 =
      this.organizationModel.province1 ?? PROVINCES.find((province) => province.value === 'BC')?.value;
    this.organizationModel.province2 =
      this.organizationModel.province2 ?? PROVINCES.find((province) => province.value === 'BC')?.value;
  },
};
</script>
