<template>
  <NMFV1 v-if="showApplicationTemplateV1" v-bind="$attrs" />
  <NMFV2 v-else v-bind="$attrs" />
</template>

<script>
import { mapState } from 'pinia';
import { useApplicationStore } from '@/store/application.js';

import NMFV1 from '@/components/applicationTemplates/v1/RFI/NMF.vue';
import NMFV2 from '@/components/applicationTemplates/v2/RFI/NMF.vue';

export default {
  name: 'NMF',
  components: { NMFV1, NMFV2 },
  computed: {
    ...mapState(useApplicationStore, ['showApplicationTemplateV1']),
  },
};
</script>
