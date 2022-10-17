import Vue from 'vue';
import vuetify from '@/plugins/vuetify';
import App from './App';
import router from './router';
import store from './store';

export const eventBus = new Vue();

Vue.config.productionTip = false;
new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app');
