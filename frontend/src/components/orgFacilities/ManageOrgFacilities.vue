<template>
  <v-container fluid class="pa-12">
    <h1>Organization and Facilities</h1>
    <p class="mb-6">
      <b>{{ organizationName }}</b> <br />
      ID: {{ organizationAccountNumber }}
    </p>
    <v-row>
      <v-col>
        <v-card>
          <v-tabs
            v-model="tab"
            bg-color="#ffffff"
            density="compact"
            color="#003366"
            show-arrows
            @update:model-value="updateTab"
          >
            <v-tab v-if="hasPermission(PERMISSIONS.VIEW_ORG_INFORMATION)" value="organization-tab">
              Organization Information
            </v-tab>
            <v-tab v-if="hasPermission(PERMISSIONS.VIEW_FUNDING_AGREEMENT)" value="funding-agreement-tab">
              Funding Agreement
            </v-tab>
            <v-tab v-if="hasPermission(PERMISSIONS.VIEW_FACILITY_INFORMATION)" value="facilities-tab">Facilities</v-tab>
            <v-tab v-if="hasPermission(PERMISSIONS.VIEW_PAYMENT_INFORMATION)" value="payments-tab">
              Payment Information
            </v-tab>
          </v-tabs>
          <v-card-text>
            <v-tabs-window v-model="tab">
              <v-tabs-window-item value="organization-tab"><ManageOrganization /></v-tabs-window-item>
              <v-tabs-window-item value="funding-agreement-tab"><ManageFundingAgreements /></v-tabs-window-item>
              <v-tabs-window-item value="facilities-tab"><ManageFacilities /></v-tabs-window-item>
              <v-tabs-window-item value="payments-tab"><ViewPayments /></v-tabs-window-item>
            </v-tabs-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <NavButton @previous="() => $router.push(PATHS.ROOT.HOME)" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapState } from 'pinia';
import { PATHS } from '@/utils/constants.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';

import ManageFundingAgreements from '@/components/fundingAgreements/ManageFundingAgreements.vue';
import ManageFacilities from '@/components/orgFacilities/ManageFacilities.vue';
import ManageOrganization from '@/components/orgFacilities/ManageOrganization.vue';
import ViewPayments from '@/components/payments/ViewPayments.vue';
import NavButton from '@/components/util/NavButton.vue';

import permissionsMixin from '@/mixins/permissionsMixin.js';

export default {
  name: 'AccountManagement',
  components: { ManageOrganization, ManageFacilities, NavButton, ManageFundingAgreements, ViewPayments },
  mixins: [permissionsMixin],
  data() {
    return {
      tab: 'organization-tab',
      PATHS,
    };
  },
  computed: {
    ...mapState(useOrganizationStore, ['organizationName', 'organizationAccountNumber']),
  },
  async mounted() {
    await this.$router.isReady();
    this.tab = this.$route.query?.tab || 'organization-tab';
  },
  methods: {
    updateTab() {
      this.$router.replace({ query: { tab: this.tab } });
    },
  },
};
</script>

<style scoped>
/* These are default framework settings that was somehow allowed to be overriden in CcfriEstimator.vue */
:deep(.v-card) {
  overflow-wrap: break-word;
}
:deep(h1) {
  font-size: 2em;
}
</style>
