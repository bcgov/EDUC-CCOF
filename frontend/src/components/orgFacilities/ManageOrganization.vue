<template>
  <v-container class="pa-0" fluid>
    <v-row no-gutters>
      <v-col>
        <p>View and update your organization information.</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12"><h2>Organization Info</h2></v-col>
    </v-row>
    <v-row v-if="orgLoading" no-gutters>
      <v-col cols="12" lg="6">
        <v-card variant="outlined" class="soft-outline fill-height px-2">
          <v-skeleton-loader type="paragraph" />
        </v-card>
      </v-col>
      <v-col cols="12" lg="6" class="mt-3 mt-lg-0 pl-lg-3">
        <v-card variant="outlined" class="soft-outline fill-height px-2">
          <v-skeleton-loader type="paragraph" />
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else no-gutters>
      <v-col cols="12" lg="6">
        <v-card variant="outlined" class="soft-outline fill-height px-2">
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <AppLabel>Organization Name:</AppLabel>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              {{ organizationModel.legalName }}
            </v-col>
          </v-row>
          <v-row v-if="shouldHaveIncorporationNumber" dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <AppLabel>Incorporation Number:</AppLabel>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              {{ organizationModel.incNumber }}
            </v-col>
          </v-row>
          <v-row v-if="organizationModel.doingBusinessAs" dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <AppLabel>Doing Business As:</AppLabel>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              {{ organizationModel.doingBusinessAs }}
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <AppLabel>Organization ID:</AppLabel>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              {{ organizationModel.accountNumber }}
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <AppLabel>Organization Type:</AppLabel>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              {{ organizationModel.organizationTypeDesc }}
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <AppLabel>Email Address:</AppLabel>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              {{ organizationModel.email }}
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <AppLabel>Phone:</AppLabel>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              {{ organizationModel.phone }}
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" lg="6" class="mt-3 mt-lg-0 pl-lg-3">
        <v-card variant="outlined" class="soft-outline fill-height px-2">
          <v-row dense>
            <v-col>
              <AppLabel>Mailing Address</AppLabel>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <AppLabel>Street Address:</AppLabel>
            </v-col>
            <v-col cols="12" sm="7" xl="8">
              {{ organizationModel.address1 }}
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <AppLabel>City:</AppLabel>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              {{ organizationModel.city1 }}
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <AppLabel>Province:</AppLabel>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              {{ organizationModel.province1 }}
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <AppLabel>Postal Code:</AppLabel>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              {{ organizationModel.postalCode1 }}
            </v-col>
          </v-row>
          <br />
          <v-row dense>
            <v-col>
              <AppLabel>Physical Address</AppLabel>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <AppLabel>Street Address:</AppLabel>
            </v-col>
            <v-col cols="12" sm="7" xl="8">
              {{ organizationModel.address2 }}
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <AppLabel>City:</AppLabel>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              {{ organizationModel.city2 }}
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <AppLabel>Province:</AppLabel>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              {{ organizationModel.province2 }}
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <AppLabel>Postal Code:</AppLabel>
            </v-col>
            <v-col cols="12" sm="7" xxl="8">
              {{ organizationModel.postalCode2 }}
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapActions, mapState } from 'pinia';
import { isEmpty } from 'lodash';

import { useOrganizationStore } from '@/store/ccof/organization.js';
import { ORGANIZATION_TYPES } from '@/utils/constants.js';

import AppLabel from '@/components/util/AppLabel.vue';

export default {
  name: 'ManageOrganization',
  components: {
    AppLabel,
  },
  data() {
    return {
      orgLoading: false,
    };
  },
  computed: {
    ...mapState(useOrganizationStore, ['organizationId', 'organizationModel']),
    shouldHaveIncorporationNumber() {
      return [ORGANIZATION_TYPES.NON_PROFIT_SOCIETY, ORGANIZATION_TYPES.REGISTERED_COMPANY].includes(
        this.organizationModel.organizationType,
      );
    },
  },
  async mounted() {
    try {
      if (isEmpty(this.organizationModel)) {
        this.orgLoading = true;
        await this.loadOrganization(this.organizationId);
      }
    } catch (error) {
      console.error('Error loading organization: ', error);
    } finally {
      this.orgLoading = false;
    }
  },
  methods: {
    ...mapActions(useOrganizationStore, ['loadOrganization']),
  },
};
</script>
