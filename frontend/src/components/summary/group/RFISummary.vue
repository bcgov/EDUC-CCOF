<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-form ref="rfiSummaryForm" v-model="isValidForm">
      <v-expansion-panel-title>
        <h4 style="color: #003466">
          RFI
          <v-icon v-if="isValidForm" color="green" size="large"> mdi-check-circle-outline </v-icon>
          <v-icon v-if="!isValidForm" color="#ff5252" size="large"> mdi-alert-circle-outline </v-icon>
          <span v-if="!isValidForm" style="color: #ff5252"
            >Your form is missing required information. Click here to view.</span
          >
        </h4>
      </v-expansion-panel-title>
      <v-expansion-panel-text eager class="ml-2 mt-2">
        <span class="summary-label-bold">Exceptional Circumstances</span>
        <v-row no-gutters class="d-flex">
          <!-- Question: Fee Increase Due to Exceptional Circumstance -->
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

          <!-- Question: Occurrence within 6 Months -->
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
                <!-- Expense Information Headers -->
                <v-row no-gutters class="d-flex">
                  <v-col
                    v-for="header in [
                      'Expense Description',
                      'Date of Expense',
                      'Payment Frequency Details',
                      'Expense Amount',
                    ]"
                    :key="header"
                    class="d-flex justify-start col-3 pa-0 pr-2"
                  >
                    <span class="summary-label">{{ header }}</span>
                  </v-col>
                </v-row>

                <!-- Empty Expense List Inputs -->
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

                <!-- Populated Expense List -->
                <v-row v-else v-for="(item, index) in rfiApp?.expenseList" :key="index" no-gutters class="d-flex">
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

                <!-- Expense Information Note -->

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
          <!-- Other Sources of Ministry Funding -->
          <v-col v-if="rfiApp?.exceptionalCircumstances && rfiApp?.circumstanceOccurWithin6Month" class="py-0">
            <span class="summary-label-bold">Other Sources of Ministry Funding</span>

            <v-row no-gutters>
              <span class="summary-label pt-3">
                Have you applied for any other sources of Ministry Funding (e.g. BC Maintenance Fund, Start-Up Grants)
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

              <!-- Funding Information Headers and Fields -->
              <v-row v-if="rfiApp?.q3" no-gutters class="d-flex">
                <v-col class="col-2 pa-0 pr-2">
                  <span class="summary-label">Funding Program</span>
                  <v-text-field
                    v-for="(item, index) in rfiApp?.fundingList"
                    :key="'program' + index"
                    :placeholder="item.fundingProgram ? '' : 'Required'"
                    class="summary-value"
                    :model-value="item.fundingProgram"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    required
                    :rules="rules.required"
                  />
                </v-col>

                <v-col class="col-2 pa-0 pr-2">
                  <span class="summary-label">Application Date</span>
                  <v-text-field
                    v-for="(item, index) in rfiApp?.fundingList"
                    :key="'date' + index"
                    :placeholder="item.date ? '' : 'Required'"
                    class="summary-value"
                    :model-value="item.date"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    required
                    :rules="rules.required"
                  />
                </v-col>

                <v-col class="col-2 pa-0 pr-2">
                  <span class="summary-label">Status of Application</span>
                  <v-text-field
                    v-for="(item, index) in rfiApp?.fundingList"
                    :key="'status' + index"
                    :placeholder="item.status ? '' : 'Required'"
                    class="summary-value"
                    :model-value="item.status"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    required
                    :rules="rules.required"
                  />
                </v-col>

                <v-col class="col-2 pa-0 pr-2">
                  <span class="summary-label">Amount Received</span>
                  <v-text-field
                    v-for="(item, index) in rfiApp?.fundingList"
                    :key="'amount' + index"
                    :placeholder="item.amount ? '' : 'Required'"
                    class="summary-value"
                    :model-value="item.amount"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    required
                    :rules="rules.required"
                  />
                </v-col>

                <v-col class="col-2 pa-0 pr-2">
                  <span class="summary-label">Expense(s)</span>
                  <v-text-field
                    v-for="(item, index) in rfiApp?.fundingList"
                    :key="'expenses' + index"
                    :placeholder="item.expenses ? '' : 'Required'"
                    class="summary-value"
                    :model-value="item.expenses"
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

        <span class="summary-label-bold">Priority Service Expansion: Increase in Hours of Operation</span>
        <v-row no-gutters class="d-flex pt-2">
          <v-col class="col-12">
            <v-row no-gutters class="d-flex">
              <v-col class="col-12">
                <v-row no-gutters class="d-flex">
                  <span class="summary-label pt-3">
                    Is your fee increase due to expanding or extending the hours of child care service available for all
                    enrolled children?
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
              <!-- Headers and Fields for Hours of Operation Details -->
              <v-col class="col-5 pa-0 pr-2">
                <span class="summary-label">Facility's previous hours of operation</span>
                <v-row no-gutters class="d-flex">
                  <v-col class="col-6 pa-0 pr-2">
                    <span class="summary-label">From</span>
                    <v-text-field
                      v-for="(item, index) in rfiApp?.expansionList"
                      :key="'previousFrom' + index"
                      :placeholder="item.timefrom ? '' : 'Required'"
                      class="summary-value"
                      :model-value="item.timefrom"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      required
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col class="col-6 pa-0 pr-2">
                    <span class="summary-label">To</span>
                    <v-text-field
                      v-for="(item, index) in rfiApp?.expansionList"
                      :key="'previousTo' + index"
                      :placeholder="item.timeto ? '' : 'Required'"
                      class="summary-value"
                      :model-value="item.timeto"
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

              <v-col class="col-3 pa-0 pr-2">
                <span class="summary-label">Facility's new hours of operation</span>
                <v-row no-gutters class="d-flex">
                  <v-col class="col-6 pa-0 pr-2">
                    <span class="summary-label">From</span>
                    <v-text-field
                      v-for="(item, index) in rfiApp?.expansionList"
                      :key="'newFrom' + index"
                      :placeholder="item.newtimefrom ? '' : 'Required'"
                      class="summary-value"
                      :model-value="item.newtimefrom"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      required
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col class="col-6 pa-0 pr-2">
                    <span class="summary-label">To</span>
                    <v-text-field
                      v-for="(item, index) in rfiApp?.expansionList"
                      :key="'newTo' + index"
                      :placeholder="item.newtimeto ? '' : 'Required'"
                      class="summary-value"
                      :model-value="item.newtimeto"
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

              <v-col class="col-2 pa-0 pr-2">
                <span class="summary-label">Date of Change</span>
                <v-text-field
                  v-for="(item, index) in rfiApp?.expansionList"
                  :key="'date' + index"
                  :placeholder="item.date ? '' : 'Required'"
                  class="summary-value"
                  :model-value="item.date"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  required
                  :rules="rules.required"
                />
              </v-col>

              <v-col class="col-2 pa-0 pr-2">
                <span class="summary-label">Amount of Expense</span>
                <v-text-field
                  v-for="(item, index) in rfiApp?.expansionList"
                  :key="'expense' + index"
                  :placeholder="item.expense ? '' : 'Required'"
                  class="summary-value"
                  :model-value="item.expense"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  required
                  :rules="rules.required"
                />
              </v-col>

              <v-col class="col-2 pa-0 pr-2">
                <span class="summary-label">Payment frequency</span>
                <v-text-field
                  v-for="(item, index) in rfiApp?.expansionList"
                  :key="'frequency' + index"
                  :placeholder="item.frequency ? '' : 'Required'"
                  class="summary-value"
                  :model-value="item.frequency"
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

        <v-row>
          <v-col v-if="rfiApp?.feeIncreaseExtendedHours" class="col-12">
            <v-row no-gutters class="d-flex">
              <v-col class="col-6 pr-4">
                <v-row no-gutters class="d-flex">
                  <span class="summary-label pt-3">Describe each of your expenses above. (e.g. Wages, Utilities)</span>
                  <v-textarea
                    placeholder="Required"
                    class="col-12 summary-value"
                    :model-value="rfiApp?.serviceExpansionDetailsNote"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    no-resize
                    rows="3"
                    required
                    :rules="rules.required"
                  />
                </v-row>
              </v-col>
              <v-col class="col-6 pr-4">
                <v-row no-gutters class="d-flex">
                  <span class="summary-label pt-3"
                    >Is there anything else about your change in hours of operation you would like us to know?</span
                  >
                  <v-textarea
                    placeholder="Required"
                    class="col-12 summary-value"
                    :model-value="rfiApp?.notes2"
                    density="compact"
                    flat
                    variant="solo"
                    hide-details
                    no-resize
                    rows="3"
                    required
                    :rules="rules.required"
                  />
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row no-gutters class="d-flex pt-2">
          <v-col class="col-12">
            <span class="summary-label-bold"
              >Priority Service Expansion: Increased Connection to Indigenous Community, Culture, and/or Language</span
            >
          </v-col>
          <v-col class="col-12">
            <v-row no-gutters class="d-flex">
              <v-col class="col-12">
                <v-row no-gutters class="d-flex">
                  <span class="summary-label pt-3"
                    >Is your fee increase due to an increased connection to Indigenous community, culture, or language
                    for all enrolled children in a Facility owned, managed, or governed by at least 51% Indigenous
                    peoples?</span
                  >
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
          <v-col v-if="rfiApp?.IndigenousConnection" class="col-12">
            <v-row no-gutters class="d-flex">
              <v-col class="col-12">
                <span class="summary-label-bold">Expense Information</span>
              </v-col>
              <v-col class="col-12 col-lg-8">
                <v-row no-gutters class="d-flex">
                  <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                    <span class="summary-label">Expense Description</span>
                  </v-col>
                  <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                    <span class="summary-label">Date of expense</span>
                  </v-col>
                  <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                    <span class="summary-label">Payment frequency details</span>
                  </v-col>
                  <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                    <span class="summary-label">Expense amount</span>
                  </v-col>
                </v-row>
                <v-row v-if="rfiApp?.indigenousExpenseList.length == 0" no-gutters class="d-flex">
                  <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                    <v-row no-gutters class="d-flex">
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
                    </v-row>
                  </v-col>
                  <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                    <v-row no-gutters class="d-flex">
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
                    </v-row>
                  </v-col>
                  <v-col class="d-flex justify-start col-3 pa-0 pr-2">
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
                  <v-col class="d-flex justify-start col-3 pa-0 pr-2">
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
                  <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                    <v-row no-gutters class="d-flex">
                      <v-text-field
                        placeholder="Required"
                        class="summary-value"
                        :model-value="item.description"
                        density="compact"
                        flat
                        variant="solo"
                        hide-details
                        required
                        :rules="rules.required"
                      />
                    </v-row>
                  </v-col>
                  <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                    <v-row no-gutters class="d-flex">
                      <v-text-field
                        placeholder="Required"
                        class="summary-value"
                        :model-value="item.date"
                        density="compact"
                        flat
                        variant="solo"
                        hide-details
                        required
                        :rules="rules.required"
                      />
                    </v-row>
                  </v-col>
                  <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                    <v-text-field
                      placeholder="Required"
                      class="summary-value"
                      :model-value="item.frequency"
                      density="compact"
                      flat
                      variant="solo"
                      hide-details
                      required
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                    <v-text-field
                      placeholder="Required"
                      class="summary-value"
                      :model-value="item.expense"
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
              <v-col class="col-12 col-lg-4 pr-4">
                <v-row no-gutters class="d-flex">
                  <v-col class="col-12">
                    <v-row no-gutters class="d-flex">
                      <span class="summary-label"
                        >Is there anything else about your expenses you would like us to know?</span
                      >
                      <v-textarea
                        placeholder="Required"
                        class="col-12 summary-value"
                        :model-value="rfiApp?.iCEIDetailsNote"
                        density="compact"
                        flat
                        variant="solo"
                        hide-details
                        no-resize
                        rows="3"
                        required
                        :rules="rules.required"
                      />
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row no-gutters class="d-flex pt-2">
          <v-col class="col-12">
            <span class="summary-label-bold">Affordable Child Care for Underserved Populations</span>
          </v-col>
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
          <v-col v-if="rfiApp?.underservedPop" class="col-12">
            <v-row no-gutters class="d-flex">
              <v-row no-gutters class="d-flex">
                <span class="summary-label"
                  >Please describe how the majority of children you provide care for represent an underserved population
                  (e.g. indigenous children, low-income families?)</span
                >
                <v-textarea
                  placeholder="Required"
                  class="col-12 summary-value"
                  :model-value="rfiApp?.underservedChildCareTypes"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  no-resize
                  rows="3"
                  required
                  :rules="rules.required"
                />
              </v-row>

              <v-row no-gutters class="d-flex">
                <span class="summary-label"
                  >How will your fee increase contribute to the overall sustainability of the
                  organization/facility?</span
                >
                <v-textarea
                  placeholder="Required"
                  class="col-12 summary-value"
                  :model-value="rfiApp?.orgsustainability"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  no-resize
                  rows="3"
                  required
                  :rules="rules.required"
                />
              </v-row>

              <v-row no-gutters class="d-flex">
                <span class="summary-label"
                  >Describe whether parents' out-of-pocket monthly cost for child care will be affected by this increase
                  (after applying reductions from CCFRI and the Affordable Child Care Benefit, and any other applicable
                  funding source). Will any families experience a cost increase, and if so, by how much?</span
                >
                <v-textarea
                  placeholder="Required"
                  class="col-12 summary-value"
                  :model-value="rfiApp?.outOfPocketFees"
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  no-resize
                  rows="3"
                  required
                  :rules="rules.required"
                />
              </v-row>
            </v-row>
          </v-col>
        </v-row>
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
import { useSummaryDeclarationStore } from '../../../store/summaryDeclaration.js';
import { useNavBarStore } from '../../../store/navBar.js';
import { useAppStore } from '../../../store/app.js';

import {
  PATHS,
  CHANGE_TYPES,
  PROGRAM_YEAR_LANGUAGE_TYPES,
  changeUrlGuid,
  pcfUrlGuid,
} from '../../../utils/constants.js';
import rules from '../../../utils/rules.js';

export default {
  name: 'RFISummary',
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

>>> ::placeholder {
  color: #ff5252 !important;
  opacity: 1;
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
