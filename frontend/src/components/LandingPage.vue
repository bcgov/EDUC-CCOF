<template>
  <v-container>
    <div v-if ="userInfo.unreadMessages">
      <MessagesToolbar></MessagesToolbar>
    </div>
    <v-row justify="center">
      <div
        class="pa-10"
        :class="'text-h4'"
        v-text="'What would you like to do?'" />

        <v-btn @click="goToCCFRI()">CCFRI</v-btn>
        <v-btn @click="goToRFI()">RFI</v-btn>
    </v-row >
     <!-- Application Approved screens starts here -->
    <v-container 
    class="px-10"
    >
      <v-row class="" align="stretch" justify="space-around" > 
        <!-- TODO: FIX THIS: Now that the buttons are aligning nice to the bottom of card, they sometimes overflow when shrinking the screensize.-->
          <SmallCard title="Apply for Child Care Operating Funding (CCOF)" :disable=false>
              <br><br>
              <v-btn absolute bottom  class="" dark color='#003366' v-if="userInfo.applicationStatus === null" @click="newApplication()">Start Application</v-btn>
              <v-btn absolute bottom class="" dark color='#003366' v-else-if="userInfo.applicationStatus === 'DRAFT'" @click="continueApplication()">Continue Application</v-btn>
              <p v-else> Status: {{userInfo.applicationStatus}}</p> <!--TODO: pull the status from the api so will show in progress or approved-->
          </SmallCard>
          <SmallCard :title="`Renew my funding agreement for ${this.futureYearLabel}`" :disable=getApplicationStatus>
              <br>
              <v-btn absolute bottom class="" dark color='#003366' @click="renewApplication()">Renew my funding</v-btn>
          </SmallCard>
          <SmallCard  title="Make a change to my information, parent fees, or funding agreement" :disable=getApplicationStatus>
            <br>
            <v-btn  absolute bottom  class="" dark color='#003366'>Make a change</v-btn>
          </SmallCard>
          <SmallCard title="Submit Enrolment Reports or monthly ECE-WE reports to receive payment" :disable=getApplicationStatus>
              <br>
              <v-btn absolute bottom class="" dark color='#003366'>Submit reports</v-btn>
          </SmallCard>
      </v-row>

      <br><br>
      <v-divider>
      </v-divider>
      <br><br>
        <v-row v-if="navBarList.length > 2">
        <v-col class="col-12 col-md-6 ml-xl-3">
          <!--TODO: sezarch box only looks at facility name. Update it later to search for status and licence
            Update when data comes in from the API 
            Filter by Facility Name, status, or licence: "
            .-->
          <v-text-field 
            clearable
            filled 
            label="Filter by Facility Name "
            v-model="input"
            :bind="input">
          </v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-card elevation="6" class="pa-4 mx-auto my-10 rounded-lg col-12 col-xl-5 blueBorder"
          min-height="230"
          rounded
          tiled
          exact tile
          :ripple="false"
          v-for="({facilityName, facilityId, ccfriStatus, eceweStatus}  ) in filteredList" :key="facilityId"
          
          >
            <v-card-text>
              <!-- <p class="text-h5 text--primary">
                Facility {{index +1}}
              </p> -->
              <p class="text-h5 text--primary">
                Facility Name:  {{facilityName}}
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </p>
              <br>
              <br>
              <p class="text--primary">Child Care Fee Reduction Initiative (CCFRI) Status: <strong>{{ccfriStatus}} </strong> </p><br>
              <p class="text--primary">Early Childhood Educator Wage Enhancement (ECE-WE) Status: <strong>{{eceweStatus}} </strong></p>
            </v-card-text>
        </v-card>
      </v-row>
  </v-container>
</v-container>
  
</template>
<script>

import { mapGetters, mapState, mapMutations} from 'vuex';
import SmallCard from './guiComponents/SmallCard.vue';
import MessagesToolbar from './guiComponents/MessagesToolbar.vue';
import { PATHS } from '@/utils/constants';

export default {
  name: 'LandingPage',
  data() {
    return {
      input: '',
      PATHS: PATHS,
      results : {},
      
    };
  },
  computed: {
    ...mapGetters('auth', ['userInfo']),
    ...mapGetters('app', ['futureYearLabel']),
    ...mapState('app', ['navBarList']),
    filteredList() {
      if (this.input === '' || this.input === ' ' || this.input === null){
        return this.navBarList;
      }
      return this.navBarList.filter((fac) => fac.facilityName.toLowerCase().includes(this.input.toLowerCase()));
    },
    getApplicationStatus(){
      return this.userInfo.applicationStatus === null;
    },
    
  },
  methods: {
    ...mapMutations('app', ['setIsRenewal']),
    clicked (){
      console.log('clicked');
      return '';
    },
    renewApplication() {
      this.setIsRenewal(true);
      this.$router.push(PATHS.group.renewOrganization);
    },
    newApplication() {
      this.setIsRenewal(false);
      this.$router.push(PATHS.selectApplicationType);
    },
    continueApplication() {
      this.setIsRenewal(false);
      this.$router.push(PATHS.group.orgInfo);
    } ,
    goToRFI(){
      this.$router.push(PATHS.ccfriRequestMoreInfo);
    },
    goToCCFRI() {
      this.$router.push(PATHS.ccfriHome); //TODO: change this, from CCOF page
    },   
  },
  

  components: { SmallCard, MessagesToolbar}
};
</script>

<style scoped>

.blueBorder{
  border-top: 5px solid #003366 !important;
}

  
</style>
