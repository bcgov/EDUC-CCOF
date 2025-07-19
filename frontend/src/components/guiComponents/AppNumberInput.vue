<template>
  <v-text-field v-model="updatedValue" variant="plain" density="compact" hide-details @input="sanitizeInput" />
</template>
<script>
export default {
  name: 'AppNumberInput',
  props: {
    defaultValue: {
      type: Number,
      default: 0,
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
        this.$emit('update:modelValue', Number(value));
      },
    },
  },
  created() {
    this.updatedValue = this.modelValue ? Number(this.modelValue) : this.defaultValue;
  },
  methods: {
    sanitizeInput() {
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
