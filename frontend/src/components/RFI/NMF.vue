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
            New Facilities
          </p>
        </div>
        <br>
        
        <div class="px-md-12 px-7">
          <br>
          <p>Did your facility receive space creation funding prior to April 1, 2021?</p>
          
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

          <p>Does your facility provide additional services (such as meals or other wrap-around services), to support families 
            experiencing vulnerability and/or underserved populations, such as Indigenous or low-income families?</p>
          
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

          <p>3. Do you provide transportation to/from your facility to support families in rural or remote communities who may not   
            otherwise be able to access child care?</p>
          
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


          <div v-if="model.q1 == 'Yes' && model.q2 == 'Yes' && model.q3 == 'Yes'">
            <p class="text-h6 text--primary py-5 my-0">
              Please tell us anything else you'd like us to know about how your facility's business case supports setting fees higher than the   
              Affordability Benchmarks outlined in the 2023/24 Funding Guidelines. 
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

       
        
       <!--end show if yes / yes selected-->


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

// import { PATHS } from '@/utils/constants';



let model = { x: [],  };

export default {
  name: 'CcfriRequestMoreInfo',
  data() {
    return {
      model,
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
      this.$router.push('/'); //TODO: change logic here to either go to the next facility in the NavBar, or ECE WE
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

