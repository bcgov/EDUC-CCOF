<template>
  <v-system-bar app absolute color="rgb(0, 51, 102)" height="66rem" class="sysBar">
    <!-- Navbar content -->
    <v-container
    :class="{'sizingForIconXLScreen': $vuetify.breakpoint.xlOnly} "
    >
    <v-row class="justify-space-between">
    <a tabindex="-1" href="https://www2.gov.bc.ca/gov/content/governments/organizational-structure/ministries-organizations/ministries/education">
      <img
          tabindex="-1"
          src="@/assets/images/bc-gov-logo.svg"
          class="logo"
          alt="B.C. Government Logo"
      >
    </a>
    
    <div v-if="isAuthenticated && dataReady" class="mt-7">
      <v-btn 
        id="mail_box_button" @click="goToMessagePage()"
        color="#003366" rounded dark elevation="0" style="margin-right:50px"
      >
        <v-badge
          color="red"
          :content="unreadMessageCount"
          bottom right 
          overlap offset-x="20" offset-y="20"
        >
          <v-icon aria-hidden="false" size="40" color='white'>
              mdi-email-outline
          </v-icon>
        </v-badge>
      </v-btn>
      
      <v-menu name="user_options" offset-y>
        <template v-slot:activator="{ on }">
          <v-chip tabindex="0" v-on="on" pill color="#003366" dark>
            <v-avatar left color="info">
              {{ userInfo.displayName[0] }}
            </v-avatar>
            <span class="display-name">{{ userInfo.displayName }}</span>
          </v-chip>
        </template>
        <v-list dark color="#003366">
          <v-list-item style="min-height: 4vh" id="home_button" :to='authRoutes.DASHBOARD'>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="isMinistryUser" id="impersonate_button" :to='PATHS.impersonate'>
            <v-list-item-title>Impersonate</v-list-item-title>
          </v-list-item>
          <v-list-item style="min-height: 4vh" id="logout_button" :href='authRoutes.LOGOUT'>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

    </div>
    <div v-else-if="isAuthenticated && !dataReady">
      <v-skeleton-loader type="chip">
      </v-skeleton-loader>
    </div>
  </v-row>
  </v-container>
  </v-system-bar>
</template>

<script>
import {mapGetters} from 'vuex';
import {AuthRoutes , ApiRoutes, PATHS} from '@/utils/constants';

export default {
  data() {
    return {
      appTitle: process.env.VUE_APP_TITLE,
      authRoutes: AuthRoutes,
      PATHS: PATHS,
      apiRoutes: ApiRoutes
    };
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated','userInfo', 'isMinistryUser']),
    ...mapGetters('message', ['unreadMessageCount']),
    dataReady: function () {
      return this.userInfo;
    },
  },
  methods: {
    hasSeveralMincodes() {
      return this.userInfo?.userMinCodes?.length > 1;
    },
    goToMessagePage() {
      this.$router.push(PATHS.messagesPage).catch(err => {
        // Ignore the vuex err regarding  navigating to the page they are already on.
        if (
          err.name !== 'NavigationDuplicated' &&
          !err.message.includes('Avoided redundant navigation to current location')
        ) 
          console.log(err);
      });
    },
    
  }
};
</script>
<style>
.gov-header .v-icon{
  padding-left: 10px;
}
.sizingForIconXLScreen {
  width: 1470px;
}
a {
  text-decoration: none;
}
.logo{
  padding-right: 15px;
  padding-top: 4px;
  width: 205px;
  height: 77px;
}
.gov-header .title {
  color: #fff;
  text-decoration: none;
}
.sysBar {
  border-bottom: 2px solid rgb(252, 186, 25) !important;
  z-index: 8;
}
.gov-header .v-btn,
.v-btn--active.title:before,
.v-btn.title:focus:before,
.v-btn.title:hover:before {
  color: #fff;
  background: none;
}

.v-input__slot{
  padding-top: 10px
}
.top-down{
  padding-top: 20px;
  height: 80%;
}

@media screen and (max-width: 801px){
  .logo {
    width: 100px;
  }

  .mainTitle {
    font-size: 1.0rem;
  }

  .display-name{
    display: none;
  }
}
</style>
