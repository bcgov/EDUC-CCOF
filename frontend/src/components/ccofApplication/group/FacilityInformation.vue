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
import { PROVINCES } from '@/utils/constants.js';

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
  methods: {
    async loadData() {
      try {
        this.setIsApplicationProcessing(true);
        const facilityId = this.$route.params.urlGuid;
        if (facilityId) {
          await this.loadFacility(facilityId);
        } else {
          await this.newFacility();
        }
        if (this.showApplicationTemplateV1) {
          this.facilityModel.province =
            this.facilityModel.province ?? PROVINCES.find((province) => province.value === 'BC')?.value;
        }
        this.setIsApplicationProcessing(false);
      } catch (error) {
        console.error(`Failed to get Facility data with error - ${error}`);
        this.setFailureAlert('An error occurred while loading facility. Please try again later.');
      }
    },
  },
};
</script>
