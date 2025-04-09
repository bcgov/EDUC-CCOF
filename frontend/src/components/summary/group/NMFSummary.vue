<template>
  <v-form ref="nmfSummaryForm" v-model="isValidForm">
    <v-expansion-panel-title>
      <SummaryExpansionPanelTitle title="NMF" :loading="isApplicationProcessing" :is-complete="isValidForm" />
    </v-expansion-panel-title>
    <v-expansion-panel-text eager>
      <div>
        <p class="summary-label">
          Did you apply for Ministry funding to create new licensed spaces prior to April 1, 2021 (e.g. New Spaces Fund,
          UBCM Community Child Care Space Creation Program, Start-up Grants, Rapid Renovation Funding)?
        </p>
        <v-text-field
          placeholder="Required"
          :model-value="getYesNoValue(nmfApp?.supportNeeds)"
          density="compact"
          flat
          variant="solo"
          hide-details
          readonly
          :rules="rules.required"
        />
        <v-textarea
          v-if="nmfApp?.supportNeeds"
          placeholder="Required"
          :model-value="nmfApp?.supportNeedsComments"
          density="compact"
          flat
          variant="solo"
          hide-details
          no-resize
          rows="3"
          readonly
          :rules="rules.required"
        />
      </div>
      <div>
        <p class="summary-label">
          Does your facility provide additional services (such as meals or other wrap-around services), to support
          families experiencing vulnerability and/or underserved populations, such as Indigenous or low-income families?
        </p>
        <v-text-field
          placeholder="Required"
          :model-value="getYesNoValue(nmfApp?.lowIncomeFamilies)"
          density="compact"
          flat
          variant="solo"
          hide-details
          readonly
          no-resize
          rows="3"
          :rules="rules.required"
        />
        <v-textarea
          v-if="nmfApp?.lowIncomeFamilies"
          placeholder="Required"
          :model-value="nmfApp?.lowIncomeFamiliesComments"
          density="compact"
          flat
          variant="solo"
          hide-details
          readonly
          no-resize
          rows="3"
          :rules="rules.required"
        />
      </div>
      <div>
        <p class="summary-label">
          Do you provide transportation to/from your facility to support families in rural or remote communities who may
          not otherwise be able to access child care?
        </p>
        <v-text-field
          placeholder="Required"
          :model-value="getYesNoValue(nmfApp?.remoteCommunities)"
          density="compact"
          flat
          variant="solo"
          hide-details
          readonly
          no-resize
          rows="3"
          :rules="rules.required"
        />
        <v-textarea
          v-if="nmfApp?.remoteCommunities"
          placeholder="Required"
          :model-value="nmfApp?.remoteCommunitiesComments"
          density="compact"
          flat
          variant="solo"
          hide-details
          no-resize
          rows="3"
          readonly
          :rules="rules.required"
        />
      </div>
      <div>
        <p class="summary-label">
          Please tell us anything else you'd like us to know about how your facility's business case supports setting
          fees higher than the Affordability Benchmarks outlined in the 2023-24 Funding Guidelines.
        </p>
        <v-textarea
          :model-value="nmfApp?.otherComments"
          density="compact"
          flat
          variant="solo"
          hide-details
          readonly
          no-resize
          rows="3"
        />
      </div>
      <router-link v-if="!isValidForm" :to="routingPath">
        <u class="text-error">To add this information, click here. This will bring you to a different page.</u>
      </router-link>
    </v-expansion-panel-text>
  </v-form>
</template>
<script>
import summaryMixin from '@/mixins/summaryMixin.js';
import { PATHS, pcfUrlGuid } from '@/utils/constants.js';

export default {
  name: 'NMFSummary',
  mixins: [summaryMixin],
  props: {
    ccfriId: {
      type: String,
      required: true,
    },
    nmfApp: {
      type: Object,
      required: true,
    },
    programYearId: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      isValidForm: false,
    };
  },
  computed: {
    routingPath() {
      return pcfUrlGuid(PATHS.CCFRI_NMF, this.programYearId, this.ccfriId);
    },
  },
};
</script>
<style scoped>
:deep(::placeholder) {
  color: #d8292f !important;
  opacity: 1 !important;
}
:deep(.v-field__input) {
  padding-left: 0px;
}
</style>
