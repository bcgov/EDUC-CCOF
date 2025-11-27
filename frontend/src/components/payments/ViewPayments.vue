<template>
  <v-container class="pa-2 text-body-1" fluid>
    <p class="mb-4">View and manage the payment records of your organization.</p>

    <v-skeleton-loader :loading="isLoading" type="table-tbody">
      <v-data-table
        :headers="paymentTableHeaders"
        :items="displayedPayments"
        :items-per-page="20"
        :items-per-page-options="[10, 20, 50]"
        :mobile="null"
        mobile-breakpoint="md"
        class="elevation-2"
      >
        <template #item.reportingMonth="{ item }">
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
import { mapState } from 'pinia';

import alertMixin from '@/mixins/alertMixin.js';

import PaymentService from '@/services/paymentService.js';

import { useApplicationStore } from '@/store/application.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';

import { PAYMENT_STATUSES, PAYMENT_STATUS_TEXTS } from '@/utils/constants.js';
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
        { title: 'Month of Service', sortable: true, value: 'reportingMonth', width: '200px' },
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
        this.payments = await PaymentService.getPayments({
          organizationId: this.organizationId,
          programYearId: this.programYearId,
        });
        this.payments.forEach((payment) => {
          payment.reportingMonth = `${payment.paymentYear}-${String(payment.paymentMonth).padStart(2, '0')}`;
        });
        this.sortPayments();
      } catch {
        this.setFailureAlert('Failed to load Payments');
      } finally {
        this.isLoading = false;
      }
    },

    getDisplayStatus(statusCode) {
      switch (statusCode) {
        case PAYMENT_STATUSES.APPROVED_PAYMENT:
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
        // 1. Sort by reportingMonth DESC (newest first)
        if (b.reportingMonth !== a.reportingMonth) {
          return b.reportingMonth.localeCompare(a.reportingMonth);
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
