<template>
  <v-lazy v-for="facility of facilities" :key="facility.facilityId" min-height="150px">
    <v-row justify="start" no-gutters>
      <v-col class="mt-2">
        <v-card variant="outlined" class="soft-outline fill-height px-2">
          <v-row>
            <v-col class="py-0" cols="12" md="6">
              <v-row dense>
                <v-col cols="12" sm="5" xl="4" xxl="3">
                  <p>
                    <AppLabel>*Facility Name:</AppLabel>
                  </p>
                </v-col>
                <v-col cols="12" sm="7" xl="8" xxl="9">
                  <p>{{ facility.facilityName }}</p>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="5" xl="4" xxl="3">
                  <p>
                    <AppLabel>*Funding Type:</AppLabel>
                  </p>
                </v-col>
                <v-col cols="12" sm="7" xl="8" xxl="9">
                  <p>{{ providerType }}</p>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="5" xl="4" xxl="3">
                  <p>
                    <AppLabel>Community Care Facility Licence #:</AppLabel>
                  </p>
                </v-col>
                <v-col cols="12" sm="7" xl="8" xxl="9">
                  <p>{{ facility.licenseNumber }}</p>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="5" xl="4" xxl="3">
                  <p>
                    <AppLabel>Facility ID:</AppLabel>
                  </p>
                </v-col>
                <v-col cols="12" sm="7" xl="8" xxl="9">
                  <p>{{ facility.facilityAccountNumber }}</p>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="5" xl="4" xxl="3">
                  <p>
                    <AppLabel>*Business Phone:</AppLabel>
                  </p>
                </v-col>
                <v-col cols="12" sm="7" xl="8" xxl="9">
                  <p>{{ facility.telephone }}</p>
                </v-col>
              </v-row>
            </v-col>
            <v-col class="py-0" cols="12" md="6">
              <v-row dense>
                <v-col cols="12" sm="5" xl="4" xxl="3">
                  <p>
                    <AppLabel>Facility Street Address:</AppLabel>
                  </p>
                </v-col>
                <v-col cols="12" sm="7" xl="8" xxl="9">
                  <p>{{ facility.addressLineOne }}</p>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="5" xl="4" xxl="3">
                  <p>
                    <AppLabel>City/Town:</AppLabel>
                  </p>
                </v-col>
                <v-col cols="12" sm="7" xl="8" xxl="9">
                  <p>{{ facility.city }}</p>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="5" xl="4" xxl="3">
                  <p>
                    <AppLabel>Province:</AppLabel>
                  </p>
                </v-col>
                <v-col cols="12" sm="7" xl="8" xxl="9">
                  <p>{{ facility.province }}</p>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="5" xl="4" xxl="3">
                  <p>
                    <AppLabel>Postal Code:</AppLabel>
                  </p>
                </v-col>
                <v-col cols="12" sm="7" xl="8" xxl="9">
                  <p>{{ facility.postalCode }}</p>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="5" xl="4" xxl="3">
                  <p>
                    <AppLabel>Facility Email Address:</AppLabel>
                  </p>
                </v-col>
                <v-col cols="12" sm="7" xl="8" xxl="9">
                  <p>{{ facility.email }}</p>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-lazy>
</template>
<script>
import { mapState } from 'pinia';

import { useOrganizationStore } from '@/store/ccof/organization';

import AppLabel from '@/components/guiComponents/AppLabel.vue';

export default {
  name: 'FacilityList',
  components: { AppLabel },
  props: {
    facilities: {
      type: Array,
      required: false,
      default: () => [],
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
