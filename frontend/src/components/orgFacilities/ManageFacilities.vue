<template>
  <v-container class="pa-0 text-body-1" fluid>
    <v-row no-gutters>
      <v-col>
        <p>View and manage the facilities of your organization.</p>
      </v-col>
    </v-row>
    <template v-if="facilitiesLoading">
      <v-row v-for="n in skeletons" :key="n" no-gutters>
        <v-col class="mt-2">
          <v-card variant="outlined" class="soft-outline fill-height px-2">
            <v-skeleton-loader type="article" />
          </v-card>
        </v-col>
      </v-row>
    </template>
    <template v-else>
      <v-row>
        <v-col>
          <h3>Active Facilities</h3>
        </v-col>
      </v-row>
      <FacilityList :facilities="activeFacilities" />
      <v-row>
        <v-col>
          <h3>Inactive Facilities</h3>
        </v-col>
      </v-row>
      <FacilityList :facilities="inactiveFacilities" />
    </template>
  </v-container>
</template>
<script>
import { mapState } from 'pinia';
import { isEmpty } from 'lodash';

import { useOrganizationStore } from '@/store/ccof/organization.js';
import { useApplicationStore } from '@/store/application.js';
import OrganizationService from '@/services/organizationService.js';
import { isFacilityActive } from '@/utils/facility.js';

import alertMixin from '@/mixins/alertMixin.js';
import FacilityList from '@/components/orgFacilities/FacilityList.vue';

const MAX_SKELETONS = 10;

export default {
  name: 'ManageFacilities',
  components: {
    FacilityList,
  },
  mixins: [alertMixin],
  data() {
    return {
      facilitiesLoading: false,
      facilities: [],
    };
  },
  computed: {
    ...mapState(useOrganizationStore, ['organizationId', 'loadedModel']),
    ...mapState(useApplicationStore, ['applicationMap', 'programYearId']),
    manageFacilitiesLoading() {
      return this.facilitiesLoading || this.fundingAgreementsLoading;
    },
    skeletons() {
      if (this.loadedModel.numberOfFacilities > MAX_SKELETONS) {
        return MAX_SKELETONS;
      }
      return this.loadedModel.numberOfFacilities;
    },
    activeFacilities() {
      return this.facilities.filter(this.facilityIsActive);
    },
    inactiveFacilities() {
      return this.facilities.filter(
        (facility) => !this.facilityIsActive(facility) && !isEmpty(facility.facilityAccountNumber),
      );
    },
  },
  async mounted() {
    try {
      if (isEmpty(this.facilities)) {
        this.facilitiesLoading = true;
        this.facilities = await OrganizationService.getFacilities(this.organizationId);
      }
    } catch (error) {
      this.setFailureAlert('There was an error loading the facilities');
      console.error('Error loading facilities: ', error);
    } finally {
      this.facilitiesLoading = false;
    }
  },
  methods: {
    facilityIsActive(facility) {
      return isFacilityActive(facility, this.applicationMap);
    },
  },
};
</script>
