<template>
  <AppDialog v-model="dialogOpen" title="Add ECE Staff" :loading="isLoading" max-width="900px" @close="closeDialog">
    <template #content>
      <v-col>
        Enter ECE's Registration Number and First or Last Name exactly as they appear on the ECE Certificate.
      </v-col>

      <br />
      <v-row class="mb-4">
        <v-col cols="12" md="3">
          <v-text-field
            v-model.trim="search.registrationNumber"
            :disabled="isLoading"
            label="Registration #"
            variant="outlined"
            density="compact"
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-text-field
            v-model.trim="search.firstName"
            :disabled="isLoading"
            label="First Name"
            variant="outlined"
            density="compact"
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-text-field
            v-model.trim="search.lastName"
            :disabled="isLoading"
            label="Last Name"
            variant="outlined"
            density="compact"
          />
        </v-col>

        <v-col cols="12" md="2">
          <AppButton size="medium" :disabled="!canSearch" :loading="isLoading" @click="searchStaff">Search</AppButton>
        </v-col>
      </v-row>

      <v-skeleton-loader :loading="isLoading" type="table-tbody">
        <AppAlertBanner v-if="isStaffDuplicate" type="error">
          {{ duplicateStaffErrorMessage }}
        </AppAlertBanner>
        <AppAlertBanner v-if="showInactiveStaffAlert" type="error">
          The ECE you entered is currently inactive. Would you like to activate this ECE and add them to this report?
        </AppAlertBanner>
        <v-form v-if="resultState.hasResults" ref="eceForm" v-model="isValidForm" class="w-100">
          <v-data-table
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
                :disabled="isStaffDuplicate"
                required
                class="py-2"
              />
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
        </v-form>

        <AppAlertBanner v-else-if="resultState.noResults" type="error">
          No ECE found. Please ensure information entered is exactly as it appears on the ECE Certification and try
          again. If you continue to have issues, please contact the ECE Registry at: <strong>1-888-338-6622</strong>
        </AppAlertBanner>
      </v-skeleton-loader>
    </template>

    <template #button>
      <v-row v-if="!isLoading" class="px-4 flex-column flex-sm-row">
        <template v-if="showInactiveStaffAlert">
          <v-col>
            <AppButton display="inline" :primary="false" size="small" @click="closeDialog"> No, go back </AppButton>
          </v-col>
          <v-col>
            <AppButton display="inline" size="small" @click="activateAndAddECEStaff"> Yes, activate and add </AppButton>
          </v-col>
        </template>
        <template v-else>
          <v-col>
            <AppButton display="inline" :primary="false" size="small" @click="closeDialog">Cancel</AppButton>
          </v-col>
          <v-col v-if="resultState.hasResults">
            <AppButton display="inline" size="small" :disabled="!canAddECE" @click="addECEStaff">Add ECE</AppButton>
          </v-col>
        </template>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import { mapState } from 'pinia';
import AppAlertBanner from '@/components/guiComponents/AppAlertBanner.vue';
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';
import alertMixin from '@/mixins/alertMixin.js';
import ECEStaffService from '@/services/eceStaffService';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { getECECertStatusClass } from '@/utils/common.js';
import { ECE_STAFF_CERT_STATUSES, ECE_STAFF_STATUSES } from '@/utils/constants.js';
import { formatCurrency, formatDecimalNumberToNumber, formatName } from '@/utils/format';
import rules from '@/utils/rules';

export default {
  name: 'AddECEStaffDialog',
  components: { AppAlertBanner, AppButton, AppDialog },
  mixins: [alertMixin],
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    facilityExistingStaff: {
      type: Array,
      default: () => [],
    },
    reportExistingStaff: {
      type: Array,
      default: () => [],
    },
    eceReportId: {
      type: String,
      default: null,
    },
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

    isEceReport() {
      return Boolean(this.eceReportId);
    },

    foundStaff() {
      return this.results[0] ?? null;
    },

    isStaffDuplicate() {
      if (!this.foundStaff) return false;
      return this.isEceReport ? this.foundStaff.isReportStaffDuplicate : this.foundStaff.isFacilityStaffDuplicate;
    },

    showInactiveStaffAlert() {
      return this.isEceReport && !this.isStaffDuplicate && this.foundStaff?.isFacilityStaffActive === false;
    },

    duplicateStaffErrorMessage() {
      return `This ECE Staff registration number ${this.foundStaff?.registrationNumber} already exists on this
      ${this.isEceReport ? 'report' : 'facility'}. You may edit the existing record.`;
    },

    canSearch() {
      const { registrationNumber, firstName, lastName } = this.search;
      return Boolean(registrationNumber && (firstName || lastName));
    },

    resultState() {
      const hasResults = this.results.length > 0;
      const noResults = this.searched && !hasResults;
      return { hasResults, noResults };
    },

    canAddECE() {
      return this.isValidForm && !this.isStaffDuplicate;
    },
  },

  created() {
    this.ECE_STAFF_CERT_STATUSES = ECE_STAFF_CERT_STATUSES;
  },

  methods: {
    formatCurrency,
    getECECertStatusClass,
    async searchStaff() {
      this.searched = true;
      this.isLoading = true;
      try {
        const params = Object.fromEntries(Object.entries(this.search).filter(([, value]) => value));
        const certificates = await ECEStaffService.getECEStaffCertificates(params);
        this.results = this.buildSearchResults(certificates);
      } catch (err) {
        this.setFailureAlert('Failed to search ECE Staff.');
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },

    buildSearchResults(certificates = []) {
      if (!Array.isArray(certificates)) {
        throw new TypeError('Expected certificates to be an array.');
      }
      if (certificates.length === 0) return [];
      const staff = certificates[0];
      const facilityStaffMatch = this.facilityExistingStaff.find(
        (s) => s.registrationNumber === staff.registrationNumber,
      );
      const reportStaffMatch = this.reportExistingStaff.find((s) => s.registrationNumber === staff.registrationNumber);
      const isFacilityStaffActive = facilityStaffMatch ? facilityStaffMatch.status === ECE_STAFF_STATUSES.ACTIVE : null;
      return [
        {
          registrationNumber: staff.registrationNumber,
          firstName: formatName(staff.firstName),
          middleName: formatName(staff.middleName),
          lastName: formatName(staff.lastName),
          certificates,
          eceStaffId: facilityStaffMatch?.eceStaffId,
          eceFacilityStaffId: facilityStaffMatch?.eceFacilityStaffId ?? null,
          eceReportStaffId: reportStaffMatch?.eceReportStaffId ?? null,
          isFacilityStaffActive: isFacilityStaffActive,
          isFacilityStaffDuplicate: Boolean(facilityStaffMatch),
          isReportStaffDuplicate: Boolean(reportStaffMatch),
          hourlyWage: facilityStaffMatch?.hourlyWage ?? reportStaffMatch?.hourlyWage ?? null,
        },
      ];
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

    async activateAndAddECEStaff() {
      try {
        this.isLoading = true;
        await this.activateECEStaff();
        await this.addECEStaff();
      } catch (err) {
        this.setFailureAlert('Failed to activate and add ECE Staff.');
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },

    async activateECEStaff() {
      if (!this.foundStaff || this.foundStaff.isFacilityStaffActive) return;
      const payload = [
        {
          eceFacilityStaffId: this.foundStaff.eceFacilityStaffId,
          status: ECE_STAFF_STATUSES.ACTIVE,
        },
      ];
      await ECEStaffService.updateECEFacilityStaff(payload);
      this.foundStaff.isFacilityStaffActive = true;
    },

    async addECEStaff() {
      if (!this.foundStaff || this.isStaffDuplicate) return;
      try {
        this.isLoading = true;
        if (this.isEceReport) {
          this.$emit('staff-added', this.foundStaff);
          this.closeDialog();
          return;
        }
        const payload = [
          {
            registrationNumber: this.foundStaff.registrationNumber,
            firstName: this.foundStaff.firstName,
            middleName: this.foundStaff.middleName,
            lastName: this.foundStaff.lastName,
            hourlyWage: formatDecimalNumberToNumber(this.foundStaff.hourlyWage),
            facilityId: this.$route.params.facilityId,
            organizationId: this.organizationId,
          },
        ];
        await ECEStaffService.createECEFacilityStaff(payload);
        this.$emit('staff-added');
        this.setSuccessAlert('ECE Staff record has been added.');
        this.closeDialog();
      } catch (err) {
        this.setFailureAlert('Failed to add ECE Staff.');
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
