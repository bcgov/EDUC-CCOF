<template>
  <AppDialog v-model="isOpen" max-width="1200px" text-alignment="left" persistent scrollable @close="closeDialog">
    <template #content>
      <ServiceDetails :licence="licence" />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/guiComponents/AppDialog.vue';
import ServiceDetails from '@/components/licences/ServiceDetails.vue';

export default {
  name: 'ServiceDetailsDialog',
  components: {
    AppDialog,
    ServiceDetails,
  },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    licence: {
      type: Object,
      required: true,
    },
  },
  emits: ['update:show'],
  computed: {
    isOpen: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit('update:show', val);
      },
    },
  },
  methods: {
    closeDialog() {
      this.isOpen = false;
    },
  },
};
</script>
