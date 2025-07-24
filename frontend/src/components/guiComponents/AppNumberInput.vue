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
        // Allow only digits and at most one "."
        this.updatedValue = this.updatedValue?.replace(/[^\d.]/g, '').replace(/^([^.]*\.)|\./g, '$1'); // only first dot remains
      } else {
        // Only digits
        this.updatedValue = this.updatedValue?.replace(/\D/g, '');
      }
      this.updatedValue = Number(this.updatedValue);
    },
  },
};
</script>
