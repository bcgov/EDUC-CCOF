<template>
  <v-text-field
    v-model="inputValue"
    :inputmode="decimal ? 'decimal' : 'numeric'"
    density="compact"
    variant="outlined"
    @beforeinput="handleBeforeInput"
    @blur="handleBlur"
  />
</template>

<script>
import { formatDecimalNumber } from '@/utils/format';

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
      internalValue: null,
    };
  },
  computed: {
    defaultString() {
      return this.defaultValue != null ? String(this.defaultValue) : '';
    },
    inputValue: {
      get() {
        return this.internalValue;
      },
      set(value) {
        this.internalValue = this.sanitize(value ?? '');
      },
    },
  },
  watch: {
    modelValue(newVal) {
      if (newVal == null) {
        this.internalValue = this.defaultString;
        return;
      }
      const formatted = this.format(newVal);
      if (formatted !== this.internalValue) {
        this.internalValue = formatted;
      }
    },
  },
  mounted() {
    this.internalValue = this.modelValue != null ? this.format(this.modelValue) : this.defaultString;
  },
  methods: {
    sanitize(value) {
      if (this.decimal) {
        return value
          .replace(/[^\d.]/g, '') // Keep digits and decimal points only
          .replace(/(\..*?)\..*/g, '$1') // Allow only one decimal point
          .replace(/^0+(?=\d)/, ''); // Remove leading zeros before digits
      }
      return value
        .replace(/\D/g, '') // Keep digits only
        .replace(/^0+(?=\d)/, ''); // Remove leading zeros before digits
    },

    format(value) {
      return this.decimal ? formatDecimalNumber(value) : String(value);
    },

    handleBeforeInput(event) {
      const char = event.data;
      // Ignore non-character inputs (delete, arrows, etc.)
      if (!char) {
        return;
      }
      const isDigit = /\d/.test(char);
      const isDot = char === '.';
      const isLeadingZero = char === '0' && this.internalValue === '0';
      // Prevent multiple leading zeros (e.g. "00")
      if (isLeadingZero) {
        event.preventDefault();
        return;
      }
      if (this.decimal) {
        const hasDotAlready = this.internalValue?.includes('.');
        // Block a second decimal point
        if (isDot && hasDotAlready) {
          event.preventDefault();
          return;
        }
        // Block anything that is not a digit or a decimal point
        if (!isDigit && !isDot) {
          event.preventDefault();
        }
        return;
      }
      // Integer-only: block anything that is not a digit
      if (!isDigit) {
        event.preventDefault();
      }
    },

    handleBlur() {
      const numberValue = this.internalValue == null || this.internalValue === '' ? NaN : Number(this.internalValue);
      if (Number.isNaN(numberValue)) {
        this.internalValue = this.defaultString;
        this.$emit('update:modelValue', this.defaultValue);
        return;
      }
      const formatted = this.format(numberValue);
      this.internalValue = formatted;
      this.$emit('update:modelValue', Number(formatted));
    },
  },
};
</script>
