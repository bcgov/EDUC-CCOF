<template>
  <CCFRISummaryV1
    v-if="showApplicationTemplateV1"
    :ccfri="ccfri"
    :change-rec-guid="changeRecGuid"
    :program-year-id="programYearId"
  />
  <CCFRISummaryV2 v-else :ccfri="ccfri" :change-rec-guid="changeRecGuid" :program-year-id="programYearId" />
</template>
<script>
import { mapState } from 'pinia';
import CCFRISummaryV1 from '@/components/applicationTemplates/v1/group/summary/CCFRISummary.vue';
import CCFRISummaryV2 from '@/components/applicationTemplates/v2/group/summary/CCFRISummary.vue';
import { useApplicationStore } from '@/store/application.js';

export default {
  components: { CCFRISummaryV1, CCFRISummaryV2 },
  props: {
    ccfri: {
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
