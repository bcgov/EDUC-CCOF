<template>
  <div v-if="loading" class="text-center">
    <v-progress-circular indeterminate size="100" :width="6" color="#003366" class="min-height-screen" />
  </div>
  <div v-else class="px-12 mb-12">
    <MonthlyECEReportHeader :ece-report="eceReport" class="mb-8" />
    <v-card>
      <v-form ref="form" v-model="isValidForm">
        <v-data-table :items="reportECEStaff" :headers="eceStaffTableHeaders" :items-per-page="10">
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
          <!-- TODO (vietle-cgi): Implement ECE Staff remove -->
          <template #item.actions>
            <v-row class="action-buttons justify-end justify-lg-start">
              <AppButton
                v-if="showRemoveButton"
                :loading="loading"
                :primary="false"
                color="red"
                size="small"
                @click="setWarningAlert('Remove ECE staff functionality is not yet implemented.')"
              >
                Remove
              </AppButton>
            </v-row>
          </template>
        </v-data-table>
        <v-divider class="mt-2" />
        <!-- TODO (vietle-cgi): Implement ECE Reports calculation -->
        <div class="calculation-summary px-4 ml-lg-auto" :class="{ 'calculation-summary--verified': showVerified }">
          <v-table>
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col" class="font-weight-bold text-right">Reported</th>
                <th v-if="showVerified" scope="col" class="font-weight-bold text-right">Verified</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" class="font-weight-bold">WE Subtotal</th>
                <td class="text-right">{{ formatCurrency(0) }}</td>
                <td v-if="showVerified" class="text-right">
                  {{ formatCurrency(0) }}
                </td>
              </tr>
              <tr>
                <th scope="row" class="font-weight-bold">SB Subtotal</th>
                <td class="text-right">{{ formatCurrency(0) }}</td>
                <td v-if="showVerified" class="text-right">
                  {{ formatCurrency(0) }}
                </td>
              </tr>
              <tr>
                <th scope="row" class="font-weight-bold">Total</th>
                <td class="text-right font-weight-bold">
                  {{ formatCurrency(0) }}
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
  <ReportNavButtons
    :loading="loading || processing"
    :is-save-displayed="!readonly"
    :is-next-displayed="true"
    :is-next-disabled="!isValidForm"
    @previous="previous"
    @next="next"
    @save="save(true)"
  />
</template>

<script>
import { pick } from 'lodash';
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppNumberInput from '@/components/guiComponents/AppNumberInput.vue';
import ReportNavButtons from '@/components/guiComponents/ReportNavButtons.vue';
import MonthlyECEReportHeader from '@/components/manageReports/eceReports/MonthlyECEReportHeader.vue';
import alertMixin from '@/mixins/alertMixin.js';
import ECEReportService from '@/services/eceReportService.js';
import ECEStaffService from '@/services/eceStaffService.js';
import { formatCurrency, formatDecimalNumber } from '@/utils/format';
import { deepCloneObject, getUpdatedObjectsByKeys } from '@/utils/common.js';
import { ECE_REPORT_STATUSES, PATHS } from '@/utils/constants.js';
import { isReportReadOnly } from '@/utils/eceReport.js';
import rules from '@/utils/rules.js';

export default {
  name: 'MonthlyECEReport',
  components: { AppButton, AppNumberInput, MonthlyECEReportHeader, ReportNavButtons },
  mixins: [alertMixin],
  data() {
    return {
      loading: false,
      processing: false,
      isValidForm: false,
      eceReport: null,
      reportCalculationSummary: {},
      facilityECEStaff: [],
      reportECEStaff: [],
      originalReportECEStaff: [],
      eceStaffTableHeaders: [
        { title: 'ECE', value: 'fullName', sortable: true },
        { title: 'Registration Number', value: 'registrationNumber', width: 200, sortable: true },
        { title: 'Hourly Wage', value: 'hourlyWage', width: 200, sortable: true },
        { title: 'Total Hours Worked', value: 'totalHoursWorked', sortable: true },
        { title: 'WE Amount', value: 'weAmount', sortable: true },
        { title: 'Statutory Benefit Amount', value: 'statutoryBenefitAmount', sortable: true },
        { title: 'Total', value: 'totalAmount', sortable: true },
        // { title: 'Reason', sortable: false, value: 'reason' },
        { title: 'Actions', value: 'actions', width: 200, sortable: false },
      ],
    };
  },
  computed: {
    readonly() {
      return isReportReadOnly({ loading: this.loading, eceReport: this.eceReport });
    },
    facilityECEStaffById() {
      return new Map((this.facilityECEStaff ?? []).map((staff) => [staff.eceStaffId, staff]));
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
        this.eceReport = await ECEReportService.getECEReport(this.$route.params.eceReportId);
        this.facilityECEStaff = await ECEStaffService.getECEStaff({
          facilityId: this.eceReport?.facilityId,
        });
        this.reportECEStaff = (this.eceReport?.eceStaffInformation ?? []).map((staff) => {
          const facilityStaff = this.facilityECEStaffById.get(staff.eceStaffId);
          return {
            ...staff,
            fullName: facilityStaff ? `${facilityStaff.lastName}, ${facilityStaff.firstName}`.trim() : '',
            registrationNumber: facilityStaff?.registrationNumber ?? '',
          };
        });
        this.originalReportECEStaff = deepCloneObject(this.reportECEStaff);
        // TODO (vietle-cgi): Implement ECE Reports calculation
        this.reportCalculationSummary = {
          weSubtotal: 0,
          sbSubtotal: 0,
          total: 0,
        };
      } catch (error) {
        console.error(error);
        this.setFailureAlert('Failed to load ECE report');
      } finally {
        this.loading = false;
      }
    },
    previous() {
      this.$router.push(PATHS.ROOT.MANAGE_ECE_REPORTS);
    },
    async next() {
      await this.save(false);
      this.$router.push(`${PATHS.ROOT.MONTHLY_ECE_REPORTS}/${this.$route.params.eceReportId}/declaration`);
    },
    // TODO (vietle-cgi): Implement ECE Reports calculation
    calculate() {
      this.setWarningAlert('Calculate functionality is not yet implemented.');
    },
    async save(showMessage) {
      if (this.readonly) return;
      try {
        this.processing = true;
        this.calculate();
        await this.saveECEStaffInformation();
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
    async saveECEStaffInformation() {
      const keysForBackend = ['eceStaffInformationId', 'totalHoursWorked'];
      const updatedECEStaff = getUpdatedObjectsByKeys(
        this.originalReportECEStaff,
        this.reportECEStaff,
        keysForBackend,
        'eceStaffInformationId',
      );
      const payload = updatedECEStaff.map((item) => pick(item, keysForBackend));
      await ECEReportService.updateECEStaffInformation(payload);
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
