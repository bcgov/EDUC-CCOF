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
                      @click="removeRow(index)"
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

    <v-row justify="space-around">
      <v-btn class="blueButton" x-large @click="previous()">Back</v-btn>
        <!--add form logic here to disable/enable button-->
      <v-btn class="blueButton" x-large @click="next()" :disabled="false">Next</v-btn>
      <v-btn class="blueButton" x-large>Save</v-btn>
    </v-row>
        
  </v-container>
</template>

<script>

import { PATHS } from '@/utils/constants';
import { mapActions, mapState } from 'vuex';

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

let model = { wageList, };

export default {
  name: 'CcfriRequestMoreInfo',
  data() {
    return {
      model,
      input : '',
      wageList,
      wageCalendar: [],
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
    ...mapState('rfiApp', ['rfiModel']),
  },
  watch: {
    '$route.params.urlGuid': {
      handler() {
        let ccfriId = this.$route.params.urlGuid;
        console.log('watched');
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
    addRow () {
      this.wageList.push( {
        staffRole: '',
        staffNumber: 0,
        wageBeforeIncrease: 0,
        wageAfterIncrease: 0,
        averageHours: 0,
        wageDate: undefined
      });
    },
    removeRow(index){
      if (index == 0){
        return;
      }
      this.wageList.splice(index, 1);
    },
    next(){
      this.$router.push(PATHS.ServiceExpansion);
    },
    previous() {
      this.$router.back(); 
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

