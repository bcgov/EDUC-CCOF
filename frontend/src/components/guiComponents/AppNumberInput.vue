<template>
  <v-text-field v-model="updatedValue" variant="plain" hide-details density="compact" @input="sanitizeInput" />
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
    // min: {
    //   type: Number,
    //   default: null,
    // },
    // max: {
    //   type: Number,
    //   default: null,
    // },
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
      console.log(this.decimal);
      if (this.decimal) {
        // Allow only digits and at most one "."
        this.updatedValue = this.updatedValue?.replace(/[^\d.]/g, '').replace(/^([^.]*\.)|\./g, '$1'); // only first dot remains
        console.log('GO HERE');
        console.log(this.updatedValue);
      } else {
        // Only digits
        this.updatedValue = this.updatedValue?.replace(/\D/g, '');
      }
      this.updatedValue = Number(this.updatedValue);
      console.log(this.updatedValue);

      // if (this.min != null && this.updatedValue < this.min) {
      //   this.updatedValue = this.min;
      // }
      // console.log(this.max);
      // if (this.max != null && this.updatedValue > this.max) {
      //   this.updatedValue = this.max;
      // }
    },
  },
};
</script>
