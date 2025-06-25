<template>
  <v-container class="pa-0 text-body-1" fluid>
    <v-row no-gutters>
      <v-col>
        <p>View and manage the funding agreements of your organization.</p>
      </v-col>
    </v-row>
    <div style="height: 12px"></div>

    <v-row class="mb-4" align="center">
      <v-col cols="auto">
        <v-checkbox v-model="showFundingAgreements" label="Funding Agreement" density="compact" />
      </v-col>

      <v-col cols="auto">
        <v-checkbox v-model="showModifications" label="Funding Agreement Modification" density="compact" />
      </v-col>
    </v-row>

    <v-skeleton-loader :loading="isLoading" type="table-tbody">
      <v-data-table
        v-model:sort-by="sortBy"
        :items="filteredFundingAgreements"
        :headers="fundingAgreementTableHeaders"
        :items-per-page="10"
        class="elevation-2"
      >
        <template #[`item.fundingAgreementStartDate`]="{ item }">
          {{ formatUTCDateToShortDateString(item.fundingAgreementStartDate) }}
        </template>

        <template #[`item.endDate`]="{ item }">
          {{ formatUTCDateToShortDateString(item.endDate) }}
        </template>

        <template #[`item.actions`]="{ item }">
          <v-row no-gutters class="my-2 align-center justify-end justify-md-start">
            <AppButton
              :primary="false"
              size="small"
              @click="navigateToViewFundingAgreement(item.fundingAgreementNumber)"
            >
              Open
            </AppButton>
          </v-row>
        </template>
      </v-data-table>
    </v-skeleton-loader>
  </v-container>
</template>
<script>
import { formatUTCDateToShortDateString } from '@/utils/format';
import fundingAgreementService from '@/services/fundingAgreementService.js';
import AppButton from '@/components/guiComponents/AppButton.vue';
import { PATHS } from '@/utils/constants';
export default {
  name: 'ManageFundingAgreement',
  components: { AppButton },
  data() {
    return {
      isLoading: false,
      showFundingAgreements: true,
      showModifications: true,
      fundingAgreements: [],
      sortBy: [{ key: 'fundingAgreementStartDate', sortDesc: false }],
      fundingAgreementTableHeaders: [
        { title: 'Facility Agreement Term', sortable: true, value: 'fundingAgreementTerm' },
        { title: 'Facility Agreement Number', sortable: true, value: 'fundingAgreementNumber' },
        { title: 'Status', sortable: true, value: 'fundingAgreementStatus' },
        { title: 'Effective Date', sortable: true, value: 'fundingAgreementStartDate' },
        { title: 'End Date', sortable: true, value: 'endDate' },
        { title: 'Actions', sortable: false, value: 'actions' },
      ],
    };
  },
  computed: {
    filteredFundingAgreements() {
      return this.fundingAgreements.filter((item) => {
        const isAgreement = item.isModification === false;
        const isModification = item.isModification === true;
        return (this.showFundingAgreements && isAgreement) || (this.showModifications && isModification);
      });
    },
  },
  async created() {
    await this.loadData();
  },
  methods: {
    formatUTCDateToShortDateString,
    async loadData() {
      try {
        this.isLoading = true;
        const response = await fundingAgreementService.getFundingAgreements();
        const applications = response.applications || [];
        this.fundingAgreements = applications.map((app) => ({
          fundingAgreementNumber: app.fundingAgreementNumber,
          fundingAgreementTerm: app.fundingAgreementTerm,
          fundingAgreementStatus: app.fundingAgreementStatus,
          fundingAgreementStartDate: app.fundingAgreementStartDate,
          endDate: app.endDate,
          isModification: app.fundingAgreementOrderNumber > 0,
        }));
      } catch {
        this.setFailureAlert('Failed to load Funding Agreements');
      } finally {
        this.isLoading = false;
      }
    },
    navigateToViewFundingAgreement(agreementNumber) {
      this.$router.push(`${PATHS.ROOT.VIEW_FUNDING_AGREEMENT}/${agreementNumber}`);
    },
  },
};
</script>
