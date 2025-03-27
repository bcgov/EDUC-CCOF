<template>
  <v-container fluid class="pa-12">
    <v-row>
      <v-col col="12" lg="6">
        <div>
          <div class="pb-6 text-h4 font-weight-bold">Organization Closures</div>
          <div class="text-h5 font-weight-bold text-primary">{{ organizationName }}</div>
          <div class="text-p text-primary">Organization ID: {{ organizationAccountNumber }}</div>
        </div>
      </v-col>
      <v-col col="12" lg="6" class="d-flex justify-lg-end">
        <div>
          <AppButton size="large">Add New Closure</AppButton>
          <div class="text-h6 font-weight-bold pb-8 d-flex justify-lg-end">Fiscal Year: {{ programYear }}</div>
        </div>
      </v-col>
    </v-row>
    <v-card variant="outlined" class="pa-8 pt-2" fluid>
      <v-row align="start">
        <v-col cols="12" lg="7" class="mt-4 text-gray">
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
            v-model="search"
            label="Filter by Facility Name and Facility ID"
            clearable
            variant="outlined"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-data-table
        v-model:sort-by="sortBy"
        must-sort
        :headers="closureTableHeaders"
        :items="closuresToDisplay"
        :items-per-page="10"
        :search="search"
        :mobile="null"
        mobile-breakpoint="md"
        class="elevation-2"
      >
        <template #[`item.startDate`]="{ item }">
          <span>
            {{ formattedDate(item.startDate) }}
          </span>
        </template>
        <template #[`item.endDate`]="{ item }">
          <span>
            {{ formattedDate(item.endDate) }}
          </span>
        </template>
        <template #[`item.closureStatusText`]="{ item }">
          <span :class="getclosureStatus(item.closureStatus)">
            {{ item.closureStatusText }}
          </span>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-row class="action-buttons">
            <AppButton :primary="false" size="large" class="text-body-2" @click="viewDetails(item)"
              >View Details</AppButton
            >
            <AppButton
              :primary="false"
              :disabled="item.closureStatusText === 'Pending'"
              size="large"
              class="text-body-2"
              @click="updateItem(item)"
              >Update</AppButton
            >
            <AppButton
              :primary="false"
              :disabled="item.closureStatusText === 'Pending'"
              size="large"
              class="text-body-2"
              @click="removeItem(item)"
              >Remove</AppButton
            >
          </v-row>
        </template>
      </v-data-table>
    </v-card>
    <NavButton
      :is-next-displayed="false"
      :is-save-displayed="false"
      :is-next-disabled="true"
      class="ml-0 mr-0"
      @previous="previous"
    />
  </v-container>
</template>
<script>
import { mapState } from 'pinia';
import alertMixin from '@/mixins/alertMixin.js';
import { useAuthStore } from '@/store/auth.js';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { useRoute } from 'vue-router';

import NavButton from '@/components/util/NavButton.vue';
import ClosureService from '@/services/closureService.js';
import AppButton from '@/components/guiComponents/AppButton.vue';
import {
  PATHS,
  CLOSURE_STATUSES,
  CLOSURE_STATUS_TEXTS,
  CLOSURE_PAYMENT_ELIGIBILITY_TEXTS,
  PAYMENT_ELIGIBILITY_TEXTS,
} from '@/utils/constants.js';

export default {
  name: 'OrganizationClosures',
  components: { NavButton, AppButton },
  mixins: [alertMixin],
  data() {
    return {
      PATHS: PATHS,
      isLoadingComplete: false,
      closures: undefined,
      route: useRoute(),
      sortBy: [
        { key: 'facilityName', order: 'asc' },
        { key: 'startDate', order: 'asc' },
      ],
      search: '',
      closureTableHeaders: [
        { title: 'Facility ID', sortable: true, value: 'facilityId' },
        { title: 'Facility Name', sortable: true, value: 'facilityName' },
        { title: 'Start Date', sortable: true, value: 'startDate' },
        { title: 'End Date', sortable: true, value: 'endDate' },
        { title: 'Status', sortable: true, value: 'closureStatusText' },
        { title: 'Payment Eligibility', sortable: true, value: 'paymentEligibilityText' },
        { title: 'Actions', sortable: false, value: 'actions' },
      ],
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    };
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useAppStore, ['renewalYearLabel', 'programYearList']),
    ...mapState(useApplicationStore, ['programYearLabel', 'applicationStatus', 'applicationMap', 'applicationId']),
    ...mapState(useNavBarStore, ['getNavByFacilityId']),
    ...mapState(useOrganizationStore, ['organizationAccountNumber', 'organizationId', 'organizationName']),
    closuresToDisplay() {
      return this.closures?.filter(
        (closure) =>
          closure?.facilityId?.toLowerCase().includes(this.search.toLowerCase()) ||
          closure?.facilityName?.toLowerCase().includes(this.search.toLowerCase()),
      );
    },
    programYear() {
      return this.programYearLabel.slice(0, 7);
    },
  },
  async created() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      try {
        this.isLoadingComplete = false;
        this.closures = await ClosureService.getOrganizationClosures(
          this.organizationId,
          this.route.params.programYearGuid,
        );
        this.processClosures(this.closures);
        this.isLoadingComplete = true;
      } catch (error) {
        console.log(error);
        this.setFailureAlert('Failed to load closures');
      }
    },
    // JonahCurlCGI - todo: implement the following functions
    viewDetails(item) {
      // stub
    },
    updateItem(item) {
      // stub
    },
    removeItem(item) {
      // stub
    },
    processClosures(closures) {
      for (let closure of closures) {
        const facility = this.getNavByFacilityId(closure.facilityId);
        closure.facilityId = facility?.facilityAccountNumber;
        closure.closureStatusText = this.getClosureStatusText(closure.closureStatus);
        closure.paymentEligibilityText = this.getPaymentEligibilityText(closure.paymentEligibility);
      }
    },
    getClosureStatusText(closureValue) {
      switch (closureValue) {
        case CLOSURE_STATUSES.SUBMITTED:
        case CLOSURE_STATUSES.IN_PROGRESS:
          return CLOSURE_STATUS_TEXTS.PENDING;
        case CLOSURE_STATUSES.APPROVED:
          return CLOSURE_STATUS_TEXTS.APPROVED;
        case CLOSURE_STATUSES.DENIED:
          return CLOSURE_STATUS_TEXTS.INELIGIBLE;
        default:
          return '';
      }
    },
    getPaymentEligibilityText(paymentEligibility) {
      paymentEligibility = paymentEligibility.replace(
        `${CLOSURE_PAYMENT_ELIGIBILITY_TEXTS.CCFRI}`,
        PAYMENT_ELIGIBILITY_TEXTS.CCFRI,
      );
      paymentEligibility = paymentEligibility.replace(
        `${CLOSURE_PAYMENT_ELIGIBILITY_TEXTS.CCFRI_AND_CCOF}`,
        PAYMENT_ELIGIBILITY_TEXTS.CCFRI_AND_CCOF,
      );
      paymentEligibility = paymentEligibility.replace(
        `${CLOSURE_PAYMENT_ELIGIBILITY_TEXTS.CCOF}`,
        PAYMENT_ELIGIBILITY_TEXTS.CCOF,
      );
      paymentEligibility = paymentEligibility.replace(
        `${CLOSURE_PAYMENT_ELIGIBILITY_TEXTS.INELIGIBLE}`,
        PAYMENT_ELIGIBILITY_TEXTS.INELIGIBLE,
      );
      paymentEligibility = paymentEligibility.replace(
        `${CLOSURE_PAYMENT_ELIGIBILITY_TEXTS.PENDING}`,
        PAYMENT_ELIGIBILITY_TEXTS.PENDING,
      );
      paymentEligibility = paymentEligibility.replaceAll(',', ', ');

      return paymentEligibility;
    },
    getclosureStatus(closureStatusNumber) {
      switch (closureStatusNumber) {
        case CLOSURE_STATUSES.SUBMITTED:
          return 'status-gray';
        case CLOSURE_STATUSES.IN_PROGRESS:
          return 'status-gray';
        case CLOSURE_STATUSES.APPROVED:
          return 'status-green';
        case CLOSURE_STATUSES.DENIED:
          return 'status-yellow';
        default:
          return 'bg-white';
      }
    },
    formattedDate(date) {
      const newDate = new Date(date);
      return `${this.months[newDate.getUTCMonth()]} ${newDate.getUTCDate()}, ${newDate.getUTCFullYear()}`;
    },
    previous() {
      this.$router.push(PATHS.ROOT.HOME);
    },
  },
};
</script>

<style scoped>
.text-gray {
  color: #b1b1b1 !important;
}

.blackBorder {
  border: 2px solid black;
}

.action-buttons {
  gap: 8px;
  padding: 10px 0px 10px 10px;
}
</style>
