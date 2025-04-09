<template>
  <v-form ref="rfiSummaryForm" v-model="isValidForm">
    <v-expansion-panel-title>
      <SummaryExpansionPanelTitle title="RFI" :loading="isApplicationProcessing" :is-complete="isValidForm" />
    </v-expansion-panel-title>
    <v-expansion-panel-text eager>
      <div>
        <h5 class="my-2">Exceptional Circumstances</h5>
        <p class="summary-label">Is your fee increase due to an exceptional circumstance?</p>
        <v-text-field
          placeholder="Required"
          class="summary-value"
          :model-value="getYesNoValue(rfiApp?.exceptionalCircumstances)"
          density="compact"
          flat
          variant="solo"
          hide-details
          :rules="rules.required"
        />
        <template v-if="rfiApp?.exceptionalCircumstances">
          <p class="summary-label">Does the exceptional circumstance occur within 6 months of the fee increase?</p>
          <v-text-field
            placeholder="Required"
            class="summary-value"
            :model-value="getYesNoValue(rfiApp?.circumstanceOccurWithin6Month)"
            density="compact"
            flat
            variant="solo"
            hide-details
            :rules="rules.required"
          />
        </template>
      </div>

      <div v-if="rfiApp?.exceptionalCircumstances && rfiApp?.circumstanceOccurWithin6Month" class="my-2">
        <h5 class="my-2">Expense Information</h5>
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
              :rules="rules.required"
            />
          </v-col>
        </v-row>

        <p class="summary-label">Please describe the reason for each expense listed above.</p>
        <v-textarea
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
        />

        <h5 class="my-2">Other Sources of Ministry Funding</h5>
        <p class="summary-label">
          Have you applied for any other sources of Ministry Funding (e.g., BC Maintenance Fund, Start-Up Grants) for
          any of the expenses you listed?
        </p>
        <v-text-field
          placeholder="Required"
          class="summary-value"
          :model-value="getYesNoValue(rfiApp?.q3)"
          density="compact"
          flat
          variant="solo"
          hide-details
          :rules="rules.required"
        />
        <v-row v-if="rfiApp?.q3" no-gutters>
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
              :rules="rules.required"
            />
          </v-col>
        </v-row>
      </div>

      <div class="my-4">
        <h5 class="my-2">Direct Care staff Wages Increases</h5>
        <p class="summary-label">Is your fee increase due to a wage increase for Direct Care staff?</p>
        <v-text-field
          placeholder="Required"
          class="summary-value"
          :model-value="getYesNoValue(rfiApp?.feeIncreaseDueToWage)"
          density="compact"
          flat
          variant="solo"
          hide-details
          :rules="rules.required"
        />

        <div v-if="rfiApp?.feeIncreaseDueToWage">
          <template v-if="getLanguageYearLabel === PROGRAM_YEAR_LANGUAGE_TYPES.HISTORICAL">
            <p class="summary-label">
              Was the wage increase committed to (in writing) before the January 2022 release of the Funding Guidelines?
            </p>
            <v-text-field
              placeholder="Required"
              class="summary-value"
              :model-value="getYesNoValue(rfiApp?.increaseInWriting)"
              density="compact"
              flat
              variant="solo"
              hide-details
              :rules="rules.required"
            />
          </template>

          <div>
            <p class="summary-label">
              Is the wage increase part of a collective bargaining agreement for Direct Care staff at the facility?
            </p>
            <v-text-field
              placeholder="Required"
              class="summary-value"
              :model-value="getYesNoValue(rfiApp?.isBargainingAgreement)"
              density="compact"
              flat
              variant="solo"
              hide-details
              :rules="rules.required"
            />
          </div>

          <div>
            <p class="summary-label">
              Has the facility been unable to hire and/or retain Direct Care staff due to wages?
            </p>
            <v-text-field
              placeholder="Required"
              class="summary-value"
              :model-value="getYesNoValue(rfiApp?.lossOfCareStaff)"
              density="compact"
              flat
              variant="solo"
              hide-details
              :rules="rules.required"
            />
          </div>

          <div>
            <p class="summary-label">
              Is this creating challenges in maintaining the staff-to-child ratios required under the facility licence?
            </p>
            <v-text-field
              placeholder="Required"
              class="summary-value"
              :model-value="getYesNoValue(rfiApp?.healthAndSafetyConcerns)"
              density="compact"
              flat
              variant="solo"
              hide-details
              :rules="rules.required"
            />
          </div>
        </div>

        <v-row v-if="rfiApp?.feeIncreaseDueToWage" no-gutters class="d-flex">
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
              :rules="rules.required"
            />
          </v-col>
        </v-row>

        <template v-if="rfiApp?.feeIncreaseDueToWage">
          <p class="summary-label">
            Is there anything else about your facility's challenges or staffing you would like us to know?
          </p>
          <div
            v-for="(label, index) in [
              'When did your facility\'s challenges with hiring and keeping staff begin?',
              'How many Direct Care staff have left your facility due to wages?',
              'What have you done to try to recruit staff?',
              'Have you had to adjust your hours/days of operation?',
              'Is your facility unable to fill spaces due to insufficient staffing?',
              'Is there anything else you would like us to know about the wage increase(s)?',
            ]"
            :key="index"
          >
            <p class="summary-label">{{ label }}</p>
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
              :rules="rules.required"
            />
          </div>
        </template>
      </div>

      <div class="my-2">
        <h5 class="my-2">Priority Service Expansion: Increase in Hours of Operation</h5>
        <p class="summary-label">
          Is your fee increase due to expenses related to expanding or extending the hours of child care service
          available for all enrolled children?
        </p>
        <v-text-field
          placeholder="Required"
          class="summary-value"
          :model-value="getYesNoValue(rfiApp?.feeIncreaseExtendedHours)"
          density="compact"
          flat
          variant="solo"
          hide-details
          :rules="rules.required"
        />

        <template v-if="rfiApp?.feeIncreaseExtendedHours">
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
              cols="6"
              lg="auto"
              class="pr-4 pr-lg-8 pr-xl-12"
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
                :rules="rules.required"
              />
            </v-col>
          </v-row>
        </template>
      </div>

      <div class="my-4">
        <h5 class="my-2">
          Priority Service Expansion: Increasing Connection to Indigenous Community, Culture, and/or Language
        </h5>
        <p class="summary-label">
          Is your fee increase due to an increased connection to Indigenous community, culture, or language for all
          enrolled children in a Facility owned, managed, or governed by at least 51% Indigenous peoples?
        </p>
        <v-text-field
          placeholder="Required"
          class="summary-value"
          :model-value="getYesNoValue(rfiApp?.IndigenousConnection)"
          density="compact"
          flat
          variant="solo"
          hide-details
          :rules="rules.required"
        />

        <template v-if="rfiApp?.IndigenousConnection">
          <h5 class="my-2">Expense Information</h5>
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
                :rules="rules.required"
              />
            </v-col>
          </v-row>

          <v-row v-for="(item, index) in rfiApp?.indigenousExpenseList" v-else :key="index" no-gutters class="d-flex">
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
                :rules="rules.required"
              />
            </v-col>
          </v-row>

          <p class="summary-label">Is there anything else about your expenses you would like us to know?</p>
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
        </template>
      </div>

      <div>
        <h5 class="my-2">Affordable Child Care for Underserved Populations</h5>
        <p class="summary-label">Does this Facility meet all the above criteria?</p>
        <v-text-field
          placeholder="Required"
          class="summary-value"
          :model-value="getYesNoValue(rfiApp?.underservedPop)"
          density="compact"
          flat
          variant="solo"
          hide-details
          :rules="rules.required"
        />

        <template v-if="rfiApp?.underservedPop">
          <p class="summary-label">
            Please describe how the majority of children you provide care for represent an underserved population (e.g.,
            Indigenous children, low-income families).
          </p>
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

          <p class="summary-label">
            How will your fee increase contribute to the overall sustainability of the organization/facility?
          </p>
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

          <p class="summary-label">
            Describe whether parents' out-of-pocket monthly cost for child care will be affected by this increase (after
            applying reductions from CCFRI and the Affordable Child Care Benefit, and any other applicable funding
            source). Will any families experience a cost increase, and if so, by how much?
          </p>
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
        </template>
      </div>

      <router-link v-if="!isValidForm" :to="routingPath">
        <u class="text-error">To add this information, click here. This will bring you to a different page.</u>
      </router-link>
    </v-expansion-panel-text>
  </v-form>
</template>
<script>
import { mapState } from 'pinia';
import { useNavBarStore } from '@/store/navBar.js';
import summaryMixin from '@/mixins/summaryMixin.js';
import { PATHS, CHANGE_TYPES, PROGRAM_YEAR_LANGUAGE_TYPES, changeUrlGuid, pcfUrlGuid } from '@/utils/constants.js';

export default {
  name: 'RFISummary',
  mixins: [summaryMixin],
  props: {
    rfiApp: {
      type: Object,
      required: true,
    },
    ccfriId: {
      type: String,
      required: true,
    },
    programYearId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isValidForm: false,
    };
  },
  computed: {
    ...mapState(useNavBarStore, ['isChangeRequest']),
    routingPath() {
      return this.isChangeRequest
        ? changeUrlGuid(PATHS.CCFRI_RFI, this.$route.params.changeRecGuid, this.ccfriId, CHANGE_TYPES.MTFI)
        : pcfUrlGuid(PATHS.CCFRI_RFI, this.programYearId, this.ccfriId);
    },
  },
};
</script>
<style scoped>
:deep(::placeholder) {
  color: #d8292f !important;
  opacity: 1 !important;
}

:deep(.v-field__input) {
  padding-left: 0px;
}
</style>
