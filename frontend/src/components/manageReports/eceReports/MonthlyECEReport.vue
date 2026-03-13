<template>
  <div v-if="loading" class="text-center">
    <v-progress-circular indeterminate size="100" :width="6" color="#003366" class="min-height-screen" />
  </div>
  <div v-else class="px-12 mb-12">
    <MonthlyECEReportHeader :ece-report="eceReport" :public-sector="publicSector" class="mb-8" />
    <v-alert type="info" color="primary" variant="outlined" class="mb-6">
      <strong>Important:</strong>
      Only staff who hold an active Early Childhood Educator, Infant and Toddler Educator, or Special Needs Educator
      certificate are eligible for the ECE Wage Enhancement.
    </v-alert>

    <AppAlertBanner v-if="isFullRejection" type="error" class="mb-8 w-100">
      This report has been fully rejected - {{ eceReport.reportRejectionReason }}
    </AppAlertBanner>
    <AppAlertBanner v-if="isPartialRejection" type="warning" class="mb-4 w-100">
      One or more ECE hours entries have been rejected. Review the highlighted row(s) below.
    </AppAlertBanner>

    <div v-if="!readonly" class="d-flex justify-end mb-4">
      <AppButton size="medium" :loading="processing" @click="addDialogOpen = true"> Add ECE Staff </AppButton>
    </div>
    <v-card>
      <v-skeleton-loader v-if="processing" type="table-tbody" />
      <v-form v-else ref="form" v-model="isValidForm">
        <v-data-table :items="eceReportStaff" :headers="eceStaffTableHeaders" :items-per-page="10">
          <template v-slot:item="{ item }">
            <tr :class="{ 'rejected-row': isRejectedStaffVisible(item) }">
              <td>{{ getStaffFullName(item) }}</td>
              <td>{{ item.registrationNumber }}</td>
              <td>{{ formatCurrency(item.hourlyWage) }}</td>
              <td>
                <AppNumberInput
                  v-model="item.totalHoursWorked"
                  class="mt-2"
                  :decimal="true"
                  :disabled="readonly"
                  :rules="getTotalHoursWorkedRules(item)"
                  hide-details="auto"
                  max-width="120"
                  variant="outlined"
                />
                <p v-if="showStaffApprovedAmounts(item)" class="mt-2">
                  <strong>Approved:</strong> {{ formatDecimalNumber(item.verifiedHours) }}
                </p>
              </td>
              <td>
                {{ formatCurrency(item.weAmount) }}
                <p v-if="showStaffApprovedAmounts(item)" class="mt-2">
                  <strong>Approved:</strong> {{ formatCurrency(item.approvedWeAmount) }}
                </p>
              </td>
              <td>
                {{ formatCurrency(item.statutoryBenefitAmount) }}
                <p v-if="showStaffApprovedAmounts(item)" class="mt-2">
                  <strong>Approved:</strong> {{ formatCurrency(item.approvedSbAmount) }}
                </p>
              </td>
              <td>
                {{ formatCurrency(item.totalAmount) }}
                <p v-if="showStaffApprovedAmounts(item)" class="mt-2">
                  <strong>Approved:</strong> {{ formatCurrency(item.approvedTotalAmount) }}
                </p>
              </td>
              <td>
                <v-row class="action-buttons justify-end justify-lg-start">
                  <AppButton
                    v-if="showRemoveButton(item)"
                    :loading="loading"
                    :primary="false"
                    color="red"
                    size="small"
                    @click="removeStaff(item)"
                  >
                    Remove
                  </AppButton>
                </v-row>
              </td>
            </tr>
            <tr v-if="isRejectedStaffVisible(item)">
              <td colspan="8"><strong>Rejected:</strong> {{ item.staffRejectionReason }}</td>
            </tr>
          </template>
        </v-data-table>
        <v-divider class="mt-2" />
        <v-table
          class="calculation-summary px-4 ml-lg-auto"
          :class="{ 'calculation-summary--adjustment': isAdjustmentReport }"
        >
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col" class="font-weight-bold text-right">
                {{ isDraftReport ? 'Current $' : 'Reported $' }}
              </th>
              <th v-if="isReportApproved" scope="col" class="font-weight-bold text-right">Approved $</th>
              <template v-if="isAdjustmentReport">
                <th scope="col" class="font-weight-bold text-right">Prev Paid $</th>
                <th scope="col" class="font-weight-bold text-right">Difference $</th>
              </template>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in calculationSummaryRows" :key="row.label">
              <th scope="row" class="font-weight-bold">
                {{ row.label }}
              </th>
              <td :class="getCalculationSummaryRowClass(row)">
                {{ formatCurrency(row.reportedAmount) }}
              </td>
              <td v-if="isReportApproved" :class="getCalculationSummaryRowClass(row)">
                {{ formatCurrency(row.approvedAmount) }}
              </td>
              <template v-if="isAdjustmentReport">
                <td :class="getCalculationSummaryRowClass(row)">
                  {{ formatCurrency(row.previousPaidAmount) }}
                </td>
                <td :class="getCalculationSummaryRowClass(row)">
                  {{ formatCurrency(row.adjustmentDifference) }}
                </td>
              </template>
            </tr>
          </tbody>
        </v-table>
      </v-form>
    </v-card>
  </div>
  <AddECEStaffDialog
    v-model="addDialogOpen"
    :ece-report-id="eceReportId"
    :facility-existing-staff="eceFacilityStaff"
    :report-existing-staff="eceReportStaff"
    @staff-added="addECEStaff"
  />
  <ReportNavButtons
    :loading="isBusy"
    :is-save-displayed="!readonly"
    :is-save-disabled="!readonly && !isValidForm"
    :is-next-displayed="!readonly"
    :is-next-disabled="!isValidForm"
    @previous="previous"
    @next="next"
    @save="save(true)"
  />
</template>

<script>
import { isEmpty, pick } from 'lodash';
import { mapState } from 'pinia';
import AddECEStaffDialog from '@/components/eceStaff/AddECEStaffDialog.vue';
import AppAlertBanner from '@/components/guiComponents/AppAlertBanner.vue';
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppNumberInput from '@/components/guiComponents/AppNumberInput.vue';
import ReportNavButtons from '@/components/guiComponents/ReportNavButtons.vue';
import MonthlyECEReportHeader from '@/components/manageReports/eceReports/MonthlyECEReportHeader.vue';
import alertMixin from '@/mixins/alertMixin.js';
import permissionsMixin from '@/mixins/permissionsMixin.js';
import ApplicationService from '@/services/applicationService.js';
import ECEReportService from '@/services/eceReportService.js';
import ECEStaffService from '@/services/eceStaffService.js';
import { useApplicationStore } from '@/store/application.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { formatCurrency, formatDecimalNumber, formatDecimalNumberToNumber } from '@/utils/format';
import { deepCloneObject, getUpdatedObjectsByKeys, getECEReportRejectionType } from '@/utils/common.js';
import { ECE_REPORT_STAFF_STATUSES, ECE_REPORT_EXTERNAL_STATUSES, PATHS, REJECTION_TYPES } from '@/utils/constants.js';
import { isReportReadOnly } from '@/utils/eceReport.js';
import rules from '@/utils/rules.js';

export default {
  name: 'MonthlyECEReport',
  components: {
    AddECEStaffDialog,
    AppAlertBanner,
    AppButton,
    AppNumberInput,
    MonthlyECEReportHeader,
    ReportNavButtons,
  },
  mixins: [alertMixin, permissionsMixin],
  data() {
    return {
      loading: false,
      processing: false,
      isValidForm: false,
      eceReport: null,
      addDialogOpen: false,
      reportTotals: {},
      eceFacilityStaff: [],
      originalECEReportStaff: [],
      eceReportStaff: [],
      eceReportStaffToDelete: [],
      eceStaffTableHeaders: [
        { title: 'ECE', value: 'fullName', sortable: true },
        { title: 'Registration Number', value: 'registrationNumber', width: 200, sortable: true },
        { title: 'Hourly Wage', value: 'hourlyWage', width: 200, sortable: true },
        { title: 'Total Hours Worked', value: 'totalHoursWorked', sortable: true },
        { title: 'WE Amount', value: 'weAmount', sortable: true },
        { title: 'Statutory Benefit Amount', value: 'statutoryBenefitAmount', sortable: true },
        { title: 'Total', value: 'totalAmount', sortable: true },
        { title: 'Actions', value: 'actions', width: 200, sortable: false },
      ],
      publicSector: globalThis.history?.state?.publicSector ?? null,
      previousReportApprovedAmounts: {},
    };
  },
  computed: {
    ...mapState(useApplicationStore, ['getApplicationIdByProgramYearId']),
    ...mapState(useOrganizationStore, ['organizationId']),
    isBusy() {
      return this.loading || this.processing;
    },
    readonly() {
      return (
        !this.hasPermission(this.PERMISSIONS.EDIT_ECE_REPORT) ||
        isReportReadOnly({ loading: this.isBusy, eceReport: this.eceReport })
      );
    },
    eceReportId() {
      return this.$route.params.eceReportId;
    },
    rates() {
      return {
        weRate: formatDecimalNumberToNumber(this.eceReport?.weRate, null),
        sbRate: formatDecimalNumberToNumber(this.eceReport?.sbRate, null),
      };
    },
    eceFacilityStaffByRegistrationNumber() {
      return new Map((this.eceFacilityStaff ?? []).map((staff) => [staff.registrationNumber, staff]));
    },
    eceFacilityStaffById() {
      return new Map((this.eceFacilityStaff ?? []).map((staff) => [staff.eceStaffId, staff]));
    },
    isAdjustmentReport() {
      return this.eceReport?.isAdjustment;
    },
    isDraftReport() {
      return this.eceReport?.externalStatus === ECE_REPORT_EXTERNAL_STATUSES.DRAFT;
    },
    isReportApproved() {
      return [ECE_REPORT_EXTERNAL_STATUSES.APPROVED, ECE_REPORT_EXTERNAL_STATUSES.PAID].includes(
        this.eceReport?.externalStatus,
      );
    },
    calculationSummaryRows() {
      const previousReport = this.previousReportApprovedAmounts ?? {};
      const rows = [
        {
          label: 'WE Subtotal',
          reportedAmount: this.reportTotals.weSubtotal ?? 0,
          approvedAmount: this.eceReport?.approvedWeSubtotal ?? 0,
          previousPaidAmount: previousReport.approvedWeSubtotal ?? 0,
          bold: false,
        },
        {
          label: 'SB Subtotal',
          reportedAmount: this.reportTotals.sbSubtotal ?? 0,
          approvedAmount: this.eceReport?.approvedSbSubtotal ?? 0,
          previousPaidAmount: previousReport.approvedSbSubtotal ?? 0,
          bold: false,
        },
        {
          label: 'Total',
          reportedAmount: this.reportTotals.total ?? 0,
          approvedAmount: this.eceReport?.approvedTotalAmount ?? 0,
          previousPaidAmount: previousReport.approvedTotalAmount ?? 0,
          bold: true,
        },
      ];
      return rows.map((row) => ({
        ...row,
        adjustmentDifference: this.isReportApproved
          ? row.approvedAmount - row.previousPaidAmount
          : row.reportedAmount - row.previousPaidAmount,
      }));
    },
    isFullRejection() {
      return getECEReportRejectionType(this.eceReport) === REJECTION_TYPES.FULL_REJECTION;
    },
    isPartialRejection() {
      return getECEReportRejectionType(this.eceReport) === REJECTION_TYPES.PARTIAL_REJECTION;
    },
  },
  async created() {
    await this.loadData();
    this.$refs.form?.resetValidation();
  },
  methods: {
    formatCurrency,
    formatDecimalNumber,
    async loadData() {
      try {
        this.loading = true;

        try {
          this.eceReport = await ECEReportService.getECEReport(this.eceReportId);
        } catch (error) {
          if (error.response?.status === 503) {
            this.setWarningAlert('The report is still being finalized. Please try again later.');
            this.previous();
            return;
          }
          throw error;
        }

        const programYearId = this.eceReport?.programYearId;
        const applicationId = programYearId ? this.getApplicationIdByProgramYearId(programYearId) : null;
        if (this.publicSector === null && applicationId) {
          this.publicSector = await ApplicationService.getEceweHeader(applicationId);
        }
        await this.loadECEFacilityStaff();
        this.eceReportStaff = (this.eceReport?.eceStaffInformation ?? []).map((staff) => {
          const facilityStaff = this.eceFacilityStaffById.get(staff.eceStaffId);
          return {
            ...staff,
            eceFacilityStaffId: facilityStaff?.eceFacilityStaffId,
            hourlyWage: facilityStaff?.hourlyWage ?? 0,
            lastName: facilityStaff?.lastName ?? '',
            firstName: facilityStaff?.firstName ?? '',
            registrationNumber: facilityStaff?.registrationNumber ?? '',
          };
        });
        this.initializeStaffChangeState();
        if (this.isAdjustmentReport) {
          this.previousReportApprovedAmounts = await ECEReportService.getECEReportApprovedAmounts(
            this.eceReport.previousReportId,
          );
        }
        this.calculate();
      } catch (error) {
        console.error(error);
        this.setFailureAlert('Failed to load ECE report.');
      }
      this.loading = false;
    },
    async loadECEFacilityStaff() {
      this.eceFacilityStaff = await ECEStaffService.getECEFacilityStaff({
        facilityId: this.eceReport?.facilityId,
      });
    },
    initializeStaffChangeState() {
      this.eceReportStaffToDelete = [];
      this.originalECEReportStaff = deepCloneObject(this.eceReportStaff);
    },
    getTotalHoursWorkedRules(staff) {
      const maxHoursRule = rules.max(195, 'Hours cannot be more than 195');
      const greaterThanZeroRule = rules.greaterThan(0, 'Hours must be greater than 0');
      if (this.isAdjustmentReport && staff.isInheritedFromPreviousReport) {
        return [...rules.required, maxHoursRule];
      }
      return [greaterThanZeroRule, maxHoursRule];
    },
    getCalculationSummaryRowClass(row) {
      return {
        'text-right': true,
        'font-weight-bold': row.bold,
      };
    },
    previous() {
      this.$router.push(PATHS.ROOT.MANAGE_ECE_REPORTS);
    },
    async next() {
      await this.save(false);
      this.$router.push({
        path: `${PATHS.ROOT.MONTHLY_ECE_REPORTS}/${this.eceReportId}/declaration`,
        state: { publicSector: this.publicSector },
      });
    },
    isStaffVerified(staff) {
      return staff?.statusCode === ECE_REPORT_STAFF_STATUSES.VERIFIED;
    },
    showStaffApprovedAmounts(staff) {
      return this.isReportApproved && this.isStaffVerified(staff);
    },
    calculateReportedAmounts(weRate, sbRate) {
      let weSubtotal = 0;
      let sbSubtotal = 0;
      let total = 0;

      for (let staff of this.eceReportStaff) {
        const hours = formatDecimalNumberToNumber(staff.totalHoursWorked) ?? 0;

        const weAmount = weRate * hours;
        const sbAmount = sbRate * hours;
        const totalAmount = weAmount + sbAmount;

        staff.weAmount = weAmount;
        staff.statutoryBenefitAmount = sbAmount;
        staff.totalAmount = totalAmount;

        weSubtotal += weAmount;
        sbSubtotal += sbAmount;
        total += totalAmount;
      }

      this.reportTotals = { weSubtotal, sbSubtotal, total };
    },

    calculate() {
      const { weRate, sbRate } = this.rates;
      if (weRate == null || sbRate == null) {
        throw new Error('Missing WE or SB rate for calculation.');
      }
      this.calculateReportedAmounts(weRate, sbRate);
    },

    addECEStaff(newStaff) {
      this.eceReportStaff.push(newStaff);
    },
    showRemoveButton(staff) {
      return !this.readonly && !staff.isInheritedFromPreviousReport;
    },
    removeStaff(staff) {
      const index = this.eceReportStaff.findIndex((s) => s.registrationNumber === staff.registrationNumber);
      if (index === -1) return;
      if (staff?.eceReportStaffId) {
        this.eceReportStaffToDelete.push(staff.eceReportStaffId);
      }
      this.eceReportStaff.splice(index, 1);
    },
    getStaffFullName(staff) {
      return staff ? `${staff.lastName}, ${staff.firstName}`.trim() : '';
    },
    async save(showMessage) {
      if (this.readonly) return;
      try {
        this.processing = true;
        this.calculate();
        await this.createECEFacilityStaff();
        await this.saveECEReportStaff();
        await this.loadData();
        if (showMessage) {
          this.setSuccessAlert('Report saved successfully.');
        }
      } catch (error) {
        console.error(error);
        this.setFailureAlert('An error occurred while saving.');
      } finally {
        this.processing = false;
      }
    },
    async createECEFacilityStaff() {
      const staffToCreate = this.eceReportStaff
        .filter((staff) => !staff.eceFacilityStaffId)
        .map((staff) => ({
          registrationNumber: staff.registrationNumber,
          firstName: staff.firstName,
          lastName: staff.lastName,
          hourlyWage: formatDecimalNumberToNumber(staff.hourlyWage),
          facilityId: this.eceReport.facilityId,
          organizationId: this.organizationId,
        }));
      if (isEmpty(staffToCreate)) return;
      await ECEStaffService.createECEFacilityStaff(staffToCreate);
      await this.loadECEFacilityStaff();
    },
    async saveECEReportStaff() {
      await this.createECEReportStaff();
      await this.updateECEReportStaff();
      await this.deleteECEReportStaff();
    },
    async createECEReportStaff() {
      const staffToCreate = this.eceReportStaff
        .filter((staff) => !staff.eceReportStaffId)
        .map((staff) => {
          const eceStaffId = this.eceFacilityStaffByRegistrationNumber.get(staff.registrationNumber)?.eceStaffId;
          return {
            eceReportId: this.eceReportId,
            eceStaffId,
            totalHoursWorked: staff.totalHoursWorked,
          };
        });
      if (isEmpty(staffToCreate)) return;
      await ECEStaffService.createECEReportStaff(staffToCreate);
    },
    async updateECEReportStaff() {
      const keysForBackend = ['eceReportStaffId', 'totalHoursWorked'];
      const updatedECEStaff = getUpdatedObjectsByKeys(
        this.originalECEReportStaff,
        this.eceReportStaff,
        keysForBackend,
        'eceReportStaffId',
      );
      const payload = updatedECEStaff
        .filter((staff) => staff.eceReportStaffId)
        .map((staff) => pick(staff, keysForBackend));
      if (isEmpty(payload)) return;
      await ECEStaffService.updateECEReportStaff(payload);
    },
    async deleteECEReportStaff() {
      if (isEmpty(this.eceReportStaffToDelete)) return;
      await ECEStaffService.deleteECEReportStaff(this.eceReportStaffToDelete);
    },
    isRejectedStaffVisible(item) {
      return (
        item.statusCode === ECE_REPORT_STAFF_STATUSES.REJECTED &&
        [ECE_REPORT_EXTERNAL_STATUSES.APPROVED, ECE_REPORT_EXTERNAL_STATUSES.PAID].includes(
          this.eceReport?.externalStatus,
        )
      );
    },
  },
};
</script>
<style scoped>
.calculation-summary {
  font-size: 1.1rem;
  max-width: 500px;
}
.calculation-summary--adjustment {
  max-width: 800px;
}
.rejected-row {
  background-color: #ffe6e6 !important;
}
</style>
