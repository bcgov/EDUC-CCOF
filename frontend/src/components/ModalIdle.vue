<template>
  <v-container>
    <div style="display: none">
      <a id="logout_href" :href='routes.SESSION_EXPIRED' />
    </div>
    <v-dialog v-model="dialog" persistent max-width="525px">
      <v-card>
        <v-container class="pt-0">
          <v-row>
            <v-col cols="7" class="py-0 pl-0" style="background-color:#234075;">
              <v-card-title class="white--text">Session Time-out</v-card-title>
            </v-col>
            <v-col cols="5" class="d-flex justify-end" style="background-color:#234075;">
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" style="background-color:#FFC72C;padding:2px;"></v-col>
          </v-row>
          <v-row>
            <v-col cols="12" style="text-align: center;">
              <p class="pt-4">Due to inactivity, you will be logged out of your current session in {{timerCount}} seconds. Please
                click on the "Stay logged in" button to continue with this session. Your current changes will be
                auto-saved if you resume this session.</p>
              <p><v-btn color="primary" @click="clicked()">Stay logged in</v-btn>
              </p>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { AuthRoutes } from '@/utils/constants';
import ApiService from '@/common/apiService';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      routes: AuthRoutes,
      dialog: false,
      timerCount: -1,
    };
  },
  async mounted() {
    await this.checkAndLogoutUserOnSessionExpiry();

  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated']),
  },
  methods: {
    async checkAndLogoutUserOnSessionExpiry() {
      if (this.isAuthenticated) {
        try {
          console.log('attemping to make session remaining call');
          const response = await ApiService.apiAxios
            .get(AuthRoutes.SESSION_REMAINING_TIME);
            console.log('get session remaining time', response.data);
          if (response.data > 0) {
            const timeOutValue = parseInt(response.data); // add 200 ms
            console.log('modalIdle.vue - timeout: ', timeOutValue);
            if (timeOutValue < 130000) {
              console.log('timeout less than 500');
              this.showDialog();
            } else {
              setTimeout(() => {
                this.checkAndLogoutUserOnSessionExpiry();
              }, timeOutValue - 120000);
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
      this.dialog = false;
      this.timerCount = -1;
      this.checkAndLogoutUserOnSessionExpiry();
      // try {
      //     await ApiService.apiAxios.get(AuthRoutes.REFRESH);
      //     const response = await ApiService.apiAxios
      //       .get(AuthRoutes.SESSION_REMAINING_TIME);
      //     if (response.data > 0) {
      //       const timeOutValue = parseInt(response.data) - 500; // add 200 ms
      //       console.log('modalIdle.vue - timeout: ', timeOutValue);
      //       if (timeOutValue < 500) {
      //         this.showDialog();
      //       } else {
      //         setTimeout(() => {
      //           this.checkAndLogoutUserOnSessionExpiry();
      //         }, timeOutValue);
      //       }
      //     } else {
      //       window.location = document.getElementById('logout_href').href;
      //     }
      //   } catch (e) {
      //     window.location = document.getElementById('logout_href').href;
      //   }

    },
    showDialog() {
      this.timerCount = 60;
      this.dialog = true;
    }
  },
  watch: {
    timerCount: {
      handler(value) {
        if (value > 0) {
          setTimeout(() => {
            this.timerCount--;
          }, 1000);
        } else if (value === 0) {
          window.location = document.getElementById('logout_href').href;
        }
      },
      immediate: true // This ensures the watcher is triggered upon creation
    }
  }
};
</script>
