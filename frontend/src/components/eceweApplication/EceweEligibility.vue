<template>
  <v-form ref="form" v-model="isValidForm">
    <v-container class="px-8 px-lg-12 pt-0">
      <ApplicationPCFHeader
        page-title="Early Childhood Educator Wage Enhancement (ECE-WE)"
        :program-year="formattedProgramYear"
        :organization-name="userInfo.organizationName"
      />
      <v-alert prominent variant="outlined" class="mt-8">
        <template #prepend>
          <v-icon color="primary" size="x-large">mdi-information</v-icon>
        </template>
        <strong>Note:</strong> Please read and understand the full eligibility requirements in the
        <a :href="eceweFundingUrl" target="_blank" class="text-decoration-underline"> ECE-WE Funding Guidelines</a>. All
        CCFRI-eligible facilities must opt-in to CCFRI <strong>to be eligible for ECE-WE.</strong>
      </v-alert>

      <v-skeleton-loader v-if="isLoading" :loading="isLoading" type="table-tbody" class="my-2"></v-skeleton-loader>
      <template v-else>
        <EceweEligibilityQuestionsV1
          v-if="showApplicationTemplateV1"
          ref="eligibilityQuestions"
          :ecewe-model="model"
          :is-loading="isLoading"
          :is-read-only="isReadOnly"
        />
        <EceweEligibilityQuestionsV2
          v-else
          ref="eligibilityQuestions"
          :ecewe-model="model"
          :is-loading="isLoading"
          :is-read-only="isReadOnly"
        />
      </template>
    </v-container>
  </v-form>
  <NavButton
    :is-next-displayed="true"
    :is-save-displayed="true"
    :is-save-disabled="isReadOnly"
    :is-next-disabled="!enableButtons"
    :is-processing="isProcessing"
    class="mt-12"
    @previous="previous"
    @next="next"
    @validate-form="validateForm()"
    @save="saveECEWEApplication"
  />
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { cloneDeep } from 'lodash';

import EceweEligibilityQuestionsV1 from '@/components/applicationTemplates/v1/group/ECEWE/EceweEligibilityQuestions.vue';
import EceweEligibilityQuestionsV2 from '@/components/applicationTemplates/v2/group/ECEWE/EceweEligibilityQuestions.vue';
import ApplicationPCFHeader from '@/components/util/ApplicationPCFHeader.vue';
import NavButton from '@/components/util/NavButton.vue';

import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useAuthStore } from '@/store/auth.js';
import { useEceweAppStore } from '@/store/eceweApp.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useReportChangesStore } from '@/store/reportChanges.js';
import { useOrganizationStore } from '@/store/ccof/organization.js';

import {
  PATHS,
  changeUrl,
  pcfUrl,
  ORGANIZATION_PROVIDER_TYPES,
  ECEWE_SECTOR_TYPES,
  OPT_STATUSES,
  PROGRAM_YEAR_LANGUAGE_TYPES,
  ECEWE_DESCRIBE_ORG_TYPES,
} from '@/utils/constants.js';
import alertMixin from '@/mixins/alertMixin.js';
import rules from '@/utils/rules.js';
import { isNullOrBlank } from '@/utils/common.js';

export default {
  components: { ApplicationPCFHeader, EceweEligibilityQuestionsV1, EceweEligibilityQuestionsV2, NavButton },
  mixins: [alertMixin],
  async beforeRouteLeave(_to, _from, next) {
    this.setIsStarted(true);
    await this.saveECEWEApplication(false);
    next();
  },
  data() {
    return {
      rules,
      model: {},
      isLoading: false, // flag to UI if screen is getting data or not.
      isProcessing: false, // flag to UI if screen is saving/processing data or not. We do not hide questions when saving, so we need this flag.
      isValidForm: false,
    };
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useEceweAppStore, ['isStarted', 'eceweModel']),
    ...mapState(useAppStore, ['fundingModelTypeList', 'getLanguageYearLabel', 'getEceweFundingUrl']),
    ...mapState(useNavBarStore, ['navBarList', 'changeRequestId', 'previousPath', 'isChangeRequest']),
    ...mapState(useApplicationStore, [
      'formattedProgramYear',
      'programYearId',
      'applicationStatus',
      'unlockEcewe',
      'applicationId',
      'showApplicationTemplateV1',
    ]),
    ...mapState(useOrganizationStore, ['organizationProviderType']),
    ...mapState(useReportChangesStore, ['loadedChangeRequest', 'isEceweUnlocked', 'changeRequestStatus']),
    eceweFundingUrl() {
      return this.getEceweFundingUrl(this.programYearId);
    },
    filteredECEWEFacilityList() {
      const eceweAppStore = useEceweAppStore();
      if (this.isChangeRequest) {
        return eceweAppStore.facilities?.filter((el) => el.changeRequestId === this.$route.params.changeRecGuid);
      } else {
        return eceweAppStore.facilities?.filter((el) => !el.changeRequestId);
      }
    },
    facilities: {
      get() {
        return this.filteredECEWEFacilityList;
      },
      set(value) {
        const eceweAppStore = useEceweAppStore();
        eceweAppStore.setFacilities(value);
      },
    },
    enableButtons() {
      //ccfri-3818 : messaging required to prevent moving forward when an invalid question choice selected.
      //checkbox status is managed by form validation
      return this.isValidForm && !this.$refs?.eligibilityQuestions?.showCSSEAWarning;
    },

    //isEceweUnlocked is for change requests - unlockEcewe is for the core application
    isReadOnly() {
      if (
        this.isEceweUnlocked ||
        this.unlockEcewe ||
        this.changeRequestStatus === 'INCOMPLETE' ||
        this.changeRequestStatus === 'ACTION_REQUIRED'
      ) {
        return false;
      } else if (this.applicationStatus === 'SUBMITTED') {
        return true;
      }
      return false;
    },
  },
  async mounted() {
    try {
      this.isLoading = true;
      this.setFundingModelTypes({ ...this.fundingModelTypeList });
      this.setApplicationId(this.applicationId);
      const response = await this.loadData();
      if (response) {
        this.setIsStarted(true);
        this.initECEWEFacilities(this.navBarList);
        const copyFacilities = cloneDeep(this.facilities);
        this.setLoadedFacilities(copyFacilities);
        this.model = { ...this.eceweModel };
        this.isLoading = false;
      }
    } catch (error) {
      console.log(error);
      this.isLoading = false;
    }
  },
  methods: {
    ...mapActions(useEceweAppStore, [
      'loadECEWE',
      'saveECEWE',
      'initECEWEFacilities',
      'saveECEWEFacilities',
      'loadECEWEModelFromChangeRequest',
      'setIsStarted',
      'setEceweModel',
      'setApplicationId',
      'setFundingModelTypes',
      'setLoadedFacilities',
    ]),
    ...mapActions(useApplicationStore, ['setIsEceweCompleteInMap', 'setIsEceweComplete']),
    ...mapActions(useReportChangesStore, ['setCRIsEceweComplete', 'getChangeRequest']),
    ...mapActions(useNavBarStore, ['forceNavBarRefresh']),

    previous() {
      this.$router.push(this.previousPath);
    },
    async next() {
      await this.saveECEWEApplication(false);
      if (this.isChangeRequest) {
        if (this.model.optInECEWE === OPT_STATUSES.OPT_OUT) {
          this.$router.push(changeUrl(PATHS.SUPPORTING_DOCS, this.$route.params.changeRecGuid));
        } else {
          this.$router.push(changeUrl(PATHS.ECEWE_FACILITITES, this.$route.params.changeRecGuid));
        }
      } else if (this.model.optInECEWE === OPT_STATUSES.OPT_OUT) {
        this.$router.push(pcfUrl(PATHS.SUPPORTING_DOCS, this.programYearId));
      } else {
        this.$router.push(pcfUrl(PATHS.ECEWE_FACILITITES, this.programYearId));
      }
    },

    validateForm() {
      this.$refs.form?.validate();
    },

    /* Clear values for unanswered questions, in case user changes selection after save */
    updateQuestions() {
      if (this.getLanguageYearLabel === PROGRAM_YEAR_LANGUAGE_TYPES.FY2025_26) {
        if (this.model.optInECEWE === OPT_STATUSES.OPT_OUT) {
          this.resetModel([
            'fundingModel',
            'confirmation',
            'publicSector',
            'applicableSector',
            'describeOrgCSSEA',
            'isUnionAgreementReached',
          ]);
        } else if (this.model.describeOrgCSSEA === ECEWE_DESCRIBE_ORG_TYPES.NOT_A_MEMBER_OF_CSSEA) {
          this.resetModel(['fundingModel']);
        } else if (this.model.describeOrgCSSEA === ECEWE_DESCRIBE_ORG_TYPES.MEMBER_OF_CSSEA) {
          this.resetModel(['applicableSector']);
        }
      } else {
        if (this.model.optInECEWE === OPT_STATUSES.OPT_OUT) {
          this.resetModel(['belongsToUnion', 'fundingModel', 'confirmation', 'publicSector']);
        } else if (!this.model.belongsToUnion) {
          this.resetModel(['fundingModel', 'confirmation']);
        } else if (this.model.applicableSector === ECEWE_SECTOR_TYPES.OTHER_UNION) {
          this.resetModel(['fundingModel']);
        } else if (
          this.model.applicableSector === ECEWE_SECTOR_TYPES.CSSEA &&
          this.model.fundingModel === this.fundingModelTypeList[0].id
        ) {
          this.resetModel(['confirmation']);
        }
      }
    },

    resetModel(fields) {
      fields.forEach((field) => {
        this.model[field] = null;
      });
    },
    /* NOTE: ece-we model and ece-we change request are TWO TOTALLY SEPERATE TABLES.
      If you happen to need to update the model with new questions - you have to update the integration in two places:
      backend / application.js - getECEWEApplication
      backend / changeRequest.js - getChangeActionNewFacilitityDetails

      you can find CR ECE WE data in CRM by going to the change request - and changing the dropdown from 'information' to 'admin'

      however- the facility level data is on the main application ECE-WE table- NOT on the change action.

      good luck :)
    */
    async loadData() {
      if (
        this.isStarted &&
        this.facilities?.length > 0 &&
        this.facilities[0].changeRequestId === this.$route.params.changeRecGuid
      ) {
        return true;
      }
      if (this.applicationId) {
        try {
          const response = await this.loadECEWE();
          if (this.isChangeRequest) {
            await this.getChangeRequest(this.$route.params.changeRecGuid);
            if (this.loadedChangeRequest && !isNullOrBlank(this.loadedChangeRequest.optInECEWE)) {
              await this.loadECEWEModelFromChangeRequest(this.loadedChangeRequest);
            }
          }
          return response;
        } catch (error) {
          console.log('Error loading ECEWE application.', error);
          this.setFailureAlert('Error loading ECEWE application.');
        }
        this.setIsStarted(true);
      }
    },
    optOutFacilities() {
      //this was modified by JB to try and fix bugs with the checkmarks.
      //instead of running map - I update the facility and nav bar with the opt out status.
      this.navBarList.forEach((facility) => {
        facility.eceweOptInStatus = OPT_STATUSES.OPT_OUT;
      });
      this.facilities.forEach((facility) => {
        facility.optInOrOut = OPT_STATUSES.OPT_OUT;
      });
    },
    async saveECEWEApplication(showConfirmation = true) {
      if (this.isReadOnly) {
        return;
      }

      this.model = this.$refs.eligibilityQuestions.getFormData();
      this.isProcessing = true;
      try {
        this.updateQuestions();
        this.setEceweModel(this.model);
        if (this.isChangeRequest && isNullOrBlank(this.loadedChangeRequest?.optInECEWE)) {
          this.setIsStarted(false);
        }
        if (this.isChangeRequest) {
          await this.saveECEWE({
            isFormComplete: this.enableButtons,
            isChangeRequest: true,
            changeRequestId: this.$route.params.changeRecGuid,
          });
        } else {
          await this.saveECEWE({
            isFormComplete: this.enableButtons,
            isChangeRequest: false,
            changeRequestId: null,
          });
        }
        if (this.isChangeRequest) {
          this.setCRIsEceweComplete({ changeRequestId: this.changeRequestId, isComplete: this.enableButtons });
        } else {
          this.setIsEceweComplete(this.enableButtons);
          this.setIsEceweCompleteInMap(this.enableButtons);
        }
        this.forceNavBarRefresh();

        // If funding model is option 1, opt out all facilities and save. (2024 and previous ONLY) OR If opting out of ecewe,
        // ensure there are no previously saved opted in facilties, if there are, update to opt out and save.
        if (
          this.model.optInECEWE === OPT_STATUSES.OPT_OUT ||
          (this.model.fundingModel === this.fundingModelTypeList[0].id &&
            this.getLanguageYearLabel !== PROGRAM_YEAR_LANGUAGE_TYPES.FY2025_26)
        ) {
          this.optOutFacilities();
        }

        //ccfri 3816 set facility level opt-in for family providers so they don't re-fill this info next page
        //there is only ever one facility

        if (this.organizationProviderType === ORGANIZATION_PROVIDER_TYPES.FAMILY) {
          this.facilities.forEach((facility) => {
            facility.optInOrOut = this.model?.optInECEWE;
            //update the next page navbar checkmark
            const fac = this.navBarList.find((f) => f.facilityId === facility.facilityId);
            if (fac) {
              fac.eceweOptInStatus = this.model?.optInECEWE;
            }
          });
        }

        //save the facilites reagrdless so ECE WE application is always created
        await this.saveECEWEFacilities();
        if (showConfirmation) {
          this.setSuccessAlert('Success! ECEWE application has been saved.');
        }
      } catch (error) {
        this.setFailureAlert('An error occurred while saving ECEWE application. Please try again later.');
        console.log(error);
      } finally {
        this.isProcessing = false;
      }
    },
  },
};
</script>
<style>
.flex-center {
  display: flex;
  align-items: center;
  align-self: center;
}
.radio-label {
  font-size: 17px;
}

div.v-skeleton-loader__actions.v-skeleton-loader__bone {
  align-self: center;
  align-items: center;
  text-align: center;
}
</style>
