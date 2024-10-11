<template>
  <v-hover v-slot="{ hover }">
    <v-btn
      :id="id"
      :title="title || text"
      :class="[hover && !disabled ? (secondary ? 'button-hover white--text' : 'button-hover') : '']"
      color="#003366"
      :variant="secondary ? 'outlined' : undefined"
      :size="short ? 'small' : undefined"
      :disabled="disabled"
      :dark="!disabled"
      :to="to"
      :width="width"
      :loading="loading"
      v-bind="bind"
      v-on="on"
    >
      <v-icon v-if="icon" class="ml-n1 mr-1" :nudge-down="4" :size="largeIcon ? 'large' : undefined" end dark>
        {{ icon }}
      </v-icon>
      <span class="ml-1">{{ text }}</span>
    </v-btn>
  </v-hover>
</template>

<script>
export default {
  name: 'PrimaryButton',
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
    secondary: {
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
    loading: {
      type: Boolean,
      default: false,
    },
    icon: {
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
    largeIcon: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
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
  background-color: #38598a !important;
}
.theme--light.v-btn.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
  background-color: #003366 !important;
  opacity: 0.298039215686275;
  color: white !important;
}

.theme--light.v-btn.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) .v-icon {
  color: white !important;
}
</style>
