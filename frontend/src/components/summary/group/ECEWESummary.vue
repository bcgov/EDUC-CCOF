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
            <!-- This is facility level information. Because this component is rendered twice but with two models, this is slightly different.
            This information must be updated in backend/application getApplicationSummary -->
            <v-row v-if="facilityInformationExists" no-gutters>
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
              <v-col cols="12" md="6" v-if="eceweFacility?.optInOrOut === 1 && showUnionQuestion">
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
            <!-- These are the org level questions below. They differ based on program year. -->
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

                  <template v-if="ecewe?.describeOrgCSSEA === ECEWE_DESCRIBE_ORG_TYPES.NOT_A_MEMBER_OF_CSSEA">
                    <v-col cols="12">
                      <span class="summary-label pt-3"> Please Select </span>
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
                    </v-col>
                  </template>
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
                          :model-value="fundingModelLabel"
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
  ECEWE_DESCRIBE_ORG_TYPES,
  ECEWE_IS_PUBLIC_SECTOR_EMPLOYER,
  ECEWE_UNION_AGREEMENT_REACHED,
  ECEWE_OPT_IN_TYPES,
  ECEWE_FACILITY_UNION_TYPES,
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
    fundingModel: {
      type: Number,
      required: false,
      default: null,
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
    showUnionQuestion() {
      return this.fundingModel && this.getLanguageYearLabel === PROGRAM_YEAR_LANGUAGE_TYPES.FY2025_26;
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
      switch (this.ecewe?.applicableSector) {
        case ECEWE_SECTOR_TYPES.CSSEA:
          return "Community Social Services Employers' Association (CSSEA) Member";
        case ECEWE_SECTOR_TYPES.OTHER_UNION:
          return 'Other Unionized Employee';
        case ECEWE_SECTOR_TYPES.NO_FACILITIES_UNIONIZED:
          return 'None of our facilities are unionized';
        case ECEWE_SECTOR_TYPES.SOME_FACILITIES_UNIONIZED:
          return 'Some or all of our facilities are unionized';
        default:
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
    facilityUnionStatus() {
      console.log(this.eceweFacility);
      switch (this.eceweFacility?.facilityUnionStatus) {
        case ECEWE_FACILITY_UNION_TYPES.UNIONIZED:
          return 'Unionized';
        case ECEWE_FACILITY_UNION_TYPES.NON_UNIONIZED:
          return 'Non-Unionized';
        default:
          return null;
      }
    },
    fundingModelLabel() {
      switch (this.ecewe?.fundingModel) {
        case 100000000:
          return 'All of our facilities have provincially funded ECEs and receive Low-Wage Redress Funding';
        case 100000001:
          return 'All of our facilities have only non-provincially funded ECEs and do not receive Low-Wage Redress Funding';
        case 100000002 && this.languageYearLabel === this.programYearTypes.FY2025_26:
          return 'Our facilities have both provincially funded ECEs receiving Low -Wage Redress Funding and non -provincially funded ECEs that do not receive Low - Wage Redress Funding.';
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
          return "We are a member of the Community Social Services Employers' Association (CSSEA).";
        default:
          return null;
      }
    },
    // describeCSSEA() {
    //   switch (this.ecewe?.describeOrgCSSEA) {
    //     case ECEWE_DESCRIBE_ORG_TYPES.NOT_A_MEMBER_OF_CSSEA:
    //       return "We are not a member of the Community Social Services Employers' Association (CSSEA).";
    //     case ECEWE_DESCRIBE_ORG_TYPES.MEMBER_OF_CSSEA:
    //       return "We are a member of the Community Social Services Employers' Association (CSSEA)";
    //     default:
    //       return null;
    //   }
    // },
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
    this.ECEWE_DESCRIBE_ORG_TYPES = ECEWE_DESCRIBE_ORG_TYPES;
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
