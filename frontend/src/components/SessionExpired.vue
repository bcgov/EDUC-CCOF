<template>
  <v-container fluid class="full-height">
    <!-- login article -->
    <article name="session-expired-banner" class="top-banner">
      <v-row align="center" justify="center">
        <v-col xs="10" sm="10" md="8" lg="4" xl="3">
          <v-card class="session-expired-card">
            <v-card-title class="gov-header">
              <h4 id="session-expired-text">Session Expired</h4>
            </v-card-title>
            <v-card-text id="session-expired-descriptor">
              <v-row style="margin: 0.3rem"> Your secure session has ended as a result of inactivity. </v-row>
              <a id="login-button" :href="routes.LOGIN" class="ma-1" dark color="#003366" @click="clearStorage"
                >Log In</a
              ><span>again to continue.</span>
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
  name: 'SessionExpired',

  data() {
    return {
      routes: AuthRoutes,
    };
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
  background: #f2e8d5;
}

@media screen and (max-width: 300px) {
  .session-expired-card {
    margin-top: 2rem;
    height: 50%;
    width: 100%;
    background: #f2e8d5;
  }
}
@media screen and (min-width: 301px) and (max-width: 350px) {
  .session-expired-card {
    margin-top: 1rem;
    width: 100%;
    background: #f2e8d5;
  }
}
@media screen and (min-width: 351px) and (max-width: 450px) {
  .session-expired-card {
    margin-top: 8rem;
    width: 100%;
    background: #f2e8d5;
  }
}
</style>
