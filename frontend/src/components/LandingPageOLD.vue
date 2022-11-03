<!--Using this code as reference ---- will delete later ! -->

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

    <v-row>
      <v-col>
        <!-- User visting for the first time, start new application-->
        <LargeCard v-if="chosenOrg.applicationStatus=== 'NOT STARTED'"
        title="Apply for CCOF, CCFRI or ECE-WE" 
        pText="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.">
            <v-card-actions>
            </v-card-actions>     

            
            
            <v-btn
              color="yellow"
              elevation="2"
            >START APPLICATION</v-btn>
          
        </LargeCard> 

        <!-- Draft saved, application not yet submitted-->
        <LargeCard  
        v-if="chosenOrg.applicationStatus === 'DRAFT'" 
        title=" CCOF, CCFRI, ECE-WE" 
        subtitle="Status: Draft">
          <v-card-actions>
          </v-card-actions>     
            <v-btn
              color="yellow"
              elevation="2"
              justify="left"
            >CONTINUE APPLICATION</v-btn>
            <v-btn
              color="secondary"
              elevation="2"
              text
              class="ml-lg-7"
              align="left"
            >Delete Application</v-btn>
          
        </LargeCard>

         <!-- Application saved, but decision not yet made.-->
          <LargeCard v-else-if="chosenOrg.applicationStatus=== 'SUBMITTED'">
            <v-card-actions>
            </v-card-actions>

            <v-card-text>
            <p class="text-h5 text--primary">
              CCOF, CCFRI, ECE-WE SUBMITTED
            </p>
            <h2> Status: IN PROGRESS</h2> <br><br>

            <!-- TODO: This should link to the existing application once this is built out. These are just placeholders.-->
            <a href="#">CCOF Status: In Progress</a><br>
            <a href="#">CCFRI Status: In Progress</a><br>
            <a href="#">ECE-WE Status: In Progress</a><br>
          </v-card-text>
          </LargeCard>

           
      </v-col>
    </v-row>
 
     <!-- Application Approved screens starts here -->
    <v-container 
    v-if="chosenOrg.applicationStatus=== 'APPROVED'"
    class="px-10"
    >
      <v-row class="" align="stretch" justify="space-around" > 
        
          <SmallCard>
            <v-card-text class="flex">
              <p class="text-h6 text--primary">
                CCOF
              </p>
              <br>
              <a href="#">CCOF Status: Approved</a><br>
            </v-card-text>
          </SmallCard>
       
          <SmallCard>
            <v-card-text class="flex">
              <p class="text-h6 text--primary">
                Make a change to my information, parent fees, or funding agreement
              </p><br>
              <a href="#">LINK</a><br>
            </v-card-text>
          </SmallCard>
        
          <SmallCard>
            <v-card-text>
              <p class="text-h6 text--primary">
                Submit Enrolment Reports or monthly ECE-WE reports to receive payment
              </p>
              <br>
              <a href="#">LINK</a><br>
            </v-card-text>
          </SmallCard>
       
          <SmallCard>
            <v-card-text>
              <p class="text-h6 text--primary">
                Renew my funding agreement for 2022/23
              </p>
              <br>
              <a href="#">LINK</a><br>
            </v-card-text>
          </SmallCard>
      </v-row>

      <br><br>
      <v-divider>
      </v-divider>
      <br><br>

      <v-row>
        <v-col class="col-12 col-md-6">
          <!--TODO: search box only looks at facility name. Update it later to search for status and licence.-->
          <v-text-field 
            clearable="true" 
            filled="true" 
            label="Filter by facility, status, or licence: "
            v-model="input"
            :bind="input">
          </v-text-field>
          <!-- <LargeBlueButton>facility name 1</LargeBlueButton> -->
        </v-col>
      </v-row>
      
      <v-row>
        <v-card elevation="4" class="pa-4 mx-auto my-10 rounded-lg col-12 "
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
      return this.chosenOrg.facilityList.filter((fac) => fac.facilityName.toLowerCase().includes(this.input.toLowerCase()));
    },
  },
  components: { SmallCard, LargeCard, MessagesToolbar }
};
</script>

<style scoped>

body {
  white-space: pre-wrap;
}

  
</style>
