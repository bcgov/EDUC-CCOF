<template>
  <v-form ref="form" value="false" v-model="isValidForm">
    <v-container v-if="loading">
      <v-skeleton-loader max-height="475px" v-if="loading" :loading="loading" type="image, image"></v-skeleton-loader>
      <br>
      <v-skeleton-loader max-height="475px" v-if="loading" :loading="loading" type="image, image"></v-skeleton-loader>
      <br>
      <v-skeleton-loader max-height="475px" v-if="loading" :loading="loading" type="image , image" class="pb-6"><br><br>
      </v-skeleton-loader>
    </v-container>
    <v-container v-else>

      <div class="pt-4 text-center">
        <p class="text-h5">Child Care Operating Funding Program - {{ formattedProgramYear }} Program Confirmation
          Form</p>
        <p class="text-h5 font-weight-bold">Parent Fee Increase – Request for Information</p>
        <br>
        <FacilityHeader :facilityAccountNumber="currentFacility?.facilityAccountNumber" :facilityName="currentFacility.facilityName" :licenseNumber="currentFacility?.licenseNumber"></FacilityHeader>
      </div>

      <div class="my-10">
        <p>
          You have entered a parent fee above the {{ formattedProgramYear }} fee increase limit.
          Fee increases over the limit will be assessed under the Parent Fee Increase Exceptions policy.
          See the <a :href="fundingUrl"  target="_blank">Funding Guidelines</a> for more information.
        </p>
        <p>
          Complete this section to provide more information about your fee increase, or click “Back” to return to the
          previous page.
        </p>
      </div>
      <v-card elevation="6" class="px-0 py-0 mx-auto my-10 rounded-lg col-12"
              rounded
              tiled
              exact
              tile
              :ripple="false"
      >
        <div class="pa-0">
          <div class="pa-2 pa-md-4 ma-0 backG">
            <p class="text-h5 text--primary px-5 py-0 my-0">
              Exceptional Circumstances
            </p>
          </div>
          <br>
          <p class="text-h6 text--primary px-md-10 px-7 py-0 my-0">
            As outlined in the <a :href="fundingUrl"  target="_blank">Funding Guidelines</a>, this exception applies to sudden and
            unexpected expenses that:
          </p>
          <div class="px-md-14 px-7 text--primary">
            <br>
            <ul>
              <li>
                are outside of the organization’s control and/or outside of the scope of regular cost increases;
              </li>
              <li>
                address an immediate health or safety concern or are needed for the facility to operate; and
              </li>
              <li>
                occur within six months of the requested fee increase.
              </li>
            </ul>
            <br>
            <v-radio-group
              class="radio-label"
              :disabled="isReadOnly"
              required
              :rules="rules.required"
              row
              v-model="model.exceptionalCircumstances"
              label="Is your fee increase due to an exceptional circumstance?"
            >
              <v-radio
                label="Yes"
                :value="1"
              ></v-radio>
              <v-radio
                label="No"
                :value="0"
              ></v-radio>
            </v-radio-group>
            <br>
            <div v-if="model.exceptionalCircumstances == 1">
              <v-radio-group
                class="radio-label"
                :disabled="isReadOnly"
                required
                :rules="rules.required"
                row
                v-model.number="model.circumstanceOccurWithin6Month"
                label="Does the exceptional circumstance occur within 6 months of the fee increase?"
              >
                <v-radio
                  label="Yes"
                  :value="1"
                ></v-radio>
                <v-radio
                  label="No"
                  :value="0"
                ></v-radio>
              </v-radio-group>
            </div>
          </div>
        </div>

        <div v-if="model.exceptionalCircumstances == 1 && model.circumstanceOccurWithin6Month == 1 ">
          <div class="pa-0">
            <div class="pa-2 pa-md-4 ma-0">
              <p class="text-h5 text--primary px-5 py-0 my-0">
                Expense Information
              </p>
            </div>
            <v-banner
              class="ma-4"
              color="blue lighten-4"
              elevation="5"
            >
              <v-icon
                large
                color="blue darken-4"
                class="mr-5"
              > mdi-information
              </v-icon>
              <strong>Note: See the <a :href="fundingUrl"  target="_blank">Funding Guidelines</a> for the list of eligible expenses</strong>
            </v-banner>
            <div class="px-md-12 px-7">

              <v-row class="hidden-sm-and-down">

                <v-col class="col-md-1 col-12 mx-0">
                  <!--here for spacing-->
                </v-col>

                <v-col class="col-md-3 col-12 ">
                  <h3 class="text-center"> Expense Description</h3>
                </v-col>

                <v-col class="col-md-3 col-12 ">
                  <h3 class="text-center"> Date of expense</h3>
                </v-col>

                <v-col class="col-md-3 col-12 ">
                  <h3 class="text-center"> Payment frequency details</h3>
                </v-col>

                <v-col class="col-md-2 col-12 ">
                  <h3 class="text-center">Expense amount</h3>
                </v-col>

              </v-row>

              <v-row v-for="(expense, index) in model.expenseList" :key="index">
                <v-col class="col-md-1 col-12 mx-0">
                  <v-icon
                    :disabled="isReadOnly"
                    large
                    color="blue darken-4"
                    class="mt-md-4"
                    @click="removeObjFromList(index, model.expenseList)"
                  > mdi-close
                  </v-icon>
                </v-col>
                <v-col class="col-md-3 col-12 ">

                  <v-text-field
                    :disabled="isReadOnly"
                    class=""
                    v-model="expense.description"
                    label="Description"
                    outlined
                    clearable
                  ></v-text-field>
                </v-col>

                <v-col class="col-md-3 col-12">
                  <v-menu v-model="calendarMenu[index]" :close-on-content-click="false" :nudge-right="40"
                          transition="scale-transition" offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field :disabled="isReadOnly"
                                    :rules="rules.required" outlined v-model="expense.date"
                                    label="Date of Expense (YYYY-MM-DD)"
                                    readonly v-bind="attrs" v-on="on">
                      </v-text-field>
                    </template>
                    <v-date-picker
                      :disabled="isReadOnly"
                      clearable
                      v-model="expense.date"
                      @input="calendarMenu[index] = false">
                    </v-date-picker>
                  </v-menu>
                </v-col>

                <v-col class="col-md-3 col-12">
                  <v-select
                    :disabled="isReadOnly"
                    :items="items"
                    label="Expense Frequency"
                    outlined
                    v-model="expense.frequency"
                    :rules="rules.required"
                  ></v-select>
                </v-col>

                <v-col class="col-md-2 col-12">
                  <v-text-field :disabled="isReadOnly"
                                type="number" @wheel="$event.target.blur()"
                                outlined
                                :rules="rules.required"
                                v-model.number="expense.expense"
                                @input="convertBlankNumberToNull(expense,'expense')"
                                prefix="$"
                                label="Expense"
                  />
                </v-col>

                <span class="white--text"> . </span>
                <v-divider></v-divider>

              </v-row> <!-- end v for-->

              <div class="form-group">
                <v-btn id="" @click="addObjToList(expenseObj, model.expenseList)" :disabled="isReadOnly" class="my-5"
                       dark color='#003366'>
                  Add Expense
                </v-btn>
              </div>
              <br>
              <br>
              <label for="textArea"> Please describe the reason for each expense listed above. </label>
              <v-textarea
                id="textArea"
                :disabled="isReadOnly"
                :rules="rules.required"
                placeholder="Describe Here"
                outlined
                name="input-7-4"
                v-model="model.expenseInformationNote"
              ></v-textarea>
            </div>

          </div>
          <RFIDocumentUpload @addRFIDocument="addRFISupportingDocument" @deleteRFIDocument="deleteRFISupportingDocument"
                             @addRFIRow="addNewRowToUploadedDocuments"
                             @addRFIDocumentDescription="addRFISupportingDocumentDescription"
                             :current-facility="currentFacility" :r-f-i-type="'RFI-EC'"
                             :r-f-i-documents="this.rfiDocumentsEC"></RFIDocumentUpload>
          <div class="pa-0">
            <div class="pa-2 pa-md-4 ma-0">
              <p class="text-h5 text--primary px-5 py-0 my-0">
                Other Sources of Ministry Funding
              </p>
            </div>
            <br>
            <div class="px-md-12 px-7">
              <v-radio-group
                class="radio-label"
                :disabled="isReadOnly"
                required
                :rules="rules.required"
                row
                v-model="model.q3"
                label="Have you applied for any other sources of Ministry Funding (e.g. BC Maintenance Fund, Start-Up Grants)
              for any of the expenses you listed?"
              >
                <v-radio
                  label="Yes"
                  :value="1"
                ></v-radio>
                <v-radio
                  label="No"
                  :value="0"
                ></v-radio>
              </v-radio-group>

              <div v-if="model.q3 === 1">


                <v-row class="hidden-sm-and-down">

                  <v-col class="col-md-1 col-12 mx-0">
                    <!--here for spacing-->
                  </v-col>

                  <v-col class="col-md-3 col-12 ">
                    <h3 class="text-center"> Funding Program</h3>
                  </v-col>

                  <v-col class="col-md-2 col-12 ">
                    <h3 class="text-center"> Application Date</h3>
                  </v-col>

                  <v-col class="col-md-2 col-12 ">
                    <h3 class="text-center">Status of Application</h3>
                  </v-col>

                  <v-col class="col-md-2 col-12 ">
                    <h3 class="text-center"> Amount Received</h3>
                  </v-col>

                  <v-col class="col-md-2 col-12 ">
                    <h3 class="text-center"> Expense(s)</h3>
                  </v-col>

                </v-row>

                <v-row v-for="(fundInfo, index) in model.fundingList" :key="index">
                  <v-col class="col-md-1 col-12 mx-0">
                    <v-icon
                      :disabled="isReadOnly"
                      large
                      color="blue darken-4"
                      class="mt-md-4"
                      @click="removeObjFromList(index, model.fundingList)"
                    > mdi-close
                    </v-icon>
                  </v-col>
                  <v-col class="col-md-3 col-12 ">
                    <v-text-field
                      :disabled="isReadOnly"
                      class=""
                      v-model="fundInfo.fundingProgram"
                      label="Funding Program"
                      outlined
                      clearable
                      :rules="rules.required"
                    ></v-text-field>
                  </v-col>

                  <v-col class="col-md-2 col-12">
                    <v-menu v-model="fundingCalendar[index]" :close-on-content-click="false" :nudge-right="40"
                            transition="scale-transition" offset-y min-width="auto">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field :disabled="isReadOnly" :rules="rules.required" outlined v-model="fundInfo.date"
                                      label="Date (YYYY-MM-DD)" readonly
                                      v-bind="attrs" v-on="on">
                        </v-text-field>
                      </template>
                      <v-date-picker
                        clearable
                        v-model="fundInfo.date"
                        @input="fundingCalendar[index] = false">
                      </v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col class="col-md-2 col-12 ">
                    <v-text-field
                      :disabled="isReadOnly"
                      v-model="fundInfo.status"
                      label="Status"
                      outlined
                      clearable
                      :rules="rules.required"
                    ></v-text-field>
                  </v-col>

                  <v-col class="col-md-2 col-12">
                    <v-text-field
                      :disabled="isReadOnly"
                      outlined
                      :rules="rules.required"
                      label="Amount Received"
                      type="number" @wheel="$event.target.blur()"
                      v-model.number="fundInfo.amount"
                      @input="convertBlankNumberToNull(fundInfo,'amount')"
                      prefix="$"/>
                  </v-col>

                  <v-col class="col-md-2 col-12 ">
                    <v-text-field
                      :disabled="isReadOnly"
                      type="number" @wheel="$event.target.blur()"
                      prefix="$"
                      v-model.number="fundInfo.expenses"
                      @input="convertBlankNumberToNull(fundInfo,'expenses')"
                      label="Expense"
                      outlined
                      clearable
                      :rules="rules.required"
                    ></v-text-field>
                  </v-col>

                  <span class="white--text"> . </span>
                  <v-divider></v-divider>

                </v-row> <!-- end v for-->


                <div class="form-group">
                  <v-btn id="funding" :disabled="isReadOnly" @click="addObjToList(fundingObj, model.fundingList)"
                         class="my-5" dark color='#003366'>Add
                    Funding
                  </v-btn>
                </div>
                <br>

              </div>
            </div>
          </div>
        </div>
      </v-card>


      <!--end show if yes / yes selected-->

      <!--end page 1 RFI landing-->

      <v-card elevation="6" class="px-0 py-0 mx-auto my-10 rounded-lg col-12 "
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
              Direct Care Staff Wages Increases
            </p>
          </div>

          <v-banner
            two-line
            class="ma-4"
            color="blue lighten-4"
            elevation="5"
          >
            <v-icon
              large
              color="blue darken-4"
              class="mr-5"
            > mdi-information
            </v-icon>
            <strong>Note: if your facility has ECE employees eligible for ECE Wage Enhancement (ECE-WE), you must apply
              for ECE-WE
              before being approved for a fee increase under this policy.</strong>
          </v-banner>
          <br>

          <p class="text-h6 text--primary px-5 py-0 my-0">
            This exception applies to wage increases for Direct Care Staff employed at the facility on a full-time,
            part-time, or casual basis, providing direct care to children for 50% or more of their working time.
          </p>

          <br>
          <div class="px-md-12 px-7">
            <br>
            <v-radio-group
              class="radio-label"
              :disabled="isReadOnly"
              :rules="rules.required"
              required
              row
              v-model="model.feeIncreaseDueToWage"
              label="Is your fee increase due to a wage increase for Direct Care Staff?"
            >
              <v-radio
                label="Yes"
                :value="1"
              ></v-radio>
              <v-radio
                label="No"
                :value="0"
              ></v-radio>
            </v-radio-group>

            <div v-if="model.feeIncreaseDueToWage == 1">
              <div v-if="languageYearLabel == programYearTypes.HISTORICAL">
                <br>
                <v-radio-group
                  class="radio-label"
                  :disabled="isReadOnly"
                  :rules="rules.required"
                  required
                  row
                  v-model="model.increaseInWriting"
                  label="Was the wage increase committed to (in writing) before the January 2022 release of the Funding Guidelines?"
                >
                  <v-radio
                    label="Yes"
                    :value="1"
                  ></v-radio>
                  <v-radio
                    label="No"
                    :value="0"
                  ></v-radio>
                </v-radio-group>
              </div>
              <br>

              <v-radio-group
                class="radio-label"
                :disabled="isReadOnly"
                :rules="rules.required"
                required
                row
                v-model="model.isBargainingAgreement"
                label="Is the wage increase part of a collective bargaining agreement for Direct Care Staff at the facility?"
              >
                <v-radio
                  label="Yes"
                  :value="1"
                ></v-radio>
                <v-radio
                  label="No"
                  :value="0"
                ></v-radio>
              </v-radio-group>

              <br>

              <v-radio-group
                class="radio-label"
                :disabled="isReadOnly"
                :rules="rules.required"
                required
                row
                v-model="model.lossOfCareStaff"
                label="Has the facility lost or been unable to hire Direct Care Staff due to current wages?"
              >
                <v-radio
                  label="Yes"
                  :value="1"
                ></v-radio>
                <v-radio
                  label="No"
                  :value="0"
                ></v-radio>
              </v-radio-group>

              <br>

              <v-radio-group
                class="radio-label"
                :disabled="isReadOnly"
                :rules="rules.required"
                required
                row
                v-model="model.healthAndSafetyConcerns"
                label="Is this creating challenges in maintaining the staff-to-child ratios required under the facility licence?"
              >
                <v-radio
                  label="Yes"
                  :value="1"
                ></v-radio>
                <v-radio
                  label="No"
                  :value="0"
                ></v-radio>
              </v-radio-group>
            </div>
          </div>
        </div>

        <div v-if="model.feeIncreaseDueToWage == 1">


          <div class="pa-0">
            <div class="pa-2 pa-md-4 ma-0">
              <p class="text-h5 text--primary px-5 py-0 my-0">
                Direct Care Staff Wages Increases
              </p>
            </div>
            <br>

            <v-banner
              two-line
              class="ma-4"
              color="blue lighten-4"
              elevation="5"
            >
              <v-icon
                large
                color="blue darken-4"
                class="mr-5"
              > mdi-information
              </v-icon>
              <strong>Note: If two or more staff have the same information for every column, they can be included in one
                row. </strong>
            </v-banner>

            <div class="px-md-12 px-10">

              <v-row class="hidden-sm-and-down">
                <v-col class="col-md-1 col-12 ">
                  <!-- <h3> Number of staff receiving wage increase</h3>
                  here for spacing! -->
                </v-col>

                <v-col class="col-md-2 col-12 ">
                  <h3 class="text-center"> Number of staff receiving wage increase</h3>
                </v-col>

                <v-col class="col-md-2 col-12 ">
                  <h3 class="text-center"> Direct Care staff role </h3>
                  <br>
                  <p class="text-center">(e.g. Responsible Adult, ECE, ECEA, etc)</p>
                </v-col>

                <v-col class="col-md-2 col-12 ">
                  <h3 class="text-center"> Wage before increase</h3>
                  <br>
                  <p class="text-center">(not including ECE-WE)</p>
                </v-col>

                <v-col class="col-md-2 col-12 ">
                  <h3 class="text-center"> Wage after increase</h3>
                  <br>
                  <p class="text-center">(not including ECE-WE)</p>
                </v-col>

                <v-col class="col-md-2 col-12 ">
                  <h3 class="text-center"> Average hours per week at this facility</h3>
                </v-col>

                <v-col class="col-md-1 col-12 ">
                  <h3 class="text-center"> Date</h3>
                </v-col>
              </v-row>
              <span class="white--text"> . </span>
              <v-divider></v-divider>

              <v-row v-for="(obj, index) in model.wageList" :key="index">

                <v-col class="col-md-1 col-12 mx-0">
                  <v-icon
                    :disabled="isReadOnly"
                    large
                    color="blue darken-4"
                    class="mt-md-4"
                    @click="removeObjFromList(index, model.wageList)"
                  > mdi-close
                  </v-icon>
                </v-col>

                <v-col class="col-md-2 col-12">
                  <v-text-field
                    :disabled="isReadOnly"
                    type="number" @wheel="$event.target.blur()"
                    class=""
                    v-model.number="obj.staffNumber"
                    @input="convertBlankNumberToNull(obj,'staffNumber')"
                    label="Number of Staff Recieving Wage Increase"
                    outlined
                    clearable
                    :rules="rules.required"
                  ></v-text-field>
                </v-col>

                <v-col class="col-md-2 col-12 ">
                  <v-text-field
                    :disabled="isReadOnly"
                    class=""
                    v-model="obj.staffRole"
                    label="Direct Care Staff Role "
                    outlined
                    clearable
                    :rules="rules.required"
                  ></v-text-field>
                </v-col>

                <v-col class="col-md-2 col-12 ">
                  <v-text-field
                    :disabled="isReadOnly"
                    prefix="$"
                    type="number" @wheel="$event.target.blur()"
                    v-model.number="obj.wageBeforeIncrease"
                    @input="convertBlankNumberToNull(obj,'wageBeforeIncrease')"
                    label="Wage before increase"
                    outlined
                    clearable
                    :rules="rules.required"
                  ></v-text-field>
                </v-col>

                <v-col class="col-md-2 col-12 ">
                  <v-text-field
                    :disabled="isReadOnly"
                    prefix="$"
                    type="number" @wheel="$event.target.blur()"
                    v-model.number="obj.wageAfterIncrease"
                    @input="convertBlankNumberToNull(obj,'wageAfterIncrease')"
                    label="Wage After increase"
                    outlined
                    clearable
                    :rules="rules.required"
                  ></v-text-field>
                </v-col>

                <v-col class="col-md-2 col-12">
                  <v-text-field
                    :disabled="isReadOnly"
                    type="number" @wheel="$event.target.blur()"
                    outlined
                    :rules="[...rules.required, rules.min(0), rules.max(168)]"
                    v-model.number="obj.averageHours"
                    @input="convertBlankNumberToNull(obj,'averageHours')"
                    label="Average hours per week at this facility"
                  />
                </v-col>

                <v-col class="col-md-1 col-12">
                  <v-menu v-model="wageCalendar[index]" :close-on-content-click="false" :nudge-left="180"
                          transition="scale-transition" offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :disabled="isReadOnly"
                        :rules="rules.required"
                        outlined v-model="obj.wageDate"
                        label="Date of Increase"
                        readonly v-bind="attrs" v-on="on">
                      </v-text-field>
                    </template>
                    <v-date-picker
                      :disabled="isReadOnly"
                      clearable
                      v-model="obj.wageDate"
                      @input="wageCalendar[index] = false">
                    </v-date-picker>
                  </v-menu>
                </v-col>

                <span class="white--text"> . </span>
                <v-divider></v-divider>

              </v-row> <!-- end v for-->

              <div class="form-group">
                <v-btn id="wagebtn" :disabled="isReadOnly" @click="addObjToList(wageObj, model.wageList)" class="my-5"
                       dark color='#003366'>Add
                </v-btn>
              </div>
              <br>

            </div>
          </div>


          <div class="pa-0">
            <div class="pa-2 pa-md-4 ma-0">
              <p class="text-h5 text--primary px-5 py-0 my-0">
                Please tell us more:
              </p>
            </div>
            <br>
            <div class="px-md-12 px-7">

              <br>
              <label for="wage"> When did your facility's challenges with hiring and keeping staff begin? </label>
              <v-textarea
                :disabled="isReadOnly"
                id="wage"
                :rules="rules.required"
                placeholder="Describe here"
                outlined
                v-model="model.textbox1"
              ></v-textarea>

              <br>
              <label for="wage1"> How many Direct Care Staff have left your facility due to wages? </label>
              <v-textarea
                :disabled="isReadOnly"
                id="wage1"
                :rules="rules.required"
                placeholder="Describe here"
                outlined
                v-model=" model.textbox2"
              ></v-textarea>

              <br>
              <label for="wage2"> What have you done to try to recruit staff? </label>
              <v-textarea
                :disabled="isReadOnly"
                id="wage2"
                :rules="rules.required"

                placeholder="Describe here"
                outlined
                v-model=" model.textbox3"
              ></v-textarea>

              <br>
              <label for="wage3">Have you had to adjust your hours/days of operation? </label>
              <v-textarea
                :disabled="isReadOnly"
                id="wage3"
                :rules="rules.required"

                placeholder="Describe here"
                outlined
                v-model=" model.textbox4"
              ></v-textarea>

              <br>
              <label for="wage4"> Is your facility unable to fill spaces due to insufficient staffing? </label>
              <v-textarea
                :disabled="isReadOnly"
                id="wage4"
                :rules="rules.required"
                placeholder="Describe here"
                outlined
                v-model=" model.textbox5"
              ></v-textarea>

              <br>
              <label for="wage5"> Is there anything else you would like us to know about the wage increase(s)? </label>
              <v-textarea
                :disabled="isReadOnly"
                id="wage5"
                :rules="rules.required"
                placeholder="Describe here"
                outlined
                v-model=" model.textbox6"
              ></v-textarea>

            </div>
            <RFIDocumentUpload @addRFIDocument="addRFISupportingDocument" @addRFIRow="addNewRowToUploadedDocuments"
                               @deleteRFIDocument="deleteRFISupportingDocument"
                               @addRFIDocumentDescription="addRFISupportingDocumentDescription"
                               :current-facility="currentFacility" :r-f-i-type="'RFI-DCSWI'"
                               :r-f-i-documents="this.rfiDocumentsDCSWI"></RFIDocumentUpload>

          </div>

        </div>
      </v-card>


      <!--End page two Wage Increase-->


      <v-card elevation="6" class="px-0 py-0 mx-auto my-10 rounded-lg col-12 "
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
          <br>

          <div class="px-md-12 px-7">
            <br>
            <v-radio-group
              class="radio-label"
              :disabled="isReadOnly"
              :rules="rules.required"
              required
              row
              v-model="model.feeIncreaseExtendedHours"
              label="Is your fee increase due to expanding or extending the hours of child care service available for all
              enrolled children?"
            >
              <v-radio
                label="Yes"
                :value="1"
              ></v-radio>
              <v-radio
                label="No"
                :value="0"
              ></v-radio>
            </v-radio-group>
            <br>
          </div>
        </div>

        <div v-if="model.feeIncreaseExtendedHours == 1">

          <div class="pa-0">
            <div class="pa-2 pa-md-4 ma-0">
              <p class="text-h5 text--primary px-5 py-0 my-0">
                Service Expansion Details
              </p>
            </div>
            <br>
            <div class="px-md-12 px-7">
              <v-row class="hidden-sm-and-down">
                <v-col class="col-md-1 col-12 mx-0">
                  <!--here for spacing-->
                </v-col>
                <v-col class="col-md-2 col-12 ">
                  <h3 class> Facility's previous hours of operation</h3>
                  <br>
                  <p>(e.g. 9:00 am - 4:00 pm)</p>
                </v-col>
                <v-col class="col-md-2 col-12 ">
                  <h3 class> Facility's new hours of operation</h3>
                  <br>
                  <p>(e.g. 6:00 am - 5:00 pm)</p>
                </v-col>
                <v-col class="col-md-2 col-12 ">
                  <h3 class> Date of Change</h3>
                </v-col>
                <v-col class="col-md-2 col-12 ">
                  <h3 class> Amount of Expense</h3>
                </v-col>
                <v-col class="col-md-2 col-12 ">
                  <h3 class> Payment frequency </h3>
                </v-col>
              </v-row>
              <span class="white--text"> . </span>
              <v-divider></v-divider>


              <v-row v-for="(obj, index) in model.expansionList" :key="index">
                <v-col class="col-md-1 col-12 mx-0">
                  <v-icon
                    :disabled="isReadOnly"
                    large
                    color="blue darken-4"
                    class="mt-md-4"
                    @click="removeObjFromList(index, model.expansionList)"
                  > mdi-close
                  </v-icon>
                </v-col>
                <v-col class="col-md-1 col-12 ml-md-n8">

                  <v-menu
                    ref="menufrom"
                    v-model="obj.menufrom"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="timefrom"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :disabled="isReadOnly"
                        v-model="obj.timefrom"
                        label="From"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      :disabled="isReadOnly"
                      v-if="obj.menufrom"
                      v-model="obj.timefrom"
                      full-width
                      @click:minute="$refs.menufrom[index].save(timefrom)"
                    ></v-time-picker>
                  </v-menu>
                </v-col>

                <v-col class="col-md-1 col-12 ">

                  <v-menu
                    :disabled="isReadOnly"
                    ref="menuto"
                    v-model="obj.menuto"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="timeto"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :disabled="isReadOnly"
                        v-model="obj.timeto"
                        label="To"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      :disabled="isReadOnly"
                      :min="obj.timefrom"
                      v-if="obj.menuto"
                      v-model="obj.timeto"
                      full-width
                      @click:minute="$refs.menuto[index].save(timeto)"
                    ></v-time-picker>
                  </v-menu>
                </v-col>

                <v-col class="col-md-1 col-12">

                  <v-menu
                    ref="newmenufrom"
                    v-model="obj.newmenufrom"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="newtimefrom"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :disabled="isReadOnly"
                        v-model="obj.newtimefrom"
                        label="From"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="obj.newmenufrom"
                      v-model="obj.newtimefrom"
                      full-width
                      @click:minute="$refs.newmenufrom[index].save(newtimefrom)"
                    ></v-time-picker>
                  </v-menu>
                </v-col>

                <v-col class="col-md-1 col-12 ">

                  <v-menu
                    ref="newmenuto"
                    v-model="obj.newmenuto"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="newtimeto"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :disabled="isReadOnly"
                        v-model="obj.newtimeto"
                        label="To"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      :min="obj.newtimefrom"
                      v-if="obj.newmenuto"
                      v-model="obj.newtimeto"
                      full-width
                      @click:minute="$refs.newmenuto[index].save(newtimeto)"
                    ></v-time-picker>
                  </v-menu>
                </v-col>


                <v-col class="col-md-2 col-12">
                  <v-menu
                    v-model="expansionCalendarMenu[index]"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :disabled="isReadOnly"
                        :rules="rules.required"
                        outlined v-model="obj.date"
                        label="Date of Change (YYYY-MM-DD)"
                        readonly
                        v-bind="attrs" v-on="on"
                      >
                      </v-text-field>
                    </template>
                    <v-date-picker
                      clearable
                      v-model="obj.date"
                      @input="expansionCalendarMenu[index] = false">
                    </v-date-picker>
                  </v-menu>
                </v-col>

                <v-col class="col-md-2 col-12">
                  <v-text-field
                    :disabled="isReadOnly"
                    type="number" @wheel="$event.target.blur()"
                    outlined
                    :rules="rules.required"
                    v-model.number="obj.expense"
                    @input="convertBlankNumberToNull(obj,'expense')"
                    prefix="$"
                  />
                </v-col>

                <v-col class="col-md-2 col-12">
                  <v-select
                    :disabled="isReadOnly"
                    :items="items"
                    label="Payment Frequency"
                    outlined
                    v-model="obj.frequency"
                    :rules="rules.required"
                  ></v-select>
                </v-col>

                <v-col class="col-md-1 col-12 mx-0">
                  <!--here for spacing-->
                </v-col>

                <br><br>
                <v-row>
                  <span class="white--text">  </span>
                  <v-divider></v-divider>
                </v-row>
              </v-row> <!-- end v for-->

              <div class="form-group">
                <v-btn :disabled="isReadOnly" @click="addObjToList(expansionObj, model.expansionList)" class="my-5" dark
                       color='#003366'>Add Expansion Details
                </v-btn>
              </div>

              <br>
              <br>
              <label for="serviceExpense"> Describe each of your expenses above. (e.g. Wages, Utilities) </label>
              <v-textarea
                :disabled="isReadOnly"
                id="serviceExpense"
                :rules="rules.required"
                outlined
                name="input-7-4"
                placeholder="Describe here"
                v-model="model.serviceExpansionDetailsNote"
              ></v-textarea>

              <br>
              <br>
              <label for="serviceExpense1"> Is there anything else about your change in hours of operation you would
                like us to know? </label>
              <v-textarea
                :disabled="isReadOnly"
                id="serviceExpense1"
                :rules="rules.required"
                outlined
                name="input-7-4"
                placeholder="Describe here"
                v-model="model.notes2"
              ></v-textarea>

            </div>
          </div>
          <RFIDocumentUpload @addRFIDocument="addRFISupportingDocument" @deleteRFIDocument="deleteRFISupportingDocument"
                             @addRFIRow="addNewRowToUploadedDocuments"
                             @addRFIDocumentDescription="addRFISupportingDocumentDescription"
                             :current-facility="currentFacility" :r-f-i-type="'RFI-PSE'"
                             :r-f-i-documents="this.rfiDocumentsPSE"></RFIDocumentUpload>
        </div>
      </v-card>

      <!-- End page 3 Service Expansion Hours-->


      <v-card elevation="6" class="px-0 py-0 mx-auto my-10 rounded-lg col-12 "
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
              Priority Service Expansion: Increased Connection to Indigenous Community, Culture, and/or Language
            </p>
          </div>
          <br>

          <div class="px-md-12 px-7">
            <br>
            <v-radio-group
              class="radio-label"
              :disabled="isReadOnly"
              label="Is your fee increase due to an increased connection to Indigenous community, culture, or language for all enrolled children in a Facility owned, managed, or governed by at least 51% Indigenous peoples?"
              required
              :rules="rules.required"
              row
              v-model="model.IndigenousConnection"
            >
              <br>
              <v-radio
                label="Yes"
                :value="1"
              ></v-radio>
              <v-radio
                label="No"
                :value="0"
              ></v-radio>
            </v-radio-group>
            <p>As outlined in the <a href="https://www2.gov.bc.ca/assets/download/3013BFFE26E24901A2EE764FC17FD05E"
                                     target="_blank">Funding Guidelines</a>, this may include:</p>
            <ul>
              <li>participation of an Elder, culture/language teacher, and/or family in the child care program;</li>
              <li>children’s participation in community, language, and/or cultural events or activities; or</li>
              <li>language or culture resources for use in the child care program.</li>
            </ul>
            <br>
          </div>
        </div>


        <div v-if="model.IndigenousConnection == 1 ">

          <div class="pa-0">
            <div class="pa-2 pa-md-4 ma-0">
              <p class="text-h5 text--primary px-5 py-0 my-0">
                Expense Information
              </p>
            </div>
            <br>

            <div class="px-md-12 px-7">
              <v-row class="hidden-sm-and-down">

                <v-col class="col-md-1 col-12 mx-0">
                  <!--here for spacing-->
                </v-col>

                <v-col class="col-md-3 col-12 ">
                  <h3 class="text-center"> Expense Description</h3>
                </v-col>

                <v-col class="col-md-3 col-12 ">
                  <h3 class="text-center"> Date of expense</h3>
                </v-col>

                <v-col class="col-md-3 col-12 ">
                  <h3 class="text-center"> Payment frequency details</h3>
                </v-col>

                <v-col class="col-md-2 col-12 ">
                  <h3 class="text-center">Expense amount</h3>
                </v-col>

              </v-row>
              <v-row v-for="(indigExpense, index) in model.indigenousExpenseList" :key="index">
                <v-col class="col-md-1 col-12 mx-0">
                  <v-icon
                    :disabled="isReadOnly"
                    large
                    color="blue darken-4"
                    class="mt-md-4"
                    @click="removeObjFromList(index, model.indigenousExpenseList)"
                  > mdi-close
                  </v-icon>
                </v-col>
                <v-col class="col-md-3 col-12 ">

                  <v-text-field
                    :disabled="isReadOnly"
                    class=""
                    v-model="indigExpense.description"
                    label="Description"
                    outlined
                    clearable
                    :rules="rules.required"
                  ></v-text-field>
                </v-col>

                <v-col class="col-md-3 col-12">
                  <v-menu
                    v-model="indigenousCalendarMenu[index]"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :disabled="isReadOnly"
                        :rules="rules.required"
                        outlined
                        v-model="indigExpense.date"
                        label="Date of Expense (YYYY-MM-DD)"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      >
                      </v-text-field>
                    </template>
                    <v-date-picker
                      :disabled="isReadOnly"
                      clearable
                      v-model="indigExpense.date"
                      @input="indigenousCalendarMenu[index] = false">
                    </v-date-picker>
                  </v-menu>
                </v-col>

                <v-col class="col-md-3 col-12">
                  <v-select
                    :disabled="isReadOnly"
                    :items="items"
                    label="Expense Frequency"
                    outlined
                    v-model="indigExpense.frequency"
                    :rules="rules.required"
                  ></v-select>
                </v-col>

                <v-col class="col-md-2 col-12">
                  <v-text-field
                    :disabled="isReadOnly"
                    type="number" @wheel="$event.target.blur()"
                    outlined
                    :rules="rules.required"
                    v-model.number="indigExpense.expense"
                    @input="convertBlankNumberToNull(indigExpense,'expense')"
                    prefix="$"
                  />
                </v-col>

                <span class="white--text"> . </span>
                <v-divider></v-divider>

              </v-row> <!-- end v for-->

              <div class="form-group">

                <v-btn id="indigEx" :disabled="isReadOnly"
                       @click="addObjToList(indigenousExpenseObj, model.indigenousExpenseList)" class="my-5"
                       dark color='#003366'>Add Expense
                </v-btn>
              </div>
              <br>

              <p class="text-h6 text--primary py-5 my-0">

              </p>

              <div class="">
                <br>
                <label for="expense1">Is there anything else about your expenses you would like us to know?</label>
                <v-textarea
                  :disabled="isReadOnly"
                  id="expense1"
                  :rules="rules.required"
                  outlined
                  name="input-7-4"
                  placeholder="Describe here"
                  v-model="model.iCEIDetailsNote"
                ></v-textarea>
              </div>
            </div>


          </div>
          <RFIDocumentUpload @addRFIDocument="addRFISupportingDocument" @deleteRFIDocument="deleteRFISupportingDocument"
                             @addRFIRow="addNewRowToUploadedDocuments"
                             @addRFIDocumentDescription="addRFISupportingDocumentDescription"
                             :current-facility="currentFacility" :r-f-i-type="'RFI-PSEIC'"
                             :r-f-i-documents="this.rfiDocumentsPSEIC"></RFIDocumentUpload>


        </div> <!--end show if yes / yes selected-->
      </v-card>

      <!-- End Page 4 Indigenous Service Expansion-->


      <v-card elevation="6" class="px-0 py-0 mx-auto my-10 rounded-lg col-12 "
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
              Affordable Child Care for Underserved Populations
            </p>
          </div>
          <br>

          <div class="px-md-12 px-7">
            <br>
            <p>Fee increases may be considered under this exception if:</p>
            <ul>
              <li>the facility has historically provided care to underserved populations including Indigenous or
                low-income families at significantly below the regional median range of fees for their area or at no fee;
              </li>
              <li>the fee increase will contribute to the operational sustainability of the organization; and</li>
              <li>the fee increase will not greatly increase the out-of-pocket cost of care for families.</li>
            </ul>
            <br>
            <v-radio-group
              class="radio-label"
              :disabled="isReadOnly"
              required
              :rules="rules.required"
              row
              v-model="model.underservedPop"
              label="Does this Facility meet all the above criteria?"
            >
              <v-radio
                label="Yes"
                :value="1"
              ></v-radio>
              <v-radio
                label="No"
                :value="0"
              ></v-radio>
            </v-radio-group>
            <br>

            <div v-if="model.underservedPop == 1">
              <br>
              <div class="pa-0">
                <div class="pa-2 pa-md-4 ma-0">
                  <label for="underservedPop1">Please describe how the majority of children you provide care for
                    represent
                    an underserved population (e.g. indigenous children, low-income families?)</label>
                  <v-textarea
                    :disabled="isReadOnly"
                    id="underservedPop1"
                    :rules="rules.required"
                    outlined
                    name="input-7-4"
                    placeholder="Describe here"
                    v-model="model.underservedChildCareTypes"
                  ></v-textarea>

                  <br>
                  <label for="underservedPop2">How will your fee increase contribute to the overall sustainability of
                    the
                    organization/facility?</label>
                  <v-textarea
                    :disabled="isReadOnly"
                    id="underservedPop2"
                    :rules="rules.required"
                    outlined
                    name="input-7-4"
                    placeholder="Describe here"
                    v-model="model.orgsustainability"
                  ></v-textarea>

                  <br>
                  <label for="underservedPop3">Describe whether parents' out-of-pocket monthly cost for child care will
                    be
                    affected by this increase (after applying reductions from CCFRI and the Affordable Child Care
                    Benefit,
                    and any other applicable funding source). Will any families experience a cost increase, and if so,
                    by
                    how much?</label>
                  <v-textarea
                    :disabled="isReadOnly"
                    id="underservedPop3"
                    :rules="rules.required"
                    outlined
                    name="input-7-4"
                    placeholder="Describe here"
                    v-model="model.outOfPocketFees"
                  ></v-textarea>
                </div>
              </div>
              <RFIDocumentUpload @addRFIDocument="addRFISupportingDocument" @addRFIRow="addNewRowToUploadedDocuments"
                                 @deleteRFIDocument="deleteRFISupportingDocument"
                                 @addRFIDocumentDescription="addRFISupportingDocumentDescription"
                                 :current-facility="currentFacility" :r-f-i-type="'RFI-ACCUP'"
                                 :r-f-i-documents="this.rfiDocumentsACCUP"></RFIDocumentUpload>
            </div>

          </div>

        </div>

      </v-card>

      <NavButton :isNextDisplayed="true" :isSaveDisplayed="true"
        :isSaveDisabled="isReadOnly" :isNextDisabled="!isFormComplete" :isProcessing="processing"
        @previous="previous" @next="nextBtnClicked" @validateForm="validateForm()" @save="save(true)"></NavButton>
    </v-container>
  </v-form>
</template>
<script>
import {mapActions, mapGetters, mapMutations, mapState} from 'vuex';
import alertMixin from '../../mixins/alertMixin.js';
import globalMixin from '../../mixins/globalMixin.js';
import {deepCloneObject} from '../../utils/common.js';
import {isEqual} from 'lodash';
import rules from '../../utils/rules.js';
import RFIDocumentUpload from '../../components/RFI/RFIDocumentUpload.vue';
import NavButton from '../../components/util/NavButton.vue';
import {PROGRAM_YEAR_LANGUAGE_TYPES } from '../../utils/constants.js';
import FacilityHeader from '../guiComponents/FacilityHeader.vue';

let model = {
  expansionList: [],
  wageList: [],
  fundingList: [],
  expenseList: [],
  indigenousExpenseList: [] //this one does not exist in dynamics yet
};


// let model = {x: [], q1, q2, q3, datePicker, expenseList, fundingList, IndigenousExpenseList, expansionList,model.wageList};

export default {
  components: {FacilityHeader, RFIDocumentUpload, NavButton},
  mixins: [alertMixin, globalMixin],
  name: 'CcfriRequestMoreInfo',
  data() {
    return {
      rules,
      loading: true,
      isValidForm: false,
      expenseObj: {
        description: '',
        date: undefined,
        expense: null,
        frequency: ''
      },
      indigenousExpenseObj: {
        description: '',
        date: undefined,
        expense: 0,
        frequency: ''
      },
      fundingObj: {
        fundingProgram: '',
        date: undefined,
        status: '',
        amount: 0,
        expenses: 0
      },
      wageObj: {
        staffRole: '',
        staffNumber: 0,
        wageBeforeIncrease: 0,
        wageAfterIncrease: 0,
        averageHours: 0,
        wageDate: undefined
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
        frequency: ''
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
      calendarMenu: [],
      expansionCalendarMenu: [],
      indigenousCalendarMenu: [],
      fundingCalendar: [],
      wageCalendar: [],
      items: ['One-time', 'Daily', 'Weekly', 'Monthly'],
      processing: false,
      uploadedDocuments: [],
      rfiDocuments: {},
      rfiDocumentsEC: [],
      rfiDocumentsACCUP: [],
      rfiDocumentsDCSWI: [],
      rfiDocumentsPSE: [],
      rfiDocumentsPSEIC: [],
    };
  },
  async beforeRouteLeave(_to, _from, next) {
    this.$store.commit('rfiApp/setRfiModel', this.model);
    await this.save(false);
    next();
  },
  computed: {
    ...mapState('rfiApp', ['rfiModel', 'loadedModel']),
    ...mapState('app', ['programYearList']),
    ...mapState('application', ['formattedProgramYear', 'applicationStatus', 'applicationId', 'programYearId']),
    ...mapState('navBar',['changeRequestId', 'navBarList']),
    ...mapGetters('supportingDocumentUpload', ['getUploadedDocuments']),
    ...mapGetters('navBar', ['nextPath', 'previousPath', 'getNavByCCFRIId','isChangeRequest']),
    ...mapGetters('reportChanges',['changeRequestStatus']),
    ...mapGetters('app', [ 'getFundingUrl', 'getLanguageYearLabel']),
    currentFacility() {
      //return this.getNavByCCFRIId(this.$route.params.urlGuid);
      return this.navBarList.find(el => el.ccfriApplicationId == this.$route.params.urlGuid );
    },
    fundingUrl(){
      return this.getFundingUrl(this.programYearId);
    },
    languageYearLabel(){
      return this.getLanguageYearLabel;
    },
    programYearTypes(){
      return PROGRAM_YEAR_LANGUAGE_TYPES;
    },
    isReadOnly() {
      //if submitted, lock er up. If unlock CCFRI - unlock
      if (this.currentFacility?.unlockRfi) {
        return false;
      }else if(this.isChangeRequest){
        if (!this.changeRequestStatus||this.currentFacility.unlockRfi){
          return false;
        }
        else if(this.changeRequestStatus!=='INCOMPLETE'){
          return true;
        }
      } else if (this.applicationStatus === 'SUBMITTED') {
        return true;
      }
      return false;
    },
    isFormComplete() {
      let done = true;
      if (this.model.exceptionalCircumstances == 1 && this.model.circumstanceOccurWithin6Month == 1 && this.model.expenseList.length == 0) {
        done = false;
      }
      if (this.model.q3 === 1 && this.model.exceptionalCircumstances == 1 && this.model.circumstanceOccurWithin6Month == 1  && this.model.fundingList.length == 0) {
        done = false;
      }
      if (this.model.feeIncreaseDueToWage == 1 && this.model.wageList.length == 0) {
        done = false;
      }
      if (this.model.feeIncreaseExtendedHours == 1 && this.model.expansionList.length == 0) {
        done = false;
      }
      if (this.model.IndigenousConnection == 1 && this.model.indigenousExpenseList.length == 0) {
        done = false;
      }
      // this.currentFacility.isRfiComplete = this.isValidForm && done;
      //this.currentFacility.isCCFRIComplete = this.isValidForm;
      return this.isValidForm && done; //false makes button clickable, true disables button
    },
  },
  watch: {
    '$route.params.urlGuid': {
      async handler() {
        try {
          window.scrollTo(0, 0);
          let ccfriId = this.$route.params.urlGuid;
          console.log('rfi ccfriGUID is: ', this.$route.params.urlGuid);
          await this.loadRfi(ccfriId);
          await this.refreshSupportingDocuments();
        } catch (error) {
          console.log(error);
          this.setFailureAlert('An error occured while retrieving data.');
        }

        this.loading = false;
      },
      immediate: true,
      deep: true
    },
    rfiModel: {
      handler() {
        this.model = deepCloneObject(this.rfiModel);
        // if(this.model.expansionList){
        //   this.expansionList = deepCloneObject(this.rfiModel.expansionList);
        // }
        // if(this.model.wageList){
        //   this.wageList = deepCloneObject(this.rfiModel.wageList);
        // }
        // if(this.model.IndigenousExpenseList){
        //   this.IndigenousExpenseList = deepCloneObject(this.rfiModel.IndigenousExpenseList);
        // }
        // if(this.model.fundingList){
        //   this.fundingList = deepCloneObject(this.rfiModel.fundingList);
        // }
        // if(this.model.expenseList){
        //   this.expenseList = deepCloneObject(this.rfiModel.expenseList);
        // }

        this.$refs.form?.resetValidation();
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    ...mapActions('rfiApp', ['loadRfi', 'saveRfi']),
    ...mapMutations('rfiApp', ['setRfiModel']),
    ...mapMutations('navBar', ['setNavBarRFIComplete']),
    ...mapActions('supportingDocumentUpload', ['saveUploadedDocuments', 'getDocuments', 'deleteDocuments']),
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
          console.log('blank found');
          this.model.wageList.splice(i, 1);
        }
      }
      for (let i = this.model.indigenousExpenseList.length - 1; i >= 0; i--) {
        if (isEqual(this.model.indigenousExpenseList[i], this.indigenousExpenseObj)) {
          this.model.indigenousExpenseList.splice(i, 1);
        }
      }


      this.setRfiModel({...this.model});
      let ccfriId = this.$route.params.urlGuid;
      this.setNavBarRFIComplete({ccfriId: ccfriId, complete: this.isFormComplete});
      try {
        let friApplicationGuid = await this.saveRfi({ccfriId: ccfriId, isRfiComplete: this.isFormComplete});
        if (friApplicationGuid) {
          this.model.rfiId = friApplicationGuid;
        }
        await this.processRFISupportingDocuments();
        if (showNotification) {
          this.setSuccessAlert('Success! Request for Information has been saved.');
          await this.refreshSupportingDocuments();
        }

      } catch (error) {
        this.setFailureAlert('An error occurred while saving. Please try again later.');
      }
      this.processing = false;

    },
    addObjToList(obj, list) {
      list.push(Object.assign({}, obj));
    },
    removeObjFromList(index, list) {
      if (index == -1) {
        return;
      }
      list.splice(index, 1);
    },
    async refreshSupportingDocuments() {
      await this.getDocuments(this.applicationId);
      this.uploadedDocuments = this.getUploadedDocuments;
      this.loadDOcsForRFIType(this.currentFacility.facilityId);
    },
    loadDOcsForRFIType(facilityId) {
      this.rfiDocumentsEC = [];
      this.rfiDocumentsDCSWI = [];
      this.rfiDocumentsPSE = [];
      this.rfiDocumentsPSEIC = [];
      this.rfiDocumentsACCUP = [];
      this.rfiDocumentsEC = this.uploadedDocuments?.filter(x => x.documentType === 'RFI-EC' && x.ccof_facility === facilityId) || [];
      this.rfiDocumentsDCSWI = this.uploadedDocuments?.filter(x => x.documentType === 'RFI-DCSWI' && x.ccof_facility === facilityId) || [];
      this.rfiDocumentsPSE = this.uploadedDocuments?.filter(x => x.documentType === 'RFI-PSE' && x.ccof_facility === facilityId) || [];
      this.rfiDocumentsPSEIC = this.uploadedDocuments?.filter(x => x.documentType === 'RFI-PSEIC' && x.ccof_facility === facilityId) || [];
      this.rfiDocumentsACCUP = this.uploadedDocuments?.filter(x => x.documentType === 'RFI-ACCUP' && x.ccof_facility === facilityId) || [];
    },
    addRFISupportingDocument(item) {
      const foundItemIndex = this.uploadedDocuments.findIndex((el => el.id === item.id));
      if (foundItemIndex > -1) {
        this.uploadedDocuments[foundItemIndex] = item;
      }
    },
    addRFISupportingDocumentDescription(item) {
      const foundItemIndex = this.uploadedDocuments.findIndex((el => el.id === item.id));
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
      let index = array.findIndex(el => el.id === item.id);
      if (index === -1) {
        index = array.findIndex(el => el.annotationid === item.annotationid);
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
      const newFilesAdded = this.uploadedDocuments.filter(el => !!el.id);
      if (newFilesAdded.length > 0) {
        await this.processDocumentFilesSave(newFilesAdded);
      }
    },
    async processDocumentFileDelete() {
      if (this.uploadedDocuments?.deletedItems?.length > 0) {
        await this.deleteDocuments(this.uploadedDocuments.deletedItems);
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
            notetext: file.description
          };
          payload.push(obj);
        }

      }
      try {
        await this.saveUploadedDocuments(payload);
      } catch (error) {
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

.radio-label >>> .v-label {
  font-size: 18px;
  color: black;
}
.blueText {
  color: rgb(0, 52, 102);
}

</style>

