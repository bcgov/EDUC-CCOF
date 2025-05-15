<template>
  <div class="pa-4 mx-lg-16">
    <FamilyOrganizationV1 v-if="showApplicationTemplateV1" />
    <OrganizationInformationV2 v-else />
    <!-- <FamilyOrganizationV2 v-else /> -->
  </div>
  <NavButton
    :is-next-displayed="true"
    :is-save-displayed="true"
    :is-save-disabled="isLocked"
    :is-next-disabled="!organizationModel.isOrganizationComplete"
    :is-processing="isApplicationProcessing"
    @previous="back"
    @next="next"
    @validate-form="validateApplicationForm"
    @save="save(true)"
  />
</template>

<script>
import FamilyOrganizationV1 from '@/components/applicationTemplates/v1/family/FamilyOrganization.vue';
import OrganizationInformationV2 from '@/components/applicationTemplates/v2/group/CCOF/OrganizationInformation.vue';
import organizationMixin from '@/mixins/organizationMixin.js';

export default {
  components: { FamilyOrganizationV1, OrganizationInformationV2 },
  mixins: [organizationMixin],
  async beforeRouteLeave(_to, _from, next) {
    await this.save(false);
    next();
  },
};
</script>
