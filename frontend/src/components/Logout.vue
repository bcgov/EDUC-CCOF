<template>
  <v-container fluid class="full-height">
    <!-- login article -->
    <article name="logout-banner">
      <v-row align="center" justify="center">
        <v-col xs="10" sm="10" md="8" lg="4" xl="3">
          <v-card class="session-expired-card">
            <v-card-title class="gov-header">
              <h4 id="logout_text">Logged Out</h4>
            </v-card-title>
            <v-card-text id="logout_descriptor">
              <v-row style="margin: 0.3rem"> You have Logged out. </v-row>
              <a id="login-button" :href="logoutUrl" class="ma-1" dark color="#003366" @click="clearStorage"
                >Log In</a
              ><span>again if you wish to continue.</span>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </article>
  </v-container>
</template>

<script>
import { AuthRoutes } from '../utils/constants.js';

import { useAuthStore } from '../store/auth.js';

export default {
  name: 'LogoutComponent',

  data() {
    return {
      routes: AuthRoutes,
    };
  },
  computed: {
    logoutUrl() {
      return this.$route.query.idir === "true" ? AuthRoutes.LOGIN_IDIR : AuthRoutes.LOGIN;
    }
  },
  mounted() {
    const authStore = useAuthStore();
    authStore.setJwtToken();
  },
  methods: {
    clearStorage() {
      const authStore = useAuthStore();
      authStore.setJwtToken();
      window.sessionStorage.clear();
    },
  },
};
</script>

<style scoped>
.full-height {
  height: 100%;
}
.session-expired-card {
  margin-top: 15rem;
  width: 100%;
  background: #d9e7d8;
}
</style>
