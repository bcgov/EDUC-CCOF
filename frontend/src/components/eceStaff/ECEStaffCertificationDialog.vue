<template>
  <AppDialog v-model="dialogOpen" title="Staff Certification Details" max-width="800px" @close="closeDialog">
    <template #content>
      <v-row class="font-weight-bold mb-2">
        <v-col cols="4">Certifications</v-col>
        <v-col cols="4">Effective Start Date</v-col>
        <v-col cols="4">Effective End Date</v-col>
      </v-row>

      <v-row v-for="(cert, index) in staff?.certificates" :key="index" align="center">
        <v-col cols="4">{{ cert.certificateLevel || EMPTY_PLACEHOLDER }}</v-col>
        <v-col cols="4">{{ cert.effectiveStartDate || EMPTY_PLACEHOLDER }}</v-col>
        <v-col cols="4">{{ cert.effectiveEndDate || EMPTY_PLACEHOLDER }}</v-col>
      </v-row>

      <v-row v-if="!staff.certificates?.length" align="center">
        <v-col cols="12" class="text-center">No certificates available</v-col>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/guiComponents/AppDialog.vue';
import { EMPTY_PLACEHOLDER } from '@/utils/constants.js';

export default {
  name: 'ECEStaffCertificationDialog',
  components: { AppDialog },
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    staff: {
      type: Object,
      default: null,
    },
  },
  emits: ['update:modelValue'],
  computed: {
    dialogOpen: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit('update:modelValue', val);
      },
    },
  },
  created() {
    this.EMPTY_PLACEHOLDER = EMPTY_PLACEHOLDER;
  },
  methods: {
    closeDialog() {
      this.dialogOpen = false;
    },
  },
};
</script>
