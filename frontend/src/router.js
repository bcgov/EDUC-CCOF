import Vue from 'vue';
import VueRouter from 'vue-router';
import VueMeta from 'vue-meta';

import moment from 'moment';

import Logout from './components/Logout';
import SessionExpired from './components/SessionExpired';
import ErrorPage from '@/components/ErrorPage.vue';
import LoginError from '@/components/LoginError.vue';
import Unauthorized from '@/components/common/Unauthorized.vue';
import authStore from './store/modules/auth';
import store from './store/index';
import Login from '@/components/Login.vue';
import BackendSessionExpired from '@/components/BackendSessionExpired';
import { PAGE_TITLES, PATHS, NAV_BAR_GROUPS } from '@/utils/constants';

import CCFRIApplicationForm from '@/components/CCFRIApplicationForm';
import CcfriEceLandingPage from '@/components/ccfriApplication/group/CcfriEceLanding';
import AddNewFees from '@/components/ccfriApplication/group/AddNewFees';
import CCFRIRequestMoreInfo from '@/components/ccfriApplication/group/RequestForInfo';

import FamilyOrganizationInformation from '@/components/ccofApplication/family/FamilyOrganizationInformation';
import Eligibility from '@/components/ccofApplication/family/Eligibility';
import FamilyFunding from '@/components/ccofApplication/family/FamilyFunding';

import CcofApplicationTypeSelector from '@/components/ccofApplication/CcofApplicationTypeSelector';
import GroupOrganizationInformation from '@/components/ccofApplication/group/OrganizationInformation';
import FacilityInformation from '@/components/ccofApplication/group/FacilityInformation';
import GroupFundAmount from '@/components/ccofApplication/group/FundAmount';
import ApplicationConfirmation from '@/components/ccofApplication/group/ApplicationConfirmation';

import SearchFacility from '@/components/FacilitySearch';
import CcrfiEstimatorSliderSelect from '@/components/CcrfiEstimatorSliderSelect';
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
      path: PATHS.group.orgInfo,
      name: 'Group Organization Information',
      component: GroupOrganizationInformation,
      meta: {
        pageTitle: 'Organization Information',
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCOF
      }
    },
    {
      path: PATHS.family.orgInfo,
      name: 'Family Organization Information',
      component: FamilyOrganizationInformation,
      meta: {
        pageTitle: 'Organization Information',
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCOF
      }
    },
    {
      path: PATHS.family.eligibility,
      name: 'Eligibility',
      component: Eligibility,
      meta: {
        pageTitle: 'Information to Determine Eligibility',
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCOF
      }
    },
    {
      path: PATHS.family.fundAmount,
      name: 'FamilyFunding',
      component: FamilyFunding,
      meta: {
        pageTitle: 'Information to Determine Funding amounts',
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCOF
      }
    },
    {
      path: PATHS.group.facInfo + '/:urlFacilityId',
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
      path: PATHS.group.fundAmount,
      name: 'Funding Amount',
      component: GroupFundAmount,
      meta: {
        pageTitle: 'Application Confirmation',
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCOF
      }
    },
    {
      path: PATHS.group.confirmation,
      name: 'Application Confirmation',
      component: ApplicationConfirmation,
      meta: {
        pageTitle: 'Application Confirmation',
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
        pageTitle: 'CCFRI Home',
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCFRI
      }
    },
    {
      path: PATHS.addNewFees,
      name: 'ccfri-add-fees',
      component: AddNewFees,
      meta: {
        pageTitle: 'CCFRI Add New Fees',
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCFRI
      }
    },
    {
      path: PATHS.ccfriRequestMoreInfo,
      name: 'ccfri-request-info',
      component: CCFRIRequestMoreInfo,
      meta: {
        pageTitle: 'CCFRI Request More Info'
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
