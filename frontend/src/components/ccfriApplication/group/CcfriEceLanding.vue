<template>
    <v-container>
        <div>
            <MessagesToolbar></MessagesToolbar>
        </div>
        <br><br>
        <v-row justify="space-around">
        
          <SmallCard title="Add a New Facility to my Organization" disabled="true">
              <br>
              <a href="#">LINK</a><br>
          </SmallCard>
       
          <SmallCard title="Apply for CCFRI and ECE-WE">
              <br>
              <a href="#">LINK</a><br>
          </SmallCard>
        
      </v-row>

        <!-- <LargeButtonContainer>
            <v-list-item v-for="({facilityName, facilityId}) in chosenOrg" :key="facilityId">
                <LargeBlueButton >{{facilityName}}</LargeBlueButton>
            </v-list-item>
        </LargeButtonContainer>    -->



        <LargeButtonContainer>
        <v-card elevation="4" class="pa-2 mx-auto my-10 rounded-lg col-12"
        rounded
        tiled
        
        exact tile
        :ripple="false"
        v-for="({facilityName, facilityId, ccfriStatus, eceweStatus} , index) in allFacilities" :key="facilityId">
        <v-card-text>
          <v-row>
            <v-col cols="" class="col-12 col-md-8">
            <p class="text--primary"> Facility ID: {{facilityId}}</p>
            <p class="text--primary "><strong> Facility Name : ABC daycare Time {{facilityName}}</strong></p>
            <p class="text--primary"> Licence : 123456789</p>
            </v-col>
            <v-col v-if="showOptStatus[index]" cols="" class="d-flex align-center col-12 col-md-4">
              <p class="text--primary" >Status: Opt-IN CCFRI</p>
              <v-btn @click="toggle(index)"> UPDATE</v-btn>
            </v-col>
            <v-col  v-else cols="" class="d-flex align-center col-12 col-md-4">
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

        
          <AddNewFees></AddNewFees>
        


          <!-- <LargeCard title="hi" :class="{'blueBorder':true}">
            hi
          </LargeCard> -->

          

        <v-btn>
          Back
        </v-btn>


    </v-container>
</template>

<script>


import { mapGetters} from 'vuex';
import SmallCard from '../../guiComponents/SmallCard.vue';
import MessagesToolbar from '../../guiComponents/MessagesToolbar.vue';
import LargeBlueButton from '../../guiComponents/LargeBlueButton.vue';
import LargeButtonContainer from '../../guiComponents/LargeButtonContainer.vue';
import LargeCard from '../../guiComponents/LargeCard.vue';
import ExistingFacilityFees from './ExistingFacilityFees.vue';
import AddNewFees from './AddNewFees.vue';
import RequestForInfo from './RequestForInfo.vue';

export default {
  name: 'CcfriLandingPage',
  data() {
    return {
      input : '',
      showOptStatus : [true,true],
      ccfriOptInOrOut : [],
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
      //TODO: This is hardcoded to the first org in the list. This should be updated with a state var from a chosen org from an earlier screen.
      return this.userInfo;
    },
    allFacilities(){
      return this.chosenOrg.facilityList;
    }
  },
  methods: {
    toggle(index) {
      this.showOptStatus[index] = this.showOptStatus[index] ? false : true;
    },
  },
  components: { SmallCard, MessagesToolbar, LargeBlueButton, LargeButtonContainer, LargeCard, ExistingFacilityFees, AddNewFees, RequestForInfo }
};
</script>

<style scoped>

body {
white-space: pre-wrap;
}


</style>

