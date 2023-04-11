<template>
  <v-row justify="space-around" class="stickyNavButtons">
    <v-btn class="blueButton" x-large :loading="isProcessing" @click="previous()">Back</v-btn>
    <v-btn v-if='isNextDisplayed' :class="isNextDisabled ? 'disabledButton' : 'blueButton'" x-large :loading="isProcessing" @click="next()">Next</v-btn>
    <v-btn v-if='isSaveDisplayed' class="blueButton" x-large :loading="isProcessing" :disabled="isSaveDisabled" @click="save()">Save</v-btn>
    <v-btn v-if='isSubmitDisplayed' class="blueButton" x-large :loading="isProcessing" :disabled="isSubmitDisabled" @click="submit()">Submit</v-btn>
  </v-row>
</template>

<script>
export default {
  name: 'NavButton',
  props: {
    isProcessing: {
      type: Boolean,
      default: false
    },
    isSubmitDisplayed: {
      type: Boolean,
      default: false
    },
    isSubmitDisabled: {
      type: Boolean,
      default: false
    },
    isSaveDisplayed: {
      type: Boolean,
      default: false
    },
    isSaveDisabled: {
      type: Boolean,
      default: false
    },
    isNextDisplayed: {
      type: Boolean,
      default: false
    },
    isNextDisabled: {
      type: Boolean,
      default: false
    },
  },
  emits: ['previous', 'next', 'validateForm', 'save', 'submit'],
  methods: {
    async previous() {
      this.$emit('previous');
    },
    async next() {
      if (this.isNextDisabled)
        this.$emit('validateForm');
      else
        this.$emit('next');
    },
    async save() {
      this.$emit('save');
    },
    async submit() {
      this.$emit('submit');
    },
  }
};
</script>
