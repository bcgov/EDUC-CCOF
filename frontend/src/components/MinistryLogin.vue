<template>
  <v-container class="full-height m-16 pt-0">
    <article id="login-banner" class="top-banner">

      <!-- This Heading bar came from the Estimator... It could be potentially broken out into a component if we want to reuse it?-->
      <v-row >
        <v-col cols="12" align="center" class="pt-0">
          <v-img
            :src="require('../assets/images/login-header-img-resized.jpg')"
            max-height="300"
            max-width="1448"
            class="align-end">
            <v-col align="center" style="background-color: rgb(28, 115, 158, 0.85);">
              <span class="text-h4 white--text font-weight-bold" style="font-family:BCSans;">My ChildCareBC Services</span>
              <br>
              <span class="text-h6 white--text">Ministry Login</span>
            </v-col>
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
          <v-card flat class="d-flex flex-column" >
            <v-card-title class="gov-header">
              <h4 id="login_text">Use your IDIR Account</h4>
            </v-card-title>
            <v-card-text id="login_descriptor">
              Enter your user ID and password to continue.
            </v-card-text>
            <v-spacer></v-spacer>
            <v-card-actions class="mt-auto">
              <v-row >
                <v-btn id="login-button" @click="clearStorage" :href="authRoutes.LOGIN_IDIR" class="ma-5" dark color='#003366'>Log In<v-icon>mdi-login</v-icon></v-btn>
              </v-row>
            </v-card-actions>
          </v-card>
      </v-col>

      <v-col class="xs-12 lg-6 xl-2">
        <v-divider></v-divider>
        <v-card flat class="d-flex flex-column">
          <v-card-title class="gov-header">
            <h4 id="login_text">Ministry Login</h4>
          </v-card-title>
          <v-card-text id="login_descriptor">
            This login is for Ministry users only.
            You must be authorized to use this login.
          </v-card-text>
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
            <v-card-text id="login_descriptor" class="pb-0">
              <p>
                The ministry has made enhancements to the
                <a href="https://mychildcareservices.gov.bc.ca/ccfri-estimator">CCFRI Estimator</a>
                to help estimate additional child care fee savings that started on December 1, 2022.
              </p>
              <p>
                Note: <br>
                Child care providers with a CCFRI application in process, including open applications for a mid-term fee increase,
                will not appear in the search results. Check back as search results are updated regularly.
              </p>
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
import { AuthRoutes, PATHS } from '@/utils/constants';

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
      this.$router.push(PATHS.ROOT.ESTIMATOR);
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
