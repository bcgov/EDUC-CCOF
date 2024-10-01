<template>
  <v-container class="full-height m-16 pt-0">
    <article id="login-banner" class="top-banner">
      <!-- This Heading bar came from the Estimator... It could be potentially broken out into a component if we want to reuse it?-->
      <v-row>
        <v-col cols="12" align="center" class="pt-0">
          <v-img
            :src="require('../assets/images/login-header-img-resized.jpg')"
            max-height="300"
            max-width="1448"
            class="align-end"
          >
            <v-col align="center" style="background-color: rgb(28, 115, 158, 0.85)">
              <span class="text-h4 white--text font-weight-bold" style="font-family: BCSans"
                >My ChildCareBC Services</span
              >
              <br />
              <span class="text-h6 white--text">Welcome</span>
            </v-col>
          </v-img>
        </v-col>
      </v-row>

      <!-- end header-->

      <!--top row of cards-->

      <!-- containerWidth1450 is a custom css class I wrote to make the container behave in the margins... It "should" just listen to the Vuetify margins, but it wasn't and I couldn't figure out why.-->
      <v-container class="containerWidth1450 pa-0">
        <div v-for="item in systemMessages" :key="item.messageID">
          <v-card class="elevation-0">
            <v-col class="py-2">
              <v-row class="py-0 noticeInfo" align="center">
                <v-col :cols="12" align="center" md="1">
                  <v-icon x-large class="py-1 noticeInfoIcon"> mdi-information </v-icon>
                </v-col>
                <v-col>
                  {{ item.message }}
                </v-col>
              </v-row>
            </v-col>
          </v-card>
        </div>
        <p class="pt-4">
          <strong>NOTE:</strong> The information collected through My ChildCareBC Services is collected under the
          authority of the <i>Freedom of Information and Protection of Privacy Act</i> (FOIPPA) and the
          <i>Child Care BC Act</i> (SBC 2001, c. 4) and will be used for the purpose of administering the Child Care
          Operating Funding Program, which includes the Child Care Fee Reduction Initiative and the Early Childhood
          Educator (ECE) Wage Enhancement for successfully enrolled applicants. Personal information is protected from
          unauthorized use and disclosure in accordance with FOIPPA. Any questions or concerns about the collection of
          this information can be directed to the Director, Child Care Operating Funding Program, PO Box 9965 Stn Prov
          Govt, Victoria BC V8W 9R4, Phone: in Greater Victoria: 250 356-6501, outside of Greater Victoria, Toll Free: 1
          888 338-6622 (option 2).
        </p>
        <v-row>
          <v-col class="xs-12 lg-4 xl-2">
            <v-divider></v-divider>
            <!-- Add height="100%" to div directly below to have the buttons line up with each other on desktop.-->
            <v-card flat class="d-flex flex-column">
              <v-card-title class="gov-header">
                <h4 id="login_text">Log in to My ChildCareBC Services with your primary Business BCeID</h4>
              </v-card-title>
              <v-card-text id="login_descriptor"> Enter your user ID and password to continue. </v-card-text>
              <v-spacer></v-spacer>
              <v-card-actions class="mt-auto">
                <v-row>
                  <v-btn
                    id="login-button"
                    @click="clearStorage"
                    :href="authRoutes.LOGIN"
                    class="ma-5"
                    dark
                    color="#003366"
                    >Log In<v-icon>mdi-login</v-icon></v-btn
                  >
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
                BCeID is a user ID and password. You can use it to log into many participating government services.
                <br /><br />
                If you have logged into other B.C. government services before, you may already have an account.
                <br /><br />
                You must register for a Business BCeID before you can log in - it only takes a few minutes.
              </v-card-text>
              <v-card-actions>
                <v-row>
                  <v-btn
                    href="https://www.bceid.ca/register/business/getting_started/getting_started.aspx"
                    class="ma-5"
                    dark
                    color="#003366"
                    >Register for a BCeID<v-icon>mdi-login</v-icon></v-btn
                  >
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!--END top row of cards-->

        <!-- CCFRI Est Card-->
        <v-row>
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
                  Note: <br />
                  Child care providers with a CCFRI application in process, including open applications for a mid-term
                  fee increase, will not appear in the search results. Check back as search results are updated
                  regularly.
                </p>
              </v-card-text>
              <v-spacer></v-spacer>
              <v-card-actions>
                <v-row>
                  <v-btn id="login-button" @click="toEstimator" class="ma-5" dark color="#003366"
                    >Go to Estimator</v-btn
                  >
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-divider></v-divider>
      </v-container>
      <!--END CCFRI Est Card-->

      <!-- This is where the form will go-->
      <v-row> </v-row>
    </article>
  </v-container>
</template>

<script>
import { mapState } from 'pinia';
import { useAuthStore } from '../store/auth.js';

import { AuthRoutes, PATHS, ApiRoutes } from '../utils/constants.js';
import ApiService from '../common/apiService.js';

export default {
  name: 'Login',
  components: {},
  data() {
    return {
      appTitle: process.env.VUE_APP_TITLE,
      authRoutes: AuthRoutes,
      systemMessages: [],
    };
  },
  async created() {
    this.loadSystemMessages();
  },
  computed: {
    ...mapState(useAuthStore, ['isAuthenticated']),
  },
  methods: {
    clearStorage() {
      useAuthStore().setJwtToken();
    },
    toEstimator() {
      this.$router.push(PATHS.ROOT.ESTIMATOR); //TODO: change this, from CCOF page
    },
    async loadSystemMessages() {
      let resData = await ApiService.apiAxios.get(ApiRoutes.SYSTEM_MESSAGES);
      if (resData) this.systemMessages = resData.data;
    },
  },
};
</script>

<style scoped>
.full-height {
  height: 100%;
}

.containerWidth1450 {
  max-width: 1450px;
}

.v-card__title {
  word-break: normal;
}
</style>
