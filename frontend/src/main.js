import { createApp } from 'vue';
import vuetify from './plugins/vuetify.js';
import router from './router.js';
import { createPinia } from 'pinia';

import AppComponent from './App.vue';

const app = createApp(AppComponent);
const pinia = createPinia();

app.use(pinia).use(router).use(vuetify).mount('#app');
