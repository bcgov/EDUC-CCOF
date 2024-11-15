<template>
  <AppDialog v-model="isDisplayed" title="Cancel Application Warning" :loading="isLoading" @close="closeDialog">
    <template #content>
      <div class="text-center pa-4">
        <p class="mb-4">
          If you cancel your application, any information you entered will be deleted. If you create a new application,
          you will need to re-enter this information.
        </p>
        <p>Are you sure you want to cancel your application and delete your information?</p>
      </div>
    </template>
    <template #button>
      <v-row justify="space-around">
        <v-col cols="12" md="6" class="d-flex justify-center">
          <AppButton
            id="back-button"
            :loading="isLoading"
            :primary="false"
            size="large"
            width="200px"
            @click="closeDialog"
          >
            Back
          </AppButton>
        </v-col>
        <v-col cols="12" md="6" class="d-flex justify-center">
          <AppButton id="cancel-application-button" :loading="isLoading" size="large" width="200px" @click="deletePcf">
            Continue
          </AppButton>
        </v-col>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import { mapActions } from 'pinia';
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';
import { useApplicationStore } from '@/store/application.js';
import alertMixin from '@/mixins/alertMixin';

export default {
  name: 'CancelApplicationDialog',
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
    ...mapActions(useApplicationStore, ['deletePcfApplication']),

    closeDialog() {
      this.$emit('close');
    },

    async deletePcf() {
      try {
        this.isLoading = true;
        await this.deletePcfApplication();
        this.setSuccessAlert('Application cancelled successfully');
        location.reload(true);
      } catch (error) {
        console.log(error);
        this.setFailureAlert('Failed to cancel your application');
        this.closeDialog();
      }
    },
  },
};
</script>
