<template>
  <v-row justify="space-around" class="stickyNavButtons">
    <v-btn class="blueButton" x-large :loading="isProcessing" @click="previous()">Back</v-btn>
    <v-btn v-if='isNextDisplayed' :class="isNextDisabled ? 'disabledButton' : 'blueButton'" x-large :loading="isProcessing" @click="next()">Next</v-btn>
    <v-btn v-if='isSaveDisplayed' class="blueButton" x-large :loading="isProcessing" :disabled="isSaveDisabled" @click="save(true)">Save</v-btn>
  </v-row>
</template>

<script>
export default {
  name: 'NavButton',
  props: {
    isProcessing: Boolean,
    isSaveDisplayed: Boolean,
    isSaveDisabled: Boolean,
    isNextDisplayed: Boolean,
    isNextDisabled: Boolean,
  },
  emits: ['previous', 'next', 'validateForm', 'save'],
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
  }
};
</script>
