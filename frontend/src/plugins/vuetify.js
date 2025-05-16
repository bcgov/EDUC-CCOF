import '@fortawesome/fontawesome-free/css/all.css';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles'; // CSS Reset

import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const ccofLightTheme = {
  dark: false,
  colors: {
    primary: '#003366',
    error: '#d8292f',
    success: '#2e8540',
  },
  variables: {
    'disabled-opacity': 0.7,
  },
};

export default new createVuetify({
  theme: {
    defaultTheme: 'ccofLightTheme',
    themes: {
      ccofLightTheme,
    },
  },
  components,
  directives,
  icons: {
    iconfont: 'fa',
    values: {
      login: 'fas fa-user-clock',
      fast: 'fas fa-shipping-fast',
      sign_in: 'fas fa-sign-in-alt',
      info1: 'fas fa-info-circle',
      downArrow: 'fas fa-angle-down',
      upArrow: 'fas fa-angle-up',
      user: 'far fa-user',
      copy: 'fas fa-copy',
      search: 'fas fa-search',
      error: 'fas fa-exclamation-triangle',
      lock: 'fas fa-lock',
      info2: 'fas fa-info-circle fa-10x',
      question: 'fas fa-question-circle fa-10x',
    },
  },
});
