<!-- eslint-disable vue/no-v-html -->
<template>
  <v-container fluid class="pa-12">
    <MessagesToolbar />
    <v-row>
      <v-col>
        <h1>Organization Closures</h1>
      </v-col>
      <v-col> Fiscal Year: {{ route.params.programYearGuid }}</v-col>
    </v-row>
    <v-row>
      <v-col>
        <p>{{ organizationName }}</p>
        <p>Organization ID: {{ organizationId }}</p>
      </v-col>
      <v-col>
        <v-btn
          class="blueButton"
          theme="dark"
          width="30%"
          align="left"
          @click="actionRequiredFacilityRoute(facility?.ccfriApplicationId)"
        >
          Add New Closure
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
  <v-container class="pa-12 border">
    <v-row>
      <v-col>Program and policy to provide text </v-col>
      <v-col>
        <v-row>
          <h3>Filter by Facility</h3>
          <h3>:]</h3>
          <v-text-field
            v-model="input"
            clearable
            variant="filled"
            label="Filter by Facility Name and Facility ID "
            :bind="input"
          />
        </v-row>
      </v-col>
    </v-row>
    <v-container class="border">
      <v-row>
        <v-col>
          <v-table v-if="isLoadingComplete">
            <thead>
              <tr>
                <th class="text-left">Facility ID</th>
                <th class="text-left">Facility Name</th>
                <th class="text-left">Start Date</th>
                <th class="text-left">End Date</th>
                <th class="text-left">Status</th>
                <th class="text-left">Payment Eligibility</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(closure, index) in ccfriClosures.closures" :key="index">
                <td>{{ closure.id }}</td>
                <td>{{ closure.name }}</td>
                <td>{{ closure.startDate }}</td>
                <td>{{ closure.endDate }}</td>
                <td>{{ closure.status }}</td>
                <td>{{ closure.paymentEligibility }}</td>
                <td>Selectors</td>
              </tr>
              <tr></tr>
            </tbody>
          </v-table>
          <v-row class="justify-end">
            <v-col cols="auto">
              <!-- Pagination Controls -->
              <!-- Rows per page selector -->
              <v-row v-if="isLoadingComplete" class="d-flex" style="gap: 16px">
                <text>Items per page:</text>
                <v-select v-model="itemsPerPage" :items="[5, 10, 15, 20]" density="compact" style="width: 150px" />
                <text>{{ firstItem }}-{{ lastItem }} of {{ ccfriClosures.closures.length }}</text>
                <v-btn><</v-btn>
                <v-btn>></v-btn>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
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
      itemsPerPage: 10,
      firstItem: 0,
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
  },
  async created() {
    this.isLoadingComplete = false;
    this.getAllMessagesVuex();
    this.refreshNavBarList();
    this.ccfriClosures = await facilityService.getCCFRIClosuresForFiscalYear('a', 'a');
    this.firstItem = this.ccfriClosures?.closures ? 1 : 0;
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
