<template>
  <v-container fluid class="pa-12">
    <v-alert class="mb-4 text-center" density="compact" type="info" color="#fff9c4" :icon="false">
      REMINDER: Please review and update your User Contacts, Organization Information, Facility Details, and Programs
      and Vacancies questionnaire to ensure accurate and up-to-date information.
    </v-alert>
    <h1>Submit and Manage Facility Reports</h1>
    <p class="mb-6">
      <b>{{ organizationName }}</b> <br />
      ID: {{ organizationAccountNumber }}
    </p>
    <p>
      <v-icon class="mr-2" icon="mdi-information" color="#003366 " />
      <b>NOTE:</b> You must notify the Child Care Operating Funding Program within two business days of any change to
      your Facility Licence or Child Care Services.
      <a href="#" @click.prevent="goToChangeRequest">Submit a change request</a> to notify the Child Care Operating
      Funding Program.
    </p>
    <v-row>
      <v-col>
        <SmallCard :disable="!isCCOFApproved">
          <template #content>
            <h2 class="mb-2">Enrolment Report</h2>
            <p>
              Edit, submit, view, or adjust your enrolment reports to receive Child Care Operating Funding (CCOF) and/or
              the Child Care Fee Reduction Initiative (CCFRI).
            </p>
            <br />
          </template>
          <template #button>
            <v-row>
              <v-col>
                <v-btn dark class="blueButton mb-10" @click="goToEnrolmentReports">Manage Enrolment Report</v-btn>
              </v-col>
            </v-row>
          </template>
        </SmallCard>
      </v-col>
      <v-col>
        <SmallCard>
          <template #content>
            <h2 class="mb-2">Monthly ECE Report</h2>
            <p>
              Edit, submit, view, or adjust your Monthly ECE Report to receive the Early Childhood Educator Wage
              Enhancement (ECE-WE).
            </p>
            <br />
          </template>
          <template #button>
            <v-row>
              <v-col>
                <v-btn dark class="blueButton mb-10" @click="goToEceReports">Manage ECE Report</v-btn>
              </v-col>
            </v-row>
          </template>
        </SmallCard>
      </v-col>
    </v-row>

    <NavButton
      :is-next-displayed="false"
      :is-save-displayed="false"
      :is-next-disabled="true"
      @previous="() => $router.back()"
      @next="false"
    />
  </v-container>
</template>
<script>
import { mapState } from 'pinia';
import { PATHS } from '@/utils/constants.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { useApplicationStore } from '@/store/application.js';
import { useNavBarStore } from '@/store/navBar.js';
import { getCcofStatus, isOrganizationUnlocked } from '@/utils/common';

import SmallCard from '@/components/guiComponents/SmallCard.vue';
import NavButton from '@/components/util/NavButton.vue';

export default {
  name: 'ManageReports',
  components: { SmallCard, NavButton },
  computed: {
    ...mapState(useOrganizationStore, ['organizationName', 'organizationAccountNumber']),
    ...mapState(useApplicationStore, [
      'applicationType',
      'applicationStatus',
      'ccofApplicationStatus',
      'unlockDeclaration',
      'unlockEcewe',
      'unlockLicenseUpload',
      'unlockSupportingDocuments',
    ]),
    ...mapState(useNavBarStore, ['navBarList']),
    ccofStatus() {
      return getCcofStatus(
        this.applicationStatus,
        this.applicationType,
        this.isOrganizationUnlock,
        this.ccofApplicationStatus,
      );
    },
    isOrganizationUnlock() {
      return isOrganizationUnlocked(
        this.unlockBaseFunding,
        this.applicationType,
        this.unlockEcewe,
        this.unlockLicenseUpload,
        this.unlockSupportingDocuments,
        this.navBarList,
      );
    },
    isCCOFApproved() {
      return this.applicationType === 'RENEW' || this.ccofStatus === this.CCOF_STATUS.APPROVED;
    },
  },
  methods: {
    goToEnrolmentReports() {
      this.$router.push(PATHS.ROOT.ENROLMENT_REPORTS);
    },
    goToEceReports() {
      alert('UPDATE ME');
    },
    goToChangeRequest() {
      this.$router.push(PATHS.ROOT.CHANGE_LANDING);
    },
  },
};
</script>

<style scoped>
/* These are default framework settings that was somehow allowed to be overriden in CcfriEstimator.vue */
:deep(.v-card) {
  overflow-wrap: break-word;
}
:deep(h1) {
  font-size: 2em;
}
</style>
