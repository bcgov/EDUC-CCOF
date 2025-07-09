<template>
  <v-container class="pa-0 text-body-1" fluid>
    <v-row no-gutters>
      <v-col cols="12">
        <p class="mb-4">View and manage the funding agreements for your organization.</p>
      </v-col>
      <v-col cols="12" md="9">
        <p class="mb-2">
          You must notify the Child Care Operating Funding Program within <strong>two business days</strong> of any
          change to your Facility License or Child Care Services outlined in Schedule A of your Child Care Operating
          Funding Agreement.
        </p>
      </v-col>
    </v-row>
    <div class="my-4"></div>
    <v-card variant="outlined" class="soft-outline fill-height px-2 py-1">
      <v-row class="align-center">
        <v-col cols="auto">
          <p class="font-weight-bold">Select a funding agreement term:</p>
        </v-col>
        <v-col cols="12" md="4" xl="2">
          <AppMultiSelectInput
            v-model="selectedTerms"
            :items="fundingAgreementTerms"
            item-value="fundingAgreementTerm"
            item-title="term"
            clearable
            hide-details
          />
        </v-col>
      </v-row>
      <v-skeleton-loader :loading="isLoading" type="table-tbody">
        <v-data-table
          :items="filteredFundingAgreements"
          :headers="fundingAgreementTableHeaders"
          :items-per-page="10"
          :mobile="null"
          mobile-breakpoint="md"
          class="elevation-2"
        >
          <template #[`item.fundingAgreementStatus`]="{ item }">
            <span :class="getStatusClass(item.fundingAgreementStatus)">
              {{ item.fundingAgreementStatus }}
            </span>
          </template>

          <template #[`item.fundingAgreementStartDate`]="{ item }">
            {{ formatUTCDate(item.fundingAgreementStartDate) }}
          </template>

          <template #[`item.endDate`]="{ item }">
            {{ formatUTCDate(item.endDate) }}
          </template>

          <template #[`item.actions`]="{ item }">
            <v-row class="action-buttons align-center justify-end justify-md-start ga-2">
              <AppButton :primary="false" size="small" @click="navigateToViewFundingAgreement(item.fundingAgreementId)">
                View
              </AppButton>
              <AppButton :primary="false" size="small" @click="downloadPDFFundingAgreement(item.fundingAgreementId)">
                Download
              </AppButton>
            </v-row>
          </template>
        </v-data-table>
      </v-skeleton-loader>
    </v-card>
  </v-container>
</template>
<script>
import { mapState } from 'pinia';
import { isEmpty } from 'lodash';

import { formatUTCDate } from '@/utils/format';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { PATHS, FUNDING_AGREEMENTS_STATUS } from '@/utils/constants';

import AppButton from '@/components/guiComponents/AppButton.vue';
import AppMultiSelectInput from '@/components/guiComponents/AppMultiSelectInput.vue';
import FundingAgreementService from '@/services/fundingAgreementService.js';

export default {
  name: 'ManageFundingAgreements',
  components: { AppButton, AppMultiSelectInput },
  data() {
    return {
      isLoading: false,
      fundingAgreements: [],
      fundingAgreementTerms: [],
      selectedTerms: [],
      fundingAgreementTableHeaders: [
        { title: 'Funding Agreement Term', sortable: true, value: 'fundingAgreementTerm' },
        { title: 'Funding Agreement Number', sortable: true, value: 'fundingAgreementNumber' },
        { title: 'Status', sortable: true, value: 'fundingAgreementStatus' },
        { title: 'Actions', sortable: false, value: 'actions', width: '200px' },
        { title: 'Effective Date', sortable: true, value: 'fundingAgreementStartDate' },
        { title: 'End Date', sortable: true, value: 'endDate' },
      ],
    };
  },
  computed: {
    ...mapState(useOrganizationStore, ['organizationId']),
    filteredFundingAgreements() {
      return isEmpty(this.selectedTerms)
        ? this.fundingAgreements
        : this.fundingAgreements.filter((agreement) => this.selectedTerms.includes(agreement.fundingAgreementTerm));
    },
  },
  async created() {
    await this.loadData();
  },
  methods: {
    formatUTCDate,
    async loadData() {
      await this.loadFundingAgreements();
      this.fundingAgreementTerms = [...new Set(this.fundingAgreements.map((a) => a.fundingAgreementTerm))].map(
        (term) => ({ term, fundingAgreementTerm: term }),
      );
    },
    async loadFundingAgreements() {
      try {
        this.isLoading = true;
        this.fundingAgreements = (await FundingAgreementService.getFundingAgreements(this.organizationId)) || [];
        this.sortFundingAgreements();
      } catch {
        this.setFailureAlert('Failed to load Funding Agreements');
      } finally {
        this.isLoading = false;
      }
    },
    navigateToViewFundingAgreement(id) {
      this.$router.push(`${PATHS.ROOT.VIEW_FUNDING_AGREEMENT}/${id}`);
    },
    goToChangeRequestHistory() {
      this.$router.push(PATHS.ROOT.CHANGE_LANDING + '#change-request-history');
    },
    getStatusClass(status) {
      switch (status) {
        case FUNDING_AGREEMENTS_STATUS.DRAFTED:
        case FUNDING_AGREEMENTS_STATUS.DRAFTED_PROVIDER_ACTION_REQUIRED:
        case FUNDING_AGREEMENTS_STATUS.DRAFTED_WITH_MINISTRY:
          return 'status-gray';
        case FUNDING_AGREEMENTS_STATUS.REPLACED:
          return 'status-yellow';
        case FUNDING_AGREEMENTS_STATUS.ACTIVE:
          return 'status-blue';
        case FUNDING_AGREEMENTS_STATUS.APPROVED:
          return 'status-green';
        case FUNDING_AGREEMENTS_STATUS.EXPIRED:
          return 'status-purple';
        case FUNDING_AGREEMENTS_STATUS.CANCELLED:
        case FUNDING_AGREEMENTS_STATUS.SUSPENDED:
        case FUNDING_AGREEMENTS_STATUS.TERMINATED:
          return 'status-red';
        default:
          return '';
      }
    },
    sortFundingAgreements() {
      this.fundingAgreements?.sort((a, b) => {
        // 1. Sort by FA Term
        if (a.fundingAgreementTerm !== b.fundingAgreementTerm) {
          return b.fundingAgreementTerm.localeCompare(a.fundingAgreementTerm);
        }
        // 2. Sort by Funding Agreement Number
        const fundingagreementA = a.fundingAgreementOrderNumber ?? 0;
        const fundingagreementB = b.fundingAgreementOrderNumber ?? 0;
        return fundingagreementB - fundingagreementA;
      });
    },
  },
};
</script>
