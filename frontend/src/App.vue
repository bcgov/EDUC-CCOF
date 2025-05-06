<template>
  <v-app id="app">
    <div>
      <MsieBanner v-if="isIE" />
      <HeaderComponent />
      <SnackBar />
      <TheEnvBar />
    </div>
    <v-main>
      <h3 v-if="subtitleBanner" class="subBanner">
        {{ subtitleBanner }}
      </h3>
      <ModalIdle v-if="isAuthenticated" />
      <NavBar v-if="pageTitle && isAuthenticated && showNavBar" :title="pageTitle" />
      <router-view />
    </v-main>
    <FooterComponent />
  </v-app>
</template>

<script>
import HttpStatus from 'http-status-codes';
import { mapActions, mapState } from 'pinia';
import { useAppStore } from '@/store/app.js';
import { useAuthStore } from '@/store/auth.js';

import StaticConfig from '@/common/staticConfig.js';

import HeaderComponent from '@/components/Header.vue';
import FooterComponent from '@/components/Footer.vue';
import ModalIdle from '@/components/ModalIdle.vue';
import MsieBanner from '@/components/MsieBanner.vue';
import SnackBar from '@/components/util/SnackBar.vue';
import NavBar from '@/components/util/NavBar.vue';
import TheEnvBar from '@/components/TheEnvBar.vue';

export default {
  name: 'App',
  components: {
    HeaderComponent,
    FooterComponent,
    ModalIdle,
    MsieBanner,
    SnackBar,
    NavBar,
    TheEnvBar,
  },
  metaInfo: {
    meta: StaticConfig.VUE_APP_META_DATA,
  },
  computed: {
    ...mapState(useAuthStore, ['isAuthenticated', 'loginError', 'isLoading']),
    ...mapState(useAppStore, ['pageTitle', 'showNavBar', 'subtitleBanner']),
    isIE() {
      return /Trident\/|MSIE/.test(window.navigator.userAgent);
    },
  },
  async created() {
    this.setLoading(true);
    this.getJwtToken()
      .then(() => Promise.all([this.getLookupInfo()]))
      .catch((e) => {
        if (!e.response || e.response.status !== HttpStatus.UNAUTHORIZED) {
          this.logout();
          this.$router.replace({ name: 'error', query: { message: `500_${e.data || 'ServerError'}` } });
        }
      })
      .finally(() => {
        this.setLoading(false);
      });
    this.setLoading(false);
  },
  methods: {
    ...mapActions(useAuthStore, ['getJwtToken', 'getUserInfo', 'logout', 'setLoading']),
    ...mapActions(useAppStore, ['getLookupInfo']),
  },
};
</script>

<style>
/*Some BCSans fonts (i.e. g, y) get clipped in v-selects. This heightens the display to fix clipping. */
.v-select__selection.v-select__selection--comma {
  line-height: 20px !important;
}

.envBanner {
  font-size: 0.8rem;
}
.subBanner {
  font-size: 0.8rem;
  background-color: #fff9c4;
  padding-left: 2%;
}

.v-application {
  font-family: 'BCSans', Verdana, Arial, sans-serif !important;
}
.v-card--flat {
  background-color: transparent !important;
}
.theme--light.application {
  background: #f1f1f1;
}
h1 {
  font-size: 1.25rem;
}
.v-toolbar-title {
  font-size: 1rem;
}

.v-btn {
  text-transform: none !important;
}

.v-alert .v-icon {
  padding-left: 0;
}

.v-alert.bootstrap-success {
  color: #234720;
  background-color: #d9e7d8 !important;
  border-color: #accbaa !important;
}

.v-alert.bootstrap-info {
  color: #4e6478;
  background-color: #eaf2fa !important;
  border-color: #b8d4ee !important;
}

.v-alert.bootstrap-warning {
  color: #81692c;
  background-color: #fef4dd !important;
  border-color: #fbdb8b !important;
}

.v-alert.bootstrap-error {
  color: #712024;
  background-color: #f7d8da !important;
  border-color: #eeaaad !important;
}

.v-row {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  margin-top: auto !important;
  margin-bottom: auto !important;
}

.v-field-label {
  white-space: normal;
}

@media screen and (max-width: 370px) {
  .v-toolbar-title {
    font-size: 0.9rem;
    line-height: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  h1 {
    font-size: 0.9rem;
  }

  .v-application {
    line-height: 1.3;
  }
}

@media screen and (min-width: 371px) and (max-width: 600px) {
  .v-toolbar-title {
    font-size: 0.9rem;
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  h1 {
    font-size: 1rem;
  }

  .v-application {
    line-height: 1.3;
  }
}

@media screen and (min-width: 601px) and (max-width: 700px) {
  .v-toolbar-title {
    font-size: 1rem;
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  h1 {
    font-size: 1.2rem;
  }
}

.theme--light.v-btn.v-btn--disabled:not(.v-btn--text):not(.v-btn--outlined) {
  background-color: rgba(0, 0, 0, 0.12) !important;
}

@font-face {
  font-family: 'BCSans';
  font-style: normal;
  src:
    url('assets/font/BC-Sans/BCSans-Regular.woff2') format('woff2'),
    /* Optimized for very modern browsers */ url('assets/font/BC-Sans/BCSans-Regular.woff') format('woff'); /* Modern Browsers */
}
@font-face {
  font-family: 'BCSans';
  font-style: italic;
  src:
    url('assets/font/BC-Sans/BCSans-Italic.woff2') format('woff2'),
    /* Optimized for very modern browsers */ url('assets/font/BC-Sans/BCSans-Italic.woff') format('woff'); /* Modern Browsers */
}
@font-face {
  font-family: 'BCSans';
  font-weight: 700;
  src: url('assets/font/BC-Sans/BCSans-Bold.woff2') format('woff2') /* Optimized for very modern browsers */
    url('assets/font/BC-Sans/BCSans-Bold.woff') format('woff'); /* Modern Browsers */
}
@font-face {
  font-family: 'BCSans';
  font-style: italic;
  font-weight: 700;
  src:
    url('assets/font/BC-Sans/BCSans-BoldItalic.woff2') format('woff2'),
    /* Optimized for very modern browsers */ url('assets/font/BC-Sans/BCSans-BoldItalic.woff') format('woff'); /* Modern Browsers */
}
</style>
