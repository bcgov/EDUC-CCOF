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
  </v-container>
</v-container>
  
</template>
<script>

import { mapGetters} from 'vuex';
import SmallCard from './guiComponents/SmallCard.vue';
import LargeCard from './guiComponents/LargeCard.vue';
import MessagesToolbar from './guiComponents/MessagesToolbar.vue';

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
      input : ''
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
    }
  },
  components: { SmallCard, MessagesToolbar }
};
</script>

<style scoped>

body {
  white-space: pre-wrap;
}

  
</style>
