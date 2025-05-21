<template>
  <v-container class="pa-0 text-body-1" fluid>
    <v-row no-gutters>
      <v-col>
        <p>View and update your facilities.</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h2>Facility Details</h2>
        <p class="mt-2">
          <v-icon>mdi-information</v-icon>
          Note: The information marked with * will be shared on Child Care Map. Please do not include any personal
          information.
        </p>
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
                        <AppLabel>Community Care Facility License #:</AppLabel>
                      </p>
                    </v-col>
                    <v-col cols="12" sm="7" xl="8" xxl="9">
                      <p>{{ facility.licenseNumber }}</p>
                    </v-col>
                  </v-row>
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
                        <AppLabel>*Funding Type:</AppLabel>
                      </p>
                    </v-col>
                    <v-col cols="12" sm="7" xl="8" xxl="9">
                      <p>{{ facility.baseFundingAgreements[0].providerType }}</p>
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
  </v-container>
</template>
<script>
import { mapActions, mapState } from 'pinia';
import { isEmpty } from 'lodash';

import { useOrganizationStore } from '@/store/ccof/organization';

import alertMixin from '@/mixins/alertMixin.js';
import AppLabel from '@/components/guiComponents/AppLabel.vue';

export default {
  name: 'ManageFacilities',
  components: {
    AppLabel,
  },
  mixins: [alertMixin],
  data() {
    return {
      facilitiesLoading: false,
    };
  },
  computed: {
    ...mapState(useOrganizationStore, ['organizationId', 'facilities', 'loadedModel']),
    skeletons() {
      if (this.loadedModel.numberOfFacilities > 10) {
        return 10;
      }
      return this.loadedModel.numberOfFacilities;
    },
  },
  async mounted() {
    try {
      if (isEmpty(this.facilities)) {
        this.facilitiesLoading = true;
        await this.loadFacilities(this.organizationId);
      }
    } catch (error) {
      this.setFailureAlert('There was an error loading the facilities');
      console.error('Error loading facilities: ', error);
    } finally {
      this.facilitiesLoading = false;
    }
  },
  methods: {
    ...mapActions(useOrganizationStore, ['loadFacilities']),
  },
};
</script>
