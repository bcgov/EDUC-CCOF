<!-- eslint-disable vue/no-v-html -->
<template>
  <v-container fluid class="pa-12">
    <MessagesToolbar />
    <v-row>
      <v-col col="12" lg="6">
        <div>
          <div class="pb-6 text-h4 font-weight-bold">Organization Closures</div>
          <div class="text-h5 font-weight-bold blueText">{{ organizationName }}</div>
          <div class="text-p blueText">Organization ID: {{ organizationAccountNumber }}</div>
        </div>
      </v-col>
      <v-col col="12" lg="6" class="d-flex justify-lg-end">
        <div>
          <div>Fiscal Year: {{ programYear }}</div>
          <AppButton>Add New Closure</AppButton>
        </div>
      </v-col>
    </v-row>
    <v-container class="border pa-4" fluid>
      <v-row>
        <v-col col="12">Program and policy to provide text </v-col>
        <v-col col="12">
          <v-row>
            <p>Filter by Facility</p>
            <v-icon>mdi-filter</v-icon>
            <v-text-field
              v-model="search"
              label="Filter by Facility Name and Facility ID"
              clearable
              variant="outlined"
              class="mb-4"
            ></v-text-field>
          </v-row>
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
        class="elevation-1"
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
        <template #[`item.ccofStatus`]="{ item }">
          <span :class="getCcofStatus(item.ccofStatus)">
            {{ item.ccofStatusValue }}
          </span>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-row>
            <AppButton :primary="false" @click="viewDetails(item)">View Details</AppButton>
            <AppButton :primary="false" @click="updateItem(item)" :disabled="item.ccofStatusValue === 'Pending'"
              >Update</AppButton
            >
            <AppButton :primary="false" @click="removeItem(item)" :disabled="item.ccofStatusValue === 'Pending'"
              >Remove</AppButton
            >
          </v-row>
        </template>
      </v-data-table>
    </v-container>
    <NavButton :is-next-displayed="false" :is-save-displayed="false" :is-next-disabled="true" @previous="previous" />
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
import facilityService from '@/services/facilityService.js';
import AppButton from './guiComponents/AppButton.vue';
import MessagesToolbar from '@/components/guiComponents/MessagesToolbar.vue';
import { PATHS, FACILITY_CLOSURE_STATUS, FACILITY_CLOSURE_FUNDING_ELIGIBILITY } from '@/utils/constants.js';

export default {
  name: 'ClosuresPage',
  components: { MessagesToolbar, NavButton, AppButton },
  data() {
    return {
      PATHS: PATHS,
      isLoadingComplete: false,
      ccfriClosures: undefined,
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
        { title: 'Status', sortable: true, value: 'ccofStatus' },
        { title: 'Payment Eligibility', sortable: true, value: 'ccofPaymentEligibilityValue' },
        { title: 'Actions', sortable: false, value: 'actions' },
      ],
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'may', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
      return this.ccfriClosures?.closures.filter(
        (closure) => closure.facilityId.includes(this.search) || closure.facilityName.includes(this.search),
      );
    },
    programYear() {
      return this.programYearLabel.slice(0, 7).replace('-', '/');
    },
  },
  async created() {
    this.isLoadingComplete = false;
    this.getAllMessagesVuex();
    this.refreshNavBarList();
    this.useNavBarStore = useNavBarStore();
    this.ccfriClosures = await facilityService.getCCFRIClosuresForFiscalYear(
      this.organizationId,
      this.route.params.programYearGuid,
    );
    this.processClosures(this.ccfriClosures);
    this.isLoadingComplete = true;
  },
  methods: {
    ...mapActions(useMessageStore, ['getAllMessages']),
    ...mapActions(useNavBarStore, ['refreshNavBarList']),
    async getAllMessagesVuex() {
      try {
        await this.getAllMessages(this.organizationId);
      } catch (error) {
        console.info(error);
      }
    },
    // todo: implement the following functions
    viewDetails(item) {
      // stub
    },
    updateItem(item) {
      // stub
    },
    removeItem(item) {
      // stub
    },
    processClosures(ccfriClosures) {
      for (let closure of ccfriClosures.closures) {
        const facility = this.getNavByFacilityId(closure.facilityGuid);
        closure.facilityId = facility.facilityAccountNumber;

        let eligibility = closure.ccofPaymentEligibility;
        eligibility = eligibility.replace(`${FACILITY_CLOSURE_FUNDING_ELIGIBILITY.CCFRI}`, 'CCFRI');
        eligibility = eligibility.replace(`${FACILITY_CLOSURE_FUNDING_ELIGIBILITY.CCFRI_AND_CCOF}`, 'CCFRI/CCOF');
        eligibility = eligibility.replace(`${FACILITY_CLOSURE_FUNDING_ELIGIBILITY.CCOF}`, 'CCOF');
        eligibility = eligibility.replace(`${FACILITY_CLOSURE_FUNDING_ELIGIBILITY.INELIGIBLE}`, 'Ineligible');
        eligibility = eligibility.replace(`${FACILITY_CLOSURE_FUNDING_ELIGIBILITY.PENDING}`, 'Pending');
        eligibility = eligibility.replaceAll(',', ', ');
        switch (closure.ccofStatus) {
          case FACILITY_CLOSURE_STATUS.SUBMITTED:
            closure.ccofStatusValue = 'Pending';
            break;
          case FACILITY_CLOSURE_STATUS.IN_PROGRESS:
            closure.ccofStatusValue = 'Pending';
            break;
          case FACILITY_CLOSURE_STATUS.APPROVED:
            closure.ccofStatusValue = 'Approved';
            break;
          case FACILITY_CLOSURE_STATUS.DENIED:
            closure.ccofStatusValue = 'Ineligible';
            break;
          default:
            closure.ccofStatusValue = '';
        }
        closure.ccofPaymentEligibilityValue = eligibility;
      }
    },
    getCcofStatus(ccofStatusNumber) {
      switch (ccofStatusNumber) {
        case FACILITY_CLOSURE_STATUS.SUBMITTED:
          return 'status-gray';
        case FACILITY_CLOSURE_STATUS.IN_PROGRESS:
          return 'status-gray';
        case FACILITY_CLOSURE_STATUS.APPROVED:
          return 'status-green';
        case FACILITY_CLOSURE_STATUS.DENIED:
          return 'status-yellow';
        default:
          return 'bg-white';
      }
    },
    formattedDate(date) {
      const newDate = new Date(date);
      return `${this.months[newDate.getMonth()]} ${newDate.getDate()}, ${newDate.getFullYear()}`;
    },
    previous() {
      this.$router.push(PATHS.ROOT.HOME);
    },
  },
};
</script>

<style scoped>
.blueText {
  color: #193c6c !important;
}

.status-gray {
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
}
</style>
