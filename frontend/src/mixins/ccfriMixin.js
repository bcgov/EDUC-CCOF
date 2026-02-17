import { cloneDeep, isEqual } from 'lodash';
import { mapActions, mapState } from 'pinia';

import ApiService from '@/common/apiService.js';
import AppAlertBanner from '@/components/guiComponents/AppAlertBanner.vue';
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDateInput from '@/components/guiComponents/AppDateInput.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';
import FacilityHeader from '@/components/guiComponents/FacilityHeader.vue';
import ApplicationPCFHeader from '@/components/util/ApplicationPCFHeader.vue';
import NavButton from '@/components/util/NavButton.vue';
import alertMixin from '@/mixins/alertMixin.js';
import closureMixin from '@/mixins/closureMixin.js';
import globalMixin from '@/mixins/globalMixin.js';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useCcfriAppStore } from '@/store/ccfriApp.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useReportChangesStore } from '@/store/reportChanges.js';
import {
  ApiRoutes,
  CCFRI_FEE_CORRECT_TYPES,
  CCFRI_HAS_CLOSURE_FEE_TYPES,
  CCFRI_MAX_FEE,
  CCFRI_MIN_FEE,
  CHANGE_TYPES,
  PATHS,
  PROGRAM_YEAR_LANGUAGE_TYPES,
  changeUrl,
  changeUrlGuid,
  pcfUrl,
  pcfUrlGuid,
} from '@/utils/constants.js';
import rules from '@/utils/rules.js';

export default {
  components: {
    AppAlertBanner,
    AppButton,
    AppDateInput,
    AppDialog,
    ApplicationPCFHeader,
    FacilityHeader,
    NavButton,
  },
  mixins: [alertMixin, closureMixin, globalMixin],
  data() {
    return {
      showRfiDialog: false,
      rfi3percentCategories: [],
    };
  },
  computed: {
    ...mapState(useAppStore, ['getBcssaUrl', 'getFundingUrl', 'getLanguageYearLabel']),
    ...mapState(useApplicationStore, [
      'applicationId',
      'applicationStatus',
      'fiscalStartAndEndDates',
      'formattedProgramYear',
      'isApplicationFormValidated',
      'isApplicationProcessing',
      'isRenewal',
      'programYearId',
      'showApplicationTemplateV1',
    ]),
    ...mapState(useNavBarStore, [
      'navBarList',
      'changeRequestId',
      'changeType',
      'nextPath',
      'previousPath',
      'getNavByCCFRIId',
      'isChangeRequest',
      'getChangeActionNewFacByFacilityId',
    ]),
    ...mapState(useCcfriAppStore, ['CCFRIFacilityModel', 'ccfriChildCareTypes', 'loadedModel', 'ccfriId']),
    ...mapState(useReportChangesStore, ['userProfileChangeRequests', 'changeRequestStatus']),
    languageYearLabel() {
      return this.getLanguageYearLabel;
    },
    BCSSALink() {
      return this.getBcssaUrl(this.programYearId);
    },
    programYearTypes() {
      return PROGRAM_YEAR_LANGUAGE_TYPES;
    },
    currentFacility() {
      return this.navBarList.find((el) => el.ccfriApplicationId == this.$route.params.urlGuid);
    },
    fundingUrl() {
      return this.getFundingUrl(this.programYearId);
    },
    hasDataToDelete() {
      return this.CCFRIFacilityModel.childCareTypes.some((careType) => careType.deleteMe);
    },
    hasModelChanged() {
      return !isEqual(this.CCFRIFacilityModel, this.loadedModel);
    },
    isReadOnly() {
      if (this.currentFacility?.unlockCcfri) {
        return false;
      }
      if (this.isChangeRequest) {
        return this.changeRequestStatus && this.changeRequestStatus !== 'INCOMPLETE';
      }
      return this.applicationStatus === 'SUBMITTED';
    },
    isSaveDisabled() {
      return this.isReadOnly || (this.showApplicationTemplateV1 && this.hasIllegalClosureDates);
    },
    isFormComplete() {
      if (
        this.showApplicationTemplateV1 &&
        this.CCFRIFacilityModel.hasClosureFees === CCFRI_HAS_CLOSURE_FEE_TYPES.YES &&
        !this.areClosureItemsComplete
      ) {
        return false;
      }
      return this.CCFRIFacilityModel.isComplete;
    },
  },
  created() {
    this.feeRules = [
      rules.isNumber,
      rules.max(CCFRI_MAX_FEE, `Max fee is $${CCFRI_MAX_FEE}.00`),
      rules.min(CCFRI_MIN_FEE, 'Input a positive number'),
    ];
    this.rules = rules;
    this.CCFRI_FEE_CORRECT_TYPES = CCFRI_FEE_CORRECT_TYPES;
    this.CCFRI_HAS_CLOSURE_FEE_TYPES = CCFRI_HAS_CLOSURE_FEE_TYPES;
  },
  methods: {
    ...mapActions(useApplicationStore, ['setIsApplicationProcessing', 'validateApplicationForm']),
    ...mapActions(useCcfriAppStore, [
      'saveCcfri',
      'loadCCFRIFacility',
      'decorateWithCareTypes',
      'loadCCFisCCRIMedian',
      'getCcfriOver3percent',
      'deleteChildCareTypes',
      'setLoadedModel',
    ]),
    ...mapActions(useNavBarStore, ['refreshNavBarList', 'setNavBarValue', 'setNavBarCCFRIComplete']),

    closeDialog() {
      this.showRfiDialog = false;
    },
    async toRfi() {
      try {
        this.setNavBarValue({ facilityId: this.currentFacility.facilityId, property: 'hasRfi', value: true });
        if (this.currentFacility?.unlockCcfri) {
          this.setNavBarValue({ facilityId: this.currentFacility.facilityId, property: 'unlockRfi', value: true });
          await ApiService.apiAxios.patch(`${ApiRoutes.APPLICATION_CCFRI}/${this.$route.params.urlGuid}`, {
            unlockRfi: 1,
          });
        }
        this.$router.push(pcfUrlGuid(PATHS.CCFRI_RFI, this.programYearId, this.$route.params.urlGuid));
      } catch (error) {
        console.log(error);
        this.setFailureAlert('An error occured while navigating to RFI.');
      }
    },
    previous() {
      if (this.isReadOnly) {
        this.$router.push(pcfUrl(PATHS.CCFRI_HOME, this.programYearId));
      } else if (this.isChangeRequest) {
        this.$router.push(changeUrl(PATHS.CCFRI_HOME, this.changeRequestId));
      } else if (this.isRenewal) {
        this.$router.push(pcfUrlGuid(PATHS.CCFRI_CURRENT_FEES, this.programYearId, this.$route.params.urlGuid));
      } else {
        this.$router.push(this.previousPath);
      }
    },
    async next() {
      //do not call RFI fee caluclation on NEW PCF or CR NEW FAC
      if (this.isRenewal && !this.isChangeRequest && !this.isReadOnly) {
        console.log('calculating RFI');
        this.rfi3percentCategories = await this.getCcfriOver3percent();
        if (this.rfi3percentCategories.length > 0) {
          if (this.currentFacility.hasRfi) {
            //already has RFI. just go to the next page
            this.$router.push(this.nextPath);
          } else {
            this.showRfiDialog = true;
          }
        } else {
          //no need for RFI.
          //ccfri 4791 only delete the RFI if application has not been submitted yet
          //todoJB- this page needs a bigger refactor. I don't think the portal should be setting the unlockRFI flag.
          if (this.currentFacility.hasRfi) {
            this.setNavBarValue({ facilityId: this.currentFacility.facilityId, property: 'hasRfi', value: false });
            // Use nextTick to ensure the DOM is updated before continuing
            if (!this.currentFacility?.unlockRfi) {
              await this.$nextTick();
              await ApiService.apiAxios.delete(ApiRoutes.APPLICATION_RFI + '/' + this.$route.params.urlGuid + '/rfi');
              await this.$nextTick();
            }
          }
          this.$router.push(this.nextPath);
        }
      } else if (this.isChangeRequest && (this.currentFacility?.unlockRfi || this.currentFacility?.hasRfi)) {
        this.setNavBarValue({ facilityId: this.currentFacility?.facilityId, property: 'hasRfi', value: true });
        this.$router.push(changeUrlGuid(PATHS.CCFRI_RFI, this.changeRequestId, this.$route.params.urlGuid));
      } else {
        console.log('RFI calulation not needed.');
        //Not renewal or CR
        this.$router.push(this.nextPath);
      }
    },
    async save(showMessage) {
      try {
        if (this.isReadOnly) return;
        this.setIsApplicationProcessing(true);
        const shouldSaveCcfri = this.hasModelChanged || this.hasDataToDelete;
        if (shouldSaveCcfri) {
          await this.saveCcfri({
            isFormComplete: this.isFormComplete,
            hasRfi: this.getNavByCCFRIId(this.$route.params.urlGuid).hasRfi,
          });
          this.setLoadedModel(cloneDeep(this.CCFRIFacilityModel));
        }
        const shouldProcessClosures = this.showApplicationTemplateV1 && !this.hasIllegalClosureDates;
        if (shouldProcessClosures) {
          await this.processUpdatedClosures();
          await this.loadClosures(this.$route.params.urlGuid);
        }
        this.setNavBarCCFRIComplete({ ccfriId: this.ccfriId, complete: this.isFormComplete });
        if (this.changeType === CHANGE_TYPES.NEW_FACILITY) {
          const newFac = this.getChangeActionNewFacByFacilityId(this.CCFRIFacilityModel.facilityId);
          newFac.ccfri.isCCFRIComplete = this.isFormComplete;
        }
        //remove the facility to delete from the store
        this.deleteChildCareTypes();
        this.refreshNavBarList();
        if (showMessage && (shouldSaveCcfri || shouldProcessClosures)) {
          this.setSuccessAlert('Success! CCFRI Parent fees have been saved.');
        }
      } catch (error) {
        console.error(error);
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      } finally {
        this.setIsApplicationProcessing(false);
        await this.$nextTick();
        this.validateApplicationForm();
      }
    },
  },
};
