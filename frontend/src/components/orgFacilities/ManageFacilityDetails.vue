<template>
  <v-container class="pa-0 text-body-1" fluid>
    <v-row v-if="facilityLoading" no-gutters>
      <v-col cols="12">
        <v-card variant="outlined" class="soft-outline fill-height px-2">
          <v-skeleton-loader type="paragraph" />
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else justify="start" no-gutters>
      <v-col class="mt-2">
        <v-card variant="outlined" class="soft-outline fill-height px-2">
          <v-row>
            <v-col class="py-0" cols="12" md="6">
              <v-row dense>
                <v-col cols="12" sm="6" xl="5" xxl="3">
                  <p>
                    <AppLabel>*Facility Name:</AppLabel>
                  </p>
                </v-col>
                <v-col class="d-flex align-end" cols="12" sm="6" xl="7" xxl="9">
                  <p>{{ facility.facilityName }}</p>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="6" xl="5" xxl="3">
                  <p>
                    <AppLabel>*Funding Type:</AppLabel>
                  </p>
                </v-col>
                <v-col class="d-flex align-end" cols="12" sm="6" xl="7" xxl="9">
                  <p>{{ providerType }}</p>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="6" xl="5" xxl="3">
                  <p>
                    <AppLabel>Community Care Facility Licence #:</AppLabel>
                  </p>
                </v-col>
                <v-col class="d-flex align-end" cols="12" sm="6" xl="7" xxl="9">
                  <p>{{ facility.licenseNumber }}</p>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="6" xl="5" xxl="3">
                  <p>
                    <AppLabel>Facility ID:</AppLabel>
                  </p>
                </v-col>
                <v-col class="d-flex align-end" cols="12" sm="6" xl="7" xxl="9">
                  <p>{{ facility.facilityAccountNumber }}</p>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="6" xl="5" xxl="3">
                  <p>
                    <AppLabel>*Business Phone:</AppLabel>
                  </p>
                </v-col>
                <v-col class="d-flex align-end" cols="12" sm="6" xl="7" xxl="9">
                  <p>{{ facility.phone }}</p>
                </v-col>
              </v-row>
            </v-col>
            <v-col class="py-0" cols="12" md="6">
              <v-row dense>
                <v-col cols="12" sm="6" xl="5" xxl="3">
                  <p>
                    <AppLabel>Facility Street Address:</AppLabel>
                  </p>
                </v-col>
                <v-col class="d-flex align-end" cols="12" sm="6" xl="7" xxl="9">
                  <p>{{ facility.facilityAddress }}</p>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="6" xl="5" xxl="3">
                  <p>
                    <AppLabel>City/Town:</AppLabel>
                  </p>
                </v-col>
                <v-col class="d-flex align-end" cols="12" sm="6" xl="7" xxl="9">
                  <p>{{ facility.city }}</p>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="6" xl="5" xxl="3">
                  <p>
                    <AppLabel>Province:</AppLabel>
                  </p>
                </v-col>
                <v-col class="d-flex align-end" cols="12" sm="6" xl="7" xxl="9">
                  <p>{{ facility.province }}</p>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="6" xl="5" xxl="3">
                  <p>
                    <AppLabel>Postal Code:</AppLabel>
                  </p>
                </v-col>
                <v-col class="d-flex align-end" cols="12" sm="6" xl="7" xxl="9">
                  <p>{{ facility.postalCode }}</p>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="6" xl="5" xxl="3">
                  <p>
                    <AppLabel>Facility Email Address:</AppLabel>
                  </p>
                </v-col>
                <v-col class="d-flex align-end" cols="12" sm="6" xl="7" xxl="9">
                  <p>{{ facility.email }}</p>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapState } from 'pinia';

import { useOrganizationStore } from '@/store/ccof/organization';

import AppLabel from '@/components/guiComponents/AppLabel.vue';

export default {
  name: 'ManageFacilityDetails',
  components: { AppLabel },
  props: {
    facility: {
      type: Object,
      required: true,
    },
    facilityLoading: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  computed: {
    ...mapState(useOrganizationStore, ['organizationProviderType']),
    providerType() {
      return `${this.organizationProviderType[0]}${this.organizationProviderType.slice(1).toLowerCase()}`;
    },
  },
};
</script>
