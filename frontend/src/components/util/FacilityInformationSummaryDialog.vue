<template>
  <AppDialog v-model="isDisplayed" title="Facility Information Summary" :loading="isLoading" @close="closeDialog">
    <template #content>
      <v-expansion-panel
        v-if="facility?.facilityInfo"
        :key="`${facility.facilityId}-facility-information`"
        :value="`${facility.facilityId}-facility-information`"
        variant="accordion"
      >
        <FacilityInformationSummary
          :facility-info="facility?.facilityInfo"
          :funding="facility?.funding"
          :facility-id="facility.facilityId"
          :ccfri-status="facility?.ccfri?.ccfriOptInStatus"
          :ecewe-status="facility?.ecewe?.optInOrOut"
          :license-categories="facility?.licenseCategories"
          :provider-type="summaryModel?.application?.organizationProviderType"
          :change-rec-guid="facility?.changeRequestId"
          :program-year-id="programYearId"
          @is-summary-valid="isFormComplete"
        />
      </v-expansion-panel>
      <v-expansion-panel
        :key="`${facility.facilityId}-ccof-summary`"
        :value="`${facility.facilityId}-ccof-summary`"
        variant="accordion"
      >
        <div v-if="!facility.funding || isRenewal" />
        <div v-else>
          <CCOFSummaryFamily
            v-if="summaryModel?.application?.organizationProviderType === ORGANIZATION_PROVIDER_TYPES.FAMILY"
            :funding="facility.funding"
            :facility-id="facility.facilityId"
            :program-year-id="programYearId"
            @is-summary-valid="isFormComplete"
          />
          <CCOFSummary
            v-else
            :funding="facility.funding"
            :facility-id="facility.facilityId"
            :change-rec-guid="facility.changeRequestId"
            :program-year-id="programYearId"
            @is-summary-valid="isFormComplete"
          />
        </div>
      </v-expansion-panel>
      <v-expansion-panel
        :key="`${facility.facilityId}-ccfri-summary`"
        :value="`${facility.facilityId}-ccfri-summary`"
        variant="accordion"
      >
        <CCFRISummary
          :ccfri="facility?.ccfri"
          :facility-id="facility.facilityId"
          :change-rec-guid="facility?.changeRequestId"
          :program-year-id="programYearId"
          @is-summary-valid="isFormComplete"
        />
      </v-expansion-panel>
      <v-expansion-panel
        v-if="facility?.rfiApp"
        :key="`${facility.facilityId}-rfi-summary`"
        :value="`${facility.facilityId}-rfi-summary`"
        variant="accordion"
      >
        <RFISummary
          :rfi-app="facility?.rfiApp"
          :ccfri-id="facility?.ccfri?.ccfriId"
          :facility-id="facility.facilityId"
          :change-rec-guid="facility?.changeRequestId"
          :program-year-id="programYearId"
          @is-summary-valid="isFormComplete"
        />
      </v-expansion-panel>
      <v-expansion-panel
        v-if="facility?.nmfApp"
        :key="`${facility.facilityId}-nmf-summary`"
        :value="`${facility.facilityId}-nmf-summary`"
        variant="accordion"
      >
        <NMFSummary
          :nmf-app="facility?.nmfApp"
          :ccfri-id="facility?.ccfri?.ccfriId"
          :facility-id="facility.facilityId"
          :change-rec-guid="facility?.changeRequestId"
          :program-year-id="programYearId"
          @is-summary-valid="isFormComplete"
        />
      </v-expansion-panel>
      <v-expansion-panel
        v-if="facility?.ccfri?.enableAfs"
        :key="`${facility.facilityId}-afs-summary`"
        :value="`${facility.facilityId}-afs-summary`"
        variant="accordion"
      >
        <AFSSummary
          :ccfri-id="facility?.ccfri?.ccfriId"
          :facility-id="facility?.facilityId"
          :program-year-id="programYearId"
          @is-summary-valid="isFormComplete"
        />
      </v-expansion-panel>

      <v-expansion-panel
        :key="`${facility.facilityId}-ecewe-summary-a`"
        :value="`${facility.facilityId}-ecewe-summary-a`"
        variant="accordion"
      >
        <ECEWESummary
          :ecewe="{}"
          :ecewe-facility="facility.ecewe"
          :funding-model="summaryModel?.ecewe?.fundingModel"
          :is-processing="isProcessing"
          :change-rec-guid="facility.changeRequestId"
          :program-year-id="programYearId"
          @is-summary-valid="isFormComplete"
        />
      </v-expansion-panel>
    </template>
    <template #button>
      <v-row justify="space-around">
        <v-col cols="12" class="d-flex justify-center">
          <AppButton
            id="back-button"
            :loading="isLoading"
            :primary="false"
            size="large"
            width="400px"
            @click="closeDialog"
          >
            Back to Summary
          </AppButton>
        </v-col>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';
import FacilityInformationSummary from '@/components/summary/group/FacilityInformationSummary.vue';
import CCOFSummary from '@/components/summary/group/CCOFSummary.vue';
import ECEWESummary from '@/components/summary/group/ECEWESummary.vue';
import CCFRISummary from '@/components/summary/group/CCFRISummary.vue';
import RFISummary from '@/components/summary/group/RFISummary.vue';
import NMFSummary from '@/components/summary/group/NMFSummary.vue';
import AFSSummary from '@/components/summary/group/AFSSummary.vue';
import CCOFSummaryFamily from '@/components/summary/group/CCOFSummaryFamily.vue';

import alertMixin from '@/mixins/alertMixin';
import { ORGANIZATION_PROVIDER_TYPES } from '@/utils/constants.js';

export default {
  name: 'CancelApplicationDialog',
  components: {
    AppButton,
    AppDialog,
    NMFSummary,
    RFISummary,
    AFSSummary,
    FacilityInformationSummary,
    CCOFSummary,
    CCFRISummary,
    ECEWESummary,
    CCOFSummaryFamily,
  },
  mixins: [alertMixin],
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    facility: {
      type: Object,
      required: true,
    },
    programYearId: {
      type: String,
      default: '',
    },
  },
  emits: ['close'],
  data() {
    return {
      isDisplayed: false,
      isLoading: false,
    };
  },
  watch: {
    show: {
      handler(value) {
        this.isDisplayed = value;
      },
    },
  },
  created() {
    this.ORGANIZATION_PROVIDER_TYPES = ORGANIZATION_PROVIDER_TYPES;
  },
  methods: {
    closeDialog() {
      this.$emit('close');
    },
  },
};
</script>
