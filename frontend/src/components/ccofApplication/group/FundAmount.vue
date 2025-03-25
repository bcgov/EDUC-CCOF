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
import { mapState } from 'pinia';
import FundAmountV1 from '@/components/applicationTemplates/v1/group/CCOF/FundAmount.vue';
import FundAmountV2 from '@/components/applicationTemplates/v2/group/CCOF/FundAmount.vue';
import { useApplicationStore } from '@/store/application.js';
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
  computed: {
    ...mapState(useApplicationStore, ['showApplicationTemplateV1']),
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
  methods: {
    async loadData() {
      try {
        this.setIsApplicationProcessing(true);
        if (!this.$route.params.urlGuid) return;
        await this.loadFunding(this.$route.params.urlGuid);
        this.setIsApplicationProcessing(false);
      } catch (error) {
        console.error(`Failed to get Facility data with error - ${error}`);
        this.setFailureAlert('An error occurred while loading facility. Please try again later.');
      }
    },
  },
};
</script>
