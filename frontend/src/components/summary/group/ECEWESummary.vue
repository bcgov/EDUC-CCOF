<template>
  <ECEWESummaryV1
    v-if="showApplicationTemplateV1"
    :ecewe="summaryModel.ecewe"
    :ecewe-facility="eceweFacility"
    :funding-model="fundingModel"
    :program-year-id="summaryModel?.application?.programYearId"
  />
  <ECEWESummaryV2
    v-else
    :ecewe="summaryModel.ecewe"
    :ecewe-facility="eceweFacility"
    :program-year-id="summaryModel?.application?.programYearId"
  />
</template>
<script>
import { mapState } from 'pinia';
import ECEWESummaryV1 from '@/components/applicationTemplates/v1/group/summary/ECEWESummary.vue';
import ECEWESummaryV2 from '@/components/applicationTemplates/v2/group/summary/ECEWESummary.vue';
import summaryMixin from '@/mixins/summaryMixin.js';
import { useApplicationStore } from '@/store/application.js';

export default {
  components: { ECEWESummaryV1, ECEWESummaryV2 },
  mixins: [summaryMixin],
  props: {
    ecewe: {
      type: Object,
      default: () => ({}),
    },
    eceweFacility: {
      type: Object,
      default: () => ({}),
    },
    programYearId: {
      type: String,
      default: '',
    },
    //we need this prop so at the facility level we have the required data from org level to show unionized question
    fundingModel: {
      type: Number,
      default: null,
    },
  },
  computed: {
    ...mapState(useApplicationStore, ['showApplicationTemplateV1']),
  },
};
</script>
