<template>
  <v-menu open-on-hover open-on-click content-class="app-tooltip" max-width="500">
    <template #activator="{ props }">
      <v-icon size="large" v-bind="props" :color="tooltipColor">{{ tooltipIcon }}</v-icon>
    </template>
    <div v-html="tooltipContent" />
  </v-menu>
</template>

<script>
export default {
  name: 'AppTooltip',
  props: {
    tooltipIcon: {
      type: String,
      default: 'mdi-information-slab-circle-outline',
    },
    tooltipColor: {
      type: String,
      default: 'primary',
    },
    tooltipContent: {
      type: String,
      default: 'Tooltip text goes here',
    },
  },
};
</script>

<style scoped>
:deep(.app-tooltip) {
  padding: 8px 16px;
  background-color: #003466;
  color: white;
}
</style>
