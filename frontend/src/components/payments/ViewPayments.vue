<template>
  <v-container class="pa-2 text-body-1" fluid>
    <p class="mb-4">View and manage the payment records of your organization.</p>

    <div class="mb-8">
      <v-row dense>
        <v-row no-gutters class="py-2 align-center">
          <v-col cols="12" class="d-flex align-center flex-wrap">
            <p class="font-weight-bold py-1 mr-2 mb-0" style="white-space: nowrap">Select fiscal year:</p>
            <FiscalYearSlider
              :always-display="true"
              :readonly="isLoading"
              class="ml-4"
              @select-program-year="selectProgramYear"
            />
          </v-col>
        </v-row>

        <v-col cols="12" lg="5" class="custom-vcol">
          <p>Month of service:</p>
          <AppMultiSelectInput
            v-model.lazy="selectedPaymentMonths"
            :loading="isLoading"
            :disabled="isLoading"
            :items="allPaymentsMonths"
            item-title="label"
            item-value="value"
            label="Month of service"
            hide-details
            clearable
            class="flex-grow-1"
          />
        </v-col>

        <v-col cols="12" lg="6" class="custom-vcol">
          <p>Facility name:</p>
          <AppMultiSelectInput
            v-model.lazy="selectedFacilities"
            :loading="isLoading"
            :disabled="isLoading"
            :items="facilityList"
            item-value="facilityId"
            item-title="facilityName"
            label="Facility name"
            clearable
            hide-details
            class="flex-grow-1"
          />
        </v-col>

        <v-col lg="1"></v-col>

        <v-col cols="12" lg="5" class="custom-vcol">
          <p>Facility ID:</p>
          <v-text-field
            v-model="facilityIdSearch"
            label="Facility ID"
            variant="outlined"
            clearable
            hide-details
            class="flex-grow-1"
          />
        </v-col>

        <v-col cols="12" lg="6" class="custom-vcol">
          <p>Funding type:</p>
          <AppMultiSelectInput
            v-model.lazy="selectedFundingTypes"
            :loading="isLoading"
            :disabled="isLoading"
            :items="allFundingTypes"
            item-value="value"
            item-title="label"
            label="Funding type"
            clearable
            hide-details
            class="flex-grow-1"
          />
        </v-col>

        <v-col lg="1"></v-col>

        <v-col cols="12" lg="5" class="custom-vcol">
          <p class="mr-lg-2">Select paid date(s):</p>
          <v-row dense no-gutters>
            <v-col cols="12" md="6" class="pr-md-2 mb-2 mb-md-0">
              <AppDateInput
                v-model="paidStartDate"
                hide-details
                placeholder="Paid start date"
                label="Paid start date"
                class="w-100"
              />
            </v-col>
            <v-col cols="12" md="6">
              <AppDateInput
                v-model="paidEndDate"
                hide-details
                placeholder="Paid end date"
                label="Paid end date"
                class="w-100"
              />
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" lg="6" class="custom-vcol">
          <p>Invoice number:</p>
          <v-text-field
            v-model="invoiceNumberSearch"
            label="Invoice number"
            variant="outlined"
            clearable
            hide-details
            class="flex-grow-1"
          />
        </v-col>
        <v-col cols="12" class="d-flex justify-end mt-n4">
          <AppButton size="small" color="primary" @click="resetFilters"> Reset </AppButton>
        </v-col>
      </v-row>
    </div>
    <v-skeleton-loader :loading="isLoading" type="table-tbody">
      <v-data-table
        :headers="paymentTableHeaders"
        :items="filteredPayments"
        :items-per-page="20"
        :items-per-page-options="[10, 20, 50]"
        :mobile="null"
        mobile-breakpoint="md"
        class="elevation-2"
      >
        <template #item.paymentPeriod="{ item }">
          {{ formatMonthYearToString(item.paymentMonth, item.paymentYear) }}
        </template>

        <template #item.paymentAmount="{ item }"> {{ formatCurrency(item.paymentAmount) }} </template>

        <template #[`item.approvedDate`]="{ item }">
          {{ formatUTCDate(item.approvedDate) }}
        </template>

        <template #[`item.paidDate`]="{ item }">
          {{ formatUTCDate(item.paidDate) }}
        </template>

        <template #[`item.paymentStatusCode`]="{ item }">
          <span :class="getStatusClass(item.paymentStatusCode)">
            {{ getDisplayStatus(item.paymentStatusCode) }}
          </span>
        </template>
      </v-data-table>
    </v-skeleton-loader>
  </v-container>
</template>

<script>
import { isEmpty } from 'lodash';
import moment from 'moment';
import { mapState } from 'pinia';

import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDateInput from '@/components/guiComponents/AppDateInput.vue';
import AppMultiSelectInput from '@/components/guiComponents/AppMultiSelectInput.vue';
import FiscalYearSlider from '@/components/guiComponents/FiscalYearSlider.vue';

import alertMixin from '@/mixins/alertMixin.js';
import permissionsMixin from '@/mixins/permissionsMixin.js';

import PaymentService from '@/services/paymentService.js';

import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';

import { PAYMENT_STATUSES, PAYMENT_STATUS_TEXTS } from '@/utils/constants.js';
import { formatCurrency, formatMonthYearToString, formatUTCDate } from '@/utils/format';

export default {
  name: 'ViewPayments',
  components: { AppButton, AppDateInput, AppMultiSelectInput, FiscalYearSlider },
  mixins: [alertMixin, permissionsMixin],
  data() {
    return {
      isLoading: false,
      payments: [],
      selectedFacilities: [],
      selectedFundingTypes: [],
      selectedPaymentMonths: [],
      selectedProgramYear: null,
      facilityIdSearch: '',
      invoiceNumberSearch: '',
      paidStartDate: null,
      paidEndDate: null,
      paymentTableHeaders: [
        { title: 'Facility Name', sortable: true, value: 'facilityName' },
        { title: 'Facility ID', sortable: true, value: 'facilityAccountNumber' },
        { title: 'Licence Number', sortable: true, value: 'licenceNumber' },
        { title: 'Month of Service', sortable: true, value: 'paymentPeriod', width: '200px' },
        { title: 'Funding Type', sortable: true, value: 'fundingTypeText' },
        { title: 'Base/Adjustment Report', sortable: true, value: 'reportTypeText' },
        { title: 'Amount($)', sortable: true, value: 'paymentAmount' },
        { title: 'Approved Date', sortable: true, value: 'approvedDate' },
        { title: 'Paid Date', sortable: true, value: 'paidDate', width: '150px' },
        { title: 'Invoice Number', sortable: true, value: 'invoiceNumber', width: '150px' },
        { title: 'Payment Line Status', sortable: true, value: 'paymentStatusCode' },
      ],
    };
  },
  computed: {
    ...mapState(useAppStore, ['lookupInfo']),
    ...mapState(useApplicationStore, ['getFacilityListForPCFByProgramYearId', 'programYearId']),
    ...mapState(useOrganizationStore, ['organizationId']),

    facilityList() {
      return this.getFacilityListForPCFByProgramYearId(this.selectedProgramYearId);
    },

    allPaymentsMonths() {
      const availablePaymentMonths = [];
      const programYear = this.lookupInfo?.programYear?.list?.find(
        (year) => year.programYearId === this.selectedProgramYearId,
      );
      const startYear = moment(programYear?.intakeStart).year();
      const endYear = moment(programYear?.intakeEnd).year();
      for (let month = 4; month < 13; month++) {
        availablePaymentMonths.push({
          label: `${formatMonthYearToString(month, startYear)}`,
          value: {
            month: month,
            year: startYear,
          },
        });
      }
      for (let month = 1; month < 4; month++) {
        availablePaymentMonths.push({
          label: `${formatMonthYearToString(month, endYear)}`,
          value: {
            month: month,
            year: endYear,
          },
        });
      }
      return availablePaymentMonths;
    },

    selectedProgramYearId() {
      return this.selectedProgramYear ? this.selectedProgramYear.programYearId : this.programYearId;
    },

    allFundingTypes() {
      const fundingSet = new Set(this.payments.map((p) => p.fundingTypeText));
      return Array.from(fundingSet).map((f) => ({ label: f, value: f }));
    },

    filteredPayments() {
      if (isEmpty(this.payments)) return [];

      const facilityIdSearchTerm = (this.facilityIdSearch || '').toLowerCase();
      const invoiceSearchTerm = (this.invoiceNumberSearch || '').toLowerCase();

      return this.payments.filter((payment) => {
        const isMonthSelected = this.selectedPaymentMonths?.some(
          (item) => Number(payment.paymentMonth) === item.month && Number(payment.paymentYear) === item.year,
        );

        const isFacilitySelected = this.selectedFacilities?.includes(payment.facilityId);

        const fundingSelected = this.selectedFundingTypes?.includes(payment.fundingTypeText);

        const facilityIdMatch = payment.facilityAccountNumber?.toLowerCase().includes(facilityIdSearchTerm);

        const invoiceMatch = payment.invoiceNumber?.toLowerCase().includes(invoiceSearchTerm);

        const paidStartMatch = !this.paidStartDate || new Date(payment.paidDate) >= new Date(this.paidStartDate);

        const paidEndMatch = !this.paidEndDate || new Date(payment.paidDate) <= new Date(this.paidEndDate);

        return (
          isMonthSelected &&
          isFacilitySelected &&
          fundingSelected &&
          facilityIdMatch &&
          invoiceMatch &&
          paidStartMatch &&
          paidEndMatch
        );
      });
    },
  },

  watch: {
    selectedProgramYearId: {
      async handler() {
        await this.loadData();
      },
    },
  },

  async created() {
    await this.loadData();
  },

  methods: {
    formatCurrency,
    formatMonthYearToString,
    formatUTCDate,
    async loadData() {
      this.selectedFacilities = this.facilityList?.map((facility) => facility.facilityId);
      this.selectedPaymentMonths = this.allPaymentsMonths?.map((report) => report.value);
      await this.loadPayments();
      this.selectedFundingTypes = this.allFundingTypes.map((f) => f.value);
    },

    async loadPayments() {
      try {
        this.isLoading = true;
        this.payments = (
          await PaymentService.getPayments({
            organizationId: this.organizationId,
            programYearId: this.selectedProgramYearId,
          })
        ).filter((payment) => payment.paymentAmount !== 0);

        this.payments.forEach((payment) => {
          const facility = this.facilityList?.find((item) => item.facilityId === payment.facilityId);
          payment.facilityAccountNumber = facility?.facilityAccountNumber || '';
          payment.facilityName = facility?.facilityName || '';
          payment.paymentPeriod = `${payment.paymentYear}-${String(payment.paymentMonth).padStart(2, '0')}`;
        });
        this.sortPayments();
      } catch (error) {
        this.setFailureAlert('Failed to load Payments');
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },

    selectProgramYear(programYear) {
      this.selectedProgramYear = programYear;
    },

    getDisplayStatus(statusCode) {
      switch (statusCode) {
        case PAYMENT_STATUSES.APPROVED_PAYMENT:
        case PAYMENT_STATUSES.INVOICED:
        case PAYMENT_STATUSES.PROCESSING_PAYMENT:
        case PAYMENT_STATUSES.PROCESSING_ERROR:
          return PAYMENT_STATUS_TEXTS.APPROVED;
        case PAYMENT_STATUSES.HOLD:
          return PAYMENT_STATUS_TEXTS.PENDING;
        case PAYMENT_STATUSES.PAID:
          return PAYMENT_STATUS_TEXTS.PAID;
        case PAYMENT_STATUSES.CANCELLED:
          return PAYMENT_STATUS_TEXTS.CANCELLED;
        default:
          return null;
      }
    },

    getStatusClass(statusCode) {
      const displayStatus = this.getDisplayStatus(statusCode);

      switch (displayStatus) {
        case PAYMENT_STATUS_TEXTS.APPROVED:
          return 'status-mint';
        case PAYMENT_STATUS_TEXTS.PENDING:
          return 'status-yellow';
        case PAYMENT_STATUS_TEXTS.PAID:
          return 'status-green';
        case PAYMENT_STATUS_TEXTS.CANCELLED:
          return 'status-red';
        default:
          return null;
      }
    },

    sortPayments() {
      this.payments.sort((a, b) => {
        // 1. Sort by paymentPeriod DESC (newest first)
        if (b.paymentPeriod !== a.paymentPeriod) {
          return b.paymentPeriod.localeCompare(a.paymentPeriod);
        }
        // 2. Sort by facilityName ASC
        const facilityCompare = a.facilityName.localeCompare(b.facilityName);
        if (facilityCompare !== 0) return facilityCompare;
        // 3. Sort by fundingTypeText ASC
        return a.fundingTypeText.localeCompare(b.fundingTypeText);
      });
    },

    resetFilters() {
      this.selectedFacilities = this.facilityList?.map((f) => f.facilityId);
      this.selectedPaymentMonths = this.allPaymentsMonths?.map((m) => m.value);
      this.selectedFundingTypes = this.allFundingTypes.map((f) => f.value);
      this.facilityIdSearch = '';
      this.invoiceNumberSearch = '';
      this.paidStartDate = null;
      this.paidEndDate = null;
    },
  },
};
</script>
<style scoped>
.custom-vcol {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.custom-vcol p {
  font-weight: bold;
  margin-bottom: 0.25rem;
  min-width: 150px;
}

@media (min-width: 960px) {
  .custom-vcol {
    flex-direction: row;
    align-items: center;
  }
  .custom-vcol p {
    margin-bottom: 0;
    margin-right: 1rem;
  }
}
</style>
