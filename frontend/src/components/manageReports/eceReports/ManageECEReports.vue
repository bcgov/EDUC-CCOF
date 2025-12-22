<template>
  <div class="px-12 mb-12">
    <p class="text-h4 font-weight-bold">Monthly ECE Report</p>
    <div class="text-h6 text-primary mt-2">
      <p class="font-weight-bold my-2">{{ organizationName }}</p>
      <p>{{ organizationAccountNumber }}</p>
    </div>
    <p class="my-4">View, create and update monthly ECE reports for your facility(ies).</p>
    <!-- TODO: Implement ECE Reports permission -->
    <AppButton :loading="loading" size="medium" @click="toggleCreateECEReportDialog"> Create ECE Report </AppButton>
    <v-card variant="outlined" class="pa-6 mt-8">
      <p>This is a placeholder for the ECE Reports table.</p>
    </v-card>
    <CreateECEReportDialog
      :show="showCreateECEReportDialog"
      :ece-reports="eceReports"
      @close="showCreateECEReportDialog = false"
      @reload="loadData"
    />
  </div>
  <NavButton @previous="$router.push(`${PATHS.ROOT.MANAGE_REPORTS}`)" />
</template>

<script>
import { mapState } from 'pinia';
import AppButton from '@/components/guiComponents/AppButton.vue';
import CreateECEReportDialog from '@/components/manageReports/eceReports/CreateECEReportDialog.vue';
import NavButton from '@/components/util/NavButton.vue';
import alertMixin from '@/mixins/alertMixin.js';
import permissionsMixin from '@/mixins/permissionsMixin.js';
import ECEReportService from '@/services/eceReportService.js';
import { useAppStore } from '@/store/app.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { PATHS } from '@/utils/constants.js';

export default {
  name: 'ManageECEReports',
  components: { AppButton, CreateECEReportDialog, NavButton },
  mixins: [alertMixin, permissionsMixin],
  data() {
    return {
      loading: false,
      eceReports: [],
      selectedProgramYear: null,
      showCreateECEReportDialog: false,
    };
  },
  computed: {
    ...mapState(useAppStore, ['programYearList']),
    ...mapState(useOrganizationStore, ['organizationAccountNumber', 'organizationId', 'organizationName']),
  },
  async created() {
    this.PATHS = PATHS;
    this.selectedProgramYearId = this.programYearList?.newApp?.programYearId;
    await this.loadData();
  },
  methods: {
    async loadData() {
      try {
        this.loading = true;
        this.eceReports = await ECEReportService.getECEReports({
          organizationId: this.organizationId,
          programYearId: this.selectedProgramYearId,
        });
        console.log(this.eceReports);
      } catch (error) {
        console.log(error);
        this.setFailureAlert('Failed to load ECE reports');
      } finally {
        this.loading = false;
      }
    },
    toggleCreateECEReportDialog() {
      this.showCreateECEReportDialog = !this.showCreateECEReportDialog;
    },
  },
};
</script>
<style scoped>
.action-buttons {
  gap: 8px;
  padding: 10px;
}

.report-status {
  min-width: 112px;
}
</style>
