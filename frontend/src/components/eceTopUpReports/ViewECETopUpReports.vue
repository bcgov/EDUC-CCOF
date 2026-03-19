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
              <!-- TODO: Add fromMonth < toMonth validation -->
              <v-col cols="12" md="6" class="mb-2 mb-md-0 pr-md-4">
                <v-select
                  v-model="selectedFromMonth"
                  :loading="loading"
                  :disabled="loading"
                  :items="allReportingMonths"
                  :rules="rules.required"
                  item-title="label"
                  item-value="value"
                  label="From"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6" class="pl-md-4">
                <v-select
                  v-model="selectedToMonth"
                  :loading="loading"
                  :disabled="loading"
                  :items="allReportingMonths"
                  :rules="rules.required"
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
              :items="mappedECEStaff"
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
          v-for="[facilityId, { facility, reports, summary }] in Array.from(facilityReportSummaries)"
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
                  <v-col></v-col>
                  <v-col>Approved Date for Latest Report</v-col>
                  <v-col>Approved Hours</v-col>
                  <v-col>WE Rate</v-col>
                  <v-col>WE Subtotal</v-col>
                  <v-col>SB Rate</v-col>
                  <v-col>SB Subtotal</v-col>
                  <v-col>Total</v-col>
                </v-row>
                <div v-for="report in reports" :key="report.eceReportId">
                  <v-row class="monthly-report-header">
                    <v-col>{{ formatMonthYearToString(report.month, report.year) }}</v-col>
                    <v-col>{{ report.approvedDate }}</v-col>
                    <v-col>{{ report.approvedHours }}</v-col>
                    <v-col>{{ formatCurrency(report.weRate) }}</v-col>
                    <v-col>{{ formatCurrency(report.approvedWeSubtotal) }}</v-col>
                    <v-col>{{ formatCurrency(report.sbRate) }}</v-col>
                    <v-col>{{ formatCurrency(report.approvedSbSubtotal) }}</v-col>
                    <v-col>{{ formatCurrency(report.approvedTotalAmount) }}</v-col>
                  </v-row>
                  <v-row v-for="staff in report.eceStaffInformation" :key="staff.eceReportStaffId">
                    <v-col>{{ getStaffFullName(staff.eceStaffId) }}</v-col>
                    <v-col></v-col>
                    <v-col>{{ staff.verifiedHours }}</v-col>
                    <v-col></v-col>
                    <v-col>{{ formatCurrency(staff.approvedWeAmount) }}</v-col>
                    <v-col></v-col>
                    <v-col>{{ formatCurrency(staff.approvedSbAmount) }}</v-col>
                    <v-col>{{ formatCurrency(staff.approvedTotalAmount) }}</v-col>
                  </v-row>
                </div>
                <v-row class="facility-footer font-weight-bold">
                  <v-col cols="5" />
                  <v-col cols="2">
                    <span class="pr-1">Facility WE Subtotal:</span>
                    {{ formatCurrency(summary.weSubtotal) }}
                  </v-col>
                  <v-col cols="1" />
                  <v-col cols="2">
                    <span class="pr-1">Facility SB Subtotal:</span>
                    {{ formatCurrency(summary.sbSubtotal) }}
                  </v-col>
                  <v-col cols="2">
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
    allReportingMonths() {
      const startYear = 2025; // Only data from April 2024 onward was migrated
      const endYear = this.programYearList?.renewal?.financialYear;
      const allMonths = [];
      for (let year = startYear; year <= endYear; year++) {
        const period = buildFiscalYearMonths(year);
        allMonths.push(...period);
      }
      return allMonths;
    },
    defaultPeriod() {
      const latestApplicationProgramYear = this.getProgramYearById(this.latestProgramYearId);
      return buildFiscalYearMonths(latestApplicationProgramYear?.financialYear);
    },
    mappedECEStaff() {
      return this.eceStaff.map((staff) => ({
        value: staff.eceStaffId,
        label: this.formatStaffFullName(staff),
      }));
    },
    facilityReportSummaries() {
      const facilityMap = new Map();
      for (const report of this.eceReports) {
        const facility = this.facilities.find((facility) => facility.facilityId === report.facilityId);
        if (!facilityMap.has(report.facilityId)) {
          facilityMap.set(report.facilityId, {
            facility,
            reports: [],
            summary: {
              weSubtotal: 0,
              sbSubtotal: 0,
              total: 0,
            },
          });
        }
        const facilityData = facilityMap.get(report.facilityId);
        facilityData.reports.push(report);
        facilityData.summary.weSubtotal += report.approvedWeSubtotal || 0;
        facilityData.summary.sbSubtotal += report.approvedSbSubtotal || 0;
        facilityData.summary.total += report.approvedTotalAmount || 0;
      }
      return new Map(
        [...facilityMap.entries()].sort(([, a], [, b]) => {
          const facA = a.facility?.facilityAccountNumber || '';
          const facB = b.facility?.facilityAccountNumber || '';
          return facA.localeCompare(facB);
        }),
      );
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
      this.selectedECEStaffIds = this.mappedECEStaff.map((staff) => staff.value);
      this.selectedFromMonth = this.defaultPeriod[0]?.value;
      this.selectedToMonth = this.defaultPeriod[this.defaultPeriod.length - 1]?.value;
    },
    formatStaffFullName(staff) {
      return staff ? `${staff.lastName} ${staff.firstName}`.trim() : '';
    },
    getStaffFullName(eceStaffId) {
      const staff = this.eceStaff.find((s) => s.eceStaffId === eceStaffId);
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
        this.expandedPanels = Array.from(this.facilityReportSummaries.keys());
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
.monthly-report-header {
  background-color: #d8f0ff;
  font-weight: bold;
  font-size: 14px;
}
</style>
