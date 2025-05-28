<template>
  <v-skeleton-loader :loading="isApplicationProcessing" type="table-tbody" class="mb-12">
    <v-container class="mx-lg-16">
      <FamilyFundingV1 v-if="showApplicationTemplateV1" />
      <FamilyFundingV2 v-else />
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
import FamilyFundingV1 from '@/components/applicationTemplates/v1/family/FamilyFunding.vue';
import FamilyFundingV2 from '@/components/applicationTemplates/v2/family/FamilyFunding.vue';
import fundMixin from '@/mixins/fundMixin.js';

export default {
  components: { FamilyFundingV1, FamilyFundingV2 },
  mixins: [fundMixin],
  async beforeRouteLeave(_to, _from, next) {
    await this.save(false);
    next();
  },
  async beforeRouteUpdate(_to, _from, next) {
    await this.save(false);
    next();
  },
  async created() {
    await this.loadData();
  },
};
</script>
