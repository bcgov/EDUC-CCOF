<template>
  <v-container fluid class="pa-0">
    <OrganizationSummaryV1 v-if="showApplicationTemplateV1" />
    <OrganizationSummaryV2 v-else />
  </v-container>
</template>

<script>
import OrganizationSummaryV1 from '@/components/applicationTemplates/v1/group/summary/OrganizationSummary.vue';
import OrganizationSummaryV2 from '@/components/applicationTemplates/v2/group/summary/OrganizationSummary.vue';
import summaryMixin from '@/mixins/summaryMixin.js';

export default {
  components: { OrganizationSummaryV1, OrganizationSummaryV2 },
  mixins: [summaryMixin],
};
</script>
