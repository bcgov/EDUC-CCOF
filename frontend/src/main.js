import Vue from 'vue';
import vuetify from './plugins/vuetify.js';
import App from './App.vue';
import router from './router.js';
import store from './store.js';

export const eventBus = new Vue();

Vue.config.productionTip = false;
new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app');
