<template>
  <v-system-bar app absolute color="rgb(0, 51, 102)" height="56rem" class="sysBar"
                :class="{'pl-2': $vuetify.breakpoint.smAndDown, 'pl-10': $vuetify.breakpoint.mdAndUp, 'pr-2': $vuetify.breakpoint.smAndDown, 'pr-10': $vuetify.breakpoint.mdAndUp} ">
    <!-- Navbar content -->
    <a tabindex="-1" href="https://www.gov.bc.ca/gov/content/governments/organizational-structure/ministries-organizations/ministries/education">
      <img
          tabindex="-1"
          src="@/assets/images/bc-gov-logo.svg"
          width="155"
          class="logo"
          alt="B.C. Government Logo"
      >
    </a>
    <a tabindex="-1" href="">
      <v-toolbar-title><h3 class="mainTitle" style="color:white">{{ appTitle }}</h3></v-toolbar-title>
    </a>


    <v-spacer></v-spacer>
  </v-system-bar>
</template>

<script>
import {AuthRoutes , ApiRoutes} from '@/utils/constants';
import StaticConfig from '../common/staticConfig';

export default {
  data() {
    return {
      appTitle: StaticConfig.VUE_APP_TITLE,
      authRoutes: AuthRoutes,
      apiRoutes: ApiRoutes
    };
  },
  computed: {
  },
  methods: {
  }
};
</script>
<style>
.gov-header .v-icon{
  padding-left: 10px;
}
a {
  text-decoration: none;
}
.logo{
  padding-right: 15px;
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
