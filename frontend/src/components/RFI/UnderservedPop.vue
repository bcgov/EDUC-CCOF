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
            Affordable Child Care for Underserved Populations
          </p>
        </div>
        <br>
        
        <div class="px-md-12 px-7">
          <br>
          <p>To be considered under this policy, the Facility must meet all of the following criteria as outlined in the <a href = "#" >Funding Guidelines</a>.</p>
          <ul>
            <li>Has historcally provided care to underserved populations -including Indigenous or low-income populations -at significantly below the regional median range of fees for their area or at no fee;</li>
            <li>Can demonstrate Parent Fee Increases will contribute to the operational sustainability of the organization; and</li>
            <li>Can demonstrate Parent Fee Increases will not substantively increase the actual cost of care for parents/families</li>
          </ul>
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

          <p class="text-h6 text--primary py-5 my-0">
            Please describe how the majority of children you provide care for represent an underserved population (e.g. indigenous children, low-income families?)
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
            How will your fee increase contribute to the overall sustainability of the organization/facility?
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

          <br>
          <p class="text-h6 text--primary py-5 my-0">
            Describe whether parents out-of-pocket monthly cost for child care will be affected by this increase (after applying reductions from CCFRI and the Affordable Child Care Benefit, and any other applicable funding source). Will any families experience a cost increase, and if so, by how much?
          </p>
      
          <div class="">
            <br>
            <v-textarea
              outlined
              name="input-7-4"
              label="Describe here"
              v-model="model.notes3"
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
      this.$router.push(PATHS.NMF);
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

