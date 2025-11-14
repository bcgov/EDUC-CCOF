<template>
  <v-container>
    <v-row id="change-request-history" no-gutters>
      <v-col class="col-lg-12 mt-10">
        <h2>Submission History</h2>
      </v-col>
    </v-row>
    <v-row v-if="loading">
      <v-col>
        <v-skeleton-loader :loading="loading" type="paragraph, text@3, text@3, paragraph" />
      </v-col>
    </v-row>
    <v-data-table
      v-else
      v-model:sort-by="sortBy"
      :headers="headers"
      :items="submissions"
      :mobile="null"
      mobile-breakpoint="md"
      fixed-header
      class="elevation-4 my-4"
      :items-per-page="10"
      must-sort
    >
      <template #item.PDF="{ item }">
        <router-link :to="getPDFPath(item.annotationId)" target="_blank">
          {{ item.fileName }}
        </router-link>
        (PDF, {{ item.fileSize }}Kb)
      </template>
    </v-data-table>

    <NavButton :is-processing="loading" @previous="previous" />
  </v-container>
</template>

<script>
import { mapState } from 'pinia';

import NavButton from '@/components/util/NavButton.vue';
import PDFService from '@/services/pdfService';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { PATHS, ApiRoutes } from '@/utils/constants.js';
import { formatFiscalYearName, formatUTCDateToLocal } from '@/utils/format';

const EMPTY_DATE = '- - - -';

export default {
  components: { NavButton },
  data() {
    return {
      loading: false,
      submissions: [],
      headers: [
        { title: 'Application/Change Request ID', value: 'appId' },
        { title: 'Type', value: 'type' },
        { title: 'Fiscal Year', value: 'fiscalYear' },
        { title: 'Submission Date', value: 'submissionDateString' },
        { title: 'PDF', value: 'PDF' },
      ],
      sortBy: [{ key: 'submissionDate', order: 'desc' }],
    };
  },
  computed: {
    ...mapState(useOrganizationStore, ['organizationId']),
  },
  async mounted() {
    this.loading = true;
    await this.loadSubmissions();
    this.loading = false;
  },
  methods: {
    async loadSubmissions() {
      const pdfs = await PDFService.getPDFs(this.organizationId);
      this.submissions = pdfs?.map((submission) => {
        return {
          annotationId: submission?.annotationId,
          appId: submission?.appId,
          type: submission?.type,
          fiscalYear: formatFiscalYearName(submission?.fiscalYear),
          submissionDate: submission?.submissionDate ? new Date(submission.submissionDate).getTime() : null,
          submissionDateString: this.getSubmissionDateString(submission?.submissionDate),
          fileName: submission?.fileName,
          fileSize: Math.round(submission?.fileSize / 100) / 10,
        };
      });
    },
    previous() {
      this.$router.push(PATHS.ROOT.HOME);
    },
    getPDFPath(annotationId) {
      return ApiRoutes.PDF + annotationId;
    },
    getSubmissionDateString(date) {
      if (date) {
        return formatUTCDateToLocal(date, 'MM/DD/YYYY HH:mm:ss');
      }
      return EMPTY_DATE;
    },
  },
};
</script>
