<template>
  <FundAmountV1 v-if="showApplicationTemplateV1" />
  <FundAmountV2 v-else />
</template>

<script>
import { mapState } from 'pinia';
import FundAmountV1 from '@/components/applicationTemplates/v1/group/CCOF/FundAmount.vue';
import FundAmountV2 from '@/components/applicationTemplates/v2/group/CCOF/FundAmount.vue';
import { useApplicationStore } from '@/store/application.js';

export default {
  components: { FundAmountV1, FundAmountV2 },
  computed: {
    ...mapState(useApplicationStore, ['showApplicationTemplateV1']),
  },
};
</script>
