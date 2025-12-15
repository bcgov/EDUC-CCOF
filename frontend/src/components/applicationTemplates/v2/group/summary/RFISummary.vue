<template>
  <v-form ref="rfiSummaryForm" v-model="isValidForm">
    <v-expansion-panel-title>
      <SummaryExpansionPanelTitle
        title="Request for Information (RFI)"
        :loading="isApplicationProcessing"
        :is-complete="isValidForm"
      />
    </v-expansion-panel-title>
    <v-expansion-panel-text eager>
      <div class="mb-8">
        <div>
          <h4 class="my-2">Exceptional Circumstances</h4>
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

        <template v-if="rfiApp?.exceptionalCircumstances && rfiApp?.circumstanceOccurWithin6Month">
          <div class="mb-4">
            <h5 class="my-2">Expense Information</h5>
            <v-data-table
              :headers="exceptionalCircumstancesExpenseInfoTableHeaders"
              :items="rfiApp?.expenseList"
              :mobile="null"
              mobile-breakpoint="md"
              class="elevation-2 mb-6"
            >
              <template #no-data>
                <v-text-field
                  placeholder="Required"
                  readonly
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  :rules="rules.required"
                  class="center-placeholder"
                />
              </template>
              <template #[`item.description`]="{ item }">
                <v-text-field
                  :model-value="item.description"
                  placeholder="Required"
                  readonly
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  :rules="rules.required"
                />
              </template>
              <template #[`item.date`]="{ item }">
                <v-text-field
                  :model-value="item.date"
                  placeholder="Required"
                  readonly
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  :rules="rules.required"
                />
              </template>
              <template #[`item.frequency`]="{ item }">
                <v-text-field
                  :model-value="item.frequency"
                  placeholder="Required"
                  readonly
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  :rules="rules.required"
                />
              </template>
              <template #[`item.expense`]="{ item }">
                <v-text-field
                  :model-value="item.expense"
                  placeholder="Required"
                  readonly
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  :rules="rules.required"
                />
              </template>
            </v-data-table>

            <div class="my-2">
              <p class="summary-label">Please describe the reason for each expense listed above.</p>
              <p v-if="rfiApp?.expenseInformationNote" class="mt-2">{{ rfiApp?.expenseInformationNote }}</p>
              <v-text-field
                v-else
                placeholder="Required"
                :model-value="rfiApp?.expenseInformationNote"
                density="compact"
                flat
                variant="solo"
                hide-details
                readonly
                :rules="rules.required"
              />
            </div>
          </div>

          <div class="my-4">
            <h5 class="mb-2">Other Sources of Ministry Funding</h5>
            <p class="summary-label">
              Have you applied for any other sources of Ministry Funding (e.g., BC Maintenance Fund, Start-Up Grants)
              for any of the expenses you listed?
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
            <v-data-table
              v-if="rfiApp?.q3"
              :headers="otherSourcesFundingTableHeaders"
              :items="rfiApp?.fundingList"
              :mobile="null"
              mobile-breakpoint="lg"
              class="elevation-2 mb-6"
            >
              <template #no-data>
                <v-text-field
                  placeholder="Required"
                  readonly
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  :rules="rules.required"
                  class="center-placeholder"
                />
              </template>
              <template #[`item.fundingProgram`]="{ item }">
                <v-text-field
                  :model-value="item.fundingProgram"
                  placeholder="Required"
                  readonly
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  :rules="rules.required"
                />
              </template>
              <template #[`item.date`]="{ item }">
                <v-text-field
                  :model-value="item.date"
                  placeholder="Required"
                  readonly
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  :rules="rules.required"
                />
              </template>
              <template #[`item.status`]="{ item }">
                <v-text-field
                  :model-value="item.status"
                  placeholder="Required"
                  readonly
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  :rules="rules.required"
                />
              </template>
              <template #[`item.amount`]="{ item }">
                <v-text-field
                  :model-value="item.amount"
                  placeholder="Required"
                  readonly
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  :rules="rules.required"
                />
              </template>
              <template #[`item.expenses`]="{ item }">
                <v-text-field
                  :model-value="item.expenses"
                  placeholder="Required"
                  readonly
                  density="compact"
                  flat
                  variant="solo"
                  hide-details
                  :rules="rules.required"
                />
              </template>
            </v-data-table>
          </div>
        </template>
      </div>

      <div class="my-8">
        <h4 class="my-2">Direct Care Staff Wages Increases</h4>
        <p class="summary-label">Is your fee increase due to a wage increase for Direct Care Staff?</p>
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

        <template v-if="rfiApp?.feeIncreaseDueToWage">
          <div class="mb-2">
            <template v-if="getLanguageYearLabel === PROGRAM_YEAR_LANGUAGE_TYPES.HISTORICAL">
              <p class="summary-label">
                Was the wage increase committed to (in writing) before the January 2022 release of the Funding
                Guidelines?
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
                Is the wage increase part of a collective bargaining agreement for Direct Care Staff at the facility?
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
                Has the facility been unable to hire or retain Direct Care Staff due to wages?
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
                Is this creating challenges in maintaining the staff-to-child ratios required under the facility
                licence?
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
          <v-data-table
            :headers="wageIncreasesTableHeaders"
            :items="rfiApp?.wageList"
            :mobile="null"
            mobile-breakpoint="lg"
            class="elevation-2 mb-6"
          >
            <template #no-data>
              <v-text-field
                placeholder="Required"
                readonly
                density="compact"
                flat
                variant="solo"
                hide-details
                :rules="rules.required"
                class="center-placeholder"
              />
            </template>
            <template #[`item.staffNumber`]="{ item }">
              <v-text-field
                :model-value="item.staffNumber"
                placeholder="Required"
                readonly
                density="compact"
                flat
                variant="solo"
                hide-details
                :rules="rules.required"
              />
            </template>
            <template #[`item.staffRole`]="{ item }">
              <v-text-field
                :model-value="item.staffRole"
                placeholder="Required"
                readonly
                density="compact"
                flat
                variant="solo"
                hide-details
                :rules="rules.required"
              />
            </template>
            <template #[`item.wageBeforeIncrease`]="{ item }">
              <v-text-field
                :model-value="item.wageBeforeIncrease"
                placeholder="Required"
                readonly
                density="compact"
                flat
                variant="solo"
                hide-details
                :rules="rules.required"
              />
            </template>
            <template #[`item.wageAfterIncrease`]="{ item }">
              <v-text-field
                :model-value="item.wageAfterIncrease"
                placeholder="Required"
                readonly
                density="compact"
                flat
                variant="solo"
                hide-details
                :rules="rules.required"
              />
            </template>
            <template #[`item.averageHours`]="{ item }">
              <v-text-field
                :model-value="item.averageHours"
                placeholder="Required"
                readonly
                density="compact"
                flat
                variant="solo"
                hide-details
                :rules="rules.required"
              />
            </template>
            <template #[`item.wageDate`]="{ item }">
              <v-text-field
                :model-value="item.wageDate"
                placeholder="Required"
                readonly
                density="compact"
                flat
                variant="solo"
                hide-details
                :rules="rules.required"
              />
            </template>
          </v-data-table>
          <div>
            <p class="summary-label mb-2">
              Is there anything else about your facility's challenges or staffing you would like us to know?
            </p>
            <div
              v-for="(label, index) in [
                'When did your facility\'s challenges with hiring and keeping staff begin?',
                'How many Direct Care Staff have left your facility due to wages?',
                'What have you done to try to recruit staff?',
                'Have you had to adjust your hours/days of operation?',
                'Is your facility unable to fill spaces due to insufficient staffing?',
                'Is there anything else you would like us to know about the wage increase(s)?',
              ]"
              :key="index"
              class="my-2"
            >
              <p class="summary-label">{{ label }}</p>
              <p v-if="rfiApp?.[`textbox${index + 1}`]" class="mt-2">{{ rfiApp?.[`textbox${index + 1}`] }}</p>
              <v-text-field
                v-else
                placeholder="Required"
                :model-value="rfiApp?.[`textbox${index + 1}`]"
                density="compact"
                flat
                variant="solo"
                hide-details
                :rules="rules.required"
              />
            </div>
          </div>
        </template>
      </div>

      <div class="my-8">
        <h4 class="my-2">Priority Service Expansion: Increase in Hours</h4>
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
        <v-data-table
          v-if="rfiApp?.feeIncreaseExtendedHours"
          :headers="expansionHoursOperationTableHeaders"
          :items="rfiApp?.expansionList"
          :mobile="null"
          mobile-breakpoint="lg"
          class="elevation-2 mb-6"
        >
          <template #no-data>
            <v-text-field
              placeholder="Required"
              readonly
              density="compact"
              flat
              variant="solo"
              hide-details
              :rules="rules.required"
              class="center-placeholder"
            />
          </template>
          <template #[`item.timefrom`]="{ item }">
            <v-text-field
              :model-value="formatTime24to12(item.timefrom)"
              placeholder="Required"
              density="compact"
              flat
              variant="solo"
              hide-details
              :rules="rules.required"
              readonly
            />
          </template>
          <template #[`item.timeto`]="{ item }">
            <v-text-field
              :model-value="formatTime24to12(item.timeto)"
              placeholder="Required"
              density="compact"
              flat
              variant="solo"
              hide-details
              required
              readonly
              :rules="rules.required"
            />
          </template>
          <template #[`item.newtimefrom`]="{ item }">
            <v-text-field
              :model-value="formatTime24to12(item.newtimefrom)"
              placeholder="Required"
              readonly
              density="compact"
              flat
              variant="solo"
              hide-details
              :rules="rules.required"
            />
          </template>
          <template #[`item.newtimeto`]="{ item }">
            <v-text-field
              :model-value="formatTime24to12(item.newtimeto)"
              placeholder="Required"
              readonly
              density="compact"
              flat
              variant="solo"
              hide-details
              :rules="rules.required"
            />
          </template>
          <template #[`item.date`]="{ item }">
            <v-text-field
              :model-value="item.date"
              placeholder="Required"
              readonly
              density="compact"
              flat
              variant="solo"
              hide-details
              :rules="rules.required"
            />
          </template>
          <template #[`item.expense`]="{ item }">
            <v-text-field
              :model-value="item.expense"
              placeholder="Required"
              readonly
              density="compact"
              flat
              variant="solo"
              hide-details
              :rules="rules.required"
            />
          </template>
          <template #[`item.frequency`]="{ item }">
            <v-text-field
              :model-value="item.frequency"
              placeholder="Required"
              readonly
              density="compact"
              flat
              variant="solo"
              hide-details
              :rules="rules.required"
            />
          </template>
        </v-data-table>
      </div>

      <div class="my-8">
        <h4 class="my-2">
          Priority Service Expansion: Increasing Connection to Indigenous Community, Culture, and/or Language
        </h4>
        <p class="summary-label">
          Is your fee increase due to increasing opportunities for all enrolled children in a facility majority owned,
          managed or governed by First Nations, Métis, Inuit or Indigenous organizations to connect with Indigenous
          languages, cultures, and communities?
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
          <v-data-table
            :headers="pseIndigenousExpenseInfoTableHeaders"
            :items="rfiApp?.indigenousExpenseList"
            :mobile="null"
            mobile-breakpoint="md"
            class="elevation-2 mb-6"
          >
            <template #no-data>
              <v-text-field
                placeholder="Required"
                readonly
                density="compact"
                flat
                variant="solo"
                hide-details
                :rules="rules.required"
                class="center-placeholder"
              />
            </template>
            <template #[`item.description`]="{ item }">
              <v-text-field
                :model-value="item.description"
                placeholder="Required"
                readonly
                density="compact"
                flat
                variant="solo"
                hide-details
                :rules="rules.required"
              />
            </template>
            <template #[`item.date`]="{ item }">
              <v-text-field
                :model-value="item.date"
                placeholder="Required"
                readonly
                density="compact"
                flat
                variant="solo"
                hide-details
                :rules="rules.required"
              />
            </template>
            <template #[`item.frequency`]="{ item }">
              <v-text-field
                :model-value="item.frequency"
                placeholder="Required"
                readonly
                density="compact"
                flat
                variant="solo"
                hide-details
                :rules="rules.required"
              />
            </template>
            <template #[`item.expense`]="{ item }">
              <v-text-field
                :model-value="item.expense"
                placeholder="Required"
                readonly
                density="compact"
                flat
                variant="solo"
                hide-details
                :rules="rules.required"
              />
            </template>
          </v-data-table>

          <p class="summary-label">Is there anything else about your expenses you would like us to know?</p>
          <p v-if="rfiApp?.iCEIDetailsNote" class="mt-2">{{ rfiApp?.iCEIDetailsNote }}</p>
          <v-text-field
            v-else
            placeholder="Required"
            :model-value="rfiApp?.iCEIDetailsNote"
            density="compact"
            flat
            variant="solo"
            hide-details
            :rules="rules.required"
          />
        </template>
      </div>

      <div class="my-8">
        <h4 class="my-2">Affordable Child Care for Underserved Populations</h4>
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
          <div>
            <p class="summary-label">
              Please describe how the majority of children you provide care for represent an underserved population
              (e.g. First Nations, Métis, Inuit, Indigenous or low-income families)?
            </p>
            <p v-if="rfiApp?.underservedChildCareTypes" class="mt-2">{{ rfiApp?.underservedChildCareTypes }}</p>
            <v-text-field
              v-else
              placeholder="Required"
              :model-value="rfiApp?.underservedChildCareTypes"
              density="compact"
              flat
              variant="solo"
              hide-details
              :rules="rules.required"
            />
          </div>

          <div class="my-2">
            <p class="summary-label">
              How will your fee increase contribute to the overall sustainability of the organization/facility?
            </p>
            <p v-if="rfiApp?.orgsustainability" class="mt-2">{{ rfiApp?.orgsustainability }}</p>
            <v-text-field
              v-else
              placeholder="Required"
              :model-value="rfiApp?.orgsustainability"
              density="compact"
              flat
              variant="solo"
              hide-details
              :rules="rules.required"
            />
          </div>

          <div class="my-2">
            <p class="summary-label">
              Describe whether parents' out-of-pocket monthly cost for child care will be affected by this increase
              (after applying reductions from CCFRI and the Affordable Child Care Benefit, and any other applicable
              funding source). Will any families experience a cost increase, and if so, by how much?
            </p>
            <p v-if="rfiApp?.outOfPocketFees" class="mt-2">{{ rfiApp?.outOfPocketFees }}</p>
            <v-text-field
              v-else
              placeholder="Required"
              :model-value="rfiApp?.outOfPocketFees"
              density="compact"
              flat
              variant="solo"
              hide-details
              :rules="rules.required"
            />
          </div>
        </template>
      </div>

      <router-link v-if="!isValidForm" :to="routingPath">
        <u class="text-error">To add this information, click here. This will bring you to a different page.</u>
      </router-link>
    </v-expansion-panel-text>
  </v-form>
</template>
<script>
import summaryMixin from '@/mixins/summaryMixin.js';
import { useNavBarStore } from '@/store/navBar.js';
import { CHANGE_TYPES, changeUrlGuid, PATHS, pcfUrlGuid } from '@/utils/constants.js';
import { mapState } from 'pinia';

export default {
  name: 'RFISummaryV2',
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
      exceptionalCircumstancesExpenseInfoTableHeaders: [
        { title: 'Expense Description', value: 'description', sortable: true, width: '35%' },
        { title: 'Date', value: 'date', sortable: true, width: '20%' },
        { title: 'Payment Frequency Details', value: 'frequency', sortable: true },
        { title: 'Expense Amount', value: 'expense', sortable: true },
      ],
      otherSourcesFundingTableHeaders: [
        { title: 'Funding Program', value: 'fundingProgram', sortable: true },
        { title: 'Application Date', value: 'date', sortable: true },
        { title: 'Status of Application', value: 'status', sortable: true },
        { title: 'Amount Received', value: 'amount', sortable: true },
        { title: 'Expense(s)', value: 'expenses', sortable: true },
      ],
      wageIncreasesTableHeaders: [
        { title: 'Number of staff receiving wage increase', value: 'staffNumber', sortable: true },
        { title: 'Direct Care Staff role', value: 'staffRole', sortable: true },
        { title: 'Wage before increase', value: 'wageBeforeIncrease', sortable: true },
        { title: 'Wage after increase', value: 'wageAfterIncrease', sortable: true },
        { title: 'Average hours per week at this facility', value: 'averageHours', sortable: true },
        { title: 'Date', value: 'wageDate', sortable: true, width: '16%' },
      ],
      expansionHoursOperationTableHeaders: [
        { title: 'Previous Hours From', value: 'timefrom', sortable: true },
        { title: 'Previous Hours To', value: 'timeto', sortable: true },
        { title: 'New Hours From', value: 'newtimefrom', sortable: true },
        { title: 'New Hours To', value: 'newtimeto', sortable: true },
        { title: 'Date of Change', value: 'date', sortable: true },
        { title: 'Amount of Expense', value: 'expense', sortable: true },
        { title: 'Payment frequency', value: 'frequency', sortable: true },
      ],
      pseIndigenousExpenseInfoTableHeaders: [
        { title: 'Expense Description', value: 'description', sortable: true, width: '35%' },
        { title: 'Date', value: 'date', sortable: true, width: '20%' },
        { title: 'Payment Frequency Details', value: 'frequency', sortable: true },
        { title: 'Expense Amount', value: 'expense', sortable: true },
      ],
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

:deep(.center-placeholder .v-field__input) {
  text-align: center;
}
</style>
