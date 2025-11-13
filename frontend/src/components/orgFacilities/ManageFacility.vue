<template>
  <v-container fluid class="pa-12">
    <v-row no-gutters>
      <v-col cols="8" sm="7">
        <h1>Facility Information</h1>
        <v-skeleton-loader v-if="facilityLoading" class="header-skeleton" width="250px" type="paragraph" />
        <p v-else class="mb-6">
          <b>{{ facility.facilityName }}</b> <br />
          ID: {{ facility.facilityAccountNumber }} <br />
          Licence #: {{ facility.licenseNumber }}
        </p>
      </v-col>
      <v-col cols="4" sm="5" class="d-flex justify-end align-end">
        <AppButton size="small" :disabled="!facilityIsActive" @click="goToChangeRequest">Request a Change</AppButton>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-tabs v-model="tab" bg-color="#ffffff" density="compact" color="#003366" show-arrows>
            <v-tab v-if="hasPermission(PERMISSIONS.VIEW_FACILITY_INFORMATION)" value="facility-details">
              Facility Details
            </v-tab>
            <v-tab value="programs-and-services">Programs and Services</v-tab>
            <v-tab v-if="hasPermission(PERMISSIONS.VIEW_LICENCE_INFORMATION)" value="licences-details">
              Licence and Service Details Record
            </v-tab>
          </v-tabs>
          <v-card-text>
            <v-window v-model="tab">
              <v-window-item value="facility-details">
                <ManageFacilityDetails
                  v-if="facilityDataReady"
                  :facility="facility"
                  :facility-loading="facilityLoading"
                  @facility-updated="updateFacility"
                />
              </v-window-item>
              <v-window-item value="programs-and-services">Programs and Services </v-window-item>
              <v-window-item value="licences-details">
                <ViewLicence />
              </v-window-item>
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
import { isEmpty } from 'lodash';
import { PATHS } from '@/utils/constants.js';

import { useApplicationStore } from '@/store/application.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import facilityService from '@/services/facilityService.js';
import alertMixin from '@/mixins/alertMixin.js';
import permissionsMixin from '@/mixins/permissionsMixin.js';
import { isFacilityActive } from '@/utils/facility.js';

import AppButton from '@/components/guiComponents/AppButton.vue';
import ViewLicence from '@/components/licences/ViewLicence.vue';
import ManageFacilityDetails from '@/components/orgFacilities/ManageFacilityDetails.vue';
import NavButton from '@/components/util/NavButton.vue';

export default {
  name: 'ManageFacility',
  components: { AppButton, NavButton, ManageFacilityDetails, ViewLicence },
  mixins: [alertMixin, permissionsMixin],
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
    ...mapState(useApplicationStore, ['applicationMap', 'programYearId']),
    facilityId() {
      return this.$route.params.facilityId;
    },
    facilityIsActive() {
      const application = this.applicationMap?.get(this.programYearId);
      return isFacilityActive(this.facility, application);
    },
    facilityDataReady() {
      return !isEmpty(this.facility);
    },
  },

  async mounted() {
    this.$router.isReady().then(() => {
      this.tab = this.$route.query?.tab || 'facility-details';
    });

    try {
      this.facilityLoading = true;
      this.facility = {
        ...(await facilityService.getFacility(this.facilityId)),
        facilityId: this.facilityId,
      };
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
    goToChangeRequest() {
      this.$router.push({ name: 'Report Change' });
    },
    updateFacility(payload) {
      this.facility = {
        ...this.facility,
        ...payload,
      };
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
