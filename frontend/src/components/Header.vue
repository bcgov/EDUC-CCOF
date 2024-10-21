<template>
  <v-app-bar id="app-header" color="#003366" class="px-5 px-md-10" height="64">
    <!-- Navbar content -->
    <v-container :class="{ sizingForIconXLScreen: $vuetify.display.xl }">
      <v-row class="justify-space-between">
        <a tabindex="-1" href="/">
          <img tabindex="-1" src="../assets/images/bc-gov-logo.svg" class="logo" alt="B.C. Government Logo" />
        </a>
        <v-row class="verticalLine">
          <v-row>
            <v-toolbar-title fill-height>
              <h6 v-if="$vuetify.display.xs">My ChildCareBC<br />Services</h6>
              <h2 v-else class="mainTitle">My ChildCareBC Services</h2>
            </v-toolbar-title>
          </v-row>
        </v-row>
        <v-spacer />
        <div v-if="isAuthenticated && dataReady" class="mt-6">
          <v-btn
            id="mail_box_button"
            color="#003366"
            rounded
            theme="dark"
            class="mr-5 elevation-0"
            :to="PATHS.ROOT.MESSAGES"
          >
            <v-badge color="red" :content="unreadMessageCount" location="bottom end" offset-x="5" offset-y="10">
              <v-icon aria-hidden="false" size="40" color="white"> mdi-email-outline </v-icon>
            </v-badge>
          </v-btn>

          <v-menu name="user_options">
            <template #activator="{ props }">
              <v-chip tabindex="0" pill color="#003366" theme="dark" v-bind="props">
                <v-avatar start color="info">
                  {{ userInfo.displayName[0] }}
                </v-avatar>
                <span class="display-name">{{ userInfo.displayName }}</span>
              </v-chip>
            </template>
            <v-list dark color="#003366">
              <v-list-item id="home_button" style="min-height: 4vh" :to="authRoutes.DASHBOARD">
                <v-list-item-title>Home</v-list-item-title>
              </v-list-item>
              <v-list-item v-if="isMinistryUser" id="impersonate_button" :to="PATHS.ROOT.IMPERSONATE">
                <v-list-item-title>Impersonate</v-list-item-title>
              </v-list-item>
              <v-list-item id="logout_button" style="min-height: 4vh" :href="authRoutes.LOGOUT">
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <div v-else-if="isAuthenticated && !dataReady">
          <v-skeleton-loader type="chip" width="150" class="bg-transparent mt-2" />
        </div>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
import { mapState } from 'pinia';
import { useAuthStore } from '../store/auth.js';
import { useMessageStore } from '../store/message.js';

import { AuthRoutes, ApiRoutes, PATHS } from '../utils/constants';

export default {
  name: 'HeaderComponent',
  data() {
    return {
      appTitle: import.meta.env.VUE_APP_TITLE,
      authRoutes: AuthRoutes,
      PATHS: PATHS,
      apiRoutes: ApiRoutes,
    };
  },
  computed: {
    ...mapState(useAuthStore, ['isAuthenticated', 'userInfo', 'isMinistryUser']),
    ...mapState(useMessageStore, ['unreadMessageCount']),
    dataReady: function () {
      return this.userInfo;
    },
  },
  methods: {
    hasSeveralMincodes() {
      return this.userInfo?.userMinCodes?.length > 1;
    },
  },
};
</script>
<style>
.gov-header .v-icon {
  padding-left: 10px;
}
.sizingForIconXLScreen {
  width: 1470px;
}
a {
  text-decoration: none;
}
.logo {
  padding-right: 15px;
  padding-top: 4px;
  width: 205px;
  height: 77px;
}
.gov-header .title {
  color: #fff;
  text-decoration: none;
}
#app-header {
  border-bottom: 2px solid rgb(252, 186, 25) !important;
  z-index: 1002;
}
.gov-header .v-btn,
.v-btn--active.title:before,
.v-btn.title:focus:before,
.v-btn.title:hover:before {
  color: #fff;
  background: none;
}

.verticalLine {
  border-left: 1px solid #dfb433;
  height: 50px;
  margin-left: 12px;
  padding-left: 24px;
}

.v-input__slot {
  padding-top: 10px;
}
.top-down {
  padding-top: 20px;
  height: 80%;
}

.justify-right {
  justify-content: flex-end;
  margin-right: 5px;
}

@media screen and (max-width: 801px) {
  .logo {
    width: 100px;
  }

  .mainTitle {
    font-size: 1rem;
  }

  .display-name {
    display: none;
  }
}

@media print {
  #app-header { display: none; }
}
</style>
