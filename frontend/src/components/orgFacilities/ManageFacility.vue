<template>
  <v-container fluid class="pa-12">
    <h1>Facility Information</h1>
    <v-skeleton-loader v-if="facilityLoading" class="header-skeleton" width="250px" type="paragraph" />
    <p v-else class="mb-6">
      <b>{{ facility.facilityName }}</b> <br />
      ID: {{ facility.facilityAccountNumber }} <br />
      Licence #: {{ facility.licenseNumber }}
    </p>
    <v-row>
      <v-col>
        <v-card>
          <v-tabs v-model="tab" bg-color="#ffffff" density="compact" color="#003366" show-arrows>
            <v-tab value="facility-details">Facility Details</v-tab>
            <v-tab value="licences-details">Licences </v-tab>
            <v-tab value="programs-and-services">Programs and Services</v-tab>
            <v-tab value="closures">Closures</v-tab>
          </v-tabs>
          <v-card-text>
            <v-window v-model="tab">
              <v-window-item value="facility-details">
                <ManageFacilityDetails :facility="facility" :facility-loading="facilityLoading" />
              </v-window-item>
              <v-window-item value="licences-details">
                <LicenceDetails />
              </v-window-item>
              <v-window-item value="programs-and-services">Programs and Services</v-window-item>
              <v-window-item value="closures">Closures</v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <NavButton @previous="goBackToManageFacilities" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapState } from 'pinia';
import { PATHS } from '@/utils/constants.js';

import { useOrganizationStore } from '@/store/ccof/organization.js';
import facilityService from '@/services/facilityService.js';
import alertMixin from '@/mixins/alertMixin.js';

import LicenceDetails from '@/components/licences/LicenceDetails.vue';
import ManageFacilityDetails from '@/components/orgFacilities/ManageFacilityDetails.vue';
import NavButton from '@/components/util/NavButton.vue';

export default {
  name: 'ManageFacility',
  components: { NavButton, ManageFacilityDetails, LicenceDetails },
  mixins: [alertMixin],
  data() {
    return {
      tab: undefined,
      PATHS,
      facilityLoading: false,
      facility: {},
    };
  },
  computed: {
    ...mapState(useOrganizationStore, ['organizationName', 'organizationAccountNumber']),
    facilityId() {
      return this.$route.params.facilityId;
    },
  },
  async mounted() {
    this.$router.isReady().then(() => {
      this.tab = this.$route.query?.tab || 'facility-details';
    });

    try {
      this.facilityLoading = true;
      this.facility = await facilityService.getFacilityById(this.facilityId);
    } catch (error) {
      this.setFailureAlert('There was an error loading the facility details.');
      console.error('Error loading facility: ', error);
    } finally {
      this.facilityLoading = false;
    }
  },
  methods: {
    goBackToManageFacilities() {
      this.$router.push(`${PATHS.ROOT.MANAGE_ORG_FACILITIES}?tab=facilities-tab`);
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

:deep(.header-skeleton .v-skeleton-loader__bone) {
  margin-left: 0;
  margin-right: 0;
}

:deep(.header-skeleton .v-skeleton-loader__bone:first-child) {
  margin-top: 0px;
}
</style>
