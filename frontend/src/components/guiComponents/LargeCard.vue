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

      <!-- this is another styling choice.... leaving this here in case we want to switch it back.
          <p class="text-h5 text--primary">
              CCOF, CCFRI, ECE-WE
            </p>
            <h2> Status: Draft</h2> <br><br> -->

      <!--If buttons are required, slot them in at the parent-->
      <slot />
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    pText: { type: String, required: true },
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
