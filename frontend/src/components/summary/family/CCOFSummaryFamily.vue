<template>
  <FamilyFundingSummaryV1 v-if="showApplicationTemplateV1" :funding="funding" :program-year-id="programYearId" />
  <FamilyFundingSummaryV2 v-else :funding="funding" :program-year-id="programYearId" />
</template>

<script>
import FamilyFundingSummaryV1 from '@/components/applicationTemplates/v1/family/FamilyFundingSummary.vue';
import FamilyFundingSummaryV2 from '@/components/applicationTemplates/v2/family/FamilyFundingSummary.vue';
import summaryMixin from '@/mixins/summaryMixin.js';

export default {
  name: 'CCOFSummaryFamily',
  components: { FamilyFundingSummaryV1, FamilyFundingSummaryV2 },
  mixins: [summaryMixin],
  props: {
    funding: {
      type: Object,
      required: true,
    },
    programYearId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isValidForm: false,
    };
  },
};
</script>
