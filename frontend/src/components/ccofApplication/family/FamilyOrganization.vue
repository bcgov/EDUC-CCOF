<template>
  <v-form ref="form" v-model="isValidForm" :class="loading ? 'ccof-skeleton-loader' : ''">
    <v-container>
      <v-row justify="space-around">
        <v-card class="cc-top-level-card" width="1200">
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
              <v-col cols="12" md="6">
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

            <v-card-subtitle> Organization Mailing Address </v-card-subtitle>

            <v-row>
              <v-col>
                <v-text-field
                  v-model="model.nameOfCareProvider"
                  :disabled="isLocked"
                  variant="outlined"
                  required
                  label="Name of Care Provider (if registered company)"
                />
              </v-col>
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
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="model.city1"
                  :disabled="isLocked"
                  variant="outlined"
                  required
                  :rules="rules.required"
                  label="City/Town"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="model.postalCode1"
                  :disabled="isLocked"
                  variant="outlined"
                  required
                  :rules="[...rules.required, ...rules.postalCode]"
                  label="Postal Code"
                />
              </v-col>
            </v-row>

            <v-divider />

            <v-card-subtitle>
              <v-checkbox
                v-model="model.isSameAsMailing"
                :disabled="isLocked"
                label="Organization Street Address same as Mailing Address"
                @click="isSameAddressChecked()"
              />
            </v-card-subtitle>
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
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="model.city2"
                    :disabled="isLocked"
                    variant="outlined"
                    :rules="rules.required"
                    label="City/Town"
                  />
                </v-col>
                <v-col cols="12" md="6">
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
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="model.yearBeganOperation"
                  :disabled="isLocked"
                  type="number"
                  variant="outlined"
                  required
                  :rules="[...rules.required, ...rules.YYYY]"
                  label="Year Facility began Operation (YYYY)"
                  @wheel="$event.target.blur()"
                  @update:model-value="convertBlankNumberToNull(model, 'yearBeganOperation')"
                />
              </v-col>
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
                <v-card-subtitle> Type of Organization </v-card-subtitle>
                <v-radio-group v-model="model.organizationType" :disabled="isLocked" :rules="rules.required" label="">
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
import organizationMixin from '../../../mixins/organizationMixin.js';
import globalMixin from '../../../mixins/globalMixin.js';
import { ORGANIZATION_PROVIDER_TYPES } from '../../../utils/constants.js';

export default {
  mixins: [organizationMixin, globalMixin],
  data() {
    return {
      providerType: ORGANIZATION_PROVIDER_TYPES.FAMILY,
    };
  },
  computed: {
    filteredOrganizationList() {
      return this.organizationTypeList.filter((fac) => fac.id == 100000002 || fac.id == 100000005);
    },
  },
};
</script>
