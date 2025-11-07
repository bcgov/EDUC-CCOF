import { isEmpty } from 'lodash';
import { createRouter, createWebHistory } from 'vue-router';

import BackendSessionExpired from '@/components/BackendSessionExpired.vue';
import CcfriEstimator from '@/components/CcfriEstimator.vue';
import ErrorPage from '@/components/ErrorPage.vue';
import SearchFacility from '@/components/FacilitySearch.vue';
import Impersonate from '@/components/Impersonate.vue';
import LandingPage from '@/components/LandingPage.vue';
import Login from '@/components/Login.vue';
import LoginError from '@/components/LoginError.vue';
import Logout from '@/components/Logout.vue';
import MessagesPage from '@/components/MessagesPage.vue';
import MinistryLogin from '@/components/MinistryLogin.vue';
import CcofNewApplicationIntermediate from '@/components/NewAppIntermediatePage.vue';
import NMF from '@/components/RFI/NMF.vue';
import CCFRIRequestMoreInfo from '@/components/RFI/RFILanding.vue';
import SessionExpired from '@/components/SessionExpired.vue';
import SubmissionHistory from '@/components/SubmissionHistory.vue';
import SummaryDeclaration from '@/components/SummaryDeclaration.vue';
import SupportingDocumentUpload from '@/components/SupportingDocumentUpload.vue';
import UnauthorizedView from '@/components/UnauthorizedView.vue';
import ManageUsers from '@/components/accountMgmt/ManageUsers.vue';
import ApprovableFeeSchedule from '@/components/ccfriApplication/AFS/ApprovableFeeSchedule.vue';
import Closures from '@/components/ccfriApplication/Closures.vue';
import AddNewFees from '@/components/ccfriApplication/group/AddNewFees.vue';
import CcfriEceLandingPage from '@/components/ccfriApplication/group/CcfriEceLanding.vue';
import currentFees from '@/components/ccfriApplication/group/ExistingFacilityFees.vue';
import CcofApplicationTypeSelector from '@/components/ccofApplication/CcofApplicationTypeSelector.vue';
import RenewOrganization from '@/components/ccofApplication/RenewOrganization.vue';
import FamilyFacilityInformation from '@/components/ccofApplication/family/FacilityInformation.vue';
import FamilyFunding from '@/components/ccofApplication/family/FamilyFunding.vue';
import FamilyOrganization from '@/components/ccofApplication/family/FamilyOrganization.vue';
import ApplicationConfirmation from '@/components/ccofApplication/group/ApplicationConfirmation.vue';
import FacilityInformation from '@/components/ccofApplication/group/FacilityInformation.vue';
import GroupFundAmount from '@/components/ccofApplication/group/FundAmount.vue';
import LicenseUpload from '@/components/ccofApplication/group/LicenseUpload.vue';
import GroupOrganizationInformation from '@/components/ccofApplication/group/OrganizationInformation.vue';
import OrganizationClosures from '@/components/closure/OrganizationClosures.vue';
import EceweEligibility from '@/components/eceweApplication/EceweEligibility.vue';
import EceweFacilities from '@/components/eceweApplication/EceweFacilities.vue';
import EnrolmentReportDeclaration from '@/components/enrolmentReports/EnrolmentReportDeclaration.vue';
import EnrolmentReportForm from '@/components/enrolmentReports/EnrolmentReportForm.vue';
import ViewEnrolmentReports from '@/components/enrolmentReports/ViewEnrolmentReports.vue';
import ViewFundingAgreement from '@/components/fundingAgreements/ViewFundingAgreement.vue';
import MtfiFeeVerification from '@/components/mtfi/CurrentFeeVerification.vue';
import MtfiInfo from '@/components/mtfi/MTFIInfo.vue';
import MtfiSelectFacility from '@/components/mtfi/MtfiSelectFacility.vue';
import ManageFacility from '@/components/orgFacilities/ManageFacility.vue';
import ManageOrgFacilities from '@/components/orgFacilities/ManageOrgFacilities.vue';
import ChangeNotificationDialogue from '@/components/requestChanges/ChangeNotificationDialogue.vue';
import ChangeNotificationForm from '@/components/requestChanges/ChangeNotificationForm.vue';
import ReportChange from '@/components/requestChanges/ReportChanges.vue';
import SummaryDeclarationChangeRequest from '@/components/requestChanges/SummaryDeclarationChangeRequest.vue';
import { useAppStore } from '@/store/app.js';
import { useApplicationStore } from '@/store/application.js';
import { useAuthStore } from '@/store/auth.js';
import { useNavBarStore } from '@/store/navBar.js';
import {
  CHANGE_TYPES,
  NAV_BAR_GROUPS,
  PAGE_TITLES,
  PATHS,
  changeUrl,
  changeUrlGuid,
  pcfUrl,
  pcfUrlGuid,
} from '@/utils/constants.js';
import { SUBTITLE_BANNERS } from '@/utils/constants/SubTitleBanners.js';
import { PERMISSIONS } from '@/utils/constants/permissions.js';
import { formatFiscalYearName } from '@/utils/format';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: PATHS.ROOT.HOME,
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
      component: ErrorPage,
    },
    {
      path: '/logout',
      name: 'logout',
      component: Logout,
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: UnauthorizedView,
    },
    {
      path: '/session-expired',
      name: 'session-expired',
      component: SessionExpired,
    },
    {
      path: '/login-error',
      name: 'login-error',
      component: LoginError,
    },
    {
      path: '/facility-search',
      name: 'facility-search',
      component: SearchFacility,
      meta: {
        pageTitle: PAGE_TITLES.SearchFacility,
      },
    },
    {
      path: PATHS.ROOT.ESTIMATOR,
      name: 'ccfri-estimator',
      component: CcfriEstimator,
      meta: {
        pageTitle: PAGE_TITLES.FRICalculator,
      },
    },
    {
      path: pcfUrl(PATHS.SELECT_APPLICATION_TYPE),
      name: 'Select CCOF Application Type',
      component: CcofApplicationTypeSelector,
      meta: {
        requiresAuth: true,
        subtitleBanner: SUBTITLE_BANNERS.APPLICATION,
        permission: PERMISSIONS.CREATE_NEW_APPLICATION,
      },
    },
    {
      path: pcfUrl(PATHS.NEW_APPLICATION_INTERMEDIATE),
      name: 'Confirm this is a New Application and not a Renewal',
      component: CcofNewApplicationIntermediate,
      meta: {
        requiresAuth: true,
        subtitleBanner: SUBTITLE_BANNERS.APPLICATION,
        permission: PERMISSIONS.CREATE_NEW_APPLICATION,
      },
    },
    {
      path: pcfUrl(PATHS.CCOF_GROUP_ORG),
      name: 'Group Organization Information',
      component: GroupOrganizationInformation,
      meta: {
        pageTitle: 'Organization Information',
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCOF,
        subtitleBanner: SUBTITLE_BANNERS.APPLICATION,
        permission: [PERMISSIONS.CREATE_NEW_APPLICATION, PERMISSIONS.VIEW_SUBMITTED_PCF],
      },
    },
    {
      path: pcfUrl(PATHS.CCOF_FAMILY_ORG),
      name: 'Family Organization Information',
      component: FamilyOrganization,
      meta: {
        pageTitle: 'Organization Information',
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCOF,
        subtitleBanner: SUBTITLE_BANNERS.APPLICATION,
        permission: [PERMISSIONS.CREATE_NEW_APPLICATION, PERMISSIONS.VIEW_SUBMITTED_PCF],
      },
    },

    {
      path: pcfUrl(PATHS.CCOF_FAMILY_FACILITY),
      name: 'Family Facility Information',
      component: FamilyFacilityInformation,
      meta: {
        pageTitle: 'Family Facility Information',
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCOF,
        subtitleBanner: SUBTITLE_BANNERS.APPLICATION,
      },
    },
    {
      path: pcfUrlGuid(PATHS.CCOF_FAMILY_FACILITY),
      name: 'Family Facility Information GUID',
      component: FamilyFacilityInformation,
      meta: {
        pageTitle: 'Family Facility Information',
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCOF,
        subtitleBanner: SUBTITLE_BANNERS.APPLICATION,
      },
    },
    {
      path: pcfUrl(PATHS.CCOF_FAMILY_FUNDING),
      name: 'FamilyFunding',
      component: FamilyFunding,
      meta: {
        pageTitle: 'Information to Determine Funding amounts',
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCOF,
        subtitleBanner: SUBTITLE_BANNERS.APPLICATION,
      },
    },
    {
      path: pcfUrlGuid(PATHS.CCOF_FAMILY_FUNDING),
      name: 'FamilyFunding GUID',
      component: FamilyFunding,
      meta: {
        pageTitle: 'Information to Determine Funding amounts',
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCOF,
        subtitleBanner: SUBTITLE_BANNERS.APPLICATION,
      },
    },
    {
      path: pcfUrl(PATHS.CCOF_GROUP_FACILITY),
      name: 'Facility Information',
      component: FacilityInformation,
      meta: {
        pageTitle: 'Facility Information',
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCOF,
        subtitleBanner: SUBTITLE_BANNERS.APPLICATION,
        permission: [PERMISSIONS.CREATE_NEW_APPLICATION, PERMISSIONS.VIEW_SUBMITTED_PCF],
      },
    },
    {
      path: pcfUrlGuid(PATHS.CCOF_GROUP_FACILITY),
      name: 'Facility Information Guid',
      component: FacilityInformation,
      meta: {
        pageTitle: 'Facility Information',
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCOF,
        subtitleBanner: SUBTITLE_BANNERS.APPLICATION,
        permission: [PERMISSIONS.CREATE_NEW_APPLICATION, PERMISSIONS.VIEW_SUBMITTED_PCF],
      },
    },
    {
      path: pcfUrl(PATHS.CCOF_GROUP_FUNDING),
      name: 'Funding Amount',
      component: GroupFundAmount,
      meta: {
        pageTitle: 'Information to Determine Funding amounts',
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCOF,
        subtitleBanner: SUBTITLE_BANNERS.APPLICATION,
        permission: [PERMISSIONS.CREATE_NEW_APPLICATION, PERMISSIONS.VIEW_SUBMITTED_PCF],
      },
    },
    {
      path: pcfUrlGuid(PATHS.CCOF_GROUP_FUNDING),
      name: 'Funding Amount Guid',
      component: GroupFundAmount,
      meta: {
        pageTitle: 'Information to Determine Funding amounts',
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCOF,
        subtitleBanner: SUBTITLE_BANNERS.APPLICATION,
        permission: [PERMISSIONS.CREATE_NEW_APPLICATION, PERMISSIONS.VIEW_SUBMITTED_PCF],
      },
    },
    {
      path: pcfUrl(PATHS.CCOF_GROUP_CONFIRM),
      name: 'Application Confirmation',
      component: ApplicationConfirmation,
      meta: {
        pageTitle: 'Application Confirmation',
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCOF,
        subtitleBanner: SUBTITLE_BANNERS.APPLICATION,
      },
    },
    {
      path: pcfUrl(PATHS.LICENSE_UPLOAD),
      name: 'Licence Upload',
      component: LicenseUpload,
      meta: {
        pageTitle: 'Licence Upload',
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCOF,
        subtitleBanner: SUBTITLE_BANNERS.APPLICATION,
      },
    },
    {
      path: changeUrl(PATHS.LICENSE_UPLOAD),
      name: 'Change Request Licence Upload',
      component: LicenseUpload,
      meta: {
        pageTitle: 'Licence Upload',
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCOF,
        subtitleBanner: SUBTITLE_BANNERS.ADDFACILITY,
      },
    },
    {
      path: pcfUrl(PATHS.RENEW_CONFIRM),
      name: 'Renew Organization',
      component: RenewOrganization,
      meta: {
        pageTitle: 'Renew Organization',
        requiresAuth: true,
        showNavBar: false,
        subtitleBanner: SUBTITLE_BANNERS.APPLICATION,
      },
    },
    {
      path: pcfUrl(PATHS.ECEWE_ELIGIBILITY),
      name: 'ECEWE Eligibility',
      component: EceweEligibility,
      meta: {
        pageTitle: PAGE_TITLES.ECEWE_APPLICATION,
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.ECEWE,
        subtitleBanner: SUBTITLE_BANNERS.APPLICATION,
      },
    },
    {
      path: pcfUrl(PATHS.ECEWE_FACILITITES),
      name: 'ECEWE Facilities',
      component: EceweFacilities,
      meta: {
        pageTitle: PAGE_TITLES.ECEWE_APPLICATION,
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.ECEWE,
        subtitleBanner: SUBTITLE_BANNERS.APPLICATION,
      },
    },
    {
      path: pcfUrl(PATHS.SUPPORTING_DOCS),
      name: 'Supporting Document Upload',
      component: SupportingDocumentUpload,
      meta: {
        pageTitle: PAGE_TITLES.SUPPORTING_DOCUMENT_UPLOAD,
        requiresAuth: true,
        showNavBar: true,
        subtitleBanner: SUBTITLE_BANNERS.APPLICATION,
      },
    },
    {
      path: pcfUrl(PATHS.SUMMARY_DECLARATION),
      name: 'Summary and Declaration',
      component: SummaryDeclaration,
      meta: {
        pageTitle: PAGE_TITLES.SUMMARY_DECLARATION,
        requiresAuth: true,
        showNavBar: true,
        subtitleBanner: SUBTITLE_BANNERS.APPLICATION,
      },
    },
    {
      path: pcfUrl(PATHS.CCFRI_HOME),
      name: 'ccfri-home',
      component: CcfriEceLandingPage,
      meta: {
        pageTitle: 'CCFRI Home',
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCFRI,
        requiresAuth: true,
        subtitleBanner: SUBTITLE_BANNERS.APPLICATION,
      },
    },
    {
      path: pcfUrl(PATHS.CCFRI_NEW_FEES),
      name: 'ccfri-add-fees',
      component: AddNewFees,
      meta: {
        pageTitle: 'CCFRI Add New Fees',
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCFRI,
        requiresAuth: true,
        subtitleBanner: SUBTITLE_BANNERS.APPLICATION,
      },
    },
    {
      path: pcfUrlGuid(PATHS.CCFRI_NEW_FEES),
      name: 'ccfri-add-fees-guid',
      component: AddNewFees,
      meta: {
        pageTitle: 'CCFRI Add New Fees',
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCFRI,
        requiresAuth: true,
        subtitleBanner: SUBTITLE_BANNERS.APPLICATION,
      },
    },
    {
      path: pcfUrlGuid(PATHS.CCFRI_RFI),
      name: 'ccfri-request-info',
      component: CCFRIRequestMoreInfo,
      meta: {
        pageTitle: 'CCFRI Request More Info',
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCFRI,
        requiresAuth: true,
        subtitleBanner: SUBTITLE_BANNERS.APPLICATION,
      },
    },
    {
      path: pcfUrlGuid(PATHS.CCFRI_NMF),
      name: 'new-facilities',
      component: NMF,
      meta: {
        pageTitle: 'New Facilities',
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCFRI,
        requiresAuth: true,
        subtitleBanner: SUBTITLE_BANNERS.APPLICATION,
      },
    },
    {
      path: pcfUrlGuid(PATHS.CCFRI_CURRENT_FEES),
      name: 'ccfri-current-fees-guid',
      component: currentFees,
      meta: {
        pageTitle: 'CCFRI Current Fees',
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCFRI,
        requiresAuth: true,
        subtitleBanner: SUBTITLE_BANNERS.APPLICATION,
      },
    },
    {
      path: pcfUrl(PATHS.CCFRI_CURRENT_FEES),
      name: 'ccfri-current-fees',
      component: currentFees,
      meta: {
        pageTitle: 'CCFRI Current Fees',
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCFRI,
        requiresAuth: true,
        subtitleBanner: SUBTITLE_BANNERS.APPLICATION,
      },
    },
    {
      path: pcfUrlGuid(PATHS.CCFRI_CLOSURES),
      name: 'ccfri-closures-guid',
      component: Closures,
      meta: {
        pageTitle: PAGE_TITLES.CCFRI_CLOSURES,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCFRI,
        requiresAuth: true,
        subtitleBanner: SUBTITLE_BANNERS.APPLICATION,
      },
    },
    {
      path: pcfUrlGuid(PATHS.CCFRI_AFS),
      name: 'ccfri-afs',
      component: ApprovableFeeSchedule,
      meta: {
        pageTitle: 'Approvable Fee Schedule',
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCFRI,
        requiresAuth: true,
        subtitleBanner: SUBTITLE_BANNERS.APPLICATION,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        pageTitle: PAGE_TITLES.LOGIN,
      },
    },
    {
      path: '/internal',
      name: 'ministry login',
      component: MinistryLogin,
      meta: {
        pageTitle: PAGE_TITLES.LOGIN,
      },
    },
    {
      path: PATHS.ROOT.IMPERSONATE,
      name: 'impersonate',
      component: Impersonate,
      meta: {
        pageTitle: 'Impersonate a BCeID User',
        requiresAuth: true,
      },
    },
    {
      path: PATHS.ROOT.MESSAGES,
      name: 'messagesPage',
      component: MessagesPage,
      meta: {
        pageTitle: 'Messages Page',
        requiresAuth: true,
      },
    },
    {
      path: '/token-expired',
      name: 'backend-session-expired',
      component: BackendSessionExpired,
    },
    {
      path: PATHS.ROOT.CHANGE_LANDING,
      name: 'Report Change',
      component: ReportChange,
      meta: {
        pageTitle: 'Report Changes',
        showNavBar: false,
        requiresAuth: true,
      },
    },
    {
      path: changeUrl(PATHS.CHANGE_NOTIFICATION_FORM, ':changeRecGuid', CHANGE_TYPES.CHANGE_NOTIFICATION),
      name: 'change-notification-form',
      component: ChangeNotificationForm,
      meta: {
        pageTitle: 'Change Notification Form',
        showNavBar: false,
        requiresAuth: true,
      },
    },
    {
      path: changeUrlGuid(
        PATHS.CHANGE_NOTIFICATION_FORM,
        ':changeRecGuid',
        ':urlGuid',
        CHANGE_TYPES.CHANGE_NOTIFICATION,
      ),
      name: 'change-notification-form-guid',
      component: ChangeNotificationForm,
      meta: {
        pageTitle: 'Change Notification Form',
        showNavBar: false,
        requiresAuth: true,
        subtitleBanner: SUBTITLE_BANNERS.CHANGENOTIFICATION,
      },
    },
    {
      path: changeUrlGuid(PATHS.CHANGE_NEW_FACILITY_OTHER),
      name: 'new-facility-other-guid',
      component: ChangeNotificationForm,
      meta: {
        pageTitle: 'Change Notification Form',
        showNavBar: true,
        requiresAuth: true,
        subtitleBanner: SUBTITLE_BANNERS.ADDFACILITY,
      },
    },
    {
      path: changeUrl(PATHS.CHANGE_NOTIFICATION_DIALOGUE),
      name: 'change-notification-dialogue',
      component: ChangeNotificationDialogue,
      meta: {
        pageTitle: 'Change Notification Dialogue',
        showNavBar: false,
        requiresAuth: true,
      },
    },
    {
      path: PATHS.CHANGE_NOTIFICATION_DIALOGUE,
      name: 'change-notification-dialogue-guid',
      component: ChangeNotificationDialogue,
      meta: {
        pageTitle: 'Change Notification Dialogue',
        showNavBar: false,
        requiresAuth: true,
      },
    },
    {
      path: PATHS.ROOT.CHANGE_NEW_FACILITY, //TODO. there is no change request here.
      name: 'change-request-facility-information',
      component: FacilityInformation,
      meta: {
        pageTitle: 'change-request-facility-information',
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCOF,
        subtitleBanner: SUBTITLE_BANNERS.ADDFACILITY,
      },
    },
    {
      path: changeUrl(PATHS.CCOF_GROUP_FACILITY),
      name: 'existing-change-request-facility-information',
      component: FacilityInformation,
      meta: {
        pageTitle: 'change-request-facility-information',
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCOF,
        subtitleBanner: SUBTITLE_BANNERS.ADDFACILITY,
      },
    },
    {
      path: changeUrlGuid(PATHS.CCOF_GROUP_FACILITY),
      name: 'change-request-facility-information-guid',
      component: FacilityInformation,
      meta: {
        pageTitle: 'Facility Information',
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCOF,
        subtitleBanner: SUBTITLE_BANNERS.ADDFACILITY,
      },
    },
    {
      path: changeUrlGuid(PATHS.CCOF_GROUP_FUNDING),
      name: 'change-request-funding-guid',
      component: GroupFundAmount,
      meta: {
        pageTitle: 'Information to Determine Funding amounts',
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCOF,
        subtitleBanner: SUBTITLE_BANNERS.ADDFACILITY,
      },
    },
    {
      path: changeUrl(PATHS.CCOF_GROUP_CONFIRM),
      name: 'change-request-new-facility-confirmation',
      component: ApplicationConfirmation,
      meta: {
        pageTitle: 'Application Confirmation',
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCOF,
        subtitleBanner: SUBTITLE_BANNERS.ADDFACILITY,
      },
    },
    {
      path: changeUrl(PATHS.CCFRI_HOME),
      name: 'change-request-ccfri-home',
      component: CcfriEceLandingPage,
      meta: {
        pageTitle: 'CCFRI Home',
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCFRI,
        requiresAuth: true,
        subtitleBanner: SUBTITLE_BANNERS.ADDFACILITY,
      },
    },
    {
      path: changeUrlGuid(PATHS.CCFRI_NEW_FEES),
      name: 'change-request-ccfri-add-fees-guid',
      component: AddNewFees,
      meta: {
        pageTitle: 'CCFRI Add New Fees',
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCFRI,
        requiresAuth: true,
        subtitleBanner: SUBTITLE_BANNERS.ADDFACILITY,
      },
    },
    {
      path: changeUrlGuid(PATHS.CCFRI_RFI),
      name: 'change-request-ccfri-request-info',
      component: CCFRIRequestMoreInfo,
      meta: {
        pageTitle: 'CCFRI Request More Info',
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCFRI,
        requiresAuth: true,
        subtitleBanner: SUBTITLE_BANNERS.ADDFACILITY,
      },
    },
    {
      path: changeUrlGuid(PATHS.CCFRI_NMF),
      name: 'change-request-new-facilities',
      component: NMF,
      meta: {
        pageTitle: 'New Facilities',
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCFRI,
        requiresAuth: true,
        subtitleBanner: SUBTITLE_BANNERS.ADDFACILITY,
      },
    },
    {
      path: changeUrlGuid(PATHS.CCFRI_CLOSURES),
      name: 'change-request-ccfri-closures-guid',
      component: Closures,
      meta: {
        pageTitle: PAGE_TITLES.CCFRI_CLOSURES,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCFRI,
        requiresAuth: true,
        subtitleBanner: SUBTITLE_BANNERS.ADDFACILITY,
      },
    },
    {
      path: changeUrl(PATHS.ECEWE_ELIGIBILITY),
      name: 'change-request-ECEWE-Eligibility',
      component: EceweEligibility,
      meta: {
        pageTitle: PAGE_TITLES.ECEWE_APPLICATION,
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.ECEWE,
        subtitleBanner: SUBTITLE_BANNERS.ADDFACILITY,
      },
    },
    {
      path: changeUrl(PATHS.ECEWE_FACILITITES),
      name: 'change-request-ECEWE-Facilities',
      component: EceweFacilities,
      meta: {
        pageTitle: PAGE_TITLES.ECEWE_APPLICATION,
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.ECEWE,
        subtitleBanner: SUBTITLE_BANNERS.ADDFACILITY,
      },
    },
    {
      path: changeUrl(PATHS.SUPPORTING_DOCS),
      name: 'change-request-Supporting-Document-Upload',
      component: SupportingDocumentUpload,
      meta: {
        pageTitle: PAGE_TITLES.SUPPORTING_DOCUMENT_UPLOAD,
        requiresAuth: true,
        showNavBar: true,
        subtitleBanner: SUBTITLE_BANNERS.ADDFACILITY,
      },
    },
    {
      path: changeUrl(PATHS.SUMMARY_DECLARATION),
      name: 'Summary and Declaration New Facility',
      component: SummaryDeclaration,
      meta: {
        pageTitle: PAGE_TITLES.SUMMARY_DECLARATION,
        requiresAuth: true,
        showNavBar: true,
        subtitleBanner: SUBTITLE_BANNERS.ADDFACILITY,
      },
    },
    {
      path: PATHS.MTFI_INFO,
      name: 'Midterm-Fee-Increase-Information',
      component: MtfiInfo,
      meta: {
        pageTitle: PAGE_TITLES.MTFI,
        requiresAuth: true,
        showNavBar: false,
        subtitleBanner: SUBTITLE_BANNERS.MTFI,
      },
    },
    {
      path: changeUrl(PATHS.MTFI_GROUP_SELECT_FACILITY, ':changeRecGuid', CHANGE_TYPES.MTFI),
      name: 'Midterm Fee Increase Select Facilities',
      component: MtfiSelectFacility,
      meta: {
        pageTitle: PAGE_TITLES.MTFI,
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.MTFI,
        subtitleBanner: SUBTITLE_BANNERS.MTFI,
      },
    },
    {
      path: changeUrlGuid(PATHS.MTFI_GROUP_FEE_VERIFICATION, ':changeRecGuid', ':urlGuid', CHANGE_TYPES.MTFI),
      name: 'CCFRI Fee Verification',
      component: MtfiFeeVerification,
      meta: {
        pageTitle: PAGE_TITLES.MTFI,
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.MTFI,
        subtitleBanner: SUBTITLE_BANNERS.MTFI,
      },
    },
    {
      path: changeUrlGuid(PATHS.MTFI_AFS, ':changeRecGuid', ':urlGuid', CHANGE_TYPES.MTFI),
      name: 'mtfi-afs',
      component: ApprovableFeeSchedule,
      meta: {
        pageTitle: PAGE_TITLES.MTFI,
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.MTFI,
        subtitleBanner: SUBTITLE_BANNERS.MTFI,
      },
    },
    {
      path: changeUrl(PATHS.SUMMARY_DECLARATION, ':changeRecGuid', CHANGE_TYPES.CHANGE_NOTIFICATION),
      name: 'Summary and Declaration Change Notification Form',
      component: SummaryDeclarationChangeRequest,
      meta: {
        pageTitle: 'Change Notification Form',
        showNavBar: false,
        requiresAuth: true,
        subtitleBanner: SUBTITLE_BANNERS.CHANGENOTIFICATION,
      },
    },
    {
      path: changeUrl(PATHS.SUMMARY_DECLARATION, ':changeRecGuid', CHANGE_TYPES.MTFI),
      name: 'Summary and Declaration MTFI',
      component: SummaryDeclarationChangeRequest,
      meta: {
        pageTitle: PAGE_TITLES.MTFI,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.MTFI,
        requiresAuth: true,
        subtitleBanner: SUBTITLE_BANNERS.MTFI,
      },
    },
    {
      path: changeUrlGuid(PATHS.CCFRI_RFI, ':changeRecGuid', ':urlGuid', CHANGE_TYPES.MTFI),
      name: 'mtfi-change-request-ccfri-request-info',
      component: CCFRIRequestMoreInfo,
      meta: {
        pageTitle: PAGE_TITLES.MTFI,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.MTFI,
        requiresAuth: true,
        subtitleBanner: SUBTITLE_BANNERS.MTFI,
      },
    },
    {
      path: PATHS.ROOT.SUBMISSION_HISTORY,
      name: 'submission-history',
      component: SubmissionHistory,
      meta: {
        pageTitle: 'submission-history',
        showNavBar: false,
        requiresAuth: true,
        permission: PERMISSIONS.DOWNLOAD_PCF_PDF,
      },
    },
    {
      path: PATHS.ROOT.MANAGE_ORG_FACILITIES,
      name: 'manage-org-facilities',
      component: ManageOrgFacilities,
      meta: {
        requiresAuth: true,
        permission: PERMISSIONS.VIEW_ORG_INFORMATION,
      },
    },
    {
      path: `${PATHS.ROOT.MANAGE_FACILITY}/:facilityId`,
      name: 'manage-facility',
      component: ManageFacility,
      meta: {
        requiresAuth: true,
        permission: PERMISSIONS.VIEW_FACILITY_INFORMATION,
      },
    },
    {
      path: `${PATHS.ROOT.FUNDING_AGREEMENTS}/:fundingAgreementId`,
      name: 'view-funding-agreement',
      component: ViewFundingAgreement,
      meta: {
        requiresAuth: true,
        permission: PERMISSIONS.VIEW_FUNDING_AGREEMENT,
      },
    },
    {
      path: PATHS.ROOT.MANAGE_USERS,
      name: 'manage-users',
      component: ManageUsers,
      meta: {
        requiresAuth: true,
        permission: PERMISSIONS.VIEW_USERS,
      },
    },
    {
      path: `${PATHS.ROOT.CLOSURES}/:programYearGuid`,
      name: 'organization-closures',
      component: OrganizationClosures,
      meta: {
        pageTitle: PAGE_TITLES.ORGANIZATION_CLOSURES,
        showNavBar: false,
        requiresAuth: true,
        permission: PERMISSIONS.VIEW_CLOSURES,
      },
    },
    {
      path: PATHS.ROOT.ENROLMENT_REPORTS,
      name: 'view-enrolment-reports',
      component: ViewEnrolmentReports,
      meta: {
        pageTitle: PAGE_TITLES.ENROLMENT_REPORTS,
        showNavBar: false,
        requiresAuth: true,
        permission: PERMISSIONS.VIEW_ER,
      },
    },
    {
      path: `${PATHS.ROOT.ENROLMENT_REPORTS}/:enrolmentReportId`,
      name: 'enrolment-report-form',
      component: EnrolmentReportForm,
      meta: {
        requiresAuth: true,
        permission: PERMISSIONS.VIEW_ER,
      },
    },
    {
      path: `${PATHS.ROOT.ENROLMENT_REPORTS}/:enrolmentReportId/declaration`,
      name: 'enrolment-report-declaration',
      component: EnrolmentReportDeclaration,
      meta: {
        requiresAuth: true,
        permission: PERMISSIONS.SUBMIT_ENROLMENT_REPORT,
      },
    },
    {
      path: '/:catchAll(.*)',
      name: 'notfound',
      redirect: '/',
      meta: {
        requiresAuth: true,
      },
    },
  ],
  scrollBehavior: function (to, _from, _savedPosition) {
    if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }
  },
});

router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAuth) {
    const authStore = useAuthStore();
    authStore
      .getJwtToken()
      .then(() => {
        if (!authStore.isAuthenticated) {
          next('/token-expired');
        } else {
          authStore
            .getUserInfo(to)
            .then(async () => {
              if (!authStore.isMinistryUser) {
                // Validate Provider roles
                if (isEmpty(authStore.userInfo?.role)) {
                  return next('unauthorized');
                }
                // TODO: Validate Facilities for Facility Admin
                // if (!authStore.hasFacilities) {
                //   return next('unauthorized');
                // }
                // Validate specific permission
                if (to.meta.permission && !authStore.hasPermission(to.meta.permission)) {
                  return next('unauthorized');
                }
                // Block access to Impersonate
                if (to.name === 'impersonate') {
                  return next('unauthorized');
                }
              }

              const navBarStore = useNavBarStore();
              await navBarStore.setUrlDetails(to);
              if (authStore.isMinistryUser && !authStore.impersonateId && to.path !== PATHS.ROOT.IMPERSONATE) {
                next(PATHS.ROOT.IMPERSONATE);
              } else {
                next();
              }
            })
            .catch((error) => {
              console.log('error', error);
              if (error.response?.status == '401') {
                next('unauthorized');
              } else {
                console.log('An error occurred.', error);
                next('error');
              }
            });
        }
      })
      .catch(() => {
        if (!authStore.userInfo) {
          next('/login');
        } else {
          next('/token-expired');
        }
      });
  } else {
    next();
  }
});

router.afterEach((to) => {
  // determine if we should show navBar
  const appStore = useAppStore();
  const navBarStore = useNavBarStore();
  const applicationStore = useApplicationStore();
  appStore.setShowNavBar(to.meta?.showNavBar == true);
  if (to && to.meta) {
    navBarStore.setNavBarGroup(to.meta.navBarGroup);
  } else {
    navBarStore.setNavBarGroup('');
  }
  // this section is to set page title in vue store
  if (to && to.meta) {
    appStore.setPageTitle(to.meta.pageTitle);
  } else {
    appStore.setPageTitle('');
  }
  let nextApp = appStore?.programYearList?.list?.find(
    (el) => el.previousYearId === applicationStore.latestProgramYearId,
  );
  if (to?.meta?.subtitleBanner) {
    if (to?.meta?.subtitleBanner?.startsWith('%PROGRAMYEAR%')) {
      if (to?.meta?.pageTitle === 'Renew Organization') {
        appStore.setSubtitleBanner(
          to.meta.subtitleBanner.replace('%PROGRAMYEAR%', formatFiscalYearName(nextApp?.name)),
        );
      } else if (!applicationStore.formattedProgramYear) {
        appStore.setSubtitleBanner(
          to.meta.subtitleBanner.replace('%PROGRAMYEAR%', formatFiscalYearName(appStore.programYearList?.newApp?.name)),
        );
      } else {
        appStore.setSubtitleBanner(
          to.meta.subtitleBanner.replace('%PROGRAMYEAR%', applicationStore.formattedProgramYear),
        );
      }
    } else {
      appStore.setSubtitleBanner(to.meta.subtitleBanner);
    }
  } else {
    appStore.setSubtitleBanner('');
  }
});

export default router;
