<template>
  <v-container>

    <div class="row pt-4 justify-center">
      <span class="text-h5">Child Care Operating Funding Program - {{ programYearLabel }} Program Confirmation Form</span>
      </div>
      <br>
      <div class="row pt-4 justify-center">
      <span class="text-h5">Child Care Fee Reduction Initiative (CCFRI)</span>
    </div>
    <br><br>
    <p class="text-h5 text-center" style="color: rgb(0, 52, 102)"> Facility Name:  </p> <br>

    <v-card elevation="6" class="px-0 py-0 mx-auto my-10 rounded-lg col-12 "
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
            Exceptional Circumstances
          </p>
        </div>
        <br>
        <p class="text-h6 text--primary px-5 py-0 my-0">
          As outlined in the <a href="#">Funding Guidelines</a>, exceptional circumstances are expenses that are:
        </p>
        <div class="px-md-12 px-7">
          <br>
          <ul>
            <li>
              Sudden, unexpected, or oustide of the Organization's control; and
            </li>
            <li>
              Must also address an immediate health/safety concern, or is necessary for the facility to remain
              operational
            </li>
          </ul>
          <br>
          <v-radio-group
            required
            row
            v-model.number="model.exceptionalCircumstances"
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
              required
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
      </v-card-text>
    </v-card>
    <div v-if="model.exceptionalCircumstances == 1 && model.circumstanceOccurWithin6Month == 1 ">
      <v-card elevation="6" class="px-0 py-0 mx-auto my-10 rounded-lg col-12 "
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
            <strong>Note: See the <a href="#">Funding Guidelines</a> for the list of eligible expenses</strong>
          </v-banner>
          <div class="px-md-12 px-7">

            <v-row class="hidden-sm-and-down">

              <v-col class="col-md-1 col-12 mx-0">
                <!--here for spacing-->
              </v-col>

              <v-col class="col-md-3 col-12 ">
                <h3> Expense Description</h3>
              </v-col>

              <v-col class="col-md-3 col-12 ">
                <h3> Date of expense</h3>
              </v-col>

              <v-col class="col-md-3 col-12 ">
                <h3> Payment frequency details</h3>
              </v-col>

              <v-col class="col-md-2 col-12 ">
                <h3>Expense amount</h3>
              </v-col>

            </v-row>

            <v-row v-for="(expense, index) in model.expenseList" :key="index">
              <v-col class="col-md-1 col-12 mx-0">
                <v-icon
                  large
                  color="blue darken-4"
                  class="mt-md-4"
                  @click="removeObjFromList(index, model.expenseList)"
                > mdi-close
                </v-icon>
              </v-col>
              <v-col class="col-md-3 col-12 ">

                <v-text-field
                  class=""
                  v-model="expense.description"
                  label="Description"
                  outlined
                  clearable
                  :rules="rules"
                ></v-text-field>
              </v-col>

              <v-col class="col-md-3 col-12">
                <v-menu v-model="calendarMenu[index]" :close-on-content-click="false" :nudge-right="40"
                        transition="scale-transition" offset-y min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field :rules="rules" outlined v-model="expense.date" label="Date of Expense (YYYY-MM-DD)"
                                  readonly v-bind="attrs" v-on="on">
                    </v-text-field>
                  </template>
                  <v-date-picker
                    clearable
                    v-model="expense.date"
                    @input="calendarMenu[index] = false">
                  </v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="col-md-3 col-12">
                <v-select
                  :items="items"
                  label="Expense Frequency"
                  outlined
                  v-model="expense.frequency"
                  :rules="rules"
                ></v-select>
              </v-col>

              <v-col class="col-md-2 col-12">
                <v-text-field type="number" outlined :rules="rules" v-model.number="expense.expense" prefix="$"/>
              </v-col>

              <span class="white--text"> . </span>
              <v-divider></v-divider>

            </v-row> <!-- end v for-->

            <div class="form-group">
              <v-btn id="" @click="addObjToList(expenseObj, model.expenseList)" class="my-5" dark color='#003366'>
                Add Expense
              </v-btn>
            </div>
            <br>
            <br>
            <v-textarea
              placeholder="Describe Here"
              outlined
              name="input-7-4"
              label="Please explain why you have incurred (or will incur) each expense, and/or explain the reason for the increased financial pressure(s) you have listed above."
              v-model="model.expenseInformationNote"
            ></v-textarea>
          </div>

        </v-card-text>
      </v-card>
    </div>
    <div>
      <v-card elevation="6" class="px-0 py-0 mx-auto my-10 rounded-lg col-12 "
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
              Other Sources of Ministry Funding
            </p>
          </div>
          <br>
          <div class="px-md-12 px-7">
            <p>Have you applied for any other sources of Ministry Funding (e.g. BC Maintenance Fund, Start-Up Grants)
              for any of the expenses you listed?</p>
            <v-radio-group
              required
              row
              v-model="model.q3"
              label=""
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
                  <h3> Funding Program</h3>
                </v-col>

                <v-col class="col-md-2 col-12 ">
                  <h3> Application Date</h3>
                </v-col>

                <v-col class="col-md-2 col-12 ">
                  <h3>Status of Application</h3>
                </v-col>

                <v-col class="col-md-2 col-12 ">
                  <h3> Amount Received</h3>
                </v-col>

                <v-col class="col-md-2 col-12 ">
                  <h3> Expense(s)</h3>
                </v-col>

              </v-row>

              <v-row v-for="(fundInfo, index) in model.fundingList" :key="index">
                <v-col class="col-md-1 col-12 mx-0">
                  <v-icon
                    large
                    color="blue darken-4"
                    class="mt-md-4"
                    @click="removeObjFromList(index, model.fundingList)"
                  > mdi-close
                  </v-icon>
                </v-col>
                <v-col class="col-md-3 col-12 ">
                  <v-text-field
                    class=""
                    v-model="fundInfo.fundingProgram"
                    label="Funding Program"
                    outlined
                    clearable
                    :rules="rules"
                  ></v-text-field>
                </v-col>

                <v-col class="col-md-2 col-12">
                  <v-menu v-model="fundingCalendar[index]" :close-on-content-click="false" :nudge-right="40"
                          transition="scale-transition" offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field :rules="rules" outlined v-model="fundInfo.date" label="Date (YYYY-MM-DD)" readonly
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
                    class=""
                    v-model="fundInfo.status"
                    label="Status"
                    outlined
                    clearable
                    :rules="rules"
                  ></v-text-field>
                </v-col>

                <v-col class="col-md-2 col-12">
                  <v-text-field
                  outlined
                  :rules="rules"
                  label="Amount Received"
                  v-model.number="fundInfo.amount"
                  prefix="$"/>
                </v-col>

                <v-col class="col-md-2 col-12 ">
                  <v-text-field
                    class=""
                    prefix="$"
                    v-model.number="fundInfo.expenses"
                    label="Expense"
                    outlined
                    clearable
                    :rules="rules"
                  ></v-text-field>
                </v-col>

                <span class="white--text"> . </span>
                <v-divider></v-divider>

              </v-row> <!-- end v for-->


              <div class="form-group">
                <v-btn id="funding" @click="addObjToList(fundingObj, model.fundingList)" class="my-5" dark color='#003366'>Add
                  Funding
                </v-btn>
              </div>
              <br>

            </div>
          </div>
        </v-card-text>
      </v-card>

    </div> <!--end show if yes / yes selected-->

    <!--end page 1 RFI landing-->

    <v-card elevation="6" class="px-0 py-0 mx-auto my-10 rounded-lg col-12 "
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
          <strong>Note: if your facility has ECE employees eligible for ECE Wage Enhancement (ECE-WE), you are required
            to apply for ECE-WE prior to being approved for a fee increase under this policy. </strong>
        </v-banner>
        <br>

        <p class="text-h6 text--primary px-5 py-0 my-0">
          As defined in the <a href="#"> Funding Guidelines,</a> Direct Care Staff are staff employed on either a
          full-time, part-time, or casual basis, providing direct care to children at a facility for 50% or more of
          their working time.
        </p>

        <br>
        <div class="px-md-12 px-7">
          <br>
          <v-radio-group
            required
            row
            v-model.number="model.feeIncreaseDueToWage"
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
            <br>

            <v-radio-group
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

            <br>

            <v-radio-group
              required
              row
              v-model="model.isBargainingAgreement"
              label="Is the wage increase stipulated in a collective bargaining agreement for unionized staff at the facility?"
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
              required
              row
              v-model="model.lossOfCareStaff"
              label="Has the facility's current wage(s) resulted in loss of Direct Care Staff or an inability to hire sufficient Direct Care Staff?"
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
              required
              row
              v-model="model.healthAndSafetyConcerns"
              label="Is this creating immediate health and safety concerns for the facility under the requirements of the Child Care Licensing Regulation (CCLR)?"
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
      </v-card-text>
    </v-card>

    <div v-if="model.feeIncreaseDueToWage == 1">

      <v-card elevation="6" class="px-0 py-0 mx-auto my-10 rounded-lg col-12 "
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
            <strong>Note: If two or more staff have the same information for each column, they can be included in one
              row. </strong>
          </v-banner>

          <div class="px-md-12 px-7">

            <v-row class="hidden-sm-and-down">
              <v-col class="col-md-2 col-12 ">
                <h3> Number of staff receiving wage increase</h3>
              </v-col>

              <v-col class="col-md-2 col-12 ">
                <h3> Direct Care staff role </h3>
                <br>
                <p>(e.g. Responsible Adult, ECE, ECEA, etc)</p>
              </v-col>

              <v-col class="col-md-2 col-12 ">
                <h3> Wage before increase</h3>
                <br>
                <p>(not including ECE-WE)</p>
              </v-col>

              <v-col class="col-md-2 col-12 ">
                <h3> Wage after increase</h3>
                <br>
                <p>(not including ECE-WE)</p>
              </v-col>

              <v-col class="col-md-2 col-12 ">
                <h3> Average hours per week at this facility</h3>
              </v-col>

              <v-col class="col-md-2 col-12 ">
                <h3> Month and year of wage increase </h3>
              </v-col>
            </v-row>
            <span class="white--text"> . </span>
            <v-divider></v-divider>

            <v-row v-for="(obj, index) in model.wageList" :key="index">

              <v-col class="col-md-1 col-12 mx-0">
                <v-icon
                  large
                  color="blue darken-4"
                  class="mt-md-4"
                  @click="removeObjFromList(index, model.wageList)"
                > mdi-close
                </v-icon>
              </v-col>

              <v-col class="col-md-1 col-12">
                <v-text-field
                  type="number"
                  class=""
                  v-model.number="obj.staffNumber"
                  label="Number of Staff Recieving Wage Increase"
                  outlined
                  clearable
                  :rules="rules"
                ></v-text-field>
              </v-col>

              <v-col class="col-md-2 col-12 ">
                <v-text-field
                  class=""
                  v-model="obj.staffRole"
                  label="Direct Care Staff Role "
                  outlined
                  clearable
                  :rules="rules"
                ></v-text-field>
              </v-col>

              <v-col class="col-md-2 col-12 ">
                <v-text-field
                  prefix="$"
                  class=""
                  v-model.number="obj.wageBeforeIncrease"
                  label="Wage before increase"
                  outlined
                  clearable
                  :rules="rules"
                ></v-text-field>
              </v-col>

              <v-col class="col-md-2 col-12 ">
                <v-text-field
                  prefix="$"
                  class=""
                  v-model.number="obj.wageAfterIncrease"
                  label="Wage After increase"
                  outlined
                  clearable
                  :rules="rules"
                ></v-text-field>
              </v-col>

              <v-col class="col-md-2 col-12">
                <v-text-field type="number"
                              outlined :rules="rules"
                              v-model.number="obj.averageHours"
                              label="Average hours per week at this facility"

                />
              </v-col>

              <v-col class="col-md-2 col-12">
                <v-menu v-model="wageCalendar[index]" :close-on-content-click="false" :nudge-right="40"
                        transition="scale-transition" offset-y min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      :rules="rules"
                      outlined v-model="obj.wageDate"
                      label="Date of Wage Increase"
                      readonly v-bind="attrs" v-on="on">
                    </v-text-field>
                  </template>
                  <v-date-picker
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
              <v-btn id="funding" @click="addObjToList(wageObj, model.wageList)" class="my-5" dark color='#003366'>Add
                Funding
              </v-btn>
            </div>
            <br>

          </div>
        </v-card-text>
      </v-card>

      <v-card elevation="6" class="px-0 py-0 mx-auto my-10 rounded-lg col-12 "
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
              Please tell us more:
            </p>
          </div>
          <br>
          <div class="px-md-12 px-7">

            <br>
            <v-textarea
              label=" When did your facility's recruitment and retention challenges begin? "
              placeholder="Describe here"
              outlined
              v-model="model.textbox1"
            ></v-textarea>

            <br>
            <v-textarea
              label=" How many Direct Care Staff have left your facility due to wages? "
              placeholder="Describe here"
              outlined
              v-model=" model.textbox2"
            ></v-textarea>

            <br>
            <v-textarea
              label=" What have you done to try to recruit staff? "
              placeholder="Describe here"
              outlined
              v-model=" model.textbox3"
            ></v-textarea>

            <br>
            <v-textarea
              label=" Have you had to adjust your hours/days of operation?? "
              placeholder="Describe here"
              outlined
              v-model=" model.textbox4"
            ></v-textarea>

            <br>
            <v-textarea
              label=" Is your facility unable to fill spaces due to insufficient staffing? "
              placeholder="Describe here"
              outlined
              v-model=" model.textbox5"
            ></v-textarea>

            <br>
            <v-textarea
              label=" Is there anything else you would like us to know about the wage increase(s)? "
              placeholder="Describe here"
              outlined
              v-model=" model.textbox6"
            ></v-textarea>

          </div>
        </v-card-text>
      </v-card>

    </div>
    <!--End page two Wage Increase-->


    <v-card elevation="6" class="px-0 py-0 mx-auto my-10 rounded-lg col-12 "
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
            Priority Service Expansion: Increase in Hours of Operation
          </p>
        </div>
        <br>

        <div class="px-md-12 px-7">
          <br>
          <p>Is your fee increase due to an increase in hours/days of operation in order to provide care during
            expanded, extended (defined as after 7 pm and before 6 am and/or overnight), and/or non-traditional
            hours?</p>
          <v-radio-group
            required
            row
            v-model="model.feeIncreaseExtendedHours"
            label=""
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
      </v-card-text>
    </v-card>

    <div v-if="model.feeIncreaseExtendedHours == 1">
      <v-card elevation="6" class="px-0 py-0 mx-auto my-10 rounded-lg col-12 "
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
                <h3> Facility's previous hours of operation</h3>
                <br>
                <p>(e.g. 9:00 am - 4:00 pm)</p>
              </v-col>
              <v-col class="col-md-2 col-12 ">
                <h3> Facility's new hours of operation</h3>
                <br>
                <p>(e.g. 6:00 am - 5:00 pm)</p>
              </v-col>
              <v-col class="col-md-2 col-12 ">
                <h3> Date of Change</h3>
              </v-col>
              <v-col class="col-md-2 col-12 ">
                <h3> Amount of Expense</h3>
              </v-col>
              <v-col class="col-md-2 col-12 ">
                <h3> Payment frequency </h3>
              </v-col>
            </v-row>
            <span class="white--text"> . </span>
            <v-divider></v-divider>


            <v-row v-for="(obj, index) in model.expansionList" :key="index">
              <v-col class="col-md-1 col-12 mx-0">
                <v-icon
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
                      v-model="obj.timefrom"
                      label="Previous Open Time:"
                      prepend-icon="mdi-clock-time-four-outline"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="obj.menufrom"
                    v-model="obj.timefrom"
                    full-width
                    @click:minute="$refs.menufrom[index].save(timefrom)"
                  ></v-time-picker>
                </v-menu>
              </v-col>

              <v-col class="col-md-1 col-12 ">

                <v-menu
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
                      v-model="obj.timeto"
                      label="Previous Close Time:"
                      prepend-icon="mdi-clock-time-four-outline"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
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
                      v-model="obj.newtimefrom"
                      label="New Open Time:"
                      prepend-icon="mdi-clock-time-four-outline"
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
                      v-model="obj.newtimeto"
                      label="New Close Time:"
                      prepend-icon="mdi-clock-time-four-outline"
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
                <v-menu v-model="expansionCalendarMenu[index]" :close-on-content-click="false" :nudge-right="40"
                        transition="scale-transition" offset-y min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field :rules="rules" outlined v-model="obj.date" label="Date of Change (YYYY-MM-DD)"
                                  readonly v-bind="attrs" v-on="on">
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
                <v-text-field type="number" outlined :rules="rules" v-model.number="obj.expense" prefix="$"/>
              </v-col>

              <v-col class="col-md-2 col-12">
                <v-select
                  :items="items"
                  label="Payment Frequency"
                  outlined
                  v-model="obj.frequency"
                  :rules="rules"
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
              <v-btn @click="addObjToList(expansionObj, model.expansionList)" class="my-5" dark color='#003366'>Add Expansion Details
              </v-btn>
            </div>

            <br>
            <br>
            <v-textarea
              label=" Please explain why you have incurred (or will incur) each expense you have listed above.(e.g. Wages, Utilities)"
              outlined
              name="input-7-4"
              placeholder="Describe here"
              v-model="model.serviceExpansionDetailsNote"
            ></v-textarea>

            <br>
            <br>
            <v-textarea
              placeholder="Describe here"
              outlined
              name="input-7-4"
              label="Is there anything else about your change in hours of operation you would like us to know?"
              v-model="model.notes2"
            ></v-textarea>
          </div>
        </v-card-text>
      </v-card>

    </div>

    <!-- End page 3 Service Expansion Hours-->


    <v-card elevation="6" class="px-0 py-0 mx-auto my-10 rounded-lg col-12 "
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
            Priority Service Expansion: Increased Connection to Indigenous Community, Culture, and/or Language
          </p>
        </div>
        <br>

        <div class="px-md-12 px-7">

          <br>
          <p>As outlined in the <a href="#">Funding Guidelines</a>, this may include expenses associated with, but not
            limited to:</p>
          <ul>
            <li>Participation of an Elder, culture/language, and/or family in the child care program</li>
            <li>Participation of an Elder, of children in community, language, and/or cultural events or activities</li>
            <li>Language or culture resources for use in the child care program</li>
          </ul>
          <v-radio-group
            label="Is your fee increase due to an increased connection to Indigenous community, culture, or language in an Indigenous Facility or Organization?"
            required
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
          <br>
        </div>
      </v-card-text>
    </v-card>

    <div v-if="model.IndigenousConnection == 1 ">

      <v-card elevation="6" class="px-0 py-0 mx-auto my-10 rounded-lg col-12 "
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
              Indigenous Community Expense Information
            </p>
          </div>
          <br>

          <div class="px-md-12 px-7">
            <v-row class="hidden-sm-and-down">

              <v-col class="col-md-1 col-12 mx-0">
                <!--here for spacing-->
              </v-col>

              <v-col class="col-md-3 col-12 ">
                <h3> Expense Description</h3>
              </v-col>

              <v-col class="col-md-3 col-12 ">
                <h3> Date of expense</h3>
              </v-col>

              <v-col class="col-md-3 col-12 ">
                <h3> Payment frequency details</h3>
              </v-col>

              <v-col class="col-md-2 col-12 ">
                <h3>Expense amount</h3>
              </v-col>

            </v-row>
            <v-row v-for="(indigExpense, index) in model.indigenousExpenseList" :key="index">
              <v-col class="col-md-1 col-12 mx-0">
                <v-icon
                  large
                  color="blue darken-4"
                  class="mt-md-4"
                  @click="removeObjFromList(index, model.indigenousExpenseList)"
                > mdi-close
                </v-icon>
              </v-col>
              <v-col class="col-md-3 col-12 ">

                <v-text-field
                  class=""
                  v-model="indigExpense.description"
                  label="Description"
                  outlined
                  clearable
                  :rules="rules"
                ></v-text-field>
              </v-col>

              <v-col class="col-md-3 col-12">
                <v-menu v-model="calendarMenu[index]" :close-on-content-click="false" :nudge-right="40"
                        transition="scale-transition" offset-y min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field :rules="rules" outlined v-model="indigExpense.date" label="Date of Expense (YYYY-MM-DD)"
                                  readonly v-bind="attrs" v-on="on">
                    </v-text-field>
                  </template>
                  <v-date-picker
                    clearable
                    v-model="indigExpense.date"
                    @input="calendarMenu[index] = false">
                  </v-date-picker>
                </v-menu>
              </v-col>

              <v-col class="col-md-3 col-12">
                <v-select
                  :items="items"
                  label="Expense Frequency"
                  outlined
                  v-model="indigExpense.frequency"
                  :rules="rules"
                ></v-select>
              </v-col>

              <v-col class="col-md-2 col-12">
                <v-text-field type="number" outlined :rules="rules" v-model.number="indigExpense.expense" prefix="$"/>
              </v-col>

              <span class="white--text"> . </span>
              <v-divider></v-divider>

            </v-row> <!-- end v for-->

            <div class="form-group">
              
              <v-btn id="indigEx"  @click="addObjToList(indigenousExpenseObj, model.indigenousExpenseList)" class="my-5"
                     dark color='#003366'>Add Expense
              </v-btn>
            </div>
            <br>

            <p class="text-h6 text--primary py-5 my-0">

            </p>

            <div class="">
              <br>
              <v-textarea
                label="Please explain why you have incurred (or will incur) each expense, and/or explain the reason for the increased financial pressure(s) you have listed above."
                outlined
                name="input-7-4"
                placeholder="Describe here"
                v-model="model.iCEIDetailsNote"
              ></v-textarea>
            </div>
          </div>


        </v-card-text>
      </v-card>

    </div> <!--end show if yes / yes selected-->


    <!-- End Page 4 Indigenous Service Expansion-->


    <v-card elevation="6" class="px-0 py-0 mx-auto my-10 rounded-lg col-12 "
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
            Affordable Child Care for Underserved Populations
          </p>
        </div>
        <br>

        <div class="px-md-12 px-7">
          <br>
          <p>To be considered under this policy, the Facility must meet all of the following criteria as outlined in the
            <a href="#">Funding Guidelines</a>.</p>
          <ul>
            <li>Has historcally provided care to underserved populations -including Indigenous or low-income populations
              -at significantly below the regional median range of fees for their area or at no fee;
            </li>
            <li>Can demonstrate Parent Fee Increases will contribute to the operational sustainability of the
              organization; and
            </li>
            <li>Can demonstrate Parent Fee Increases will not substantively increase the actual cost of care for
              parents/families
            </li>
          </ul>
          <v-radio-group
            required
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
            <v-textarea
              outlined
              name="input-7-4"
              label="Please describe how the majority of children you provide care for represent an underserved population (e.g. indigenous children, low-income families?)"
              placeholder="Describe here"
              v-model="model.underservedChildCareTypes"
            ></v-textarea>

            <br>
            <v-textarea
              outlined
              name="input-7-4"
              label="How will your fee increase contribute to the overall sustainability of the organization/facility?"
              placeholder="Describe here"
              v-model="model.orgsustainability"
            ></v-textarea>

            <br>
            <v-textarea
              outlined
              name="input-7-4"
              label=" Describe whether parents out-of-pocket monthly cost for child care will be affected by this increase (after applying reductions from CCFRI and the Affordable Child Care Benefit, and any other applicable funding source). Will any families experience a cost increase, and if so, by how much?"
              placeholder="Describe here"
              v-model="model.outOfPocketFees"
            ></v-textarea>

          </div>

        </div>
      </v-card-text>
    </v-card>


    <v-row justify="space-around">
      <v-btn color="info" outlined x-large :loading="processing" @click="previous()">Back</v-btn>
      <!--add form logic here to disable/enable button-->
      <v-btn color="secondary" outlined x-large :loading="processing" @click="nextBtnClicked()" :disabled="false">Next</v-btn>
      <v-btn color="primary" outlined x-large :loading="processing" @click="save(true)">
        Save
      </v-btn>
    </v-row>

  </v-container>
</template>
<script>
import alertMixin from '@/mixins/alertMixin';
import {PATHS} from '@/utils/constants';
import {mapActions, mapMutations, mapState} from 'vuex';
import {deepCloneObject} from '@/utils/common';

let model = {
  expansionList: [],
  wageList: [],
  fundingList: [],
  expenseList: [],
  indigenousExpenseList: [] //this one does not exist in dynamics yet
};



// let model = {x: [], q1, q2, q3, datePicker, expenseList, fundingList, IndigenousExpenseList, expansionList,model.wageList};

export default {
  mixins: [alertMixin],
  name: 'CcfriRequestMoreInfo',
  data() {
    return {
      expenseObj: {
        description: '',
        date: undefined,
        expense: 0,
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
        expenses: ''
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
      test: 1,
      input: '',
      calendarMenu: [],
      expansionCalendarMenu: [],
      fundingCalendar: [],
      wageCalendar: [],
      // expense,
      items: ['One-time', 'Daily', 'Weekly', 'Monthly'],
      rules: [
        (v) => !!v || 'Required.',
      ],
      processing: false,

    };
  },
  mounted() {
    console.info('mounted');
    //this.model = this.$store.state.ccfriApp.model ?? model;
    console.info('model is: ', this.model);


    //load the screen with at least one row in the form
    this.addObjToList(this.fundingObj, model.fundingList);
    this.addObjToList(this.expenseObj, model.expenseList);
    this.addObjToList(this.wageObj, model.wageList);
    this.addObjToList(this.expansionObj, model.expansionList);
    this.addObjToList(this.indigenousExpenseObj, model.indigenousExpenseList);

  },
  async beforeRouteLeave(_to, _from, next) {
    this.$store.commit('rfiApp/setRfiModel', this.model);
    await this.save(false);
    //this.$store.commit('ccfriApp/ccfriOptInOrOut', this.ccfriOptInOrOut);
    next();
  },
  computed: {
    ...mapState('rfiApp', ['rfiModel', 'loadedModel']),
    ...mapState('app', ['programYearList', 'navBarList']),
    ...mapState('application', ['programYearLabel']),
    // currentYearTitle(){
    //   return this.programYearList.current.name.substring(0, 7);
    // },
    findIndexOfFacility(){
      return this.navBarList.findIndex((element) =>{ 
        return element.ccfriApplicationId == this.$route.params.urlGuid;
      });
    },
    currentFacility(){
      return this.navBarList[this.findIndexOfFacility];
    },
    nextFacility(){
      return this.navBarList[this.findIndexOfFacility + 1];
    },


  },
  watch: {
    '$route.params.urlGuid': {
      handler() {
        let ccfriId = this.$route.params.urlGuid;
        console.log('rfi ccfriGUID is: ', this.$route.params.urlGuid);
        this.loadRfi(ccfriId);
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
        console.info('handlera');
        console.info(this.model);
        this.$refs.form?.resetValidation();
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    ...mapActions('rfiApp', ['loadRfi', 'saveRfi']),
    ...mapMutations('rfiApp', ['setRfiModel']),
    ...mapMutations('app', ['refreshNavBar']),
    nextBtnClicked() {
      if (this.currentFacility.hasNmf || this.currentFacility.unlockNmf) {
        this.$router.push(PATHS.NMF + '/' + this.$route.params.urlGuid);
      } else {
        if (!this.nextFacility){
          this.$router.push({path : `${PATHS.eceweEligibility}`});
        }
        else if (this.nextFacility.ccfriOptInStatus == 1 && this.isRenewal){
          console.log('going to next fac EXISTING FEES page');
          this.$router.push({path : `${PATHS.currentFees}/${this.nextFacility.ccfriApplicationId}`});
          //check here if renew - then send them to appropriate screen currentFees
        }
        else if (this.nextFacility.ccfriOptInStatus == 1 ){
          //console.log('going to next fac NEW fees page');
          //TODO: this needs to check if opt in exists -- maybe in the nextFacility fn?
          this.$router.push({path : `${PATHS.addNewFees}/${this.nextFacility.ccfriApplicationId}`});
        }
        else { //TODO: Logic will need to exist here to eval if we should go to the RFI screens
          //RFI logic ?
          // this.setRfiList([{name: 'facilityName', guid: 'ccfriguid'}]);
          // if (this.rfiList?.length > 0) {
          //   this.$router.push(PATHS.ccfriRequestMoreInfo + '/' + '2dd4af36-9688-ed11-81ac-000d3a09ce90');
          // } else {
          this.$router.push({path : `${PATHS.eceweEligibility}`});
        }
      }
    },
    previous() {
      console.info('model is: ', this.model);
      console.info('RFI model is: ', this.rfiModel);
      //this.$router.back();
    },
    async save(showNotification) {
      this.processing = true;
      this.setRfiModel({...this.model});
      let ccfriId = this.$route.params.urlGuid;
      try {
        let friApplicationGuid = await this.saveRfi(ccfriId);
        if (friApplicationGuid) {
          this.model.rfiId = friApplicationGuid;
        }
        if (showNotification) {
          this.setSuccessAlert('Success! Request for Information has been saved.');
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
  },
  components: {}
};


</script>


<style scoped>

.backG {
  background-color: lightgray;
}

</style>

