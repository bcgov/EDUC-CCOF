<template>
  <v-card
    elevation="4"
    class="cols-12 lgCardSize pa-4 mx-auto my-6 rounded-lg"
    rounded
    tiled
    exact
    tile
    :ripple="false"
  >
    <v-card-text>
      <p class="text-h5 text--primary">
        {{ title }}
      </p>
      <h2>{{ subtitle }}</h2>
      <br /><br />
      <!--If buttons are required, slot them in at the parent-->
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
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    pText: { type: String, default: '' },
  },
};
</script>

<style>
.lgCardSize {
  /* max-width: 950px; */
  min-height: 270px;
}

.blueBorder {
  border-top: 5px solid #003366 !important;
}
</style>
