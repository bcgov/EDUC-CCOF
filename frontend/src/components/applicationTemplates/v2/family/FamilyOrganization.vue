<template>
  <v-form ref="form" v-model="organizationModel.isOrganizationComplete">
    <v-container fluid class="pa-0">
      <v-row justify="space-around">
        <v-card class="cc-top-level-card pa-2" width="1200">
          <v-container>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="organizationModel.legalName"
                  :disabled="isLocked"
                  variant="outlined"
                  required
                  :rules="rules.required"
                  label="Legal Name (first, middle and last) or Organization (as it appears in BC Registries and Online Services)"
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
                  label="Incorporation Number (as it appears in BC Registries and Online Services)"
                />
              </v-col>
              <v-col>
                <v-text-field
                  v-model="organizationModel.nameOfCareProvider"
                  :disabled="isLocked"
                  variant="outlined"
                  required
                  label="Name of Care Provider (if registered company)"
                />
              </v-col>
            </v-row>

            <v-divider />

            <div class="ma-4 mb-0">Organization Mailing Address</div>
            <AppAddressForm
              :disabled="isLocked"
              :address="organizationModel.address1"
              :city="organizationModel.city1"
              :province="organizationModel.province1"
              :postal-code="organizationModel.postalCode1"
              address-label="Mailing Address"
              @update="updateMailingAddress"
            />

            <v-divider />

            <v-radio-group
              id="same-mailing-address-button"
              v-model="organizationModel.isSameAsMailing"
              :disabled="isLocked"
              :rules="rules.required"
              inline
              label="Organization Street Address same as Mailing Address"
              class="mt-4"
              @update:model-value="resetStreetAddress"
            >
              <v-radio label="Yes" :value="true" />
              <v-radio label="No" :value="false" />
            </v-radio-group>

            <AppAddressForm
              v-if="organizationModel.isSameAsMailing === false"
              :disabled="isLocked"
              :address="organizationModel.address2"
              :city="organizationModel.city2"
              :province="organizationModel.province2"
              :postal-code="organizationModel.postalCode2"
              address-label="Street Address"
              @update="updateStreetAddress"
            />

            <v-divider class="my-4" />

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
                  <v-radio
                    v-for="item in filteredOrganizationList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
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

export default {
  mixins: [organizationMixin, globalMixin],
  async beforeRouteLeave(_to, _from, next) {
    await this.save(false);
    next();
  },

  computed: {
    filteredOrganizationList() {
      return this.organizationTypeList.filter((fac) => fac.id == 100000002 || fac.id == 100000005);
    },
  },
};
</script>
