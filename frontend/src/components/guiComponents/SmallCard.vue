<template>
    <v-col class="col-md-3 col-12 d-flex flex-column ">
    <v-card elevation="4" class="pa-4 mx-auto rounded-lg smCardHeight flex d-flex flex-column"
        rounded
        tiled
        width = "100%"
        exact tile
        :ripple="false"
        >
    <slot></slot>
    </v-card>
    </v-col>
</template>

<style>

.smCardHeight{
    min-height: 250px;
    background-color: pink;
    border-top: 5px solid #003366 !important;
  }

</style>


