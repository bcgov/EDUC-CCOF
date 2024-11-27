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
          {{ ecewe }}
          {{ describeCSSEA }}
          <div>
            <v-row v-if="facilityInformationExists" no-gutters>
              <v-col cols="12">
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
            </v-row>
            <v-row v-if="!facilityInformationExists" no-gutters>
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
              <template
                v-if="
                  languageYearLabel === programYearTypes.FY2025_26 && ecewe?.optInECEWE === ECEWE_OPT_IN_TYPES.OPT_IN
                "
              >
                <v-row v-if="!facilityInformationExists" no-gutters>
                  <v-col cols="12">
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
                  <v-col cols="12">
                    <span class="summary-label pt-3"> Which of the following describes your organziation? </span>
                    <v-text-field
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
                  </v-col>
                </v-row>
              </template>

              <!-- previous year's ECE-WE question logic below -->
              <template v-else>
                <v-row v-if="ecewe?.optInECEWE === 1" no-gutters>
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
                <v-row v-if="!facilityInformationExists" no-gutters>
                  <v-col v-if="languageYearLabel !== programYearTypes.HISTORICAL && ecewe?.optInECEWE === 1" cols="12">
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
                          :model-value="sectorValue"
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
                          :model-value="fundingModel"
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
              </template>
            </div>
          </div>
          <div v-if="!isValidForm">
            <router-link :to="routingPath">
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
  ECEWE_SECTOR_TYPES,
  ECEWE_OPT_IN_TYPES,
  ECEWE_DESCRIBE_ORG_TYPES,
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
        (this.ecewe?.belongsToUnion === 1 &&
          this.ecewe?.optInECEWE === 1 &&
          this.ecewe?.publicSector === 1 &&
          this.languageYearLabel !== this.programYearTypes.HISTORICAL) ||
        (this.ecewe?.belongsToUnion === 1 &&
          this.ecewe?.optInECEWE === 1 &&
          this.languageYearLabel === this.programYearTypes.HISTORICAL)
      );
    },
    showFundingModel() {
      return (
        this.ecewe?.optInECEWE === 1 &&
        this.ecewe?.belongsToUnion === 1 &&
        this.ecewe?.applicableSector === ECEWE_SECTOR_TYPES.CSSEA
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
        this.ecewe?.optInECEWE === 1 &&
        this.ecewe?.belongsToUnion === 1 &&
        this.ecewe?.applicableSector === ECEWE_SECTOR_TYPES.OTHER_UNION
      );
    },
    facilityInformationExists() {
      return !!this.eceweFacility;
    },
    sectorValue() {
      if (this.ecewe?.applicableSector === ECEWE_SECTOR_TYPES.OTHER_UNION) {
        return 'Other Unionized Employee';
      } else if (this.ecewe?.applicableSector === ECEWE_SECTOR_TYPES.CSSEA) {
        return "Community Social Services Employers' Association (CSSEA) Member";
      } else {
        return null;
      }
    },
    routingPath() {
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
    optInOptOut() {
      switch (this.eceweFacility?.optInOrOut) {
        case 0:
          return 'Opt-Out';
        case 1:
          return 'Opt-In';
        default:
          return '';
      }
    },
    fundingModel() {
      switch (this.ecewe?.fundingModel) {
        case 100000000:
          return 'All of our facilities have provincially funded ECEs and receive Low-Wage Redress Funding';
        case 100000001:
          return 'All of our facilities have only non-provincially funded ECEs and do not receive Low-Wage Redress Funding';
        case 100000002:
          return 'Some of our facilities have both non-provincially funded ECEs that do not receive Low-Wage Redress Funding AND provincially funded ECEs receiving Low-Wage Redress Funding';
        default:
          return null;
      }
    },
    describeCSSEA() {
      switch (this.ecewe?.describeOrgCSSEA) {
        case ECEWE_DESCRIBE_ORG_TYPES.NOT_A_MEMBER_OF_CSSEA:
          return "We are not a member of the Community Social Services Employers' Association (CSSEA).";
        case ECEWE_DESCRIBE_ORG_TYPES.MEMBER_OF_CSSEA:
          return "We are a member of the Community Social Services Employers' Association (CSSEA)";
        default:
          return null;
      }
    },
  },
  watch: {
    isValidForm: {
      handler() {
        if (!this.isProcessing && this.isLoadingComplete && !this.facilityInformationExists) {
          this.$emit('isSummaryValid', this.formObj, this.isValidForm);
        }
      },
    },
  },
  created() {
    this.ORGANIZATION_PROVIDER_TYPES = ORGANIZATION_PROVIDER_TYPES;
    this.ECEWE_OPT_IN_TYPES = ECEWE_OPT_IN_TYPES;
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
