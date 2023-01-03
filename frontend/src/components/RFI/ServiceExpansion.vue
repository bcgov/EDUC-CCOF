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
            v-model="model.q1"
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
        </div>
        </v-card-text>
      </v-card>

      <div v-if="model.q1 === 'Yes'">

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


              <v-row  v-for="(obj, index) in expenseList" :key="index">
                <v-col class="col-md-1 col-12 mx-0">
                  <v-icon
                      large
                      color="blue darken-4"
                      class="mt-md-4"
                      @click="removeExpense(index)"
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
                  <v-menu  v-model="calendarMenu[index]" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field :rules="rules" outlined v-model="obj.date" label="Date of Change (YYYY-MM-DD)" readonly v-bind="attrs" v-on="on">
                      </v-text-field>
                    </template>
                      <v-date-picker
                        clearable 
                        v-model="obj.date" 
                        @input="calendarMenu[index] = false">
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
                <v-btn @click="addExpense"   class="my-5" dark color='#003366'>Add Expense</v-btn>
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
              Upload supporting documents (for example receipts, quotes, and/or budget/finance documents) here:
              
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
                          @click="removeFunding(index)"
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
                    <v-btn id="funding" @click="addFunding()"   class="my-5" dark color='#003366'>Add Funding</v-btn>
                  </div>
                  <br>
                  
                </div>
                
              
            </div>

          </v-card-text>
        </v-card> 


       
        
      </div> <!--end show if yes / yes selected-->

      <v-row justify="space-around">
              <v-btn color="info" outlined x-large @click="previous()">
                Back</v-btn>
                <!--add form logic here to disable/enable button-->
              <v-btn color="secondary" outlined x-large @click="next()" :disabled="false">Next</v-btn>
              <v-btn color="primary" outlined x-large>
                Save</v-btn>
            </v-row>

  </v-container>
</template>

<script>

import { PATHS } from '@/utils/constants';

let q1 = '';
let q2 = '';
let q3 = '';
let datePicker= null; 

let expenseList = [
  {
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
  }
];

let fundingList = [
  {
    fundingProgram: '',
    date: undefined,
    status: '',
    amount: 0,
    expenses: ''
  }
];

let model = { x: [], q1 , q2, q3, datePicker, expenseList, fundingList };

export default {
  name: 'CcfriRequestMoreInfo',
  data() {
    return {
      model,
      input : '',
      expenseList,
      fundingList,
      timeto: null,
      timefrom: null,
      menufrom: false,
      menuto: false,
      newtimeto: null,
      newtimefrom: null,
      newmenufrom: false,
      newmenuto: false,
      calendarMenu: [],
      fundingCalendar : [],
    
      items: ['One-time', 'Daily', 'Weekly', 'Monthly'],
      rules: [
        (v) => !!v  || 'Required.',
      ],
     
    };
  },
  mounted() {
    this.model = this.$store.state.ccfriApp.model ?? model;
  },
  beforeRouteLeave(_to, _from, next) {
    this.$store.commit('ccfriApp/model', this.model);
    next();
  },
  computed: {
    
  },
  methods : {
    next(){
      this.$router.push(PATHS.IndigenousServiceExpansion);
    },
    previous() {
      this.$router.back();
    },
    addExpense () {
      this.expenseList.push({
        timeto: null,
        timefrom: null,
        menufrom: false,
        menuto: false,
        newtimeto: null,
        newtimefrom: null,
        newmenufrom: false,
        newmenuto: false,
        description: '',
        date: null,
        expense: 0,
        frequency: ''
      });
    },
    removeExpense(index){
      if (index == 0){
        return;
      }
      this.expenseList.splice(index, 1);
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

