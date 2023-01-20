<template>
  <v-container class="full-height m-16 ">
    <article id="login-banner" class="top-banner">

      <!-- This Heading bar came from the Estimator... It could be potentially broken out into a component if we want to reuse it?-->
      <v-row >
        <v-col cols="12" align="center">
          <v-img
            :src="require('../assets/images/crayons-backdrop-darkend-v2.jpg')"
            max-height="300"
            max-width="1448" >
            <v-row class=" ml-4 my-16">
              <v-col sm="10" align="left" >
              <span class="white--text" >
                <p class="text-h3"   style="font-family:BCSans;">My ChildCareBC Services</p> <br><br>
                <p class="text-h5 ">Welcome</p>
              </span>
            </v-col>
          </v-row>
          </v-img>
        </v-col>
      </v-row>

      <!-- end header-->

      <!--top row of cards-->

      <!-- containerWidth1450 is a custom css class I wrote to make the container behave in the margins... It "should" just listen to the Vuetify margins, but it wasn't and I couldn't figure out why.-->
      <v-container class="containerWidth1450 pa-0" >
      <v-row>
        <v-col class="xs-12 lg-4 xl-2 ">
          <v-divider></v-divider>
          <!-- Add height="100%" to div directly below to have the buttons line up with each other on desktop.-->
          <v-card flat class="d-flex flex-column" >
            <v-card-title class="gov-header">
              <h4 id="login_text">Use your Business BCeID</h4>
            </v-card-title>
            <v-card-text id="login_descriptor">
              Enter your user ID and password to continue.
            </v-card-text>
            <v-spacer></v-spacer>
            <v-card-actions class="mt-auto">
              <v-row >
                <v-btn id="login-button" @click="clearStorage" :href="authRoutes.LOGIN" class="ma-5" dark color='#003366'>Log In<v-icon>mdi-login</v-icon></v-btn>
              </v-row>
            </v-card-actions>
          </v-card>
      </v-col>

      <v-col class="xs-12 lg-6 xl-2">
        <v-divider></v-divider>
        <v-card flat class="d-flex flex-column">
          <v-card-title class="gov-header">
            <h4 id="login_text">Don't have a BCeID?</h4>
          </v-card-title>
          <v-card-text id="login_descriptor">
            BCeID is a user ID and password. You can use it to log into many participating government services. <br><br>
            If you have logged into other B.C. government services before, you may already have an account. <br><br>
            You must register for a Business BCeID before you can log in - it only takes a few minutes.
          </v-card-text>
          <v-card-actions>
            <v-row >
              <v-btn href="https://www.bceid.ca/register/business/getting_started/getting_started.aspx" class="ma-5" dark color='#003366'>Register for a BCeID<v-icon>mdi-login</v-icon></v-btn>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
      </v-row>

      <!--END top row of cards-->


      <!-- CCFRI Est Card-->
      <v-row >
        <v-col class="xs-12 border-top">
          <v-divider></v-divider>
          <v-card flat class="d-flex flex-column">
            <v-card-title class="gov-header">
              <h4 id="login_text">CCFRI Estimator</h4>
            </v-card-title>
            <v-card-text id="login_descriptor">
              Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. <br>
              Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. <br>
              Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.  <br>
              Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </v-card-text>
            <v-spacer></v-spacer>
            <v-card-actions>
              <v-row >
                <v-btn id="login-button" @click="toEstimator"  class="ma-5" dark color='#003366'>Go to Estimator</v-btn>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <v-divider></v-divider>
    </v-container>
      <!--END CCFRI Est Card-->

      <!-- This is where the form will go-->
      <v-row>
        
      </v-row>

    </article>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import { AuthRoutes } from '@/utils/constants';
import { PATHS } from '@/utils/constants';

export default {
  name: 'Login',
  components: {

  },
  data() {
    return {
      appTitle: process.env.VUE_APP_TITLE,
      authRoutes: AuthRoutes
    };
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated']),
  },
  methods: {
    clearStorage() {
      this.$store.commit('auth/setJwtToken');
    },
    toEstimator(){
      this.$router.push(PATHS.estimator); //TODO: change this, from CCOF page
    }
  }
};
</script>

<style scoped>
  .full-height{
    height: 100%;
  }

  .containerWidth1450{
    max-width: 1450px
  }


</style>
