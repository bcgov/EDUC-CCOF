<template>
  <v-container>
    <v-form ref="isValidForm" v-model="isValidForm" model-value="false">
      <v-container>
        <v-row id="change-request-history" no-gutters>
          <v-col class="col-lg-12 mt-10">
            <h2>Submission History</h2>
          </v-col>
        </v-row>
        <v-row v-if="processing">
          <v-col>
            <v-skeleton-loader :loading="processing" type="paragraph, text@3, text@3, paragraph" />
          </v-col>
        </v-row>
        <v-data-table
          v-if="!processing"
          :headers="headers"
          :items="allItems"
          mobile-breakpoint="md"
          fixed-header
          class="elevation-4 my-4"
          :items-per-page="10"
          :sort-by="[{ key: 'submissionDate', order: 'desc' }]"
        >
          <!-- FIXME: Trev: We're deconstructing the "item" into a blank template for who knows what reason
               <template #item.facilityNames="{ item }" /> -->
          <template #item.PDF="{ item }">
            <router-link :to="getPDFPath(item.annotationId)" target="_blank">
              {{ item.fileName }}
            </router-link>
            (PDF, {{ item.fileSize }}Kb)
          </template>
        </v-data-table>
      </v-container>
    </v-form>

    <NavButton
      :is-next-displayed="false"
      :is-save-displayed="false"
      :is-next-disabled="true"
      :is-processing="processing"
      @previous="previous"
      @next="false"
      @validate-form="validateForm()"
      @save="save(true)"
    />
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'pinia';

import NavButton from '@/components/util/NavButton.vue';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { useDocumentStore } from '@/store/document.js';
import alertMixin from '@/mixins/alertMixin.js';
import { PATHS, ApiRoutes } from '@/utils/constants.js';
import { formatFiscalYearName } from '@/utils/format';

export default {
  components: { NavButton },
  mixins: [alertMixin],
  beforeRouteLeave(_to, _from, next) {
    next();
  },
  data() {
    return {
      isValidForm: false,
      processing: false,
      rules: [(v) => !!v || 'Required.'],
      headersGroup: [
        { title: 'Application/Change Request ID', value: 'appId', class: 'tableHeader' },
        { title: 'Type', value: 'type', class: 'tableHeader' },
        { title: 'Fiscal Year', value: 'fiscalYear', class: 'tableHeader' },
        { title: 'Submission Date', value: 'submissionDateString', class: 'tableHeader' },
        { title: 'PDF', value: 'PDF', class: 'tableHeader' },
      ],
      changeHistoryButtonWidth: '88px',
    };
  },
  computed: {
    ...mapState(useOrganizationStore, ['organizationId']),
    ...mapState(useDocumentStore, ['pdfs']),
    allItems() {
      return this.pdfs?.map((submission, index) => {
        return {
          index: index,
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
    headers() {
      return this.headersGroup;
    },
  },
  async mounted() {
    this.processing = true;
    await this.getPDFs(this.organizationId);
    this.processing = false;
  },
  methods: {
    ...mapActions(useDocumentStore, ['getPDFs']),
    previous() {
      this.$router.push(PATHS.ROOT.HOME);
    },
    getPDFPath(annotationId) {
      return ApiRoutes.PDF + annotationId;
    },
    getSubmissionDateString(date) {
      if (date) {
        // date display format: YYYY/MM/DD
        return new Date(date).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
      }
      return '- - - -';
    },
    next() {
      this.$router.push(PATHS.ROOT.HOME);
    },
  },
};
</script>
<style scoped>
.blueButton {
  background-color: #003366 !important;
}
.blueOutlinedButton {
  color: #003366 !important;
}
:deep(.tableHeader) {
  color: rgb(0, 52, 102) !important;
  font-weight: bold !important;
  font-size: 16px !important;
}
:deep(.redText) {
  color: red !important;
}
.tableTooltip {
  max-width: 70em;
  overflow-wrap: break-word;
}
.tableText {
  max-width: var(--maxLength); /* the element needs a fixed width (in px, em, %, etc) */
  overflow: hidden; /* make sure it hides the content that overflows */
  white-space: nowrap; /* don't break the line */
  text-overflow: ellipsis; /* give the beautiful '...' effect */
}
</style>
