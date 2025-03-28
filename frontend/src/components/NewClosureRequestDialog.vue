<template>
  <AppDialog v-model="isDisplayed" title="New Closure Request" :loading="isLoading" @close="closeDialog">
    <template #content>
      <v-container class="pa-8">
        <v-row class="text-primary">
          <h1>Fiscal Year: {{ getProgramYearNameById(programYearId).slice(0, -3) }}</h1>
        </v-row>
        <v-row>
          <p class="left-align">
            Closures may impact your CCFRI payments. See the
            <a
              href="https://www2.gov.bc.ca/gov/content/family-social-supports/caring-for-young-children/childcarebc-programs/wage-enhancement"
              target="_blank"
              >CCFRI Funding Guidelines</a
            >
            for information on the maximum closure period. Information about eligibility for CCOF Base Funding during
            Emergency closures is available on the CCOF website.
          </p>
        </v-row>
      </v-container>
    </template>
    <template #button> </template>
  </AppDialog>
</template>

<script>
import { mapState } from 'pinia';

import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';

import alertMixin from '@/mixins/alertMixin';
import { useAppStore } from '@/store/app.js';

export default {
  name: 'NewClosureRequestDialog',
  components: { AppButton, AppDialog },
  mixins: [alertMixin],
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    programYearId: {
      type: String,
      default: '',
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
    ...mapState(useAppStore, ['getProgramYearNameById']),
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
.left-align {
  text-align: left;
}
</style>
