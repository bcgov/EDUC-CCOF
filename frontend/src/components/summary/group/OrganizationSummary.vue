<template>
  <OrganizationSummaryV1
    v-if="showApplicationTemplateV1"
    :program-year="programYear"
    :is-processing="isProcessing"
    :program-year-id="programYearId"
  />
  <OrganizationSummaryV2
    v-else
    :program-year="programYear"
    :is-processing="isProcessing"
    :program-year-id="programYearId"
  />
</template>

<script>
import { mapState } from 'pinia';
import OrganizationSummaryV1 from '@/components/applicationTemplates/v1/group/summary/OrganizationSummary.vue';
import OrganizationSummaryV2 from '@/components/applicationTemplates/v2/group/summary/OrganizationSummary.vue';
import { useApplicationStore } from '@/store/application.js';

export default {
  components: { OrganizationSummaryV1, OrganizationSummaryV2 },
  props: {
    programYear: {
      type: String,
      default: '',
    },
    isProcessing: {
      type: Boolean,
      default: true,
    },
    programYearId: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapState(useApplicationStore, ['showApplicationTemplateV1']),
  },
};
</script>
