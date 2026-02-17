<template>
  <div v-if="loading" class="text-center">
    <v-progress-circular indeterminate size="100" :width="6" color="#003366" class="min-height-screen" />
  </div>
  <div v-else class="px-12 mb-12">
    <MonthlyECEReportHeader :ece-report="eceReport" class="mb-8" />
    <div class="d-flex justify-end mb-4">
      <AppButton size="medium" :loading="processing" @click="addDialogOpen = true"> Add ECE Staff </AppButton>
    </div>
    <v-card>
      <v-skeleton-loader v-if="processing" type="table-tbody" />
      <v-form v-else ref="form" v-model="isValidForm">
        <v-data-table :items="eceReportStaff" :headers="eceStaffTableHeaders" :items-per-page="10">
          <template #item.fullName="{ item }">
            <span>{{ getStaffFullName(item) }}</span>
          </template>
          <template #item.hourlyWage="{ item }">
            <span>{{ formatCurrency(item.hourlyWage) }}</span>
          </template>
          <template #item.totalHoursWorked="{ item }">
            <div class="py-2">
              <AppNumberInput
                v-model="item.totalHoursWorked"
                :decimal="true"
                :disabled="readonly"
                :rules="[
                  rules.greaterThan(0, 'Hours must be greater than 0'),
                  rules.max(195, 'Hours cannot be more than 195'),
                ]"
                hide-details="auto"
                max-width="120"
                variant="outlined"
              />
              <!-- TODO (vietle-cgi): Add Verified value from CMS -->
              <p v-if="showVerified"><strong>Verified:</strong> {{ formatDecimalNumber(0) }}</p>
            </div>
          </template>
          <template #item.weAmount="{ item }">
            <p>{{ formatCurrency(item.weAmount) }}</p>
            <!-- TODO (vietle-cgi): Add Verified value from CMS -->
            <p v-if="showVerified"><strong>Verified:</strong> {{ formatCurrency(0) }}</p>
          </template>
          <template #item.statutoryBenefitAmount="{ item }">
            <p>{{ formatCurrency(item.statutoryBenefitAmount) }}</p>
            <!-- TODO (vietle-cgi): Add Verified value from CMS -->
            <p v-if="showVerified"><strong>Verified:</strong> {{ formatCurrency(0) }}</p>
          </template>
          <template #item.totalAmount="{ item }">
            <p>{{ formatCurrency(item.totalAmount) }}</p>
            <!-- TODO (vietle-cgi): Add Verified value from CMS -->
            <p v-if="showVerified"><strong>Verified:</strong> {{ formatCurrency(0) }}</p>
          </template>
          <template #item.actions="{ item }">
            <v-row class="action-buttons justify-end justify-lg-start">
              <AppButton
                v-if="showRemoveButton"
                :loading="loading"
                :primary="false"
                color="red"
                size="small"
                @click="removeStaff(item)"
              >
                Remove
              </AppButton>
            </v-row>
          </template>
        </v-data-table>
        <v-divider class="mt-2" />
        <div class="calculation-summary px-4 ml-lg-auto" :class="{ 'calculation-summary--verified': showVerified }">
          <v-table>
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col" class="font-weight-bold text-right">Reported</th>
                <!-- TODO (vietle-cgi): Implement Verified ECE Reports -->
                <th v-if="showVerified" scope="col" class="font-weight-bold text-right">Verified</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" class="font-weight-bold">WE Subtotal</th>
                <td class="text-right">{{ formatCurrency(reportTotals.weSubtotal) }}</td>
                <td v-if="showVerified" class="text-right">
                  {{ formatCurrency(0) }}
                </td>
              </tr>
              <tr>
                <th scope="row" class="font-weight-bold">SB Subtotal</th>
                <td class="text-right">{{ formatCurrency(reportTotals.sbSubtotal) }}</td>
                <td v-if="showVerified" class="text-right">
                  {{ formatCurrency(0) }}
                </td>
              </tr>
              <tr>
                <th scope="row" class="font-weight-bold">Total</th>
                <td class="text-right font-weight-bold">
                  {{ formatCurrency(reportTotals.total) }}
                </td>
                <td v-if="showVerified" class="text-right font-weight-bold">
                  {{ formatCurrency(0) }}
                </td>
              </tr>
            </tbody>
          </v-table>
        </div>
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
    :loading="loading || processing"
    :is-save-displayed="!readonly"
    :is-save-disabled="!readonly && !isValidForm"
    :is-next-displayed="true"
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
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppNumberInput from '@/components/guiComponents/AppNumberInput.vue';
import ReportNavButtons from '@/components/guiComponents/ReportNavButtons.vue';
import MonthlyECEReportHeader from '@/components/manageReports/eceReports/MonthlyECEReportHeader.vue';
import alertMixin from '@/mixins/alertMixin.js';
import ECEReportService from '@/services/eceReportService.js';
import ECEStaffService from '@/services/eceStaffService.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { formatCurrency, formatDecimalNumber, formatDecimalNumberToNumber } from '@/utils/format';
import { deepCloneObject, getUpdatedObjectsByKeys } from '@/utils/common.js';
import { ECE_REPORT_STATUSES, PATHS } from '@/utils/constants.js';
import { isReportReadOnly } from '@/utils/eceReport.js';
import rules from '@/utils/rules.js';

export default {
  name: 'MonthlyECEReport',
  components: { AddECEStaffDialog, AppButton, AppNumberInput, MonthlyECEReportHeader, ReportNavButtons },
  mixins: [alertMixin],
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
    };
  },
  computed: {
    ...mapState(useOrganizationStore, ['organizationId']),
    readonly() {
      return isReportReadOnly({ loading: this.loading || this.processing, eceReport: this.eceReport });
    },
    eceReportId() {
      return this.$route.params.eceReportId;
    },
    eceFacilityStaffByRegistrationNumber() {
      return new Map((this.eceFacilityStaff ?? []).map((staff) => [staff.registrationNumber, staff]));
    },
    eceFacilityStaffById() {
      return new Map((this.eceFacilityStaff ?? []).map((staff) => [staff.eceStaffId, staff]));
    },
    showVerified() {
      return [ECE_REPORT_STATUSES.VERIFIED, ECE_REPORT_STATUSES.APPROVED, ECE_REPORT_STATUSES.PAID].includes(
        this.eceReport?.statusCode,
      );
    },
    showRemoveButton() {
      return !this.eceReport?.isAdjustment && !this.readonly;
    },
  },
  async created() {
    this.rules = rules;
    await this.loadData();
    this.$refs.form?.resetValidation();
  },
  methods: {
    formatCurrency,
    formatDecimalNumber,
    async loadData() {
      try {
        this.loading = true;
        this.eceReport = await ECEReportService.getECEReport(this.eceReportId);
        await this.loadECEFacilityStaff();
        this.eceReportStaff = (this.eceReport?.eceStaffInformation ?? []).map((staff) => {
          const facilityStaff = this.eceFacilityStaffById.get(staff.eceStaffId);
          return {
            ...staff,
            eceFacilityStaffId: facilityStaff?.eceFacilityStaffId,
            lastName: facilityStaff?.lastName ?? '',
            firstName: facilityStaff?.firstName ?? '',
            registrationNumber: facilityStaff?.registrationNumber ?? '',
          };
        });
        this.initializeStaffChangeState();
        this.calculate();
      } catch (error) {
        console.error(error);
        this.setFailureAlert('Failed to load ECE report');
      } finally {
        this.loading = false;
      }
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
    previous() {
      this.$router.push(PATHS.ROOT.MANAGE_ECE_REPORTS);
    },
    async next() {
      await this.save(false);
      this.$router.push(`${PATHS.ROOT.MONTHLY_ECE_REPORTS}/${this.eceReportId}/declaration`);
    },
    calculate() {
      let weSubtotal = 0;
      let sbSubtotal = 0;
      let total = 0;
      for (const staff of this.eceReportStaff) {
        const hours = staff.totalHoursWorked || 0;
        const weAmount = this.eceReport.weRate * hours;
        const statutoryBenefitAmount = this.eceReport.sbRate * hours;
        const totalAmount = weAmount + statutoryBenefitAmount;
        staff.weAmount = weAmount;
        staff.statutoryBenefitAmount = statutoryBenefitAmount;
        staff.totalAmount = totalAmount;
        weSubtotal += weAmount;
        sbSubtotal += statutoryBenefitAmount;
        total += totalAmount;
      }
      this.reportTotals = { weSubtotal, sbSubtotal, total };
    },
    addECEStaff(newStaff) {
      this.eceReportStaff.push(newStaff);
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
            hourlyWage: staff.hourlyWage,
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
  },
};
</script>
<style scoped>
.calculation-summary {
  font-size: 1.1rem;
  max-width: 500px;
}
.calculation-summary--verified {
  max-width: 700px;
}
</style>
