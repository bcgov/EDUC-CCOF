<!-- eslint-disable vue/no-v-html -->
<template>
  <v-container fluid class="pa-12">
    <MessagesToolbar />
    <v-row>
      <v-col>
        <h1>Organization Closures</h1>
      </v-col>
      <v-col> Fiscal Year: {{ programYearGuid }}</v-col>
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
    <v-table>
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
      <tbody></tbody>
    </v-table>
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
  },
  async created() {
    this.isLoadingComplete = false;
    this.getAllMessagesVuex();
    this.refreshNavBarList();
    this.ccfriClosures = this.getCCFRIClosuresForFiscalYear(,'2ad4c331-9434-ed11-9db1-002248d53d53');
    await this.getChangeRequestList();
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
