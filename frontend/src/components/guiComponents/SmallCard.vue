<template>
  <v-col class="col-12 flex d-flex flex-column">
    <v-card
      class="pa-0 elevation-4 rounded-lg flex d-flex flex-column"
      :class="isDisabled"
      :disabled="disable"
      width="100%"
    >
      <v-card-text class="text--primary card-text-height">
        <slot name="content" />
      </v-card-text>
      <v-card-actions class="mt-auto pb-4 pl-4">
        <slot name="button" />
      </v-card-actions>
    </v-card>
  </v-col>
</template>
<script>
export default {
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
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
@media (min-width: 1024px) {
  .card-text-height {
    height: 220px;
  }

  .smallCardEnabled {
    min-height: 290px;
    border-top: 5px solid #003366 !important;
  }
  .smallCardDisabled {
    min-height: 290px;
    border-top: 5px solid #909090 !important;
  }
}
</style>
