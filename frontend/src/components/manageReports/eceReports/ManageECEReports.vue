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
    <AppButton size="medium" @click="showCreateECEReportDialog = true"> Create ECE Report </AppButton>
    <v-card variant="outlined" class="pa-6 my-6 soft-outline">
      <v-row no-gutters class="pb-4">
        <v-col cols="12" md="4" lg="2">
          <p class="font-weight-bold py-1 pr-4">Select fiscal year:</p>
        </v-col>
        <v-col cols="12" md="8" class="d-flex justify-start">
          <FiscalYearSlider
            :always-display="true"
            :readonly="loading"
            :default-program-year-id="selectedProgramYearId"
            @select-program-year="selectProgramYear"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" md="4" lg="2">
          <p class="font-weight-bold pt-4 pb-2 pr-4">Month of service:</p>
        </v-col>
        <v-col cols="12" md="8" lg="6" class="d-flex justify-start">
          <AppMultiSelectInput
            v-model.lazy="selectedReportingMonths"
            :loading="loading"
            :disabled="loading"
            :items="allReportingMonths"
            all-selected-label="All months"
            item-title="label"
            item-value="value"
            label="Select month of service"
            hide-details
            clearable
          />
        </v-col>
      </v-row>
      <v-row no-gutters class="py-4">
        <v-col cols="12" md="4" lg="2">
          <p class="font-weight-bold pt-4 pb-2 pr-4">Facility name:</p>
        </v-col>
        <v-col cols="12" md="8" lg="6" class="d-flex justify-start">
          <FacilityMultiSelectInput
            v-model="selectedFacilityIds"
            :loading="loading"
            :disabled="loading"
            :items="facilityList"
            item-value="facilityId"
            label="Select facility"
            clearable
            hide-details
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" md="4" lg="2">
          <p class="font-weight-bold pt-4 pb-2 pr-4">Status:</p>
        </v-col>
        <v-col cols="12" md="8" lg="6" class="d-flex justify-start">
          <AppMultiSelectInput
            v-model.lazy="selectedStatuses"
            :loading="loading"
            :disabled="loading"
            :items="ECE_REPORT_STATUS_OPTIONS"
            all-selected-label="All statuses"
            item-title="label"
            item-value="value"
            label="Select status"
            hide-details
            clearable
          />
        </v-col>
      </v-row>
      <AppButton size="medium" :primary="false" class="mt-4" @click="resetFilters"> Reset </AppButton>
    </v-card>
    <v-skeleton-loader :loading="loading" type="table-tbody">
      <v-data-table
        :headers="eceReportTableHeaders"
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
        <template #item.statusCode="{ item }">
          <span class="report-status" :class="getStatusClass(item.statusCode)">
            {{ getStatusText(item.statusCode) }}
          </span>
        </template>
        <template #item.actions="{ item }">
          <v-row class="action-buttons justify-end justify-lg-start">
            <AppButton
              v-if="canView(item)"
              :loading="loading"
              :primary="false"
              size="medium"
              @click="goToECEReport(item.eceReportId)"
            >
              View
            </AppButton>
            <AppButton
              v-if="canEdit(item)"
              :loading="loading"
              :disabled="false"
              :primary="false"
              size="medium"
              @click="edit(item)"
            >
              Edit
            </AppButton>
            <AppButton
              v-if="canAdjust(item)"
              :loading="loading"
              :disabled="false"
              :primary="false"
              size="medium"
              @click="adjust(item)"
            >
              Adjust
            </AppButton>
          </v-row>
        </template>
      </v-data-table>
    </v-skeleton-loader>
    <CreateECEReportDialog v-if="showCreateECEReportDialog" v-model="showCreateECEReportDialog" />
  </div>
  <NavButton @previous="previous" />
</template>

<script>
import { mapState } from 'pinia';
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppMultiSelectInput from '@/components/guiComponents/AppMultiSelectInput.vue';
import AppTooltip from '@/components/guiComponents/AppTooltip.vue';
import FacilityMultiSelectInput from '@/components/guiComponents/FacilityMultiSelectInput.vue';
import FiscalYearSlider from '@/components/guiComponents/FiscalYearSlider.vue';
import CreateECEReportDialog from '@/components/manageReports/eceReports/CreateECEReportDialog.vue';
import NavButton from '@/components/util/NavButton.vue';
import alertMixin from '@/mixins/alertMixin';
import ApplicationService from '@/services/applicationService.js';
import ECEReportService from '@/services/eceReportService.js';
import ECEStaffService from '@/services/eceStaffService.js';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { buildFiscalYearMonths } from '@/utils/common.js';
import { ECE_REPORT_TYPES, ECE_REPORT_STATUS_OPTIONS, ECE_REPORT_STATUSES, PATHS } from '@/utils/constants.js';
import { formatMonthYearToString, formatYearMonthYYYYMM } from '@/utils/format';

const EDIT_LABELS = new Set(['Draft', 'Rejected', 'Submitted']);
const VIEW_LABELS = new Set(['Approved', 'Expired', 'Paid', 'Rejected', 'Submitted', 'With Ministry']);
const ADJUST_LABELS = new Set(['Approved', 'Paid']);

export default {
  name: 'ManageECEReports',
  components: {
    AppButton,
    AppMultiSelectInput,
    AppTooltip,
    CreateECEReportDialog,
    FacilityMultiSelectInput,
    FiscalYearSlider,
    NavButton,
  },
  mixins: [alertMixin],
  data() {
    return {
      loading: false,
      eceReportTableHeaders: [
        { title: 'Facility Name', key: 'facilityName' },
        { title: 'Facility ID', key: 'facilityAccountNumber' },
        { title: 'Licence Number', key: 'licenceNumber' },
        { title: 'Month of Service', key: 'reportingMonth' },
        { title: 'Version Number', key: 'version' },
        { title: 'Status', key: 'statusCode' },
        { title: 'Actions', key: 'actions', width: '12%', sortable: false },
      ],
      eceReports: [],
      selectedProgramYear: null,
      selectedReportingMonths: [],
      selectedFacilityIds: [],
      selectedStatuses: [],
      showCreateECEReportDialog: false,
      publicSector: null,
    };
  },
  computed: {
    ...mapState(useAppStore, ['lookupInfo', 'programYearList']),
    ...mapState(useApplicationStore, ['getFacilityListForPCFByProgramYearId', 'getApplicationIdByProgramYearId']),
    ...mapState(useOrganizationStore, ['organizationAccountNumber', 'organizationId', 'organizationName']),
    canEdit() {
      return (eceReport) => EDIT_LABELS.has(this.getStatusText(eceReport.statusCode));
    },
    canView() {
      return (eceReport) => VIEW_LABELS.has(this.getStatusText(eceReport.statusCode));
    },
    canAdjust() {
      return (eceReport) => {
        const result =
          !this.hasNextReportCreated(eceReport) && ADJUST_LABELS.has(this.getStatusText(eceReport.statusCode));
        return result;
      };
    },
    selectedApplicationId() {
      return this.getApplicationIdByProgramYearId(this.selectedProgramYearId);
    },
    facilityList() {
      return this.getFacilityListForPCFByProgramYearId(this.selectedProgramYearId);
    },
    filteredECEReports() {
      return this.eceReports?.filter((report) => {
        const matchesMonth = this.selectedReportingMonths?.some(
          (item) => Number(item.month) === Number(report.month) && Number(item.year) === Number(report.year),
        );
        const matchesFacility = this.selectedFacilityIds?.includes(report.facilityId);
        const matchesStatus = this.selectedStatuses?.includes(report.statusCode);
        return matchesMonth && matchesFacility && matchesStatus;
      });
    },
    selectedProgramYearId() {
      return this.selectedProgramYear?.programYearId;
    },
    allReportingMonths() {
      const programYear = this.lookupInfo?.programYear?.list?.find(
        (year) => year.programYearId === this.selectedProgramYearId,
      );
      return buildFiscalYearMonths(programYear?.intakeStart, programYear?.intakeEnd);
    },
    allFacilityIds() {
      return this.facilityList?.map((facility) => facility.facilityId);
    },
  },
  watch: {
    selectedProgramYearId: {
      async handler() {
        await this.loadData();
      },
    },
  },
  created() {
    this.ECE_REPORT_STATUS_OPTIONS = ECE_REPORT_STATUS_OPTIONS;
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
          report.reportingMonth = formatYearMonthYYYYMM(report?.year, report?.month);
        }
        this.resetFilters();
        this.sortECEReports();
        this.publicSector = await ApplicationService.getEceweHeader(this.selectedApplicationId);
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
    resetFilters() {
      this.selectedReportingMonths = this.allReportingMonths.map((month) => month.value);
      this.selectedFacilityIds = this.allFacilityIds;
      this.selectedStatuses = this.ECE_REPORT_STATUS_OPTIONS.map((status) => status.value);
    },
    previous() {
      this.$router.push(PATHS.ROOT.MANAGE_REPORTS);
    },
    goToECEReport(eceReportId) {
      this.$router.push({
        path: `${PATHS.ROOT.MONTHLY_ECE_REPORTS}/${eceReportId}`,
        state: { publicSector: this.publicSector },
      });
    },
    getStatusText(statusCode) {
      const status = ECE_REPORT_STATUS_OPTIONS.find((option) => option.value === statusCode);
      return status?.label ?? '';
    },
    getStatusClass(status) {
      switch (status) {
        case ECE_REPORT_STATUSES.DRAFT:
          return 'status-yellow';
        case ECE_REPORT_STATUSES.SUBMITTED:
          return 'status-blue';
        case ECE_REPORT_STATUSES.IN_REVIEW:
          return 'status-orange';
        case ECE_REPORT_STATUSES.PAID:
          return 'status-green';
        case ECE_REPORT_STATUSES.REJECTED:
          return 'status-red';
        case ECE_REPORT_STATUSES.EXPIRED:
          return 'status-gray';
        case ECE_REPORT_STATUSES.APPROVED:
          return 'status-mint';
        default:
          return null;
      }
    },
    hasNextReportCreated(eceReport) {
      return this.eceReports?.some(
        (item) =>
          item.facilityId === eceReport.facilityId &&
          item.month === eceReport.month &&
          item.year === eceReport.year &&
          item.version > eceReport.version,
      );
    },
    async edit(eceReport) {
      try {
        this.loading = true;
        const externalStatus = this.getStatusText(eceReport.statusCode);
        if (externalStatus === 'Submitted' || externalStatus === 'Rejected') {
          await ECEReportService.updateECEReportStatus(eceReport.eceReportId, {
            statusCode: ECE_REPORT_STATUSES.DRAFT,
          });
        }
        this.goToECEReport(eceReport.eceReportId);
      } catch (e) {
        console.error(e);
        this.setFailureAlert('Unable to open report for editing.');
      } finally {
        this.loading = false;
      }
    },
    async adjust(eceReport) {
      try {
        this.loading = true;
        const newEceReportId = await this.createAdjustmentReport(eceReport);
        await this.copyStaffToAdjustment(eceReport.eceReportId, newEceReportId);
        this.goToECEReport(newEceReportId);
      } catch (e) {
        console.error(e);
        this.setFailureAlert('Unable to create adjustment.');
      } finally {
        this.loading = false;
      }
    },
    async createAdjustmentReport(sourceReport) {
      const { year, month } = this.parseReportingMonth(sourceReport.reportingMonth);
      const { data: newEceReportId } = await ECEReportService.createECEReport(
        this.createAdjustmentPayload(sourceReport, year, month),
      );
      const adjustmentVersion = (sourceReport.version ?? 1) + 1;
      await ECEReportService.updateECEReportVersion(newEceReportId, adjustmentVersion);
      return newEceReportId;
    },
    createAdjustmentPayload(sourceReport, year, month) {
      return {
        organizationId: sourceReport.organizationId,
        facilityId: sourceReport.facilityId,
        programYearId: sourceReport.programYearId,
        month,
        year,
        reportType: ECE_REPORT_TYPES.ADJUSTMENT,
      };
    },
    async copyStaffToAdjustment(sourceReportId, targetReportId) {
      const details = await ECEReportService.getECEReport(sourceReportId);
      const sourceStaff = details?.eceStaffInformation ?? [];
      const payload = this.buildStaffPayload(targetReportId, sourceStaff);
      if (payload.length === 0) return;
      await ECEStaffService.createECEReportStaff(payload);
    },
    buildStaffPayload(targetReportId, staff = []) {
      return staff
        .filter((s) => s?.eceStaffId)
        .map(({ eceStaffId, hourlyWage, totalHoursWorked }) => ({
          eceReportId: targetReportId,
          eceStaffId,
          hourlyWage,
          totalHoursWorked,
        }));
    },
    parseReportingMonth(reportingMonth) {
      const [year, month] = (reportingMonth ?? '').split('-').map(Number);
      return { year, month };
    },
    selectProgramYear(programYear) {
      this.selectedProgramYear = this.lookupInfo?.programYear?.list?.find(
        (item) => item.programYearId === programYear.programYearId,
      );
    },
  },
};
</script>
