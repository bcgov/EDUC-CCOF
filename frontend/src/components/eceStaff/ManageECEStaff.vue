<template>
  <v-container class="pa-0 text-body-1" fluid>
    <p class="mb-4">
      You must notify the Child Care Operating Funding Program within two business days of any change to your Facility
      Licence or Child Care Services.
    </p>
    <p>Submit a change request to notify the Child Care Operating Funding Program.</p>

    <v-row justify="end">
      <v-col cols="auto">
        <AppButton size="small" @click="refreshECE"> Refresh ECE Information </AppButton>
      </v-col>
      <v-col cols="auto">
        <AppButton size="small" @click="addECE"> Add ECE </AppButton>
      </v-col>
    </v-row>
    <v-card variant="outlined" class="soft-outline fill-height px-2 py-1">
      <v-skeleton-loader :loading="isLoading" type="table-tbody">
        <v-data-table
          :items="eceStaff"
          :headers="eceStaffTableHeaders"
          :items-per-page="10"
          :mobile="null"
          mobile-breakpoint="md"
          class="elevation-2"
        >
          <template #[`item.eceStaffStatus`]="{ item }">
            <span :class="getStatusClass(item.eceStaffStatus)">
              {{ getStatusLabel(item.eceStaffStatus) }}
            </span>
          </template>

          <template #[`item.certifications`]="{ item }">
            <div class="d-flex align-center">
              <AppButton :primary="false" size="small" @click="goToViewFundingAgreement(item)"> View </AppButton>
            </div>
          </template>
        </v-data-table>
      </v-skeleton-loader>
    </v-card>
  </v-container>
</template>
<script>
import alertMixin from '@/mixins/alertMixin.js';

import AppButton from '@/components/guiComponents/AppButton.vue';
import ECEStaffService from '@/services/ECEStaffService.js';

import { ECESTAFF_STATUSES } from '@/utils/constants';

export default {
  name: 'ManageECEStaff',
  components: { AppButton },
  mixins: [alertMixin],
  data() {
    return {
      isLoading: false,
      eceStaff: [],
      eceStaffTableHeaders: [
        { title: 'Last Name', sortable: true, value: 'lastName' },
        { title: 'First Name', sortable: true, value: 'firstName' },
        { title: 'Registration Number', sortable: true, value: 'registrationNumber' },
        { title: 'Hourly Wage', sortable: true, value: 'hourlyWage' },
        { title: 'Certifications', sortable: true, value: 'certifications' },
        { title: 'Status', sortable: true, value: 'eceStaffStatus' },
      ],
    };
  },

  async created() {
    await this.loadData();
  },

  methods: {
    async loadData() {
      await this.loadeceStaff();
    },

    async loadeceStaff() {
      try {
        this.isLoading = true;
        this.eceStaff = await ECEStaffService.getECEStaff(this.$route.params.facilityId);
        this.sortECEStaff();
      } catch {
        this.setFailureAlert('Failed to load ECE Staff records');
      } finally {
        this.isLoading = false;
      }
    },

    getStatusClass(status) {
      switch (status) {
        case ECESTAFF_STATUSES.ACTIVE:
          return 'status-blue';
        case ECESTAFF_STATUSES.INACTIVE:
          return 'status-red';
        default:
          return '';
      }
    },

    getStatusLabel(status) {
      switch (status) {
        case ECESTAFF_STATUSES.ACTIVE:
          return 'Active';
        case ECESTAFF_STATUSES.INACTIVE:
          return 'Inactive';
        default:
          return '';
      }
    },

    sortECEStaff() {
      this.eceStaff?.sort((a, b) => {
        // 1. Status priority (Active first)
        if (a.eceStaffStatus !== b.eceStaffStatus) {
          return a.eceStaffStatus - b.eceStaffStatus;
        }

        // Last name (A-Z)
        const last = a.lastName.localeCompare(b.lastName);
        if (last !== 0) return last;

        // First name (A-Z)
        return a.firstName.localeCompare(b.firstName);
      });
    },

    // Placeholder methods for buttons
    refreshECE() {
      console.info('refreshECE clicked');
    },
    addECE() {
      console.info('addECE clicked');
    },
    goToViewFundingAgreement(item) {
      console.info('View button clicked for', item);
    },
  },
};
</script>
