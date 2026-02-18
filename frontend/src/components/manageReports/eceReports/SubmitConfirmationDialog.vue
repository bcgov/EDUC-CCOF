<template>
  <AppDialog v-model="dialogOpen" persistent max-width="50%" @close="goToECEReportDashboard">
    <template #content>
      <div class="text-center">
        <p class="pt-4 font-weight-bold text-h5">Submission Successful</p>
        <p class="pt-6 text-h6">Your Monthly ECE Report has been submitted successfully.</p>
      </div>
    </template>
    <template #button>
      <v-row class="justify-center px-8 px-xl-0">
        <AppButton id="go-to-ece-report-dashboard" @click="goToECEReportDashboard"> Go back to Dashboard </AppButton>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';
import { PATHS } from '@/utils/constants.js';

export default {
  name: 'SubmitConfirmationDialog',
  components: {
    AppButton,
    AppDialog,
  },
  props: {
    modelValue: {
      type: Boolean,
      required: true,
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
  methods: {
    goToECEReportDashboard() {
      this.$router.push(PATHS.ROOT.MANAGE_ECE_REPORTS);
    },
  },
};
</script>
