<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-form ref="ccfriSummaryForm" v-model="isValidForm">
      <v-expansion-panel-title>
        <SummaryExpansionPanelTitle title="Child Care Fee Reduction Initiative (CCFRI)" :is-complete="isValidForm" />
      </v-expansion-panel-title>
      <v-expansion-panel-text eager>
        <v-row v-if="!ccfri || ccfri?.ccfriOptInStatus === 0">
          <v-col cols="12">
            <span cols="12" class="summary-label">CCFRI Opt-In/Opt-Out Status:</span>
            <v-text-field
              cols="12"
              placeholder="Required"
              class="summary-value"
              :model-value="optInOptOut"
              density="compact"
              flat
              variant="solo"
              hide-details
              readonly
              :rules="rules.required"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row v-else-if="ccfri.ccfriOptInStatus != 0" no-gutters class="d-flex flex-column">
          <div v-for="(ccType, index) in ccfriChildCareTypes" :key="index">
            <v-row class="d-flex justify-start">
              <v-col cols="12" lg="12" class="pb-1 pt-1 ml-2">
                <v-row no-gutters class="d-flex justify-start">
                  <v-col cols="12" class="d-flex justify-start">
                    <span v-if="!!ccType.programYear && !!ccType.childCareCategory" class="summary-label pt-3"
                      >Parent Fees {{ ccType.programYear }}: {{ ccType.childCareCategory }}:
                    </span>
                    <v-text-field
                      v-else
                      placeholder="Required"
                      :model-value="generateProgYearText(ccType.programYear, ccType.childCareCategory)"
                      class="summary-label"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      readonly
                      :rules="rules.required"
                      prefix="Parent Fees"
                    />
                    <v-text-field
                      placeholder="Required"
                      :model-value="ccType.feeFrequency"
                      class="summary-value"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      readonly
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" class="d-flex justify-start">
                    <span v-if="!!ccType.feeFrequency" class="summary-label"
                      >Your <b>highest {{ ccType.feeFrequency.toLowerCase() }} parent fee before CCFRI is applied</b> in
                      every month below.
                    </span>
                    <v-text-field
                      v-else
                      placeholder="Required"
                      :model-value="ccType.feeFrequency"
                      class="summary-value"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      readonly
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="2" class="d-flex justify-start">
                    <span class="summary-label pt-3">Apr:</span>
                    <v-text-field
                      placeholder="Required"
                      :model-value="ccType.approvedFeeApr"
                      class="summary-value"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      readonly
                      :rules="rules.required"
                      prefix="$"
                    />
                  </v-col>
                  <v-col cols="2" class="d-flex justify-start">
                    <span class="summary-label pt-3">May:</span>
                    <v-text-field
                      placeholder="Required"
                      :model-value="ccType.approvedFeeMay"
                      class="summary-value"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      readonly
                      :rules="rules.required"
                      prefix="$"
                    />
                  </v-col>
                  <v-col cols="2" class="d-flex justify-start">
                    <span class="summary-label pt-3">Jun:</span>
                    <v-text-field
                      placeholder="Required"
                      :model-value="ccType.approvedFeeJun"
                      class="summary-value"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      readonly
                      :rules="rules.required"
                      prefix="$"
                    />
                  </v-col>
                  <v-col cols="2" class="d-flex justify-start">
                    <span class="summary-label pt-3">Jul:</span>
                    <v-text-field
                      placeholder="Required"
                      :model-value="ccType.approvedFeeJul"
                      class="summary-value"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      readonly
                      :rules="rules.required"
                      prefix="$"
                    />
                  </v-col>
                  <v-col cols="2" class="d-flex justify-start">
                    <span class="summary-label pt-3">Aug:</span>
                    <v-text-field
                      placeholder="Required"
                      :model-value="ccType.approvedFeeAug"
                      class="summary-value"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      readonly
                      :rules="rules.required"
                      prefix="$"
                    />
                  </v-col>
                  <v-col cols="2" class="d-flex justify-start">
                    <span class="summary-label pt-3">Sep:</span>
                    <v-text-field
                      placeholder="Required"
                      :model-value="ccType.approvedFeeSep"
                      class="summary-value"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      readonly
                      :rules="rules.required"
                      prefix="$"
                    />
                  </v-col>
                  <v-col cols="2" class="d-flex justify-start">
                    <span class="summary-label pt-3">Oct:</span>
                    <v-text-field
                      placeholder="Required"
                      :model-value="ccType.approvedFeeOct"
                      class="summary-value"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      readonly
                      :rules="rules.required"
                      prefix="$"
                    />
                  </v-col>
                  <v-col cols="2" class="d-flex justify-start">
                    <span class="summary-label pt-3">Nov:</span>
                    <v-text-field
                      placeholder="Required"
                      :model-value="ccType.approvedFeeNov"
                      class="summary-value"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      readonly
                      :rules="rules.required"
                      prefix="$"
                    />
                  </v-col>
                  <v-col cols="2" class="d-flex justify-start">
                    <span class="summary-label pt-3">Dec:</span>
                    <v-text-field
                      placeholder="Required"
                      :model-value="ccType.approvedFeeDec"
                      class="summary-value"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      readonly
                      :rules="rules.required"
                      prefix="$"
                    />
                  </v-col>
                  <v-col cols="2" class="d-flex justify-start">
                    <span class="summary-label pt-3">Jan:</span>
                    <v-text-field
                      placeholder="Required"
                      :model-value="ccType.approvedFeeJan"
                      class="summary-value"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      readonly
                      :rules="rules.required"
                      prefix="$"
                    />
                  </v-col>
                  <v-col cols="2" class="d-flex justify-start">
                    <span class="summary-label pt-3">Feb:</span>
                    <v-text-field
                      placeholder="Required"
                      :model-value="ccType.approvedFeeFeb"
                      class="summary-value"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      readonly
                      :rules="rules.required"
                      prefix="$"
                    />
                  </v-col>
                  <v-col cols="2" class="d-flex justify-start">
                    <span class="summary-label pt-3">Mar:</span>
                    <v-text-field
                      placeholder="Required"
                      :model-value="ccType.approvedFeeMar"
                      class="summary-value"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      readonly
                      :rules="rules.required"
                      prefix="$"
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </div>
          <v-row class="d-flex justify-start ml-0">
            <v-col cols="12" lg="12" class="pb-2 pt-2">
              <v-row no-gutters class="d-flex justify-start">
                <v-col cols="12" class="d-flex justify-start">
                  <span class="summary-label"
                    >Do you charge parent fees at this facility to any closures on business days (other than statutory
                    holidays)</span
                  >
                  <v-text-field
                    placeholder="Required"
                    :model-value="getClosureFees(ccfri.hasClosureFees)"
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
              <template v-if="ccfri.hasClosureFees == CCFRI_HAS_CLOSURE_FEE_TYPES.YES">
                <v-row>
                  <v-col class="col-md-3 col-12">
                    <span class="summary-label">Closure Start Date</span>
                  </v-col>
                  <v-col class="col-md-3 col-12">
                    <span class="summary-label">End Date</span>
                  </v-col>
                  <v-col class="col-md-3 col-12">
                    <span class="summary-label">Reason</span>
                  </v-col>
                  <v-col class="col-md-3 col-12">
                    <span class="summary-label">Did parents pay for this closure?</span>
                  </v-col>
                </v-row>

                <v-text-field
                  v-if="ccfri.dates.length === 0"
                  placeholder="Required"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  :rules="rules.required"
                  readonly
                />

                <v-row v-for="(obj, index) in ccfri.dates" :key="index">
                  <v-col class="col-md-3 col-12 px-0">
                    <v-text-field
                      v-model="obj.formattedStartDate"
                      placeholder="Required"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      :rules="rules.required"
                      readonly
                    />
                  </v-col>

                  <v-col class="col-md-3 col-12">
                    <v-text-field
                      v-model="obj.formattedEndDate"
                      placeholder="Required"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      required
                      readonly
                      :rules="rules.required"
                    />
                  </v-col>

                  <v-col class="col-md-3 col-12">
                    <v-text-field
                      v-model="obj.closureReason"
                      placeholder="Required"
                      readonly
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      :rules="rules.required"
                    />
                  </v-col>

                  <v-col class="col-md-3 col-12">
                    <v-text-field
                      placeholder="Required"
                      readonly
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      :model-value="getYesNoValue(obj.feesPaidWhileClosed)"
                      :rules="rules.required"
                    />
                  </v-col>
                </v-row>
                <!-- end v for-->
              </template>
              <!-- end v if -->
            </v-col>
          </v-row>
          <v-col cols="12" lg="12" class="pb-2 pt-2">
            <v-row no-gutters class="d-flex justify-start">
              <span cols="12" class="summary-label">CCFRI Opt-In/Opt-Out Status:</span>
              <v-text-field
                cols="6"
                placeholder="Required"
                :model-value="optInOptOut"
                class="summary-value"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
              />
            </v-row>
          </v-col>

          <v-row no-gutters class="d-flex justify-start">
            <span class="summary-label"
              >Is there any other information about this facility you would like us to know?</span
            >
          </v-row>
          <v-row>
            <v-textarea
              class="col-10 summary-value-small"
              :model-value="ccfri.ccfriApplicationNotes"
              density="compact"
              flat
              variant="solo"
              hide-details
              no-resize
              readonly
              rows="3"
            />
          </v-row>
        </v-row>

        <div v-if="!isValidForm">
          <router-link :to="getRoutingPath()">
            <u class="text-error">To add this information, click here. This will bring you to a different page.</u>
          </router-link>
        </div>
      </v-expansion-panel-text>
    </v-form>
  </v-row>
</template>
<script>
import _ from 'lodash';
import SummaryExpansionPanelTitle from '@/components/guiComponents/SummaryExpansionPanelTitle.vue';
import { isChangeRequest } from '@/utils/common.js';
import {
  PATHS,
  pcfUrlGuid,
  pcfUrl,
  changeUrl,
  changeUrlGuid,
  CCFRI_HAS_CLOSURE_FEE_TYPES,
  CCFRI_FEE_CORRECT_TYPES,
} from '@/utils/constants.js';
import rules from '@/utils/rules.js';
import { mapState } from 'pinia';
import globalMixin from '@/mixins/globalMixin.js';
import { useSummaryDeclarationStore } from '@/store/summaryDeclaration.js';
import { useApplicationStore } from '@/store/application.js';

export default {
  components: { SummaryExpansionPanelTitle },
  mixins: [globalMixin],
  props: {
    ccfri: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    facilityId: {
      type: String,
      required: false,
      default: '',
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
    isProcessing: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ['isSummaryValid'],
  data() {
    return {
      PATHS,
      rules,
      isValidForm: false,
      formObj: {
        formName: 'CCFRISummary',
        formId: this.ccfri?.ccfriId,
      },
    };
  },
  computed: {
    ...mapState(useApplicationStore, ['isRenewal']),
    ...mapState(useSummaryDeclarationStore, ['isLoadingComplete']),
    ccfriChildCareTypes() {
      //if the user has not selected fee Frequency type, the summary cards will not populate with all the correct fee cards.
      //this checks for all licenses available for the facility, and displays what is missing to the user.
      if (this.ccfri?.childCareTypes?.length < this.ccfri?.childCareLicenses?.length) {
        let childCareTypesArr = [];

        const findChildCareTypes = (yearToSearch, checkForMissingPrevFees = false) => {
          this.ccfri?.childCareLicenses.forEach((category) => {
            let found = this.ccfri.childCareTypes.find((searchItem) => {
              return (
                searchItem.childCareCategoryId == category.childCareCategoryId &&
                searchItem.programYearId == yearToSearch.programYearId
              );
            });

            if (found) {
              childCareTypesArr.push(found);
            } else {
              if (checkForMissingPrevFees) {
                //check to see if childcarecat exists in last years CCFRI app.
                let pastChildCareTypefound = this.ccfri?.prevYearCcfriApp.childCareTypes.find((prevChildCareCat) => {
                  return (
                    prevChildCareCat.childCareCategoryId == category.childCareCategoryId &&
                    prevChildCareCat.programYearId == yearToSearch.programYearId
                  );
                });
                if (pastChildCareTypefound) {
                  return;
                }
                //else we are missing fees from last year, for a child care category that the user has license for.
                //This ususally happens when the facility has a new licesce for this year. Add the category to the summary
              }

              let theCat = _.cloneDeep(category);
              theCat.programYear = yearToSearch.name;
              childCareTypesArr.push(theCat);
            }
          });
        };

        findChildCareTypes(this.ccfri.currentYear);

        //only show last year fees if new app or previous year fees are incorrect
        if (
          !this.isRenewal ||
          this.ccfri.existingFeesCorrect === CCFRI_FEE_CORRECT_TYPES.NO ||
          !this.ccfri.previousCcfriId
        ) {
          findChildCareTypes(this.ccfri.prevYear);
        }

        //check if we are missing any feed cards from the last year if previous fees are correct
        else if (
          this.isRenewal &&
          this.ccfri.existingFeesCorrect === CCFRI_FEE_CORRECT_TYPES.YES &&
          this.ccfri.previousCcfriId
        ) {
          findChildCareTypes(this.ccfri.prevYear, true);
        }

        //age group asc
        childCareTypesArr.sort((a, b) => a.orderNumber - b.orderNumber);

        //sort by program year
        return childCareTypesArr.sort((a, b) => {
          const nameA = a.programYear.toUpperCase(); // ignore upper and lowercase
          const nameB = b.programYear.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          // names must be equal
          return 0;
        });
      } else {
        return _.sortBy(this.ccfri?.childCareTypes, 'orderNumber');
      }
    },
    optInOptOut() {
      switch (this.ccfri?.ccfriOptInStatus) {
        case 0:
          return 'Opt-Out';
        case 1:
          return 'Opt-In';
        default:
          return '';
      }
    },
  },
  watch: {
    isValidForm: {
      handler() {
        this.$refs.ccfriSummaryForm.validate();
        //validate for this page is kinda slow. isValidForm becomes null when validation is in process.. that throws off the warning message on SummaryDec.vue
        //if form is invalid, it will be set to false and the emit will still fire.
        if (!this.isProcessing && this.isLoadingComplete && this.isValidForm !== null) {
          this.$emit('isSummaryValid', this.formObj, this.isValidForm);
        }
      },
    },
  },
  created() {
    this.CCFRI_HAS_CLOSURE_FEE_TYPES = CCFRI_HAS_CLOSURE_FEE_TYPES;
  },
  methods: {
    getRoutingPath() {
      if (!this.ccfri && isChangeRequest(this)) {
        return changeUrl(PATHS.CCFRI_HOME, this.changeRecGuid);
      } else if (!this.ccfri) {
        pcfUrl(PATHS.CCFRI_HOME, this.programYearId);
      } else if (isChangeRequest(this)) {
        return changeUrlGuid(PATHS.CCFRI_NEW_FEES, this.changeRecGuid, this.ccfri?.ccfriId);
      } else if (this.isRenewal) {
        return pcfUrlGuid(PATHS.CCFRI_CURRENT_FEES, this.programYearId, this.ccfri?.ccfriId);
      } else {
        return pcfUrlGuid(PATHS.CCFRI_NEW_FEES, this.programYearId, this.ccfri?.ccfriId);
      }
    },
    getClosureFees(value) {
      if (value === CCFRI_HAS_CLOSURE_FEE_TYPES.YES) {
        return 'Yes';
      } else if (value === CCFRI_HAS_CLOSURE_FEE_TYPES.NO) {
        return 'No';
      }
    },
    generateProgYearText(programYear, childCareCategory) {
      if (programYear && childCareCategory) {
        return 'Parent Fees ' + programYear + ': ' + childCareCategory + ':';
      }
      return null;
    },
    generateFeeFrequencyText(feeFrequency) {
      if (feeFrequency) {
        return (
          'Your <b>highest' +
          feeFrequency.toLowerCase() +
          'parent fee before CCFRI is applied</b> in every month below.'
        );
      }
      return null;
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
  color: black !important;
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
  color: #d8292f !important;
  opacity: 1 !important;
}
</style>
