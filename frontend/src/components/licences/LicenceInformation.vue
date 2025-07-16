<template>
  <v-form ref="form">
    <v-container class="pa-0 text-body-1" fluid>
      <v-row no-gutters>
        <v-col cols="12">
          <p class="mb-4">
            Review and update your licence and service details. You may update your hours of operation directly.
          </p>
        </v-col>
        <v-col cols="12" md="9">
          <p class="mb-2">
            To request changes to any other information to this tab, click <strong>Request a Change</strong>.
          </p>
        </v-col>
        <v-col cols="9" md="3" class="mt-2 mt-md-0 d-flex justify-end align-end pr-2">
          <AppButton color="primary" size="small" @click="goToChangeRequestHistory()"> Request a Change </AppButton>
        </v-col>
      </v-row>
      <div style="height: 1rem"></div>
      <v-sheet class="pa-4" elevation="2" rounded>
        <v-row no-gutters>
          <v-col cols="12" lg="6">
            <v-row no-gutters class="mr-2 my-2">
              <v-col cols="12" sm="6" class="pr-2 mt-1">
                <AppLabel><strong>Facility ID:</strong></AppLabel>
              </v-col>
              <v-col cols="12" sm="6" class="mt-1">{{ facilityName }}</v-col>
            </v-row>
          </v-col>
          <v-row><v-col cols="12" class="my-2"></v-col></v-row>
          <v-col cols="12" lg="6">
            <v-row no-gutters class="mr-2 my-2">
              <v-col cols="12" sm="6" class="pr-2 mt-1">
                <AppLabel><strong>Organization ID:</strong></AppLabel>
              </v-col>
              <v-col cols="12" sm="6" class="mt-1">{{
                licence?.ccofOrganizationId ? licence?.ccofOrganizationId : BLANK_FIELD
              }}</v-col>
            </v-row>
          </v-col>
          <v-col cols="12" lg="6">
            <v-row no-gutters class="mr-2 my-2">
              <v-col cols="12" sm="6" class="pr-2 mt-1">
                <AppLabel><strong>Health Authority:</strong></AppLabel>
              </v-col>
              <v-col cols="12" sm="6" class="mt-1">{{ healthAuthority ? healthAuthority : BLANK_FIELD }}</v-col>
            </v-row>
          </v-col>
          <v-row><v-col cols="12" class="my-2"></v-col></v-row>
          <v-col cols="12" lg="6">
            <v-row no-gutters class="mr-2 my-2">
              <v-col cols="12" sm="6" class="pr-2 mt-1">
                <AppLabel></AppLabel>
              </v-col>
              <v-col cols="12" sm="6" class="mt-1">
                {{ licence?.accbProviderId ? licence?.accbProviderId : BLANK_FIELD }}
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" lg="6">
            <v-row no-gutters class="mr-2 my-2">
              <v-col cols="12" sm="6" class="pr-2 mt-1">
                <AppLabel><strong>Licence Start Date:</strong></AppLabel>
              </v-col>
              <v-col cols="12" sm="6" class="mt-1">
                {{ licence?.tdadFundingAgreementNumber ? licence?.tdadFundingAgreementNumber : BLANK_FIELD }}
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" lg="6">
            <v-row no-gutters class="mr-2 my-2">
              <v-col cols="12" sm="6" class="pr-2 mt-1">
                <AppLabel><strong>Licence End Date:</strong></AppLabel>
              </v-col>
              <v-col cols="12" sm="6" class="mt-1">
                {{ licence?.tdadFundingAgreementNumber ? licence?.tdadFundingAgreementNumber : BLANK_FIELD }}
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-sheet>
    </v-container>
  </v-form>
</template>
<script>
import { mapState } from 'pinia';
import { PATHS } from '@/utils/constants';

import { useFacilityStore } from '@/store/ccof/facility.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';

import AppButton from '@/components/guiComponents/AppButton.vue';

export default {
  name: 'ManageFacilityDetails',
  components: { AppButton },

  computed: {
    ...mapState(useOrganizationStore, ['organizationProviderType']),
    ...mapState(useFacilityStore, ['facilityId']),
  },
  methods: {
    goToChangeRequestHistory() {
      this.$router.push(PATHS.ROOT.CHANGE_LANDING + '#change-request-history');
    },
  },
};
</script>
