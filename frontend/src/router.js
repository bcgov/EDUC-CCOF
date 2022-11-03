import Vue from 'vue';
import VueRouter from 'vue-router';
import VueMeta from 'vue-meta';

import moment from 'moment';

import Logout from './components/Logout';
import UserActivationLinkError from './components/UserActivationLinkError';
import SessionExpired from './components/SessionExpired';
import ErrorPage from '@/components/ErrorPage.vue';
import LoginError from '@/components/LoginError.vue';
import Unauthorized from '@/components/common/Unauthorized.vue';
import authStore from './store/modules/auth';
import store from './store/index';
import Login from '@/components/Login.vue';
import BackendSessionExpired from '@/components/BackendSessionExpired';
import { PAGE_TITLES, PATHS, NAV_BAR_GROUPS } from '@/utils/constants';



import OrganizationSelection from '@/components/OrganizationSelection';

import CCFRIApplicationForm from '@/components/CCFRIApplicationForm';
import CcfriEceLandingPage from '@/components/ccfriApplication/group/CcfriEceLanding';
import AddNewFees from '@/components/ccfriApplication/group/CcfriEceLanding';

import CcofApplicationTypeSelector from '@/components/ccofApplication/CcofApplicationTypeSelector';
import OrganizationInformation from '@/components/ccofApplication/group/OrganizationInformation';
import FacilityInformation from '@/components/ccofApplication/group/FacilityInformation';
import FundAmount from '@/components/ccofApplication/group/FundAmount';
import ApplicationConfirmation from '@/components/ccofApplication/group/ApplicationConfirmation';

import SearchFacility from '@/components/FacilitySearch';
import CcfriEstimator from '@/components/CcfriEstimator';
import LandingPage from '@/components/LandingPage';


Vue.prototype.moment = moment;

Vue.use(VueRouter);
Vue.use(VueMeta);
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: LandingPage,
      meta: {
        pageTitle: PAGE_TITLES.LANDING_PAGE,
        showNavBar: false,
        requiresAuth: true,
      },
    },
    {
      path: '/error',
      name: 'error',
      component: ErrorPage
    },
    {
      path: '/logout',
      name: 'logout',
      component: Logout
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: Unauthorized,
    },
    {
      path: '/session-expired',
      name: 'session-expired',
      component: SessionExpired
    },
    {
      path: '/login-error',
      name: 'login-error',
      component: LoginError
    },
    {
      path: '/facility-search',
      name: 'facility-search',
      component: SearchFacility,
      meta: {
        pageTitle: PAGE_TITLES.SearchFacility
      }
    },
    {
      path: PATHS.estimator,
      name: 'ccfri-estimator',
      component: CcfriEstimator,
      meta: {
        pageTitle: PAGE_TITLES.FRICalculator
      }
    },
    {
      path: PATHS.selectApplicationType,
      name: 'Select CCOF Application Type',
      component: CcofApplicationTypeSelector,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: PATHS.orgInfo,
      name: 'Organization Information',
      component: OrganizationInformation,
      meta: {
        pageTitle: 'Organization Information',
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCOF
      }
    },
    {
      path: PATHS.facInfo + '/:urlFacilityId',
      name: 'Facility Information',
      component: FacilityInformation,
      meta: {
        pageTitle: 'Facility Information',
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCOF
      }
    },
    {
      path: PATHS.fundAmount,
      name: 'Funding Amount',
      component: FundAmount,
      meta: {
        pageTitle: 'Application Confirmation',
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCOF
      }
    },
    {
      path: PATHS.confirmation,
      name: 'Applicaqtion Confirmation',
      component: ApplicationConfirmation,
      meta: {
        pageTitle: 'Funding Amount',
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCFRI
      }
    },
    {
      path: '/ccfri-application',
      name: 'ccfri-application',
      component: CCFRIApplicationForm,
      meta: {
        pageTitle: PAGE_TITLES.CCRFI_APPLICATION
      }
    },
    {
      path: PATHS.ccfriHome,
      name: 'ccfri-home',
      component: CcfriEceLandingPage,
      meta: {
        pageTitle: 'CCFRI Home'
      }
    },
    {
      path: PATHS.addNewFees,
      name: 'ccfri-add-fees',
      component: AddNewFees,
      meta: {
        pageTitle: 'CCFRI Add New Fees'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        pageTitle: PAGE_TITLES.LOGIN,
      }
    },
    {
      path: '*',
      name: 'notfound',
      redirect: '/',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/token-expired',
      name: 'backend-session-expired',
      component: BackendSessionExpired
    },
  ]
});

router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAuth) {
    store.dispatch('auth/getJwtToken').then(() => {
      if (!authStore.state.isAuthenticated) {
        next('/token-expired');
      } else {
        store.dispatch('auth/getUserInfo').then(() => {
          next();
        }).catch(() => {
          next('error');
        });
      }
    }).catch(() => {
      if (!authStore.state.userInfo) {
        next('/login');
      } else {
        next('/token-expired');
      }
    });
  }
  else {
    next();
  }
});

router.afterEach((to) => {
  // determine if we should show navBar
  store.commit('app/setShowNavBar', to.meta?.showNavBar == true);
  if (to && to.meta) {
    store.commit('app/setNavBarGroup', to.meta.navBarGroup);
  } else {
    store.commit('app/setNavBarGroup', '');
  }
  // this section is to set page title in vue store
  if (to && to.meta) {
    store.commit('app/setPageTitle', to.meta.pageTitle);
  } else {
    store.commit('app/setPageTitle', '');
  }
});

export default router;
