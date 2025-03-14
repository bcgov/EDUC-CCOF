<template>
  <FacilityInformationSummaryV1 v-if="showApplicationTemplateV1" />
  <FacilityInformationSummaryV2 v-else />
</template>

<script>
import { mapState } from 'pinia';
import FacilityInformationSummaryV1 from '@/components/applicationTemplates/v1/group/summary/FacilityInformationSummary.vue';
import FacilityInformationSummaryV2 from '@/components/applicationTemplates/v2/group/summary/FacilityInformationSummary.vue';
import { useApplicationStore } from '@/store/application.js';

export default {
  components: { FacilityInformationSummaryV1, FacilityInformationSummaryV2 },
  computed: {
    ...mapState(useApplicationStore, ['showApplicationTemplateV1']),
  },
};
</script>
