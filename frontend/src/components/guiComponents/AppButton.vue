<template>
  <v-btn class="px-2" :class="buttonClass" height="auto" v-bind="$attrs">
    <span class="text-wrap"><slot /></span>
    <v-icon v-if="$attrs.icon" class="button-icon">{{ $attrs.icon }}</v-icon>
  </v-btn>
</template>

<script>
export default {
  inheritAttrs: true,
  props: {
    primary: {
      type: Boolean,
      default: true,
    },
    displayBlock: {
      type: Boolean,
      default: true,
    },
    color: {
      type: String,
      default: '#003366',
    },
  },
  computed: {
    buttonClass() {
      return {
        'BC-Gov-PrimaryButton': !this.$attrs.disabled && this.$attrs.variant === undefined && this.primary,
        'BC-Gov-PrimaryButton-disabled': this.$attrs.disabled && this.$attrs.variant === undefined && this.primary,
        'BC-Gov-SecondaryButton': !this.$attrs.disabled && this.$attrs.variant === undefined && !this.primary,
        'BC-Gov-SecondaryButton-disabled': this.$attrs.disabled && this.$attrs.variant === undefined && !this.primary,
        'text-app-button': this.$attrs.variant !== '',
        small: this.$attrs.size === 'small',
        medium: this.$attrs.size === 'medium',
      };
    },
    display() {
      return this.displayBlock ? 'block' : 'inline';
    },
  },
};
</script>

<style scoped>
.button-icon {
  font-size: 24px;
}

.text-app-button {
  color: v-bind(color);
  font-size: 1rem;
}

.BC-Gov-PrimaryButton,
.BC-Gov-PrimaryButton-disabled {
  background-color: v-bind(color);
  border: none;
  border-radius: 4px;
  color: white;
  padding: 12px 32px;
  text-align: center;
  text-decoration: none;
  display: v-bind('display');
  font-family:
    ‘BCSans’,
    ‘Noto Sans’,
    Verdana,
    Arial,
    sans-serif;
  font-weight: 700;
  letter-spacing: 1px;
}

.BC-Gov-SecondaryButton,
.BC-Gov-SecondaryButton-disabled {
  background-color: #ffffff;
  border: 2px solid v-bind(color);
  border-radius: 4px;
  color: v-bind(color);
  padding: 10px 30px;
  text-align: center;
  text-decoration: none;
  display: v-bind('display');
  font-family:
    ‘BCSans’,
    ‘Noto Sans’,
    Verdana,
    Arial,
    sans-serif;
  font-weight: 700;
  letter-spacing: 1px;
}

.BC-Gov-PrimaryButton,
.BC-Gov-PrimaryButton-disabled,
.BC-Gov-SecondaryButton,
.BC-Gov-SecondaryButton-disabled {
  font-size: 18px;
}

.BC-Gov-PrimaryButton-disabled,
.BC-Gov-SecondaryButton-disabled {
  opacity: 0.3;
}

.BC-Gov-PrimaryButton:hover,
.BC-Gov-SecondaryButton:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.BC-Gov-SecondaryButton:hover {
  background-color: v-bind(color);
  color: #ffffff;
}

.BC-Gov-PrimaryButton:focus,
.BC-Gov-SecondaryButton:focus {
  outline: 4px solid #3b99fc;
  outline-offset: 1px;
}

.small {
  font-size: 14px;
  min-height: 30px !important;
  padding: 0px;
}

.medium {
  font-size: 16px;
  height: 40px !important;
  padding: 0px;
}
</style>
