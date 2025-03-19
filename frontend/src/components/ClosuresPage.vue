<!-- eslint-disable vue/no-v-html -->
<template>
  <v-container fluid class="pa-12">
    <MessagesToolbar />
    <v-row>
      <v-col class="col-m-12 col-lg-6">
        <div class="pb-12 text-h4 font-weight-bold">Organization Closures</div>
      </v-col>
      <v-col class="col-m-12 col-lg-6"> Fiscal Year: {{ route.params.programYearGuid }}</v-col>
    </v-row>
    <v-row>
      <v-col>
        <h2>{{ organizationName }}</h2>
        <p>Organization ID: {{ organizationId }}</p>
      </v-col>
      <v-col>
        <v-btn class="blueButton" theme="dark" width="30%" align="left"> Add New Closure </v-btn>
      </v-col>
    </v-row>
  </v-container>
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
  <v-container width="100%">
    <v-data-table
      :headers="closureTableHeaders"
      :items="ccfriClosures?.closures"
      :items-per-page="10"
      :search="search"
      class="elevation-1"
    >
    </v-data-table>
  </v-container>
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

import facilityService from '@/services/facilityService.js';
import MessagesToolbar from '@/components/guiComponents/MessagesToolbar.vue';
import { PATHS } from '@/utils/constants.js';
import alertMixin from '@/mixins/alertMixin.js';

export default {
  name: 'ClosuresPage',
  components: { MessagesToolbar },
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
        { title: 'Facility ID', sortable: true, value: 'id' },
        { title: 'Facility Name', sortable: true, value: 'name' },
        { title: 'Start Date', sortable: true, value: 'startDate' },
        { title: 'End Date', sortable: true, value: 'endDate' },
        { title: 'Status', sortable: true, value: 'status' },
        { title: 'Payment Eligibility', sortable: true, value: 'paymentEligibility' },
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
    ...mapState(useNavBarStore, ['navBarList']),
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
    this.ccfriClosures = await facilityService.getCCFRIClosuresForFiscalYear('a', 'a');
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
