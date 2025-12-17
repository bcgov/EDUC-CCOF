<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-form ref="form">
      <v-expansion-panel-title>
        <SummaryExpansionPanelTitle
          title="CCOF Base Funding"
          :loading="isApplicationProcessing"
          :is-complete="isFormComplete"
        />
      </v-expansion-panel-title>
      <v-expansion-panel-text eager>
        <div>
          <p class="summary-label">Has your banking information changed?</p>
          <v-text-field
            placeholder="Required"
            class="summary-value"
            :model-value="getYesNoValue(summary?.hasBankingInfoChanged)"
            density="compact"
            flat
            variant="solo"
            hide-details
            readonly
            :rules="rules.required"
          />
          <p v-if="summary?.hasBankingInfoChanged" class="error-message">Invalid Response</p>
        </div>

        <div class="my-2">
          <p class="summary-label">I confirm I have read the Funding Agreement and:</p>
          <ul class="summary-label pl-6">
            <li>the organization information on the first page is correct;</li>
            <li>no licence needs to be added to, or removed from, the Funding Agreement; and</li>
            <li>the information in each Schedule A is correct.</li>
          </ul>
          <v-text-field
            placeholder="Required"
            class="summary-value"
            :model-value="getYesNoValue(summary?.isFundingAgreementConfirmed)"
            density="compact"
            flat
            variant="solo"
            hide-details
            readonly
            :rules="rules.required"
          />
          <p v-if="summary?.isFundingAgreementConfirmed === YES_NO_VALUES.NO" class="error-message">Invalid Response</p>
        </div>

        <div class="my-2">
          <p class="summary-label">I confirm all Licence and Service Details Records are correct.</p>
          <v-text-field
            placeholder="Required"
            class="summary-value"
            :model-value="getYesNoValue(summary?.areLicenceDetailsConfirmed)"
            density="compact"
            flat
            variant="solo"
            hide-details
            readonly
            :rules="rules.required"
          />
          <p v-if="summary?.areLicenceDetailsConfirmed === YES_NO_VALUES.NO" class="error-message">Invalid Response</p>
        </div>

        <div v-if="!isFormComplete" class="mt-4">
          <router-link :to="routingPath">
            <u class="text-error">To add this information, click here. This will bring you to a different page.</u>
          </router-link>
        </div>
      </v-expansion-panel-text>
    </v-form>
  </v-row>
</template>
<script>
import summaryMixin from '@/mixins/summaryMixin.js';
import ApplicationService from '@/services/applicationService';
import { pcfUrl } from '@/utils/constants.js';

export default {
  name: 'CCOFBaseFundingSummary',
  mixins: [summaryMixin],
  computed: {
    summary() {
      return this.summaryModel?.application;
    },
    isBankingInformationComplete() {
      return ApplicationService.isBankingInformationComplete(this.summary);
    },
    routingPath() {
      return this.isBankingInformationComplete
        ? pcfUrl(this.PATHS.CCOF_RENEWAL_FA, this.summary?.programYearId)
        : pcfUrl(this.PATHS.CCOF_RENEWAL_BANKING_INFORMATION, this.summary?.programYearId);
    },
    isFormComplete() {
      const isFundingAgreementComplete = ApplicationService.isFundingAgreementComplete(this.summary);
      return this.isBankingInformationComplete && isFundingAgreementComplete;
    },
  },
};
</script>
<style scoped>
:deep(::placeholder) {
  color: #d8292f !important;
  opacity: 1 !important;
}

:deep(.v-field__input) {
  padding-left: 0px;
}
</style>
