<template>
    <v-container>
        <div>
            <MessagesToolbar></MessagesToolbar>
        </div>
        <br><br>
        
        <!--TODO: The update buttons don't align and I don't like it !!-->
        <!--TODO: Right now there is no logic to pull current facility fees. This just brings you directly to opt in or out, which then brings you to fill in all fees.
          this will need to get changed at a later point when the API is more built out 
          there is also no logic about if you can click next or not 
        -->
        <LargeButtonContainer>
          
          <v-card elevation="4" class="pa-2 mx-2 my-10 rounded-lg col-12"
            rounded
            tiled
            exact tile
            :ripple="false"
            v-for="({facilityName, facilityId, ccfriStatus, eceweStatus} , index) in userInfo.facilityList" :key="facilityId">
            <v-card-text>
              <v-row>
                <v-col cols="" class="col-12 col-md-7">
                  <p class="text--primary"> Facility ID: {{facilityId}}</p>
                  <p class="text--primary "><strong> Facility Name : {{facilityName}}</strong></p>
                  <p class="text--primary"> Licence : 123456789</p>
                </v-col>
                <v-col cols="" class="d-flex align-center col-12 col-md-5"
                  v-if="!showOptStatus[index]"
                >
                  <p class="text--primary" width="50px" >Status: {{ccfriStatus}}</p>
                  <br>
                  <v-btn
                  class = "ma-10 "
                  @click="toggle(index)"
                  :showOptStatus = "showOptStatus[index]" 
                  > 
                    UPDATE
                  </v-btn>
                </v-col>
                <v-col v-else cols="" class="d-flex align-center col-12 col-md-5"
                >
                  <p class="text--primary" >Status: {{ccfriStatus}}</p>
                  <v-row>
                    <v-radio-group
                      required
                      row
                      v-model="ccfriOptInOrOut[index]"
                      class = "ml-10"
                    >
                      <v-radio
                        label="Opt-In"
                        value="Out"
                      ></v-radio>
                      <v-radio
                        label="Opt-Out"
                        value="In"
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


import { mapGetters} from 'vuex';
import MessagesToolbar from '../../guiComponents/MessagesToolbar.vue';
import LargeButtonContainer from '../../guiComponents/LargeButtonContainer.vue';
import { PATHS } from '@/utils/constants';

export default {
  name: 'CcfriLandingPage',
  data() {
    return {
      input : '',
      showOptStatus : '',
      isValidForm: undefined,
      ccfriOptInOrOut : {},
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
    };
  },
  computed: {
    ...mapGetters('auth', ['userInfo']),
    chosenOrg(){
      //TODO: This is hardcoom a chosen org from an earlier screen.
      return this.userInfo;
    },
    
    // allFacilities(){
    //   return this.chosenOrg.facilityList;
    // }
  },
  beforeMount: function() {
    this.showOptStatus = new Array(this.userInfo.facilityList.length).fill(false);
  },
  methods: {
    toggle(index) {
      console.log('hi!');
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
    }
  },
  components: { MessagesToolbar, LargeButtonContainer,  }
};
</script>

<style scoped>

body {
white-space: pre-wrap;
}


</style>

