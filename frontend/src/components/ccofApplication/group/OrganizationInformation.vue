<template>
  <OrganizationInformationV1 v-if="showApplicationTemplateV1" />
  <OrganizationInformationV2 v-else />
</template>

<script>
import { mapState } from 'pinia';
import OrganizationInformationV1 from '@/components/applicationTemplates/v1/group/CCOF/OrganizationInformation.vue';
import OrganizationInformationV2 from '@/components/applicationTemplates/v2/group/CCOF/OrganizationInformation.vue';
import { useApplicationStore } from '@/store/application.js';

export default {
  components: { OrganizationInformationV1, OrganizationInformationV2 },
  computed: {
    ...mapState(useApplicationStore, ['showApplicationTemplateV1']),
  },
};
</script>
