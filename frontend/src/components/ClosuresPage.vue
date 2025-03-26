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
          <div class="text-h7 pb-8 d-flex justify-lg-end">Fiscal Year: {{ programYear }}</div>
          <AppButton size="large">Add New Closure</AppButton>
        </div>
      </v-col>
    </v-row>
    <v-card variant="outlined" class="pa-8 pt-2" fluid>
      <v-row align="start">
        <v-col cols="12" lg="7" class="mt-4 grayText">
          View the status of your closure requests, submit a new closure request or make a change.
        </v-col>
        <v-col cols="12" lg="2" class="mt-4">
          <v-row class="blueText d-flex justify-lg-end ml-1">
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
        <template #[`item.ccofStatusText`]="{ item }">
          <span :class="getCcofStatus(item.ccofStatus)">
            {{ item.ccofStatusText }}
          </span>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-row class="action-buttons">
            <AppButton :primary="false" size="large" class="text-body-2" @click="viewDetails(item)"
              >View Details</AppButton
            >
            <AppButton
              :primary="false"
              :disabled="item.ccofStatusText === 'Pending'"
              size="large"
              class="text-body-2"
              @click="updateItem(item)"
              >Update</AppButton
            >
            <AppButton
              :primary="false"
              :disabled="item.ccofStatusText === 'Pending'"
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
import { mapState, mapActions } from 'pinia';
import { useAuthStore } from '@/store/auth.js';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { useMessageStore } from '@/store/message.js';
import { useRoute } from 'vue-router';

import NavButton from '@/components/util/NavButton.vue';
import ClosureService from '@/services/closureService.js';
import AppButton from './guiComponents/AppButton.vue';
import {
  PATHS,
  CLOSURE_STATUSES,
  CLOSURE_PAYMENT_ELIGIBILITY_TEXTS,
  PAYMENT_ELIGIBILITY_TEXTS,
} from '@/utils/constants.js';

export default {
  name: 'ClosuresPage',
  components: { NavButton, AppButton },
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
        { title: 'Status', sortable: true, value: 'ccofStatusText' },
        { title: 'Payment Eligibility', sortable: true, value: 'ccofPaymentEligibilityText' },
        { title: 'Actions', sortable: false, value: 'actions' },
      ],
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    };
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useAppStore, ['renewalYearLabel', 'programYearList']),
    ...mapState(useApplicationStore, ['programYearLabel', 'applicationStatus', 'applicationMap', 'applicationId']),
    ...mapState(useNavBarStore, ['navBarList', 'getNavByFacilityId']),
    ...mapState(useOrganizationStore, [
      'organizationAccountNumber',
      'organizationId',
      'organizationName',
      'organizationAccountNumber',
    ]),
    closuresToDisplay() {
      return this.closures?.filter(
        (closure) =>
          closure?.facilityId?.toLowerCase().includes(this.search.toLowerCase()) ||
          closure?.facilityName?.toLowerCase().includes(this.search.toLowerCase()),
      );
    },
    programYear() {
      return this.programYearLabel.slice(0, 7).replace('-', '/');
    },
  },
  async created() {
    this.isLoadingComplete = false;
    this.refreshNavBarList();
    this.useNavBarStore = useNavBarStore();
    this.closures = await ClosureService.getOrganizationClosuresForFiscalYear(
      this.organizationId,
      this.route.params.programYearGuid,
    );
    this.processClosures(this.closures);
    this.isLoadingComplete = true;
  },
  methods: {
    ...mapActions(useMessageStore, ['getAllMessages']),
    ...mapActions(useNavBarStore, ['refreshNavBarList']),
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
        const facility = this.getNavByFacilityId(closure.facilityGuid);
        console.log(facility);
        closure.facilityId = facility?.facilityAccountNumber;
        closure.ccofStatusText = this.getClosureStatusText(closure.ccofStatus);
        closure.ccofPaymentEligibilityText = this.getPaymentEligibilityText(closure.ccofPaymentEligibility);
      }
    },
    getClosureStatusText(closureValue) {
      switch (closureValue) {
        case CLOSURE_STATUSES.SUBMITTED:
          return 'Pending';
        case CLOSURE_STATUSES.IN_PROGRESS:
          return 'Pending';
        case CLOSURE_STATUSES.APPROVED:
          return 'Approved';
        case CLOSURE_STATUSES.DENIED:
          return 'Ineligible';
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
    getCcofStatus(ccofStatusNumber) {
      switch (ccofStatusNumber) {
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
@import './../../public/styles/common.css';

.blueText {
  color: #193c6c !important;
}

.grayText {
  color: #b1b1b1 !important;
}

.blackBorder {
  border: 2px solid black;
}

.action-buttons {
  gap: 8px;
  padding: 0px 0px 0px 10px;
}

/* .status-gray {
  background-color: #e0e0e0;
  border-radius: 5px;
  padding: 2px 6px 2px 6px;
}

.status-green {
  background-color: #c8e6cb;
  border-radius: 5px;
  padding: 2px 6px 2px 6px;
}

.status-yellow {
  background-color: #fdfac8;
  border-radius: 5px;
  padding: 2px 6px 2px 6px;
} */
</style>
