<template>
  <CCOFSummaryV1
    v-if="showApplicationTemplateV1"
    :funding="funding"
    :change-rec-guid="changeRecGuid"
    :program-year-id="programYearId"
  />
  <CCOFSummaryV2 v-else :funding="funding" :change-rec-guid="changeRecGuid" :program-year-id="programYearId" />
</template>

<script>
import { mapState } from 'pinia';
import CCOFSummaryV1 from '@/components/applicationTemplates/v1/group/summary/CCOFSummary.vue';
import CCOFSummaryV2 from '@/components/applicationTemplates/v2/group/summary/CCOFSummary.vue';
import { useApplicationStore } from '@/store/application.js';

export default {
  components: { CCOFSummaryV1, CCOFSummaryV2 },
  props: {
    funding: {
      type: Object,
      default: () => {
        return {};
      },
    },
    changeRecGuid: {
      type: String,
      default: '',
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
