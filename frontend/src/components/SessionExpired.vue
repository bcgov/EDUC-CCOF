<template>
  <v-container fluid>
    <AppSimpleCard>
      <template #title>Session Expired</template>
      <template #text>
        Your secure session has ended as a result of inactivity.
        <br />
        <a id="login-button" :href="loginUrl" @click="clearStorage">Log In</a>
        again to continue.
      </template>
    </AppSimpleCard>
  </v-container>
</template>

<script>
import { AuthRoutes } from '@/utils/constants.js';

import { useAuthStore } from '@/store/auth.js';

import AppSimpleCard from '@/components/util/AppSimpleCard.vue';

export default {
  name: 'SessionExpired',
  components: {
    AppSimpleCard,
  },
  data() {
    return {
      routes: AuthRoutes,
    };
  },
  computed: {
    loginUrl() {
      return this.$route.query.idir === 'true' ? AuthRoutes.LOGIN_IDIR : AuthRoutes.LOGIN;
    },
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
