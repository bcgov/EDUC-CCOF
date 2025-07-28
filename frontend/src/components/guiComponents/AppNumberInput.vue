<template>
  <v-text-field v-model="updatedValue" variant="plain" density="compact" hide-details @input="handleInput" />
</template>

<script>
export default {
  name: 'AppNumberInput',
  props: {
    modelValue: {
      type: [String, Number],
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
  computed: {
    defaultString() {
      return this.defaultValue != null ? String(this.defaultValue) : '';
    },
  },
  watch: {
    modelValue(newVal) {
      const expected = newVal != null ? String(newVal) : this.defaultString;
      if (expected !== this.updatedValue) {
        this.updatedValue = expected;
      }
    },
  },
  mounted() {
    this.updatedValue = this.modelValue != null ? String(this.modelValue) : this.defaultString;
  },
  methods: {
    sanitize(value) {
      if (this.decimal) {
        return value
          .replace(/[^\d.]/g, '') // keep digits and one dot
          .replace(/(\..*?)\..*/g, '$1') // allow only first dot
          .replace(/^0+(?=\d)/, ''); // strip leading 0s before digits (preserve 0.)
      } else {
        return value
          .replace(/\D/g, '') // digits only
          .replace(/^0+(?=\d)/, ''); // strip leading 0s but allow "0"
      }
    },
    handleInput(event) {
      let value = event.target?.value ?? '';
      value = this.sanitize(value);
      if (value === '') {
        this.updatedValue = this.defaultString;
        this.$emit('update:modelValue', this.defaultValue);
        return;
      }
      this.updatedValue = value;
      this.$emit('update:modelValue', Number(value));
    },
  },
};
</script>
