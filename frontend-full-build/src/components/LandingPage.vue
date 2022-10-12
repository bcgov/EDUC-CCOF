<template>
  <v-container>
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
      <v-col cols="12" >
        
        <!-- Currently just the text is re-rendered based on bool values of the user's application. These values are found in 
        backend / components /user.js.
        This is only for the first 3 scenarios where the application is not approved yet. Options are : Start application, continue draft, pending

        I did it this way to reduce lines of code. Now it's just one card with text that changes. Perhaps with routing, we will need to change this?
        -->
        <v-card  elevation="4" class="pa-4 mx-auto rounded-lg"
          max-width="950"
          min-height="270"
          rounded
          tiled
          :to="userInfo.organizationList.length > 1 ?'/organization' : 'error-page'" exact tile
          :ripple="false"
          >
            <v-card-actions>
            </v-card-actions>     

          <!-- Draft saved, application not yet submitted-->
          <v-card-text v-if="userInfo.organizationList[0].isDraft">
            <p class="text-h5 text--primary">
              CCOF, CCFRI, ECE-WE
            </p>
            <h2> Status: Draft</h2> <br><br>
            <v-btn
              color="yellow"
              elevation="2"
            >CONTINUE APPLICATION</v-btn>
            <v-btn
              color="secondary"
              elevation="2"
              text
              class="ml-7"
            >Delete Application</v-btn>
          </v-card-text>

          <!-- Application saved, but decision not yet made.-->
          <v-card-text v-else-if="userInfo.organizationList[0].applicationSubmitted">
            <p class="text-h5 text--primary">
              CCOF, CCFRI, ECE-WE SUBMITTED
            </p>
            <h2> Status: IN PROGRESS</h2> <br><br>

            <!-- TODO: This should link to the existing application once this is built out. These are just placeholders.-->
            <a href="#">CCOF Status: In Progress</a><br>
            <a href="#">CCFRI Status: In Progress</a><br>
            <a href="#">ECE-WE Status: In Progress</a><br>
          </v-card-text>

          <!-- User visting for the first time, start new application-->
          <v-card-text v-else>
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
        </v-card>


        <!-- Application Approved screen starts here -->



        <!-- <v-card elevation="4" class="pa-4 mx-auto rounded-lg"
          max-width="450"
          min-height="270"
          rounded
          tiled
          :to="userInfo.organizationList.length > 1 ?'/organization' : 'error-page'" exact tile
          :ripple="false"
          >
          <v-card-text>
            <p class="text-h5 text--primary">
              Renew my funding Agreement for 20{{currentYearTwoDigit}}/{{nextYearTwoDigit}}
            </p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6">
        <v-card elevation="4" class="pa-4 mx-auto rounded-lg"
          max-width="450"
          min-height="270"
          rounded
          tiled
          :to="userInfo.organizationList.length > 1 ?'/organization' : 'error-page'" exact tile
          :ripple="false"
          >
          <v-card-text>
            <p class="text-h5 text--primary">
              Make a change to my information, parent fees, or funding agreement
            </p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card elevation="4" class="pa-4 mx-auto rounded-lg"
          max-width="450"
          min-height="270"
          rounded
          tiled
          :to="userInfo.organizationList.length > 1 ?'/organization' : 'error-page'" exact tile
          :ripple="false"
          >
          <v-card-text>
            <p class="text-h5 text--primary">
              Submit my Enrollment Reports or monthly ECE-WE reports to receive payment
            </p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </v-card-text>
        </v-card> -->
      </v-col>
    </v-row>

  </v-container>
</template>
<script>

import { mapGetters} from 'vuex';


console.log("hey");
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
    }
  },
};
</script>

<style scoped>
</style>
