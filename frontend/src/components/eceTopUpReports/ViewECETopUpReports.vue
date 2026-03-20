<template>
  <div class="pa-4">
    <p>View ECE-WE payment details by ECE. The report only includes Monthly ECE Reports approved for payment.</p>
    <v-card variant="outlined" class="pa-6 my-6 soft-outline">
      <v-form ref="filterForm" v-model="isValidFilterForm">
        <v-row no-gutters class="align-center filter-rows">
          <v-col cols="12" md="4" lg="2">
            <p class="font-weight-bold mb-2 mb-lg-4">Month of service:</p>
          </v-col>
          <v-col cols="12" md="8" lg="10">
            <v-row no-gutters>
              <v-col cols="12" md="6" class="mb-2 mb-md-0 pr-md-4">
                <v-select
                  v-model="selectedFromMonth"
                  :loading="loading"
                  :disabled="loading"
                  :items="monthSelectOptions"
                  :rules="rules.required"
                  item-title="label"
                  item-value="value"
                  label="From"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6" class="pl-md-4">
                <v-select
                  ref="toMonthSelect"
                  v-model="selectedToMonth"
                  :loading="loading"
                  :disabled="loading"
                  :items="monthSelectOptions"
                  :rules="[...rules.required, rules.validToMonth(selectedFromMonth)]"
                  item-title="label"
                  item-value="value"
                  label="To"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row no-gutters class="align-center filter-rows">
          <v-col cols="12" md="4" lg="2">
            <p class="font-weight-bold mb-2 mb-lg-4">Facility name:</p>
          </v-col>
          <v-col cols="12" md="8" lg="6">
            <FacilityMultiSelectInput
              v-model="selectedFacilityIds"
              :loading="loading"
              :disabled="loading"
              :items="facilities"
              :rules="rules.required"
              item-value="facilityId"
              label="Select facility"
              clearable
            />
          </v-col>
        </v-row>

        <v-row no-gutters class="align-center">
          <v-col cols="12" md="4" lg="2">
            <p class="font-weight-bold mb-2 mb-lg-4">ECE(s):</p>
          </v-col>
          <v-col cols="12" md="8" lg="6">
            <AppMultiSelectInput
              v-model="selectedECEStaffIds"
              :loading="loading"
              :disabled="loading"
              :items="staffSelectOptions"
              :rules="rules.required"
              all-selected-label="All ECEs"
              item-title="label"
              item-value="value"
              label="Select ECE(s)"
              clearable
            />
          </v-col>
        </v-row>
      </v-form>
      <div class="d-flex justify-end mt-4">
        <AppButton :loading="loading" :disabled="!isValidFilterForm" size="medium" @click="generateReport">
          Generate Report
        </AppButton>
      </div>
    </v-card>
    <v-skeleton-loader v-if="isGenerateReportClicked" :loading="loading" type="table-tbody">
      <v-card v-if="!eceReports.length">
        <p class="text-center my-6">No data available.</p>
      </v-card>
      <v-expansion-panels v-else v-model="expandedPanels" multiple elevation="3">
        <v-expansion-panel
          v-for="[facilityId, { facility, reports, summary }] in Array.from(facilityReportDetails)"
          :key="facilityId"
          :value="facilityId"
        >
          <v-expansion-panel-title>
            <p class="facility-header text-primary">
              {{ facility.facilityAccountNumber }} - {{ facility.facilityName }}
            </p>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div class="report-table-wrapper">
              <div class="report-table">
                <v-row class="font-weight-bold">
                  <v-col cols="2"></v-col>
                  <v-col cols="1">Approved Date for Latest Report</v-col>
                  <v-col cols="1" class="text-right">Approved Hours</v-col>
                  <v-col cols="1" class="text-right">WE Rate</v-col>
                  <v-col cols="2" class="text-right">WE Subtotal</v-col>
                  <v-col cols="1" class="text-right">SB Rate</v-col>
                  <v-col cols="2" class="text-right">SB Subtotal</v-col>
                  <v-col cols="2" class="text-right">Total</v-col>
                </v-row>

                <div v-for="report in reports" :key="report.eceReportId">
                  <v-row class="month-header">
                    <v-col cols="2" class="font-weight-bold">
                      {{ formatMonthYearToString(report.month, report.year) }}
                    </v-col>
                    <v-col cols="1">
                      {{ report.approvedDate }}
                    </v-col>
                    <v-col cols="1" class="text-right">
                      {{ report.totalHours }}
                    </v-col>
                    <v-col cols="1" class="text-right">
                      {{ formatCurrency(report.weRate) }}
                    </v-col>
                    <v-col cols="2" class="text-right">
                      {{ formatCurrency(report.weSubtotal) }}
                    </v-col>
                    <v-col cols="1" class="text-right">
                      {{ formatCurrency(report.sbRate) }}
                    </v-col>
                    <v-col cols="2" class="text-right">
                      {{ formatCurrency(report.sbSubtotal) }}
                    </v-col>
                    <v-col cols="2" class="text-right font-weight-bold">
                      {{ formatCurrency(report.totalAmount) }}
                    </v-col>
                  </v-row>

                  <v-row v-for="staff in report.eceStaffInformation" :key="staff.eceReportStaffId">
                    <v-col cols="2" class="pl-6">
                      {{ getStaffFullName(staff.eceStaffId) }}
                    </v-col>
                    <v-col cols="1"></v-col>
                    <v-col cols="1" class="text-right">
                      {{ staff.totalHoursWorkedAllReports }}
                    </v-col>
                    <v-col cols="1"></v-col>
                    <v-col cols="2" class="text-right">
                      {{ formatCurrency(staff.weAmount) }}
                    </v-col>
                    <v-col cols="1"></v-col>
                    <v-col cols="2" class="text-right">
                      {{ formatCurrency(staff.sbAmount) }}
                    </v-col>
                    <v-col cols="2" class="text-right">
                      {{ formatCurrency(staff.totalAmount) }}
                    </v-col>
                  </v-row>
                </div>

                <v-row class="facility-footer font-weight-bold">
                  <v-col cols="5" />
                  <v-col cols="2" class="text-right">
                    <span class="pr-1">Facility WE Subtotal:</span>
                    {{ formatCurrency(summary.weSubtotal) }}
                  </v-col>
                  <v-col cols="1" />
                  <v-col cols="2" class="text-right">
                    <span class="pr-1">Facility SB Subtotal:</span>
                    {{ formatCurrency(summary.sbSubtotal) }}
                  </v-col>
                  <v-col cols="2" class="text-right">
                    <span class="pr-1">Facility Total:</span>
                    {{ formatCurrency(summary.total) }}
                  </v-col>
                </v-row>
              </div>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-skeleton-loader>
  </div>
</template>

<script>
import { mapState } from 'pinia';
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppMultiSelectInput from '@/components/guiComponents/AppMultiSelectInput.vue';
import FacilityMultiSelectInput from '@/components/guiComponents/FacilityMultiSelectInput.vue';
import alertMixin from '@/mixins/alertMixin';
import ECEReportService from '@/services/eceReportService.js';
import ECEStaffService from '@/services/eceStaffService';
import OrganizationService from '@/services/organizationService.js';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { buildFiscalYearMonths } from '@/utils/common.js';
import { formatCurrency, formatMonthYearToString } from '@/utils/format';
import rules from '@/utils/rules.js';

export default {
  name: 'ViewECETopUpReports',
  components: {
    AppButton,
    AppMultiSelectInput,
    FacilityMultiSelectInput,
  },
  mixins: [alertMixin],
  data() {
    return {
      loading: false,
      isValidFilterForm: false,
      eceReports: [],
      eceStaff: [],
      selectedECEStaffIds: [],
      facilities: [],
      selectedFacilityIds: [],
      selectedFromMonth: null,
      selectedToMonth: null,
      expandedPanels: [],
      isGenerateReportClicked: false,
    };
  },
  computed: {
    ...mapState(useAppStore, ['getProgramYearById', 'lookupInfo', 'programYearList']),
    ...mapState(useApplicationStore, ['latestProgramYearId']),
    ...mapState(useOrganizationStore, ['organizationId']),
    monthSelectOptions() {
      const startYear = 2025; // Only data from April 2024 onward was migrated
      const endYear = this.programYearList?.renewal?.financialYear;
      if (!endYear) return [];
      const months = [];
      for (let year = startYear; year <= endYear; year++) {
        months.push(...buildFiscalYearMonths(year));
      }
      return months;
    },
    defaultPeriod() {
      const programYear = this.getProgramYearById(this.latestProgramYearId);
      if (!programYear?.financialYear) {
        return this.monthSelectOptions;
      }
      return buildFiscalYearMonths(programYear.financialYear);
    },
    staffLookup() {
      return new Map(this.eceStaff.map((staff) => [staff.eceStaffId, staff]));
    },
    staffSelectOptions() {
      return this.eceStaff.map((staff) => ({
        value: staff.eceStaffId,
        label: this.formatStaffFullName(staff),
      }));
    },
    facilityReportDetails() {
      const facilityLookup = new Map(this.facilities.map((facility) => [facility.facilityId, facility]));
      const detailsMap = new Map();
      for (const report of this.eceReports) {
        const { facilityId, weSubtotal = 0, sbSubtotal = 0, totalAmount = 0 } = report;

        if (!detailsMap.has(facilityId)) {
          detailsMap.set(facilityId, {
            facility: facilityLookup.get(facilityId),
            reports: [],
            summary: {
              weSubtotal: 0,
              sbSubtotal: 0,
              total: 0,
            },
          });
        }

        const facilityDetails = detailsMap.get(facilityId);
        facilityDetails.reports.push(report);
        facilityDetails.summary.weSubtotal += weSubtotal;
        facilityDetails.summary.sbSubtotal += sbSubtotal;
        facilityDetails.summary.total += totalAmount;
      }

      return new Map(
        [...detailsMap.entries()].sort(([, a], [, b]) =>
          (a.facility?.facilityAccountNumber || '').localeCompare(b.facility?.facilityAccountNumber || ''),
        ),
      );
    },
  },
  watch: {
    selectedFromMonth() {
      this.$nextTick(() => {
        this.$refs.toMonthSelect?.validate();
      });
    },
  },
  async created() {
    this.rules = rules;
    await this.loadData();
  },
  methods: {
    formatCurrency,
    formatMonthYearToString,
    async loadData() {
      try {
        this.loading = true;
        this.eceStaff = await ECEStaffService.getOrganizationECEStaff();
        this.facilities = await OrganizationService.getFacilities(this.organizationId);
        this.resetFilters();
      } catch (error) {
        console.error(error);
        this.setFailureAlert('An error occurred while loading. Please try again later.');
      } finally {
        this.loading = false;
      }
    },
    resetFilters() {
      this.selectedFacilityIds = this.facilities?.map((facility) => facility.facilityId) || [];
      this.selectedECEStaffIds = this.staffSelectOptions.map((staff) => staff.value);
      this.selectedFromMonth = this.defaultPeriod[0]?.value;
      this.selectedToMonth = this.defaultPeriod[this.defaultPeriod.length - 1]?.value;
    },
    formatStaffFullName(staff) {
      return staff ? `${staff.lastName} ${staff.firstName}`.trim() : '';
    },
    getStaffFullName(eceStaffId) {
      const staff = this.staffLookup.get(eceStaffId);
      if (!staff) return '';
      return this.formatStaffFullName(staff);
    },
    async generateReport() {
      if (!this.isValidFilterForm) return;
      try {
        this.loading = true;
        this.isGenerateReportClicked = true;
        this.eceReports = await ECEReportService.getECETopUpReports({
          fromMonth: this.selectedFromMonth?.month,
          fromYear: this.selectedFromMonth?.year,
          toMonth: this.selectedToMonth?.month,
          toYear: this.selectedToMonth?.year,
          facilityIds: this.selectedFacilityIds,
          eceStaffIds: this.selectedECEStaffIds,
        });
        this.expandedPanels = Array.from(this.facilityReportDetails.keys());
      } catch (error) {
        console.error(error);
        this.setFailureAlert('An error occurred while generating the report. Please try again later.');
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
<style scoped>
.report-table-wrapper {
  overflow-x: auto;
  width: 100%;
  padding: 0 16px;
  scrollbar-width: thin;
  -webkit-overflow-scrolling: touch;
}
.report-table {
  min-width: 1700px;
}
.filter-rows {
  margin-bottom: 12px !important;
}
.facility-header {
  font-weight: bold;
  font-size: 18px;
}
.facility-footer {
  padding: 6px 0px;
  background-color: #e0e0e0;
}
.month-header {
  background-color: #d8f0ff;
  font-weight: bold;
  font-size: 14px;
}
</style>
