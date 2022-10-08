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
      path: '/ccfri-estimator',
      name: 'ccfri-estimator',
      component: FRICalculator,
      meta: {
        pageTitle: PAGE_TITLES.FRICalculator
      }
    },
    {
      path: '*',
      name: 'notfound',
      redirect: 'ccfri-estimator',
      meta: {
      }
    },    
  ]
});

export default router;
