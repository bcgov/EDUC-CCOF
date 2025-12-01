<template>
  <v-form ref="form" v-model="isValidForm" class="mx-8">
    <v-skeleton-loader
      v-if="isApplicationProcessing || loading"
      :loading="isApplicationProcessing || loading"
      type="table-tbody"
      class="mb-12"
    />
    <v-container v-else>
      <ApplicationPCFHeader
        page-title="Parent Fee Increase - Request for Information"
        :program-year="formattedProgramYear"
        :facility="currentFacility"
      />
      <div class="my-10">
        <p>
          You have entered a parent fee above the {{ formattedProgramYear }} fee increase limit. Fee increases over the
          limit will be assessed under the Parent Fee Increase Exceptions policy. See the
          <a :href="fundingUrl" target="_blank">Funding Guidelines</a> for more information.
        </p>
        <p>
          Complete this section to provide more information about your fee increase, or click “Back” to return to the
          previous page.
        </p>
      </div>
      <v-card elevation="6" class="my-10 rounded-lg">
        <p class="px-6 py-3 card-title font-weight-bold">Exceptional Circumstances</p>
        <div class="px-8 py-4">
          <p class="text-h6 text-primary">
            As outlined in the <a :href="fundingUrl" target="_blank">Funding Guidelines</a>, this exception applies to
            sudden and unexpected expenses that:
          </p>
          <ul class="ml-10 text-primary">
            <li>Are outside of the organization's control and/or outside of the scope of regular cost increases;</li>
            <li>Address an immediate health or safety concern or are needed for the facility to operate; and</li>
            <li>Occur within six months of the requested fee increase.</li>
          </ul>
          <div class="mt-6">
            <label for="exceptionalCircumstances">Is your fee increase due to an exceptional circumstance?</label>
            <v-radio-group
              id="exceptionalCircumstances"
              v-model="model.exceptionalCircumstances"
              class="radio-label"
              :disabled="isReadOnly"
              :rules="rules.required"
              inline
            >
              <v-radio label="Yes" :value="1" />
              <v-radio label="No" :value="0" />
            </v-radio-group>

            <template v-if="model?.exceptionalCircumstances === 1">
              <label for="circumstanceOccurWithin6Month">
                Does the exceptional circumstance occur within 6 months of the fee increase?
              </label>
              <v-radio-group
                id="circumstanceOccurWithin6Month"
                v-model.number="model.circumstanceOccurWithin6Month"
                class="radio-label"
                :disabled="isReadOnly"
                :rules="rules.required"
                inline
              >
                <v-radio
                  label="Yes"
                  :value="1"
                  @click="addObjToList(expenseObj, model.expenseList, model.expenseList.length > 0)"
                />
                <v-radio label="No" :value="0" />
              </v-radio-group>
            </template>
          </div>

          <template v-if="model?.exceptionalCircumstances === 1 && model.circumstanceOccurWithin6Month === 1">
            <div class="my-2">
              <p class="text-h5 text-primary my-2">Expense Information</p>
              <AppAlertBanner type="info" class="my-2">
                <strong>
                  Note: See the <a :href="fundingUrl" target="_blank">Funding Guidelines</a> for the list of eligible
                  expenses
                </strong>
              </AppAlertBanner>

              <div>
                <v-row class="hidden-sm-and-down">
                  <v-col cols="1" class="close-column" />
                  <v-col cols="12" md="3">
                    <h3 class="text-center">Expense Description</h3>
                  </v-col>
                  <v-col cols="12" md="3">
                    <h3 class="text-center">Date of expense</h3>
                  </v-col>
                  <v-col cols="12" md="3">
                    <h3 class="text-center">Payment frequency details</h3>
                  </v-col>
                  <v-col cols="12" md>
                    <h3 class="text-center">Expense amount</h3>
                  </v-col>
                </v-row>

                <v-row v-for="(expense, index) in model.expenseList" :key="expense.id">
                  <v-col cols="1" class="close-column">
                    <v-icon
                      :disabled="isReadOnly"
                      size="large"
                      color="#003366"
                      class="mt-md-4"
                      @click="removeObjFromList(index, model.expenseList)"
                    >
                      mdi-close
                    </v-icon>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      v-model="expense.description"
                      :disabled="isReadOnly"
                      :rules="rules.required"
                      label="Description"
                      variant="outlined"
                      clearable
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <AppDateInput
                      v-model="expense.date"
                      :rules="rules.required"
                      :disabled="isReadOnly"
                      :hide-details="isReadOnly"
                      label="Date"
                      clearable
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-select
                      v-model="expense.frequency"
                      :disabled="isReadOnly"
                      :items="FREQUENCIES"
                      label="Expense Frequency"
                      variant="outlined"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md>
                    <v-text-field
                      v-model.number="expense.expense"
                      :disabled="isReadOnly"
                      type="number"
                      variant="outlined"
                      :rules="rules.required"
                      prefix="$"
                      label="Expense"
                      @wheel="$event.target.blur()"
                      @update:model-value="convertBlankNumberToNull(expense, 'expense')"
                    />
                  </v-col>
                </v-row>
                <!-- end v for-->

                <AppButton
                  id="ec-add-expense-button"
                  :disabled="isReadOnly"
                  :primary="false"
                  size="medium"
                  @click="addObjToList(expenseObj, model.expenseList)"
                >
                  Add Expense
                </AppButton>
              </div>
              <div class="mt-8">
                <label for="textArea"> Please describe the reason for each expense listed above. </label>
                <v-textarea
                  id="textArea"
                  v-model="model.expenseInformationNote"
                  :disabled="isReadOnly"
                  :rules="rules.required"
                  placeholder="Describe Here"
                  variant="outlined"
                />
              </div>
            </div>

            <RFIDocumentUpload
              :current-facility="currentFacility"
              :r-f-i-type="DOCUMENT_TYPES.RFI_EC"
              :r-f-i-documents="rfiDocumentsEC"
              @add-r-f-i-document="addRFISupportingDocument"
              @delete-r-f-i-document="deleteRFISupportingDocument"
              @add-r-f-i-row="addNewRowToUploadedDocuments"
              @add-r-f-i-document-description="addRFISupportingDocumentDescription"
            />

            <div class="my-4">
              <p class="text-h5 text-primary my-2">Other Sources of Ministry Funding</p>
              <div>
                <label for="q3">
                  Have you applied for any other sources of Ministry Funding (e.g. BC Maintenance Fund, Start-Up Grants)
                  for any of the expenses you listed?
                </label>
                <v-radio-group
                  v-model="model.q3"
                  class="radio-label"
                  :disabled="isReadOnly"
                  :rules="rules.required"
                  inline
                >
                  <v-radio
                    label="Yes"
                    :value="1"
                    @click="addObjToList(fundingObj, model.fundingList, model.fundingList.length > 0)"
                  />
                  <v-radio label="No" :value="0" />
                </v-radio-group>

                <template v-if="model.q3 === 1">
                  <v-row class="hidden-lg-and-down">
                    <v-col cols="1" class="close-column" />
                    <v-col cols="12" xl="3">
                      <h3 class="text-center">Funding Program</h3>
                    </v-col>
                    <v-col cols="12" xl="2">
                      <h3 class="text-center">Application Date</h3>
                    </v-col>
                    <v-col cols="12" xl="2">
                      <h3 class="text-center">Status of Application</h3>
                    </v-col>
                    <v-col cols="12" xl="2">
                      <h3 class="text-center">Amount Received</h3>
                    </v-col>
                    <v-col cols="12" xl>
                      <h3 class="text-center">Expense(s)</h3>
                    </v-col>
                  </v-row>

                  <v-row v-for="(fundInfo, index) in model.fundingList" :key="fundInfo.id">
                    <v-col cols="1" class="close-column">
                      <v-icon
                        :disabled="isReadOnly"
                        size="large"
                        color="#003366"
                        class="mt-xl-4"
                        @click="removeObjFromList(index, model.fundingList)"
                      >
                        mdi-close
                      </v-icon>
                    </v-col>
                    <v-col cols="12" xl="3">
                      <v-text-field
                        v-model="fundInfo.fundingProgram"
                        :disabled="isReadOnly"
                        label="Funding Program"
                        variant="outlined"
                        clearable
                        :rules="rules.required"
                      />
                    </v-col>
                    <v-col cols="12" xl="2">
                      <AppDateInput
                        v-model="fundInfo.date"
                        :rules="rules.required"
                        :disabled="isReadOnly"
                        :hide-details="isReadOnly"
                        label="Date"
                        clearable
                      />
                    </v-col>
                    <v-col cols="12" xl="2">
                      <v-text-field
                        v-model="fundInfo.status"
                        :disabled="isReadOnly"
                        label="Status"
                        variant="outlined"
                        clearable
                        :rules="rules.required"
                      />
                    </v-col>
                    <v-col cols="12" xl="2">
                      <v-text-field
                        v-model.number="fundInfo.amount"
                        :disabled="isReadOnly"
                        variant="outlined"
                        :rules="rules.required"
                        label="Amount Received"
                        type="number"
                        prefix="$"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(fundInfo, 'amount')"
                      />
                    </v-col>
                    <v-col cols="12" xl>
                      <v-text-field
                        v-model.number="fundInfo.expenses"
                        :disabled="isReadOnly"
                        type="number"
                        prefix="$"
                        label="Expense"
                        variant="outlined"
                        clearable
                        :rules="rules.required"
                        @wheel="$event.target.blur()"
                        @update:model-value="convertBlankNumberToNull(fundInfo, 'expenses')"
                      />
                    </v-col>
                  </v-row>
                  <!-- end v for-->

                  <AppButton
                    id="add-funding-button"
                    :disabled="isReadOnly"
                    :primary="false"
                    size="medium"
                    @click="addObjToList(fundingObj, model.fundingList)"
                  >
                    Add Funding
                  </AppButton>
                </template>
              </div>
            </div>
          </template>
        </div>
      </v-card>

      <!--end show if yes / yes selected-->

      <!--end page 1 RFI landing-->

      <v-card elevation="6" class="my-10 rounded-lg">
        <p class="px-6 py-3 card-title font-weight-bold">Direct Care staff Wages Increases</p>
        <div class="px-8 py-4">
          <AppAlertBanner type="info" class="my-2">
            <strong>
              Note: If your facility has ECE employees eligible for ECE Wage Enhancement (ECE-WE), you must apply for
              ECE-WE before being approved for a fee increase under this policy.
            </strong>
          </AppAlertBanner>

          <p class="text-h6 text-primary my-8">
            This exception applies to wage increases for Direct Care staff employed at the facility on a full-time,
            part-time or casual basis. Direct Care staff are staff who spend at least 50% of their working time directly
            responsible for and engaged in the care and supervision of children at the Facility.
          </p>
          <div>
            <label for="feeIncreaseDueToWage">Is your fee increase due to a wage increase for Direct Care staff?</label>
            <v-radio-group
              id="feeIncreaseDueToWage"
              v-model="model.feeIncreaseDueToWage"
              class="radio-label"
              :disabled="isReadOnly"
              :rules="rules.required"
              inline
            >
              <v-radio
                label="Yes"
                :value="1"
                @click="addObjToList(wageObj, model.wageList, model.wageList.length > 0)"
              />
              <v-radio label="No" :value="0" />
            </v-radio-group>

            <template v-if="model?.feeIncreaseDueToWage === 1">
              <template v-if="getLanguageYearLabel === PROGRAM_YEAR_LANGUAGE_TYPES.HISTORICAL">
                <label for="increaseInWriting">
                  Was the wage increase committed to (in writing) before the January 2022 release of the Funding
                  Guidelines?
                </label>
                <v-radio-group
                  id="increaseInWriting"
                  v-model="model.increaseInWriting"
                  class="radio-label"
                  :disabled="isReadOnly"
                  :rules="rules.required"
                  inline
                >
                  <v-radio label="Yes" :value="1" />
                  <v-radio label="No" :value="0" />
                </v-radio-group>
              </template>

              <label for="isBargainingAgreement">
                Is the wage increase part of a collective bargaining agreement for Direct Care staff at the facility?
              </label>
              <v-radio-group
                id="isBargainingAgreement"
                v-model="model.isBargainingAgreement"
                class="radio-label"
                :disabled="isReadOnly"
                :rules="rules.required"
                inline
              >
                <v-radio label="Yes" :value="1" />
                <v-radio label="No" :value="0" />
              </v-radio-group>

              <label for="lossOfCareStaff">
                Has the facility been unable to hire and/or retain Direct Care staff due to wages?
              </label>
              <v-radio-group
                id="lossOfCareStaff"
                v-model="model.lossOfCareStaff"
                class="radio-label"
                :disabled="isReadOnly"
                :rules="rules.required"
                inline
              >
                <v-radio label="Yes" :value="1" />
                <v-radio label="No" :value="0" />
              </v-radio-group>

              <label for="lossOfCareStaff">
                Is this creating challenges in maintaining the staff-to-child ratios required under the facility
                licence?
              </label>
              <v-radio-group
                id="healthAndSafetyConcerns"
                v-model="model.healthAndSafetyConcerns"
                class="radio-label"
                :disabled="isReadOnly"
                :rules="rules.required"
                inline
              >
                <v-radio label="Yes" :value="1" />
                <v-radio label="No" :value="0" />
              </v-radio-group>
            </template>
          </div>

          <template v-if="model.feeIncreaseDueToWage === 1">
            <div>
              <p class="text-h5 text-primary my-4">Direct Care staff Wages Increases</p>
              <AppAlertBanner type="info" class="my-4">
                <strong>
                  Note: If two or more staff have the same information for every column, they can be included in one
                  row.
                </strong>
              </AppAlertBanner>

              <div>
                <v-row class="hidden-lg-and-down">
                  <v-col cols="1" class="close-column" />
                  <v-col cols="12" xl="2">
                    <h3 class="text-center">Number of staff receiving wage increase</h3>
                  </v-col>
                  <v-col cols="12" xl="2">
                    <h3 class="text-center">Direct Care staff role</h3>
                    <br />
                    <p class="text-center font-small">(e.g. Responsible Adult, ECE, ECEA, etc)</p>
                  </v-col>
                  <v-col cols="12" xl="2">
                    <h3 class="text-center">Wage before increase</h3>
                    <br />
                    <p class="text-center font-small">(not including ECE-WE)</p>
                  </v-col>
                  <v-col cols="12" xl="2">
                    <h3 class="text-center">Wage after increase</h3>
                    <br />
                    <p class="text-center font-small">(not including ECE-WE)</p>
                  </v-col>
                  <v-col cols="12" xl="2">
                    <h3 class="text-center">Average hours per week at this facility</h3>
                  </v-col>
                  <v-col cols="12" xl>
                    <h3 class="text-center">Date</h3>
                  </v-col>
                </v-row>

                <v-row v-for="(obj, index) in model.wageList" :key="obj.id" class="mt-md-10">
                  <v-col cols="1" class="close-column">
                    <v-icon
                      :disabled="isReadOnly"
                      size="large"
                      color="#003366"
                      class="mt-xl-4"
                      @click="removeObjFromList(index, model.wageList)"
                    >
                      mdi-close
                    </v-icon>
                  </v-col>
                  <v-col cols="12" xl="2">
                    <v-text-field
                      v-model.number="obj.staffNumber"
                      :disabled="isReadOnly"
                      type="number"
                      label="Number of Staff Receiving Wage Increase"
                      variant="outlined"
                      clearable
                      :rules="rules.required"
                      @wheel="$event.target.blur()"
                      @update:model-value="convertBlankNumberToNull(obj, 'staffNumber')"
                    />
                  </v-col>
                  <v-col cols="12" xl="2">
                    <v-text-field
                      v-model="obj.staffRole"
                      :disabled="isReadOnly"
                      label="Direct Care staff Role "
                      variant="outlined"
                      clearable
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" xl="2">
                    <v-text-field
                      v-model.number="obj.wageBeforeIncrease"
                      :disabled="isReadOnly"
                      prefix="$"
                      type="number"
                      label="Wage before increase"
                      variant="outlined"
                      clearable
                      :rules="rules.required"
                      @wheel="$event.target.blur()"
                      @update:model-value="convertBlankNumberToNull(obj, 'wageBeforeIncrease')"
                    />
                  </v-col>
                  <v-col cols="12" xl="2">
                    <v-text-field
                      v-model.number="obj.wageAfterIncrease"
                      :disabled="isReadOnly"
                      prefix="$"
                      type="number"
                      label="Wage After increase"
                      variant="outlined"
                      clearable
                      :rules="rules.required"
                      @wheel="$event.target.blur()"
                      @update:model-value="convertBlankNumberToNull(obj, 'wageAfterIncrease')"
                    />
                  </v-col>
                  <v-col cols="12" xl="2">
                    <v-text-field
                      v-model.number="obj.averageHours"
                      :disabled="isReadOnly"
                      type="number"
                      variant="outlined"
                      :rules="[...rules.required, rules.min(0), rules.max(168)]"
                      label="Average hours per week at this facility"
                      @wheel="$event.target.blur()"
                      @update:model-value="convertBlankNumberToNull(obj, 'averageHours')"
                    />
                  </v-col>
                  <v-col cols="12" xl>
                    <AppDateInput
                      v-model="obj.wageDate"
                      :rules="rules.required"
                      :disabled="isReadOnly"
                      :hide-details="isReadOnly"
                      label="Date"
                      clearable
                    />
                  </v-col>
                </v-row>
                <!-- end v for-->

                <AppButton
                  id="add-wage-button"
                  :disabled="isReadOnly"
                  :primary="false"
                  size="medium"
                  @click="addObjToList(wageObj, model.wageList)"
                >
                  Add Wage
                </AppButton>
              </div>
            </div>

            <div class="mt-8">
              <p class="text-h5 text-primary">Please tell us more:</p>
              <div class="my-4">
                <label for="wage"> When did your facility's challenges with hiring and keeping staff begin? </label>
                <v-textarea
                  id="wage"
                  v-model="model.textbox1"
                  :disabled="isReadOnly"
                  :rules="rules.required"
                  placeholder="Describe here"
                  variant="outlined"
                  class="mb-2"
                />

                <label for="wage1"> How many Direct Care staff have left your facility due to wages? </label>
                <v-textarea
                  id="wage1"
                  v-model="model.textbox2"
                  :disabled="isReadOnly"
                  :rules="rules.required"
                  placeholder="Describe here"
                  variant="outlined"
                  class="mb-2"
                />

                <label for="wage2"> What have you done to try to recruit staff? </label>
                <v-textarea
                  id="wage2"
                  v-model="model.textbox3"
                  :disabled="isReadOnly"
                  :rules="rules.required"
                  placeholder="Describe here"
                  variant="outlined"
                  class="mb-2"
                />

                <label for="wage3">Have you had to adjust your hours/days of operation? </label>
                <v-textarea
                  id="wage3"
                  v-model="model.textbox4"
                  :disabled="isReadOnly"
                  :rules="rules.required"
                  placeholder="Describe here"
                  variant="outlined"
                  class="mb-2"
                />

                <label for="wage4"> Is your facility unable to fill spaces due to insufficient staffing? </label>
                <v-textarea
                  id="wage4"
                  v-model="model.textbox5"
                  :disabled="isReadOnly"
                  :rules="rules.required"
                  placeholder="Describe here"
                  variant="outlined"
                  class="mb-2"
                />

                <label for="wage5">
                  Is there anything else you would like us to know about the wage increase(s)?
                </label>
                <v-textarea
                  id="wage5"
                  v-model="model.textbox6"
                  :disabled="isReadOnly"
                  :rules="rules.required"
                  placeholder="Describe here"
                  variant="outlined"
                />
              </div>

              <RFIDocumentUpload
                :current-facility="currentFacility"
                :r-f-i-type="DOCUMENT_TYPES.RFI_DCSWI"
                :r-f-i-documents="rfiDocumentsDCSWI"
                @add-r-f-i-document="addRFISupportingDocument"
                @add-r-f-i-row="addNewRowToUploadedDocuments"
                @delete-r-f-i-document="deleteRFISupportingDocument"
                @add-r-f-i-document-description="addRFISupportingDocumentDescription"
              />
            </div>
          </template>
        </div>
      </v-card>

      <!--End page two Wage Increase-->

      <v-card elevation="6" class="my-10 rounded-lg">
        <p class="px-6 py-3 card-title font-weight-bold">Priority Service Expansion: Increase in Hours of Operation</p>
        <div class="px-8 py-4">
          <div>
            <label for="feeIncreaseExtendedHours">
              Is your fee increase due to expenses related to expanding or extending the hours of child care service
              available for all enrolled children?
            </label>
            <v-radio-group
              id="feeIncreaseExtendedHours"
              v-model="model.feeIncreaseExtendedHours"
              class="radio-label"
              :disabled="isReadOnly"
              :rules="rules.required"
              inline
            >
              <v-radio
                label="Yes"
                :value="1"
                @click="addObjToList(expansionObj, model.expansionList, model.expansionList.length > 0)"
              />
              <v-radio label="No" :value="0" />
            </v-radio-group>
          </div>

          <template v-if="model.feeIncreaseExtendedHours === 1">
            <div class="mb-4">
              <p class="text-h5 text-primary">Service Expansion Details</p>

              <div>
                <v-row class="hidden-md-and-down">
                  <v-col cols="1" class="close-column" />
                  <v-col cols="12" lg="2">
                    <h3>Facility's previous hours of operation</h3>
                    <br />
                    <p>(e.g. 9:00 am - 4:00 pm)</p>
                  </v-col>
                  <v-col cols="12" lg="2">
                    <h3>Facility's new hours of operation</h3>
                    <br />
                    <p>(e.g. 6:00 am - 5:00 pm)</p>
                  </v-col>
                  <v-col cols="12" lg="3">
                    <h3 class="text-center">Date of Change</h3>
                  </v-col>
                  <v-col cols="12" lg="2">
                    <h3 class="text-center">Amount of Expense</h3>
                  </v-col>
                  <v-col cols="12" lg>
                    <h3 class="text-center">Payment frequency</h3>
                  </v-col>
                </v-row>

                <v-row v-for="(obj, index) in model.expansionList" :key="obj.id">
                  <v-col cols="1" class="close-column">
                    <v-icon
                      :disabled="isReadOnly"
                      size="large"
                      color="#003366"
                      class="mt-6"
                      @click="removeObjFromList(index, model.expansionList)"
                    >
                      mdi-close
                    </v-icon>
                  </v-col>
                  <v-col cols="12" lg="2">
                    <AppTimeInput
                      v-model="obj.timefrom"
                      :disabled="isReadOnly"
                      :rules="rules.required"
                      full-width
                      max-width="200px"
                      label="From"
                      class="pb-1"
                    />
                    <!-- we need logic to prevent choosing a time before -->
                    <AppTimeInput
                      v-model="obj.timeto"
                      :disabled="isReadOnly"
                      :rules="rules.required"
                      full-width
                      max-width="200px"
                      label="To"
                    />
                  </v-col>
                  <v-col cols="12" lg="2">
                    <AppTimeInput
                      v-model="obj.newtimefrom"
                      :disabled="isReadOnly"
                      :rules="rules.required"
                      full-width
                      max-width="200px"
                      label="From"
                      class="pb-1"
                    />
                    <AppTimeInput
                      v-model="obj.newtimeto"
                      :disabled="isReadOnly"
                      :rules="rules.required"
                      full-width
                      max-width="200px"
                      label="To"
                    />
                  </v-col>
                  <v-col cols="12" lg="3">
                    <AppDateInput
                      v-model="obj.date"
                      :disabled="isReadOnly"
                      :hide-details="isReadOnly"
                      label="Date"
                      :rules="rules.required"
                      clearable
                    />
                  </v-col>
                  <v-col cols="12" lg="2">
                    <v-text-field
                      v-model.number="obj.expense"
                      :disabled="isReadOnly"
                      type="number"
                      variant="outlined"
                      :rules="rules.required"
                      label="Expense"
                      prefix="$"
                      @wheel="$event.target.blur()"
                      @update:model-value="convertBlankNumberToNull(obj, 'expense')"
                    />
                  </v-col>
                  <v-col cols="12" lg>
                    <v-select
                      v-model="obj.frequency"
                      :disabled="isReadOnly"
                      :items="FREQUENCIES"
                      label="Payment Frequency"
                      variant="outlined"
                      :rules="rules.required"
                    />
                  </v-col>
                </v-row>
                <!-- end v for-->

                <AppButton
                  id="add-expansion-details-button"
                  :disabled="isReadOnly"
                  :primary="false"
                  size="medium"
                  @click="addObjToList(expansionObj, model.expansionList)"
                >
                  Add Expansion Details
                </AppButton>

                <div class="mt-8">
                  <label for="serviceExpense"> Describe each of your expenses above. (e.g. Wages, Utilities) </label>
                  <v-textarea
                    id="serviceExpense"
                    v-model="model.serviceExpansionDetailsNote"
                    :disabled="isReadOnly"
                    :rules="rules.required"
                    variant="outlined"
                    placeholder="Describe here"
                    class="mb-2"
                  />

                  <label for="serviceExpense1">
                    Is there anything else about your change in hours of operation you would like us to know?
                  </label>
                  <v-textarea
                    id="serviceExpense1"
                    v-model="model.notes2"
                    :disabled="isReadOnly"
                    :rules="rules.required"
                    variant="outlined"
                    placeholder="Describe here"
                  />
                </div>
              </div>
            </div>
            <RFIDocumentUpload
              :current-facility="currentFacility"
              :r-f-i-type="DOCUMENT_TYPES.RFI_PSE"
              :r-f-i-documents="rfiDocumentsPSE"
              @add-r-f-i-document="addRFISupportingDocument"
              @delete-r-f-i-document="deleteRFISupportingDocument"
              @add-r-f-i-row="addNewRowToUploadedDocuments"
              @add-r-f-i-document-description="addRFISupportingDocumentDescription"
            />
          </template>
        </div>
      </v-card>

      <!-- End page 3 Service Expansion Hours-->

      <v-card elevation="6" class="my-10 rounded-lg">
        <p class="px-6 py-3 card-title font-weight-bold">
          Priority Service Expansion: Increasing Connection to Indigenous Community, Culture, and/or Language
        </p>
        <div class="px-8 py-4">
          <div>
            <label for="IndigenousConnection">
              Is your fee increase due to an increased connection to Indigenous community, culture, or language for all
              enrolled children in a Facility owned, managed, or governed by at least 51% Indigenous peoples?
            </label>
            <v-radio-group
              id="IndigenousConnection"
              v-model="model.IndigenousConnection"
              class="radio-label"
              :disabled="isReadOnly"
              :rules="rules.required"
              inline
            >
              <v-radio
                label="Yes"
                :value="1"
                @click="
                  addObjToList(
                    indigenousExpenseObj,
                    model.indigenousExpenseList,
                    model.indigenousExpenseList.length > 0,
                  )
                "
              />
              <v-radio label="No" :value="0" />
            </v-radio-group>
            <p>
              As outlined in the
              <a :href="fundingUrl" target="_blank"> Funding Guidelines</a>, this may include:
            </p>

            <ul class="ml-10">
              <li>
                Participation of an Elder, culture/language teacher, and/or family members in the child care program;
              </li>
              <li>Children's participation in community, language, and/or cultural events or activities; or</li>
              <li>Language or culture resources for use in the child care program.</li>
            </ul>
          </div>

          <template v-if="model.IndigenousConnection === 1">
            <div class="my-4">
              <p class="text-h5 text-primary mt-8">Expense Information</p>
              <div>
                <v-row class="hidden-sm-and-down">
                  <v-col cols="1" class="close-column" />
                  <v-col cols="12" md="3">
                    <h3 class="text-center">Expense Description</h3>
                  </v-col>
                  <v-col cols="12" md="3">
                    <h3 class="text-center">Date of expense</h3>
                  </v-col>
                  <v-col cols="12" md="3">
                    <h3 class="text-center">Payment frequency details</h3>
                  </v-col>
                  <v-col cols="12" md>
                    <h3 class="text-center">Expense amount</h3>
                  </v-col>
                </v-row>
                <v-row v-for="(indigExpense, index) in model.indigenousExpenseList" :key="indigExpense.id">
                  <v-col cols="1" class="close-column">
                    <v-icon
                      :disabled="isReadOnly"
                      size="large"
                      color="#003366"
                      class="mt-md-4"
                      @click="removeObjFromList(index, model.indigenousExpenseList)"
                    >
                      mdi-close
                    </v-icon>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      v-model="indigExpense.description"
                      :disabled="isReadOnly"
                      label="Description"
                      variant="outlined"
                      clearable
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <AppDateInput
                      v-model="indigExpense.date"
                      :rules="rules.required"
                      :disabled="isReadOnly"
                      :hide-details="isReadOnly"
                      label="Date"
                      clearable
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-select
                      v-model="indigExpense.frequency"
                      :disabled="isReadOnly"
                      :items="FREQUENCIES"
                      label="Expense Frequency"
                      variant="outlined"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md>
                    <v-text-field
                      v-model.number="indigExpense.expense"
                      :disabled="isReadOnly"
                      type="number"
                      variant="outlined"
                      :rules="rules.required"
                      prefix="$"
                      @wheel="$event.target.blur()"
                      @update:model-value="convertBlankNumberToNull(indigExpense, 'expense')"
                    />
                  </v-col>
                </v-row>
                <!-- end v for-->

                <AppButton
                  id="indigenous-add-expense-button"
                  :disabled="isReadOnly"
                  :primary="false"
                  size="medium"
                  @click="addObjToList(indigenousExpenseObj, model.indigenousExpenseList)"
                >
                  Add Expense
                </AppButton>

                <div class="mt-8">
                  <label for="expense1">Is there anything else about your expenses you would like us to know?</label>
                  <v-textarea
                    id="expense1"
                    v-model="model.iCEIDetailsNote"
                    :disabled="isReadOnly"
                    :rules="rules.required"
                    variant="outlined"
                    placeholder="Describe here"
                  />
                </div>
              </div>
            </div>
            <RFIDocumentUpload
              :current-facility="currentFacility"
              :r-f-i-type="DOCUMENT_TYPES.RFI_PSEIC"
              :r-f-i-documents="rfiDocumentsPSEIC"
              @add-r-f-i-document="addRFISupportingDocument"
              @delete-r-f-i-document="deleteRFISupportingDocument"
              @add-r-f-i-row="addNewRowToUploadedDocuments"
              @add-r-f-i-document-description="addRFISupportingDocumentDescription"
            />
          </template>
          <!--end show if yes / yes selected-->
        </div>
      </v-card>

      <!-- End Page 4 Indigenous Service Expansion-->

      <v-card elevation="6" class="my-10 rounded-lg">
        <p class="px-6 py-3 card-title font-weight-bold">Affordable Child Care for Underserved Populations</p>
        <div class="px-8 py-4">
          <div>
            <p>Fee increases may be considered under this exception if:</p>
            <ul class="ml-10">
              <li>
                The facility has historically provided care to underserved populations - including Indigenous or
                low-income families - at significantly below the regional median fees for their area or at no fee;
              </li>
              <li>The fee increase will contribute to the operational sustainability of the organization; and</li>
              <li>The fee increase will not greatly increase the out-of-pocket cost of care for families.</li>
            </ul>
          </div>
          <div class="mt-4">
            <label for="underservedPop">Does this Facility meet all the above criteria?</label>
            <v-radio-group
              id="underservedPop"
              v-model="model.underservedPop"
              class="radio-label"
              :disabled="isReadOnly"
              :rules="rules.required"
              inline
            >
              <v-radio label="Yes" :value="1" />
              <v-radio label="No" :value="0" />
            </v-radio-group>
          </div>

          <template v-if="model.underservedPop === 1">
            <div class="mb-4">
              <label for="underservedPop1">
                Please describe how the majority of children you provide care for represent an underserved population
                (e.g. Indigenous children, low-income families)
              </label>
              <v-textarea
                id="underservedPop1"
                v-model="model.underservedChildCareTypes"
                :disabled="isReadOnly"
                :rules="rules.required"
                variant="outlined"
                placeholder="Describe here"
                class="mb-2"
              />

              <label for="underservedPop2"
                >How will your fee increase contribute to the overall sustainability of the
                organization/facility?</label
              >
              <v-textarea
                id="underservedPop2"
                v-model="model.orgsustainability"
                :disabled="isReadOnly"
                :rules="rules.required"
                variant="outlined"
                placeholder="Describe here"
                class="mb-2"
              />

              <label for="underservedPop3"
                >Describe whether parents' out-of-pocket monthly cost for child care will be affected by this increase
                (after applying reductions from CCFRI and the Affordable Child Care Benefit, and any other applicable
                funding source). Will any families experience a cost increase, and if so, by how much?</label
              >
              <v-textarea
                id="underservedPop3"
                v-model="model.outOfPocketFees"
                :disabled="isReadOnly"
                :rules="rules.required"
                variant="outlined"
                placeholder="Describe here"
              />
            </div>
            <RFIDocumentUpload
              :current-facility="currentFacility"
              :r-f-i-type="DOCUMENT_TYPES.RFI_ACCUP"
              :r-f-i-documents="rfiDocumentsACCUP"
              @add-r-f-i-document="addRFISupportingDocument"
              @add-r-f-i-row="addNewRowToUploadedDocuments"
              @delete-r-f-i-document="deleteRFISupportingDocument"
              @add-r-f-i-document-description="addRFISupportingDocumentDescription"
            />
          </template>
        </div>
      </v-card>
    </v-container>
  </v-form>
  <NavButton
    :is-next-displayed="true"
    :is-save-displayed="true"
    :is-save-disabled="isReadOnly"
    :is-next-disabled="!isFormComplete"
    :is-processing="loading || processing"
    @previous="previous"
    @next="nextBtnClicked"
    @validate-form="validateForm()"
    @save="save(true)"
  />
</template>
<script>
import { isEqual } from 'lodash';
import { mapActions, mapState } from 'pinia';
import { uuid } from 'vue-uuid';

import { useRfiAppStore } from '@/store/rfiApp.js';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useNavBarStore } from '@/store/navBar.js';
import { useReportChangesStore } from '@/store/reportChanges.js';
import { useSupportingDocumentUploadStore } from '@/store/supportingDocumentUpload.js';
import AppAlertBanner from '@/components/guiComponents/AppAlertBanner.vue';
import AppButton from '@/components/guiComponents/AppButton.vue';
import AppDateInput from '@/components/guiComponents/AppDateInput.vue';
import AppTimeInput from '@/components/guiComponents/AppTimeInput.vue';
import RFIDocumentUpload from '@/components/RFI/RFIDocumentUpload.vue';
import ApplicationPCFHeader from '@/components/util/ApplicationPCFHeader.vue';
import NavButton from '@/components/util/NavButton.vue';

import DocumentService from '@/services/documentService';

import alertMixin from '@/mixins/alertMixin.js';
import globalMixin from '@/mixins/globalMixin.js';
import { deepCloneObject } from '@/utils/common.js';
import rules from '@/utils/rules.js';

import { DOCUMENT_TYPES, PROGRAM_YEAR_LANGUAGE_TYPES } from '@/utils/constants.js';

let model = {
  expansionList: [],
  wageList: [],
  fundingList: [],
  expenseList: [],
  indigenousExpenseList: [],
};

export default {
  name: 'CcfriRequestMoreInfo',
  components: {
    AppAlertBanner,
    AppButton,
    AppDateInput,
    ApplicationPCFHeader,
    AppTimeInput,
    NavButton,
    RFIDocumentUpload,
  },
  mixins: [alertMixin, globalMixin],
  async beforeRouteLeave(_to, _from, next) {
    const rfiAppStore = useRfiAppStore();
    rfiAppStore.setRfiModel(this.model);
    await this.save(false);
    next();
  },
  data() {
    return {
      loading: false,
      isValidForm: false,
      expenseObj: {
        description: '',
        date: undefined,
        expense: null,
        frequency: '',
      },
      indigenousExpenseObj: {
        description: '',
        date: undefined,
        expense: 0,
        frequency: '',
      },
      fundingObj: {
        fundingProgram: '',
        date: undefined,
        status: '',
        amount: 0,
        expenses: 0,
      },
      wageObj: {
        staffRole: '',
        staffNumber: 0,
        wageBeforeIncrease: 0,
        wageAfterIncrease: 0,
        averageHours: 0,
        wageDate: undefined,
      },
      expansionObj: {
        timeto: null,
        timefrom: null,
        menufrom: false,
        menuto: false,
        newtimeto: null,
        newtimefrom: null,
        newmenufrom: false,
        newmenuto: false,
        description: '',
        date: undefined,
        expense: 0,
        frequency: '',
      },
      model,
      processing: false,
      rfiDocuments: {},
      rfiDocumentsEC: [],
      rfiDocumentsACCUP: [],
      rfiDocumentsDCSWI: [],
      rfiDocumentsPSE: [],
      rfiDocumentsPSEIC: [],
    };
  },

  computed: {
    ...mapState(useAppStore, ['getFundingUrl', 'getLanguageYearLabel', 'programYearList']),
    ...mapState(useApplicationStore, [
      'applicationStatus',
      'applicationId',
      'isApplicationProcessing',
      'formattedProgramYear',
      'programYearId',
    ]),
    ...mapState(useNavBarStore, [
      'nextPath',
      'previousPath',
      'getNavByCCFRIId',
      'isChangeRequest',
      'changeRequestId',
      'navBarList',
    ]),
    ...mapState(useReportChangesStore, ['changeRequestStatus']),
    ...mapState(useRfiAppStore, ['rfiModel', 'loadedModel']),
    ...mapState(useSupportingDocumentUploadStore, ['uploadedDocuments']),
    currentFacility() {
      return this.navBarList.find((el) => el.ccfriApplicationId === this.$route.params.urlGuid);
    },
    fundingUrl() {
      return this.getFundingUrl(this.programYearId);
    },
    languageYearLabel() {
      return this.getLanguageYearLabel;
    },
    isReadOnly() {
      //if submitted, lock er up. If unlock CCFRI - unlock
      if (this.currentFacility?.unlockRfi) {
        return false;
      } else if (this.isChangeRequest) {
        if (!this.changeRequestStatus || this.currentFacility.unlockRfi) {
          return false;
        } else if (this.changeRequestStatus !== 'INCOMPLETE') {
          return true;
        }
      } else if (this.applicationStatus === 'SUBMITTED') {
        return true;
      }
      return false;
    },
    isFormComplete() {
      let done = true;
      if (
        this.model.exceptionalCircumstances === 1 &&
        this.model.circumstanceOccurWithin6Month === 1 &&
        this.model.expenseList.length === 0
      ) {
        done = false;
      }
      if (
        this.model.q3 === 1 &&
        this.model.exceptionalCircumstances === 1 &&
        this.model.circumstanceOccurWithin6Month === 1 &&
        this.model.fundingList.length === 0
      ) {
        done = false;
      }
      if (this.model.feeIncreaseDueToWage === 1 && this.model.wageList.length === 0) {
        done = false;
      }
      if (this.model.feeIncreaseExtendedHours === 1 && this.model.expansionList.length === 0) {
        done = false;
      }
      if (this.model.IndigenousConnection === 1 && this.model.indigenousExpenseList.length === 0) {
        done = false;
      }
      return this.isValidForm && done; //false makes button clickable, true disables button
    },
  },
  watch: {
    '$route.params.urlGuid': {
      async handler() {
        try {
          this.loading = true;
          window.scrollTo(0, 0);
          let ccfriId = this.$route.params.urlGuid;
          await this.loadRfi(ccfriId);
          await this.refreshSupportingDocuments();
          this.model = deepCloneObject(this.rfiModel);
          this.$refs.form?.resetValidation();
        } catch (error) {
          console.log(error);
          this.setFailureAlert('An error occurred while retrieving data.');
        } finally {
          this.loading = false;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.rules = rules;
    this.DOCUMENT_TYPES = DOCUMENT_TYPES;
    this.PROGRAM_YEAR_LANGUAGE_TYPES = PROGRAM_YEAR_LANGUAGE_TYPES;
    this.FREQUENCIES = ['One-time', 'Daily', 'Weekly', 'Monthly'];
  },
  methods: {
    ...mapActions(useRfiAppStore, ['loadRfi', 'saveRfi', 'setRfiModel']),
    ...mapActions(useNavBarStore, ['setNavBarRFIComplete']),
    ...mapActions(useSupportingDocumentUploadStore, ['saveUploadedDocuments', 'getDocuments']),
    nextBtnClicked() {
      this.$router.push(this.nextPath);
    },
    validateForm() {
      this.$refs.form?.validate();
    },
    previous() {
      this.$router.push(this.previousPath);
    },
    async save(showNotification) {
      this.processing = true;

      //checks if blank by comparing a default row for the list
      //don't save blank rows
      for (let i = this.model.expenseList.length - 1; i >= 0; i--) {
        if (isEqual(this.model.expenseList[i], this.expenseObj)) {
          this.model.expenseList.splice(i, 1);
        }
      }
      for (let i = this.model.expansionList.length - 1; i >= 0; i--) {
        if (isEqual(this.model.expansionList[i], this.expansionObj)) {
          this.model.expansionList.splice(i, 1);
        }
      }
      for (let i = this.model.fundingList.length - 1; i >= 0; i--) {
        if (isEqual(this.model.fundingList[i], this.fundingObj)) {
          this.model.fundingList.splice(i, 1);
        }
      }
      for (let i = this.model.wageList.length - 1; i >= 0; i--) {
        if (isEqual(this.model.wageList[i], this.wageObj)) {
          this.model.wageList.splice(i, 1);
        }
      }
      for (let i = this.model.indigenousExpenseList.length - 1; i >= 0; i--) {
        if (isEqual(this.model.indigenousExpenseList[i], this.indigenousExpenseObj)) {
          this.model.indigenousExpenseList.splice(i, 1);
        }
      }

      this.setRfiModel({ ...this.model });
      let ccfriId = this.$route.params.urlGuid;
      this.setNavBarRFIComplete({ ccfriId: ccfriId, complete: this.isFormComplete });
      try {
        let friApplicationGuid = await this.saveRfi({ ccfriId: ccfriId, isRfiComplete: this.isFormComplete });
        if (friApplicationGuid) {
          this.model.rfiId = friApplicationGuid;
        }
        await this.processRFISupportingDocuments();
        if (showNotification) {
          this.setSuccessAlert('Success! Request for Information has been saved.');
          await this.refreshSupportingDocuments();
        }
      } catch {
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      }
      this.processing = false;
    },
    addObjToList(obj, list, arrayHasItems = false) {
      //when opening table for the first time, add a row so it always populates with one.
      //check below so if user hits the radio button multiple times, it won't keep adding rows
      if (arrayHasItems) {
        return;
      }
      const newObj = { ...obj, id: uuid.v1() };
      list.push(newObj);
    },
    removeObjFromList(index, list) {
      if (index === -1) {
        return;
      }
      list.splice(index, 1);
    },
    async refreshSupportingDocuments() {
      await this.getDocuments(this.applicationId);
      this.loadDocsForRFIType(this.currentFacility.facilityId);
    },
    loadDocsForRFIType(facilityId) {
      this.rfiDocumentsEC = [];
      this.rfiDocumentsDCSWI = [];
      this.rfiDocumentsPSE = [];
      this.rfiDocumentsPSEIC = [];
      this.rfiDocumentsACCUP = [];
      this.rfiDocumentsEC =
        this.uploadedDocuments?.filter(
          (x) => x.documentType === DOCUMENT_TYPES.RFI_EC && x.ccof_facility === facilityId,
        ) || [];
      this.rfiDocumentsDCSWI =
        this.uploadedDocuments?.filter(
          (x) => x.documentType === DOCUMENT_TYPES.RFI_DCSWI && x.ccof_facility === facilityId,
        ) || [];
      this.rfiDocumentsPSE =
        this.uploadedDocuments?.filter(
          (x) => x.documentType === DOCUMENT_TYPES.RFI_PSE && x.ccof_facility === facilityId,
        ) || [];
      this.rfiDocumentsPSEIC =
        this.uploadedDocuments?.filter(
          (x) => x.documentType === DOCUMENT_TYPES.RFI_PSEIC && x.ccof_facility === facilityId,
        ) || [];
      this.rfiDocumentsACCUP =
        this.uploadedDocuments?.filter(
          (x) => x.documentType === DOCUMENT_TYPES.RFI_ACCUP && x.ccof_facility === facilityId,
        ) || [];
    },
    addRFISupportingDocument(item) {
      const foundItemIndex = this.uploadedDocuments.findIndex((el) => el.id === item.id);
      if (foundItemIndex > -1) {
        this.uploadedDocuments[foundItemIndex] = item;
      } else {
        this.uploadedDocuments.push(item);
      }
    },
    addRFISupportingDocumentDescription(item) {
      const foundItemIndex = this.uploadedDocuments.findIndex((el) => el.id === item.id);
      if (foundItemIndex > -1) {
        this.uploadedDocuments[foundItemIndex].description = item.description;
      }
    },
    addNewRowToUploadedDocuments(item) {
      switch (item.documentType) {
        case DOCUMENT_TYPES.RFI_EC:
          this.rfiDocumentsEC.unshift(item);
          break;
        case DOCUMENT_TYPES.RFI_DCSWI:
          this.rfiDocumentsDCSWI.unshift(item);
          break;
        case DOCUMENT_TYPES.RFI_PSE:
          this.rfiDocumentsPSE.unshift(item);
          break;
        case DOCUMENT_TYPES.RFI_PSEIC:
          this.rfiDocumentsPSEIC.unshift(item);
          break;
        case DOCUMENT_TYPES.RFI_ACCUP:
          this.rfiDocumentsACCUP.unshift(item);
          break;
      }
      this.uploadedDocuments.unshift(item);
    },
    // custom function to find index of an object in an array based on id or annotationid
    findRFIDocIndex(array, item) {
      let index = array.findIndex((el) => el.id === item.id);
      if (index === -1) {
        index = array.findIndex((el) => el.annotationid === item.annotationid);
      }
      return index;
    },
    deleteRFISupportingDocument(item) {
      const index = this.findRFIDocIndex(this.uploadedDocuments, item);
      if (item.annotationid) {
        let deletedItems = this.uploadedDocuments['deletedItems'];
        if (deletedItems?.length > 0) {
          deletedItems.push(item.annotationid);
          this.uploadedDocuments['deletedItems'] = deletedItems;
        } else {
          deletedItems = [];
          deletedItems.push(item.annotationid);
          this.uploadedDocuments['deletedItems'] = deletedItems;
        }
      }
      this.uploadedDocuments.splice(index, 1);

      switch (item.documentType) {
        case DOCUMENT_TYPES.RFI_EC:
          this.rfiDocumentsEC.splice(this.findRFIDocIndex(this.rfiDocumentsEC, item), 1);
          break;
        case DOCUMENT_TYPES.RFI_DCSWI:
          this.rfiDocumentsDCSWI.splice(this.findRFIDocIndex(this.rfiDocumentsDCSWI, item), 1);
          break;
        case DOCUMENT_TYPES.RFI_PSE:
          this.rfiDocumentsPSE.splice(this.findRFIDocIndex(this.rfiDocumentsPSE, item), 1);
          break;
        case DOCUMENT_TYPES.RFI_PSEIC:
          this.rfiDocumentsPSEIC.splice(this.findRFIDocIndex(this.rfiDocumentsPSEIC, item), 1);
          break;
        case DOCUMENT_TYPES.RFI_ACCUP:
          this.rfiDocumentsACCUP.splice(this.findRFIDocIndex(this.rfiDocumentsACCUP, item), 1);
          break;
      }
    },
    async processRFISupportingDocuments() {
      await this.processDocumentFileDelete();
      const newFilesAdded = this.uploadedDocuments.filter((el) => !el.annotationid);
      if (newFilesAdded.length > 0) {
        await this.processDocumentFilesSave(newFilesAdded);
      }
    },
    async processDocumentFileDelete() {
      if (this.uploadedDocuments?.deletedItems?.length > 0) {
        await DocumentService.deleteDocuments(this.uploadedDocuments.deletedItems);
        this.uploadedDocuments.deletedItems = [];
      }
    },
    async processDocumentFilesSave(newFilesAdded) {
      const payload = [];
      for (const file of newFilesAdded) {
        if (file.documentbody) {
          const obj = {
            ccof_applicationid: this.applicationId,
            ccof_facility: this.currentFacility?.facilityId,
            subject: file.documentType,
            filename: file.filename,
            filesize: file.filesize,
            documentbody: file.documentbody,
            notetext: file.description,
          };
          payload.push(obj);
        }
      }
      try {
        await this.saveUploadedDocuments(payload);
      } catch (e) {
        console.error(e);
        if (e.response.data.status === 422) {
          // Most likely found a virus
          this.setFailureAlert(e.response.data.message);
        } else {
          this.setFailureAlert('An error occurred while saving. Please try again later.');
        }
      }
    },
  },
};
</script>

<style scoped>
.radio-label :deep(.v-label) {
  font-size: 18px;
  color: black;
}

.close-column {
  max-width: 50px;
}
</style>
