<template>
    <v-container>
        <div>
            <MessagesToolbar></MessagesToolbar>
        </div>
        <br><br>
        <!-- <v-row justify="space-around">
        
          <SmallCard title="Add a New Facility to my Organization" disabled="true">
              <br>
              <a href="#">LINK</a><br>
          </SmallCard>
       
          <SmallCard title="Apply for CCFRI and ECE-WE">
              <br>
              <a href="#">LINK</a><br>
          </SmallCard>
        
      </v-row> -->

        <!-- v-if="!showOptStatus[index]" -->
        <p> {{showOptStatus}}</p>
        <LargeButtonContainer>
          <v-card v-if=" !userInfo.facilityList">
          </v-card>

        
        <v-card elevation="4" class="pa-2 mx-2 my-10 rounded-lg col-12"
        rounded
        tiled
        
        exact tile
        :ripple="false"
        v-else
        v-for="({facilityName, facilityId, ccfriStatus, eceweStatus} , index) in userInfo.facilityList" :key="facilityId">
        <v-card-text>
          <v-row>
            <v-col cols="" class="col-12 col-md-8">
              <p class="text--primary"> Facility ID: {{facilityId}}</p>
              <p class="text--primary "><strong> Facility Name : {{facilityName}}</strong></p>
              <p class="text--primary"> Licence : 123456789</p>
            </v-col>
            <v-col cols="" class="d-flex align-center col-12 col-md-4"
              v-if="!showOptStatus[index]"
            >
              <p class="text--primary" >Status: {{ccfriStatus}}</p>
              <br>
              <v-btn
               @click="toggle(index)"
               :showOptStatus = "showOptStatus[index]" 
               > 
                UPDATE
              </v-btn>
            </v-col>
            <v-col v-else cols="" class="d-flex align-center col-12 col-md-4"
            >
            <p class="text--primary" >Status: {{ccfriStatus}}</p>
              <v-radio-group
                required
                row
                v-model="ccfriOptInOrOut[index]"
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
            </v-col>
          </v-row>
            
        </v-card-text>
      </v-card>
      {{ccfriOptInOrOut}}
        </LargeButtonContainer>

        <!-- TODO: Facility A to be replaced with a ref to current facility title -->
          <!-- <LargeCard
          title="Facility A" 
          subtitle="Would you like to opt-in for CCFRI?">
            <v-btn
              color="blue"
              elevation="2"
              justify="left"
              min-width="100px"
            >YES</v-btn>
            <v-btn
              color="white"
              elevation="2"
              class="ml-lg-7"
              min-width="100px"
            >No</v-btn>
          </LargeCard> -->

       <!-- <RequestForInfo></RequestForInfo> -->


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
      this.$router.push(PATHS.orgInfo); //TODO: change this, from CCOF page
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

