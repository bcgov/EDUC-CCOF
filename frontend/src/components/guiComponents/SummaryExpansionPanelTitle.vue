<template>
  <h4 style="color: #003366">
    {{ title }}
    <template v-if="!loading">
      <v-icon v-if="isComplete" class="text-success" size="large">mdi-check-circle-outline</v-icon>
      <template v-else>
        <v-icon class="text-error" size="large">mdi-alert-circle-outline</v-icon>
        <span class="text-error">Your form is missing required information. Click here to view.</span>
      </template>
    </template>
  </h4>
</template>

<script>
export default {
  name: 'SummaryExpansionPanelTitle',
  props: {
    title: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
