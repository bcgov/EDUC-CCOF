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
          <v-col v-if="!isEditing" cols="auto">
            <AppButton :primary="true" size="small" @click="startEditing"> Edit </AppButton>
          </v-col>

          <v-col v-if="isEditing" cols="auto">
            <AppButton :primary="true" size="small" @click="saveChanges"> Save Changes </AppButton>
          </v-col>

          <v-col v-if="isEditing" cols="auto">
            <AppButton :primary="false" size="small" @click="cancelChanges"> Cancel </AppButton>
          </v-col>

          <v-col cols="auto">
            <AppButton :primary="false" size="small" @click="refreshECEStaff"> Refresh ECE Information </AppButton>
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
        mobile-breakpoint="lg"
        :mobile="null"
        class="elevation-2"
      >
        <template #item.hourlyWage="{ item }">
          <v-row no-gutters class="justify-end justify-lg-start">
            <v-text-field
              v-model.number="item.hourlyWage"
              :value="formatDecimalNumber(item.hourlyWage, false)"
              type="number"
              variant="outlined"
              density="compact"
              hide-details="auto"
              prefix="$"
              max-width="120"
              :disabled="!isEditing"
              :rules="rules.wage"
            />
          </v-row>
        </template>

        <template #[`item.certifications`]="{ item }">
          <v-row no-gutters class="justify-end justify-lg-start">
            <AppButton :primary="false" size="small" width="100" @click="goToViewCertification(item)"> View </AppButton>
          </v-row>
        </template>

        <template #[`item.status`]="{ item }">
          <v-radio-group v-model="item.status" inline hide-details :disabled="!isEditing">
            <v-row no-gutters class="justify-end justify-lg-start">
              <v-radio :value="ECE_STAFF_STATUSES.ACTIVE" label="Active" />
              <v-radio :value="ECE_STAFF_STATUSES.INACTIVE" label="Inactive" />
            </v-row>
          </v-radio-group>
        </template>
      </v-data-table>
    </v-skeleton-loader>
  </v-container>
</template>
<script>
import AppButton from '@/components/guiComponents/AppButton.vue';

import alertMixin from '@/mixins/alertMixin.js';

import ECEStaffService from '@/services/eceStaffService.js';

import { deepCloneObject } from '@/utils/common.js';
import { ECE_STAFF_STATUSES } from '@/utils/constants';
import { formatDecimalNumber } from '@/utils/format';
import rules from '@/utils/rules';

export default {
  name: 'ManageECEStaff',
  components: { AppButton },
  mixins: [alertMixin],
  data() {
    return {
      isLoading: false,
      isEditing: false,
      eceSearch: '',
      eceStaff: [],
      originalECEStaff: [],
      eceStaffTableHeaders: [
        { title: 'Last Name', sortable: true, value: 'lastName' },
        { title: 'Middle Name', sortable: true, value: 'middleName' },
        { title: 'First Name', sortable: true, value: 'firstName' },
        { title: 'Registration Number', sortable: true, value: 'registrationNumber' },
        { title: 'Hourly Wage', sortable: true, value: 'hourlyWage' },
        { title: 'Status', sortable: true, value: 'status' },
        { title: 'Certifications', sortable: false, value: 'certifications' },
      ],
      rules,
    };
  },

  async created() {
    this.ECE_STAFF_STATUSES = ECE_STAFF_STATUSES;
    await this.loadEceStaff();
  },

  methods: {
    formatDecimalNumber,
    async loadEceStaff() {
      try {
        this.isLoading = true;
        const staffRecords = await ECEStaffService.getECEStaff({
          facilityId: this.$route.params.facilityId,
        });
        this.eceStaff = staffRecords;
        this.originalECEStaff = deepCloneObject(this.eceStaff);
        this.sortECEStaff();
      } catch (error) {
        this.setFailureAlert('Failed to load ECE Staff records');
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },

    async refreshECEStaff() {
      await this.loadEceStaff();
      this.isEditing = false;
      this.setSuccessAlert('ECE Staff information has been refreshed');
    },

    sortECEStaff() {
      const safe = (v) => (v ?? '').toLowerCase();

      this.eceStaff?.sort((a, b) => {
        // 1. Status priority (Active first)
        if (a.status !== b.status) {
          return a.status - b.status;
        }

        // 2. Last Name (A–Z), then First Name (A–Z)
        return safe(a.lastName).localeCompare(safe(b.lastName)) || safe(a.firstName).localeCompare(safe(b.firstName));
      });
    },

    goToViewCertification() {
      //TODO: will be added as a part of CCFRI-6259
      alert('View Certification');
    },

    startEditing() {
      this.isEditing = true;
      this.originalECEStaff = deepCloneObject(this.eceStaff);
    },

    cancelChanges() {
      this.eceStaff = deepCloneObject(this.originalECEStaff);
      this.isEditing = false;
    },

    async saveChanges() {
      try {
        this.isLoading = true;

        const changedStaff = this.eceStaff.filter((staff, i) => {
          const original = this.originalECEStaff[i];
          return original && (staff.hourlyWage !== original.hourlyWage || staff.status !== original.status);
        });

        for (const staff of changedStaff) {
          const payload = { hourlyWage: staff.hourlyWage, status: staff.status };
          await ECEStaffService.updateECEStaff(staff.eceStaffId, payload);
        }
        this.originalECEStaff = deepCloneObject(this.eceStaff);
        this.isEditing = false;
        this.setSuccessAlert('ECE Staff changes saved successfully.');
      } catch (error) {
        this.setFailureAlert('Failed to save changes.');
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
