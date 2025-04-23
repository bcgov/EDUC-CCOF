<template>
  <v-form ref="isValidForm" v-model="isValidForm">
    <v-container fluid>
      <ApplicationPCFHeader
        page-title="Child Care Fee Reduction Initiative (CCFRI)"
        :program-year="formattedProgramYear"
        :facility="currentFacility"
      />
      <div class="mx-lg-16 mb-12">
        <div class="text-center px-4 px-lg-8 my-8">
          <p>
            Closure dates impact pay. As outlined in the Closure Policy, closure periods are any days when a facility is
            not open and providing licensed child care, not including provincial statuary holidays. To be approved for
            the CCFRI, facilities must not charge parent fees for closure periods greater than two consecutive weeks per
            month, up to a maximum of four weeks per funding agreement term.
          </p>
          <p class="mt-4">
            The ministry may approve a provider to charge parent fees during additional closure periods that align with
            a history of past closures or are due to circumstances outside of the provider's control if the facility
            needs to charge parent fees during the closure period to maintain operational viability. Facilities may not
            charge parent fees for any closure periods beyond those approved by the ministry in writing.
          </p>
        </div>
        <v-skeleton-loader :loading="isApplicationProcessing" type="table-tbody">
          <v-card elevation="6" width="100%" class="rounded-lg my-4 mb-12">
            <v-card-text class="pa-0">
              <div class="pa-2 pa-md-4 ma-0 lightgray-background">
                <p class="text-h5 text--primary px-5 py-0 my-0">
                  Do you charge parent fees at this facility for any closures on business days?
                </p>
              </div>
              <div class="px-md-12 px-7 py-4">
                <div class="span-label font-regular">
                  <p v-if="languageYearLabel == PROGRAM_YEAR_LANGUAGE_TYPES.HISTORICAL">
                    Do you charge parent fees at this facility for any closures on business days (other than designated
                    holidays)? Only indicate the date of closures where parent fees are charged.
                  </p>
                  <p v-else>
                    Do you charge parent fees at this facility for any closures on business days (other than provincial
                    statutory holidays)? Only indicate the date of closures where parent fees are charged.
                  </p>
                </div>
                <v-radio-group
                  v-model="CCFRIFacilityModel.hasClosureFees"
                  :disabled="isReadOnly"
                  :rules="rules.required"
                  color="primary"
                >
                  <v-radio label="Yes" :value="CCFRI_HAS_CLOSURE_FEE_TYPES.YES" @click="addRow(true)" />
                  <v-radio label="No" :value="CCFRI_HAS_CLOSURE_FEE_TYPES.NO" />
                </v-radio-group>

                <template
                  v-if="closureFees == 'Yes' || CCFRIFacilityModel.hasClosureFees === CCFRI_FEE_CORRECT_TYPES.YES"
                >
                  <AppAlertBanner type="info" class="mb-8">
                    Only closures where parents are paying fees need to be reported.
                  </AppAlertBanner>
                  <v-card v-for="(obj, index) in CCFRIFacilityModel.dates" :key="obj.id" class="px-6 py-4 pl-md-0 mb-8">
                    <v-row no-gutters class="align-center">
                      <v-col cols="12" md="1" class="close-column text-center">
                        <v-btn
                          :disabled="isReadOnly"
                          variant="text"
                          size="large"
                          icon="mdi-close"
                          color="primary"
                          @click="removeIndex(index)"
                        />
                      </v-col>
                      <v-col cols="12" md="11">
                        <v-row>
                          <v-col cols="12" md="4">
                            <AppDateInput
                              v-model="obj.formattedStartDate"
                              :min="fiscalStartAndEndDates.startDate"
                              :max="fiscalStartAndEndDates.endDate"
                              :rules="[
                                ...rules.required,
                                rules.min(fiscalStartAndEndDates.startDate, 'Must exceed fiscal year start date'),
                                rules.max(fiscalStartAndEndDates.endDate, 'Must be before fiscal year end date'),
                              ]"
                              :disabled="isReadOnly"
                              :hide-details="isReadOnly"
                              label="Start Date"
                              clearable
                              @input="isDateLegal(obj)"
                            />
                          </v-col>

                          <v-col cols="12" md="4">
                            <AppDateInput
                              v-model="obj.formattedEndDate"
                              :min="obj.formattedStartDate"
                              :max="fiscalStartAndEndDates.endDate"
                              :rules="[
                                ...rules.required,
                                rules.min(obj.formattedStartDate, 'Must exceed start date'),
                                rules.max(fiscalStartAndEndDates.endDate, 'Must be before fiscal year end date'),
                              ]"
                              :disabled="isReadOnly"
                              :hide-details="isReadOnly"
                              clearable
                              label="End Date"
                              @input="isDateLegal(obj)"
                            />
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-text-field
                              v-model="obj.closureReason"
                              :disabled="isReadOnly"
                              label="Closure Reason"
                              variant="outlined"
                              clearable
                              :rules="rules.required"
                            />
                          </v-col>
                        </v-row>

                        <v-row no-gutters>
                          <p class="span-label font-regular pt-2 pr-4">
                            Is this a full facility closure?
                            <AppTooltip
                              tooltip-content="If only selected care groups are affected, select No (Partial Closure)"
                            />
                          </p>
                          <v-radio-group
                            v-model="obj.isFullFacilityClosure"
                            :disabled="isReadOnly"
                            inline
                            color="primary"
                            :rules="rules.required"
                          >
                            <v-radio label="Yes" :value="1" />
                            <v-radio label="No" :value="0" />
                          </v-radio-group>
                        </v-row>

                        <v-row v-if="obj.isFullFacilityClosure === YES_NO_VALUES.NO" no-gutters>
                          <p class="span-label font-regular pt-2 pr-4 mb-2">
                            Select all care categories that are affected by the closure:
                          </p>
                          <AppMultiSelectInput
                            v-model="obj.affectedChildcareCategories"
                            :items="childCareCategories"
                            item-title="childCareCategory"
                            item-value="childCareCategoryId"
                            label="Care Categories"
                            :disabled="isApplicationProcessing"
                            :rules="rules.required"
                          />
                        </v-row>

                        <v-card v-if="obj.datesOverlap || obj.datesInvalid" class="my-4">
                          <AppAlertBanner type="error" class="mb-4">Invalid Dates</AppAlertBanner>

                          <v-card-text v-if="obj.datesInvalid">
                            Closure Start Date: {{ obj.formattedStartDate }}
                            <br />
                            Closure End Date: {{ obj.formattedEndDate }} <br /><br />

                            Please review your facility closure dates.
                            <br />
                          </v-card-text>
                          <v-card-text v-else-if="obj.datesOverlap">
                            It appears that the closure start and end dates you've selected for this facility overlap
                            with dates you've previously selected.
                            <br /><br />
                            Closure Start Date: {{ obj.formattedStartDate }}
                            <br />
                            Closure End Date: {{ obj.formattedEndDate }} <br /><br />

                            Please review your existing facility closure dates to ensure consistency and avoid any
                            potential overlap of Facility closure dates.
                            <br />
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card>

                  <AppButton id="add-new-closure-button" :disabled="isReadOnly" class="my-4" @click="addRow">
                    Add New Closure
                  </AppButton>
                </template>
              </div>
            </v-card-text>
          </v-card>
        </v-skeleton-loader>
      </div>

      <NavButton
        :is-next-displayed="true"
        :is-save-displayed="true"
        :is-save-disabled="isReadOnly || hasIllegalDates()"
        :is-next-disabled="isApplicationProcessing || !isFormComplete() || hasIllegalDates()"
        :is-processing="processing"
        @previous="previous"
        @next="next"
        @validate-form="validateForm()"
        @save="save(true)"
      />
    </v-container>
  </v-form>
</template>
<script>
import { mapState, mapActions } from 'pinia';
import { isEqual, isEmpty, cloneDeep } from 'lodash';
import { uuid } from 'vue-uuid';

import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useCcfriAppStore } from '@/store/ccfriApp.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useReportChangesStore } from '@/store/reportChanges.js';

import AppAlertBanner from '@/components/guiComponents/AppAlertBanner.vue';
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDateInput from '@/components/guiComponents/AppDateInput.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';
import AppMultiSelectInput from '@/components/guiComponents/AppMultiSelectInput.vue';
import AppTooltip from '@/components/guiComponents/AppTooltip.vue';

import ApplicationPCFHeader from '@/components/util/ApplicationPCFHeader.vue';
import NavButton from '@/components/util/NavButton.vue';

import rules from '@/utils/rules.js';

import {
  PATHS,
  pcfUrlGuid,
  pcfUrl,
  changeUrl,
  changeUrlGuid,
  CHANGE_TYPES,
  PROGRAM_YEAR_LANGUAGE_TYPES,
  ApiRoutes,
  CCFRI_HAS_CLOSURE_FEE_TYPES,
  CCFRI_FEE_CORRECT_TYPES,
  YES_NO_VALUES,
} from '@/utils/constants.js';
import alertMixin from '@/mixins/alertMixin.js';
import globalMixin from '@/mixins/globalMixin.js';
import ApiService from '@/common/apiService.js';

//builds an array of dates to keep track of all days of the selected closure period.
//this array is used to check if a user selects an overlapping date
function dateFunction(date1, date2) {
  const startDate = new Date(date1);
  const endDate = new Date(date2);
  const dates = [];
  const currentDate = new Date(startDate.getTime());

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().substring(0, 10));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

export default {
  components: {
    ApplicationPCFHeader,
    NavButton,
    AppAlertBanner,
    AppDateInput,
    AppDialog,
    AppButton,
    AppMultiSelectInput,
    AppTooltip,
  },
  mixins: [alertMixin, globalMixin],
  beforeRouteLeave(_to, _from, next) {
    this.save(false);
    next();
  },
  data() {
    return {
      pastCcfriGuid: undefined,
      closureFees: 'No',
      dateObj: {
        closureReason: '',
        isFullFacilityClosure: undefined,
      },
      showRfiDialog: false,
      rfi3percentCategories: [],
      isUnlocked: true,
      processing: false,
      isValidForm: false,
      chosenDates: [],
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
    childCareCategories() {
      return this.CCFRIFacilityModel?.childCareTypes?.filter(
        (careType) => careType.programYearId === this.$route.params.programYearGuid,
      );
    },
  },
  watch: {
    //get facilityID from here and then set it !
    '$route.params.urlGuid': {
      async handler() {
        window.scrollTo(0, 0);
        try {
          this.setIsApplicationProcessing(true);
          await this.loadCCFRIFacility(this.$route.params.urlGuid);
          await this.decorateWithCareTypes(this.currentFacility.facilityId);
          // this.loadCCFisCCRIMedian();
          this.updateChosenDates();
        } catch (error) {
          console.log(error);
          this.setFailureAlert('An error occured while getting.');
        } finally {
          this.setIsApplicationProcessing(false);
        }
      },
      immediate: true,
    },
  },
  created() {
    this.rules = rules;
    this.CCFRI_HAS_CLOSURE_FEE_TYPES = CCFRI_HAS_CLOSURE_FEE_TYPES;
    this.CCFRI_FEE_CORRECT_TYPES = CCFRI_FEE_CORRECT_TYPES;
    this.PROGRAM_YEAR_LANGUAGE_TYPES = PROGRAM_YEAR_LANGUAGE_TYPES;
    this.YES_NO_VALUES = YES_NO_VALUES;
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
    ...mapActions(useNavBarStore, ['forceNavBarRefresh', 'setNavBarValue', 'setNavBarCCFRIComplete']),
    addRow(radioButtonClicked = false) {
      //when opening table for the first time, add a row so it always populates with one.
      //check below so if user hits the radio button multiple times, it won't keep adding rows
      if (radioButtonClicked && this.CCFRIFacilityModel.dates.length > 0) return;
      this.updateChosenDates();
      const newObj = { ...this.dateObj, id: uuid.v1() };
      this.CCFRIFacilityModel.dates.push(newObj);
    },
    updateChosenDates() {
      this.chosenDates = [];
      this.CCFRIFacilityModel.dates.forEach((dateObj) => {
        this.chosenDates = this.chosenDates + dateFunction(dateObj.formattedStartDate, dateObj.formattedEndDate);
      });
    },
    isDateLegal(obj) {
      // Get all dates from chosenDates except for the currently edited row
      const otherChosenDates = this.CCFRIFacilityModel.dates
        .filter((dateObj) => dateObj.id !== obj.id)
        .reduce((acc, dateObj) => {
          return [...acc, ...dateFunction(dateObj.formattedStartDate, dateObj.formattedEndDate)];
        }, []);

      const dates = dateFunction(obj.formattedStartDate, obj.formattedEndDate);

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
    hasIllegalDates() {
      return this.CCFRIFacilityModel?.dates?.some((el) => el.datesOverlap || el.datesInvalid);
    },
    hasDataToDelete() {
      //checks all care types for the deleteMe flag. If true, we need to run save regardless if the model has been changed by the user.
      return this.CCFRIFacilityModel.childCareTypes.some((careType) => {
        return careType.deleteMe;
      });
    },
    removeIndex(index) {
      this.CCFRIFacilityModel.dates.splice(index, 1);
      if (isEmpty(this.CCFRIFacilityModel.dates)) this.addRow(false);
      this.updateChosenDates();
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
      if (this.isRenewal && !this.isChangeRequest) {
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
          if (this.currentFacility.hasRfi) {
            this.setNavBarValue({ facilityId: this.currentFacility.facilityId, property: 'hasRfi', value: false });
            // Use nextTick to ensure the DOM is updated before continuing
            await this.$nextTick();
            console.log('deleting RFI');
            await ApiService.apiAxios.delete(ApiRoutes.APPLICATION_RFI + '/' + this.$route.params.urlGuid + '/rfi');
            await this.$nextTick();
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
    validateForm() {
      this.$refs.isValidForm?.validate();
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
      //only save data to Dynamics if the form has changed.
      if (this.hasModelChanged() || this.hasDataToDelete()) {
        this.processing = true;
        this.setNavBarCCFRIComplete({ ccfriId: this.ccfriId, complete: this.isFormComplete() });

        if (this.changeType == CHANGE_TYPES.NEW_FACILITY) {
          const newFac = this.getChangeActionNewFacByFacilityId(this.CCFRIFacilityModel.facilityId);
          newFac.ccfri.isCCFRIComplete = this.isFormComplete();
        }
        try {
          this.setLoadedModel(cloneDeep(this.CCFRIFacilityModel)); //when saving update the loaded model to look for changes
          await this.saveCcfri({
            isFormComplete: this.isFormComplete(),
            hasRfi: this.getNavByCCFRIId(this.$route.params.urlGuid).hasRfi,
          });
          if (showMessage) {
            this.setSuccessAlert('Success! CCFRI Parent fees have been saved.');
          }
          //remove the facility to delete from the vuex store
          this.deleteChildCareTypes();
        } catch (error) {
          console.info(error);
          this.setFailureAlert('An error occurred while saving.');
        }
        this.processing = false;
        this.forceNavBarRefresh();
      }
    },
  },
};
</script>
<style scoped>
.close-column {
  max-width: 90px;
}
</style>
