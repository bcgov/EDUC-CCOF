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

    <template
      v-if="organizationProviderType === ORGANIZATION_PROVIDER_TYPES.GROUP && model.optInECEWE === OPT_STATUSES.OPT_IN"
    >
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

        <template v-if="model.describeOrgCSSEA === ECEWE_DESCRIBE_ORG_TYPES.MEMBER_OF_CSSEA">
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

        <template v-else-if="model.describeOrgCSSEA === ECEWE_DESCRIBE_ORG_TYPES.NOT_A_MEMBER_OF_CSSEA">
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
              :true-value="ECEWE_UNION_AGREEMENT_REACHED"
              :false-value="null"
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
    </template>
  </v-container>
</template>

<script>
import { mapState } from 'pinia';
import AppAlertBanner from '@/components/guiComponents/AppAlertBanner.vue';
import ApplicationService from '@/services/applicationService';
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
      model: {},
    };
  },
  computed: {
    ...mapState(useApplicationStore, ['formattedProgramYear']),
    ...mapState(useEceweAppStore, ['optinECEWEChangeRequestReadonly', 'belongsToUnionChangeRequestReadonly']),
    ...mapState(useNavBarStore, ['isChangeRequest']),
    ...mapState(useOrganizationStore, ['organizationProviderType']),
    ...mapState(useReportChangesStore, ['isEceweUnlocked', 'changeRequestStatus']),
    showCSSEAWarning() {
      return ApplicationService.showCSSEAWarning(this.model);
    },
  },
  created() {
    this.rules = rules;
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
