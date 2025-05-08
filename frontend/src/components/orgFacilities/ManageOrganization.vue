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
              <p><AppLabel>Organization Name:</AppLabel></p>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              <p>{{ organizationModel.legalName }}</p>
            </v-col>
          </v-row>
          <v-row v-if="shouldHaveIncorporationNumber" dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <p><AppLabel>Incorporation Number:</AppLabel></p>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              <p>{{ organizationModel.incNumber }}</p>
            </v-col>
          </v-row>
          <v-row v-if="organizationModel.doingBusinessAs" dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <p><AppLabel>Doing Business As:</AppLabel></p>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              <p>{{ organizationModel.doingBusinessAs }}</p>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <p><AppLabel>Organization ID:</AppLabel></p>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              <p>{{ organizationModel.accountNumber }}</p>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <p><AppLabel>Organization Type:</AppLabel></p>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              <p>{{ organizationModel.organizationTypeDesc }}</p>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <p><AppLabel>Email Address:</AppLabel></p>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              <p>{{ organizationModel.email }}</p>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <p><AppLabel>Phone:</AppLabel></p>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              <p>{{ organizationModel.phone }}</p>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" lg="6" class="mt-3 mt-lg-0 pl-lg-3">
        <v-card variant="outlined" class="soft-outline fill-height px-2">
          <v-row dense>
            <v-col>
              <p><AppLabel>Mailing Address</AppLabel></p>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <p><AppLabel>Street Address:</AppLabel></p>
            </v-col>
            <v-col cols="12" sm="7" xl="8">
              <p>{{ organizationModel.address1 }}</p>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <p><AppLabel>City:</AppLabel></p>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              <p>{{ organizationModel.city1 }}</p>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <p><AppLabel>Province:</AppLabel></p>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              <p>{{ organizationModel.province1 }}</p>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <p><AppLabel>Postal Code:</AppLabel></p>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              <p>{{ organizationModel.postalCode1 }}</p>
            </v-col>
          </v-row>
          <br />
          <v-row dense>
            <v-col>
              <p><AppLabel>Physical Address</AppLabel></p>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <p><AppLabel>Street Address:</AppLabel></p>
            </v-col>
            <v-col cols="12" sm="7" xl="8">
              <p>{{ organizationModel.address2 }}</p>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <p><AppLabel>City:</AppLabel></p>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              <p>{{ organizationModel.city2 }}</p>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <p><AppLabel>Province:</AppLabel></p>
            </v-col>
            <v-col cols="12" sm="7" xl="8" xxl="9">
              <p>{{ organizationModel.province2 }}</p>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="5" xl="4" xxl="3">
              <p><AppLabel>Postal Code:</AppLabel></p>
            </v-col>
            <v-col cols="12" sm="7" xxl="8">
              <p>{{ organizationModel.postalCode2 }}</p>
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
