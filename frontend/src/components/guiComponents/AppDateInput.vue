<template>
  <v-text-field v-model="updatedDate" type="date" variant="outlined" />
</template>

<script>
export default {
  name: 'AppDateInput',
  inheritAttrs: true,
  props: {
    modelValue: {
      type: String,
      default: null,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      updatedDate: null,
    };
  },
  watch: {
    updatedDate: {
      handler(value) {
        this.$emit('update:modelValue', value);
      },
    },
  },
  created() {
    this.updatedDate = this.modelValue ? new Date(this.modelValue)?.toISOString()?.split('T')[0] : null;
  },
};
</script>

<style scoped>
:deep(input[type='date']::-webkit-datetime-edit-year-field:focus),
:deep(input[type='date']::-webkit-datetime-edit-month-field:focus),
:deep(input[type='date']::-webkit-datetime-edit-day-field:focus) {
  background-color: #3367d1;
}

:deep(input[type='date']::-webkit-calendar-picker-indicator) {
  position: absolute;
  cursor: pointer;
}

:deep(input::-webkit-datetime-edit) {
  position: relative;
  left: 30%;
}
</style>
