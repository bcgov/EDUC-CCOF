<template>
  <v-skeleton-loader :loading="isApplicationProcessing" type="table-tbody" class="mb-12">
    <v-container class="mx-lg-16">
      <FundAmountV1 v-if="showApplicationTemplateV1" />
      <FundAmountV2 v-else />
    </v-container>
  </v-skeleton-loader>
  <NavButton
    :is-next-displayed="true"
    :is-save-displayed="true"
    :is-save-disabled="isLocked"
    :is-next-disabled="!isFormComplete"
    :is-processing="isApplicationProcessing"
    @previous="previous"
    @next="next"
    @validate-form="validateApplicationForm"
    @save="save(true)"
  />
</template>

<script>
import FundAmountV1 from '@/components/applicationTemplates/v1/group/CCOF/FundAmount.vue';
import FundAmountV2 from '@/components/applicationTemplates/v2/group/CCOF/FundAmount.vue';
import fundMixin from '@/mixins/fundMixin.js';

export default {
  components: { FundAmountV1, FundAmountV2 },
  mixins: [fundMixin],
  async beforeRouteLeave(_to, _from, next) {
    await this.save(false);
    next();
  },
  async beforeRouteUpdate(_to, _from, next) {
    await this.save(false);
    next();
  },
  watch: {
    '$route.params.urlGuid': {
      async handler() {
        await this.loadData();
      },
    },
  },
  async created() {
    await this.loadData();
  },
};
</script>
