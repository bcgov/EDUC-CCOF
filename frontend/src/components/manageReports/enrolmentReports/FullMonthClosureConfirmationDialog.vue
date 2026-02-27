<template>
  <AppDialog v-model="dialogOpen" :loading="loading" persistent max-width="50%" @close="cancel">
    <template #content>
      <p class="pt-4 font-weight-bold text-h5">Confirm Full Month Closure or No Enrolment</p>
      <div class="text-h6 text-left px-8 pt-8">
        <p>You are reporting that your facility was closed or had no enrolment for the entire month of service.</p>
        <p class="pt-4">
          You will be redirected to a declaration page to confirm this before submitting your Enrolment Report.
        </p>
        <p class="pt-4">
          If your facility opens or enrolment begins during this month, you must submit an adjustment before the
          reporting deadline.
        </p>
        <p class="pt-4">
          If your facility is permanently closed, or remains closed for three consecutive months, you must contact the
          Child Care Operating Funding Program as it may impact your Funding Agreement.
        </p>
      </div>
    </template>
    <template #button>
      <v-row justify="space-around" class="px-4">
        <v-col cols="12" md="6" class="d-flex justify-center">
          <AppButton id="cancel" :loading="loading" :primary="false" min-width="150px" @click="cancel">
            Cancel
          </AppButton>
        </v-col>
        <v-col cols="12" md="6" class="d-flex justify-center">
          <AppButton id="proceed" :loading="loading" min-width="150px" @click="proceed"> Proceed </AppButton>
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
    loading: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:modelValue', 'cancel', 'proceed'],
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
    cancel() {
      this.closeDialog();
      this.$emit('cancel');
    },
    proceed() {
      this.closeDialog();
      this.$emit('proceed');
    },
  },
};
</script>
