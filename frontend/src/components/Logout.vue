<template>
  <v-container fluid>
    <AppSimpleCard>
      <template #title>Logged Out</template>
      <template #text>
        You have Logged out.
        <br />
        <a id="login-button" :href="loginUrl" @click="clearStorage">Log In</a>
        again if you wish to continue.
      </template>
    </AppSimpleCard>
  </v-container>
</template>

<script>
import { AuthRoutes } from '@/utils/constants.js';
import { useAuthStore } from '@/store/auth.js';

import AppSimpleCard from '@/components/util/AppSimpleCard.vue';

export default {
  name: 'LogoutComponent',
  components: { AppSimpleCard },
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
  background: #d9e7d8;
}
</style>
