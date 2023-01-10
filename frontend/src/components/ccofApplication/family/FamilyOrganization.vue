<template>
  <v-form ref="form" v-model="isValidForm">
    <v-container>
      <v-row justify="space-around">
        <v-card class="cc-top-level-card" width="1200">
          <v-container>
            <v-row>
              <v-col>
                <v-text-field outlined required v-model="model.legalName" :rules="rules.required" label="Legal Name (first, middle and last) or Organization (as it appears in BC corporate Registry)" />
              </v-col>
            </v-row>

            <v-divider></v-divider>

            <v-card-subtitle> Organization Mailing Address </v-card-subtitle>

            <v-row>
              <v-col>
                <v-text-field outlined required v-model="model.contactName" label="Name of Care Provider (if registered company)" />
              </v-col>
              <v-col>
                <v-text-field outlined required v-model="model.address1" :rules="rules.required" label="Mailing Address" />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="model.city1" :rules="rules.required" label="City/Town" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="model.postalCode1" :rules="[...rules.required, ...rules.postalCode]" label="Postal Code" />
              </v-col>
            </v-row>

            <v-divider></v-divider>

            <v-card-subtitle> Organization Street Address, if different from the Mailing Address (Optional) </v-card-subtitle>

            <v-row>
              <v-col>
                <v-text-field outlined required v-model="model.address2" label="Street Address" />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="model.city2" label="City/Town" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="model.postalCode2" :rules="rules.postalCode" label="Postal Code" />
              </v-col>
            </v-row>

            <v-divider></v-divider>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="model.yearBeganOperation" :rules="[...rules.required, ...rules.YYYY]" label="Year Facility began Operation (YYYY)" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="model.email" type="email" :rules="[...rules.required, ...rules.email]" label="E-mail Address of Signing Authority" />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field outlined required v-model="model.phone" :rules="rules.required" label="Business Phone" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field readonly outlined required v-model="businessId" label="Business BCeID" />
              </v-col>
            </v-row>

            <v-divider></v-divider>

            <v-row>
              <v-col cols="12" md="6">
                <v-radio-group v-model="model.organizationType" :rules="rules.required" label="Type of Orgnization">
                  <v-radio v-for="item in this.organizationTypeList" :key="item.id" :label="item.name" :value="item.id"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field outlined required :rules="rules.required" v-model="model.incNumber" label="Incorporation Number (as it appears in BC Corporate Registry)" />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-row>

      <v-row justify="space-around">
        <v-btn color="info" outlined x-large :loading="processing" @click="back()">Back</v-btn>
        <v-btn color="secondary" outlined x-large :loading="processing" @click="next()" :disabled="!isValidForm">Next</v-btn>
        <v-btn color="primary" outlined x-large :loading="processing" @click="save(true)">Save</v-btn>
      </v-row>
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
  }
};

</script>
