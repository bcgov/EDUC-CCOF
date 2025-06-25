<template>
  <v-container class="pa-20" fluid>
    <h1>Funding Agreement Information</h1>
    <v-row v-if="isLoading" no-gutters>
      <v-col cols="12">
        <v-skeleton-loader type="paragraph" />
      </v-col>
    </v-row>

    <v-col class="mt-3">
      <v-card variant="outlined" class="soft-outline">
        <v-row v-if="fundingAgreement" class="mb-4" dense>
          <v-col cols="12" sm="6" xl="5" xxl="3">
            <p><AppLabel>Funding Agreement Term:</AppLabel></p>
          </v-col>
          <v-col class="d-flex align-end" cols="12" sm="6" xl="7" xxl="9">
            <p>{{ fundingAgreement.fundingAgreementTerm }}</p>
          </v-col>

          <v-col cols="12" sm="6" xl="5" xxl="3">
            <p><AppLabel>Funding Agreement Number:</AppLabel></p>
          </v-col>
          <v-col class="d-flex align-end" cols="12" sm="6" xl="7" xxl="9">
            <p>{{ fundingAgreement.fundingAgreementNumber }}</p>
          </v-col>

          <v-col cols="12" sm="6" xl="5" xxl="3">
            <p><AppLabel>Status:</AppLabel></p>
          </v-col>
          <v-col class="d-flex align-end" cols="12" sm="6" xl="7" xxl="9">
            <p>{{ fundingAgreement.fundingAgreementStatus }}</p>
          </v-col>

          <v-col cols="12" sm="6" xl="5" xxl="3">
            <p><AppLabel>Effective Date:</AppLabel></p>
          </v-col>
          <v-col class="d-flex align-end" cols="12" sm="6" xl="7" xxl="9">
            <p>{{ formatUTCDateToShortDateString(fundingAgreement.fundingAgreementStartDate) }}</p>
          </v-col>

          <v-col cols="12" sm="6" xl="5" xxl="3">
            <p><AppLabel>End Date:</AppLabel></p>
          </v-col>
          <v-col class="d-flex align-end" cols="12" sm="6" xl="7" xxl="9">
            <p>{{ formatUTCDateToShortDateString(fundingAgreement.endDate) }}</p>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <v-row>
      <v-col>
        <NavButton @previous="goBackToManageFundingAgreement" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppLabel from '@/components/guiComponents/AppLabel.vue';
import fundingAgreementService from '@/services/fundingAgreementService.js';
import { formatUTCDateToShortDateString } from '@/utils/format';
import { PATHS } from '@/utils/constants.js';
import NavButton from '@/components/util/NavButton.vue';

export default {
  name: 'ViewFundingAgreement',
  components: { AppLabel, NavButton },
  data() {
    return {
      isLoading: false,
      fundingAgreement: null,
    };
  },
  created() {
    this.loadFundingAgreement();
  },
  methods: {
    formatUTCDateToShortDateString,
    async loadFundingAgreement() {
      try {
        this.isLoading = true;
        const id = this.$route.params.id;
        const { applications = [] } = await fundingAgreementService.getFundingAgreements();
        const selected = applications.find((app) => app.fundingAgreementNumber === id);

        if (selected) {
          this.fundingAgreement = {
            fundingAgreementNumber: selected.fundingAgreementNumber,
            fundingAgreementTerm: selected.fundingAgreementTerm,
            fundingAgreementStatus: selected.fundingAgreementStatus,
            fundingAgreementStartDate: selected.fundingAgreementStartDate,
            endDate: selected.endDate,
          };
        }
      } catch (error) {
        console.error('Failed to load Funding Agreement', error);
      } finally {
        this.isLoading = false;
      }
    },
    goBackToManageFundingAgreement() {
      this.$router.push(`${PATHS.ROOT.MANAGE_ORG_FACILITIES}?tab=funding-agreement-tab`);
    },
  },
};
</script>
