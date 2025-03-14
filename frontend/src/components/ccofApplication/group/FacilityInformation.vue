<template>
  <FacilityInformationV1 v-if="showApplicationTemplateV1" />
  <FacilityInformationV2 v-else />
</template>

<script>
import { mapState } from 'pinia';
import FacilityInformationV1 from '@/components/applicationTemplates/v1/group/CCOF/FacilityInformation.vue';
import FacilityInformationV2 from '@/components/applicationTemplates/v2/group/CCOF/FacilityInformation.vue';
import { useApplicationStore } from '@/store/application.js';

export default {
  components: { FacilityInformationV1, FacilityInformationV2 },
  computed: {
    ...mapState(useApplicationStore, ['showApplicationTemplateV1']),
  },
};
</script>
