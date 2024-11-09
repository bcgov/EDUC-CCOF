<template>
  <v-form ref="eceweSummaryForm" v-model="isValidForm">
    <v-expansion-panel-title>
      <h4 style="color: #003466">
        Early Childhood Educator-Wage Enhancement (ECE-WE)
        <v-icon v-if="isValidForm && !isProcessing" color="green" size="large"> mdi-check-circle-outline </v-icon>
        <v-icon v-if="!isValidForm && !isProcessing" color="#ff5252" size="large"> mdi-alert-circle-outline </v-icon>
        <span v-if="!isValidForm && !isProcessing" style="color: #ff5252"
          >Your form is missing required information. Click here to view.</span
        >
      </h4>
    </v-expansion-panel-title>
    <v-expansion-panel-text eager>
      <v-skeleton-loader :loading="!isLoadingComplete" type="table-tbody">
        <v-container fluid class="pa-0">
          <div>
            <v-row v-if="facilityInformationExists()" no-gutters>
              <v-col cols="12">
                <span class="summary-label pt-3">Facility Opt-In/Opt-Out for ECE-WE:</span>
                <v-text-field
                  placeholder="Required"
                  :model-value="getOptInOptOut()"
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
            <v-row v-if="!facilityInformationExists()" no-gutters>
              <v-col cols="12">
                <span class="summary-label pt-2">
                  For the {{ formattedProgramYear }} funding term, would you like to opt-in to ECE-WE for any facility
                  in your organization
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
              </v-col>
            </v-row>
            <div v-if="organizationProviderType === ORGANIZATION_PROVIDER_TYPES.GROUP">
              <v-row v-if="ecewe?.optInECEWE == 1" no-gutters>
                <v-col cols="12">
                  <span class="summary-label pt-3">
                    Do any of the ECE employees at any facility in your organization belong to a union
                  </span>
                  <v-text-field
                    placeholder="Required"
                    :model-value="getYesNoValue(ecewe?.belongsToUnion)"
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
              <v-row v-if="!facilityInformationExists()" no-gutters>
                <v-col v-if="languageYearLabel != programYearTypes.HISTORICAL && ecewe?.optInECEWE == 1" cols="12">
                  <span class="summary-label pt-3">
                    Are you a public sector employer, as defined in the Public Sector Employers Act?
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
                </v-col>
                <v-col v-if="showApplicableSector" cols="12">
                  <v-row no-gutters>
                    <v-col cols="12">
                      <span class="summary-label pt-3">Applicable Sector:</span>
                      <v-textarea
                        placeholder="Required"
                        :model-value="getSectorValue(ecewe?.applicableSector)"
                        class="summary-value"
                        density="compact"
                        flat
                        variant="solo"
                        hide-details
                        readonly
                        no-resize
                        rows="2"
                        :rules="rules.required"
                      />
                    </v-col>
                  </v-row>
                </v-col>
                <v-col v-if="showFundingModel" cols="12">
                  <v-row no-gutters>
                    <v-col cols="12">
                      <span class="summary-label pt-3">Funding model:</span>
                      <v-textarea
                        placeholder="Required"
                        :model-value="getFundingModel(ecewe?.fundingModel)"
                        class="summary-value"
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
                  <v-row v-if="showJJEP" no-gutters>
                    <v-col cols="12">
                      <span class="summary-label pt-3">
                        I confirm that my organization/facilities pay the Joint Job Evaluation Plan (JJEP) wage rates
                        or, if a lesser amount, a side agreement is being concluded to implement the ECE Wage
                        Enhancement.
                      </span>
                      <v-text-field
                        placeholder="Required"
                        :model-value="getYesNoValue(ecewe?.confirmation)"
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
                </v-col>
                <v-col v-else-if="showWageConfirmation" cols="12">
                  <v-row no-gutters>
                    <v-col cols="12">
                      <span class="summary-label pt-3">
                        I confirm our organization/facilities has reached an agreement with the union to amend the
                        collective agreement(s) in order to implement the ECE Wage Enhancement.
                      </span>
                      <v-text-field
                        placeholder="Required"
                        :model-value="getYesNoValue(ecewe?.confirmation)"
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
                </v-col>
              </v-row>
            </div>
          </div>
          <div v-if="!isValidForm">
            <router-link :to="getRoutingPath()">
              <span style="color: red">
                <u>To add this information, click here. This will bring you to a different page.</u>
              </span>
            </router-link>
          </div>
        </v-container>
      </v-skeleton-loader>
    </v-expansion-panel-text>
  </v-form>
</template>
<script>
import { mapState } from 'pinia';
import { useApplicationStore } from '@/store/application.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';
import { useSummaryDeclarationStore } from '@/store/summaryDeclaration.js';
import { useAppStore } from '@/store/app.js';

import { isChangeRequest } from '@/utils/common.js';
import {
  PATHS,
  pcfUrl,
  changeUrl,
  PROGRAM_YEAR_LANGUAGE_TYPES,
  ORGANIZATION_PROVIDER_TYPES,
} from '@/utils/constants.js';
import rules from '@/utils/rules.js';

export default {
  props: {
    ecewe: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    eceweFacility: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    isProcessing: {
      type: Boolean,
      required: false,
      default: false,
    },
    changeRecGuid: {
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
      isChangeRequest: isChangeRequest(this),
      PATHS,
      rules,
      isValidForm: true,
      formObj: {
        formName: 'ECEWESummary',
      },
    };
  },
  computed: {
    ...mapState(useApplicationStore, ['formattedProgramYear']),
    ...mapState(useSummaryDeclarationStore, ['isLoadingComplete']),
    ...mapState(useOrganizationStore, ['organizationProviderType']),
    ...mapState(useAppStore, ['fundingModelTypeList', 'getFundingUrl', 'getLanguageYearLabel']),
    languageYearLabel() {
      return this.getLanguageYearLabel;
    },
    programYearTypes() {
      return PROGRAM_YEAR_LANGUAGE_TYPES;
    },
    showApplicableSector() {
      return (
        (this.ecewe?.belongsToUnion == 1 &&
          this.ecewe?.optInECEWE == 1 &&
          this.ecewe?.publicSector == 1 &&
          this.languageYearLabel != this.programYearTypes.HISTORICAL) ||
        (this.ecewe?.belongsToUnion == 1 &&
          this.ecewe?.optInECEWE == 1 &&
          this.languageYearLabel == this.programYearTypes.HISTORICAL)
      );
    },
    showFundingModel() {
      return (
        this.ecewe?.optInECEWE == 1 && this.ecewe?.belongsToUnion == 1 && this.ecewe?.applicableSector == 100000000
      );
    },
    showJJEP() {
      return (
        this.ecewe?.fundingModel === this.fundingModelTypeList[1].id ||
        this.ecewe?.fundingModel === this.fundingModelTypeList[2].id
      );
    },
    showWageConfirmation() {
      return (
        this.ecewe?.optInECEWE == 1 && this.ecewe?.belongsToUnion == 1 && this.ecewe?.applicableSector == 100000001
      );
    },
  },
  watch: {
    isValidForm: {
      handler() {
        if (!this.isProcessing && this.isLoadingComplete && !this.facilityInformationExists()) {
          this.$emit('isSummaryValid', this.formObj, this.isValidForm);
        }
      },
    },
  },
  created() {
    this.ORGANIZATION_PROVIDER_TYPES = ORGANIZATION_PROVIDER_TYPES;
  },
  methods: {
    getYesNoValue(value) {
      if (value === 1) {
        return 'Yes';
      } else if (value === 0) {
        return 'No';
      } else {
        return null;
      }
    },
    getSectorValue(value) {
      if (value === 100000001) {
        return 'Other Unionized Employee';
      } else if (value === 100000000) {
        return "Community Social Services Employers' Association (CSSEA) Member";
      } else {
        return null;
      }
    },
    getFundingModel(value) {
      if (value === 100000000) {
        return 'All of our facilities have provincially funded ECEs and receive Low-Wage Redress Funding';
      } else if (value === 100000001) {
        return 'All of our facilities have only non-provincially funded ECEs and do not receive Low-Wage Redress Funding';
      } else if (value === 100000002) {
        return 'Some of our facilities have both non-provincially funded ECEs that do not receive Low-Wage Redress Funding AND provincially funded ECEs receiving Low-Wage Redress Funding';
      } else {
        return null;
      }
    },
    facilityInformationExists() {
      return !!this.eceweFacility;
    },
    getRoutingPath() {
      if (this.isChangeRequest) {
        if (!this.eceweFacility) {
          return changeUrl(PATHS.ECEWE_ELIGIBILITY, this.$route.params?.changeRecGuid);
        }
        return changeUrl(PATHS.ECEWE_FACILITITES, this.$route.params?.changeRecGuid);
      } else {
        if (!this.eceweFacility) {
          return pcfUrl(PATHS.ECEWE_ELIGIBILITY, this.programYearId);
        }
        return pcfUrl(PATHS.ECEWE_FACILITITES, this.programYearId);
      }
    },
    getOptInOptOut() {
      if (this.eceweFacility?.optInOrOut === 1) {
        return 'Opt-In';
      } else if (this.eceweFacility?.optInOrOut === 0) {
        return 'Opt-Out';
      } else {
        return '';
      }
    },
  },
};
</script>
<style scoped>
.summary-label {
  color: grey;
  font-size: small;
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
:deep(::placeholder) {
  color: red !important;
  opacity: 1 !important;
}
</style>
