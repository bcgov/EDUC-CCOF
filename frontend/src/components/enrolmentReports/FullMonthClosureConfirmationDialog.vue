<template>
  <AppDialog :model-value="show" persistent max-width="50%" @close="close">
    <template #content>
      <div class="text-center">
        <p class="pt-4 font-weight-bold text-h5">Report Full Month Closure ?</p>
        <p class="pt-6 text-h6">
          You're about to report that your facility will be fully closed for the
          <strong>entire reporting month.</strong>
        </p>
        <p class="pt-6 text-h6">
          You will be taken to a declaration page to confirm before submitting your Enrolment Report.
        </p>
      </div>
    </template>
    <template #button>
      <v-row justify="space-around" class="px-4">
        <v-col cols="12" md="6" class="d-flex justify-center">
          <AppButton id="cancel" :primary="false" @click="close"> Cancel </AppButton>
        </v-col>
        <v-col cols="12" md="6" class="d-flex justify-center">
          <AppButton id="confirm" @click="confirm"> Yes, report full month closure </AppButton>
        </v-col>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';

export default {
  name: 'FullMonthClosureConfirmationDialog',
  components: {
    AppButton,
    AppDialog,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close', 'confirm'],
  methods: {
    close() {
      this.$emit('close');
    },
    confirm() {
      this.$emit('confirm');
    },
  },
};
</script>
