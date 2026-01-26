<template>
  <v-container class="pa-0 text-body-1" fluid>
    <v-form ref="form" v-model="isValidForm">
      <p class="mb-4">All ECE information has been updated from the ECE Registry.</p>
      <p>
        Click <strong>Refresh ECE information</strong> to ensure information has been updated from the ECE Registry
        before making any changes to Hourly Wage or status. To save changes to Hourly Wage or Status click
        <strong>Save Changes</strong> below.
      </p>

      <v-row justify="space-between" align="center">
        <v-col cols="6" sm="4" md="3">
          <v-text-field
            v-model="eceSearch"
            label="Search ECE Staff"
            variant="outlined"
            dense
            hide-details
            clearable
            :disabled="!eceStaff.length"
          />
        </v-col>

        <v-col cols="auto">
          <v-row class="g-2" justify="end">
            <v-col cols="auto">
              <AppButton size="small" :loading="isLoading" @click="addDialogOpen = true"> Add ECE Staff </AppButton>
            </v-col>

            <v-col v-if="!isEditing" cols="auto">
              <AppButton
                :primary="true"
                size="small"
                :loading="isLoading"
                :disabled="!eceStaff.length"
                @click="startEditing"
              >
                Edit
              </AppButton>
            </v-col>

            <v-col v-if="isEditing" cols="auto">
              <AppButton
                :primary="true"
                size="small"
                :disabled="!isValidForm"
                :loading="isLoading"
                @click="saveChanges"
              >
                Save Changes
              </AppButton>
            </v-col>

            <v-col v-if="isEditing" cols="auto">
              <AppButton :primary="false" size="small" :loading="isLoading" @click="cancelChanges"> Cancel </AppButton>
            </v-col>

            <v-col cols="auto">
              <AppButton
                :primary="false"
                size="small"
                :loading="isLoading"
                :disabled="!eceStaff.length"
                @click="refreshECEStaff"
              >
                Refresh ECE Information
              </AppButton>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-skeleton-loader :loading="isLoading" type="table-tbody">
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
                :model-value="formatHourlyWage(item)"
                type="number"
                variant="outlined"
                density="compact"
                hide-details="auto"
                prefix="$"
                max-width="120"
                :disabled="!isEditing"
                :rules="[
                  rules.min(1, 'Wage cannot be less than $1.00'),
                  rules.max(1000, 'Wage cannot be more than $1000'),
                ]"
                @update:model-value="item.hourlyWage = Number($event)"
              />
            </v-row>
          </template>

          <template #[`item.certifications`]="{ item }">
            <v-row no-gutters class="justify-end justify-lg-start">
              <AppButton
                :primary="false"
                size="small"
                width="100"
                :loading="isLoadingCertificates"
                @click="goToViewCertification(item)"
              >
                View
              </AppButton>
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
      <ECEStaffCertificationDialog v-model="certificationDialogOpen" :staff="selectedStaff" />
      <AddECEStaffDialog v-model="addDialogOpen" :existing-staff="eceStaff" @staff-added="loadEceStaff" />
    </v-form>
  </v-container>
</template>
<script>
import { pick } from 'lodash';
import AddECEStaffDialog from '@/components/eceStaff/AddECEStaffDialog.vue';
import ECEStaffCertificationDialog from '@/components/eceStaff/ECEStaffCertificationDialog.vue';
import AppButton from '@/components/guiComponents/AppButton.vue';

import alertMixin from '@/mixins/alertMixin.js';

import ECEStaffService from '@/services/eceStaffService.js';

import { deepCloneObject, getUpdatedObjectsByKeys } from '@/utils/common.js';
import { ECE_STAFF_STATUSES } from '@/utils/constants';
import { formatDecimalNumber } from '@/utils/format';
import rules from '@/utils/rules';
export default {
  name: 'ManageECEStaff',
  components: { AppButton, AddECEStaffDialog, ECEStaffCertificationDialog },
  mixins: [alertMixin],
  data() {
    return {
      isLoading: false,
      isLoadingCertificates: false,
      isEditing: false,
      isValidForm: false,
      eceSearch: '',
      eceStaff: [],
      originalECEStaff: [],
      addDialogOpen: false,
      certificationDialogOpen: false,
      selectedStaff: null,
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

    async goToViewCertification(staff) {
      try {
        this.isLoadingCertificates = true;
        if (!staff.certificates) {
          staff.certificates = await ECEStaffService.getECEStaffCertificates({
            registrationNumber: staff.registrationNumber,
            lastName: staff.lastName,
          });
        }
        this.selectedStaff = staff;
        this.certificationDialogOpen = true;
      } catch (error) {
        this.setFailureAlert('Failed to load staff certifications');
        console.error(error);
      } finally {
        this.isLoadingCertificates = false;
      }
    },

    formatHourlyWage(item) {
      return this.isEditing ? item.hourlyWage : formatDecimalNumber(item.hourlyWage, false);
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
      await this.$refs.form.validate();
      if (!this.isValidForm) return;

      const keysForBackend = ['eceStaffId', 'hourlyWage', 'status'];
      const updatedECEStaff = getUpdatedObjectsByKeys(
        this.originalECEStaff,
        this.eceStaff,
        keysForBackend,
        'eceStaffId',
      );
      const payload = updatedECEStaff.map((item) => pick(item, keysForBackend));
      try {
        this.isLoading = true;
        await ECEStaffService.updateECEStaff(payload);
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
