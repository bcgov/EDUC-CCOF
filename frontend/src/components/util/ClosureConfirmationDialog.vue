<template>
  <AppDialog v-model="isDisplayed" title="Success" persistent max-width="40%" @close="closeDialog">
    <template #content>
      <v-row class="mb-2">
        <v-col align="center">
          <p class="pt-4 text-h6">Your message has been submitted.</p>
          <p class="pt-4 text-h6">Reference: {{ changeRequestReferenceId }}</p>
        </v-col>
      </v-row>
    </template>
    <template #button>
      <v-row justify="space-around">
        <v-col cols="12" class="d-flex justify-center">
          <AppButton id="view-messages-button" size="large" min-width="250px" @click="closeDialog"
            >Return to Closures</AppButton
          >
        </v-col>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';

export default {
  name: 'NewRequestConfirmationDialog',
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
  computed: {},
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
