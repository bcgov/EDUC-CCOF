<template>
  <v-btn class="px-16 py-10 my-3 text-white bigButton" size="x-large">
    <slot />
  </v-btn>
</template>

<style>
.bigButton {
  min-width: 550px !important;
  background-color: #336799 !important;
}
</style>
