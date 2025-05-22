<template>
  <v-skeleton-loader :loading="isApplicationProcessing" type="table-tbody" class="mb-12">
    <v-container fluid class="pa-4 mx-lg-16">
      <Eligibility v-if="showApplicationTemplateV1" />
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
import Eligibility from '@/components/applicationTemplates/v1/family/Eligibility.vue';
import FacilityInformationV2 from '@/components/applicationTemplates/v2/group/CCOF/FacilityInformation.vue';
import facilityMixin from '@/mixins/facilityMixin.js';

export default {
  name: 'FacilityInformation',
  components: { Eligibility, FacilityInformationV2 },
  mixins: [facilityMixin],
  async beforeRouteLeave(_to, _from, next) {
    await this.save(false);
    next();
  },
  async created() {
    await this.loadData();
  },
};
</script>
