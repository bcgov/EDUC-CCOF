<template>
  <v-col class="col-12 col-md-12 col-lg-3 flex d-flex flex-column">
    <v-card elevation="4" class="pa-1 mx-auto rounded-lg smallCard flex d-flex flex-column" 
      :disabled=disable width="100%">
      <v-card-text>
          <p class="text-h6 text--primary"> {{title}} </p>
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
  }
};
</script>

<style>

.smallCard{
    min-height: 250px;
    border-top: 5px solid #003366 !important;
  }

</style>


