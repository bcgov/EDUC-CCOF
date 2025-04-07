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
        <v-row class="text-primary">
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
        <v-container v-if="selectedFacility && parentsWillPayForClosure" width="100%" class="pa-0">
          <v-row>
            <v-col cols="12" lg="9" class="pl-0">
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
          <v-row v-if="fullFacilityClosure === 'false'" align="center" class="text-primary pl-0">
            <h3>Affected Care Categorie(s)</h3>
            <p class="ml-2">(select all that apply):</p>
          </v-row>
          <v-row v-if="fullFacilityClosure === 'false'" class="text-primary pl-0">
            <v-select
              v-model="selectedAgeGroups"
              :items="ageGroups"
              item-title="label"
              item-value="value"
              label="Select affected care categories"
              variant="outlined"
              class="mt-2"
              multiple
              chips
              clearable
            />
          </v-row>
          <v-row>
            <v-col cols="12" lg="9" class="pl-0">
              <h3 class="text-primary left-align mt-2">
                Dates:
                <AppTooltip tooltip-content="Select the estimated end date, if applicable." />
              </h3>
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
import { ref } from 'vue';

import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';
import AppTooltip from '@/components/guiComponents/AppTooltip.vue';
import { CCLOSURE_AFFECTED_AGE_GROUPS, CLOSURE_AFFECTED_AGE_GROUPS_TEXTS } from '@/utils/constants.js';
import rules from '@/utils/rules.js';
import ClosureService from '@/services/closureService.js';

import alertMixin from '@/mixins/alertMixin';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';

export default {
  name: 'NewClosureRequestDialog',
  components: { AppButton, AppDialog, AppTooltip },
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
      ageGroups: [
        { label: 'Select All', value: 'all' },
        { label: 'CLOSURE_AFFECTED_AGE_GROUPS_TEXTS.AGE_0_18', value: CLOSURE_AFFECTED_AGE_GROUPS.AGE_0_18 },
        // { label: CLOSURE_AFFECTED_AGE_GROUPS_TEXTS.AGE_18_36, value: CLOSURE_AFFECTED_AGE_GROUPS.AGE_18_36 },
        // { label: CLOSURE_AFFECTED_AGE_GROUPS_TEXTS.AGE_3Y_K, value: CLOSURE_AFFECTED_AGE_GROUPS.AGE_3Y_K },
        // { label: CLOSURE_AFFECTED_AGE_GROUPS_TEXTS.OOSC_K, value: CLOSURE_AFFECTED_AGE_GROUPS.OOSC_K },
        // { label: CLOSURE_AFFECTED_AGE_GROUPS_TEXTS.OOSC_G, value: CLOSURE_AFFECTED_AGE_GROUPS.OOSC_G },
        // { label: CLOSURE_AFFECTED_AGE_GROUPS_TEXTS.PRE, value: CLOSURE_AFFECTED_AGE_GROUPS.PRE },
      ],
      selectedAgeGroups: ref([]),
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
    handleAgeGroupSelectionChange() {},
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
