import { defineStore } from 'pinia';

import FundingAgreementService from '@/services/fundingAgreementService.js';

export const useFundingAgreementStore = defineStore('fundingAgreement', {
  state: () => ({
    latestFundingAgreementActionStatus: null,
  }),

  actions: {
    async checkLatestFundingAgreementActionStatus(organizationId, applicationIds) {
      this.latestFundingAgreementActionStatus =
        (await FundingAgreementService.getLatestFundingAgreementActionStatus(organizationId, applicationIds)) ?? {};
    },
  },
});
