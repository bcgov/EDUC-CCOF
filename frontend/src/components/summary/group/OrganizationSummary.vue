<template>
  <OrganizationSummaryV1 v-if="showApplicationTemplateV1" />
  <OrganizationSummaryV2 v-else />
</template>

<script>
import { mapState } from 'pinia';
import OrganizationSummaryV1 from '@/components/applicationTemplates/v1/group/summary/OrganizationSummary.vue';
import OrganizationSummaryV2 from '@/components/applicationTemplates/v2/group/summary/OrganizationSummary.vue';
import { useApplicationStore } from '@/store/application.js';

export default {
  components: { OrganizationSummaryV1, OrganizationSummaryV2 },
  computed: {
    ...mapState(useApplicationStore, ['showApplicationTemplateV1']),
  },
};
</script>
