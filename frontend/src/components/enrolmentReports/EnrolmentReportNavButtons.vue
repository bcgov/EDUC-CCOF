<template>
  <v-row no-gutters justify="space-around" class="stickyNavButtons">
    <AppButton :loading="isProcessing" :primary="false" :size="buttonSize" min-width="100px" @click="previous">
      Back
    </AppButton>
    <AppButton
      v-if="isSaveDisplayed"
      :loading="isProcessing"
      :disabled="isSaveDisabled"
      :primary="false"
      :size="buttonSize"
      @click="save"
    >
      Save and Calculate
    </AppButton>
    <AppButton
      v-if="isNextDisplayed"
      :loading="isProcessing"
      :class="isNextDisabled ? 'disabledButton' : ''"
      :size="buttonSize"
      min-width="100px"
      @click="next"
    >
      Next
    </AppButton>
    <AppButton v-if="isSubmitDisplayed" :loading="isProcessing" :disabled="isSubmitDisabled" @click="submit">
      Submit
    </AppButton>
  </v-row>
</template>

<script>
import AppButton from '@/components/guiComponents/AppButton.vue';

export default {
  name: 'EnrolmentReportNavButtons',
  components: {
    AppButton,
  },
  props: {
    isProcessing: {
      type: Boolean,
      default: false,
    },
    isSubmitDisplayed: {
      type: Boolean,
      default: false,
    },
    isSubmitDisabled: {
      type: Boolean,
      default: false,
    },
    isSaveDisplayed: {
      type: Boolean,
      default: false,
    },
    isSaveDisabled: {
      type: Boolean,
      default: false,
    },
    isNextDisplayed: {
      type: Boolean,
      default: false,
    },
    isNextDisabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['previous', 'next', 'validateForm', 'save', 'submit'],
  computed: {
    buttonSize() {
      return this.$vuetify.display.smAndDown ? 'small' : null;
    },
  },
  methods: {
    async previous() {
      this.$emit('previous');
    },
    async next() {
      if (this.isNextDisabled) this.$emit('validateForm');
      else this.$emit('next');
    },
    async save() {
      this.$emit('save');
    },
    async submit() {
      this.$emit('submit');
    },
  },
};
</script>
