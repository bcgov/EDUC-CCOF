<template>
  <v-container class="pa-0 text-body-1" fluid>
    <v-row no-gutters>
      <v-col>
        <p>View and manage the funding agreements of your organization.</p>
      </v-col>
    </v-row>

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
        :mobile="null"
        mobile-breakpoint="md"
        class="elevation-2"
      >
        <template #[`item.fundingAgreementStartDate`]="{ item }">
          {{ formatUTCDateToShortDateString(item.fundingAgreementStartDate) }}
        </template>

        <template #[`item.endDate`]="{ item }">
          {{ formatUTCDateToShortDateString(item.endDate) }}
        </template>

        <template #[`item.actions`]="{ item }">
          <v-row class="action-buttons align-center justify-end justify-md-start">
            <AppButton :primary="false" size="small" @click="navigateToViewFundingAgreement(item.fundingAgreementId)">
              View Details
            </AppButton>
          </v-row>
        </template>
      </v-data-table>
    </v-skeleton-loader>
  </v-container>
</template>
<script>
import { mapState } from 'pinia';

import { formatUTCDateToShortDateString } from '@/utils/format';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { PATHS } from '@/utils/constants';

import AppButton from '@/components/guiComponents/AppButton.vue';
import FundingAgreementService from '@/services/fundingAgreementService.js';

export default {
  name: 'ManageFundingAgreements',
  components: { AppButton },
  data() {
    return {
      isLoading: false,
      showFundingAgreements: true,
      showModifications: true,
      fundingAgreements: [],
      sortBy: [{ key: 'fundingAgreementStartDate', sortDesc: false }],
      fundingAgreementTableHeaders: [
        { title: 'Funding Agreement Term', sortable: true, value: 'fundingAgreementTerm', width: '175px' },
        { title: 'Funding Agreement Number', sortable: true, value: 'fundingAgreementNumber', width: '175px' },
        { title: 'Status', sortable: true, value: 'fundingAgreementStatus', width: '175px' },
        { title: 'Actions', sortable: false, value: 'actions', width: '175px' },
        { title: 'Effective Date', sortable: true, value: 'fundingAgreementStartDate', width: '175px' },
        { title: 'End Date', sortable: true, value: 'endDate', width: '175px' },
      ],
    };
  },
  computed: {
    ...mapState(useOrganizationStore, ['organizationId']),
    filteredFundingAgreements() {
      return this.fundingAgreements.filter(
        (item) =>
          (this.showFundingAgreements && !item.isModification) || (this.showModifications && item.isModification),
      );
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
        const organizationId = this.organizationId;
        this.fundingAgreements = (await FundingAgreementService.getFundingAgreements(organizationId)) || [];
        this.fundingAgreements.forEach((app) => {
          app.isModification = app.fundingAgreementOrderNumber > 0;
        });
      } catch {
        this.setFailureAlert('Failed to load Funding Agreements');
      } finally {
        this.isLoading = false;
      }
    },
    navigateToViewFundingAgreement(id) {
      this.$router.push(`${PATHS.ROOT.VIEW_FUNDING_AGREEMENT}/${id}`);
    },
  },
};
</script>
