<template>
  <CCOFSummaryV1 v-if="showApplicationTemplateV1" />
  <CCOFSummaryV2 v-else />
</template>

<script>
import { mapState } from 'pinia';
import CCOFSummaryV1 from '@/components/applicationTemplates/v1/group/summary/CCOFSummary.vue';
import CCOFSummaryV2 from '@/components/applicationTemplates/v2/group/summary/CCOFSummary.vue';
import { useApplicationStore } from '@/store/application.js';

export default {
  components: { CCOFSummaryV1, CCOFSummaryV2 },
  computed: {
    ...mapState(useApplicationStore, ['showApplicationTemplateV1']),
  },
};
</script>
