<template>
  <v-form ref="form" v-model="isValidForm" :class="loading ? 'ccof-skeleton-loader' : ''">
    <v-container>
      <v-row justify="space-around">
        <v-card class="cc-top-level-card" width="1200">

          <v-container>
            <v-row>
              <v-col>
                <v-text-field :disabled="isLocked" outlined required v-model="model.legalName" :rules="rules.required"
                  label="Legal Name (first, middle and last) or Organization (as it appears in BC corporate Registry)" />
              </v-col>
            </v-row>

            <v-divider></v-divider>

            <v-card-subtitle> Organization Mailing Address </v-card-subtitle>

            <v-row>
              <v-col>
                <v-text-field :disabled="isLocked" outlined required v-model="model.contactName"
                  label="Name of Care Provider (if registered company)" />
              </v-col>
              <v-col>
                <v-text-field :disabled="isLocked" outlined required v-model="model.address1" :rules="rules.required"
                  label="Mailing Address" />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field :disabled="isLocked" outlined required v-model="model.city1" :rules="rules.required"
                  label="City/Town" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field :disabled="isLocked" outlined required v-model="model.postalCode1"
                  :rules="[...rules.required, ...rules.postalCode]" label="Postal Code" />
              </v-col>
            </v-row>

            <v-divider></v-divider>

            <v-card-subtitle><v-checkbox :disabled="isLocked" @click="isSameAddressChecked()"
                v-model="model.isSameAsMailing"
                label="Organization Street Address same as Mailing Address"></v-checkbox></v-card-subtitle>
            <div v-if="!model.isSameAsMailing">
              <v-row>
                <v-col>
                  <v-text-field :disabled="isLocked" :rules="rules.required" outlined v-model="model.address2"
                    label="Street Address" />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field :disabled="isLocked" outlined :rules="rules.required" v-model="model.city2"
                    label="City/Town" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field :disabled="isLocked" outlined v-model="model.postalCode2"
                    :rules="[...rules.required, ...rules.postalCode]" label="Postal Code" />
                </v-col>
              </v-row>
            </div>

            <v-divider></v-divider>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field :disabled="isLocked" type="number" outlined required v-model="model.yearBeganOperation"
                  :rules="[...rules.required, ...rules.YYYY]" label="Year Facility began Operation (YYYY)" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field :disabled="isLocked" outlined required v-model="model.email" type="email"
                  :rules="[...rules.required, ...rules.email]" label="E-mail Address of Signing Authority" />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field :disabled="isLocked" outlined required v-model="model.phone"
                  :rules="[...rules.required, rules.phone]" label="Business Phone" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field readonly :disabled="isLocked" outlined required v-model="businessId"
                  label="Business BCeID" />
              </v-col>
            </v-row>

            <v-divider></v-divider>

            <v-row>
              <v-col cols="12" md="6">
                <v-radio-group :disabled="isLocked" v-model="model.organizationType" :rules="rules.required"
                  label="Type of Orgnization">
                  <v-radio v-for="item in this.filteredOrganizationList" :key="item.id" :label="item.name"
                    :value="item.id"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field :disabled="isLocked" outlined
                  :rules="validateIncorporationNumber(model.organizationType, model.incNumber)" v-model="model.incNumber"
                  label="Incorporation Number (as it appears in BC Corporate Registry)" />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-row>

      <NavButton :isNextDisplayed="true" :isSaveDisplayed="true" :isSaveDisabled="isLocked" :isNextDisabled="!isValidForm"
        :isProcessing="processing" @previous="back" @next="next" @validateForm="validateForm()" @save="save(true)">
      </NavButton>
    </v-container>
  </v-form>
</template>

<script>

import organizationMixin from '@/mixins/organizationMixin';
import { ORGANIZATION_PROVIDER_TYPES } from '@/utils/constants';

export default {
  mixins: [organizationMixin],
  data() {
    return {
      providerType: ORGANIZATION_PROVIDER_TYPES.FAMILY
    };
  },
  computed: {
    filteredOrganizationList() {
      return this.organizationTypeList.filter((fac) => (fac.id == 100000002 || fac.id == 100000005));
    }
  }

};

</script>
