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
      };
    },
  },
};
</script>

<style scoped>
.button-icon {
  font-size: 24px;
}

.text-app-button {
  color: #003366;
  font-size: 1rem;
}

.BC-Gov-PrimaryButton,
.BC-Gov-PrimaryButton-disabled {
  background-color: #003366;
  border: none;
  border-radius: 4px;
  color: white;
  text-align: center;
  text-decoration: none;
  display: block;
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
  border: 2px solid #003366;
  border-radius: 4px;
  color: #003366;
  text-align: center;
  text-decoration: none;
  display: block;
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
  padding: 10px 32px;
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
  background-color: #003366;
  color: #ffffff;
}

.BC-Gov-PrimaryButton:focus,
.BC-Gov-SecondaryButton:focus {
  outline: 4px solid #3b99fc;
  outline-offset: 1px;
}

.small {
  font-size: 14px;
  height: 30px !important;
  padding: 0px;
}
</style>
