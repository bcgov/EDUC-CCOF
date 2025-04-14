<template>
  <AppDialog v-model="isDisplayed" title="Closure Details" @close="closeDialog">
    <template #content>
      <v-container class="pa-5">
        <v-row>License Number</v-row>
        <v-row>{{ closure.licenseNumber }}</v-row>
        <v-row>Closure Reason</v-row>
        <v-row>{{ closure.closureReason }}</v-row>
        <v-row>Closure Type</v-row>
        <v-row>{{ closureType }}</v-row>
        <v-row>Affected Care Types</v-row>
        <v-row>{{ affectedCareTypes }}</v-row>
      </v-container>
    </template>
    <template #button>
      <v-row justify="center">
        <AppButton :primary="false" @click="closeDialog">Back to Summary</AppButton>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';
import alertMixin from '@/mixins/alertMixin';

export default {
  name: 'ClosureDetailsDialog',
  components: { AppButton, AppDialog },
  mixins: [alertMixin],
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    closure: {
      type: Object,
      default: undefined,
    },
  },
  emits: ['close'],
  data() {
    return {
      isDisplayed: false,
      isLoading: false,
    };
  },
  computed: {
    closureType() {
      return this.closure.fullClosure ? 'Full' : 'Partial';
    },
    affectedCareTypes() {
      return '';
    },
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
