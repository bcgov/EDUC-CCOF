<template>
  <RFILandingV1 v-if="showApplicationTemplateV1" v-bind="$attrs" />
  <RFILandingV2 v-else v-bind="$attrs" />
</template>

<script>
import { mapState } from 'pinia';
import { useApplicationStore } from '@/store/application.js';

import RFILandingV1 from '@/components/applicationTemplates/v1/RFI/RFILanding.vue';
import RFILandingV2 from '@/components/applicationTemplates/v2/RFI/RFILanding.vue';

export default {
  name: 'RFILanding',
  components: { RFILandingV1, RFILandingV2 },
  computed: {
    ...mapState(useApplicationStore, ['showApplicationTemplateV1']),
  },
};
</script>
