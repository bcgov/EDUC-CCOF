<template>
  <v-container class="pa-0 text-body-1" fluid>
    <v-row no-gutters>
      <v-col cols="12">
        <p class="mb-4">View and manage the payment records of your organization.</p>
      </v-col>
    </v-row>

    <div class="my-4"></div>

    <v-card variant="outlined" class="soft-outline fill-height px-2 py-1">
      <v-skeleton-loader :loading="isLoading" type="table-tbody">
        <v-data-table
          :headers="paymentTableHeaders"
          :items="displayedPayments"
          :items-per-page="20"
          :items-per-page-options="[10, 20, 50]"
          :mobile="null"
          mobile-breakpoint="md"
        >
          <template #item.paymentMonth="{ item }">
            {{ formatMonthYearToString(item.paymentMonth, item.paymentYear) }}
          </template>

          <template #item.fundingTypeText="{ item }">
            {{ displayFundingType(item.fundingTypeText) }}
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
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from 'pinia';

import alertMixin from '@/mixins/alertMixin.js';

import PaymentService from '@/services/paymentService.js';

import { useApplicationStore } from '@/store/application.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';

import { PAYMENTS, PAYMENTS_DISPLAY_STATUSES, PAYMENTS_FUNDING_TYPE_DISPLAY_NAMES } from '@/utils/constants.js';
import { formatCurrency, formatMonthYearToString, formatUTCDate } from '@/utils/format';

export default {
  name: 'ViewPayments',
  mixins: [alertMixin],
  data() {
    return {
      isLoading: false,
      payments: [],
      paymentTableHeaders: [
        { title: 'Facility Name', sortable: true, value: 'facilityName' },
        { title: 'Facility ID', sortable: true, value: 'facilityId' },
        { title: 'Licence Number', sortable: true, value: 'licenceNumber' },
        { title: 'Month of Service', sortable: true, value: 'paymentMonth', width: '200px' },
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
    ...mapState(useOrganizationStore, ['organizationId']),
    ...mapState(useApplicationStore, ['programYearId']),

    displayedPayments() {
      return this.payments.filter((payment) => payment.paymentAmount !== 0);
    },
  },
  async created() {
    await this.loadPayments();
  },
  methods: {
    formatCurrency,
    formatMonthYearToString,
    formatUTCDate,
    async loadPayments() {
      try {
        this.isLoading = true;
        this.payments = await PaymentService.getPayments(this.organizationId, this.programYearId);
        this.sortPayments();
      } catch {
        this.setFailureAlert('Failed to load Payments');
      } finally {
        this.isLoading = false;
      }
    },

    displayFundingType(type) {
      return PAYMENTS_FUNDING_TYPE_DISPLAY_NAMES[type] || type;
    },

    getDisplayStatus(statusCode) {
      switch (statusCode) {
        case PAYMENTS.APPROVED_PAYMENT:
        case PAYMENTS.PROCESSING_PAYMENT:
        case PAYMENTS.PROCESSING_ERROR:
          return PAYMENTS_DISPLAY_STATUSES.APPROVED;
        case PAYMENTS.HOLD:
          return PAYMENTS_DISPLAY_STATUSES.PENDING;
        case PAYMENTS.PAID:
          return PAYMENTS_DISPLAY_STATUSES.PAID;
        case PAYMENTS.CANCELLED:
          return PAYMENTS_DISPLAY_STATUSES.CANCELLED;
        default:
          return null;
      }
    },

    getStatusClass(statusCode) {
      const displayStatus = this.getDisplayStatus(statusCode);

      switch (displayStatus) {
        case PAYMENTS_DISPLAY_STATUSES.APPROVED:
          return 'status-green';
        case PAYMENTS_DISPLAY_STATUSES.PENDING:
          return 'status-yellow';
        case PAYMENTS_DISPLAY_STATUSES.PAID:
          return 'status-blue';
        case PAYMENTS_DISPLAY_STATUSES.CANCELLED:
          return 'status-red';
        default:
          return null;
      }
    },

    sortPayments() {
      this.payments.sort((a, b) => {
        // 1. Sort by paymentMonth DESC
        if (b.paymentMonth !== a.paymentMonth) {
          return b.paymentMonth - a.paymentMonth;
        }
        // 2. Sort by facilityName ASC
        const facilityCompare = a.facilityName.localeCompare(b.facilityName);
        if (facilityCompare !== 0) return facilityCompare;
        // 3. Sort by fundingTypeText ASC
        return a.fundingTypeText.localeCompare(b.fundingTypeText);
      });
    },
  },
};
</script>
