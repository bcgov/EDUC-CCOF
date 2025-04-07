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
              href="https://www2.gov.bc.ca/gov/content?id=733BCA6294F34DCAB28CD6BE73D67F92"
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
          <v-col cols="12" lg="9" class="pl-0">
            <h3 class="text-primary left-align mt-2">Will parents pay for this closure?</h3>
          </v-col>
          <v-col cols="12" lg="3" class="pr-0">
            <v-radio-group v-model="parentsWillPayForClosure" required :rules="rules.required">
              <v-row class="ml-4">
                <v-radio label="Yes" value="1" />
                <v-radio label="No" value="0" />
              </v-row>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row v-if="parentsWillPayForClosure === '0'">
          <!-- JonahCurlCGI todo: fix with finalized wording when available -->
          <AppAlertBanner type="warning"> Must be a paid closure </AppAlertBanner>
        </v-row>
        <v-container v-if="selectedFacility && parentsWillPayForClosure === '1'" width="100%" class="pa-0">
          <v-row>
            <v-col cols="12" lg="9" class="pl-0">
              <!-- JonahCurlCGI todo: add info icon -->
              <h3 class="text-primary left-align mt-2">
                Is this a full facility closure?
                <AppTooltip tooltip-content="Select no if only some care categories will be affected by the closure." />
              </h3>
            </v-col>
            <v-col cols="12" lg="3" class="pr-0">
              <v-radio-group v-model="fullFacilityClosure" required :rules="rules.required">
                <v-row class="ml-4">
                  <v-radio label="Yes" value="true" />
                  <v-radio label="No" value="false" />
                </v-row>
              </v-radio-group>
            </v-col>
          </v-row>
          <v-row v-if="fullFacilityClosure === 'true'"></v-row>
          <v-row>
            <v-col cols="12" lg="9" class="pl-0">
              <h3 class="text-primary left-align mt-2">Dates:</h3>
            </v-col>
            <v-col> </v-col>
          </v-row>
        </v-container>
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
import AppAlertBanner from '@/components/guiComponents/AppAlertBanner.vue';
import AppTooltip from '@/components/guiComponents/AppTooltip.vue';

export default {
  name: 'NewClosureRequestDialog',
  components: { AppAlertBanner, AppButton, AppDialog, AppTooltip },
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
      fullFacilityClosure: undefined,
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
      ClosureService.createNewClosureChangeRequest({});
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
