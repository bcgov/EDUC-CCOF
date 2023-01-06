<template>
  <v-container>

    <v-card elevation="6" class="px-0 py-0 mx-auto my-10 rounded-lg col-12 "
        min-height="230"
        rounded
        tiled
        exact 
        tile
        :ripple="false"
      >
      <v-card-text class="pa-0" >
        <div class="pa-2 pa-md-4 ma-0 backG">
          <p class="text-h5 text--primary px-5 py-0 my-0">
            Exceptional Circumstances
          </p>
        </div>
        <br>
        <p class="text-h6 text--primary px-5 py-0 my-0">
            As outlined in the <a href="#" >Funding Guidelines</a>, exceptional circumstances are expenses that are:
          </p>
        <div class="px-md-12 px-7">
          <br>
          <ul>
            <li>
              Sudden, unexpected, or oustide of the Organization's control; and
            </li>
            <li>
              Must also address an immediate health/safety concern, or is necessary for the facility to remain operational
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
      
          <v-card-text class="pa-0" >
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
              <v-row  v-for="(expense, index) in expenseList" :key="index">
                {{ index }}
                <v-col class="col-md-1 col-12 mx-0">
                  <v-icon
                      large
                      color="blue darken-4"
                      class="mt-md-4"
                      @click="removeObjFromList(index, expenseList)"
                      > mdi-close
                    </v-icon>
                </v-col>
                <v-col class="col-md-3 col-12 ">
                  
                  <v-text-field
                    class = ""
                    v-model="expense.description"
                    label="Description"
                    outlined
                    clearable
                    :rules="rules"
                  ></v-text-field>
                </v-col>

                <v-col class="col-md-3 col-12">
                  <v-menu  v-model="calendarMenu[index]" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field :rules="rules" outlined v-model="expense.date" label="Date of Expense (YYYY-MM-DD)" readonly v-bind="attrs" v-on="on">
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
                  <v-text-field type="number" outlined :rules="rules"  v-model.number="expense.expense"  prefix="$"/>
                </v-col>

                <span class="white--text"> . </span>
                <v-divider></v-divider>

              </v-row> <!-- end v for-->
            
              <div class="form-group">
                <v-btn id="" @click="addObjToList(expenseObj, expenseList)"   class="my-5" dark color='#003366'>Add Expense</v-btn>
              </div>
              <br>
              
              <p class="text-h6 text--primary py-5 my-0">
                Please explain why you have incurred (or will incur) each expense, and/or explain the reason for the increased financial pressure(s) you have listed above.
              </p>
              
              <div class="">
                <br>
                <v-textarea
                  outlined
                  name="input-7-4"
                  label="Describe here"
                  v-model="model.notes"
                ></v-textarea>
              </div>
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
          <v-card-text class="pa-0" >
            <div class="pa-2 pa-md-4 ma-0 backG">
              <p class="text-h5 text--primary px-5 py-0 my-0">
                Other Sources of Ministry Funding
              </p>
            </div>
            <br>
            <div class="px-md-12 px-7">
              <p>Have you applied for any other sources of Ministry Funding (e.g. BC Maintenance Fund, Start-Up Grants) for any of the expenses you listed?</p>
                <v-radio-group
                  required
                  row
                  v-model="model.q3"
                  label=""
                >
                  <v-radio
                    label="Yes"
                    value="Yes"
                  ></v-radio>
                  <v-radio
                    label="No"
                    value="No"
                  ></v-radio>
                </v-radio-group>

                <div  v-if="model.q3 === 'Yes'">
                  <v-row  v-for="(fundInfo, index) in fundingList" :key="index">
                    <v-col class="col-md-1 col-12 mx-0">
                      <v-icon
                          large
                          color="blue darken-4"
                          class="mt-md-4"
                          @click="removeObjFromList(index, fundingList)"
                          > mdi-close
                        </v-icon>
                    </v-col>
                    <v-col class="col-md-3 col-12 ">
                      <v-text-field
                        class = ""
                        v-model="fundInfo.fundingProgram"
                        label="Funding Program"
                        outlined
                        clearable
                        :rules="rules"
                      ></v-text-field>
                    </v-col>

                    <v-col class="col-md-2 col-12">
                      <v-menu  v-model="fundingCalendar[index]" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field :rules="rules" outlined v-model="fundInfo.date" label="Date (YYYY-MM-DD)" readonly v-bind="attrs" v-on="on">
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
                        class = ""
                        v-model="fundInfo.status"
                        label="Status"
                        outlined
                        clearable
                        :rules="rules"
                      ></v-text-field>
                    </v-col>

                    <v-col class="col-md-2 col-12">
                      <v-text-field type="number" outlined :rules="rules"  v-model.number="fundInfo.amount"  prefix="$"/>
                    </v-col>

                    <v-col class="col-md-2 col-12 ">
                      <v-text-field
                        class = ""
                        v-model="fundInfo.expenses"
                        label="Expense(s)"
                        outlined
                        clearable
                        :rules="rules"
                      ></v-text-field>
                    </v-col>

                    <span class="white--text"> . </span>
                    <v-divider></v-divider>

                  </v-row> <!-- end v for-->
                
            
                  <div class="form-group">
                    <v-btn id="funding" @click="addObjToList(fundingObj, fundingList)"   class="my-5" dark color='#003366'>Add Funding</v-btn>
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
      <v-card-text class="pa-0" >
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
            <strong>Note: if your facility has ECE employees eligible for ECE Wage Enhancement (ECE-WE), you are required to apply for ECE-WE prior to being approved for a fee increase under this policy. </strong> 
          </v-banner>
          <br>
          
          <p class="text-h6 text--primary px-5 py-0 my-0">
            As defined in the <a href="#" > Funding Guidelines,</a> Direct Care Staff are staff employed on either a full-time, part-time, or casual basis, providing direct care to children at a facility for 50% or more of their working time.
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
              <p>Was the wage increase committed to (in writing) before the January 2022 release of the Funding Guidelines?</p>
              <v-radio-group
                required
                row
                v-model="model.increaseInWriting"
                label=""
              >
                <v-radio
                  label="Yes"
                  value="Yes"
                ></v-radio>
                <v-radio
                  label="No"
                  value="No"
                ></v-radio>
              </v-radio-group>

              <br>
              <p>Is the wage increase stipulated in a collective bargaining agreement for unionized staff at the facility?</p>
              <v-radio-group
                required
                row
                v-model="model.isBargainingAgreement"
                label=""
              >
                <v-radio
                  label="Yes"
                  value="Yes"
                ></v-radio>
                <v-radio
                  label="No"
                  value="No"
                ></v-radio>
              </v-radio-group>

              <br>
              <p>Has the facility's current wage(s) resulted in loss of Direct Care Staff or an inability to hire sufficient Direct Care Staff?</p>
              <v-radio-group
                required
                row
                v-model="model.lossOfCareStaff"
                label=""
              >
                <v-radio
                  label="Yes"
                  value="Yes"
                ></v-radio>
                <v-radio
                  label="No"
                  value="No"
                ></v-radio>
              </v-radio-group>
              
              <br>
              <p>Is this creating immediate health and safety concerns for the facility under the requirements of the Child Care Licensing Regulation (CCLR)?</p>
              <v-radio-group
                required
                row
                v-model="model.healthAndSafetyConcerns"
                label=""
              >
                <v-radio
                  label="Yes"
                  value="Yes"
                ></v-radio>
                <v-radio
                  label="No"
                  value="No"
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
          <v-card-text class="pa-0" >
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
              <strong>Note: If two or more staff have the same information for each column, they can be included in one row. </strong> 
            </v-banner>

            <div class="px-md-12 px-7">

              <v-row  v-for="(obj, index) in wageList" :key="index">

                <v-col class="col-md-1 col-12 mx-0">
                  <v-icon
                      large
                      color="blue darken-4"
                      class="mt-md-4"
                      @click="removeObjFromList(index, wageList)"
                      > mdi-close
                    </v-icon>
                </v-col>

                <v-col class="col-md-1 col-12">
                  <v-text-field
                    type="number" 
                    class = ""
                    v-model.number="obj.staffNumber"
                    label="Number of Staff Recieving Wage Increase"
                    outlined
                    clearable
                    :rules="rules"
                  ></v-text-field>
                </v-col>
            
                <v-col class="col-md-2 col-12 ">
                  <v-text-field
                    class = ""
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
                    class = ""
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
                    class = ""
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
                  <v-menu  v-model="wageCalendar[index]" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field 
                      :rules="rules" 
                      outlined v-model="obj.wageDate" 
                      label="Month and year of wage increase" 
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
                  <v-btn id="funding"  @click="addObjToList(wageObj, wageList)"   class="my-5" dark color='#003366'>Add Funding</v-btn>
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
          <v-card-text class="pa-0" >
            <div class="pa-2 pa-md-4 ma-0 backG">
              <p class="text-h5 text--primary px-5 py-0 my-0">
                Please tell us more:
              </p>
            </div>
            <br>
            <div class="px-md-12 px-7">
              
              <p class="text text--primary" > When did your facility's recruitment and retention challenges begin? </p>
              <v-text-field
                placeholder="Describe here"
                outlined
                v-model="model.textbox1"
              ></v-text-field>

              <p class="text text--primary" > How many Direct Care Staff have left your facility due to wages? </p>
              <v-text-field
                placeholder="Describe here"
                outlined
                v-model=" model.textbox2"
              ></v-text-field>

              <p class="text text--primary" > What have you done to try to recruit staff? </p>
              <v-text-field
                placeholder="Describe here"
                outlined
                v-model=" model.textbox3"
              ></v-text-field>

              <p class="text text--primary" > Have you had to adjust your hours/days of operation? </p>
              <v-text-field
                placeholder="Describe here"
                outlined
                v-model=" model.textbox4"
              ></v-text-field>

              <p class="text text--primary" > Is your facility unable to fill spaces due to insufficient staffing? </p>
              <v-text-field
                placeholder="Describe here"
                outlined
                v-model=" model.textbox5"
              ></v-text-field>

              <p class="text text--primary" > Is there anything else you would like us to know about the wage increase(s)? </p>
              <v-text-field
                placeholder="Describe here"
                outlined
                v-model=" model.textbox6"
              ></v-text-field>
              
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
          <v-card-text class="pa-0" >
            <div class="pa-2 pa-md-4 ma-0 backG">
              <p class="text-h5 text--primary px-5 py-0 my-0">
                Documentation Required
              </p>
            </div>
            <br>
            <div class="px-md-12 px-7">
              Upload supporting documents (for example receipts, quotes, and budget/finance documents) here:
              
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
      <v-card-text class="pa-0" >
        <div class="pa-2 pa-md-4 ma-0 backG">
          <p class="text-h5 text--primary px-5 py-0 my-0">
            Priority Service Expansion: Increase in Hours of Operation
          </p>
        </div>
        <br>
        
        <div class="px-md-12 px-7">
          <br>
          <p>Is your fee increase due to an increase in hours/days of operation in order to provide care during expanded, extended (defined as after 7 pm and before 6 am and/or overnight), and/or non-traditional hours?</p>
          <v-radio-group
            required
            row
            v-model="model.feeIncreaseExtendedHours"
            label=""
          >
            <v-radio
              label="Yes"
              :value= '1'
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
      
          <v-card-text class="pa-0" >
            <div class="pa-2 pa-md-4 ma-0 backG">
              <p class="text-h5 text--primary px-5 py-0 my-0">
                Service Expansion Details
              </p>
            </div>
            <br>
            
            <div class="px-md-12 px-7">

              <v-row>
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


              <v-row  v-for="(obj, index) in expansionList" :key="index">
                <v-col class="col-md-1 col-12 mx-0">
                  <v-icon
                      large
                      color="blue darken-4"
                      class="mt-md-4"
                      @click="removeObjFromList(index, expansionList)"
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
                        label="From:"
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
                        label="To:"
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
                        label="From:"
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
                        label="To:"
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
                  <v-menu  v-model="expansionCalendarMenu[index]" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field :rules="rules" outlined v-model="obj.date" label="Date of Change (YYYY-MM-DD)" readonly v-bind="attrs" v-on="on">
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
                  <v-text-field type="number" outlined :rules="rules"  v-model.number="obj.expense"  prefix="$"/>
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
                <v-btn  @click="addObjToList(expansionObj, expansionList)"  class="my-5" dark color='#003366'>Add Expense</v-btn>
              </div>

              <br>
              <p class="text-h6 text--primary py-5 my-0">
                Please explain why you have incurred (or will incur) each expense you have listed above.(e.g. Wages, Utilities)
              </p>
              
              <div class="">
                <br>
                <v-textarea
                  outlined
                  name="input-7-4"
                  label="Describe here"
                  v-model="model.notes"
                ></v-textarea>
              </div>

              <br>
              <p class="text-h6 text--primary py-5 my-0">
                Is there anything else about your change in hours of operation you would like us to know?
              </p>
              
              <div class="">
                <br>
                <v-textarea
                  outlined
                  name="input-7-4"
                  label="Describe here"
                  v-model="model.notes2"
                ></v-textarea>
              </div>

            </div>

            
          </v-card-text>
        </v-card> 

      </div>

      <!-- End page 3 Service Expansion Hours-->







      <v-row justify="space-around">
              <v-btn color="info" outlined x-large @click="previous()">
                Back</v-btn>
                <!--add form logic here to disable/enable button-->
              <v-btn color="secondary" outlined x-large @click="next()" :disabled="false">Next</v-btn>
              <v-btn color="primary" outlined x-large @click="save()">
                Save</v-btn>
            </v-row>

  </v-container>
</template>

<script>

import { PATHS } from '@/utils/constants';
import { mapActions, mapState } from 'vuex';
let q1 = '';
let q2 = '';
let q3 = '';
let datePicker= null; 


 

let expenseList = [
  {
    description: '',
    date: undefined,
    expense: 0,
    frequency: ''
  }
];

let fundingList = [];

let wageList = [];

let expansionList = [];

let model = { x: [], q1 , q2, q3, datePicker, expenseList, fundingList };

export default {
  name: 'CcfriRequestMoreInfo',
  data() {
    return {
      expenseObj : {
        description: '',
        date: undefined,
        expense: 0,
        frequency: ''
      },
      fundingObj : {
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
      expansionObj : {
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
      input : '',
      expenseList,
      fundingList,
      wageList,
      expansionList,
      calendarMenu: [],
      expansionCalendarMenu : [],
      fundingCalendar : [],
      wageCalendar: [],
      // expense,
      items: ['One-time', 'Daily', 'Weekly', 'Monthly'],
      rules: [
        (v) => !!v  || 'Required.',
      ],
     
    };
  },
  mounted() {
    this.model = this.$store.state.ccfriApp.model ?? model;

    

    //load the screen with at least one row in the form 
    // this.addObjToList(Object.create(this.fundingObj), this.fundingList);
    // this.addObjToList(Object.create(this.expenseObj), expenseList);
    // this.addObjToList(this.wageObj, wageList);
    // this.addObjToList(this.expansionObj, expansionList);
    
  },
  beforeRouteLeave(_to, _from, next) {
    this.$store.commit('ccfriApp/model', this.model);
    //this.$store.commit('ccfriApp/ccfriOptInOrOut', this.ccfriOptInOrOut);
    next();
  },
  computed: {
    ...mapState('rfiApp', ['rfiModel']),
  },
  watch: {
    '$route.params.urlGuid': {
      handler() {
        let ccfriId = this.$route.params.urlGuid;
        this.loadRfi(ccfriId);
      },
      immediate: true,
      deep: true
    },
    rfiModel: {
      handler() {
        this.model = { ...this.rfiModel };
        this.$refs.form?.resetValidation();
      },
      immediate: true,
      deep: true
    }
  },  
  methods : {
    ...mapActions('rfiApp', ['loadRfi', 'saveRfi']),

    next(){
      this.$router.push(PATHS.WageIncrease + '/' + '2dd4af36-9688-ed11-81ac-000d3a09ce90');

      // put logic here to go to next facility / ece we etc
    },
    previous() {
      this.$router.back();  
    },
    save(){
      console.log(this.model);
    },
    addObjToList (obj, list) {
      console.log(list);
      console.log(this.expenseList);
      list.push(Object.assign({}, obj));
    },
    removeObjFromList (index, list) {
      if (index == 0){
        return;
      }
      list.splice(index, 1);
    },
  },
  components: { }
};


</script>


<style scoped>

.backG{
  background-color: lightgray;
}

</style>

