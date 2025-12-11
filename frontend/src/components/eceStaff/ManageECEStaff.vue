<template>
  <v-container class="pa-0 text-body-1" fluid>
    <p class="mb-4">All ECE information has been updated from the ECE Registry.</p>
    <p>
      Click <strong>Refresh ECE information</strong> to ensure information has been updated from the ECE Registry before
      making any changes to Hourly Wage or status. To save changes to Hourly Wage or Status click
      <strong>Save Changes</strong> below.
    </p>

    <v-row justify="space-between" align="center">
      <v-col cols="6" sm="4" md="3">
        <v-text-field v-model="eceSearch" label="Search ECE Staff" variant="outlined" dense hide-details clearable />
      </v-col>

      <v-col cols="auto">
        <v-row class="g-2" justify="end">
          <v-col cols="auto">
            <AppButton size="small" @click="refreshECEStaff"> Refresh ECE Information </AppButton>
          </v-col>
          <v-col cols="auto">
            <AppButton size="small" @click="addECE"> Add ECE </AppButton>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-skeleton-loader :loading="isLoading">
      <v-data-table
        :items="eceStaff"
        :search="eceSearch"
        :headers="eceStaffTableHeaders"
        :items-per-page="10"
        mobile-breakpoint="md"
        :mobile="null"
        class="elevation-2"
      >
        <template #item.hourlyWage="{ item }">
          <v-text-field
            v-model.number="item.hourlyWage"
            type="number"
            variant="outlined"
            density="compact"
            hide-details
            prefix="$"
            style="max-width: 100px"
            @blur="formatWage(item)"
          />
        </template>

        <template #[`item.certifications`]="{ item }">
          <AppButton :primary="false" size="small" style="min-width: 100px" @click="goToViewCertification(item)">
            View
          </AppButton>
        </template>

        <template #[`item.eceStaffStatus`]="{ item }">
          <v-radio-group v-model="item.eceStaffStatus" inline hide-details>
            <v-radio :value="statuses.ACTIVE" label="Active" />
            <v-radio :value="statuses.INACTIVE" label="Inactive" />
          </v-radio-group>
        </template>
      </v-data-table>
    </v-skeleton-loader>
  </v-container>
</template>
<script>
import alertMixin from '@/mixins/alertMixin.js';

import AppButton from '@/components/guiComponents/AppButton.vue';
import ECEStaffService from '@/services/ECEStaffService.js';

import { ECESTAFF_STATUSES } from '@/utils/constants';
import { formatWage } from '@/utils/format';

export default {
  name: 'ManageECEStaff',
  components: { AppButton },
  mixins: [alertMixin],
  data() {
    return {
      isLoading: false,
      eceSearch: '',
      eceStaff: [],
      eceStaffTableHeaders: [
        { title: 'Last Name', sortable: true, value: 'lastName' },
        { title: 'Middle Name', sortable: true, value: 'middleName' },
        { title: 'First Name', sortable: true, value: 'firstName' },
        { title: 'Registration Number', sortable: true, value: 'registrationNumber' },
        { title: 'Hourly Wage', sortable: true, value: 'hourlyWage' },
        { title: 'Certifications', sortable: true, value: 'certifications' },
        { title: 'Status', sortable: true, value: 'eceStaffStatus' },
      ],
    };
  },

  computed: {
    statuses() {
      return ECESTAFF_STATUSES;
    },
  },

  async created() {
    await this.loadeceStaff();
  },

  methods: {
    formatWage,
    async loadeceStaff() {
      try {
        this.isLoading = true;
        const staffRecords = await ECEStaffService.getECEStaff({
          facilityId: this.$route.params.facilityId,
        });
        this.eceStaff = staffRecords.map((item) => (this.formatWage(item), item));
        this.sortECEStaff();
      } catch {
        this.setFailureAlert('Failed to load ECE Staff records');
      } finally {
        this.isLoading = false;
      }
    },

    async refreshECEStaff() {
      try {
        this.isLoading = true;
        await this.loadeceStaff();
        this.setSuccessAlert('ECE Staff information has been updated');
      } catch {
        this.setFailureAlert('Failed to refresh ECE staff information');
      } finally {
        this.isLoading = false;
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

    addECE() {
      //TODO: will be added as a part of CCFRI-6263
    },
    goToViewCertification() {
      //TODO: will be added as a part of CCFRI-6259
    },
  },
};
</script>
