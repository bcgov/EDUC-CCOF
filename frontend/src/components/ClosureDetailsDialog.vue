<template>
  <AppDialog v-model="isDisplayed" title="Closure Details" @close="closeDialog">
    <template #content>
      <v-card class="ma-2 pl-8 pt-4 pb-6 border-top text">
        <v-row>
          <p>License Number</p>
        </v-row>
        <v-row>
          <h3 class="value">{{ closure.licenseNumber }}</h3>
        </v-row>
        <v-row class="pt-4">Closure Reason</v-row>
        <v-row>
          <h3 class="value">{{ closure.closureReason }}</h3>
        </v-row>
        <v-row class="pt-4">Closure Type</v-row>
        <v-row>
          <h3 class="value">{{ closureType }}</h3>
        </v-row>
        <v-row class="pt-4">Affected Care Types</v-row>
        <v-row>
          <h3 class="value">
            {{ affectedCareTypes }}
          </h3>
        </v-row>
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
      return 'ja;sdf';
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
<style>
.border-top {
  border-top: 4px solid gray; /* or any color you want */
}
.text {
  color: #acacac;
}
.value {
  color: #636363;
}
</style>
