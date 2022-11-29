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
          <p>Is your fee increase due to an exceptional circumstance?</p>
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
          <div v-if="model.q1 === 'Yes'">
            <p>Does the exceptional circumstance occur within 6 months of the fee increase?</p>
            <v-radio-group
              required
              row
              v-model="model.q2"
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

      <v-card elevation="6" class="px-0 py-0 mx-auto my-10 rounded-lg col-12 "
        min-height="230"
        rounded
        tiled
        exact 
        tile
        :ripple="false"
        v-if="model.q1 === 'Yes' && model.q2 === 'Yes' "
      >
      <v-card-text class="pa-0" >
        <div class="pa-2 pa-md-4 ma-0 backG">
          <p class="text-h5 text--primary px-5 py-0 my-0">
            Expense Information
          </p>
        </div>
        <br>
        <div class="px-md-12 px-7">
          <v-row  v-for="(expense, index) in expenseList" :key="index">
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
                  <v-text-field outlined v-model="expense.date" label="Date of Expense (YYYY-MM-DD)" readonly v-bind="attrs" v-on="on">
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
              <v-text-field type="number" outlined :rules="rules"  v-model.number="expense.expense"  prefix="$"/>
            </v-col>

            <v-col class="col-md-3 col-12">
              <v-select
                :items="items"
                label=""
                outlined
                v-model="expense.frequency"
                :rules="rules"
              ></v-select>
            </v-col>

          </v-row> <!-- end v for-->
         

          <div class="form-group">
            <v-btn id="login-button" @click="addExperience"   class="my-5" dark color='#003366'>Add Expense</v-btn>
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
let datePicker= null; 

let expenseList = [
  {
    description: '',
    date: undefined,
    expesnse: 0,
    frequency: ''
  }
];

// let descriptions = {};
// let dates = undefined;
// let expense = 0;
// let payFrequency = {};



let model = { x: [], q1 , q2, datePicker, expenseList, };

export default {
  name: 'CcfriRequestMoreInfo',
  data() {
    return {
      model,
      input : '',
      expenseList,
      calendarMenu: [],
      // expense,
      items: ['One-time', 'Daily', 'Weekly', 'Monthly'],
      rules: [
        (v) => !!v  || 'Required.',
      ],
     
    };
  },
  mounted() {
    this.model = this.$store.state.ccfriApp.model ?? model;
    //this.ccfriOptInOrOut = this.$store.ccfriOptInOrOut.ccfriApp.ccfriOptInOrOut ?? ccfriOptInOrOut;
  },
  beforeRouteLeave(_to, _from, next) {
    this.$store.commit('ccfriApp/model', this.model);
    //this.$store.commit('ccfriApp/ccfriOptInOrOut', this.ccfriOptInOrOut);
    next();
  },
  computed: {
    
  },
  methods : {
    next(){
      if (this.model.q1 === 'Yes'){
        this.$router.push(PATHS.addNewFees);
      }
    },
    previous() {
      this.$router.push(PATHS.addNewFees); //TODO: only goes to 'add fees' page. Add logic to check if fees exist (option1 in wireframes)
    },
    addExperience () {
      this.expenseList.push({
        description: '',
        date: null,
        expense: 0,
        frequency: ''
      });
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

