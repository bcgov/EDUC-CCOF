<template>
  <v-container>
    <div style="display: none">
      <a id="logout_href" :href="routes.SESSION_EXPIRED" />
    </div>
    <AppDialog
      v-model="dialog"
      persistent
      max-width="525px"
      title="Session Time-out"
      :loading="false"
      @close="clicked()"
    >
      <template #content>
        <v-col cols="12">
          <p>
            Due to inactivity, you will be logged out of your current session in {{ logoutCounter }} seconds. Please
            click on the "Stay logged in" button to continue with this session.
          </p>
        </v-col>
      </template>
      <template #button>
        <v-row justify="space-around">
          <v-col cols="12" md="6" class="d-flex justify-center">
            <p>
              <AppButton :primary="true" @click="clicked()"> Stay logged in </AppButton>
            </p>
          </v-col>
        </v-row>
      </template>
    </AppDialog>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import { useAuthStore } from '@/store/auth.js';
import { useAppStore } from '@/store/app.js';

import { AuthRoutes } from '@/utils/constants.js';
import ApiService from '@/common/apiService.js';
import AppDialog from '@/components/guiComponents/AppDialog.vue';
import AppButton from '@/components/guiComponents/AppButton.vue';

function getTokenExpiredTime(jwtToken) {
  const now = Date.now().valueOf();
  const jwtPayload = jwtToken.split('.')[1];
  const payload = JSON.parse(window.atob(jwtPayload));
  // console.log(
  //   `getTokenExpiredTime: [${payload.exp}], with now: [${now}], token expire time is [${payload.exp * 1000 - now}]`,
  // );
  return payload.exp * 1000 - now;
}

export default {
  components: { AppButton, AppDialog },
  data() {
    return {
      routes: AuthRoutes,
      dialog: false,
    };
  },
  computed: {
    ...mapState(useAuthStore, ['isAuthenticated', 'jwtToken']),
    ...mapState(useAppStore, ['logoutCounter']),
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
  async mounted() {
    await this.checkAndLogoutUserOnSessionExpiry();
  },
  methods: {
    ...mapActions(useAuthStore, ['getJwtToken']),
    ...mapActions(useAppStore, ['startCounter', 'stopCounter']),
    async checkAndLogoutUserOnSessionExpiry() {
      if (this.isAuthenticated) {
        try {
          const response = await ApiService.apiAxios.get(AuthRoutes.SESSION_REMAINING_TIME);
          if (response.data > 0) {
            let timeOutValue = parseInt(response.data);
            const tokenExpire = getTokenExpiredTime(this.jwtToken);
            if (timeOutValue > tokenExpire) {
              timeOutValue = tokenExpire;
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
        } catch {
          window.location = document.getElementById('logout_href').href;
        }
      }
    },
    async clicked() {
      this.stopCounter();
      this.dialog = false;
      await this.getJwtToken();
      this.checkAndLogoutUserOnSessionExpiry();
    },
    showDialog() {
      this.startCounter();
      this.dialog = true;
    },
  },
};
</script>
