<template>
  <v-text-field v-model="updatedValue" variant="plain" density="compact" hide-details @input="sanitizeInput" />
</template>
<script>
import { isEmpty } from 'lodash';

export default {
  name: 'AppNumberInput',
  props: {
    modelValue: {
      type: [String, Number, null],
      default: null,
    },
    defaultValue: {
      type: Number,
      default: null,
    },
    decimal: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      updatedValue: null,
    };
  },
  watch: {
    updatedValue: {
      handler(value) {
        this.$emit('update:modelValue', value);
      },
    },
  },
  created() {
    this.updatedValue = this.modelValue ? Number(this.modelValue) : this.defaultValue;
  },
  methods: {
    sanitizeInput() {
      if (isEmpty(this.updatedValue)) {
        this.updatedValue = this.defaultValue;
        return;
      }
      if (this.decimal) {
        this.updatedValue = this.updatedValue
          ?.replace(/[^\d.]/g, '') // Remove all non-digit and non-dot characters
          .replace(/(^[^.]*\.)|(\.)/g, '$1'); // Keep only the first dot
      } else {
        // Only digits
        this.updatedValue = this.updatedValue?.replace(/\D/g, '');
      }
      this.updatedValue = Number(this.updatedValue);
    },
  },
};
</script>
