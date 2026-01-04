<template>
  <v-container fluid class="pa-12">
    <v-row>
      <v-col cols="12" lg="6">
        <div class="text-h4 font-weight-bold mb-4">Organization Closures</div>
        <div class="text-h5 font-weight-bold text-primary">{{ organizationName }}</div>
        <div class="text-primary">Organization ID: {{ organizationAccountNumber }}</div>
      </v-col>
      <v-col cols="12" lg="6" align="right">
        <div class="add-new">
          <AppButton
            v-if="hasPermission(PERMISSIONS.REQUEST_CLOSURE)"
            :loading="isLoading"
            size="large"
            @click="closureRequestType = CHANGE_REQUEST_TYPES.NEW_CLOSURE"
            >Add New Closure</AppButton
          >
        </div>
        <div class="text-h6 font-weight-bold my-4">
          Fiscal Year: {{ getProgramYearNameById($route.params.programYearGuid).slice(0, -3) }}
        </div>
      </v-col>
    </v-row>
    <v-card variant="outlined" class="pa-8 pt-4 my-6 mt-2">
      <v-row>
        <v-col cols="12" lg="7">
          <AppAlertBanner type="info">
            <p class="pb-2">Note: You can only submit closures for the current funding agreement term.</p>
            <p>
              To report a closure for a previous term, please return to the home page, select a different fiscal year,
              and go to Organization Closures.
            </p>
          </AppAlertBanner>
        </v-col>
        <v-col cols="12" lg="2" class="mt-4">
          <v-row class="text-primary d-flex justify-lg-end ml-1">
            <p class="mr-2">Filter by Facility</p>
            <v-icon class="mr-1">mdi-filter</v-icon>
          </v-row>
        </v-col>
        <v-col cols="12" lg="3">
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
            {{ formatUTCDate(item.startDate) }}
          </template>
          <template #[`item.endDate`]="{ item }">
            {{ formatUTCDate(item.endDate) }}
          </template>
          <template #[`item.closureStatus`]="{ item }">
            <span :class="getClosureStatusClass(item)">
              {{ getClosureStatusText(item) }}
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
                v-if="hasPermission(PERMISSIONS.EDIT_CLOSURE)"
                :loading="isLoading"
                :primary="false"
                :disabled="isClosureReadonly(item)"
                size="large"
                class="text-body-2"
                @click="updateClosure(item)"
              >
                Update
              </AppButton>
              <AppButton
                v-if="hasPermission(PERMISSIONS.REMOVE_CLOSURE)"
                :loading="isLoading"
                :primary="false"
                :disabled="isClosureReadonly(item)"
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

import ClosureChangeRequestDialog from '@/components/closure/ClosureChangeRequestDialog.vue';
import ClosureConfirmationDialog from '@/components/closure/ClosureConfirmationDialog.vue';
import ClosureDetailsDialog from '@/components/closure/ClosureDetailsDialog.vue';
import AppAlertBanner from '@/components/guiComponents/AppAlertBanner.vue';
import AppButton from '@/components/guiComponents/AppButton.vue';
import NavButton from '@/components/util/NavButton.vue';

import alertMixin from '@/mixins/alertMixin.js';
import permissionsMixin from '@/mixins/permissionsMixin.js';
import ClosureService from '@/services/closureService.js';
import { useAppStore } from '@/store/app.js';
import { useAuthStore } from '@/store/auth.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { useNavBarStore } from '@/store/navBar.js';
import { formatUTCDate } from '@/utils/format';

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
  components: {
    AppAlertBanner,
    AppButton,
    ClosureChangeRequestDialog,
    ClosureConfirmationDialog,
    ClosureDetailsDialog,
    NavButton,
  },
  mixins: [alertMixin, permissionsMixin],
  data() {
    return {
      isLoading: false,
      showNewClosureRequestDialog: false,
      closures: undefined,
      pendingClosureRequests: [],
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
    ...mapState(useAuthStore, ['userInfo']),
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
    formatUTCDate,
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
        await this.getPendingClosureRequestsForApprovedClosures();
        this.isLoading = false;
      } catch (error) {
        console.log(error);
        this.setFailureAlert('Failed to load closures');
      }
    },
    async getPendingClosureRequestsForApprovedClosures() {
      this.pendingClosureRequests = [];
      const approvedClosures = this.closures?.filter((closure) => this.hasApprovedStatus(closure));
      await Promise.all(
        approvedClosures?.map(async (closure) => {
          const response = await ClosureService.getPendingChangeActionClosures(
            closure.facilityId,
            this.$route.params.programYearGuid,
          );
          this.pendingClosureRequests.push(...response);
        }),
      );
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
    hasApprovedStatus(closure) {
      return closure.closureStatus === CLOSURE_STATUSES.COMPLETE_APPROVED;
    },
    hasPendingClosureRequest(closure) {
      return this.pendingClosureRequests.some((closureRequest) => closure.closureId === closureRequest.closureId);
    },
    isClosureReadonly(closure) {
      return !this.hasApprovedStatus(closure) || this.hasPendingClosureRequest(closure);
    },
    getFacilityAccountNumber(facilityId) {
      const facility = this.getNavByFacilityId(facilityId);
      return facility?.facilityAccountNumber;
    },
    getClosureStatusText(closure) {
      if (this.hasApprovedStatus(closure) && this.hasPendingClosureRequest(closure)) {
        return CLOSURE_STATUS_TEXTS.PENDING;
      }
      switch (closure.closureStatus) {
        case CLOSURE_STATUSES.PENDING:
          return CLOSURE_STATUS_TEXTS.PENDING;
        case CLOSURE_STATUSES.COMPLETE_APPROVED:
          return CLOSURE_STATUS_TEXTS.APPROVED;
        case CLOSURE_STATUSES.COMPLETE_NOT_APPROVED:
          return CLOSURE_STATUS_TEXTS.NOT_APPROVED;
        case CLOSURE_STATUSES.CANCELLED:
          return CLOSURE_STATUS_TEXTS.CANCELLED;
        case CLOSURE_STATUSES.WITHDRAWN:
          return CLOSURE_STATUS_TEXTS.WITHDRAWN;
        default:
          return '';
      }
    },
    getPaymentEligibilityText(paymentEligibility) {
      if (!paymentEligibility) {
        return '';
      }
      const eligibilityKey = Object.keys(CLOSURE_PAYMENT_ELIGIBILITIES).find(
        (k) => CLOSURE_PAYMENT_ELIGIBILITIES[k] === paymentEligibility,
      );
      return eligibilityKey ? CLOSURE_PAYMENT_ELIGIBILITY_TEXTS[eligibilityKey] : '';
    },
    getClosureStatusClass(closure) {
      if (this.hasApprovedStatus(closure) && this.hasPendingClosureRequest(closure)) {
        return 'status-gray';
      }
      switch (closure.closureStatus) {
        case CLOSURE_STATUSES.PENDING:
          return 'status-gray';
        case CLOSURE_STATUSES.COMPLETE_APPROVED:
          return 'status-green';
        case CLOSURE_STATUSES.COMPLETE_NOT_APPROVED:
          return 'status-red';
        case CLOSURE_STATUSES.CANCELLED:
        case CLOSURE_STATUSES.WITHDRAWN:
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
      } else {
        this.pendingClosureRequests.push(closureChangeRequest);
      }
      this.changeRequestReferenceId = closureChangeRequest.changeRequestReferenceId;
      this.closureRequestType = null;
      this.closureForRequest = null;
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
.add-new {
  height: 50px;
}
</style>
