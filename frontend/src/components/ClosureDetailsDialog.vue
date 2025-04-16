<template>
  <AppDialog v-model="isDisplayed" title="Closure Details" text-alignment="left" @close="closeDialog">
    <template #content>
      <v-card class="pa-4 border-top">
        <div class="pb-6">
          <p class="pb-2">Licence Number</p>
          <strong>{{ closure?.licenseNumber }}</strong>
        </div>
        <div class="pb-6">
          <p class="pb-2">Closure Reason</p>
          <strong>{{ closure?.closureReason }}</strong>
        </div>
        <div class="pb-6">
          <p class="pb-2">Closure Type</p>
          <strong>{{ closureType }}</strong>
        </div>
        <div v-if="closure?.fullClosure === false" class="mr-2">
          <p class="pb-2">Affected Care Types</p>
          <strong>
            {{ affectedCareTypes }}
          </strong>
        </div>
      </v-card>
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
import { CLOSURE_AFFECTED_AGE_GROUPS_VALUES_TO_TEXT } from '@/utils/constants.js';

export default {
  name: 'ClosureDetailsDialog',
  components: { AppButton, AppDialog },
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
    };
  },
  computed: {
    closureType() {
      return this.closure?.fullClosure ? 'Full' : 'Partial';
    },
    affectedCareTypes() {
      if (!this.closure || this.closure.fullClosure || !this.closure.ageGroups) {
        return '';
      }

      const ageGroupVals = this.closure.ageGroups.split(',');
      ageGroupVals.sort();
      return ageGroupVals.map((val) => CLOSURE_AFFECTED_AGE_GROUPS_VALUES_TO_TEXT[Number(val)]).join(', ');
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
<style scoped>
.border-top {
  border-top: 4px solid gray;
}
</style>
