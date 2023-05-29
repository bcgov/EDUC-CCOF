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
import reportChangeStore from './store/modules/reportChanges';
import applicationStore from './store/modules/application';
import store from './store/index';
import Login from '@/components/Login.vue';
import BackendSessionExpired from '@/components/BackendSessionExpired';
import { PAGE_TITLES, PATHS, NAV_BAR_GROUPS } from '@/utils/constants';

import MinistryLogin from '@/components/MinistryLogin';
import Impersonate from '@/components/Impersonate';
import MessagesPage from '@/components/MessagesPage';

import CcfriEceLandingPage from '@/components/ccfriApplication/group/CcfriEceLanding';
import AddNewFees from '@/components/ccfriApplication/group/AddNewFees';


import CCFRIRequestMoreInfo from '@/components/RFI/RFILanding';
import NMF from '@/components/RFI/NMF';

import FamilyOrganization from '@/components/ccofApplication/family/FamilyOrganization';
import Eligibility from '@/components/ccofApplication/family/Eligibility';
import FamilyFunding from '@/components/ccofApplication/family/FamilyFunding';

import CcofApplicationTypeSelector from '@/components/ccofApplication/CcofApplicationTypeSelector';
import GroupOrganizationInformation from '@/components/ccofApplication/group/OrganizationInformation';
import FacilityInformation from '@/components/ccofApplication/group/FacilityInformation';
import GroupFundAmount from '@/components/ccofApplication/group/FundAmount';
import ApplicationConfirmation from '@/components/ccofApplication/group/ApplicationConfirmation';

import EceweEligibility from '@/components/eceweApplication/EceweEligibility';
import EceweFacilities from '@/components/eceweApplication/EceweFacilities';

import SearchFacility from '@/components/FacilitySearch';
import CcfriEstimator from '@/components/CcfriEstimator';
import LandingPage from '@/components/LandingPage';
import currentFees from '@/components/ccfriApplication/group/ExistingFacilityFees';

import RenewOrganization from '@/components/ccofApplication/RenewOrganization';
import SummaryDeclaration from '@/components/SummaryDeclaration';
import LicenseUpload from '@/components/ccofApplication/group/LicenseUpload';
import SupportingDocumentUpload from '@/components/SupportingDocumentUpload';

import ReportChange from '@/components/requestChanges/ReportChanges';
import ChangeNotificationForm from '@/components/requestChanges/ChangeNotificationForm';

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
      component: FamilyOrganization,
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
      path: PATHS.family.eligibility + '/:urlGuid',
      name: 'Eligibility GUID',
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
      path: PATHS.family.fundAmount + '/:urlGuid',
      name: 'FamilyFunding GUID',
      component: FamilyFunding,
      meta: {
        pageTitle: 'Information to Determine Funding amounts',
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCOF
      }
    },
    {
      path: PATHS.group.facInfo,
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
      path: PATHS.group.facInfo + '/:urlGuid',
      name: 'Facility Information Guid',
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
        pageTitle: 'Information to Determine Funding amounts',
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCOF
      }
    },
    {
      path: PATHS.group.fundAmount + '/:urlGuid',
      name: 'Funding Amount Guid',
      component: GroupFundAmount,
      meta: {
        pageTitle: 'Information to Determine Funding amounts',
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
        navBarGroup: NAV_BAR_GROUPS.CCOF
      }
    },
    {
      path: PATHS.group.licenseUpload,
      name: 'Licence Upload',
      component: LicenseUpload,
      meta: {
        pageTitle: 'Licence Upload',
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCOF
      }
    },
    {
      path: PATHS.group.renewOrganization,
      name: 'Renew Organization',
      component: RenewOrganization,
      meta: {
        pageTitle: 'Renew Organization',
        requiresAuth: true,
        showNavBar: false,
      }
    },
    // {
    //   path: '/ccfri-application' + '/urlGuid',
    //   name: 'ccfri-application',
    //   component: currentFees,
    //   meta: {
    //     pageTitle: 'Current Fees',
    //     requiresAuth: true,
    //     showNavBar: true,
    //     navBarGroup: NAV_BAR_GROUPS.CCFRI
    //   }
    // },
    {
      path: PATHS.eceweEligibility,
      name: 'ECEWE Eligibility',
      component: EceweEligibility,
      meta: {
        pageTitle: PAGE_TITLES.ECEWE_APPLICATION,
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.ECEWE
      }
    },
    {
      path: PATHS.eceweFacilities,
      name: 'ECEWE Facilities',
      component: EceweFacilities,
      meta: {
        pageTitle: PAGE_TITLES.ECEWE_APPLICATION,
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.ECEWE
      }
    },
    {
      path: PATHS.supportingDocumentUpload,
      name: 'Supporting Document Upload',
      component: SupportingDocumentUpload,
      meta: {
        pageTitle: PAGE_TITLES.SUPPORTING_DOCUMENT_UPLOAD,
        requiresAuth: true,
        showNavBar: true
      }
    },
    {
      path: PATHS.summaryDeclaration,
      name: 'Summary and Declaration',
      component: SummaryDeclaration,
      meta: {
        pageTitle: PAGE_TITLES.SUMMARY_DECLARATION,
        requiresAuth: true,
        showNavBar: true
      }
    },
    {
      path: PATHS.ccfriHome,
      name: 'ccfri-home',
      component: CcfriEceLandingPage,
      meta: {
        pageTitle: 'CCFRI Home',
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCFRI,
        requiresAuth: true,
      }
    },
    {
      path: PATHS.addNewFees,
      name: 'ccfri-add-fees',
      component: AddNewFees,
      meta: {
        pageTitle: 'CCFRI Add New Fees',
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCFRI,
        requiresAuth: true,
      }
    },
    {
      path: PATHS.addNewFees + '/:urlGuid',
      name: 'ccfri-add-fees-guid',
      component: AddNewFees,
      meta: {
        pageTitle: 'CCFRI Add New Fees',
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCFRI,
        requiresAuth: true,
      }
    },

    {
      path: PATHS.ccfriRequestMoreInfo + '/:urlGuid',
      name: 'ccfri-request-info',
      component: CCFRIRequestMoreInfo,
      meta: {
        pageTitle: 'CCFRI Request More Info',
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCFRI,
        requiresAuth: true,
      }
    },
    {
      path: PATHS.NMF + '/:urlGuid',
      name: 'new-facilities',
      component: NMF,
      meta: {
        pageTitle: 'New Facilities',
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCFRI,
        requiresAuth: true,
      }
    },
    {
      path: PATHS.currentFees + '/:urlGuid',
      name: 'ccfri-current-fees-guid',
      component: currentFees,
      meta: {
        pageTitle: 'CCFRI Current Fees',
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCFRI,
        requiresAuth: true,
      }
    },
    {
      path: PATHS.currentFees ,
      name: 'ccfri-current-fees',
      component: currentFees,
      meta: {
        pageTitle: 'CCFRI Current Fees',
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCFRI,
        requiresAuth: true,
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
      path: '/internal',
      name: 'ministry login',
      component: MinistryLogin,
      meta: {
        pageTitle: PAGE_TITLES.LOGIN,
      }
    },
    {
      path: PATHS.impersonate,
      name: 'impersonate',
      component: Impersonate,
      meta: {
        pageTitle: 'Impersonate a BCeID User',
        requiresAuth: true
      }
    },
    {
      path: PATHS.messagesPage,
      name: 'messagesPage',
      component: MessagesPage,
      meta: {
        pageTitle: 'Messages Page',
        requiresAuth: true
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
    {
      path: PATHS.reportChange.landing,
      name: 'Report Change',
      component: ReportChange,
      meta: {
        pageTitle: 'Report Changes',
        showNavBar: false,
        requiresAuth: true,
      }
    },
    {
      path: PATHS.reportChange.notificationForm,
      name: 'change-notification-form',
      component: ChangeNotificationForm,
      meta: {
        pageTitle: 'Change Notification Form',
        showNavBar: false,
        requiresAuth: true,
      }
    },
    {
      path: PATHS.reportChange.notificationForm + '/:urlGuid',
      name: 'change-notification-form-guid',
      component: ChangeNotificationForm,
      meta: {
        pageTitle: 'Change Notification Form',
        showNavBar: false,
        requiresAuth: true,
      }
    },
    {
      path: PATHS.reportChange.facInfo + '/:urlGuid',
      name: 'Report Change Facility Guid',
      component: FacilityInformation,
      meta: {
        pageTitle: 'Facility Information',
        requiresAuth: true,
        showNavBar: false,
        navBarGroup: NAV_BAR_GROUPS.CCOF
      }
    },
    {
      path: PATHS.reportChange.facInfo,
      name: 'Report Change Facility',
      component: FacilityInformation,
      meta: {
        pageTitle: 'Facility Information',
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCOF
      }
    },
    {
      path: PATHS.reportChange.fundAmount,
      name: 'Change Request Funding',
      component: FamilyFunding,
      meta: {
        pageTitle: 'Information to Determine Funding amounts',
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCOF
      }
    },
    {
      path: PATHS.reportChange.fundAmount + '/:urlGuid',
      name: 'Change Request Funding GUID',
      component: FamilyFunding,
      meta: {
        pageTitle: 'Information to Determine Funding amounts',
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCOF
      }
    },
  ]
});

router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAuth) {
    store.dispatch('auth/getJwtToken').then(() => {
      if (!authStore.state.isAuthenticated) {
        next('/token-expired');
      }else {
        store.dispatch('auth/getUserInfo').then(() => {
          if (authStore.state.isMinistryUser && !authStore.state.impersonateId && to.path !== PATHS.impersonate) {
            next(PATHS.impersonate);
          } else {
            if (to.fullPath.includes('report-change')){
              //should we check if the change store exists or just load all the time?
              console.log('\n loading the change store');
              store.dispatch('reportChanges/loadChangeRequest');
            }
            next();
          }
        }).catch((error) => {
          console.log('error', error);
          if (error.response?.status == '401') {
            next('unauthorized');
          } else {
            console.log('An error occurred.', error);
            next('error');
          }
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
