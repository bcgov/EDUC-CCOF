<template>
  <AppDialog v-model="dialogOpen" persistent max-width="60%" @close="closeDialog">
    <template #content>
      <div class="text-center">
        <p class="pt-4 font-weight-bold text-h5">Leave this page?</p>
        <p class="pt-4 text-h6">You may have unsaved changes.</p>
        <p class="pt-4 text-h6">Make sure to save your work before returning to the Enrolment Report Dashboard.</p>
      </div>
    </template>
    <template #button>
      <v-row no-gutters class="px-8 px-xl-0">
        <v-col cols="12" md="6" class="py-2 d-flex justify-center">
          <AppButton id="stay-on-page" :primary="false" @click="closeDialog">Stay on this page</AppButton>
        </v-col>
        <v-col cols="12" md="6" class="py-2 d-flex justify-center">
          <AppButton id="go-to-enrolment-report-dashboard" @click="goToEnrolmentReportDashboard">
            Go back to Dashboard
          </AppButton>
        </v-col>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';
import { PATHS } from '@/utils/constants.js';

export default {
  name: 'BackConfirmationDialog',
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
    closeDialog() {
      this.dialogOpen = false;
    },
    goToEnrolmentReportDashboard() {
      this.$router.push(PATHS.ROOT.ENROLMENT_REPORTS);
    },
  },
};
</script>
