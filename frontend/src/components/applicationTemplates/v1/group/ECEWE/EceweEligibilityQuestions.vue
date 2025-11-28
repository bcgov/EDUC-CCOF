<template>
  <v-container v-if="!isLoading" fluid class="pa-0">
    <v-card elevation="4" class="px-4 px-lg-8 py-4 my-10 rounded-lg">
      <p class="pa-2">
        For the {{ formattedProgramYear }} funding term, would you like to opt-in to ECE-WE for any facility in your
        organization?
      </p>
      <v-radio-group v-model="model.optInECEWE" :disabled="isQuestionReadOnly('optInECEWE')" :rules="rules.required">
        <v-radio label="Yes" :value="OPT_STATUSES.OPT_IN" />
        <v-radio label="No" :value="OPT_STATUSES.OPT_OUT" />
      </v-radio-group>
    </v-card>

    <template v-if="organizationProviderType === ORGANIZATION_PROVIDER_TYPES.GROUP">
      <!-- ccfri 3819 new order and re-wording of all ece-we questions -->
      <template v-if="languageYearLabel === programYearTypes.FY2025_26 && model.optInECEWE === OPT_STATUSES.OPT_IN">
        <v-card elevation="4" class="px-4 px-lg-8 py-4 my-10 rounded-lg">
          <p class="pa-2">Are you a public sector employer, as defined in the Public Sector Employers Act?</p>
          <v-radio-group v-model="model.publicSector" :disabled="isReadOnly" :rules="rules.required">
            <v-radio label="Yes" :value="ECEWE_IS_PUBLIC_SECTOR_EMPLOYER.YES" />
            <v-radio label="No" :value="ECEWE_IS_PUBLIC_SECTOR_EMPLOYER.NO" />
          </v-radio-group>
        </v-card>

        <v-card elevation="4" class="px-4 px-lg-8 py-4 my-10 rounded-lg">
          <div>
            <p class="pa-2">Which of the following describes your organization?</p>
            <v-radio-group v-model="model.describeOrgCSSEA" :disabled="isReadOnly" :rules="rules.required">
              <v-radio
                label="We are not a member of the Community Social Services Employers' Association (CSSEA)."
                :value="ECEWE_DESCRIBE_ORG_TYPES.NOT_A_MEMBER_OF_CSSEA"
                @click="
                  model.isUnionAgreementReached = null;
                  model.applicableSector = null;
                "
              />
              <v-radio
                label="We are a member of the Community Social Services Employers' Association (CSSEA)."
                :value="ECEWE_DESCRIBE_ORG_TYPES.MEMBER_OF_CSSEA"
                @click="
                  model.isUnionAgreementReached = null;
                  model.applicableSector = null;
                "
              />
            </v-radio-group>
          </div>
          <template v-if="model.describeOrgCSSEA === ECEWE_DESCRIBE_ORG_TYPES.NOT_A_MEMBER_OF_CSSEA">
            <p class="pa-2">Please select a response</p>
            <v-radio-group v-model="model.applicableSector" :disabled="isReadOnly" :rules="rules.required">
              <v-radio
                label="None of our facilities are unionized."
                :value="ECEWE_SECTOR_TYPES.NO_FACILITIES_UNIONIZED"
                @click="model.isUnionAgreementReached = null"
              />
              <v-radio
                label="Some or all of our facilities are unionized."
                :value="ECEWE_SECTOR_TYPES.SOME_FACILITIES_UNIONIZED"
                @click="model.isUnionAgreementReached = null"
              />
            </v-radio-group>
            <template v-if="model.applicableSector === ECEWE_SECTOR_TYPES.SOME_FACILITIES_UNIONIZED">
              <AppAlertBanner type="info">Please Confirm</AppAlertBanner>
              <v-checkbox
                v-model="model.isUnionAgreementReached"
                :value="ECEWE_UNION_AGREEMENT_REACHED"
                label="I confirm our organization/facilities has reached a local agreement with the union to amend the collective agreement(s) in order to implement the ECE-WE."
                :disabled="isReadOnly"
                :rules="rules.required"
              />
            </template>
          </template>
          <AppAlertBanner v-if="showCSSEAWarning" type="error" class="ma-2 mb-4">
            If you are a member of the Community Social Services Employers' Association (CSSEA), you are a public sector
            employer. Please update your response to the previous question.
          </AppAlertBanner>
        </v-card>

        <v-card
          v-if="model.describeOrgCSSEA === ECEWE_DESCRIBE_ORG_TYPES.MEMBER_OF_CSSEA"
          elevation="4"
          class="px-4 px-lg-8 py-4 my-10 rounded-lg"
        >
          <p class="pa-2">Select your funding model:</p>
          <v-radio-group v-model="model.fundingModel" :disabled="isReadOnly" :rules="rules.required">
            <v-radio :label="fundingModelTypeList[0].description" :value="fundingModelTypeList[0].id" />
            <v-radio :label="fundingModelTypeList[1].description" :value="fundingModelTypeList[1].id" />
            <v-radio :label="fundingModelTypeList[3].description" :value="fundingModelTypeList[3].id" />
          </v-radio-group>
          <template v-if="model.fundingModel">
            <AppAlertBanner type="info">Please Confirm</AppAlertBanner>
            <v-checkbox
              v-model="model.isUnionAgreementReached"
              :true-value="ECEWE_UNION_AGREEMENT_REACHED"
              :false-value="null"
              label="I confirm our organization/facilities has reached a local agreement with the union to amend the collective agreement(s) in order to implement the ECE-WE."
              :disabled="isReadOnly"
              :rules="rules.required"
            />
          </template>
        </v-card>
      </template>

      <!-- previous year's ECE-WE question logic below -->
      <template v-else>
        <v-card v-if="model.optInECEWE === OPT_STATUSES.OPT_IN" elevation="4" class="py-2 px-5 my-10 rounded-lg">
          <v-container>
            <v-row class="justify-center">
              <v-col align-self="start">
                <v-radio-group
                  v-model="model.belongsToUnion"
                  :disabled="isQuestionReadOnly('belongsToUnion')"
                  :rules="rules.required"
                >
                  <template #label>
                    <span class="radio-label"
                      >Do any of the ECE Employees at any facility in your organization belong to a union?</span
                    >
                  </template>
                  <div class="flex-left">
                    <v-radio class="pt-2 pr-8" label="Yes" :value="1" />
                    <v-radio class="pt-1" label="No" :value="0" @click="model.applicableSector = null" />
                  </div>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-container>
        </v-card>

        <div v-if="languageYearLabel !== programYearTypes.HISTORICAL">
          <v-card v-if="model.optInECEWE === OPT_STATUSES.OPT_IN" elevation="4" class="py-2 px-5 my-10 rounded-lg">
            <v-container>
              <v-row class="justify-left">
                <v-col align-self="start">
                  <v-radio-group v-model="model.publicSector" :disabled="isReadOnly" :rules="rules.required">
                    <template #label>
                      <div class="radio-label text-left">
                        Are you a public sector employer, as defined in the
                        <u><i>Public Sector Employers Act?</i></u>
                      </div>
                    </template>
                    <div class="flex-left">
                      <v-radio class="pt-2 pr-8" label="Yes" :value="ECEWE_IS_PUBLIC_SECTOR_EMPLOYER.YES" />
                      <v-radio
                        class="pt-1"
                        label="No"
                        :value="ECEWE_IS_PUBLIC_SECTOR_EMPLOYER.NO"
                        @click="model.applicableSector = null"
                      />
                    </div>
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </div>

        <div v-if="showApplicableSectorQuestion">
          <v-card elevation="4" class="py-2 px-5 my-10 rounded-lg">
            <v-container>
              <v-row class="justify-left">
                <v-col align-self="start">
                  <v-radio-group v-model="model.applicableSector" :disabled="isReadOnly" :rules="rules.required">
                    <template #label>
                      <div class="radio-label text-left">Select the applicable sector:</div>
                    </template>
                    <div class="flex-left">
                      <v-radio
                        class="pt-2 pr-8"
                        label="Community Social Services Employers' Association (CSSEA) Member"
                        :value="ECEWE_SECTOR_TYPES.CSSEA"
                        @click="model.confirmation = null"
                      />
                      <v-radio
                        class="pt-1"
                        label="Other Unionized Employer"
                        :value="ECEWE_SECTOR_TYPES.OTHER_UNION"
                        @click="model.confirmation = null"
                      />
                    </div>
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-container>
            <v-card v-if="showConfirmationQuestion" class="mx-2 mb-4 justify-center">
              <v-row class="justify-left">
                <AppAlertBanner type="info" class="ma-2 mb-4 w-100">Please Confirm</AppAlertBanner>
              </v-row>
              <v-row>
                <v-col class="pl-6 d-flex py-0">
                  <v-checkbox
                    v-model="model.confirmation"
                    class="pa-0"
                    :value="1"
                    label="I confirm our organization/facilities has reached an agreement with the union to amend the collective agreement(s) in order to implement the ECE Wage Enhancement."
                    :disabled="isReadOnly"
                    :rules="rules.required"
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-card>
        </div>

        <div v-if="showFundingModelQuestion">
          <v-card elevation="4" class="py-2 px-5 my-10 rounded-lg">
            <v-container>
              <v-row>
                <v-col align-self="start">
                  <v-radio-group v-model="model.fundingModel" :disabled="isReadOnly" :rules="rules.required">
                    <template #label>
                      <div class="radio-label text-left">Select your funding model:</div>
                    </template>
                    <div class="flex-left">
                      <v-radio
                        :label="fundingModelTypeList[0].description"
                        :value="fundingModelTypeList[0].id"
                        class="pt-2 pr-8"
                      />
                      <v-radio
                        :label="fundingModelTypeList[1].description"
                        :value="fundingModelTypeList[1].id"
                        class="pt-1 pr-8"
                      />
                      <v-radio
                        :label="fundingModelTypeList[2].description"
                        :value="fundingModelTypeList[2].id"
                        class="pt-1 pr-8"
                      />
                    </div>
                  </v-radio-group>
                </v-col>
              </v-row>
              <v-card v-if="model.fundingModel === fundingModelTypeList[0].id" width="100%">
                <v-row>
                  <v-col class="py-0">
                    <v-card-title class="py-0 noticeAlert">
                      <span style="float: left">
                        <v-icon size="x-large" class="py-1 px-3 noticeAlertIcon"> mdi-alert-octagon </v-icon>
                      </span>
                      ECEs at these facilities are not eligible for ECE Wage Enhancement
                    </v-card-title>
                  </v-col>
                </v-row>
                <v-row class="pa-2 justify-center">
                  Government's Low-Wage Redress Funding supports ECE wage adjustments
                </v-row>
              </v-card>
              <div v-else-if="model.fundingModel === fundingModelTypeList[1].id">
                <v-card width="100%" class="mb-4">
                  <v-row>
                    <v-col class="py-0">
                      <v-card-title class="py-0 noticeWarning">
                        <span style="float: left">
                          <v-icon size="x-large" class="py-1 px-3 noticeWarningIcon"> mdi-alert </v-icon>
                        </span>
                        ECEs in provincially funded programs are not eligible
                      </v-card-title>
                    </v-col>
                  </v-row>
                  <v-row class="pa-2 justify-center">
                    Only ECEs in non-provincially funded programs are eligible for ECE Wage Enhancement.
                  </v-row>
                </v-card>
              </div>
              <v-card v-if="showJJEPQuestion" width="100%">
                <v-row class="justify-left">
                  <AppAlertBanner type="info" class="ma-2 mb-4 w-100">Please Confirm</AppAlertBanner>
                </v-row>
                <v-row>
                  <v-col class="pl-6 d-flex py-0">
                    <v-checkbox
                      v-model="model.confirmation"
                      class="pa-0"
                      :value="1"
                      label="I confirm that my organization/facilities pay the Joint Job Evaluation Plan (JJEP) wage rates or, if a lesser amount, a side agreement is being concluded to implement the ECE Wage Enhancement."
                      :disabled="isReadOnly"
                      :rules="rules.required"
                    />
                  </v-col>
                </v-row>
              </v-card>
            </v-container>
          </v-card>
        </div>
      </template>
    </template>
  </v-container>
</template>

<script>
import { mapState } from 'pinia';
import AppAlertBanner from '@/components/guiComponents/AppAlertBanner.vue';
import ApplicationService from '@/services/applicationService';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useEceweAppStore } from '@/store/eceweApp.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useReportChangesStore } from '@/store/reportChanges.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';

import {
  ECEWE_DESCRIBE_ORG_TYPES,
  ECEWE_IS_PUBLIC_SECTOR_EMPLOYER,
  ECEWE_SECTOR_TYPES,
  ECEWE_UNION_AGREEMENT_REACHED,
  OPT_STATUSES,
  ORGANIZATION_PROVIDER_TYPES,
  PROGRAM_YEAR_LANGUAGE_TYPES,
} from '@/utils/constants.js';
import rules from '@/utils/rules.js';

export default {
  components: { AppAlertBanner },
  props: {
    isLoading: {
      type: Boolean,
      default: true,
      required: true,
    },
    isReadOnly: {
      type: Boolean,
      default: true,
      required: true,
    },
    eceweModel: {
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      rules,
      model: {},
    };
  },
  computed: {
    ...mapState(useEceweAppStore, ['optinECEWEChangeRequestReadonly', 'belongsToUnionChangeRequestReadonly']),
    ...mapState(useAppStore, ['fundingModelTypeList', 'getLanguageYearLabel']),
    ...mapState(useNavBarStore, ['changeRequestId', 'isChangeRequest']),
    ...mapState(useApplicationStore, ['formattedProgramYear', 'programYearId', 'applicationStatus', 'unlockEcewe']),
    ...mapState(useOrganizationStore, ['organizationProviderType']),
    ...mapState(useReportChangesStore, ['isEceweUnlocked', 'changeRequestStatus']),
    showCSSEAWarning() {
      //this is only for 2025-26
      return ApplicationService.showCSSEAWarning(this.model);
    },
    showApplicableSectorQuestion() {
      //This question is only valid from 2023-24 and before.
      //The template manages 2025 onward so it should only get called for historical applications
      return this.model.belongsToUnion === 1 && this.model.optInECEWE === OPT_STATUSES.OPT_IN;
    },
    showConfirmationQuestion() {
      //This question is only valid from 2023-24 and before.
      return (
        this.model.applicableSector === ECEWE_SECTOR_TYPES.OTHER_UNION &&
        this.model.belongsToUnion === 1 &&
        this.model.optInECEWE === OPT_STATUSES.OPT_IN
      );
    },
    showFundingModelQuestion() {
      return (
        this.model.applicableSector === ECEWE_SECTOR_TYPES.CSSEA &&
        this.model.belongsToUnion === 1 &&
        this.model.optInECEWE === OPT_STATUSES.OPT_IN
      );
    },
    showJJEPQuestion() {
      return (
        this.model.fundingModel === this.fundingModelTypeList[1].id ||
        this.model.fundingModel === this.fundingModelTypeList[2].id
      );
    },
    languageYearLabel() {
      return this.getLanguageYearLabel;
    },
    programYearTypes() {
      return PROGRAM_YEAR_LANGUAGE_TYPES;
    },
  },
  created() {
    this.ORGANIZATION_PROVIDER_TYPES = ORGANIZATION_PROVIDER_TYPES;
    this.OPT_STATUSES = OPT_STATUSES;
    this.ECEWE_SECTOR_TYPES = ECEWE_SECTOR_TYPES;
    this.ECEWE_DESCRIBE_ORG_TYPES = ECEWE_DESCRIBE_ORG_TYPES;
    this.ECEWE_IS_PUBLIC_SECTOR_EMPLOYER = ECEWE_IS_PUBLIC_SECTOR_EMPLOYER;
    this.ECEWE_UNION_AGREEMENT_REACHED = ECEWE_UNION_AGREEMENT_REACHED;
    this.model = { ...this.eceweModel };
  },

  methods: {
    getFormData() {
      return this.model;
    },

    //For change requests - if a facility has previously opted-in or said yes to having a union on their CORE application
    //they are not allowed to change that response, so question becomes read only.
    //if not a change request- default to the prop calculated by the parent.
    isQuestionReadOnly(question) {
      if (this.isChangeRequest) {
        if (this.isEceweUnlocked || !this.changeRequestStatus || this.changeRequestStatus === 'INCOMPLETE') {
          return (
            (question === 'optInECEWE' && this.optinECEWEChangeRequestReadonly) ||
            (question === 'belongsToUnion' && this.belongsToUnionChangeRequestReadonly)
          );
        } else if (this.changeRequestStatus !== 'INCOMPLETE') {
          return true;
        }
      }
      return this.isReadOnly;
    },
  },
};
</script>
