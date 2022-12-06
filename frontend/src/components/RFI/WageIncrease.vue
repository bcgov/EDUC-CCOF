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
              Direct Care Staff Wages Increases
            </p>
          </div>
          <v-toolbar 
              color="blue lighten-4"
              justify="center"
              class="ma-md-4"
            >
              <v-toolbar-title class="flex ml-md-4" >
                <v-row>
                  <font-awesome-icon icon="fa-solid fa-circle-info " class="fa-2x mx-4 my-2"/> 
                  <p class="text text--primary  mx-4 my-3" > Note: if your facility has ECE employees eligible for ECE Wage Enhancement (ECE-WE), you are required to apply for ECE-WE prior to being approved for a fee increase under this policy. </p>
                </v-row>
              </v-toolbar-title >
              
            </v-toolbar>
          <br>
          
          <p class="text-h6 text--primary px-5 py-0 my-0">
            As defined in the <a href="#" > Funding Guidelines,</a> Direct Care Staff are staff employed on either a full-time, part-time, or casual basis, providing direct care to children at a facility for 50% or more of their working time.
          </p>
          
          <br>
          <div class="px-md-12 px-7">
            <br>
            <p>Is your fee increase due to a wage increase for Direct Care Staff?</p>
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

            <div v-if="model.q1 == 'Yes'">
              <br>
              <p>Was the wage increase committed to (in writing) before the January 2022 release of the Funding Guidelines?</p>
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

              <br>
              <p>Is the wage increase stipulated in a collective bargaining agreement for unionized staff at the facility?</p>
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

              <br>
              <p>Has the facility's current wage(s) resulted in loss of Direct Care Staff or an inability to hire sufficient Direct Care Staff?</p>
              <v-radio-group
                required
                row
                v-model="model.q4"
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
                v-model="model.q5"
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


      <div v-if="model.q1 == 'Yes'">

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
            <v-toolbar 
              color="blue lighten-4"
              justify="center"
              class="ma-md-4"
            >
              <v-toolbar-title class="flex ml-md-4" >
                <v-row>
                  <font-awesome-icon icon="fa-solid fa-circle-info " class="fa-2x mx-4 my-2"/> 
                  <p class="text text--primary  mx-4 my-3" > Note: If two or more staff have the same information for each column, they can be included in one row. </p>
                </v-row>
              </v-toolbar-title >
              
            </v-toolbar>
            <div class="px-md-12 px-7">

              <v-row  v-for="(obj, index) in wageList" :key="index">
                    <v-btn 
                      icon
                      class="my-5"
                      @click="removeFunding(index)"
                      >
                  <font-awesome-icon icon="fa-solid fa-circle-xmark" class="fa-xl"/>
                </v-btn>
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

                  </v-row> <!-- end v for-->
                
            
                  <div class="form-group">
                    <v-btn id="funding" @click="addWage()"   class="my-5" dark color='#003366'>Add Funding</v-btn>
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

//let q1 = '';

let wageList = [
  {
    staffRole: '',
    staffNumber: 0,
    wageBeforeIncrease: 0,
    wageAfterIncrease: 0,
    averageHours: 0,
    wageDate: undefined
  }
];

let model = { x: [], wageList  };

export default {
  name: 'CcfriRequestMoreInfo',
  data() {
    return {
      model,
      input : '',
      // q1 : '',
     
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
    addWage () {
      this.expenseList.push( {
        staffRole: '',
        staffNumber: 0,
        wageBeforeIncrease: 0,
        wageAfterIncrease: 0,
        averageHours: 0,
        wageDate: undefined
      });
    },
    next(){
      if (this.model.q1 === 'Yes'){
        this.$router.push(PATHS.addNewFees);
      }
    },
    previous() {
      this.$router.push(PATHS.ccfriRequestMoreInfo); //TODO: only goes to 'add fees' page. Add logic to check if fees exist (option1 in wireframes)
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

