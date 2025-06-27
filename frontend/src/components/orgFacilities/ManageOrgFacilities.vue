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
          <v-tabs v-model="tab" bg-color="#ffffff" density="compact" color="#003366" show-arrows>
            <v-tab value="organization-tab">Organization Information</v-tab>
            <v-tab value="funding-agreement-tab">Funding Agreement</v-tab>
            <v-tab value="facilities-tab"> Facilities </v-tab>
          </v-tabs>
          <v-card-text>
            <v-window v-model="tab">
              <v-window-item value="organization-tab"><ManageOrganization /></v-window-item>
              <v-window-item value="funding-agreement-tab"><ManageFundingAgreements /></v-window-item>
              <v-window-item value="facilities-tab"><ManageFacilities /></v-window-item>
            </v-window>
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

import ManageFacilities from '@/components/orgFacilities/ManageFacilities.vue';
import ManageFundingAgreements from '@/components/fundingAgreements/ManageFundingAgreements.vue';
import ManageOrganization from '@/components/orgFacilities/ManageOrganization.vue';
import NavButton from '@/components/util/NavButton.vue';

export default {
  name: 'AccountManagement',
  components: { ManageOrganization, ManageFacilities, NavButton, ManageFundingAgreements },
  data() {
    return {
      tab: undefined,
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
