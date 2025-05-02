<template>
  <v-container fluid class="pa-12">
    <h1 class="mb-6">Organization and Facilities</h1>
    <v-row>
      <v-col>
        <v-card>
          <v-tabs v-model="tab" bg-color="#ffffff" density="compact" color="#003366" show-arrows>
            <v-tab value="organization-tab"> Organization and Contact Information </v-tab>
            <v-tab value="funding-agreement-tab"> Funding Agreement </v-tab>
            <v-tab value="facilities-tab"> Facilities </v-tab>
          </v-tabs>
          <v-card-text>
            <v-window v-model="tab">
              <v-window-item value="organization-tab"> <ManageOrganization /></v-window-item>
              <v-window-item value="funding-agreement-tab"><h2>Funding Agreement</h2> </v-window-item>
              <v-window-item value="facilities-tab"> <h2>Facility(ies)</h2></v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <NavButton
          :is-next-displayed="false"
          :is-save-displayed="false"
          :is-next-disabled="true"
          :is-processing="false"
          @previous="() => $router.push(PATHS.ROOT.HOME)"
          @validate-form="validateForm()"
          @save="save(true)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { PATHS } from '@/utils/constants.js';

import ManageOrganization from '@/components/accountMgmt/ManageOrganization.vue';
import NavButton from '@/components/util/NavButton.vue';

export default {
  name: 'AccountManagement',
  components: { ManageOrganization, NavButton },
  data() {
    return {
      tab: undefined,
      PATHS,
    };
  },
  mounted() {
    const organizationStore = useOrganizationStore();
    organizationStore.loadOrganization(organizationStore.organizationId);
  },
};
</script>
<style scoped></style>
