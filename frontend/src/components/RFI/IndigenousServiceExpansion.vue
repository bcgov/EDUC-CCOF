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
            Priority Service Expansion: Increased Connection to Indigenous Community, Culture, and/or Language
          </p>
        </div>
        <br>
        
        <div class="px-md-12 px-7">
          <br>
          <p>Is your fee increase due to an increased connection to Indigenous community, culture, or language in an Indigenous Facility or Organization?</p>
          <br>
          <p>As outlined in the <a href = "#" >Funding Guidelines</a>, this may include expenses associated with, but not limited to:</p>
          <ul>
            <li>Participation of an Elder, culture/language, and/or family in the child care program</li>
            <li>Participation of an Elder, of children in community, language, and/or cultural events or activities</li>
            <li>Language or culture resources for use in the child care program</li>
          </ul>
          <v-radio-group
            label = "Is your fee increase due to an increased connection to Indigenous community, culture, or language in an Indigenous Facility or Organization?"
            required
            row
            v-model="model.IndigenousConnection"
            
          >
            <v-radio
              label="Yes"
              :value="Yes"
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

      <div v-if="model.IndigenousConnection == 1 ">

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
            <br>
            
            <div class="px-md-12 px-7">
              <v-row  v-for="(expense, index) in IndigenousExpenseList" :key="index">
                <v-col class="col-md-1 col-12 mx-0">
                  <v-icon
                      large
                      color="blue darken-4"
                      class="mt-md-4"
                      @click="removeObjFromList(index, IndigenousExpenseList)" 
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
                <v-btn id="login-button" @click="addObjToList(IndigenousExpansionObj, IndigenousExpenseList)" class="my-5" dark color='#003366'>Add Expense</v-btn>
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
                Documentation Required
              </p>
            </div>
            <br>
            <div class="px-md-12 px-7">
              Upload supporting documents (for example receipts, quotes, and/or budget/finance documents) here:
              
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
    description: '',
    date: undefined,
    expense: 0,
    frequency: ''
  }
];


let model = { x: [], q1 , q2, q3, datePicker, expenseList,  };

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
  },
  beforeRouteLeave(_to, _from, next) {
    this.$store.commit('ccfriApp/model', this.model);
    next();
  },
  computed: {
    
  },
  methods : {
    next(){
      this.$router.push(PATHS.UnderservedPop);
    },
    previous() {
      this.$router.back();  
    },
    addExpense () {
      this.expenseList.push({
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

