<template>
  <v-card
    class="pa-0 elevation-4 rounded-lg d-flex flex-column"
    :class="isDisabled"
    :disabled="disable"
    width="100%"
    height="100%"
  >
    <v-card-text class="text--primary">
      <slot name="content" />
    </v-card-text>
    <v-card-actions class="mt-auto pb-4 pl-4">
      <slot name="button" />
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  props: {
    disable: {
      default: false,
      type: Boolean,
    },
  },
  computed: {
    isDisabled() {
      return this.disable ? 'smallCardDisabled' : 'smallCardEnabled';
    },
  },
};
</script>

<style>
.smallCardEnabled {
  min-height: 250px;
  border-top: 5px solid #003366 !important;
}
.smallCardDisabled {
  min-height: 250px;
  border-top: 5px solid #909090 !important;
}
</style>
