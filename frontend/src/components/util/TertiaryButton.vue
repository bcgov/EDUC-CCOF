<template>
  <v-hover v-slot="{ hover }">
    <v-btn
      :id="id"
      :class="[hover ? 'button-hover' : '']"
      color="#38598A"
      :size="short ? 'small' : undefined"
      :disabled="disabled"
      :dark="!disabled"
      :to="to"
      :width="width"
      :variant="true ? 'text' : undefined"
      :min-width="minWidth"
      v-bind="bind"
      v-on="on"
    >
      <v-icon v-if="icon" :class="[iconStyle, 'mr-1']" start>
        {{ icon }}
      </v-icon>
      <strong>{{ text }}</strong>
    </v-btn>
  </v-hover>
</template>

<script>
export default {
  name: 'TertiaryButton',
  props: {
    id: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: '',
    },
    short: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    to: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    iconStyle: {
      type: String,
      default: '',
    },
    minWidth: {
      type: String,
      default: '',
    },
    bind: {
      type: Object,
      default: () => ({}),
    },
    on: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.v-btn {
  text-transform: none;
}
.button-hover {
  color: #003366 !important;
}
.theme--light.v-btn.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
  background-color: #38598a !important;
  opacity: 0.3;
  color: white !important;
}
</style>
