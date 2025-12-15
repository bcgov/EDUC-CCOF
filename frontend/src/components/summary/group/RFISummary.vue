<template>
  <RFISummaryV1 v-if="showApplicationTemplateV1" v-bind="$attrs" />
  <RFISummaryV2 v-else v-bind="$attrs" />
</template>

<script>
import { mapState } from 'pinia';
import { useApplicationStore } from '@/store/application.js';

import RFISummaryV1 from '@/components/applicationTemplates/v1/group/summary/RFISummary.vue';
import RFISummaryV2 from '@/components/applicationTemplates/v2/group/summary/RFISummary.vue';

export default {
  name: 'RFISummary',
  components: { RFISummaryV1, RFISummaryV2 },
  computed: {
    ...mapState(useApplicationStore, ['showApplicationTemplateV1']),
  },
};
</script>
