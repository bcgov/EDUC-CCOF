<template>
  <v-container class="pa-0 text-body-1" fluid>
    <v-row no-gutters>
      <p class="mb-4">Review your Licence and Service Details Record.</p>
      <p class="mb-4">
        You must notify the Child Care Operating Funding Program of changes to your licence and service details. To
        update any of your licence and service details, click <strong>Request a Change</strong>.
      </p>
    </v-row>

    <v-expansion-panels v-model="panels" multiple class="mb-4">
      <v-expansion-panel value="service-details">
        <v-expansion-panel-title>
          <h3>Licence and Service Details Record</h3>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <ServiceDetails v-if="activeLicence" :licence="activeLicence" />
          <p v-else>No active or approved licences found.</p>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel value="history">
        <v-expansion-panel-title>
          <h3>Record History</h3>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <LicenceHistory :licences="licences" :loading="isLicenceLoading" @view-service-details="openViewDialog" />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <ServiceDetailsDialog
      v-if="selectedLicence"
      :show="viewDialogOpen"
      :licence="selectedLicence"
      @update:show="(val) => (viewDialogOpen = val)"
    />
  </v-container>
</template>

<script>
import { isEmpty } from 'lodash';
import LicenceHistory from '@/components/licences/LicenceHistory.vue';
import ServiceDetails from '@/components/licences/ServiceDetails.vue';
import ServiceDetailsDialog from '@/components/licences/ServiceDetailsDialog.vue';
import alertMixin from '@/mixins/alertMixin.js';
import LicenceService from '@/services/licenceService.js';

export default {
  name: 'ViewLicence',
  components: { LicenceHistory, ServiceDetails, ServiceDetailsDialog },
  mixins: [alertMixin],
  data() {
    return {
      licences: [],
      isLicenceLoading: false,
      selectedLicence: null,
      viewDialogOpen: false,
      panels: ['service-details', 'history'],
    };
  },
  computed: {
    activeLicence() {
      return this.licences.find((l) => !l.recordEndDate) ?? null;
    },
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.isLicenceLoading = true;
      try {
        this.licences = await LicenceService.getLicences({ facilityId: this.$route.params.facilityId });
        if (isEmpty(this.licences)) {
          this.setWarningAlert('No licence history available for this facility.');
        }
      } catch (error) {
        this.setFailureAlert('Failed to load licence history.');
        console.error(error);
      } finally {
        this.isLicenceLoading = false;
      }
    },
    openViewDialog(licence) {
      this.selectedLicence = licence;
      this.viewDialogOpen = true;
    },
  },
};
</script>
