import { cloneDeep, isEqual } from 'lodash';
import { mapActions, mapState } from 'pinia';
import { uuid } from 'vue-uuid';

import ApiService from '@/common/apiService.js';
import AppAlertBanner from '@/components/guiComponents/AppAlertBanner.vue';
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDateInput from '@/components/guiComponents/AppDateInput.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';
import FacilityHeader from '@/components/guiComponents/FacilityHeader.vue';
import ApplicationPCFHeader from '@/components/util/ApplicationPCFHeader.vue';
import NavButton from '@/components/util/NavButton.vue';
import alertMixin from '@/mixins/alertMixin.js';
import globalMixin from '@/mixins/globalMixin.js';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useCcfriAppStore } from '@/store/ccfriApp.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useReportChangesStore } from '@/store/reportChanges.js';
import { getBCSSALink } from '@/utils/common.js';
import {
  ApiRoutes,
  CCFRI_FEE_CORRECT_TYPES,
  CCFRI_HAS_CLOSURE_FEE_TYPES,
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
  mixins: [alertMixin, globalMixin],
  data() {
    return {
      rules,
      pastCcfriGuid: undefined,
      closureFees: 'No',
      prevFeesCorrect: undefined,
      dateObj: {
        closureReason: '',
        feesPaidWhileClosed: undefined,
      },
      showRfiDialog: false,
      rfi3percentCategories: [],
      isUnlocked: true,
      loading: true,
      processing: false,
      facilityProgramYears: [],
      isValidForm: false,
      chosenDates: [],
      fiscalYearStartDate: '',
      fiscalYearEndDate: '',

      feeRules: [
        (v) => !isNaN(parseFloat(v)) || 'Must be a number',
        (v) => v <= 9999 || 'Max fee is $9999.00',
        (v) => v >= 0 || 'Input a positve number',
      ],
    };
  },
  computed: {
    ...mapState(useAppStore, ['getFundingUrl', 'getLanguageYearLabel']),
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
    ...mapState(useCcfriAppStore, [
      'CCFRIFacilityModel',
      'ccfriChildCareTypes',
      'loadedModel',
      'ccfriId',
      'getClosureDateLength',
    ]),
    ...mapState(useReportChangesStore, ['userProfileChangeRequests', 'changeRequestStatus']),
    languageYearLabel() {
      return this.getLanguageYearLabel;
    },
    BCSSALink() {
      return getBCSSALink(this.getLanguageYearLabel);
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
    isReadOnly() {
      //if submitted, lock er up. If unlock CCFRI - unlock
      if (this.currentFacility.unlockCcfri) {
        return false;
      } else if (this.isChangeRequest) {
        if (!this.changeRequestStatus) {
          return false;
        } else if (this.changeRequestStatus !== 'INCOMPLETE') {
          return true;
        }
      } else if (this.applicationStatus === 'SUBMITTED') {
        return true;
      }
      return false;
    },
    isSaveDisabled() {
      return this.isReadOnly || (this.showApplicationTemplateV1 && this.hasIllegalDates(this.CCFRIFacilityModel));
    },
  },
  created() {
    this.rules = rules;
    this.CCFRI_FEE_CORRECT_TYPES = CCFRI_FEE_CORRECT_TYPES;
  },
  methods: {
    ...mapActions(useApplicationStore, ['setIsApplicationProcessing', 'validateApplicationForm']),
    ...mapActions(useCcfriAppStore, [
      'saveCcfri',
      'loadCCFRIFacility',
      'loadFacilityCareTypes',
      'decorateWithCareTypes',
      'loadCCFisCCRIMedian',
      'getCcfriOver3percent',
      'setFeeModel',
      'addModelToStore',
      'deleteChildCareTypes',
      'setLoadedModel',
    ]),
    ...mapActions(useNavBarStore, [
      'addToRfiNavBarStore',
      'forceNavBarRefresh',
      'setNavBarValue',
      'setNavBarCCFRIComplete',
    ]),
    //builds an array of dates to keep track of all days of the selected closure period.
    //this array is used to check if a user selects an overlapping date
    dateFunction(date1, date2) {
      const startDate = new Date(date1);
      const endDate = new Date(date2);
      const dates = [];
      const currentDate = new Date(startDate.getTime());

      while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().substring(0, 10));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return dates;
    },
    addRow(radioButtonClicked) {
      //when opening table for the first time, add a row so it always populates with one.
      //check below so if user hits the radio button multiple times, it won't keep adding rows
      if (radioButtonClicked && this.CCFRIFacilityModel.dates.length > 0) return;
      this.updateChosenDates();
      const newObj = { ...this.dateObj, id: uuid.v1() };
      this.CCFRIFacilityModel.dates.push(newObj);
    },
    allowedDates(val) {
      return !this.chosenDates.includes(val);
    },
    updateChosenDates() {
      this.chosenDates = [];
      this.CCFRIFacilityModel.dates.forEach((dateObj) => {
        this.chosenDates = this.chosenDates + this.dateFunction(dateObj.formattedStartDate, dateObj.formattedEndDate);
      });
    },
    isDateLegal(obj) {
      // Get all dates from chosenDates except for the currently edited row
      const otherChosenDates = this.CCFRIFacilityModel.dates
        .filter((dateObj) => dateObj.id !== obj.id)
        .reduce((acc, dateObj) => {
          return [...acc, ...this.dateFunction(dateObj.formattedStartDate, dateObj.formattedEndDate)];
        }, []);

      const dates = this.dateFunction(obj.formattedStartDate, obj.formattedEndDate);

      //datesOverlap flag is true if the selected dates are part of an overlap of other dates.
      //datesInvalid is true if user breaks any other date rule.

      //We do not let users save invalid dates of any kind so there is no risk of a mis-calculation in Dynamics
      //Rules are: end date cannot be before start date
      //start date for either field cannot be before the start of fiscal year
      //end dates for either field cannot be after end of fiscal year

      if (
        obj.formattedEndDate < obj.formattedStartDate ||
        obj.formattedStartDate < this.fiscalStartAndEndDates.startDate ||
        obj.formattedEndDate < this.fiscalStartAndEndDates.startDate ||
        obj.formattedStartDate > this.fiscalStartAndEndDates.endDate ||
        obj.formattedEndDate > this.fiscalStartAndEndDates.endDate
      ) {
        obj.datesInvalid = true;
        return;
      }

      obj.datesOverlap = false;
      obj.datesInvalid = false;
      dates.forEach((date) => {
        if (otherChosenDates.includes(date)) {
          obj.datesOverlap = true;
        }
      });
    },
    hasIllegalDates(ccfriFacilityModel) {
      return ccfriFacilityModel?.dates?.some((el) => el.datesOverlap || el.datesInvalid);
    },
    hasDataToDelete() {
      //checks all care types for the deleteMe flag. If true, we need to run save regardless if the model has been changed by the user.
      return this.CCFRIFacilityModel.childCareTypes.some((careType) => {
        return careType.deleteMe;
      });
    },
    closeDialog() {
      this.showRfiDialog = false;
    },
    removeIndex(index) {
      this.CCFRIFacilityModel.dates.splice(index, 1);
      this.updateChosenDates();
    },
    async toRfi() {
      try {
        this.setNavBarValue({ facilityId: this.currentFacility.facilityId, property: 'hasRfi', value: true });
        if (this.currentFacility?.unlockCcfri) {
          this.setNavBarValue({ facilityId: this.currentFacility.facilityId, property: 'unlockRfi', value: true });
          await ApiService.apiAxios.patch(`/api/application/ccfri/${this.$route.params.urlGuid}`, { unlockRfi: 1 });
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
    isFormComplete() {
      if (
        this.CCFRIFacilityModel.hasClosureFees === CCFRI_HAS_CLOSURE_FEE_TYPES.YES &&
        this.CCFRIFacilityModel.dates.length === 0
      ) {
        return false;
      }
      return this.isValidForm; //false makes button clickable, true disables button
    },
    hasModelChanged() {
      return !isEqual(this.CCFRIFacilityModel, this.loadedModel);
    },
    async save(showMessage) {
      try {
        if (this.isReadOnly || (!this.hasModelChanged() && !this.hasDataToDelete())) return;
        this.setIsApplicationProcessing(true);
        this.setNavBarCCFRIComplete({ ccfriId: this.ccfriId, complete: this.isFormComplete() });

        if (this.changeType == CHANGE_TYPES.NEW_FACILITY) {
          const newFac = this.getChangeActionNewFacByFacilityId(this.CCFRIFacilityModel.facilityId);
          newFac.ccfri.isCCFRIComplete = this.isFormComplete();
        }
        this.setLoadedModel(cloneDeep(this.CCFRIFacilityModel)); //when saving update the loaded model to look for changes
        await this.saveCcfri({
          isFormComplete: this.isFormComplete(),
          hasRfi: this.getNavByCCFRIId(this.$route.params.urlGuid).hasRfi,
        });
        if (showMessage) {
          this.setSuccessAlert('Success! CCFRI Parent fees have been saved.');
        }
        //remove the facility to delete from the store
        this.deleteChildCareTypes();
        this.forceNavBarRefresh();
      } catch (error) {
        console.error(error);
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      } finally {
        this.setIsApplicationProcessing(false);
      }
    },
  },
};
