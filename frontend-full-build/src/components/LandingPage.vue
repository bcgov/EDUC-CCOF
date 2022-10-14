<template>
  <v-container>
    <v-toolbar 
      v-if="userInfo.organizationList[0].unreadMessages"
      color="green"
      justify="center"
    >
      <v-toolbar-title class="flex text-center" >
        <h3>Action Required: New Messages</h3>
      </v-toolbar-title >
    </v-toolbar>
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
        <!-- Draft saved, application not yet submitted-->
        <LargeCard  v-if="userInfo.organizationList[0].applicationStatus=== 'DRAFT'" >
          <v-card-actions>
          </v-card-actions>     

          <v-card-text >
            <p class="text-h5 text--primary">
              CCOF, CCFRI, ECE-WE
            </p>
            <h2> Status: Draft</h2> <br><br>
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
          </v-card-text>
        </LargeCard>

         <!-- Application saved, but decision not yet made.-->
          <LargeCard v-else-if="userInfo.organizationList[0].applicationStatus=== 'SUBMITTED'">
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

          <!-- User visting for the first time, start new application-->
          <LargeCard v-else-if="userInfo.organizationList[0].applicationStatus=== 'NOT STARTED'">        >
            <v-card-actions>
            </v-card-actions>     

            <v-card-text class="flex">
            <p class="text-h5 text--primary">
              Apply for CCOF, CCFRI or ECE-WE
            </p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            
            <br><br>
            <v-btn
              color="yellow"
              elevation="2"
            >START APPLICATION</v-btn>
          </v-card-text>
        </LargeCard>  
      </v-col>
    </v-row>
 
     <!-- Application Approved screens starts here -->
    <v-container 
    v-if="userInfo.organizationList[0].applicationStatus=== 'APPROVED'"
    class="px-10"
    >
      <v-row class="" align="stretch"> 
        <v-col class="col-md-3 col-12 d-flex flex-column flex "> 
          <SmallCard>
            <v-card-text class="flex">
              <p class="text-h6 text--primary">
                CCOF 
              </p>
              <br>
              <a href="#">CCOF Status: Approved</a><br>
            </v-card-text>
          </SmallCard>
        </v-col>

        <v-col class="col-md-3 col-12 d-flex flex-column"> 
          <SmallCard>
            <v-card-text class="flex">
              <p class="text-h6 text--primary">
                Make a change to my information, parent fees, or funding agreement
              </p><br>
              <a href="#">LINK</a><br>
            </v-card-text>
          </SmallCard>
        </v-col>

        <v-col class="col-md-3 col-12 d-flex flex-column"> 
          <SmallCard>
            <v-card-text>
              <p class="text-h6 text--primary">
                Submit Enrolment Reports or monthly ECE-WE reports to receive payment
              </p>
              <br>
              <a href="#">LINK</a><br>
            </v-card-text>
          </SmallCard>
        </v-col>

        <v-col class="col-md-3 col-12 d-flex flex-column"> 
          <SmallCard>
            <v-card-text>
              <p class="text-h6 text--primary">
                Renew my funding agreement for 2022/23
              </p>
              <br>
              <a href="#">LINK</a><br>
            </v-card-text>
          </SmallCard>
        </v-col>
      </v-row>

      <br><br>
      <v-divider>
      </v-divider>
      <br><br>

      <v-row>
        <v-col class="col-12 col-md-6">
          <!--TODO: make this search box actually do something-->
          <v-text-field 
            clearable="true" 
            filled="true" 
            label="Filter by facility, status, or licence: "
            v-model="input">
          </v-text-field>
        </v-col>
      </v-row>
      
      <v-row>
        <!-- <v-col cols="12"> -->
          <v-card elevation="4" class="pa-4 mx-auto my-10 rounded-lg col-12 "
            min-height="230"
            rounded
            tiled
            :to="userInfo.organizationList.length > 1 ?'/organization' : 'error-page'" exact tile
            :ripple="false"
            v-for="({facilityName, facilityId} , index) in userInfo.organizationList[0].facilityList" :key="facilityId"
            >
              <v-card-text>
                <p class="text-h5 text--primary">
                  Facility {{index +1}}
                </p>
                <p class="text-h6 text--primary">
                  Facility Name:  {{facilityName}}
                </p>
                <!-- <p class="text-h6 text--primary">
                  Facility ID:  {{facilityId}}
                </p> -->
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <br>
                <p class="text-h5 text--primary">CCFRI, ECE-WE</p>
                <a href="#">CCFRI Status: Approved</a><br>
                <a href="#">ECE-WE Status: In Progress</a><br><br>
              </v-card-text>
          </v-card>
        <!-- </v-col> -->
      </v-row>
    </v-container>
  </v-container>
  
</template>
<script>

import { mapGetters} from 'vuex';
import { ref } from 'vue';
import SmallCard from './guiComponents/SmallCard.vue';
import LargeCard from './guiComponents/LargeCard.vue';
//let input = ref('');

//const orgList = userInfo.organizationList[0];

//console.log(getUserInfo())

export default {
  name: 'LandingPage',
  props: {
    currentYear: {
      type: Number,
      default: 2023,
      required: false,
    },
  },
  computed: {
    ...mapGetters('auth', ['userInfo']),
    currentYearTwoDigit() {
      return this.currentYear - 2000;
    },
    nextYearTwoDigit() {
      return this.currentYear - 1999;
    },
    // filteredList() {
    //   console.log(input);
    //   return orgList.filter((facility) => {
    //     return facility.toLowerCase().includes(input.value.toLowerCase());
    //   });
    // },
  },
  components: { SmallCard, LargeCard }
};
</script>

<style scoped>

body {
  white-space: pre-wrap;
}

  
</style>
