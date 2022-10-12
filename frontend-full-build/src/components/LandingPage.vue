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
        
        <v-card v-if="userInfo.organizationList[0].isDraft" elevation="4" class="pa-4 mx-auto rounded-lg"
          max-width="950"
          min-height="270"
          rounded
          tiled
          :to="userInfo.organizationList.length > 1 ?'/organization' : 'error-page'" exact tile
          :ripple="false"
          >
            <v-card-actions>

            </v-card-actions>          
          <v-card-text>
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
        </v-card>


        <v-card v-if="userInfo.organizationList[0].applicationSubmitted" elevation="4" class="pa-4 mx-auto rounded-lg"
          max-width="950"
          min-height="270"
          rounded
          tiled
          :to="userInfo.organizationList.length > 1 ?'/organization' : 'error-page'" exact tile
          :ripple="false"
          >
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
        </v-card>

        <v-card v-else elevation="4" class="pa-4 mx-auto rounded-lg"
          max-width="950"
          min-height="270"
          rounded
          tiled
          :to="userInfo.organizationList.length > 1 ?'/organization' : 'error-page'" exact tile
          :ripple="false"
          >
            <v-card-actions>

            </v-card-actions>          
          <v-card-text>
            <p class="text-h5 text--primary">
              Apply for CCOF, CCFRI or ECE-WE
            </p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <p> {{userInfo.organizationList[0].isDraft}}</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">

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
