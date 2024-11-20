<template>
  <v-form ref="isValidForm" v-model="isValidForm">
    <v-container>
      <div align="center">
        <div class="text-h5">
          Child Care Operating Funding Program - {{ formattedProgramYear }} Program Confirmation Form
        </div>
        <div class="text-h5 my-6">Early Childhood Educator Wage Enhancement (ECE-WE)</div>
        <div class="text-h5 my-6" style="color: #003466">
          {{ userInfo.organizationName }}
          {{ languageYearLabel }}
        </div>
      </div>
      <v-alert class="col-11 mb-0" variant="outlined" prominent>
        <span class="pr-1" style="float: left">
          <v-icon size="x-large" color="rgb(0 51 102)" class="py-1 px-3"> mdi-information </v-icon>
        </span>
        <span>
          <strong>Note:</strong> Please read and understand the full eligibility requirements in the
          <u>
            <a
              href="https://www2.gov.bc.ca/gov/content/family-social-supports/caring-for-young-children/childcarebc-programs/wage-enhancement"
              target="_blank"
            >
              ECE-WE Funding Guidelines
            </a>
          </u>
          . All CCFRI-eligible facilities must opt-in to CCFRI <strong>to be eligible for ECE-WE.</strong>
        </span>
      </v-alert>

      <v-skeleton-loader v-if="isLoading" :loading="isLoading" type="table-tbody" class="my-2"></v-skeleton-loader>

      <EceweEligibilityQuestions
        v-else-if="model"
        :eceweModel="model"
        :isLoading="isLoading"
        ref="eligibilityQuestions"
      />
      {{ model }} {{ isLoading }}
      <NavButton
        class="mt-10"
        :is-next-displayed="true"
        :is-save-displayed="true"
        :is-save-disabled="isReadOnly()"
        :is-next-disabled="!enableButtons"
        :is-processing="isProcessing"
        @previous="previous"
        @next="next"
        @validate-form="validateForm()"
        @save="saveECEWEApplication"
      />
    </v-container>
  </v-form>
</template>

<script>
import { mapState, mapActions } from 'pinia';
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
  PROGRAM_YEAR_LANGUAGE_TYPES,
  ORGANIZATION_PROVIDER_TYPES,
  ECEWE_SECTOR_TYPES,
} from '@/utils/constants.js';
import alertMixin from '@/mixins/alertMixin.js';
import rules from '@/utils/rules.js';
import { isNullOrBlank } from '@/utils/common.js';
import NavButton from '@/components/util/NavButton.vue';
import EceweEligibilityQuestions from './EceweEligibilityQuestions.vue';

export default {
  components: { NavButton, EceweEligibilityQuestions },
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
      isProcessing: false, // flag to UI if screen is saving/processing data or not.
      isValidForm: false,
    };
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useEceweAppStore, [
      'isStarted',
      'eceweModel',
      'loadedFacilities',
      'optinECEWEChangeRequestReadonly',
      'belongsToUnionChangeRequestReadonly',
    ]),
    ...mapState(useAppStore, ['fundingModelTypeList', 'getFundingUrl', 'getLanguageYearLabel']),
    ...mapState(useNavBarStore, [
      'navBarList',
      'changeRequestId',
      'previousPath',
      'isChangeRequest',
      'userProfileList',
    ]),
    ...mapState(useApplicationStore, [
      'formattedProgramYear',
      'programYearId',
      'applicationStatus',
      'unlockEcewe',
      'applicationId',
    ]),
    ...mapState(useOrganizationStore, ['organizationProviderType']),
    ...mapState(useReportChangesStore, ['loadedChangeRequest', 'isEceweUnlocked', 'changeRequestStatus']),
    showApplicableSectorQuestion() {
      return (
        (this.model.belongsToUnion === 1 &&
          this.model.optInECEWE === 1 &&
          this.languageYearLabel !== this.programYearTypes.HISTORICAL) ||
        (this.model.belongsToUnion === 1 &&
          this.model.optInECEWE === 1 &&
          this.languageYearLabel === this.programYearTypes.HISTORICAL)
      );
    },
    showConfirmationQuestion() {
      return (
        (this.model.applicableSector === ECEWE_SECTOR_TYPES.OTHER_UNION &&
          this.model.belongsToUnion === 1 &&
          this.model.optInECEWE === 1 &&
          this.languageYearLabel !== this.programYearTypes.HISTORICAL) ||
        (this.model.applicableSector === ECEWE_SECTOR_TYPES.OTHER_UNION &&
          this.model.belongsToUnion === 1 &&
          this.model.optInECEWE === 1 &&
          this.languageYearLabel === this.programYearTypes.HISTORICAL)
      );
    },
    showFundingModelQuestion() {
      return (
        this.model.applicableSector === ECEWE_SECTOR_TYPES.CSSEA &&
        this.model.belongsToUnion === 1 &&
        this.model.optInECEWE === 1
      );
    },
    showJJEPQuestion() {
      return (
        this.model.fundingModel === this.fundingModelTypeList[1].id ||
        this.model.fundingModel === this.fundingModelTypeList[2].id
      );
    },

    filteredECEWEFacilityList() {
      const eceweAppStore = useEceweAppStore();
      if (this.isChangeRequest) {
        return eceweAppStore.facilities?.filter((el) => el.changeRequestId === this.$route.params.changeRecGuid);
      } else {
        return eceweAppStore.facilities?.filter((el) => !el.changeRequestId);
      }
    },

    fundingUrl() {
      return this.getFundingUrl(this.programYearId);
    },
    languageYearLabel() {
      return this.getLanguageYearLabel;
    },
    programYearTypes() {
      return PROGRAM_YEAR_LANGUAGE_TYPES;
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
      return this.isValidForm && !this.$refs?.eligibilityQuestions?.showCSSEAWarning;
    },
  },
  async mounted() {
    try {
      this.isLoading = true;
      this.setFundingModelTypes({ ...this.fundingModelTypeList });
      this.setApplicationId(this.applicationId);
      let response = await this.loadData();
      if (response) {
        this.setIsStarted(true);
        this.initECEWEFacilities(this.navBarList);
        let copyFacilities = JSON.parse(JSON.stringify(this.facilities));
        this.setLoadedFacilities(copyFacilities);
        this.model = { ...this.eceweModel };
        this.isLoading = false;
      }
    } catch (error) {
      console.log(error);
      this.isLoading = false;
    }
  },
  created() {
    this.ORGANIZATION_PROVIDER_TYPES = ORGANIZATION_PROVIDER_TYPES;
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
    isReadOnly(question) {
      if (this.isChangeRequest) {
        if (this.isEceweUnlocked || !this.changeRequestStatus)
          return (
            (question === 'optInECEWE' && this.optinECEWEChangeRequestReadonly) ||
            (question === 'belongsToUnion' && this.belongsToUnionChangeRequestReadonly)
          );
        else if (this.changeRequestStatus !== 'INCOMPLETE') {
          return true;
        }
        return (
          (question === 'optInECEWE' && this.optinECEWEChangeRequestReadonly) ||
          (question === 'belongsToUnion' && this.belongsToUnionChangeRequestReadonly)
        );
      }
      if (this.unlockEcewe) {
        return false;
      } else if (this.applicationStatus === 'SUBMITTED') {
        return true;
      }
      return false;
    },
    previous() {
      this.$router.push(this.previousPath);
    },
    async next() {
      if (this.isChangeRequest) {
        if (this.model.optInECEWE === 0) {
          this.$router.push(changeUrl(PATHS.SUPPORTING_DOCS, this.$route.params.changeRecGuid));
        } else {
          this.$router.push(changeUrl(PATHS.ECEWE_FACILITITES, this.$route.params.changeRecGuid));
        }
      } else if (this.model.optInECEWE === 0) {
        this.$router.push(pcfUrl(PATHS.SUPPORTING_DOCS, this.programYearId));
      } else {
        this.$router.push(pcfUrl(PATHS.ECEWE_FACILITITES, this.programYearId));
      }
    },

    validateForm() {
      this.$refs.isValidForm?.validate();
    },
    /* Determines if all facilites are currently opted out. */
    allFacilitiesOptedOut() {
      for (let facility of this.facilities) {
        if (facility.optInOrOut === 1 || facility.optInOrOut === null) {
          return false;
        }
      }
      return true;
    },
    /* Questions values have a hierarchy, recalculate values incase values have changed. */
    updateQuestions() {
      if (this.model.optInECEWE === 0) {
        this.model.belongsToUnion = null;
        this.model.fundingModel = null;
        this.model.confirmation = null;
      } else if (this.model.belongsToUnion === 0 || this.model.belongsToUnion === null) {
        this.model.fundingModel = null;
        this.model.confirmation = null;
      } else if (this.model.applicableSector === ECEWE_SECTOR_TYPES.OTHER_UNION) {
        this.model.fundingModel = null;
      } else if (
        this.model.applicableSector === ECEWE_SECTOR_TYPES.CSSEA &&
        this.model.fundingModel === this.fundingModelTypeList[0].id
      ) {
        this.model.confirmation = null;
      }
    },
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
          let response = await this.loadECEWE();
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
        facility.eceweOptInStatus = 0;
      });
      this.facilities.forEach((facility) => {
        facility.optInOrOut = 0;
      });
    },
    async saveECEWEApplication(showConfirmation = true) {
      if (this.isReadOnly()) {
        return;
      }
      this.model = this.$refs.eligibilityQuestions.getFormData();
      console.log('Form Data:', this.model);
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

        const optOutFacilities =
          this.model.optInECEWE === 0 &&
          this.facilities.some((facility) => facility.eceweApplicationId != null && facility.optInOrOut === 1);

        // If funding model is option 1, opt out all facilities and save. OR If opting out of ecewe,
        // ensure there are no previously saved opted in facilties, if there are, update to opt out and save.
        if (
          this.model.optInECEWE === 0 ||
          this.model.fundingModel === this.fundingModelTypeList[0].id ||
          optOutFacilities
        ) {
          this.optOutFacilities();
        }

        //ccfri 3816 set facility level opt-in for family providers so they don't re-fill this info next page
        //there is only ever one facility

        if (this.organizationProviderType === ORGANIZATION_PROVIDER_TYPES.FAMILY) {
          this.facilities.forEach((facility) => {
            facility.optInOrOut = this.model?.optInECEWE;
            //update the next page navbar checkmark
            let fac = this.navBarList.find((f) => f.facilityId === facility.facilityId);
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
