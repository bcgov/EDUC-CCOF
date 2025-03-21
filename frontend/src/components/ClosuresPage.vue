<!-- eslint-disable vue/no-v-html -->
<template>
  <v-container fluid class="pa-12">
    <MessagesToolbar />
    <v-row>
      <v-col class="col-m-12 col-lg-8">
        <v-row>
          <div class="pb-6 text-h4 font-weight-bold">Organization Closures</div>
        </v-row>
        <v-row>
          <div class="text-h5 font-weight-bold blueText">{{ organizationName }}</div>
        </v-row>
        <v-row>
          <div class="text-p blueText">Organization ID: {{ organizationAccountNumber }}</div>
        </v-row>
      </v-col>
      <v-col class="col-m-12 col-lg-4">
        <v-row class="justify-end">
          <div>Fiscal Year: {{ programYearLabel }}</div>
        </v-row>
        <v-btn class="blueButton" theme="dark" width="30%" align="left"> Add New Closure </v-btn>
      </v-col>
    </v-row>
  </v-container>
  <v-container width="100%">
    <v-row>
      <v-col>Program and policy to provide text </v-col>
      <v-col>
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
      :headers="closureTableHeaders"
      :items="ccfriClosures?.closures"
      :items-per-page="10"
      :search="search"
      class="elevation-1"
    >
      <template v-slot:[`item.ccofStatus`]="{ item }">
        <span :class="getCcofStatus(item.ccofStatus)">
          {{ item.ccofStatusValue }}
        </span>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-row>
          <v-btn size="small" color="white" @click="viewDetails(item)">View Details</v-btn>
          <v-btn size="small" color="white" @click="updateItem(item)">Update</v-btn>
          <v-btn size="small" color="white" @click="removeItem(item)">Remove</v-btn>
        </v-row>
      </template>
    </v-data-table>
  </v-container>
  <NavButton
    :is-next-displayed="false"
    :is-save-displayed="false"
    :is-next-disabled="true"
    :is-processing="processing"
    @previous="previous"
  />
</template>
<script>
import { mapState, mapActions } from 'pinia';
import { useAuthStore } from '@/store/auth.js';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { useReportChangesStore } from '@/store/reportChanges.js';
import { useMessageStore } from '@/store/message.js';
import { useRoute } from 'vue-router';
import NavButton from '@/components/util/NavButton.vue';

import facilityService from '@/services/facilityService.js';
import MessagesToolbar from '@/components/guiComponents/MessagesToolbar.vue';
import { PATHS, FACILITY_CLOSURE_STATUS, FACILITY_CLOSURE_FUNDING_ELIGIBILITY } from '@/utils/constants.js';
import alertMixin from '@/mixins/alertMixin.js';

export default {
  name: 'ClosuresPage',
  components: { MessagesToolbar, NavButton },
  mixins: [alertMixin],
  data() {
    return {
      input: '',
      PATHS: PATHS,
      results: {},
      isLoadingComplete: false,
      ccfriClosures: undefined,
      route: useRoute(),
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
    };
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useAppStore, ['renewalYearLabel', 'programYearList']),
    ...mapState(useApplicationStore, [
      'applicationIds',
      'getFacilityListForPCFByProgramYearId',
      'formattedProgramYear',
      'applicationType',
      'programYearId',
      'programYearLabel',
      'ccofApplicationStatus',
      'unlockBaseFunding',
      'isRenewal',
      'unlockDeclaration',
      'unlockEcewe',
      'unlockLicenseUpload',
      'unlockSupportingDocuments',
      'applicationStatus',
      'applicationMap',
      'applicationId',
    ]),
    ...mapState(useNavBarStore, ['navBarList', 'getNavByFacilityId']),
    ...mapState(useOrganizationStore, [
      'organizationAccountNumber',
      'organizationProviderType',
      'organizationId',
      'organizationName',
      'organizationAccountNumber',
    ]),
    ...mapState(useReportChangesStore, ['changeRequestStore']),
    lastItem() {
      if (this.ccfriClosures?.closures.length > 0) {
        return Math.min(this.firstItem + this.itemsPerPage - 1, this.ccfriClosures.closures.length);
      }
      return 0;
    },
    ccfriClosuresToShow() {
      return this.ccfriClosures.closures.slice(this.firstItem - 1, this.lastItem);
    },
  },
  async created() {
    this.isLoadingComplete = false;
    this.getAllMessagesVuex();
    this.refreshNavBarList();
    this.useNavBarStore = useNavBarStore();
    this.ccfriClosures = await facilityService.getCCFRIClosuresForFiscalYear(
      this.organizationId,
      useRoute().params.programYearGuid,
    );
    this.processClosures(this.ccfriClosures);
    this.isLoadingComplete = true;
  },
  methods: {
    ...mapActions(useMessageStore, ['getAllMessages']),
    ...mapActions(useNavBarStore, ['refreshNavBarList']),

    buttonColor(isDisabled) {
      return isDisabled ? 'disabledButton' : 'blueButton';
    },
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
          case FACILITY_CLOSURE_STATUS.DRAFT:
            closure.ccofStatusValue = 'Draft';
            break;
          case FACILITY_CLOSURE_STATUS.SUBMITTED:
            closure.ccofStatusValue = 'Submitted';
            break;
          case FACILITY_CLOSURE_STATUS.IN_PROGRESS:
            closure.ccofStatusValue = 'In progress';
            break;
          case FACILITY_CLOSURE_STATUS.APPROVED:
            closure.ccofStatusValue = 'Approved';
            break;
          case FACILITY_CLOSURE_STATUS.DENIED:
            closure.ccofStatusValue = 'Denied';
            break;
          default:
            closure.ccofStatusValue = '';
        }
        closure.ccofPaymentEligibilityValue = eligibility;
      }
    },
    getCcofStatus(ccofStatusNumber) {
      switch (ccofStatusNumber) {
        case FACILITY_CLOSURE_STATUS.DRAFT:
          return 'bg-blue';
        case FACILITY_CLOSURE_STATUS.SUBMITTED:
          return 'bg-yellow';
        case FACILITY_CLOSURE_STATUS.IN_PROGRESS:
          return 'bg-orange';
        case FACILITY_CLOSURE_STATUS.APPROVED:
          return 'bg-green';
        case FACILITY_CLOSURE_STATUS.DENIED:
          return 'bg-red';
        default:
          return 'bg-white';
      }
    },
    previous() {
      this.$router.push(PATHS.ROOT.HOME);
    },
  },
};
</script>

<style scoped>
.blueBorder {
  border-top: 5px solid #003366 !important;
}
.blueButton {
  background-color: #003366 !important;
}
.red-button {
  background-color: #d8292f;
  color: white;
}
.blueText {
  color: rgb(0, 52, 102) !important;
}
</style>
