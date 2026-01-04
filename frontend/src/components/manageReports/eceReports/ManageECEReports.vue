<template>
  <div class="px-12 mb-12">
    <p class="text-h4 font-weight-bold">Monthly ECE Report</p>
    <div class="text-h6 text-primary mt-2">
      <p class="font-weight-bold my-2">{{ organizationName }}</p>
      <p>{{ organizationAccountNumber }}</p>
    </div>
    <p class="my-4">View, create and update monthly ECE reports for your facility(ies).</p>
    <!-- TODO: Implement ECE Reports permission -->
    <AppButton size="medium" @click="toggleCreateECEReportDialog"> Create ECE Report </AppButton>
    <v-card variant="outlined" class="pa-6 mt-8">
      <p>This is a placeholder for the ECE Reports table.</p>
    </v-card>
    <CreateECEReportDialog
      :show="showCreateECEReportDialog"
      :ece-reports="eceReports"
      @close="showCreateECEReportDialog = false"
    />
  </div>
  <NavButton @previous="$router.push(`${PATHS.ROOT.MANAGE_REPORTS}`)" />
</template>

<script>
import { mapState } from 'pinia';
import AppButton from '@/components/guiComponents/AppButton.vue';
import CreateECEReportDialog from '@/components/manageReports/eceReports/CreateECEReportDialog.vue';
import NavButton from '@/components/util/NavButton.vue';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { PATHS } from '@/utils/constants.js';

export default {
  name: 'ManageECEReports',
  components: { AppButton, CreateECEReportDialog, NavButton },
  data() {
    return {
      eceReports: [],
      showCreateECEReportDialog: false,
    };
  },
  computed: {
    ...mapState(useOrganizationStore, ['organizationAccountNumber', 'organizationName']),
  },
  created() {
    this.PATHS = PATHS;
  },
  methods: {
    toggleCreateECEReportDialog() {
      this.showCreateECEReportDialog = !this.showCreateECEReportDialog;
    },
  },
};
</script>
