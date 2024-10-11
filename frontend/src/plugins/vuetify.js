import '@fortawesome/fontawesome-free/css/all.css';
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles'; // CSS Reset

export default new createVuetify({
  theme: {
    light: true,
    dark: false,
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
