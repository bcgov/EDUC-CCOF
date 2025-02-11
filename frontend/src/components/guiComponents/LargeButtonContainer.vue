<template>
  <v-row justify="center">
    <v-list>
      <slot>
        <!-- Button Component will go here. Add in a v-list item in the parent. This is done so that logic can be changed in the parent if need be-->
      </slot>
    </v-list>
  </v-row>
</template>
