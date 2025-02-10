<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-form ref="nmfSummaryForm" v-model="isValidForm">
      <v-expansion-panel-title>
        <h4 style="color: #003466">
          NMF
          <v-icon v-if="isValidForm" color="green" size="large"> mdi-check-circle-outline </v-icon>
          <v-icon v-if="!isValidForm" class="text-error" size="large"> mdi-alert-circle-outline </v-icon>
          <span v-if="!isValidForm" class="text-error"
            >Your form is missing required information. Click here to view</span
          >
        </h4>
      </v-expansion-panel-title>
      <v-expansion-panel-text eager class="ml-2">
        <v-row no-gutters class="d-flex flex-column">
          <v-row class="d-flex justify-start">
            <v-col cols="8" lg="6" class="pb-0 pt-0">
              <v-row no-gutters class="d-flex justify-start">
                <v-col cols="10" class="d-flex justify-start">
                  <span class="summary-label pt-3">
                    Did you apply for Ministry funding to create new licensed spaces prior to April 1, 2021 (e.g. New
                    Spaces Fund, UBCM Community Child Care Space Creation Program, Start-up Grants, Rapid Renovation
                    Funding)?</span
                  >
                </v-col>
                <v-col cols="3" class="d-flex justify-start">
                  <v-text-field
                    placeholder="Required"
                    :model-value="nmfApp?.supportNeeds"
                    class=""
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    readonly
                    :rules="rules.required"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="10">
              <v-textarea
                v-if="nmfApp?.supportNeeds == 'Yes'"
                placeholder="Required"
                :model-value="nmfApp?.supportNeedsComments"
                class=""
                density="compact"
                flat
                variant="solo"
                hide-details
                no-resize
                rows="3"
                readonly
                :rules="rules.required"
              />
            </v-col>
          </v-row>
          <v-row class="d-flex justify-start">
            <v-col cols="8" lg="6" class="pb-0 pt-0">
              <v-row no-gutters class="d-flex justify-start">
                <v-col cols="10" class="d-flex justify-start">
                  <span class="summary-label pt-3"
                    >Does your facility provide additional services (such as meals or other wrap-around services), to
                    support families experiencing vulnerability and/or underserved populations, such as Indigenous or
                    low-income families?</span
                  >
                </v-col>
                <v-col cols="3" class="d-flex justify-left">
                  <v-text-field
                    placeholder="Required"
                    :model-value="nmfApp?.lowIncomeFamilies"
                    class=""
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    readonly
                    no-resize
                    rows="3"
                    :rules="rules.required"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="10">
              <v-textarea
                v-if="nmfApp?.lowIncomeFamilies == 'Yes'"
                placeholder="Required"
                :model-value="nmfApp?.lowIncomeFamiliesComments"
                class=""
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                no-resize
                rows="3"
                :rules="rules.required"
              />
            </v-col>
          </v-row>
          <v-row class="d-flex justify-start">
            <v-col cols="8" lg="6" class="pb-0 pt-0">
              <v-row no-gutters class="d-flex justify-start">
                <v-col cols="10" class="d-flex justify-start">
                  <span class="summary-label pt-3"
                    >Do you provide transportation to/from your facility to support families in rural or remote
                    communities who may not otherwise be able to access child care?</span
                  >
                </v-col>
                <v-col cols="3" class="d-flex justify-start">
                  <v-text-field
                    placeholder="Required"
                    :model-value="nmfApp?.remoteCommunities"
                    class=""
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    readonly
                    no-resize
                    rows="3"
                    :rules="rules.required"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="10">
              <v-textarea
                v-if="nmfApp?.remoteCommunities == 'Yes'"
                placeholder="Required"
                :model-value="nmfApp?.remoteCommunitiesComments"
                class=""
                density="compact"
                flat
                variant="solo"
                hide-details
                no-resize
                rows="3"
                readonly
                :rules="rules.required"
              />
            </v-col>
          </v-row>
          <v-row class="d-flex justify-start">
            <v-col cols="8" lg="6" class="pb-0 pt-0">
              <v-row no-gutters class="d-flex justify-start">
                <v-col cols="10" class="d-flex justify-start">
                  <span class="summary-label pt-3"
                    >Please tell us anything else you'd like us to know about how your facility's business case supports
                    setting fees higher than the Affordability Benchmarks outlined in the 2023-24 Funding
                    Guidelines.</span
                  >
                </v-col>
                <v-col cols="3" class="d-flex justify-left">
                  <v-textarea
                    label="--"
                    :model-value="nmfApp?.otherComments"
                    class=""
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    readonly
                    no-resize
                    rows="3"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-row>
        <div class="mt-6">
          <router-link v-if="!isValidForm" :to="pcfLink">
            <u class="text-error">To add this information, click here. This will bring you to a different page.</u>
          </router-link>
        </div>
      </v-expansion-panel-text>
    </v-form>
  </v-row>
</template>
<script>
import { mapState } from 'pinia';

import { useSummaryDeclarationStore } from '@/store/summaryDeclaration.js';

import rules from '@/utils/rules.js';
import { PATHS, pcfUrlGuid } from '@/utils/constants.js';

export default {
  name: 'NMFSummary',
  props: {
    ccfriId: {
      type: String,
      required: true,
    },
    nmfApp: {
      type: Object,
      required: true,
    },
    facilityId: {
      type: String,
      required: false,
      default: '',
    },
    programYearId: {
      type: String,
      required: false,
      default: '',
    },
  },
  emits: ['isSummaryValid'],
  data() {
    return {
      PATHS,
      rules,
      isValidForm: true,
      formObj: {
        formName: 'NMFSummary',
        formId: this.facilityId,
      },
    };
  },
  computed: {
    ...mapState(useSummaryDeclarationStore, ['isLoadingComplete']),

    pcfLink() {
      return pcfUrlGuid(PATHS.CCFRI_NMF, this.programYearId, this.ccfriId);
    },
  },
  watch: {
    isLoadingComplete: {
      handler: function (val) {
        if (val) {
          this.$emit('isSummaryValid', this.formObj, this.isValidForm);
        }
      },
    },
  },
};
</script>
<style scoped>
.summary-label {
  color: grey;
  font-size: small;
}

:deep(::placeholder) {
  color: #d8292f !important;
  opacity: 1 !important;
}

.summary-value {
  font-size: medium;
  color: black;
}

.summary-label-smaller {
  color: grey;
  font-size: x-small;
}

.summary-label-bold {
  color: black;
  font-size: small;
  font-style: initial;
}
.summary-value-small {
  color: black;
  font-size: small;
  font-weight: bold;
}
</style>
