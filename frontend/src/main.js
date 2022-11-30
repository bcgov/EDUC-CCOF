import Vue from 'vue';
import vuetify from '@/plugins/vuetify';
import App from './App';
import router from './router';
import store from './store';

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core';

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

/* import specific icons */
import { faCircleInfo, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

/* add icons to the library */
library.add(faCircleInfo);
library.add(faCircleXmark);

/* add font awesome icon component */
Vue.component('font-awesome-icon', FontAwesomeIcon);

// Vue.config.productionTip = false


export const eventBus = new Vue();

Vue.config.productionTip = false;
new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app');
