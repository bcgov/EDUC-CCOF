import Vue from 'vue';
import VueRouter from 'vue-router';
import VueMeta from 'vue-meta';

import moment from 'moment';

import { PAGE_TITLES, PATHS} from '@/utils/constants';

import CcfriEstimator from '@/components/CcfriEstimator';

Vue.prototype.moment = moment;

Vue.use(VueRouter);
Vue.use(VueMeta);
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: PATHS.estimator,
      name: 'ccfri-estimator',
      component: CcfriEstimator,
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
