<template>
  <v-container>
    <div style="display: none">
      <a id="logout_href" :href="routes.SESSION_EXPIRED" />
    </div>
    <v-dialog v-model="dialog" persistent max-width="525px">
      <v-card>
        <v-container class="pt-0">
          <v-row>
            <v-col cols="7" class="py-0 pl-0" style="background-color: #234075">
              <v-card-title class="white--text">Session Time-out</v-card-title>
            </v-col>
            <v-col cols="5" class="d-flex justify-end" style="background-color: #234075"> </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" style="background-color: #ffc72c; padding: 2px"></v-col>
          </v-row>
          <v-row>
            <v-col cols="12" style="text-align: center">
              <p class="pt-4">
                Due to inactivity, you will be logged out of your current session in {{ logoutCounter }} seconds. Please
                click on the "Stay logged in" button to continue with this session.
              </p>
              <p><v-btn color="primary" @click="clicked()">Stay logged in</v-btn></p>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import { useAuthStore } from '../store/auth.js';
import { useAppStore } from '../store/app.js';

import { AuthRoutes } from '../utils/constants.js';
import ApiService from '../common/apiService.js';

function getTokenExpiredTime(jwtToken) {
  const now = Date.now().valueOf();
  const jwtPayload = jwtToken.split('.')[1];
  const payload = JSON.parse(window.atob(jwtPayload));
  // console.log(`getTokenExpiredTime: [${payload.exp}], with now: [${now}], token expire time is [${((payload.exp * 1000) - now )}]`);
  return payload.exp * 1000 - now;
}

export default {
  data() {
    return {
      routes: AuthRoutes,
      dialog: false,
    };
  },
  async mounted() {
    await this.checkAndLogoutUserOnSessionExpiry();
  },
  computed: {
    ...mapState(useAuthStore, ['isAuthenticated', 'jwtToken']),
    ...mapState(useAppStore, ['logoutCounter']),
  },
  methods: {
    ...mapActions(useAuthStore, ['getJwtToken']),
    ...mapActions(useAppStore, ['startCounter', 'stopCounter']),
    async checkAndLogoutUserOnSessionExpiry() {
      if (this.isAuthenticated) {
        try {
          const response = await ApiService.apiAxios.get(AuthRoutes.SESSION_REMAINING_TIME);
          if (response.data > 0) {
            let timeOutValue = parseInt(response.data); // add 200 ms
            const tokenExpire = getTokenExpiredTime(this.jwtToken);
            console.log('remaining time - timeout: ', timeOutValue);
            console.log('token expire - timeout: ', tokenExpire);
            if (timeOutValue > tokenExpire) {
              timeOutValue = tokenExpire;
              console.log(`Using token expire time of [${timeOutValue}]`);
            } else {
              console.log(`Using session expire time of [${timeOutValue}]`);
            }

            if (timeOutValue < 190000) {
              this.showDialog();
            } else {
              setTimeout(() => {
                this.checkAndLogoutUserOnSessionExpiry();
              }, timeOutValue - 180000);
            }
          } else {
            window.location = document.getElementById('logout_href').href;
          }
        } catch (e) {
          window.location = document.getElementById('logout_href').href;
        }
      }
    },
    async clicked() {
      this.stopCounter();
      // this.startCounter();

      this.dialog = false;
      await this.getJwtToken();
      this.checkAndLogoutUserOnSessionExpiry();
    },
    showDialog() {
      this.startCounter();
      this.dialog = true;
    },
  },
  watch: {
    logoutCounter: {
      handler(value) {
        if (value <= 0) {
          window.location = this.routes.SESSION_EXPIRED;
        }
      },
      immediate: true, // This ensures the watcher is triggered upon creation
    },
  },
};
</script>
