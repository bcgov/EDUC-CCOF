<template>
  <v-row no-gutters justify="space-around" class="stickyNavButtons">
    <AppButton :loading="loading" :primary="false" :size="buttonSize" min-width="100px" @click="previous">
      Back
    </AppButton>
    <AppButton
      v-if="isSaveDisplayed"
      :loading="loading"
      :disabled="isSaveDisabled"
      :primary="false"
      :size="buttonSize"
      @click="save"
    >
      Save and Calculate
    </AppButton>
    <AppButton
      v-if="isNextDisplayed"
      :loading="loading"
      :disabled="isNextDisabled"
      :size="buttonSize"
      min-width="100px"
      @click="next"
    >
      Next
    </AppButton>
    <AppButton v-if="isSubmitDisplayed" :loading="loading" :disabled="isSubmitDisabled" @click="submit">
      Accept and Submit
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
    loading: {
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
  emits: ['previous', 'next', 'save', 'submit'],
  computed: {
    buttonSize() {
      return this.$vuetify.display.smAndDown ? 'small' : null;
    },
  },
  methods: {
    previous() {
      this.$emit('previous');
    },
    next() {
      this.$emit('next');
    },
    save() {
      this.$emit('save');
    },
    submit() {
      this.$emit('submit');
    },
  },
};
</script>
