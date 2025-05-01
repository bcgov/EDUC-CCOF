<template>
  <AppDialog v-model="isDisplayed" title="Success" persistent max-width="40%" @close="closeDialog">
    <template #content>
      <div class="text-center">
        <p class="pt-4 text-h6">Your request has been submitted.</p>
        <p class="pt-4 text-h6">Reference: {{ changeRequestReferenceId }}</p>
      </div>
    </template>
    <template #button>
      <v-row justify="space-around">
        <AppButton id="return-button" size="large" min-width="250px" @click="closeDialog">Return to Closures</AppButton>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';

export default {
  name: 'ClosureConfirmationDialog',
  components: { AppButton, AppDialog },
  props: {
    show: {
      type: Boolean,
      default: false,
      required: true,
    },
    changeRequestReferenceId: {
      type: String,
      default: '',
      required: true,
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
  },
};
</script>
