<template>
  <AppDialog v-model="isDisplayed" persistent max-width="900px" @close="isDisplayed = false">
    <template #content>
      <p class="text-h6">
        <strong>You have one or more Enrolment Report(s) that have not been submitted.</strong> Submit the Enrolment
        Report(s) by the deadline to receive funding. Enrolment Reports will not be accepted after the submission
        deadline and the Ministry will not make any related payments.
      </p>
      <p class="text-primary text-h6 mt-4">Would you like to take action now?</p>
    </template>
    <template #button>
      <v-row class="px-9" justify="space-between">
        <AppButton :primary="false" class="text-body-2" min-width="250px" @click="isDisplayed = false">
          Not Now
        </AppButton>
        <AppButton :primary="true" class="text-body-2" min-width="250px" @click="goToDashboard">
          Yes, take me to the Enrolment Report Dashboard
        </AppButton>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';

export default {
  name: 'EnrolmentReportDialog',
  components: { AppButton, AppDialog },
  data() {
    return {
      isDisplayed: true,
    };
  },
  methods: {
    goToDashboard() {
      this.isDisplayed = false;
    },
  },
};
</script>
