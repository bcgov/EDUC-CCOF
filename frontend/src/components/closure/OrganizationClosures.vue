<template>
  <v-container fluid class="pa-12">
    <v-row>
      <v-col cols="12" lg="6">
        <div class="text-h4 font-weight-bold mb-4">Organization Closures</div>
        <div class="text-h5 font-weight-bold text-primary">{{ organizationName }}</div>
        <div class="text-primary">Organization ID: {{ organizationAccountNumber }}</div>
      </v-col>
      <v-col cols="12" lg="6" align="right">
        <div>
          <AppButton :loading="isLoading" size="large" @click="closureRequestType = CHANGE_REQUEST_TYPES.NEW_CLOSURE"
            >Add New Closure</AppButton
          >
          <div class="text-h6 font-weight-bold my-4">
            Fiscal Year: {{ getProgramYearNameById($route.params.programYearGuid).slice(0, -3) }}
          </div>
        </div>
      </v-col>
    </v-row>
    <v-card variant="outlined" class="pa-8 pt-4 my-6">
      <v-row>
        <v-col cols="12" lg="7" class="mt-4 text-grey">
          View the status of your closure requests, submit a new closure request or make a change.
        </v-col>
        <v-col cols="12" lg="2" class="mt-4">
          <v-row class="text-primary d-flex justify-lg-end ml-1">
            <p class="mr-2">Filter by Facility</p>
            <v-icon class="mr-1">mdi-filter</v-icon>
          </v-row>
        </v-col>
        <v-col cols="12" lg="3" class="d-flex justify-lg-end">
          <v-text-field
            v-model="filter"
            label="Filter by Facility Name and Facility ID"
            clearable
            variant="outlined"
            @click:clear="filter = ''"
          />
        </v-col>
      </v-row>

      <v-skeleton-loader :loading="isLoading" type="table-tbody">
        <v-data-table
          v-model:sort-by="sortBy"
          :headers="closureTableHeaders"
          :items="filteredClosures"
          :items-per-page="10"
          :mobile="null"
          mobile-breakpoint="md"
          must-sort
          class="elevation-2"
        >
          <template #[`item.facilityId`]="{ item }">
            {{ getFacilityAccountNumber(item.facilityId) }}
          </template>
          <template #[`item.startDate`]="{ item }">
            {{ formatUTCDateToShortDateString(item.startDate) }}
          </template>
          <template #[`item.endDate`]="{ item }">
            {{ formatUTCDateToShortDateString(item.endDate) }}
          </template>
          <template #[`item.closureStatus`]="{ item }">
            <span :class="getClosureStatusClass(item.closureStatus)">
              {{ getClosureStatusText(item.closureStatus) }}
            </span>
          </template>
          <template #[`item.paymentEligibility`]="{ item }">
            {{ getPaymentEligibilityText(item.paymentEligibility) }}
          </template>
          <template #[`item.actions`]="{ item }">
            <v-row class="action-buttons justify-end justify-md-start">
              <AppButton
                :loading="isLoading"
                :primary="false"
                size="large"
                class="text-body-2"
                @click="setClosureToView(item)"
              >
                View Details
              </AppButton>
              <AppButton
                :loading="isLoading"
                :primary="false"
                :disabled="hasPendingStatus(item)"
                size="large"
                class="text-body-2"
                @click="updateClosure(item)"
              >
                Update
              </AppButton>
              <AppButton
                :loading="isLoading"
                :primary="false"
                :disabled="hasPendingStatus(item)"
                size="large"
                class="text-body-2"
                @click="removeClosure(item)"
              >
                Remove
              </AppButton>
            </v-row>
          </template>
        </v-data-table>
      </v-skeleton-loader>
    </v-card>
    <NavButton @previous="previous" />
    <ClosureChangeRequestDialog
      :closure="closureForRequest"
      :program-year-id="$route.params.programYearGuid"
      :request-type="closureRequestType"
      :show="showClosureChangeRequestDialog"
      max-width="60%"
      @submitted="newClosureRequestSubmitted"
      @close="closureRequestType = null"
    />
    <ClosureConfirmationDialog
      :show="showClosureConfirmationDialog"
      max-width="60%"
      :change-request-reference-id="changeRequestReferenceId"
      @close="toggleClosureConfirmationDialog"
    />
    <ClosureDetailsDialog
      :show="showClosureDetailsDialog"
      max-width="60%"
      :closure="closureToView"
      @close="setClosureToView(null)"
    />
  </v-container>
</template>
<script>
import { mapState } from 'pinia';

import AppButton from '@/components/guiComponents/AppButton.vue';
import ClosureChangeRequestDialog from '@/components/closure/ClosureChangeRequestDialog.vue';
import ClosureConfirmationDialog from '@/components/closure/ClosureConfirmationDialog.vue';
import ClosureDetailsDialog from '@/components/closure/ClosureDetailsDialog.vue';
import NavButton from '@/components/util/NavButton.vue';

import alertMixin from '@/mixins/alertMixin.js';
import { useAppStore } from '@/store/app.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import ClosureService from '@/services/closureService.js';
import { formatUTCDateToShortDateString } from '@/utils/format';

import {
  CHANGE_REQUEST_TYPES,
  CLOSURE_PAYMENT_ELIGIBILITIES,
  CLOSURE_PAYMENT_ELIGIBILITY_TEXTS,
  CLOSURE_STATUS_TEXTS,
  CLOSURE_STATUSES,
  PATHS,
} from '@/utils/constants.js';

export default {
  name: 'OrganizationClosures',
  components: { AppButton, ClosureChangeRequestDialog, ClosureConfirmationDialog, ClosureDetailsDialog, NavButton },
  mixins: [alertMixin],
  data() {
    return {
      isLoading: false,
      showNewClosureRequestDialog: false,
      closures: undefined,
      sortBy: [
        { key: 'facilityName', order: 'asc' },
        { key: 'startDate', order: 'asc' },
      ],
      filter: '',
      closureTableHeaders: [
        { title: 'Facility ID', sortable: true, value: 'facilityId' },
        { title: 'Facility Name', sortable: true, value: 'facilityName' },
        { title: 'Start Date', sortable: true, value: 'startDate' },
        { title: 'End Date', sortable: true, value: 'endDate' },
        { title: 'Status', sortable: true, value: 'closureStatus' },
        { title: 'Payment Eligibility', sortable: true, value: 'paymentEligibility' },
        { title: 'Actions', sortable: false, value: 'actions' },
      ],
      showClosureConfirmationDialog: false,
      changeRequestReferenceId: undefined,
      closureToView: undefined,
      closureRequestType: null,
      closureForRequest: undefined,
    };
  },
  computed: {
    ...mapState(useAppStore, ['getProgramYearNameById']),
    ...mapState(useNavBarStore, ['getNavByFacilityId']),
    ...mapState(useOrganizationStore, ['organizationAccountNumber', 'organizationId', 'organizationName']),
    filteredClosures() {
      return this.closures?.filter((closure) => {
        const facilityAccountNumber = this.getFacilityAccountNumber(closure?.facilityId);
        return (
          facilityAccountNumber?.toLowerCase().includes(this.filter.toLowerCase()) ||
          closure?.facilityName?.toLowerCase().includes(this.filter.toLowerCase())
        );
      });
    },
    showClosureChangeRequestDialog() {
      return !!this.closureRequestType;
    },
    showClosureDetailsDialog() {
      return this.closureToView != null;
    },
  },
  async created() {
    this.CHANGE_REQUEST_TYPES = CHANGE_REQUEST_TYPES;
    await this.loadData();
  },
  methods: {
    formatUTCDateToShortDateString,
    async loadData() {
      try {
        this.isLoading = true;
        this.closures = await ClosureService.getOrganizationClosures(
          this.organizationId,
          this.$route.params.programYearGuid,
        );
        this.closures = this.closures?.filter((closure) => {
          return closure.closureStatus && closure.closureStatus !== CLOSURE_STATUSES.MINISTRY_REMOVED;
        });
        this.isLoading = false;
      } catch (error) {
        console.log(error);
        this.setFailureAlert('Failed to load closures');
      }
    },
    setClosureToView(closure) {
      if (closure) {
        const facility = this.getNavByFacilityId(closure.facilityId);
        closure.licenseNumber = facility?.licenseNumber;
      }
      this.closureToView = closure;
    },
    updateClosure(closure) {
      this.closureRequestType = CHANGE_REQUEST_TYPES.EDIT_EXISTING_CLOSURE;
      this.closureForRequest = closure;
    },
    removeClosure(closure) {
      this.closureRequestType = CHANGE_REQUEST_TYPES.REMOVE_A_CLOSURE;
      this.closureForRequest = closure;
    },
    hasPendingStatus(closure) {
      return closure.closureStatus === CLOSURE_STATUSES.PENDING;
    },
    getFacilityAccountNumber(facilityId) {
      const facility = this.getNavByFacilityId(facilityId);
      return facility?.facilityAccountNumber;
    },
    getClosureStatusText(closureValue) {
      switch (closureValue) {
        case CLOSURE_STATUSES.PENDING:
          return CLOSURE_STATUS_TEXTS.PENDING;
        case CLOSURE_STATUSES.COMPLETE_APPROVED:
          return CLOSURE_STATUS_TEXTS.APPROVED;
        case CLOSURE_STATUSES.COMPLETE_NOT_APPROVED:
          return CLOSURE_STATUS_TEXTS.NOT_APPROVED;
        case CLOSURE_STATUSES.CANCELLED:
          return CLOSURE_STATUS_TEXTS.CANCELLED;
        default:
          return '';
      }
    },
    getPaymentEligibilityText(paymentEligibility) {
      if (!paymentEligibility) {
        return '';
      }
      paymentEligibility = paymentEligibility.replace(
        `${CLOSURE_PAYMENT_ELIGIBILITIES.CCFRI}`,
        CLOSURE_PAYMENT_ELIGIBILITY_TEXTS.CCFRI,
      );
      paymentEligibility = paymentEligibility.replace(
        `${CLOSURE_PAYMENT_ELIGIBILITIES.CCFRI_AND_CCOF}`,
        CLOSURE_PAYMENT_ELIGIBILITY_TEXTS.CCFRI_AND_CCOF,
      );
      paymentEligibility = paymentEligibility.replace(
        `${CLOSURE_PAYMENT_ELIGIBILITIES.CCOF}`,
        CLOSURE_PAYMENT_ELIGIBILITY_TEXTS.CCOF,
      );
      paymentEligibility = paymentEligibility.replace(
        `${CLOSURE_PAYMENT_ELIGIBILITIES.INELIGIBLE}`,
        CLOSURE_PAYMENT_ELIGIBILITY_TEXTS.INELIGIBLE,
      );
      paymentEligibility = paymentEligibility.replace(
        `${CLOSURE_PAYMENT_ELIGIBILITIES.PENDING}`,
        CLOSURE_PAYMENT_ELIGIBILITY_TEXTS.PENDING,
      );
      paymentEligibility = paymentEligibility.replaceAll(',', ', ');

      return paymentEligibility;
    },
    getClosureStatusClass(status) {
      switch (status) {
        case CLOSURE_STATUSES.PENDING:
          return 'status-gray';
        case CLOSURE_STATUSES.COMPLETE_APPROVED:
          return 'status-green';
        case CLOSURE_STATUSES.COMPLETE_NOT_APPROVED:
          return 'status-red';
        case CLOSURE_STATUSES.CANCELLED:
          return 'status-yellow';
        default:
          return '';
      }
    },
    previous() {
      this.$router.push(PATHS.ROOT.HOME);
    },
    toggleClosureConfirmationDialog() {
      this.showClosureConfirmationDialog = !this.showClosureConfirmationDialog;
    },
    // To prevent issues with CRM delays from sequential Post and Get requests, the closure is manually added
    // to allow the user to view the closure following the post request.
    newClosureRequestSubmitted(closureChangeRequest) {
      if (this.closureRequestType === CHANGE_REQUEST_TYPES.NEW_CLOSURE) {
        const facility = this.getNavByFacilityId(closureChangeRequest.facilityId);
        closureChangeRequest.facilityName = facility?.facilityName;
        closureChangeRequest.closureStatus = CLOSURE_STATUSES.PENDING;
        this.closures.push(closureChangeRequest);
      }
      this.changeRequestReferenceId = closureChangeRequest.changeRequestReferenceId;
      this.closureRequestType = null;
      this.toggleClosureConfirmationDialog();
    },
  },
};
</script>

<style scoped>
.action-buttons {
  gap: 8px;
  padding: 10px 0px 10px 10px;
}
</style>
