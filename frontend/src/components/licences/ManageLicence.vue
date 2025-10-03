<template>
  <v-container class="pa-0 text-body-1" fluid>
    <v-row no-gutters>
      <p class="mb-4">Review your Licence and Service Details Record.</p>
      <p class="mb-4">
        You must notify the Child Care Operating Funding Program of changes to your licence and service details. To
        update any of your licence and service details, click <strong>Request a Change</strong>.
      </p>
    </v-row>

    <v-expansion-panels class="mb-4" multiple expand>
      <v-expansion-panel>
        <v-expansion-panel-title>
          <h3>Licence and Service Details Record</h3>
        </v-expansion-panel-title>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-title>
          <h3>Record History</h3>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <LicenceHistory :licences="licences" :loading="isLoading" @view-service-details="openViewDialog" />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <ViewServiceDetails
      v-if="selectedLicence"
      :show="viewDialogOpen"
      :licence="selectedLicence"
      @update:show="(val) => (viewDialogOpen = val)"
    />
  </v-container>
</template>

<script>
import LicenceHistory from '@/components/licences/LicenceHistory.vue';
import ViewServiceDetails from '@/components/licences/ViewServiceDetails.vue';
import alertMixin from '@/mixins/alertMixin.js';
import LicenceService from '@/services/licenceService.js';

export default {
  name: 'ManageLicence',
  components: { LicenceHistory, ViewServiceDetails },
  mixins: [alertMixin],
  data() {
    return {
      licences: [],
      isLoading: false,
      selectedLicence: null,
      viewDialogOpen: false,
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.isLoading = true;
      try {
        this.licences = await LicenceService.getLicences(this.$route.params.facilityId);
        if (this.licences.length === 0) {
          this.setWarningAlert('No licence history available for this facility.');
        }
      } catch (error) {
        this.setFailureAlert('Failed to load licence history.');
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    openViewDialog(licence) {
      this.selectedLicence = licence;
      this.viewDialogOpen = true;
    },
  },
};
</script>
