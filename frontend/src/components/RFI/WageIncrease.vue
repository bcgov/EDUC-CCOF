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

let model = { x: [], q1 };

export default {
  name: 'CcfriRequestMoreInfo',
  data() {
    return {
      model,
      input : '',
      q1 : '',
     
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

