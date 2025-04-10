<template>
  <v-form ref="isValidForm" v-model="isValidForm">
    <v-container class="px-10">
      <div class="text-center">
        <div class="text-h5">
          Child Care Operating Funding Program - {{ formattedProgramYear }} Program Confirmation Form
        </div>
        <div class="text-h5 my-6">Child Care Fee Reduction Initiative (CCFRI)</div>
      </div>
      <FacilityHeader
        :facility-account-number="currentFacility?.facilityAccountNumber"
        :facility-name="currentFacility.facilityName"
        :license-number="currentFacility?.licenseNumber"
        class="mb-10"
      />
      <p class="text-center">
        Enter the fees you would charge a new parent for full-time care at this facility for the months below.
        <br /><br />
        If you have more than one fee for the same category, <strong> enter the highest fee. </strong><br /><br />
        <strong>Enter the fee before CCFRI is applied. </strong> <br /><br />
        <span v-if="languageYearLabel != programYearTypes.HISTORICAL">
          CCFRI regions align with the BCSSA's grouping of school districts into 6 regional chapters. Use the
          <a :href="BCSSALink" target="_blank">BCSSA region lookup</a>
          to find your region.</span
        >
        <br /><br />
        Note: Fee increases will be reviewed and additional information may be requested, which may result in increased
        processing times. If approved, this fee will be posted on the Ministry website. <br /><br />
      </p>

      <v-skeleton-loader v-if="loading" max-height="475px" :loading="loading" type="image, image" />

      <div v-else>
        <v-card
          v-if="isReadOnly && CCFRIFacilityModel.existingFeesCorrect"
          elevation="6"
          class="px-0 py-0 mx-auto my-10 rounded-lg col-12"
          min-height="230"
          rounded
          tiled
          exact
          tile
          :ripple="false"
        >
          <v-card-text class="pt-7 pa-0">
            <div class="px-md-12 px-7">
              <p class="text-h5 text--primary">Are the previous year's fees correct for this facility?</p>
              <br />

              <v-radio-group v-model="prevFeesCorrect" required :disabled="true" :rules="rules.required">
                <v-radio label="Yes" value="Yes" />
                <v-radio label="No" value="No" />
              </v-radio-group>
            </div>
          </v-card-text>
        </v-card>

        <div v-for="(item, index) in CCFRIFacilityModel.childCareTypes" :key="index">
          <v-card
            v-if="!item.deleteMe"
            elevation="6"
            class="px-0 py-0 mx-auto my-10 rounded-lg col-12"
            min-height="230"
            rounded
            tiled
            exact
            tile
            :ripple="false"
          >
            <v-card-text class="pa-0">
              <div class="pa-2 pa-md-4 ma-0 backG">
                <p class="text-h5 text--primary px-5 py-0 my-0">
                  Parent Fees {{ item.programYear }}: Full-Time {{ item.childCareCategory }}
                </p>
              </div>
              <div class="px-md-12 px-7">
                <br />

                <v-radio-group
                  v-model="item.feeFrequency"
                  :rules="rules.required"
                  label="Parent fee frequency"
                  :disabled="isReadOnly"
                >
                  <v-radio label="Daily" value="Daily" />
                  <v-radio label="Monthly" value="Monthly" />
                </v-radio-group>

                <v-container v-if="!item.feeFrequency" />

                <v-container v-else class="ma-0 pa-0">
                  <v-row>
                    <v-col>
                      <label
                        >If you only offer care for <strong>4 days or fewer </strong> per week, select daily parent
                        fee.</label
                      ><br />
                      <label
                        >Enter your
                        <strong
                          >highest {{ item.feeFrequency?.toLowerCase() }} parent fee before CCFRI is applied</strong
                        >
                        in every month below. If there is a month where you do not charge a parent fee, enter
                        zero.</label
                      >
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="col-6 col-md-2">
                      <v-text-field
                        v-model.number="item.approvedFeeApr"
                        type="number"
                        :disabled="isReadOnly"
                        variant="outlined"
                        :rules="feeRules"
                        label="Apr"
                        prefix="$"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeApr')"
                      />
                    </v-col>
                    <v-col class="col-6 col-md-2">
                      <v-text-field
                        v-model.number="item.approvedFeeMay"
                        type="number"
                        :disabled="isReadOnly"
                        variant="outlined"
                        :rules="feeRules"
                        label="May"
                        prefix="$"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeMay')"
                      />
                    </v-col>
                    <v-col class="col-6 col-md-2">
                      <v-text-field
                        v-model.number="item.approvedFeeJun"
                        type="number"
                        :disabled="isReadOnly"
                        variant="outlined"
                        :rules="feeRules"
                        label="Jun"
                        prefix="$"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeJun')"
                      />
                    </v-col>
                    <v-col class="col-6 col-md-2">
                      <v-text-field
                        v-model.number="item.approvedFeeJul"
                        type="number"
                        :disabled="isReadOnly"
                        variant="outlined"
                        :rules="feeRules"
                        label="Jul"
                        prefix="$"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeJul')"
                      />
                    </v-col>
                    <v-col class="col-6 col-md-2">
                      <v-text-field
                        v-model.number="item.approvedFeeAug"
                        type="number"
                        :disabled="isReadOnly"
                        variant="outlined"
                        :rules="feeRules"
                        label="Aug"
                        prefix="$"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeAug')"
                      />
                    </v-col>
                    <v-col class="col-6 col-md-2">
                      <v-text-field
                        v-model.number="item.approvedFeeSep"
                        type="number"
                        :disabled="isReadOnly"
                        variant="outlined"
                        :rules="feeRules"
                        label="Sep"
                        prefix="$"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeSep')"
                      />
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col class="col-6 col-md-2">
                      <v-text-field
                        v-model.number="item.approvedFeeOct"
                        type="number"
                        :disabled="isReadOnly"
                        variant="outlined"
                        :rules="feeRules"
                        label="Oct"
                        prefix="$"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeOct')"
                      />
                    </v-col>
                    <v-col class="col-6 col-md-2">
                      <v-text-field
                        v-model.number="item.approvedFeeNov"
                        type="number"
                        :disabled="isReadOnly"
                        variant="outlined"
                        :rules="feeRules"
                        label="Nov"
                        prefix="$"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeNov')"
                      />
                    </v-col>
                    <v-col class="col-6 col-md-2">
                      <v-text-field
                        v-model.number="item.approvedFeeDec"
                        type="number"
                        :disabled="isReadOnly"
                        variant="outlined"
                        :rules="feeRules"
                        label="Dec"
                        prefix="$"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeDec')"
                      />
                    </v-col>
                    <v-col class="col-6 col-md-2">
                      <v-text-field
                        v-model.number="item.approvedFeeJan"
                        type="number"
                        :disabled="isReadOnly"
                        variant="outlined"
                        :rules="feeRules"
                        label="Jan"
                        prefix="$"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeJan')"
                      />
                    </v-col>
                    <v-col class="col-6 col-md-2">
                      <v-text-field
                        v-model.number="item.approvedFeeFeb"
                        type="number"
                        :disabled="isReadOnly"
                        variant="outlined"
                        :rules="feeRules"
                        label="Feb"
                        prefix="$"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeFeb')"
                      />
                    </v-col>
                    <v-col class="col-6 col-md-2">
                      <v-text-field
                        v-model.number="item.approvedFeeMar"
                        type="number"
                        :disabled="isReadOnly"
                        variant="outlined"
                        :rules="feeRules"
                        label="Mar"
                        prefix="$"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(item, 'approvedFeeMar')"
                      />
                    </v-col>
                  </v-row>
                </v-container>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </div>
      <br />
      <v-skeleton-loader v-if="loading" max-height="475px" :loading="loading" type="image, image">
        <br /><br />
      </v-skeleton-loader>
      <v-card
        v-else
        elevation="6"
        class="px-0 py-0 mx-auto my-10 rounded-lg col-12"
        min-height="230"
        rounded
        tiled
        exact
        tile
        :ripple="false"
      >
        <v-card-text class="pa-0">
          <div class="pa-2 pa-md-4 ma-0 backG">
            <p class="text-h5 text--primary px-5 py-0 my-0">
              Do you charge parent fees at this facility for any closures on business days?
            </p>
          </div>
          <div class="px-md-12 px-7">
            <br />
            <div>
              <p v-if="languageYearLabel == programYearTypes.HISTORICAL">
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
              required
              :disabled="isReadOnly"
              :rules="rules.required"
            >
              <br />
              <v-radio label="Yes" :value="CCFRI_HAS_CLOSURE_FEE_TYPES.YES" @click="addRow(true)" />
              <v-radio label="No" :value="CCFRI_HAS_CLOSURE_FEE_TYPES.NO" />
            </v-radio-group>

            <div v-if="closureFees == 'Yes' || CCFRIFacilityModel.hasClosureFees === CCFRI_FEE_CORRECT_TYPES.YES">
              <v-row v-for="(obj, index) in CCFRIFacilityModel.dates" :key="obj.id" color="#003366">
                <v-col color="#003366" cols="auto">
                  <v-icon :disabled="isReadOnly" size="large" color="blue-darken-4" @click="removeIndex(index)">
                    mdi-close
                  </v-icon>
                </v-col>

                <v-col cols="12" md="3">
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

                <v-col cols="12" md="3">
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

                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="obj.closureReason"
                    :disabled="isReadOnly"
                    label="Closure Reason"
                    variant="outlined"
                    clearable
                    :rules="rules.required"
                  />
                </v-col>

                <v-col cols="12" md="2" class="mt-n1">
                  <span class="span-label font-small">Did parents pay for this closure?</span>
                  <v-radio-group
                    v-model="obj.feesPaidWhileClosed"
                    :disabled="isReadOnly"
                    inline
                    :rules="rules.required"
                  >
                    <v-radio label="Yes" :value="1" />
                    <v-radio label="No" :value="0" />
                  </v-radio-group>
                </v-col>

                <span class="text-white"> . </span>
                <v-row v-if="obj.datesOverlap || obj.datesInvalid">
                  <v-card width="100%" class="mx-3 my-10">
                    <AppAlertBanner type="error" class="mb-4 w-100">Invalid Dates</AppAlertBanner>

                    <v-card-text v-if="obj.datesInvalid">
                      Closure Start Date: {{ obj.formattedStartDate }}
                      <br />
                      Closure End Date: {{ obj.formattedEndDate }} <br /><br />

                      Please review your facility closure dates.
                      <br />
                    </v-card-text>
                    <v-card-text v-else-if="obj.datesOverlap">
                      It appears that the closure start and end dates you've selected for this facility overlap with
                      dates you've previously selected.
                      <br /><br />
                      Closure Start Date: {{ obj.formattedStartDate }}
                      <br />
                      Closure End Date: {{ obj.formattedEndDate }} <br /><br />

                      Please review your existing facility closure dates to ensure consistency and avoid any potential
                      overlap of Facility closure dates.
                      <br />
                    </v-card-text>
                  </v-card>
                </v-row>
                <v-divider />
              </v-row>
              <!-- end v for-->
              <br /><br />

              <v-container>
                <v-row>
                  <v-btn class="my-5" dark color="#003366" :disabled="isReadOnly" @click="addRow(false)">
                    ADD NEW CLOSURE
                  </v-btn>
                </v-row>
              </v-container>
              <br />
            </div>
          </div>
        </v-card-text>
      </v-card>
      <br />
      <v-skeleton-loader v-if="loading" max-height="475px" :loading="loading" type="image, image" />
      <v-card
        v-else
        elevation="6"
        class="px-0 py-0 mx-auto my-10 rounded-lg col-12"
        min-height="230"
        rounded
        tiled
        exact
        tile
        :ripple="false"
      >
        <v-card-text class="pa-0">
          <div class="pa-2 pa-md-4 ma-0 backG">
            <p class="text-h5 text--primary px-5 py-0 my-0">
              Is there any other information about this facility you would like us to know?
            </p>
          </div>
          <div class="px-md-12 px-7">
            <br />
            <v-textarea
              v-model="CCFRIFacilityModel.ccfriApplicationNotes"
              :disabled="isReadOnly"
              variant="outlined"
              name="input-7-4"
              label="Describe here"
            />
          </div>
        </v-card-text>
      </v-card>

      <NavButton
        :is-next-displayed="true"
        :is-save-displayed="true"
        :is-save-disabled="isReadOnly || hasIllegalDates()"
        :is-next-disabled="loading || !isFormComplete() || hasIllegalDates()"
        :is-processing="processing"
        @previous="previous"
        @next="next"
        @validate-form="validateForm()"
        @save="save(true)"
      />

      <AppDialog
        v-model="showRfiDialog"
        persistent
        max-width="700px"
        title="Request for Information"
        :loading="false"
        @close="closeDialog()"
      >
        <template #content>
          <v-col cols="12">
            <p>
              You have entered a parent fee above the {{ formattedProgramYear }} parent fee increase limit for the
              following care categories:<br /><br />
              <span v-for="item in rfi3percentCategories" :key="item">{{ item }}<br /></span>
            </p>
            <p>
              Parent fee increases over the limit will be assessed under the Parent Fee Increase Exceptions policy in
              the
              {{ formattedProgramYear }} <a :href="fundingUrl" target="_blank">Funding Guidelines</a>. You can continue
              to the Request for Information section or press back to update your fees.
            </p>
            <p>
              Please confirm you have provided your highest full-time (i.e. over 4 hours, 5 days a week) parent fee for
              each care category before CCFRI is applied. Submit your daily parent fee if you only offer care for 4 days
              or fewer per week.
            </p>
          </v-col>
        </template>

        <template #button>
          <v-row justify="center" class="pb-4">
            <v-col cols="auto" class="pb-3">
              <AppButton
                :primary="false"
                required
                size="x-large"
                style="width: 120px; height: 48px"
                @click="closeDialog()"
              >
                Back
              </AppButton>
            </v-col>
            <v-col cols="auto" class="pb-3">
              <AppButton :primary="true" required size="large" style="width: 120px; height: 48px" @click="toRfi()">
                Continue
              </AppButton>
            </v-col>
          </v-row>
        </template>
      </AppDialog>
    </v-container>
  </v-form>
</template>
<script>
import { mapState, mapActions } from 'pinia';
import { isEqual, cloneDeep } from 'lodash';
import { uuid } from 'vue-uuid';

import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useCcfriAppStore } from '@/store/ccfriApp.js';
import { useReportChangesStore } from '@/store/reportChanges.js';

import NavButton from '@/components/util/NavButton.vue';
import FacilityHeader from '@/components/guiComponents/FacilityHeader.vue';
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDateInput from '@/components/guiComponents/AppDateInput.vue';
import AppAlertBanner from '@/components/guiComponents/AppAlertBanner.vue';
import AppDialog from '@/components/guiComponents/AppDialog.vue';

import { getBCSSALink } from '@/utils/common.js';
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
    NavButton,
    FacilityHeader,
    AppAlertBanner,
    AppDateInput,
    AppDialog,
    AppButton,
  },
  mixins: [alertMixin, globalMixin],
  beforeRouteLeave(_to, _from, next) {
    this.save(false);
    next();
  },
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
      'applicationStatus',
      'formattedProgramYear',
      'programYearId',
      'applicationId',
      'isRenewal',
      'fiscalStartAndEndDates',
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
  },
  watch: {
    //get facilityID from here and then set it !
    '$route.params.urlGuid': {
      async handler() {
        if (this.pastCcfriGuid) {
          await this.save(false);
        }
        window.scrollTo(0, 0);
        try {
          await this.loadCCFRIFacility(this.$route.params.urlGuid);
          await this.decorateWithCareTypes(this.currentFacility.facilityId);
          this.loadCCFisCCRIMedian(); //this can be async. no need to wait.
          this.prevFeesCorrect =
            this.CCFRIFacilityModel.existingFeesCorrect === CCFRI_FEE_CORRECT_TYPES.YES ? 'Yes' : 'No';
          this.pastCcfriGuid = cloneDeep(this.$route.params.urlGuid);
          this.updateChosenDates();
          this.loading = false;
        } catch (error) {
          console.log(error);
          this.setFailureAlert('An error occured while getting.');
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.CCFRI_HAS_CLOSURE_FEE_TYPES = CCFRI_HAS_CLOSURE_FEE_TYPES;
    this.CCFRI_FEE_CORRECT_TYPES = CCFRI_FEE_CORRECT_TYPES;
  },
  methods: {
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
.blueBorder {
  border-top: 55px solid grey !important;
}

.backG {
  background-color: lightgray;
}
</style>
