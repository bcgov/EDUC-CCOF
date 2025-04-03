<template>
  <AppDialog v-model="isDisplayed" title="New Closure Request" :loading="isLoading" @close="closeDialog">
    <template #content>
      <v-container width="80%">
        <v-row class="text-primary">
          <h1>Fiscal Year: {{ getProgramYearNameById(programYearId).slice(0, -3) }}</h1>
        </v-row>
        <v-row>
          <p class="left-align mt-6">
            Closures may impact your CCFRI payments. See the
            <a
              href="https://www2.gov.bc.ca/gov/content/family-social-supports/caring-for-young-children/childcarebc-programs/wage-enhancement"
              target="_blank"
              class="text-decoration-underline"
            >
              CCFRI Funding Guidelines</a
            >
            for information on the maximum closure period. Information about eligibility for CCOF Base Funding during
            Emergency closures is available on the CCOF website.
          </p>
        </v-row>
        <v-row>
          <h3 class="text-primary mt-6">Select a Facility:</h3>
        </v-row>
        <v-row>
          <!-- JonahCurlCGI todo: fix selector items to match format on wireframe -->
          <v-select
            v-model="selectedFacility"
            required
            :rules="rules.required"
            :items="facilityList"
            item-title="facilityName"
            placeholder="Select a facility"
            variant="outlined"
            class="mt-2"
            color="blue"
          />
        </v-row>
        <v-row>
          <v-col cols="12" lg="6" class="pl-0">
            <h3 class="text-primary left-align mt-2">Will parents pay for this closure?</h3>
          </v-col>
          <v-col cols="12" lg="6">
            <v-radio-group v-model="parentsWillPayForClosure" required :rules="rules.required">
              <v-row class="ml-4">
                <v-radio label="Yes" value="Yes" />
                <v-radio label="No" value="No" />
              </v-row>
            </v-radio-group>
          </v-col>
        </v-row>
        <!-- JonahCurlCGI todo: add warning if "parents pay for this closure" set to no -->
      </v-container>
    </template>
    <template #button>
      <v-container>
        <!-- JonahCurlCGI todo: remove before pushing
         Button below used for testing create closure endpoint -->
        <v-row><v-btn @click="createOrganizationClosure()">test</v-btn></v-row>
      </v-container>
    </template>
  </AppDialog>
</template>

<script>
import { mapState } from 'pinia';

import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';

import alertMixin from '@/mixins/alertMixin';
import ClosureService from '@/services/closureService.js';
import rules from '@/utils/rules.js';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';

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
      rules,
      isDisplayed: false,
      isLoading: false,
      selectedFacility: undefined,
      parentsWillPayForClosure: undefined,
    };
  },
  computed: {
    ...mapState(useAppStore, ['getProgramYearNameById']),
    ...mapState(useApplicationStore, ['getFacilityListForPCFByProgramYearId']),
    ...mapState(useOrganizationStore, ['organizationAccountNumber', 'organizationId', 'organizationName']),
    facilityList() {
      return this.getFacilityListForPCFByProgramYearId(this.programYearId);
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
    createOrganizationClosure() {
      // ClosureService.createNewClosureChangeRequest({});
    },
  },
};
</script>

<style scoped>
.left-align {
  text-align: left;
}
.drop-down-select {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
