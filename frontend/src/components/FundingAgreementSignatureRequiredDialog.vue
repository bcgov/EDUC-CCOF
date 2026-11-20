<template>
  <AppDialog v-model="isDisplayed" persistent max-width="900px" text-alignment="left" @close="isDisplayed = false">
    <template #content>
      <p class="text-h6">
        <strong>You have a Funding Agreement ready to review and sign.</strong>
      </p>
      <p class="text-primary text-h6 mt-4">Would you like to take action now?</p>
    </template>
    <template #button>
      <v-row class="px-9 flex-column flex-md-row justify-md-space-between">
        <AppButton :primary="false" class="text-body-2 mb-4 mb-md-0" min-width="250px" @click="isDisplayed = false">
          Not now
        </AppButton>
        <AppButton class="text-body-2" min-width="250px" @click="goToFundingAgreement()">
          Yes, take me to my Funding Agreement
        </AppButton>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';

import { PATHS } from '@/utils/constants.js';

export default {
  name: 'FundingAgreementSignatureRequiredDialog',
  components: { AppButton, AppDialog },
  data() {
    return {
      isDisplayed: true,
    };
  },
  methods: {
    goToFundingAgreement() {
      this.$router.push(`${PATHS.ROOT.MANAGE_ORG_FACILITIES}?tab=funding-agreement-tab`);
    },
  },
};
</script>
