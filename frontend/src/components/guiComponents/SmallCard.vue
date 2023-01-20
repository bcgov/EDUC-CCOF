<template>
  <v-col class="col-12 flex d-flex flex-column">
    <v-card 
      class="pa-0 elevation-4 rounded-lg flex d-flex flex-column" :class="isDisabled"
      :disabled=disable width="100%"
    >
      <v-card-text class="text--primary">
        <slot name="content"></slot>
      </v-card-text>
      <v-card-actions class="mt-auto pb-4 pl-4">
        <slot name="button"></slot>
      </v-card-actions>
    </v-card>
  </v-col>
</template>
<script>
export default {
  props: {
    title: String,
    subtitle: String,
    disable: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    isDisabled() {
      return this.disable ? 'smallCardDisabled' : 'smallCardEnabled';
    }
  }
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


