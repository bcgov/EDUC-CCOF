<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-form ref="rfiSummaryForm" v-model="isValidForm">
      <v-expansion-panel-title>
        <SummaryExpansionPanelTitle title="RFI" :is-complete="isValidForm" />
      </v-expansion-panel-title>
      <v-expansion-panel-text eager class="ml-2 mt-2">
        <span class="summary-label-bold">Exceptional Circumstances</span>
        <v-row no-gutters class="d-flex">
          <v-col class="py-0 cols-6">
            <span class="summary-label pt-3">Is your fee increase due to an exceptional circumstance?</span>
            <v-text-field
              placeholder="Required"
              class="summary-value"
              :model-value="getValueString(rfiApp?.exceptionalCircumstances)"
              density="compact"
              flat
              variant="solo"
              hide-details
              required
              :rules="rules.required"
            />
          </v-col>

          <v-col v-if="rfiApp?.exceptionalCircumstances" class="py-0 cols-6">
            <span class="summary-label pt-3"
              >Does the exceptional circumstance occur within 6 months of the fee increase?</span
            >
            <v-text-field
              placeholder="Required"
              class="summary-value"
              :model-value="getValueString(rfiApp?.circumstanceOccurWithin6Month)"
              density="compact"
              flat
              variant="solo"
              hide-details
              required
              :rules="rules.required"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col v-if="rfiApp?.exceptionalCircumstances && rfiApp?.circumstanceOccurWithin6Month" class="col-12 py-0">
            <span class="summary-label-bold">Expense Information</span>

            <v-row no-gutters>
              <v-col class="col-12 py-0">
                <v-row no-gutters class="d-flex">
                  <v-col
                    v-for="header in ['Expense Description', 'Date', 'Payment Frequency Details', 'Expense Amount']"
                    :key="header"
                    class="d-flex justify-start col-3 pa-0 pr-2"
                  >
                    <span class="summary-label">{{ header }}</span>
                  </v-col>
                </v-row>

                <v-row v-if="rfiApp?.expenseList.length === 0" no-gutters class="d-flex">
                  <v-col v-for="n in 4" :key="n" class="d-flex justify-start col-3 pa-0 pr-2">
                    <v-text-field
                      placeholder="Required"
                      class="summary-value"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      required
                      :rules="rules.required"
                    />
                  </v-col>
                </v-row>

                <v-row v-for="(item, index) in rfiApp?.expenseList" v-else :key="index" no-gutters class="d-flex">
                  <v-col
                    v-for="(field, key) in {
                      description: item.description,
                      date: item.date,
                      frequency: item.frequency,
                      expense: item.expense,
                    }"
                    :key="key"
                    class="d-flex justify-start col-3 pa-0 pr-2"
                  >
                    <v-text-field
                      :placeholder="field ? '' : 'Required'"
                      class="summary-value"
                      :model-value="field"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      required
                      :rules="rules.required"
                    />
                  </v-col>
                </v-row>

                <span class="summary-label"> Please describe the reason for each expense listed above. </span>
                <v-row no-gutters class="d-flex"
                  ><v-textarea
                    placeholder="Required"
                    class="mt-1 ml-0 summary-value"
                    :model-value="rfiApp?.expenseInformationNote"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    readonly
                    no-resize
                    rows="3"
                    :rules="rules.required"
                /></v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row>
          <v-col v-if="rfiApp?.exceptionalCircumstances && rfiApp?.circumstanceOccurWithin6Month" class="py-0">
            <span class="summary-label-bold">Other Sources of Ministry Funding</span>
            <br />
            <span class="summary-label pt-3">
              Have you applied for any other sources of Ministry Funding (e.g., BC Maintenance Fund, Start-Up Grants)
              for any of the expenses you listed?
            </span>
            <v-text-field
              placeholder="Required"
              class="summary-value"
              :model-value="getValueString(rfiApp?.q3)"
              density="compact"
              flat
              variant="solo"
              hide-details
              required
              :rules="rules.required"
            />
            <v-row no-gutters>
              <v-row v-if="rfiApp?.q3" no-gutters class="d-flex">
                <v-col
                  v-for="(field, key) in {
                    fundingProgram: 'Funding Program',
                    date: 'Application Date',
                    status: 'Status of Application',
                    amount: 'Amount Received',
                    expenses: 'Expense(s)',
                  }"
                  :key="key"
                  class="col-2 pa-0 pr-2"
                >
                  <span class="summary-label">{{ field }}</span>

                  <v-row v-if="rfiApp?.fundingList.length === 0" no-gutters class="d-flex">
                    <v-text-field
                      v-for="n in 1"
                      :key="n"
                      placeholder="Required"
                      class="summary-value"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      required
                      :rules="rules.required"
                    />
                  </v-row>

                  <v-text-field
                    v-for="(item, index) in rfiApp?.fundingList"
                    v-else
                    :key="key + index"
                    :placeholder="item[key] ? '' : 'Required'"
                    class="summary-value"
                    :model-value="item[key]"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    required
                    :rules="rules.required"
                  />
                </v-col>
              </v-row>
            </v-row>
          </v-col>
        </v-row>

        <span class="summary-label-bold">Direct Care staff Wages Increases</span>
        <v-row no-gutters class="d-flex">
          <v-col class="col-12">
            <span class="summary-label pt-3">Is your fee increase due to a wage increase for Direct Care staff?</span>
            <v-text-field
              placeholder="Required"
              class="summary-value"
              :model-value="getValueString(rfiApp?.feeIncreaseDueToWage)"
              density="compact"
              flat
              variant="solo"
              hide-details
              required
              :rules="rules.required"
            />
          </v-col>
        </v-row>

        <div v-if="rfiApp?.feeIncreaseDueToWage" class="col-12">
          <v-row no-gutters class="d-flex">
            <v-col v-if="languageYearLabel == programYearTypes.HISTORICAL" class="py-0 cols-6">
              <span class="summary-label pt-3"
                >Was the wage increase committed to (in writing) before the January 2022 release of the Funding
                Guidelines?</span
              >
              <v-text-field
                placeholder="Required"
                class="summary-value"
                :model-value="getValueString(rfiApp?.increaseInWriting)"
                density="compact"
                flat
                variant="solo"
                hide-details
                required
                :rules="rules.required"
              />
            </v-col>

            <v-col class="py-0 cols-6">
              <span class="summary-label pt-3"
                >Is the wage increase part of a collective bargaining agreement for Direct Care staff at the
                facility?</span
              >
              <v-text-field
                placeholder="Required"
                class="summary-value"
                :model-value="getValueString(rfiApp?.isBargainingAgreement)"
                density="compact"
                flat
                variant="solo"
                hide-details
                required
                :rules="rules.required"
              />
            </v-col>

            <v-col class="py-0 cols-6">
              <span class="summary-label pt-3"
                >Has the facility been unable to hire and/or retain Direct Care staff due to wages?</span
              >
              <v-text-field
                placeholder="Required"
                class="summary-value"
                :model-value="getValueString(rfiApp?.lossOfCareStaff)"
                density="compact"
                flat
                variant="solo"
                hide-details
                required
                :rules="rules.required"
              />
            </v-col>

            <v-col class="py-0 cols-6">
              <span class="summary-label pt-3"
                >Is this creating challenges in maintaining the staff-to-child ratios required under the facility
                licence?</span
              >
              <v-text-field
                placeholder="Required"
                class="summary-value"
                :model-value="getValueString(rfiApp?.healthAndSafetyConcerns)"
                density="compact"
                flat
                variant="solo"
                hide-details
                required
                :rules="rules.required"
              />
            </v-col>
          </v-row>
        </div>

        <v-col v-if="rfiApp?.feeIncreaseDueToWage == 1" class="col-12">
          <v-row no-gutters class="d-flex">
            <v-col
              v-for="header in [
                'Number of staff receiving wage increase',
                'Direct Care staff role',
                'Wage before increase',
                'Wage after increase',
                'Average hours per week at this facility',
                'Date',
              ]"
              :key="header"
              class="d-flex justify-start col-2 pa-0 pr-2"
            >
              <span class="summary-label">{{ header }}</span>
            </v-col>
          </v-row>

          <v-row v-if="rfiApp?.wageList.length === 0" no-gutters class="d-flex">
            <v-col v-for="n in 6" :key="n" class="d-flex justify-start col-2 pa-0 pr-2">
              <v-text-field
                placeholder="Required"
                class="summary-value"
                density="compact"
                flat
                variant="solo"
                hide-details
                required
                :rules="rules.required"
              />
            </v-col>
          </v-row>

          <v-row v-for="(item, index) in rfiApp?.wageList" v-else :key="index" no-gutters class="d-flex">
            <v-col
              v-for="(field, key) in {
                staffNumber: item.staffNumber,
                staffRole: item.staffRole,
                wageBeforeIncrease: item.wageBeforeIncrease,
                wageAfterIncrease: item.wageAfterIncrease,
                averageHours: item.averageHours,
                wageDate: item.wageDate,
              }"
              :key="key"
              class="d-flex justify-start col-2 pa-0 pr-2"
            >
              <v-text-field
                :placeholder="field ? '' : 'Required'"
                class="summary-value"
                :model-value="field"
                density="compact"
                flat
                variant="solo"
                hide-details
                required
                :rules="rules.required"
              />
            </v-col>
          </v-row>
        </v-col>

        <div v-if="rfiApp?.feeIncreaseDueToWage" class="col-12">
          <span class="summary-label"
            >Is there anything else about your facility's challenges or staffing you would like us to know?</span
          >
          <v-row no-gutters class="d-flex">
            <v-col
              v-for="(label, index) in [
                'When did your facility\'s challenges with hiring and keeping staff begin?',
                'How many Direct Care staff have left your facility due to wages?',
                'What have you done to try to recruit staff?',
                'Have you had to adjust your hours/days of operation?',
                'Is your facility unable to fill spaces due to insufficient staffing?',
                'Is there anything else you would like us to know about the wage increase(s)?',
              ]"
              :key="index"
              class="pr-4"
              cols="12"
            >
              <span class="summary-label pt-3">{{ label }}</span>
              <v-textarea
                placeholder="Required"
                class="mt-1 ml-0 summary-value"
                :model-value="rfiApp?.[`textbox${index + 1}`]"
                density="compact"
                flat
                variant="solo"
                hide-details
                no-resize
                rows="3"
                required
                :rules="rules.required"
              />
            </v-col>
          </v-row>
        </div>

        <span class="summary-label-bold">Priority Service Expansion: Increase in Hours of Operation</span>
        <v-row no-gutters class="d-flex pt-2">
          <v-col class="col-12">
            <v-row no-gutters class="d-flex">
              <v-col class="col-12">
                <v-row no-gutters class="d-flex">
                  <span class="summary-label pt-3">
                    Is your fee increase due to expenses related to expanding or extending the hours of child care
                    service available for all enrolled children?
                  </span>
                  <v-text-field
                    placeholder="Required"
                    class="summary-value"
                    :model-value="getValueString(rfiApp?.feeIncreaseExtendedHours)"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    required
                    :rules="rules.required"
                  />
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-if="rfiApp?.feeIncreaseExtendedHours" class="col-12">
            <v-row no-gutters class="d-flex">
              <v-col
                v-for="(field, key) in {
                  timefrom: 'Previous Hours From',
                  timeto: 'Previous Hours To',
                  newtimefrom: 'New Hours From',
                  newtimeto: 'New Hours To',
                  date: 'Date of Change',
                  expense: 'Amount of Expense',
                  frequency: 'Payment frequency',
                }"
                :key="key"
                :class="key.includes('From') || key.includes('To') ? 'col-3 pa-0 pr-2' : 'col-2 pa-0 pr-2'"
              >
                <span class="summary-label">{{ field }}</span>

                <v-row v-if="rfiApp?.expansionList.length === 0" no-gutters class="d-flex">
                  <v-text-field
                    v-for="n in 1"
                    :key="n"
                    placeholder="Required"
                    class="summary-value"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    required
                    :rules="rules.required"
                  />
                </v-row>

                <v-text-field
                  v-for="(item, index) in rfiApp?.expansionList"
                  :key="key + index"
                  :placeholder="item[key] ? '' : 'Required'"
                  class="summary-value"
                  :model-value="
                    ['timefrom', 'timeto', 'newtimefrom', 'newtimeto'].includes(key)
                      ? formatTime24to12(item[key])
                      : item[key]
                  "
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  required
                  :rules="rules.required"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <span class="summary-label-bold"
          >Priority Service Expansion: Increasing Connection to Indigenous Community, Culture, and/or Language</span
        >
        <v-row no-gutters class="d-flex pt-2">
          <v-col class="col-12">
            <v-row no-gutters class="d-flex">
              <v-col class="col-12">
                <v-row no-gutters class="d-flex">
                  <span class="summary-label pt-3">
                    Is your fee increase due to an increased connection to Indigenous community, culture, or language
                    for all enrolled children in a Facility owned, managed, or governed by at least 51% Indigenous
                    peoples?
                  </span>
                  <v-text-field
                    placeholder="Required"
                    class="summary-value"
                    :model-value="getValueString(rfiApp?.IndigenousConnection)"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    required
                    :rules="rules.required"
                  />
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row>
          <v-col v-if="rfiApp?.IndigenousConnection" class="col-12">
            <span class="summary-label-bold">Expense Information</span>

            <v-row no-gutters class="d-flex">
              <v-col class="col-12 col-lg-8">
                <v-row no-gutters class="d-flex">
                  <v-col
                    v-for="(label, key) in {
                      description: 'Expense Description',
                      date: 'Date',
                      frequency: 'Payment Frequency Details',
                      expense: 'Expense Amount',
                    }"
                    :key="key"
                    class="d-flex justify-start col-3 pa-0 pr-2"
                  >
                    <span class="summary-label">{{ label }}</span>
                  </v-col>
                </v-row>

                <v-row v-if="rfiApp?.indigenousExpenseList.length === 0" no-gutters class="d-flex">
                  <v-col v-for="n in 4" :key="n" class="d-flex justify-start col-3 pa-0 pr-2">
                    <v-text-field
                      placeholder="Required"
                      class="summary-value"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      required
                      :rules="rules.required"
                    />
                  </v-col>
                </v-row>

                <v-row
                  v-for="(item, index) in rfiApp?.indigenousExpenseList"
                  v-else
                  :key="index"
                  no-gutters
                  class="d-flex"
                >
                  <v-col
                    v-for="key in ['description', 'date', 'frequency', 'expense']"
                    :key="key + index"
                    class="d-flex justify-start col-3 pa-0 pr-2"
                  >
                    <v-text-field
                      placeholder="Required"
                      class="summary-value"
                      :model-value="item[key]"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      required
                      :rules="rules.required"
                    />
                  </v-col>
                </v-row>

                <span class="summary-label">Is there anything else about your expenses you would like us to know?</span>
                <v-row no-gutters class="d-flex">
                  <v-textarea
                    placeholder="Required"
                    class="mt-1 ml-0 summary-value"
                    :model-value="rfiApp?.iCEIDetailsNote"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    no-resize
                    rows="3"
                    :rules="rules.required"
                  />
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <span class="summary-label-bold">Affordable Child Care for Underserved Populations</span>
        <v-row no-gutters class="d-flex pt-2">
          <v-col class="col-12">
            <v-row no-gutters class="d-flex">
              <v-col class="col-12">
                <v-row no-gutters class="d-flex">
                  <span class="summary-label">Does this Facility meet all the above criteria?</span>
                  <br />
                  <v-text-field
                    placeholder="Required"
                    class="summary-value col-12"
                    :model-value="getValueString(rfiApp?.underservedPop)"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    required
                    :rules="rules.required"
                  />
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <div v-if="rfiApp?.underservedPop === 1">
          <span class="summary-label">
            Please describe how the majority of children you provide care for represent an underserved population (e.g.,
            Indigenous children, low-income families).
          </span>
          <v-row no-gutters class="d-flex">
            <v-textarea
              placeholder="Required"
              class="mt-1 ml-0 summary-value mb-6"
              :model-value="rfiApp?.underservedChildCareTypes"
              density="compact"
              flat
              variant="solo"
              hide-details
              no-resize
              rows="3"
              :rules="rules.required"
            />
          </v-row>

          <span class="summary-label pt-3">
            How will your fee increase contribute to the overall sustainability of the organization/facility?
          </span>
          <v-row no-gutters class="d-flex">
            <v-textarea
              placeholder="Required"
              class="mt-1 ml-0 summary-value mb-6"
              :model-value="rfiApp?.orgsustainability"
              density="compact"
              flat
              variant="solo"
              hide-details
              no-resize
              rows="3"
              :rules="rules.required"
            />
          </v-row>

          <span class="summary-label pt-3">
            Describe whether parents' out-of-pocket monthly cost for child care will be affected by this increase (after
            applying reductions from CCFRI and the Affordable Child Care Benefit, and any other applicable funding
            source). Will any families experience a cost increase, and if so, by how much?
          </span>
          <v-row no-gutters class="d-flex">
            <v-textarea
              placeholder="Required"
              class="mt-1 ml-0 summary-value mb-6"
              :model-value="rfiApp?.outOfPocketFees"
              density="compact"
              flat
              variant="solo"
              hide-details
              no-resize
              rows="3"
              :rules="rules.required"
            />
          </v-row>
        </div>

        <v-row v-if="!isValidForm" class="d-flex justify-start">
          <v-col cols="6" lg="4" class="pb-0 pt-0">
            <v-row no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <router-link :to="getLink()">
                  <span style="color: #d40d19; text-underline: black"
                    ><u>To add this information, click here. This will bring you to a different page.</u></span
                  >
                </router-link>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-expansion-panel-text>
    </v-form>
  </v-row>
</template>
<script>
import { mapState } from 'pinia';
import SummaryExpansionPanelTitle from '@/components/guiComponents/SummaryExpansionPanelTitle.vue';
import { useSummaryDeclarationStore } from '@/store/summaryDeclaration.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useAppStore } from '@/store/app.js';
import { formatTime24to12 } from '@/utils/format';
import { PATHS, CHANGE_TYPES, PROGRAM_YEAR_LANGUAGE_TYPES, changeUrlGuid, pcfUrlGuid } from '@/utils/constants.js';
import rules from '@/utils/rules.js';

export default {
  name: 'RFISummary',
  components: { SummaryExpansionPanelTitle },
  props: {
    rfiApp: {
      type: Object,
      required: true,
    },
    ccfriId: {
      type: String,
      required: true,
    },
    facilityId: {
      type: String,
      required: false,
      default: '',
    },
    programYearId: {
      type: String,
      required: false,
      default: '',
    },
  },
  emits: ['isSummaryValid'],
  data() {
    return {
      PATHS,
      rules,
      isValidForm: true,
      formObj: {
        formName: 'RFISummary',
        formId: this.facilityId,
      },
    };
  },
  computed: {
    ...mapState(useSummaryDeclarationStore, ['isLoadingComplete']),
    ...mapState(useNavBarStore, ['isChangeRequest']),
    ...mapState(useAppStore, ['getFundingUrl', 'getLanguageYearLabel']),
    languageYearLabel() {
      return this.getLanguageYearLabel;
    },
    programYearTypes() {
      return PROGRAM_YEAR_LANGUAGE_TYPES;
    },
  },
  watch: {
    isLoadingComplete: {
      handler: function (val) {
        if (val) {
          this.$emit('isSummaryValid', this.formObj, this.isValidForm);
        }
      },
    },
  },
  created() {
    this.formatTime24to12 = formatTime24to12;
  },
  methods: {
    getLink() {
      if (this.isChangeRequest)
        return changeUrlGuid(PATHS.CCFRI_RFI, this.$route.params.changeRecGuid, this.ccfriId, CHANGE_TYPES.MTFI);
      return pcfUrlGuid(PATHS.CCFRI_RFI, this.programYearId, this.ccfriId);
    },
    getValueString(val) {
      if (val === 1) {
        return 'YES';
      } else if (val === 0) {
        return 'NO';
      }

      return val;
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

:deep(::placeholder) {
  color: #d8292f !important;
  opacity: 1 !important;
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

.summary-value {
  color: black;
  font-size: small !important;
  font-weight: bold !important;
}
</style>
