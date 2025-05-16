<template>
  <v-form ref="form" v-model="isValidForm">
    <v-container v-if="loading">
      <v-skeleton-loader v-if="loading" max-height="475px" :loading="loading" type="image, image" />
      <br />
      <v-skeleton-loader v-if="loading" max-height="475px" :loading="loading" type="image, image" />
      <br />
      <v-skeleton-loader v-if="loading" max-height="475px" :loading="loading" type="image , image" class="pb-6">
        <br /><br />
      </v-skeleton-loader>
    </v-container>
    <v-container v-else>
      <div class="pt-4 text-center">
        <p class="text-h5">
          Child Care Operating Funding Program - {{ formattedProgramYear }} Program Confirmation Form
        </p>
        <p class="text-h5 font-weight-bold">Parent Fee Increase – Request for Information</p>
        <br />
        <FacilityHeader
          :facility-account-number="currentFacility?.facilityAccountNumber"
          :facility-name="currentFacility.facilityName"
          :license-number="currentFacility?.licenseNumber"
        />
      </div>

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
      <v-card elevation="6" class="px-0 py-0 mx-auto my-10 rounded-lg col-12" rounded tiled exact tile :ripple="false">
        <div class="pa-0">
          <div class="pa-2 pa-md-4 ma-0 backG">
            <p class="text-h5 text--primary px-5 py-0 my-0">Exceptional Circumstances</p>
          </div>
          <br />
          <p class="text-h6 text--primary px-md-10 px-7 py-0 my-0">
            As outlined in the <a :href="fundingUrl" target="_blank">Funding Guidelines</a>, this exception applies to
            sudden and unexpected expenses that:
          </p>
          <div class="px-md-14 px-7 text--primary">
            <br />
            <ul class="ml-6">
              <li>Are outside of the organization's control and/or outside of the scope of regular cost increases;</li>
              <li>Address an immediate health or safety concern or are needed for the facility to operate; and</li>
              <li>Occur within six months of the requested fee increase.</li>
            </ul>
            <br />

            <label for="exceptionalCircumstances" class="span-label font-large"
              >Is your fee increase due to an exceptional circumstance?</label
            >
            <v-radio-group
              id="exceptionalCircumstances"
              v-model="model.exceptionalCircumstances"
              class="radio-label"
              :disabled="isReadOnly"
              required
              :rules="rules.required"
              inline
            >
              <v-radio label="Yes" :value="1" />
              <v-radio label="No" :value="0" />
            </v-radio-group>
            <br />
            <div v-if="model?.exceptionalCircumstances === 1">
              <label for="circumstanceOccurWithin6Month" class="span-label font-large"
                >Does the exceptional circumstance occur within 6 months of the fee increase?</label
              >
              <v-radio-group
                id="circumstanceOccurWithin6Month"
                v-model.number="model.circumstanceOccurWithin6Month"
                class="radio-label"
                :disabled="isReadOnly"
                required
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
            </div>
          </div>
        </div>

        <div v-if="model?.exceptionalCircumstances === 1 && model.circumstanceOccurWithin6Month === 1">
          <div class="pa-0">
            <div class="pa-2 pa-md-4 ma-0">
              <p class="text-h5 text--primary px-5 py-0 my-0">Expense Information</p>
            </div>
            <v-row class="justify-left mx-4">
              <AppAlertBanner type="info" class="ma-2 mb-4 w-100">
                <strong
                  >Note: See the <a :href="fundingUrl" target="_blank">Funding Guidelines</a> for the list of eligible
                  expenses</strong
                ></AppAlertBanner
              >
            </v-row>

            <div class="px-md-12 px-7">
              <v-row class="hidden-sm-and-down">
                <v-col class="col-md-3 col-12 ml-md-6">
                  <h3 class="text-center">Expense Description</h3>
                </v-col>

                <v-col class="col-md-3 col-12">
                  <h3 class="text-center">Date of expense</h3>
                </v-col>

                <v-col class="col-md-3 col-12">
                  <h3 class="text-center">Payment frequency details</h3>
                </v-col>

                <v-col class="col-md-2 col-12">
                  <h3 class="text-center">Expense amount</h3>
                </v-col>
              </v-row>

              <v-row v-for="(expense, index) in model.expenseList" :key="expense.id">
                <v-col cols="auto">
                  <v-icon
                    :disabled="isReadOnly"
                    size="large"
                    color="blue-darken-4"
                    class="mt-md-4"
                    @click="removeObjFromList(index, model.expenseList)"
                  >
                    mdi-close
                  </v-icon>
                </v-col>
                <v-col class="col-md-3 col-12">
                  <v-text-field
                    v-model="expense.description"
                    :disabled="isReadOnly"
                    class=""
                    label="Description"
                    variant="outlined"
                    clearable
                  />
                </v-col>

                <v-col class="col-md-3 col-12">
                  <AppDateInput
                    v-model="expense.date"
                    :rules="rules.required"
                    :disabled="isReadOnly"
                    :hide-details="isReadOnly"
                    label="Date"
                    clearable
                  />
                </v-col>

                <v-col class="col-md-3 col-12">
                  <v-select
                    v-model="expense.frequency"
                    :disabled="isReadOnly"
                    :items="items"
                    label="Expense Frequency"
                    variant="outlined"
                    :rules="rules.required"
                  />
                </v-col>

                <v-col class="col-md-2 col-12">
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

              <div class="form-group">
                <v-btn
                  :disabled="isReadOnly"
                  class="my-5"
                  dark
                  color="#003366"
                  @click="addObjToList(expenseObj, model.expenseList)"
                >
                  Add Expense
                </v-btn>
              </div>
              <br />
              <br />
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
            :r-f-i-type="'RFI-EC'"
            :r-f-i-documents="rfiDocumentsEC"
            @add-r-f-i-document="addRFISupportingDocument"
            @delete-r-f-i-document="deleteRFISupportingDocument"
            @add-r-f-i-row="addNewRowToUploadedDocuments"
            @add-r-f-i-document-description="addRFISupportingDocumentDescription"
          />
          <div class="pa-0">
            <div class="pa-2 pa-md-4 ma-0">
              <p class="text-h5 text--primary px-5 py-0 my-0">Other Sources of Ministry Funding</p>
            </div>
            <br />

            <div class="px-md-12 px-7">
              <label for="q3" class="span-label font-large"
                >Have you applied for any other sources of Ministry Funding (e.g. BC Maintenance Fund, Start-Up Grants)
                for any of the expenses you listed?</label
              >
              <v-radio-group
                v-model="model.q3"
                class="radio-label"
                :disabled="isReadOnly"
                required
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

              <div v-if="model.q3 === 1">
                <v-row class="hidden-sm-and-down">
                  <v-col class="col-md-3 col-12 ml-md-10">
                    <h3 class="text-center">Funding Program</h3>
                  </v-col>

                  <v-col class="col-md-2 col-12">
                    <h3 class="text-center">Application Date</h3>
                  </v-col>

                  <v-col class="col-md-2 col-12">
                    <h3 class="text-center">Status of Application</h3>
                  </v-col>

                  <v-col class="col-md-2 col-12">
                    <h3 class="text-center">Amount Received</h3>
                  </v-col>

                  <v-col class="col-md-2 col-12">
                    <h3 class="text-center">Expense(s)</h3>
                  </v-col>
                </v-row>

                <v-row v-for="(fundInfo, index) in model.fundingList" :key="fundInfo.id">
                  <v-col cols="auto">
                    <v-icon
                      :disabled="isReadOnly"
                      size="large"
                      color="blue-darken-4"
                      class="mt-md-4"
                      @click="removeObjFromList(index, model.fundingList)"
                    >
                      mdi-close
                    </v-icon>
                  </v-col>
                  <v-col class="col-md-3 col-12">
                    <v-text-field
                      v-model="fundInfo.fundingProgram"
                      :disabled="isReadOnly"
                      class=""
                      label="Funding Program"
                      variant="outlined"
                      clearable
                      :rules="rules.required"
                    />
                  </v-col>

                  <v-col class="col-md-2 col-12">
                    <AppDateInput
                      v-model="fundInfo.date"
                      :rules="rules.required"
                      :disabled="isReadOnly"
                      :hide-details="isReadOnly"
                      label="Date"
                      clearable
                    />
                  </v-col>

                  <v-col class="col-md-2 col-12">
                    <v-text-field
                      v-model="fundInfo.status"
                      :disabled="isReadOnly"
                      label="Status"
                      variant="outlined"
                      clearable
                      :rules="rules.required"
                    />
                  </v-col>

                  <v-col class="col-md-2 col-12">
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

                  <v-col class="col-md-2 col-12">
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

                <div class="form-group">
                  <v-btn
                    id="funding"
                    :disabled="isReadOnly"
                    class="my-5"
                    dark
                    color="#003366"
                    @click="addObjToList(fundingObj, model.fundingList)"
                  >
                    Add Funding
                  </v-btn>
                </div>
                <br />
              </div>
            </div>
          </div>
        </div>
      </v-card>

      <!--end show if yes / yes selected-->

      <!--end page 1 RFI landing-->

      <v-card
        elevation="6"
        class="px-0 py-0 mx-auto my-10 rounded-lg col-12"
        min-height="230"
        rounded
        tiled
        exact
        tile
        :ripple="false"
      >
        <div class="pa-0">
          <div class="pa-2 pa-md-4 ma-0 backG">
            <p class="text-h5 text--primary px-5 py-0 my-0">Direct Care staff Wages Increases</p>
          </div>

          <v-row class="justify-left mx-4">
            <AppAlertBanner type="info" class="ma-2 mb-4 w-100">
              <strong
                >Note: If your facility has ECE employees eligible for ECE Wage Enhancement (ECE-WE), you must apply for
                ECE-WE before being approved for a fee increase under this policy.</strong
              ></AppAlertBanner
            >
          </v-row>

          <br />

          <p class="text-h6 text--primary px-10 py-0 my-0">
            This exception applies to wage increases for Direct Care staff employed at the facility on a full-time,
            part-time or casual basis. Direct Care staff are staff who spend at least 50% of their working time directly
            responsible for and engaged in the care and supervision of children at the Facility.
          </p>

          <br />
          <div class="px-md-12 px-7">
            <br />
            <label for="feeIncreaseDueToWage" class="span-label font-large"
              >Is your fee increase due to a wage increase for Direct Care staff?</label
            >
            <v-radio-group
              id="feeIncreaseDueToWage"
              v-model="model.feeIncreaseDueToWage"
              class="radio-label"
              :disabled="isReadOnly"
              :rules="rules.required"
              required
              inline
            >
              <v-radio
                label="Yes"
                :value="1"
                @click="addObjToList(wageObj, model.wageList, model.wageList.length > 0)"
              />
              <v-radio label="No" :value="0" />
            </v-radio-group>

            <div v-if="model?.feeIncreaseDueToWage === 1">
              <div v-if="languageYearLabel === programYearTypes.HISTORICAL">
                <br />
                <label for="increaseInWriting" class="span-label font-large"
                  >Was the wage increase committed to (in writing) before the January 2022 release of the Funding
                  Guidelines?</label
                >
                <v-radio-group
                  id="increaseInWriting"
                  v-model="model.increaseInWriting"
                  class="radio-label"
                  :disabled="isReadOnly"
                  :rules="rules.required"
                  required
                  inline
                >
                  <v-radio label="Yes" :value="1" />
                  <v-radio label="No" :value="0" />
                </v-radio-group>
              </div>
              <br />

              <label for="isBargainingAgreement" class="span-label font-large"
                >Is the wage increase part of a collective bargaining agreement for Direct Care staff at the
                facility?</label
              >

              <v-radio-group
                id="isBargainingAgreement"
                v-model="model.isBargainingAgreement"
                class="radio-label"
                :disabled="isReadOnly"
                :rules="rules.required"
                required
                inline
              >
                <v-radio label="Yes" :value="1" />
                <v-radio label="No" :value="0" />
              </v-radio-group>

              <br />

              <label for="lossOfCareStaff" class="span-label font-large"
                >Has the facility been unable to hire and/or retain Direct Care staff due to wages?</label
              >

              <v-radio-group
                id="lossOfCareStaff"
                v-model="model.lossOfCareStaff"
                class="radio-label"
                :disabled="isReadOnly"
                :rules="rules.required"
                required
                inline
              >
                <v-radio label="Yes" :value="1" />
                <v-radio label="No" :value="0" />
              </v-radio-group>

              <br />

              <label for="lossOfCareStaff" class="span-label font-large"
                >Is this creating challenges in maintaining the staff-to-child ratios required under the facility
                licence?</label
              >
              <v-radio-group
                id="healthAndSafetyConcerns"
                v-model="model.healthAndSafetyConcerns"
                class="radio-label"
                :disabled="isReadOnly"
                :rules="rules.required"
                required
                inline
              >
                <v-radio label="Yes" :value="1" />
                <v-radio label="No" :value="0" />
              </v-radio-group>
            </div>
          </div>
        </div>

        <div v-if="model.feeIncreaseDueToWage === 1">
          <div class="pa-0">
            <div class="pa-2 pa-md-4 ma-0">
              <p class="text-h5 text--primary px-5 py-0 my-0">Direct Care staff Wages Increases</p>
            </div>
            <br />

            <v-row class="justify-left mx-4"
              ><AppAlertBanner type="info" class="ma-2 mb-4 w-100">
                <strong
                  >Note: If two or more staff have the same information for every column, they can be included in one
                  row.</strong
                ></AppAlertBanner
              ></v-row
            >

            <div class="px-md-12 px-10">
              <v-row class="hidden-sm-and-down mb-md-6">
                <v-col class="col-md-2 col-12 ml-md-8">
                  <h3 class="text-center">Number of staff receiving wage increase</h3>
                </v-col>

                <v-col class="col-md-2 col-12">
                  <h3 class="text-center">Direct Care staff role</h3>
                  <br />
                  <p class="text-center font-small">(e.g. Responsible Adult, ECE, ECEA, etc)</p>
                </v-col>

                <v-col class="col-md-2 col-12">
                  <h3 class="text-center">Wage before increase</h3>
                  <br />
                  <p class="text-center font-small">(not including ECE-WE)</p>
                </v-col>

                <v-col class="col-md-2 col-12">
                  <h3 class="text-center">Wage after increase</h3>
                  <br />
                  <p class="text-center font-small">(not including ECE-WE)</p>
                </v-col>

                <v-col class="col-md-2 col-12">
                  <h3 class="text-center">Average hours per week at this facility</h3>
                </v-col>

                <v-col class="col-md-1 col-12">
                  <h3 class="text-center">Date</h3>
                </v-col>
              </v-row>

              <v-row v-for="(obj, index) in model.wageList" :key="obj.id" class="mt-md-10">
                <v-col cols="auto">
                  <v-icon
                    :disabled="isReadOnly"
                    size="large"
                    color="blue-darken-4"
                    class="mt-md-4"
                    @click="removeObjFromList(index, model.wageList)"
                  >
                    mdi-close
                  </v-icon>
                </v-col>

                <v-col class="col-md-2 col-12">
                  <v-text-field
                    v-model.number="obj.staffNumber"
                    :disabled="isReadOnly"
                    type="number"
                    class=""
                    label="Number of Staff Recieving Wage Increase"
                    variant="outlined"
                    clearable
                    :rules="rules.required"
                    @wheel="$event.target.blur()"
                    @update:model-value="convertBlankNumberToNull(obj, 'staffNumber')"
                  />
                </v-col>

                <v-col class="col-md-2 col-12">
                  <v-text-field
                    v-model="obj.staffRole"
                    :disabled="isReadOnly"
                    class=""
                    label="Direct Care staff Role "
                    variant="outlined"
                    clearable
                    :rules="rules.required"
                  />
                </v-col>

                <v-col class="col-md-2 col-12">
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

                <v-col class="col-md-2 col-12">
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

                <v-col class="col-md-2 col-12">
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

                <v-col cols="auto">
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

              <div class="form-group">
                <v-btn
                  id="wagebtn"
                  :disabled="isReadOnly"
                  class="my-5"
                  dark
                  color="#003366"
                  @click="addObjToList(wageObj, model.wageList)"
                >
                  Add Wage
                </v-btn>
              </div>
              <br />
            </div>
          </div>

          <div class="pa-0">
            <div class="pa-2 pa-md-4 ma-0">
              <p class="text-h5 text--primary px-5 py-0 my-0">Please tell us more:</p>
            </div>
            <br />
            <div class="px-md-12 px-7">
              <br />
              <label for="wage"> When did your facility's challenges with hiring and keeping staff begin? </label>
              <v-textarea
                id="wage"
                v-model="model.textbox1"
                :disabled="isReadOnly"
                :rules="rules.required"
                placeholder="Describe here"
                variant="outlined"
              />

              <br />
              <label for="wage1"> How many Direct Care staff have left your facility due to wages? </label>
              <v-textarea
                id="wage1"
                v-model="model.textbox2"
                :disabled="isReadOnly"
                :rules="rules.required"
                placeholder="Describe here"
                variant="outlined"
              />

              <br />
              <label for="wage2"> What have you done to try to recruit staff? </label>
              <v-textarea
                id="wage2"
                v-model="model.textbox3"
                :disabled="isReadOnly"
                :rules="rules.required"
                placeholder="Describe here"
                variant="outlined"
              />

              <br />
              <label for="wage3">Have you had to adjust your hours/days of operation? </label>
              <v-textarea
                id="wage3"
                v-model="model.textbox4"
                :disabled="isReadOnly"
                :rules="rules.required"
                placeholder="Describe here"
                variant="outlined"
              />

              <br />
              <label for="wage4"> Is your facility unable to fill spaces due to insufficient staffing? </label>
              <v-textarea
                id="wage4"
                v-model="model.textbox5"
                :disabled="isReadOnly"
                :rules="rules.required"
                placeholder="Describe here"
                variant="outlined"
              />

              <br />
              <label for="wage5"> Is there anything else you would like us to know about the wage increase(s)? </label>
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
              :r-f-i-type="'RFI-DCSWI'"
              :r-f-i-documents="rfiDocumentsDCSWI"
              @add-r-f-i-document="addRFISupportingDocument"
              @add-r-f-i-row="addNewRowToUploadedDocuments"
              @delete-r-f-i-document="deleteRFISupportingDocument"
              @add-r-f-i-document-description="addRFISupportingDocumentDescription"
            />
          </div>
        </div>
      </v-card>

      <!--End page two Wage Increase-->

      <v-card
        elevation="6"
        class="px-0 py-0 mx-auto my-10 rounded-lg col-12"
        min-height="230"
        rounded
        tiled
        exact
        tile
        :ripple="false"
      >
        <div class="pa-0">
          <div class="pa-2 pa-md-4 ma-0 backG">
            <p class="text-h5 text--primary px-5 py-0 my-0">
              Priority Service Expansion: Increase in Hours of Operation
            </p>
          </div>
          <br />

          <div class="px-md-12 px-7">
            <br />
            <label for="feeIncreaseExtendedHours" class="span-label font-large"
              >Is your fee increase due to expenses related to expanding or extending the hours of child care service
              available for all enrolled children?</label
            >
            <v-radio-group
              id="feeIncreaseExtendedHours"
              v-model="model.feeIncreaseExtendedHours"
              class="radio-label"
              :disabled="isReadOnly"
              required
              inline
            >
              <v-radio
                label="Yes"
                :value="1"
                @click="addObjToList(expansionObj, model.expansionList, model.expansionList.length > 0)"
              />
              <v-radio label="No" :value="0" />
            </v-radio-group>
            <br />
          </div>
        </div>

        <div v-if="model.feeIncreaseExtendedHours === 1">
          <div class="pa-0">
            <div class="pa-2 pa-md-4 ma-0">
              <p class="text-h5 text--primary px-5 py-0 my-0">Service Expansion Details</p>
            </div>
            <br />
            <div class="px-md-12 px-7">
              <v-row class="hidden-sm-and-down">
                <div class="mt-md-6 mx-md-6"></div>
                <v-col class="col-md-2 col-12">
                  <h3>Facility's previous hours of operation</h3>
                  <br />
                  <p>(e.g. 9:00 am - 4:00 pm)</p>
                </v-col>
                <v-col class="col-md-2 col-12">
                  <h3>Facility's new hours of operation</h3>
                  <br />
                  <p>(e.g. 6:00 am - 5:00 pm)</p>
                </v-col>
                <v-col class="col-md-2 col-12">
                  <h3 class="text-center">Date of Change</h3>
                </v-col>
                <v-col class="col-md-2 col-12">
                  <h3 class="text-center">Amount of Expense</h3>
                </v-col>
                <v-col class="col-md-2 col-12">
                  <h3 class="text-center">Payment frequency</h3>
                </v-col>
              </v-row>

              <v-row v-for="(obj, index) in model.expansionList" :key="obj.id">
                <v-icon
                  cols="auto"
                  :disabled="isReadOnly"
                  size="large"
                  color="blue-darken-4"
                  class="mt-md-6 mx-md-6"
                  @click="removeObjFromList(index, model.expansionList)"
                >
                  mdi-close
                </v-icon>

                <v-col class="col-md-1 col-12 ml-md-n8">
                  <AppTimeInput
                    v-model="obj.timefrom"
                    :disabled="isReadOnly"
                    full-width
                    max-width="200px"
                    label="From"
                  />

                  <!-- we need logic to prevent choosing a time before -->

                  <AppTimeInput v-model="obj.timeto" :disabled="isReadOnly" full-width max-width="200px" label="To" />
                </v-col>

                <v-col class="col-md-1 col-12">
                  <AppTimeInput
                    v-model="obj.newtimefrom"
                    :disabled="isReadOnly"
                    full-width
                    max-width="200px"
                    label="From"
                  />

                  <AppTimeInput
                    v-model="obj.newtimeto"
                    :disabled="isReadOnly"
                    full-width
                    max-width="200px"
                    label="To"
                  />
                </v-col>

                <v-col class="cols-md-auto col-lg-2 col-xl-1 col-12">
                  <AppDateInput
                    v-model="obj.date"
                    :disabled="isReadOnly"
                    :hide-details="isReadOnly"
                    label="Date"
                    :rules="rules.required"
                    clearable
                  />
                </v-col>

                <v-col class="col-md-2 col-12">
                  <v-text-field
                    v-model.number="obj.expense"
                    :disabled="isReadOnly"
                    type="number"
                    variant="outlined"
                    :rules="rules.required"
                    prefix="$"
                    @wheel="$event.target.blur()"
                    @update:model-value="convertBlankNumberToNull(obj, 'expense')"
                  />
                </v-col>

                <v-col class="col-md-2 col-12">
                  <v-select
                    v-model="obj.frequency"
                    :disabled="isReadOnly"
                    :items="items"
                    label="Payment Frequency"
                    variant="outlined"
                    :rules="rules.required"
                  />
                </v-col>
              </v-row>
              <!-- end v for-->

              <div class="form-group">
                <v-btn
                  :disabled="isReadOnly"
                  class="my-5"
                  dark
                  color="#003366"
                  @click="addObjToList(expansionObj, model.expansionList)"
                >
                  Add Expansion Details
                </v-btn>
              </div>

              <br />
              <br />
              <label for="serviceExpense"> Describe each of your expenses above. (e.g. Wages, Utilities) </label>
              <v-textarea
                id="serviceExpense"
                v-model="model.serviceExpansionDetailsNote"
                :disabled="isReadOnly"
                :rules="rules.required"
                variant="outlined"
                placeholder="Describe here"
              />

              <br />
              <br />
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
          <RFIDocumentUpload
            :current-facility="currentFacility"
            :r-f-i-type="'RFI-PSE'"
            :r-f-i-documents="rfiDocumentsPSE"
            @add-r-f-i-document="addRFISupportingDocument"
            @delete-r-f-i-document="deleteRFISupportingDocument"
            @add-r-f-i-row="addNewRowToUploadedDocuments"
            @add-r-f-i-document-description="addRFISupportingDocumentDescription"
          />
        </div>
      </v-card>

      <!-- End page 3 Service Expansion Hours-->

      <v-card
        elevation="6"
        class="px-0 py-0 mx-auto my-10 rounded-lg col-12"
        min-height="230"
        rounded
        tiled
        exact
        tile
        :ripple="false"
      >
        <div class="pa-0">
          <div class="pa-2 pa-md-4 ma-0 backG">
            <p class="text-h5 text--primary px-5 py-0 my-0">
              Priority Service Expansion: Increasing Connection to Indigenous Community, Culture, and/or Language
            </p>
          </div>
          <br />

          <div class="px-md-12 px-7">
            <br />
            <label for="IndigenousConnection" class="span-label font-large"
              >Is your fee increase due to an increased connection to Indigenous community, culture, or language for all
              enrolled children in a Facility owned, managed, or governed by at least 51% Indigenous peoples?</label
            >
            <v-radio-group
              id="IndigenousConnection"
              v-model="model.IndigenousConnection"
              class="radio-label"
              :disabled="isReadOnly"
              required
              :rules="rules.required"
              inline
            >
              <br />
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
              <a href="https://www2.gov.bc.ca/assets/download/3013BFFE26E24901A2EE764FC17FD05E" target="_blank"
                >Funding Guidelines</a
              >, this may include:
            </p>

            <ul class="ml-10">
              <li>
                Participation of an Elder, culture/language teacher, and/or family members in the child care program;
              </li>
              <li>Children's participation in community, language, and/or cultural events or activities; or</li>
              <li>Language or culture resources for use in the child care program.</li>
            </ul>
          </div>
          <br />
        </div>

        <div v-if="model.IndigenousConnection === 1">
          <div class="pa-0">
            <div class="pa-2 pa-md-4 ma-0">
              <p class="text-h5 text--primary px-5 py-0 my-0">Expense Information</p>
            </div>
            <br />

            <div class="px-md-12 px-7">
              <v-row class="hidden-sm-and-down">
                <v-col class="col-md-3 col-12 ml-md-6">
                  <h3 class="text-center">Expense Description</h3>
                </v-col>

                <v-col class="col-md-3 col-12">
                  <h3 class="text-center">Date of expense</h3>
                </v-col>

                <v-col class="col-md-3 col-12">
                  <h3 class="text-center">Payment frequency details</h3>
                </v-col>

                <v-col class="col-md-2 col-12">
                  <h3 class="text-center">Expense amount</h3>
                </v-col>
              </v-row>
              <v-row v-for="(indigExpense, index) in model.indigenousExpenseList" :key="indigExpense.id">
                <v-col cols="auto">
                  <v-icon
                    :disabled="isReadOnly"
                    size="large"
                    color="blue-darken-4"
                    class="mt-md-4"
                    @click="removeObjFromList(index, model.indigenousExpenseList)"
                  >
                    mdi-close
                  </v-icon>
                </v-col>
                <v-col class="col-md-3 col-12">
                  <v-text-field
                    v-model="indigExpense.description"
                    :disabled="isReadOnly"
                    class=""
                    label="Description"
                    variant="outlined"
                    clearable
                    :rules="rules.required"
                  />
                </v-col>

                <v-col class="col-md-3 col-12">
                  <AppDateInput
                    v-model="indigExpense.date"
                    :rules="rules.required"
                    :disabled="isReadOnly"
                    :hide-details="isReadOnly"
                    label="Date"
                    clearable
                  />
                </v-col>

                <v-col class="col-md-3 col-12">
                  <v-select
                    v-model="indigExpense.frequency"
                    :disabled="isReadOnly"
                    :items="items"
                    label="Expense Frequency"
                    variant="outlined"
                    :rules="rules.required"
                  />
                </v-col>

                <v-col class="col-md-2 col-12">
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

              <div class="form-group">
                <v-btn
                  id="indigEx"
                  :disabled="isReadOnly"
                  class="my-5"
                  dark
                  color="#003366"
                  @click="addObjToList(indigenousExpenseObj, model.indigenousExpenseList)"
                >
                  Add Expense
                </v-btn>
              </div>
              <br />

              <p class="text-h6 text--primary py-5 my-0" />

              <div class="">
                <br />
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
            :r-f-i-type="'RFI-PSEIC'"
            :r-f-i-documents="rfiDocumentsPSEIC"
            @add-r-f-i-document="addRFISupportingDocument"
            @delete-r-f-i-document="deleteRFISupportingDocument"
            @add-r-f-i-row="addNewRowToUploadedDocuments"
            @add-r-f-i-document-description="addRFISupportingDocumentDescription"
          />
        </div>
        <!--end show if yes / yes selected-->
      </v-card>

      <!-- End Page 4 Indigenous Service Expansion-->

      <v-card
        elevation="6"
        class="px-0 py-0 mx-auto my-10 rounded-lg col-12"
        min-height="230"
        rounded
        tiled
        exact
        tile
        :ripple="false"
      >
        <div class="pa-0">
          <div class="pa-2 pa-md-4 ma-0 backG">
            <p class="text-h5 text--primary px-5 py-0 my-0">Affordable Child Care for Underserved Populations</p>
          </div>
          <br />

          <div class="px-md-12 px-7">
            <br />
            <p>Fee increases may be considered under this exception if:</p>
            <ul class="ml-md-8">
              <li>
                The facility has historically provided care to underserved populations - including Indigenous or
                low-income families - at significantly below the regional median fees for their area or at no fee;
              </li>
              <li>The fee increase will contribute to the operational sustainability of the organization; and</li>
              <li>The fee increase will not greatly increase the out-of-pocket cost of care for families.</li>
            </ul>
            <br />
            <label for="underservedPop" class="span-label font-large"
              >Does this Facility meet all the above criteria?</label
            >
            <v-radio-group
              id="underservedPop"
              v-model="model.underservedPop"
              class="radio-label"
              :disabled="isReadOnly"
              required
              :rules="rules.required"
              inline
            >
              <v-radio label="Yes" :value="1" />
              <v-radio label="No" :value="0" />
            </v-radio-group>
            <br />

            <div v-if="model.underservedPop === 1">
              <br />
              <div class="pa-0">
                <div class="pa-2 pa-md-4 ma-0">
                  <label for="underservedPop1"
                    >Please describe how the majority of children you provide care for represent an underserved
                    population (e.g. Indigenous children, low-income families?)</label
                  >
                  <v-textarea
                    id="underservedPop1"
                    v-model="model.underservedChildCareTypes"
                    :disabled="isReadOnly"
                    :rules="rules.required"
                    variant="outlined"
                    placeholder="Describe here"
                  />

                  <br />
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
                  />

                  <br />
                  <label for="underservedPop3"
                    >Describe whether parents' out-of-pocket monthly cost for child care will be affected by this
                    increase (after applying reductions from CCFRI and the Affordable Child Care Benefit, and any other
                    applicable funding source). Will any families experience a cost increase, and if so, by how
                    much?</label
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
              </div>
              <RFIDocumentUpload
                :current-facility="currentFacility"
                :r-f-i-type="'RFI-ACCUP'"
                :r-f-i-documents="rfiDocumentsACCUP"
                @add-r-f-i-document="addRFISupportingDocument"
                @add-r-f-i-row="addNewRowToUploadedDocuments"
                @delete-r-f-i-document="deleteRFISupportingDocument"
                @add-r-f-i-document-description="addRFISupportingDocumentDescription"
              />
            </div>
          </div>
        </div>
      </v-card>

      <NavButton
        :is-next-displayed="true"
        :is-save-displayed="true"
        :is-save-disabled="isReadOnly"
        :is-next-disabled="!isFormComplete"
        :is-processing="processing"
        @previous="previous"
        @next="nextBtnClicked"
        @validate-form="validateForm()"
        @save="save(true)"
      />
    </v-container>
  </v-form>
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

import AppTimeInput from '@/components/guiComponents/AppTimeInput.vue';
import AppDateInput from '@/components/guiComponents/AppDateInput.vue';
import FacilityHeader from '@/components/guiComponents/FacilityHeader.vue';
import RFIDocumentUpload from '@/components/RFI/RFIDocumentUpload.vue';
import NavButton from '@/components/util/NavButton.vue';

import DocumentService from '@/services/documentService';

import alertMixin from '@/mixins/alertMixin.js';
import globalMixin from '@/mixins/globalMixin.js';
import { deepCloneObject } from '@/utils/common.js';
import rules from '@/utils/rules.js';

import AppAlertBanner from '@/components/guiComponents/AppAlertBanner.vue';

import { PROGRAM_YEAR_LANGUAGE_TYPES } from '@/utils/constants.js';

let model = {
  expansionList: [],
  wageList: [],
  fundingList: [],
  expenseList: [],
  indigenousExpenseList: [],
};

export default {
  name: 'CcfriRequestMoreInfo',
  components: { FacilityHeader, RFIDocumentUpload, NavButton, AppTimeInput, AppDateInput, AppAlertBanner },
  mixins: [alertMixin, globalMixin],
  async beforeRouteLeave(_to, _from, next) {
    const rfiAppStore = useRfiAppStore();
    rfiAppStore.setRfiModel(this.model);
    await this.save(false);
    next();
  },
  data() {
    return {
      rules,
      loading: true,
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
      timeto: null,
      timefrom: null,
      menufrom: false,
      menuto: false,
      newtimeto: null,
      newtimefrom: null,
      newmenufrom: false,
      newmenuto: false,
      model,
      input: '',
      items: ['One-time', 'Daily', 'Weekly', 'Monthly'],
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
    ...mapState(useApplicationStore, ['formattedProgramYear', 'applicationStatus', 'applicationId', 'programYearId']),
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
    programYearTypes() {
      return PROGRAM_YEAR_LANGUAGE_TYPES;
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
          window.scrollTo(0, 0);
          let ccfriId = this.$route.params.urlGuid;
          await this.loadRfi(ccfriId);
          await this.refreshSupportingDocuments();
          this.model = deepCloneObject(this.rfiModel);
          this.$refs.form?.resetValidation();
        } catch (error) {
          console.log(error);
          this.setFailureAlert('An error occured while retrieving data.');
        }

        this.loading = false;
      },
      immediate: true,
      deep: true,
    },
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
        this.uploadedDocuments?.filter((x) => x.documentType === 'RFI-EC' && x.ccof_facility === facilityId) || [];
      this.rfiDocumentsDCSWI =
        this.uploadedDocuments?.filter((x) => x.documentType === 'RFI-DCSWI' && x.ccof_facility === facilityId) || [];
      this.rfiDocumentsPSE =
        this.uploadedDocuments?.filter((x) => x.documentType === 'RFI-PSE' && x.ccof_facility === facilityId) || [];
      this.rfiDocumentsPSEIC =
        this.uploadedDocuments?.filter((x) => x.documentType === 'RFI-PSEIC' && x.ccof_facility === facilityId) || [];
      this.rfiDocumentsACCUP =
        this.uploadedDocuments?.filter((x) => x.documentType === 'RFI-ACCUP' && x.ccof_facility === facilityId) || [];
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
        case 'RFI-EC':
          this.rfiDocumentsEC.unshift(item);
          break;
        case 'RFI-DCSWI':
          this.rfiDocumentsDCSWI.unshift(item);
          break;
        case 'RFI-PSE':
          this.rfiDocumentsPSE.unshift(item);
          break;
        case 'RFI-PSEIC':
          this.rfiDocumentsPSEIC.unshift(item);
          break;
        case 'RFI-ACCUP':
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
        case 'RFI-EC':
          this.rfiDocumentsEC.splice(this.findRFIDocIndex(this.rfiDocumentsEC, item), 1);
          break;
        case 'RFI-DCSWI':
          this.rfiDocumentsDCSWI.splice(this.findRFIDocIndex(this.rfiDocumentsDCSWI, item), 1);
          break;
        case 'RFI-PSE':
          this.rfiDocumentsPSE.splice(this.findRFIDocIndex(this.rfiDocumentsPSE, item), 1);
          break;
        case 'RFI-PSEIC':
          this.rfiDocumentsPSEIC.splice(this.findRFIDocIndex(this.rfiDocumentsPSEIC, item), 1);
          break;
        case 'RFI-ACCUP':
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
      } catch {
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      }
    },
  },
};
</script>

<style scoped>
.backG {
  background-color: lightgray;
}

.radio-label :deep(.v-label) {
  font-size: 18px;
  color: black;
}
.blueText {
  color: rgb(0, 52, 102);
}
</style>
