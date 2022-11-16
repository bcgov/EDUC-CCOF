<template>
    <v-container>
        <div>
            <MessagesToolbar></MessagesToolbar>
        </div>
        <br><br>
        <v-btn color="info" outlined x-large  @click="updateCCFRI()">
            UPDATE CCFRI APPLICATION</v-btn>
        {{ccfriOptInOrOut}}
        <!--TODO: The update buttons don't align and I don't like it !!-->
        <!--TODO: Right now there is no logic to pull current facility fees. This just brings you directly to opt in or out, which then brings you to fill in all fees.
          this will need to get changed at a later point when the API is more built out 
          there is also no logic about if you can click next or not 
        -->
        <LargeButtonContainer>
          
          <v-card elevation="4" class="py-2 px-5 mx-2 my-10 rounded-lg col-12"
            rounded
            tiled
            exact tile
            :ripple="false"
            v-for="({facilityName, facilityId, ccfriStatus, eceweStatus, ccfriOptInStatus } , index) in facilityList" :key="facilityId">
            <v-card-text>
              <v-row>
                <v-col cols="" class="col-12 col-md-8">
                  <p class="text--primary"> Facility ID: {{facilityId}}</p>
                  <p class="text--primary "><strong> Facility Name : {{facilityName}}</strong></p>
                  <p class="text--primary"> Licence : 123456789</p>
                  <p class="text--primary " min-width="250px" >Status: {{ccfriStatus}}</p>
                  <strong> <p class="text--primary  " >Opt-In:  {{ccfriOptInStatus}}</p> </strong>
                </v-col>
                <v-col cols="" class="d-flex align-center col-12 col-md-4"
                  v-if="!showOptStatus[index]"
                >
                  
                  <v-btn
                  class = "my-10 mx-14 justify-end"
                  @click="toggle(index)"
                  :showOptStatus = "showOptStatus[index]"
                  dark color='#003366' 
                  > 
                    UPDATE
                  </v-btn>
                </v-col>
                <v-col v-else cols="" class="d-flex align-center col-12 col-md-4  "
                >
                  <v-row>
                    <v-radio-group
                      mandatory
                      v-model="ccfriOptInOrOut[index]"
                      class = "mx-12"
                    >
                      <v-radio
                        label="Opt-In"
                        value="1"
                        
                      ></v-radio>
                      <v-radio
                        label="Opt-Out"
                        value="0"
                        
                      ></v-radio>
                    </v-radio-group>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
      
        </LargeButtonContainer>

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


import { mapGetters, mapState} from 'vuex';
import MessagesToolbar from '../../guiComponents/MessagesToolbar.vue';
import LargeButtonContainer from '../../guiComponents/LargeButtonContainer.vue';
import { PATHS } from '@/utils/constants';
import axios from 'axios';
import ApiService from '@/common/apiService';

//const APPLICATION_ID = '41f6494d-1d5d-ed11-9562-002248d53d53'; //This should come from the facility obj -- not implemented yet

let ccfriOptInOrOut = {};

let model = { x: [], ccfriOptInOrOut };
//let ccfriOptInOrOut = { x: [] };

export default {
  name: 'CcfriLandingPage',
  data() {
    return {
      input : '',
      model,
      showOptStatus : '',
      isValidForm: undefined,
      ccfriOptInOrOut,
      feeList : [
        {
          date: 'Jan 2022',
          pre3year: 1234,
          post3year: 2222
        },
        {
          date: 'Feb 2022',
          pre3year: 5555,
          post3year: 8811
        },
        {
          date: 'Mar 2022',
          pre3year: 6754,
          post3year: 8223
        }
      ],
      rules: [
        (v) => !!v  || 'Required.',
      ],
    };
  },
  computed: {
    ...mapGetters('auth', ['userInfo']),
    ...mapState('facility', ['facilityList']),
  },
  beforeMount: function() {
    this.showOptStatus = new Array(this.facilityList.length).fill(false);
  },
  methods: {
    toggle(index) {
      console.log(this.showOptStatus);
      this.$set(this.showOptStatus, index, true);
      //this.showOptStatus[index] = true;
    
    },
    previous() {
      this.$router.push(PATHS.home); //TODO: change this, from CCOF page
    },
    next() {
      this.$router.push(PATHS.addNewFees); //TODO: only goes to 'add fees' page. Add logic to check if fees exist (option1 in wireframes)
    },
    refreshWithFacility() {
      let x = this.$route.params.urlFacilityId;
      this.loadFacility(x);
    },
    async updateCCFRI () {

      console.log('f');
      //console.log(this.getFacility(APPLICATION_ID));

      //note - because application / facility is hardcoded rn, the second (dummy) facility will throw an API error. This is expected
      this.facilityList.forEach (async (facility, index) => {

        console.log(this.userInfo.applicationId);
        let payload = {
          applicationID : this.userInfo.applicationId, 
          facilityID : facility.facilityId, 
          optInResponse: this.ccfriOptInOrOut[index] 
        };

        payload = JSON.parse(JSON.stringify(payload));

        console.log(payload);

        try {
          const response = await ApiService.apiAxios.patch('/api/application/ccfri/', payload);
          //console.log(response);
        } catch (error) {
          console.info(error);
        }

      });
    },

    //this is an example - take me out /////////////////////////////////////////
    async getFacility (id) {
      try {
        this.facilityResult = (axios.get('/api/facility/:'+id)).data;
      } catch (error) {
        console.info(error);
      }
    }
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
  components: { MessagesToolbar, LargeButtonContainer,  }
};
</script>

<style scoped>

body {
white-space: pre-wrap;
}


</style>

