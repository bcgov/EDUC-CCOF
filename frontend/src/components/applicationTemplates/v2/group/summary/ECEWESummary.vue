<template>
  <v-form ref="eceweSummaryForm" v-model="isValidForm">
    <v-expansion-panel-title>
      <SummaryExpansionPanelTitle
        title="Early Childhood Educator-Wage Enhancement (ECE-WE)"
        :loading="isApplicationProcessing"
        :is-complete="isValidForm && !showCSSEAWarning"
      />
    </v-expansion-panel-title>
    <v-expansion-panel-text eager>
      <v-skeleton-loader :loading="isApplicationProcessing" type="table-tbody">
        <v-container fluid class="pa-0">
          <!-- ECE-WE FACILITY -->
          <v-row v-if="isEceweFacilitySummary" no-gutters>
            <v-col cols="12" md="6">
              <span class="summary-label pt-3">Facility Opt-In/Opt-Out for ECE-WE:</span>
              <v-text-field
                placeholder="Required"
                :model-value="optInOptOut"
                class="summary-value"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
              />
            </v-col>
            <v-col v-if="eceweFacility?.optInOrOut === OPT_STATUSES.OPT_IN && showUnionQuestion" cols="12" md="6">
              <span class="summary-label pt-3">Union Status:</span>
              <v-text-field
                placeholder="Required"
                :model-value="facilityUnionStatus"
                class="summary-value"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
              />
            </v-col>
          </v-row>

          <!-- ECE-WE ORGANIZATION -->
          <template v-else>
            <span class="summary-label pt-2">
              For the {{ formattedProgramYear }} funding term, would you like to opt-in to ECE-WE for any facility in
              your organization
            </span>
            <v-text-field
              placeholder="Required"
              :model-value="getYesNoValue(ecewe?.optInECEWE)"
              class="summary-value"
              density="compact"
              flat
              variant="solo"
              hide-details
              readonly
              :rules="rules.required"
            />
            <template
              v-if="
                organizationProviderType === ORGANIZATION_PROVIDER_TYPES.GROUP &&
                ecewe?.optInECEWE === OPT_STATUSES.OPT_IN
              "
            >
              <span class="summary-label pt-3">
                Are you a public sector employer, as defined in the Public Sector Employers Act?
              </span>
              <span v-if="showCSSEAWarning" class="ml-5 text-error">
                <u>Invalid Response</u>
              </span>
              <v-text-field
                placeholder="Required"
                :model-value="getYesNoValue(ecewe?.publicSector)"
                class="summary-value"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
              />

              <span class="summary-label pt-3"> Which of the following describes your organization? </span>
              <p v-if="describeCSSEA" class="py-2">
                {{ describeCSSEA }}
              </p>
              <v-text-field
                v-else
                placeholder="Required"
                :model-value="describeCSSEA"
                class="summary-value"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
              />

              <template v-if="ecewe?.describeOrgCSSEA === ECEWE_DESCRIBE_ORG_TYPES.MEMBER_OF_CSSEA">
                <span class="summary-label pt-3">
                  I confirm our organization/facilities has reached a local agreement with the union to amend the
                  collective agreement(s) in order to implement the ECE-WE.
                </span>
                <v-text-field
                  placeholder="Required"
                  :model-value="getYesNoValue(ecewe?.isUnionAgreementReached)"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                />
              </template>

              <template v-else>
                <span class="summary-label pt-3">Please select a response</span>
                <v-text-field
                  placeholder="Required"
                  :model-value="sectorValue"
                  class="summary-value"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  readonly
                  :rules="rules.required"
                />

                <template v-if="ecewe?.applicableSector === ECEWE_SECTOR_TYPES.SOME_FACILITIES_UNIONIZED">
                  <span class="summary-label pt-3">
                    I confirm our organization/facilities has reached a local agreement with the union to amend the
                    collective agreement(s) in order to implement the ECE-WE.
                  </span>
                  <v-text-field
                    placeholder="Required"
                    :model-value="getYesNoValue(ecewe?.isUnionAgreementReached)"
                    class="summary-value"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    readonly
                    :rules="rules.required"
                  />
                </template>
              </template>
            </template>
          </template>
          <router-link v-if="!isValidForm || showCSSEAWarning" :to="routingPath">
            <u class="text-error">To add this information, click here. This will bring you to a different page.</u>
          </router-link>
        </v-container>
      </v-skeleton-loader>
    </v-expansion-panel-text>
  </v-form>
</template>
<script>
import { mapState } from 'pinia';
import summaryMixin from '@/mixins/summaryMixin.js';
import ApplicationService from '@/services/applicationService';
import { useApplicationStore } from '@/store/application.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { isChangeRequest } from '@/utils/common.js';
import {
  ECEWE_DESCRIBE_ORG_TYPES,
  ECEWE_FACILITY_UNION_TYPES,
  ECEWE_SECTOR_TYPES,
  changeUrl,
  pcfUrl,
} from '@/utils/constants.js';

export default {
  mixins: [summaryMixin],
  props: {
    ecewe: {
      type: Object,
      default: () => ({}),
    },
    eceweFacility: {
      type: Object,
      default: () => ({}),
    },
    programYearId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isChangeRequest: isChangeRequest(this),
      isValidForm: false,
    };
  },
  computed: {
    ...mapState(useApplicationStore, ['formattedProgramYear']),
    ...mapState(useOrganizationStore, ['organizationProviderType']),
    showUnionQuestion() {
      return ApplicationService.showEceweFacilityUnionQuestion(this.ecewe, this.getLanguageYearLabel);
    },
    isEceweFacilitySummary() {
      return !!this.eceweFacility;
    },
    sectorValue() {
      switch (this.ecewe?.applicableSector) {
        case ECEWE_SECTOR_TYPES.CSSEA:
          return "Community Social Services Employers' Association (CSSEA) Member";
        case ECEWE_SECTOR_TYPES.OTHER_UNION:
          return 'Other Unionized Employee';
        case ECEWE_SECTOR_TYPES.NO_FACILITIES_UNIONIZED:
          return 'None of our facilities are unionized.';
        case ECEWE_SECTOR_TYPES.SOME_FACILITIES_UNIONIZED:
          return 'Some or all of our facilities are unionized.';
        default:
          return null;
      }
    },
    routingPath() {
      if (this.isChangeRequest) {
        return this.isEceweFacilitySummary
          ? changeUrl(this.PATHS.ECEWE_FACILITITES, this.$route.params?.changeRecGuid)
          : changeUrl(this.PATHS.ECEWE_ELIGIBILITY, this.$route.params?.changeRecGuid);
      }
      return this.isEceweFacilitySummary
        ? pcfUrl(this.PATHS.ECEWE_FACILITITES, this.programYearId)
        : pcfUrl(this.PATHS.ECEWE_ELIGIBILITY, this.programYearId);
    },
    optInOptOut() {
      return this.getOptInOptOut(this.eceweFacility?.optInOrOut);
    },
    facilityUnionStatus() {
      switch (this.eceweFacility?.facilityUnionStatus) {
        case ECEWE_FACILITY_UNION_TYPES.UNIONIZED:
          return 'Unionized';
        case ECEWE_FACILITY_UNION_TYPES.NON_UNIONIZED:
          return 'Non-Unionized';
        default:
          return null;
      }
    },
    describeCSSEA() {
      switch (this.ecewe?.describeOrgCSSEA) {
        case ECEWE_DESCRIBE_ORG_TYPES.NOT_A_MEMBER_OF_CSSEA:
          return "We are not a member of the Community Social Services Employers' Association (CSSEA).";
        case ECEWE_DESCRIBE_ORG_TYPES.MEMBER_OF_CSSEA:
          return "We are a member of the Community Social Services Employers' Association (CSSEA).";
        default:
          return null;
      }
    },
    showCSSEAWarning() {
      return !this.isEceweFacilitySummary && ApplicationService.showCSSEAWarning(this.ecewe);
    },
  },
  created() {
    this.ECEWE_DESCRIBE_ORG_TYPES = ECEWE_DESCRIBE_ORG_TYPES;
    this.ECEWE_SECTOR_TYPES = ECEWE_SECTOR_TYPES;
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
