<template>
  <v-skeleton-loader :loading="isApplicationProcessing" type="table-tbody" class="mb-12">
    <v-container fluid class="mx-lg-16">
      <FacilityInformationV1 v-if="showApplicationTemplateV1" />
      <FacilityInformationV2 v-else />
    </v-container>
  </v-skeleton-loader>
  <NavButton
    :is-next-displayed="true"
    :is-save-displayed="true"
    :is-save-disabled="isLocked"
    :is-next-disabled="!facilityModel.isFacilityComplete"
    :is-processing="isApplicationProcessing"
    @previous="previous"
    @next="next"
    @validate-form="validateApplicationForm"
    @save="save(true)"
  />
</template>

<script>
import FacilityInformationV1 from '@/components/applicationTemplates/v1/group/CCOF/FacilityInformation.vue';
import FacilityInformationV2 from '@/components/applicationTemplates/v2/group/CCOF/FacilityInformation.vue';
import facilityMixin from '@/mixins/facilityMixin.js';

export default {
  components: { FacilityInformationV1, FacilityInformationV2 },
  mixins: [facilityMixin],
  async beforeRouteLeave(_to, _from, next) {
    if (this.$route.params.urlGuid) {
      await this.save(false);
    }
    next();
  },
  async beforeRouteUpdate(_to, _from, next) {
    if (this.$route.params.urlGuid) {
      await this.save(false);
    }
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
