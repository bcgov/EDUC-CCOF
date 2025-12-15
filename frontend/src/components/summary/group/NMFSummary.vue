<template>
  <NMFSummaryV1 v-if="showApplicationTemplateV1" v-bind="$attrs" />
  <NMFSummaryV2 v-else v-bind="$attrs" />
</template>

<script>
import { mapState } from 'pinia';
import { useApplicationStore } from '@/store/application.js';

import NMFSummaryV1 from '@/components/applicationTemplates/v1/group/summary/NMFSummary.vue';
import NMFSummaryV2 from '@/components/applicationTemplates/v2/group/summary/NMFSummary.vue';

export default {
  name: 'NMFSummary',
  components: { NMFSummaryV1, NMFSummaryV2 },
  computed: {
    ...mapState(useApplicationStore, ['showApplicationTemplateV1']),
  },
};
</script>
