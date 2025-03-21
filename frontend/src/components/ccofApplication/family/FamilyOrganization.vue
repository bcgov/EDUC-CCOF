<template>
  <FamilyOrganizationV1 v-if="showApplicationTemplateV1" />
  <FamilyOrganizationV2 v-else />
</template>

<script>
import { mapState } from 'pinia';
import FamilyOrganizationV1 from '@/components/applicationTemplates/v1/family/FamilyOrganization.vue';
import FamilyOrganizationV2 from '@/components/applicationTemplates/v2/family/FamilyOrganization.vue';
import { useApplicationStore } from '@/store/application.js';

export default {
  components: { FamilyOrganizationV1, FamilyOrganizationV2 },
  computed: {
    ...mapState(useApplicationStore, ['showApplicationTemplateV1']),
  },
};
</script>
