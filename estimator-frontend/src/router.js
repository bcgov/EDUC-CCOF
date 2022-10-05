import Vue from 'vue';
import VueRouter from 'vue-router';
import VueMeta from 'vue-meta';

import moment from 'moment';

import {PAGE_TITLES} from '@/utils/constants';

import FRICalculator from '@/components/FRICalculator';


Vue.prototype.moment = moment;

Vue.use(VueRouter);
Vue.use(VueMeta);
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/fri-calculator',
      name: 'fri-calculator',
      component: FRICalculator,
      meta: {
        pageTitle: PAGE_TITLES.FRICalculator
      }
    },
  ]
});

export default router;
