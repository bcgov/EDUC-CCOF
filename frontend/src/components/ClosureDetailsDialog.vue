<template>
  <AppDialog v-model="isDisplayed" title="Closure Details" @close="closeDialog">
    <template #content> </template>
    <template #button> </template>
  </AppDialog>
</template>

<script>
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';
import alertMixin from '@/mixins/alertMixin';

export default {
  name: 'ClosureDetailsDialog',
  components: { AppButton, AppDialog },
  mixins: [alertMixin],
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close'],
  data() {
    return {
      isDisplayed: false,
      isLoading: false,
    };
  },
  watch: {
    show: {
      handler(value) {
        this.isDisplayed = value;
      },
    },
  },
  methods: {
    closeDialog() {
      this.$emit('close');
    },
  },
};
</script>
