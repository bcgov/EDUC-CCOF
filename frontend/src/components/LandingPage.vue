<template>
  <v-container>
    <div v-if ="chosenOrg.unreadMessages">
      <MessagesToolbar></MessagesToolbar>
    </div>
    <v-row justify="center">
      <div
        class="pa-10"
        :class="'text-h4'"
        v-text="'What would you like to do?'" />
    </v-row >
    <v-row>
      <v-divider class="mx-16"/>
    </v-row>

     <!-- Application Approved screens starts here -->
    <v-container 
    class="px-10"
    >
      <v-row class="" align="stretch" justify="space-around" > 
        <!-- TODO: FIX THIS: Now that the buttons are aligning nice to the bottom of card, they sometimes overflow when shrinking the screensize.-->
          <SmallCard title="Apply for Child Care Operating Funding (CCOF)" :disable=false>
              <br><br>
              <v-btn absolute bottom  class="" dark color='#003366' v-if="chosenOrg.applicationStatus === 'NOT STARTED'">Start Application</v-btn>
              <v-btn absolute bottom class="" dark color='#003366' v-else-if="chosenOrg.applicationStatus === 'DRAFT'">Continue Application</v-btn>
              <p v-else> Status: {{chosenOrg.applicationStatus}}</p> <!--TODO: pull the status from the api so will show in progress or approved-->
          </SmallCard>
       
          <SmallCard  title="Make a change to my information, parent fees, or funding agreement" :disable=getApplicationStatus>
            <br>
            <v-btn  absolute bottom  class="" dark color='#003366'>Make a change</v-btn>
          </SmallCard>
        
          <SmallCard title="Submit Enrolment Reports or monthly ECE-WE reports to receive payment" :disable=getApplicationStatus>
              <br>
              <v-btn absolute bottom class="" dark color='#003366'>Submit reports</v-btn>
          </SmallCard>
       
          <SmallCard title="Renew my funding agreement for 2022/23" :disable=getApplicationStatus>
              <br>
              <v-btn absolute bottom class="" dark color='#003366'>Renew my funding</v-btn>
          </SmallCard>
      </v-row>

      <br><br>
      <v-divider>
      </v-divider>
      <br><br>

     
      <v-row v-if=" !getApplicationStatus">
        <v-row>
        <v-col class="col-12 col-md-6">
          <!--TODO: sezarch box only looks at facility name. Update it later to search for status and licence.-->
          <v-text-field 
            clearable
            filled 
            label="Filter by facility, status, or licence: "
            v-model="input"
            :bind="input">
          </v-text-field>
        </v-col>
      </v-row>

        <v-card elevation="6" class="pa-4 mx-auto my-10 rounded-lg col-12 "
          min-height="230"
          rounded
          tiled
          :to="userInfo.organizationList.length > 1 ?'/organization' : 'error-page'" exact tile
          :ripple="false"
          v-for="({facilityName, facilityId} , index) in filteredList" :key="facilityId"
          
          >
            <v-card-text>
              <p class="text-h5 text--primary">
                Facility {{index +1}}
              </p>
              <p class="text-h6 text--primary">
                Facility Name:  {{facilityName}}
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <br>
              <p class="text-h5 text--primary">CCFRI, ECE-WE</p>
              <a href="#">CCFRI Status: Approved</a><br>
              <a href="#">ECE-WE Status: In Progress</a><br><br>
            </v-card-text>
        </v-card>
      </v-row>


      <LargeCard>
        Hello there, {{getDisplayName}} <br><br>
        guid is: {{getBusinessGuid}}<br><br>
        {{results}}
       <v-btn v-on:click="getUserProfile"> ....</v-btn>
      </LargeCard>


      <LargeBlueButton></LargeBlueButton>
      <LargeButtonContainer>
        <v-card elevation="4" class="pa-2 mx-auto rounded-lg col-12"
        rounded
        tiled
        
        exact tile
        :ripple="false">
        <v-card-text>
          <v-row>
            <v-col cols="" class="col-12 col-md-8">
            <p class="text--primary"> Facility ID: 0000-0000-0000-0000</p>
            <p class="text--primary "><strong> Facility Name : ABC daycare Time </strong></p>
            <p class="text--primary"> Licence : 123456789</p>
            </v-col>
            <v-col cols="" class="d-flex align-center col-12 col-md-4">
              <p class="text--primary">Status: Opt-IN CCFRI</p>
              <v-btn> UPDATE</v-btn>
            </v-col>
          </v-row>
            
        </v-card-text>
      </v-card>
      </LargeButtonContainer>
  </v-container>
</v-container>
  
</template>
<script>

import { mapGetters} from 'vuex';
import SmallCard from './guiComponents/SmallCard.vue';
// import LargeCard from './guiComponents/LargeCard.vue';
import MessagesToolbar from './guiComponents/MessagesToolbar.vue';


import axios from 'axios';
import LargeCard from './guiComponents/LargeCard.vue';
import LargeButtonContainer from './guiComponents/LargeButtonContainer.vue';
import LargeBlueButton from './guiComponents/LargeBlueButton.vue';

import ApiService from '@/common/apiService';

export default {
  name: 'LandingPage',
  props: {
    currentYear: {
      type: Number,
      default: 2023,
      required: false,
    },
  },
  data() {
    return {
      input : '',
      results : {},
    };
  },
  computed: {
    ...mapGetters('auth', ['userInfo']),
    currentYearTwoDigit() {
      return this.currentYear - 2000;
    },
    nextYearTwoDigit() {
      return this.currentYear - 1999;
    },
    getDisplayName(){
      return this.userInfo.displayName;
    },
    getBusinessGuid(){
      return this.userInfo.businessGuid;
    },

    chosenOrg(){
      //TODO: This is hardcoded to the first org in the list. This should be updated with a state var from a chosen org from an earlier screen.
      return this.userInfo.organizationList[0];
    },
    filteredList() {
      if (this.input === '' || this.input === ' '){
        return this.chosenOrg.facilityList;
      }
      return this.chosenOrg.facilityList.filter((fac) => fac.facilityName.toLowerCase().includes(this.input.toLowerCase()));
    },
    getApplicationStatus(){
      if (this.chosenOrg.applicationStatus === 'APPROVED'){
        //false because if the application is approved, we will want to set all the disabled status to false)
        return false;
      }
      return true;
    },
    
  },
  methods: {
    async getUserProfile () {
      console.log('clicked');
      try {
        this.results = ( await ApiService.apiAxios.get('/api/profile/userProfile'));
        console.log('RESULTS are:  = '+ this.results);
      } catch (error) {
        console.log(error);
      }
    },
    clicked (){
      console.log('clicked');
      return '';
    }
  },
  
  components: { SmallCard, MessagesToolbar, LargeCard, LargeButtonContainer, LargeBlueButton }
};
</script>

<style scoped>

body {
  white-space: pre-wrap;
}

  
</style>
