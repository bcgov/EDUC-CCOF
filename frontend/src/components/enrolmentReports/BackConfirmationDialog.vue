<template>
  <AppDialog v-model="isDisplayed" title="Confirmation" persistent max-width="80%" @close="closeDialog">
    <template #content>
      <div class="text-center">
        <p class="pt-4 font-weight-bold text-h6">Go back to the dashboard?</p>
        <p class="pt-4 text-h6">You may have unsaved changes.</p>
        <p class="pt-4 text-h6">
          Make sure you've saved your work before going back to the Enrolment Report Dashboard.
        </p>
      </div>
    </template>
    <template #button>
      <v-row justify="space-between" no-gutters class="px-8 px-xl-0">
        <v-col cols="12" md="6" class="py-2 d-flex justify-center">
          <AppButton id="stay-on-page" :primary="false" @click="closeDialog">Stay on this page</AppButton>
        </v-col>
        <v-col cols="12" md="6" class="py-2 d-flex justify-center">
          <AppButton id="go-to-enrolment-report-dashboard" @click="goToEnrolmentReportDashboard">
            Go back to the Enrolment Report Dashboard
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
    show: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close'],
  data() {
    return {
      isDisplayed: false,
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
    goToEnrolmentReportDashboard() {
      this.$router.push(PATHS.ROOT.ENROLMENT_REPORTS);
    },
  },
};
</script>
