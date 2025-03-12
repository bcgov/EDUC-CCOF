<template>
  <v-text-field v-model="updatedTime" type="time" variant="outlined" />
</template>

<script>
import { formatTime12to24 } from '@/utils/format';

export default {
  name: 'AppTimeInput',
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
      updatedTime: null,
    };
  },
  watch: {
    updatedTime: {
      handler(value) {
        this.$emit('update:modelValue', value);
      },
    },
  },
  created() {
    this.updatedTime = this.modelValue ? formatTime12to24(this.modelValue) : null;
  },
};
</script>

<style scoped>
:deep(input[type='time']::-webkit-datetime-edit-hour-field:focus),
:deep(input[type='time']::-webkit-datetime-edit-minute-field:focus),
:deep(input[type='time']::-webkit-datetime-edit-second-field:focus),
:deep(input[type='time']::-webkit-datetime-edit-ampm-field:focus) {
  background-color: #3367d1;
}

:deep(input[type='time']::-webkit-calendar-picker-indicator) {
  position: absolute;
  cursor: pointer;
}

:deep(input::-webkit-datetime-edit) {
  position: relative;
  left: 50%;
}
</style>
