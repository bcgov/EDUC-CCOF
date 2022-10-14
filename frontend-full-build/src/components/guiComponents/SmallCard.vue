<template>
    <v-card elevation="4" class="pa-4 mx-auto rounded-lg smCardHeight flex d-flex flex-column"
        rounded
        tiled
        width = "100%"
        exact tile
        :ripple="false"
        >
    <slot></slot>
    </v-card>
</template>

<style>

.smCardHeight{
    min-height: 250px;
    background-color: pink;
  }

</style>


