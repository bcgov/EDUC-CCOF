<template>
  <AppDialog
    v-model="isDisplayed"
    title="Facility Information"
    :loading="isApplicationProcessing"
    text-alignment="left"
    @close="closeDialog"
  >
    <template #content>
      <FacilityInformationSummaryDialogHeader
        :facility-info="facility?.facilityInfo"
        :ccfri-status="facility?.ccfri?.ccfriOptInStatus"
        :ecewe-status="facility?.ecewe?.optInOrOut"
        :license-categories="facility?.licenseCategories"
      />
      <v-expansion-panels v-model="expandedPanels" multiple>
        <v-expansion-panel
          v-if="!isRenewal && facility?.facilityInfo"
          :key="`${facility.facilityId}-facility-information`"
          :value="`${facility.facilityId}-facility-information`"
          variant="accordion"
        >
          <FacilityInformationSummary
            :facility-info="facility?.facilityInfo"
            :funding="facility?.funding"
            :facility-id="facility.facilityId"
            :change-rec-guid="facility?.changeRequestId"
            :program-year-id="programYearId"
          />
        </v-expansion-panel>
        <v-expansion-panel
          v-if="!isRenewal && facility.funding"
          :key="`${facility.facilityId}-ccof-summary`"
          :value="`${facility.facilityId}-ccof-summary`"
          variant="accordion"
        >
          <CCOFSummaryFamily
            v-if="!isGroup"
            :funding="facility.funding"
            :facility-id="facility.facilityId"
            :program-year-id="programYearId"
          />
          <CCOFSummary
            v-else
            :funding="facility.funding"
            :facility-id="facility.facilityId"
            :change-rec-guid="facility.changeRequestId"
            :program-year-id="programYearId"
          />
        </v-expansion-panel>
        <v-expansion-panel
          :key="`${facility.facilityId}-ccfri-summary`"
          :value="`${facility.facilityId}-ccfri-summary`"
          variant="accordion"
        >
          <CCFRISummary
            :ccfri="facility?.ccfri"
            :change-rec-guid="facility?.changeRequestId"
            :program-year-id="programYearId"
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
            :change-rec-guid="facility?.changeRequestId"
            :program-year-id="programYearId"
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
            :change-rec-guid="facility?.changeRequestId"
            :program-year-id="programYearId"
          />
        </v-expansion-panel>
        <v-expansion-panel
          v-if="!showApplicationTemplateV1"
          :key="`${facility.facilityId}-closures-summary`"
          :value="`${facility.facilityId}-closures-summary`"
          variant="accordion"
        >
          <ClosuresSummary
            :ccfri="facility?.ccfri"
            :change-rec-guid="facility?.changeRequestId"
            :program-year-id="programYearId"
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
            :change-rec-guid="facility.changeRequestId"
            :program-year-id="programYearId"
          />
        </v-expansion-panel>

        <v-expansion-panel
          :key="`${facility.facilityId}-uploaded-documents-summary`"
          :value="`${facility.facilityId}-uploaded-documents-summary`"
          variant="accordion"
        >
          <UploadedDocumentsSummary
            :facility-id="facility?.facilityId"
            :program-year-id="summaryModel?.application?.programYearId"
          />
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
    <template #button>
      <v-row class="justify-center">
        <AppButton
          id="back-button"
          :loading="isApplicationProcessing"
          :primary="false"
          size="large"
          @click="closeDialog"
        >
          Back to Summary
        </AppButton>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import { mapState } from 'pinia';

import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';
import FacilityInformationSummary from '@/components/summary/group/FacilityInformationSummary.vue';
import CCOFSummary from '@/components/summary/group/CCOFSummary.vue';
import ECEWESummary from '@/components/summary/group/ECEWESummary.vue';
import CCFRISummary from '@/components/summary/group/CCFRISummary.vue';
import ClosuresSummary from '@/components/summary/group/ClosuresSummary.vue';
import RFISummary from '@/components/summary/group/RFISummary.vue';
import NMFSummary from '@/components/summary/group/NMFSummary.vue';
import AFSSummary from '@/components/summary/group/AFSSummary.vue';
import UploadedDocumentsSummary from '@/components/summary/group/UploadedDocumentsSummary.vue';
import CCOFSummaryFamily from '@/components/summary/group/CCOFSummaryFamily.vue';
import FacilityInformationSummaryDialogHeader from '@/components/util/FacilityInformationSummaryDialogHeader.vue';
import { useApplicationStore } from '@/store/application.js';
import { useSummaryDeclarationStore } from '@/store/summaryDeclaration.js';
import alertMixin from '@/mixins/alertMixin';
import summaryMixin from '@/mixins/summaryMixin.js';

export default {
  name: 'FacilityInformationSummaryDialog',
  components: {
    AppButton,
    AppDialog,
    AFSSummary,
    CCFRISummary,
    CCOFSummary,
    CCOFSummaryFamily,
    ClosuresSummary,
    ECEWESummary,
    FacilityInformationSummary,
    FacilityInformationSummaryDialogHeader,
    NMFSummary,
    RFISummary,
    UploadedDocumentsSummary,
  },
  mixins: [alertMixin, summaryMixin],
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    facilityId: {
      type: String,
      default: '',
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
      expandedPanels: [],
    };
  },
  computed: {
    ...mapState(useApplicationStore, ['showApplicationTemplateV1']),
    ...mapState(useSummaryDeclarationStore, ['facilities']),
    facility() {
      return this.facilities?.find((facility) => facility.facilityId === this.facilityId);
    },
  },
  watch: {
    show: {
      handler(value) {
        this.isDisplayed = value;
      },
    },
  },
  methods: {
    closeDialog() {
      this.expandedPanels = [];
      this.$emit('close');
    },
  },
};
</script>
