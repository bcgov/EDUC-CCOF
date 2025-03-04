<!-- eslint-disable vue/no-v-html -->
<template>
  <v-menu open-on-hover open-on-click :content-class="tooltipClass" max-width="500">
    <template #activator="{ props }">
      <v-icon size="large" v-bind="props" :color="tooltipIconColor">{{ tooltipIcon }}</v-icon>
    </template>
    <div v-html="tooltipContent" />
  </v-menu>
</template>

<script>
import { TOOLTIP_TYPES } from '@/utils/constants.js';

export default {
  name: 'AppTooltip',
  props: {
    tooltipIcon: {
      type: String,
      default: 'mdi-information-slab-circle-outline',
    },
    tooltipType: {
      type: String,
      default: TOOLTIP_TYPES.INFO,
    },
    tooltipContent: {
      type: String,
      default: 'Tooltip text goes here',
    },
  },
  computed: {
    tooltipIconColor() {
      switch (this.tooltipType) {
        case TOOLTIP_TYPES.ERROR:
          return 'error';
        case TOOLTIP_TYPES.WARNING:
          return 'warning';
        default:
          return 'primary';
      }
    },
    tooltipClass() {
      switch (this.tooltipType) {
        case TOOLTIP_TYPES.ERROR:
          return 'error-tooltip';
        case TOOLTIP_TYPES.WARNING:
          return 'warning-tooltip';
        default:
          return 'info-tooltip';
      }
    },
  },
};
</script>

<style scoped>
:deep(.info-tooltip) {
  padding: 8px 16px;
  background-color: #003366;
  color: white;
}

:deep(.error-tooltip) {
  padding: 8px 16px;
  background-color: #d8292f;
  color: white;
}

:deep(.warning-tooltip) {
  padding: 8px 16px;
  background-color: #f8bb47;
  color: white;
}
</style>
