<template>
  <v-menu open-on-hover open-on-click content-class="app-tooltip" max-width="500">
    <template #activator="{ props }">
      <v-icon size="large" v-bind="props" color="primary">mdi-information-slab-circle-outline</v-icon>
    </template>
    <div v-html="tooltipContent" />
  </v-menu>
</template>

<script>
export default {
  name: 'AppTooltip',
  props: {
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
  background-color: #003466 !important;
  color: #ffffff !important;
}
</style>
