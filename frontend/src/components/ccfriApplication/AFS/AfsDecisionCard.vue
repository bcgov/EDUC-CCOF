<template>
  <v-card elevation="2" class="pa-4">
    <div class="mb-2">Please select one of the following options regarding the approvable fee schedule:</div>
    <v-radio-group v-model="updatedValue" :rules="rules.required" :disabled="readonly" color="primary">
      <v-radio label="I accept" :value="AFS_STATUSES.ACCEPT" />
      <div v-if="!readonly && updatedValue === AFS_STATUSES.ACCEPT" class="text-body-2 pl-2">
        After submission please wait to receive notification confirming your approval to participate in CCFRI.
      </div>
      <v-radio label="I want to upload supporting documents" :value="AFS_STATUSES.UPLOAD_DOCUMENTS" />
      <v-radio v-if="!isChangeRequest" label="I decline" :value="AFS_STATUSES.DECLINE" />
      <div v-if="!readonly && updatedValue === AFS_STATUSES.DECLINE" class="text-body-2 pl-2">
        After submission please wait to receive confirmation from the ministry on the results of your CCFRI application.
      </div>
    </v-radio-group>
  </v-card>
</template>

<script>
import { AFS_STATUSES } from '@/utils/constants.js';
import rules from '@/utils/rules.js';

export default {
  name: 'AfsDecisionCard',
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Number,
      default: null,
    },
    isChangeRequest: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      updatedValue: null,
    };
  },
  watch: {
    modelValue: {
      handler(value) {
        this.updatedValue = value;
      },
    },
    updatedValue: {
      handler(value) {
        this.$emit('update:modelValue', value);
      },
    },
  },
  created() {
    this.updatedValue = this.modelValue;
    this.AFS_STATUSES = AFS_STATUSES;
    this.rules = rules;
  },
};
</script>
<style scoped>
:deep(.v-label) {
  opacity: 1;
}
</style>
