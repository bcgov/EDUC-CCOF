<template>
  <div class="px-12 mb-12">
    <p class="text-h4 font-weight-bold">Monthly ECE Report - View Reports</p>
    <div class="text-h6 text-primary mt-2">
      <p class="font-weight-bold my-2">{{ organizationName }}</p>
      <p>{{ organizationAccountNumber }}</p>
    </div>
    <p class="my-4">
      Edit, submit, view, or adjust your Monthly ECE Reports. To ensure accurate wage enhancement payments, keep your
      ECE staff information, wage rates, and facility details up to date. Review the Monthly ECE Report Instructions.
    </p>
    <!-- TODO: Implement ECE Reports permission -->
    <AppButton size="medium" @click="toggleCreateECEReportDialog"> Create ECE Report </AppButton>
    <v-card variant="outlined" class="pa-6 my-6 soft-outline">
      <v-row no-gutters class="pb-4">
        <v-col cols="12" md="4" lg="3">
          <p class="font-weight-bold py-1 pr-4">Select fiscal year:</p>
        </v-col>
        <v-col cols="12" md="8" lg="9" class="d-flex justify-start">
          <FiscalYearSlider
            :always-display="true"
            :readonly="loading"
            :default-program-year-id="selectedProgramYearId"
            @select-program-year="selectProgramYear"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" md="4" lg="3">
          <p class="font-weight-bold pt-6 pr-4">Month of service:</p>
        </v-col>
        <!-- <v-col cols="12" md="8" lg="9" class="d-flex justify-start">
          <v-select
            v-model.lazy="selectedReportingMonth"
            :loading="loading"
            :disabled="isSelectMonthDisabled"
            :hide-details="isSelectMonthDisabled"
            :items="allReportingMonths.get(selectedFacilityId) || []"
            item-title="label"
            item-value="value"
            label="Select reporting month"
            variant="outlined"
            :rules="rules.required"
            class="mt-2"
          >
            <template #no-data>
              <v-list-item>
                <v-list-item-title>No available months.</v-list-item-title>
              </v-list-item>
            </template>
          </v-select>
        </v-col> -->
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" md="4" lg="3">
          <p class="font-weight-bold pt-6 pr-4">Facility name:</p>
        </v-col>
        <v-col cols="12" md="8" lg="9" class="d-flex justify-start">
          <v-select
            v-model.lazy="selectedFacilityId"
            :loading="loading"
            :disabled="loading"
            :items="facilityList"
            item-value="facilityId"
            item-title="facilityName"
            label="Select facility"
            variant="outlined"
            class="mt-2"
          >
            <template #no-data>
              <v-list-item>
                <v-list-item-title>No available facilities.</v-list-item-title>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
      </v-row>
    </v-card>
    <v-skeleton-loader :loading="loading" type="table-tbody">
      <v-data-table
        :headers="ECE_REPORTS_TABLE_HEADERS"
        :items="filteredECEReports"
        :items-per-page="10"
        :mobile="null"
        mobile-breakpoint="lg"
        class="elevation-2"
      >
        <template #item.version="{ item }">
          {{ item.versionText }}
          <AppTooltip
            v-if="item.isAdjustment"
            tooltip-content="An Adjustment is a modified version of a submitted Monthly ECE Report."
          />
        </template>
        <template #item.reportingMonth="{ item }"> {{ formatMonthYearToString(item?.month, item?.year) }} </template>
        <!-- <template #item.submissionDeadline="{ item }">
          {{ formatDateToStandardFormat(item.submissionDeadline) }}
        </template> -->
        <template #item.statusCode="{ item }">
          <span class="report-status" :class="getStatusClass(item.statusCode)">
            {{ item.statusText }}
          </span>
        </template>
        <template #item.actions="{ item }">
          <v-row class="action-buttons justify-end justify-lg-start">
            <AppButton
              v-if="isSubmitted(item)"
              :loading="loading"
              :primary="false"
              size="medium"
              @click="goToECEReport(item.eceReportId)"
            >
              View
            </AppButton>
            <AppButton
              v-if="!isSubmitted(item)"
              :loading="loading"
              :disabled="false"
              :primary="false"
              size="medium"
              @click="goToECEReport(item.eceReportId)"
            >
              Edit
            </AppButton>
            <AppButton
              v-if="isSubmitted(item)"
              :loading="loading"
              :disabled="false"
              :primary="false"
              size="medium"
              @click="true"
            >
              Adjust
            </AppButton>
          </v-row>
        </template>
      </v-data-table>
    </v-skeleton-loader>

    <CreateECEReportDialog :show="showCreateECEReportDialog" @close="showCreateECEReportDialog = false" />
  </div>
  <NavButton @previous="$router.back" />
</template>

<script>
import { mapState } from 'pinia';
import AppButton from '@/components/guiComponents/AppButton.vue';
import FiscalYearSlider from '@/components/guiComponents/FiscalYearSlider.vue';
import CreateECEReportDialog from '@/components/manageReports/eceReports/CreateECEReportDialog.vue';
import NavButton from '@/components/util/NavButton.vue';
import ECEReportService from '@/services/eceReportService.js';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { padString } from '@/utils/common.js';
import { ECE_REPORT_STATUSES, PATHS } from '@/utils/constants.js';
import { formatMonthYearToString } from '@/utils/format';

export default {
  name: 'ManageECEReports',
  components: { AppButton, CreateECEReportDialog, FiscalYearSlider, NavButton },
  data() {
    return {
      loading: false,
      eceReports: [],
      selectedProgramYear: null,
      selectedFacilityId: null,
      showCreateECEReportDialog: false,
    };
  },
  computed: {
    ...mapState(useAppStore, ['lookupInfo', 'programYearList']),
    ...mapState(useApplicationStore, ['getFacilityListForPCFByProgramYearId']),
    ...mapState(useOrganizationStore, ['organizationAccountNumber', 'organizationId', 'organizationName']),
    facilityList() {
      return this.getFacilityListForPCFByProgramYearId(this.selectedProgramYearId);
    },
    filteredECEReports() {
      return this.eceReports;
    },
    selectedProgramYearId() {
      return this.selectedProgramYear?.programYearId;
    },
  },
  watch: {
    selectedProgramYearId: {
      async handler() {
        await this.loadData();
        this.selectedFacilityId = null;
        this.selectedReportingMonth = null;
      },
    },
  },
  created() {
    this.PATHS = PATHS;
    this.ECE_REPORTS_TABLE_HEADERS = [
      { title: 'Facility Name', key: 'facilityName' },
      { title: 'Facility ID', key: 'facilityAccountNumber' },
      { title: 'Licence Number', key: 'licenceNumber' },
      { title: 'Month of Service', key: 'reportingMonth' },
      { title: 'Version Number', key: 'version' },
      // { title: 'Submission Deadline', key: 'submissionDeadline' },
      { title: 'Status', key: 'statusCode' },
      { title: 'Actions', key: 'actions', width: '12%', sortable: false },
    ];
    this.selectedProgramYear = this.programYearList?.newApp; // default to current program year
  },
  methods: {
    formatMonthYearToString,
    async loadData() {
      try {
        this.loading = true;
        this.eceReports = await ECEReportService.getECEReports({
          organizationId: this.organizationId,
          programYearId: this.selectedProgramYearId,
        });
        for (const report of this.eceReports || []) {
          const facility = this.facilityList?.find((item) => item.facilityId === report.facilityId);
          report.facilityAccountNumber = facility?.facilityAccountNumber;
          report.facilityName = facility?.facilityName;
          report.licenceNumber = facility?.licenseNumber;
          report.reportingMonth = `${report?.year}-${padString(report?.month, 2, '0')}`; // Format as YYYY-MM to support sorting
        }
        this.sortECEReports();
      } catch (error) {
        console.error(error);
        this.setFailureAlert('An error occurred while loading. Please try again later.');
      } finally {
        this.loading = false;
      }
    },
    // CCFRI-5340
    sortECEReports() {
      this.eceReports?.sort((a, b) => {
        // 1. Facility Name (alphabetical)
        const nameA = a.facilityName ?? '';
        const nameB = b.facilityName ?? '';
        const facilityNameCompare = nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
        if (facilityNameCompare !== 0) {
          return facilityNameCompare;
        }

        // 2. Month of Service (most recent at the top)
        if (a.reportingMonth !== b.reportingMonth) {
          return a.reportingMonth > b.reportingMonth ? -1 : 1;
        }
        // 3. Version (desc - last adjustment to the original report)
        return (b.version ?? 0) - (a.version ?? 0);
      });
    },
    goToECEReport(eceReportId) {
      this.$router.push(`${PATHS.ROOT.MONTHLY_ECE_REPORTS}/${eceReportId}`);
    },
    getStatusClass(status) {
      switch (status) {
        case ECE_REPORT_STATUSES.DRAFT:
          return 'status-yellow';
        case ECE_REPORT_STATUSES.SUBMITTED:
          return 'status-blue';
        case ECE_REPORT_STATUSES.PAID:
          return 'status-green';
        case ECE_REPORT_STATUSES.REJECTED:
          return 'status-red';
        case ECE_REPORT_STATUSES.EXPIRED:
          return 'status-gray';
        case ECE_REPORT_STATUSES.WITH_MINISTRY:
          return 'status-orange';
        case ECE_REPORT_STATUSES.APPROVED:
          return 'status-mint';
        default:
          return null;
      }
    },
    isSubmitted(report) {
      return report.statusCode !== ECE_REPORT_STATUSES.DRAFT;
    },
    selectProgramYear(programYear) {
      this.selectedProgramYear = this.lookupInfo?.programYear?.list?.find(
        (item) => item.programYearId === programYear.programYearId,
      );
    },
    toggleCreateECEReportDialog() {
      this.showCreateECEReportDialog = !this.showCreateECEReportDialog;
    },
  },
};
</script>
