<template>
  <v-dialog persistent min-width="350px">
    <v-card>
      <div class="sticky-header">
        <v-card-title class="dialog-title text-wrap">
          <v-row no-gutters justify="space-between" align="center">
            <v-col cols="10" md="11">
              <h3 class="dialog-header">{{ title }}</h3>
            </v-col>
            <v-col cols="2" md="1" align="center">
              <v-btn v-if="!loading" variant="text" icon="mdi-window-close" @click="$emit('close')" />
            </v-col>
          </v-row>
        </v-card-title>
        <div class="yellow-line" />
      </div>
      <v-card-text :align="textAlignment">
        <slot name="content"></slot>
      </v-card-text>
      <v-card-actions :align="textAlignment" class="mb-4">
        <slot name="button"></slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  inheritAttrs: true,
  props: {
    title: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    textAlignment: {
      type: String,
      default: 'center',
    },
  },
  emits: ['close'],
};
</script>
<style scoped>
.v-dialog {
  font-family: 'BCSans', 'Noto Sans', Verdana, Arial, sans-serif;
}
.dialog-header {
  color: white;
}
.dialog-title {
  background-color: #003366;
  color: white;
  padding: 10px 30px;
  min-height: 70px;
}
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 10;
}
.yellow-line {
  background-color: #ffc72c;
  padding: 2px;
}
</style>
