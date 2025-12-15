<template>
  <v-form ref="nmfSummaryForm" v-model="isValidForm">
    <v-expansion-panel-title>
      <SummaryExpansionPanelTitle
        title="Request for Information: New, New-to-CCFRI, and Modified Facilities"
        :loading="isApplicationProcessing"
        :is-complete="isValidForm"
      />
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
        <template v-if="nmfApp?.supportNeeds">
          <p class="summary-label">
            Please enter your Project ID, Funding Program, and Application Date. If you are not sure what your Project
            ID is, call Child Care Capital and Community Services at 1-888-338-6622 (Option 5).
          </p>
          <p v-if="nmfApp?.supportNeedsComments" class="break-word pt-2">{{ nmfApp?.supportNeedsComments }}</p>
          <v-text-field
            v-else
            placeholder="Required"
            :model-value="nmfApp?.supportNeedsComments"
            density="compact"
            flat
            variant="solo"
            hide-details
            readonly
            :rules="rules.required"
          />
        </template>
      </div>
      <div class="my-4">
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
          :rules="rules.required"
        />
        <template v-if="nmfApp?.lowIncomeFamilies">
          <p class="summary-label">Please describe the service(s) and associated expenses.</p>
          <p v-if="nmfApp?.lowIncomeFamiliesComments" class="break-word pt-2">
            {{ nmfApp?.lowIncomeFamiliesComments }}
          </p>
          <v-text-field
            v-else
            placeholder="Required"
            :model-value="nmfApp?.lowIncomeFamiliesComments"
            density="compact"
            flat
            variant="solo"
            hide-details
            readonly
            :rules="rules.required"
          />
        </template>
      </div>
      <div class="my-4">
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
          :rules="rules.required"
        />
        <template v-if="nmfApp?.remoteCommunities">
          <p class="summary-label">Please describe the service(s) and associated expenses.</p>
          <p v-if="nmfApp?.remoteCommunitiesComments" class="break-word pt-2">
            {{ nmfApp?.remoteCommunitiesComments }}
          </p>
          <v-text-field
            v-else
            placeholder="Required"
            :model-value="nmfApp?.remoteCommunitiesComments"
            density="compact"
            flat
            variant="solo"
            hide-details
            readonly
            :rules="rules.required"
          />
        </template>
      </div>
      <div class="my-4">
        <p class="summary-label">
          Please tell us anything else you'd like us to know about how your facility's business case supports setting
          fees higher than the Affordability Benchmarks outlined in the {{ formattedProgramYear }}
          <a :href="getFundingUrl(programYearId)" target="_blank">Funding Guidelines.</a>
        </p>
        <p class="break-word pt-2">{{ nmfApp?.otherComments ?? EMPTY_PLACEHOLDER }}</p>
      </div>
      <router-link v-if="!isValidForm" :to="routingPath">
        <u class="text-error">To add this information, click here. This will bring you to a different page.</u>
      </router-link>
    </v-expansion-panel-text>
  </v-form>
</template>
<script>
import { mapState } from 'pinia';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import summaryMixin from '@/mixins/summaryMixin.js';
import { PATHS, pcfUrlGuid } from '@/utils/constants.js';

export default {
  name: 'NMFSummaryV1',
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
      default: '',
    },
  },
  data() {
    return {
      isValidForm: false,
    };
  },
  computed: {
    ...mapState(useAppStore, ['getFundingUrl']),
    ...mapState(useApplicationStore, ['formattedProgramYear']),
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
.break-word {
  word-break: break-word;
}
</style>
