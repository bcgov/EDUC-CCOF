<template>
  <div style="display: none">
    <a id="logout_href" :href='routes.SESSION_EXPIRED'/>
  </div>
</template>

<script>
import { useAuthStore } from '../store/auth.js';
import {AuthRoutes} from '../utils/constants.js';

export default {
  name: 'BackendSessionExpired',
  data() {
    return {
      routes: AuthRoutes
    };
  },
  mounted() {
    window.location = document.getElementById('logout_href').href;
  },
  methods: {
    logout() {
      const authStore = useAuthStore();
      authStore.setJwtToken();
    }
  }
};
</script>

<style scoped>

</style>
