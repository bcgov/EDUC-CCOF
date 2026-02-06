<template>
  <AppDialog v-model="dialogOpen" title="Add ECE Staff" max-width="900px" @close="closeDialog">
    <template #content>
      <v-col>
        Enter ECE's Registration Number and First or Last Name exactly as they appear on the ECE Certificate.
      </v-col>

      <br />
      <v-row class="mb-4">
        <v-col cols="12" md="3">
          <v-text-field
            v-model.trim="search.registrationNumber"
            label="Registration #"
            variant="outlined"
            density="compact"
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-text-field v-model.trim="search.firstName" label="First Name" variant="outlined" density="compact" />
        </v-col>

        <v-col cols="12" md="3">
          <v-text-field v-model.trim="search.lastName" label="Last Name" variant="outlined" density="compact" />
        </v-col>

        <v-col cols="12" md="2">
          <AppButton size="medium" :disabled="!canSearch" :loading="isLoading" @click="searchStaff">Search</AppButton>
        </v-col>
      </v-row>

      <v-skeleton-loader :loading="isLoading" type="table-tbody">
        <p v-if="resultState.duplicateStaff" class="mb-2 text-error">
          This ECE Staff registration number {{ results[0].registrationNumber }} already exists on this facility. You
          may edit the existing record.
        </p>

        <v-data-table
          v-if="resultState.hasResults"
          :items="results"
          :headers="headers"
          item-key="registrationNumber"
          hide-default-footer
          class="elevation-2"
        >
          <template #item.actions="{ item, isExpanded, toggleExpand }">
            <AppButton size="small" :primary="false" @click="toggleExpand(item)">
              {{ isExpanded(item) ? 'Hide' : 'View' }}
            </AppButton>
          </template>

          <template #item.hourlyWage="{ item }">
            <v-form ref="eceForm" v-model="isValidForm">
              <v-text-field
                v-model.number="item.hourlyWage"
                type="number"
                variant="outlined"
                density="compact"
                hide-details="auto"
                prefix="$"
                max-width="120"
                :rules="[
                  rules.min(1, 'Wage cannot be less than $1.00'),
                  rules.max(1000, 'Wage cannot be more than $1000'),
                ]"
                :disabled="item.isDuplicate"
                required
              />
            </v-form>
          </template>

          <template #expanded-row="{ item, columns }">
            <tr>
              <td :colspan="columns.length" class="pa-0">
                <v-card variant="outlined" class="soft-outline ma-4">
                  <v-table density="compact">
                    <thead>
                      <tr>
                        <th class="font-weight-bold" scope="col">Certifications</th>
                        <th class="font-weight-bold" scope="col">Effective Start Date</th>
                        <th class="font-weight-bold" scope="col">Effective End Date</th>
                        <th class="font-weight-bold" scope="col">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr v-for="(cert, index) in item.certificates" :key="index">
                        <td>{{ cert.certificateLevel }}</td>
                        <td>{{ cert.effectiveStartDate }}</td>
                        <td>{{ cert.effectiveEndDate }}</td>
                        <td>
                          <span
                            v-if="cert.certStatus === ECE_STAFF_CERT_STATUSES.EXPIRED"
                            :class="getECECertStatusClass(cert.certStatus)"
                          >
                            {{ cert.certStatus }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-card>
              </td>
            </tr>
          </template>
        </v-data-table>

        <p v-else-if="resultState.noResults" class="mt-2 text-error">
          No ECE found. Please ensure information entered is exactly as it appears on the ECE Certification and try
          again. If you continue to have issues, please contact the ECE Registry at: <strong>1-888-338-6622</strong>
        </p>
      </v-skeleton-loader>
    </template>

    <template #button>
      <v-row class="text-center" justify="center">
        <v-col>
          <AppButton display="inline" :primary="false" size="small" @click="closeDialog">Cancel</AppButton>
        </v-col>

        <v-col v-if="resultState.hasResults">
          <AppButton display="inline" size="small" :disabled="!canAddECE" @click="addECEStaff">Add ECE</AppButton>
        </v-col>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import { mapState } from 'pinia';
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';
import alertMixin from '@/mixins/alertMixin.js';
import ECEStaffService from '@/services/eceStaffService';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { getECECertStatusClass } from '@/utils/common.js';
import { ECE_STAFF_CERT_STATUSES } from '@/utils/constants.js';
import { formatName } from '@/utils/format';
import rules from '@/utils/rules';

export default {
  name: 'AddECEStaffDialog',
  components: { AppButton, AppDialog },
  mixins: [alertMixin],
  props: {
    modelValue: { type: Boolean, required: true },
    existingStaff: { type: Array, default: () => [] },
  },
  emits: ['update:modelValue', 'staff-added'],
  data() {
    return {
      isLoading: false,
      isValidForm: false,
      results: [],
      search: { firstName: '', lastName: '', registrationNumber: '' },
      searched: false,
      headers: [
        { title: 'Registration #', value: 'registrationNumber' },
        { title: 'First Name', value: 'firstName' },
        { title: 'Last Name', value: 'lastName' },
        { title: 'Certifications', value: 'actions' },
        { title: 'Hourly Wage', value: 'hourlyWage' },
      ],
      rules,
    };
  },

  computed: {
    ...mapState(useOrganizationStore, ['organizationId']),
    dialogOpen: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit('update:modelValue', val);
      },
    },

    canSearch() {
      const { registrationNumber, firstName, lastName } = this.search;
      return Boolean(registrationNumber && (firstName || lastName));
    },

    resultState() {
      const hasResults = this.results.length > 0;
      const noResults = this.searched && !hasResults;
      const duplicateStaff = hasResults && this.searched && this.results[0].isDuplicate;
      return { hasResults, noResults, duplicateStaff };
    },

    canAddECE() {
      return this.isValidForm && this.results[0]?.isDuplicate !== true;
    },
  },

  created() {
    this.ECE_STAFF_CERT_STATUSES = ECE_STAFF_CERT_STATUSES;
  },

  methods: {
    getECECertStatusClass,
    isDuplicateStaff(registrationNumber) {
      return this.existingStaff.some((s) => s.registrationNumber === registrationNumber);
    },

    async searchStaff() {
      this.searched = true;
      this.isLoading = true;
      try {
        const params = Object.fromEntries(Object.entries(this.search).filter(([, value]) => value));
        const certificates = await ECEStaffService.getECEStaffCertificates(params);
        const first = certificates?.[0];
        const existing = first && this.existingStaff.find((s) => s.registrationNumber === first.registrationNumber);

        this.results = first
          ? [
              {
                registrationNumber: first.registrationNumber,
                firstName: formatName(first.firstName),
                middleName: formatName(first.middleName),
                lastName: formatName(first.lastName),
                certificates,
                isDuplicate: !!existing,
                hourlyWage: existing?.hourlyWage,
              },
            ]
          : [];
      } catch (err) {
        this.setFailureAlert('Failed to search ECE staff.');
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },

    closeDialog() {
      this.dialogOpen = false;
      this.clearFields();
    },

    clearFields() {
      this.search = { firstName: '', lastName: '', registrationNumber: '' };
      this.results = [];
      this.searched = false;
    },

    async addECEStaff() {
      const [staffToAdd] = this.results;
      try {
        const payload = {
          registrationNumber: staffToAdd.registrationNumber,
          firstName: staffToAdd.firstName,
          middleName: staffToAdd.middleName,
          lastName: staffToAdd.lastName,
          hourlyWage: Number(staffToAdd.hourlyWage.toFixed(2)),
          facilityId: this.$route.params.facilityId,
          organizationId: this.organizationId,
        };
        const created = await ECEStaffService.createECEStaff(payload);
        this.$emit('staff-added', created);
        this.setSuccessAlert('ECE Staff record has been added');
        this.closeDialog();
      } catch (err) {
        this.setFailureAlert('Failed to create ECE Staff.');
        console.error(err);
      }
    },
  },
};
</script>
