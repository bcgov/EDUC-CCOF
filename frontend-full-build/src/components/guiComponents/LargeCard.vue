<template>
    <v-card elevation="4" class="cols-12 lgCardSize pa-4 mx-auto rounded-lg"
        rounded
        tiled
        exact tile
        :ripple="false"
        >
    <slot></slot>
    </v-card>
</template>

<style>

.lgCardSize {
  max-width: 950px;
  min-height : 270px;
  border-top: 5px solid #003366 !important;
}

</style>


