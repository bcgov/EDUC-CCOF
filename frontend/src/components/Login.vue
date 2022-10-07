<template>
  <v-container fluid class="full-height px-0">
    <article id="login-banner" class="top-banner">

      <!-- This Heading bar came from the Estimator... It could be potentially broken out into a component if we want to reuse it?-->
      <v-row justify="center">
        <v-col cols="12" class="pt-0" align="center">
          <v-img
            :src="require('../assets/images/crayons-backdrop-darkend-v2.jpg')"
            max-height="300"
            max-width="1448" >
            <v-row justify="left" class="py-10">
              <v-col sm="10">
              <span class="white--text">
                <h1 class="text-h3 pt-10" style="font-family:BCSans;">My ChildCare Services</h1>
                <p class="text-h5 pt-4">Welcome</p>
              </span>
            </v-col>
          </v-row>
          </v-img>
        </v-col>
      </v-row>


      <v-row align="left" justify="center">
        <v-card class="login-card rounded-0">
          <v-card-title class="gov-header">
            <h4 id="login_text">Use your Business BCeID</h4>
          </v-card-title>
          <v-card-text id="login_descriptor">
            Enter your user ID and password to continue.
          </v-card-text>
          <v-card-actions>
            <v-row align="center" justify="center">
              <v-btn id="login-button" @click="clearStorage" :href="authRoutes.LOGIN_IDIR" class="ma-2" dark color='#003366'>Log In<v-icon>mdi-login</v-icon></v-btn>
            </v-row>
          </v-card-actions>
        </v-card>

        <v-card class="rounded-0">
          <v-card-title class="gov-header">
            <h4 id="login_text">Don't have a BCeID?</h4>
          </v-card-title>
          <v-card-text id="login_descriptor">
            BCeID is a user ID and password. You can use it to log into many participating government services. <br><br>
            If you have logged into other B.C. government services before, you may already have an account. <br><br>
            You must register for a Business BCeID before you can log in - it only takes a few minutes.<br><br>
          </v-card-text>
          <v-card-actions>
            <v-row align="center" justify="center">
              <!--this button should be changed to route to the bc gov eID webshite-->
              <v-btn href="https://www.bceid.ca/register/business/getting_started/getting_started.aspx" class="ma-2" dark color='#003366'>Register for a BCeID<v-icon>mdi-login</v-icon></v-btn>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-row>

      <v-row align="left" justify="center">
        <v-card>
          <v-card-title class="gov-header">
            <h4 id="login_text">CCFRI Estimator</h4>
          </v-card-title>
          <v-card-text id="login_descriptor">
            Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. <br>
            Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. <br>
            Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.  <br>
            Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

          </v-card-text>
          <v-card-actions>
            <v-row align="center" justify="center">
              <v-btn id="login-button" @click="clearStorage" :href="authRoutes.LOGIN_IDIR" class="ma-2" dark color='#003366'>Go to Estimator</v-btn>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-row>


    </article>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import { AuthRoutes } from '@/utils/constants';

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
    }
  }
};
</script>

<style scoped>
  .full-height{
    height: 100%;
  }
</style>
