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
import ApprovableFeeSchedule from '@/components/ccfriApplication/AFS/ApprovableFeeSchedule.vue';
import AddNewFees from '@/components/ccfriApplication/group/AddNewFees.vue';
import CcfriEceLandingPage from '@/components/ccfriApplication/group/CcfriEceLanding.vue';
import currentFees from '@/components/ccfriApplication/group/ExistingFacilityFees.vue';
import CcofApplicationTypeSelector from '@/components/ccofApplication/CcofApplicationTypeSelector.vue';
import RenewOrganization from '@/components/ccofApplication/RenewOrganization.vue';
import Eligibility from '@/components/ccofApplication/family/Eligibility.vue';
import FamilyFunding from '@/components/ccofApplication/family/FamilyFunding.vue';
import FamilyOrganization from '@/components/ccofApplication/family/FamilyOrganization.vue';
import ApplicationConfirmation from '@/components/ccofApplication/group/ApplicationConfirmation.vue';
import FacilityInformation from '@/components/ccofApplication/group/FacilityInformation.vue';
import GroupFundAmount from '@/components/ccofApplication/group/FundAmount.vue';
import LicenseUpload from '@/components/ccofApplication/group/LicenseUpload.vue';
import GroupOrganizationInformation from '@/components/ccofApplication/group/OrganizationInformation.vue';
import Unauthorized from '@/components/common/Unauthorized.vue';
import EceweEligibility from '@/components/eceweApplication/EceweEligibility.vue';
import EceweFacilities from '@/components/eceweApplication/EceweFacilities.vue';
import MtfiFeeVerification from '@/components/mtfi/CurrentFeeVerification.vue';
import MtfiInfo from '@/components/mtfi/MTFIInfo.vue';
import MtfiSelectFacility from '@/components/mtfi/MtfiSelectFacility.vue';
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
import { Subtitle_Banners } from '@/utils/constants/SubTitleBanners.js';
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
      component: Unauthorized,
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
        subtitleBanner: Subtitle_Banners.APPLICATION,
      },
    },
    {
      path: pcfUrl(PATHS.NEW_APPLICATION_INTERMEDIATE),
      name: 'Confirm this is a New Application and not a Renewal',
      component: CcofNewApplicationIntermediate,
      meta: {
        requiresAuth: true,
        subtitleBanner: Subtitle_Banners.APPLICATION,
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
        subtitleBanner: Subtitle_Banners.APPLICATION,
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
        subtitleBanner: Subtitle_Banners.APPLICATION,
      },
    },

    {
      path: pcfUrl(PATHS.CCOF_FAMILY_ELIGIBILITY),
      name: 'Eligibility',
      component: Eligibility,
      meta: {
        pageTitle: 'Information to Determine Eligibility',
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCOF,
        subtitleBanner: Subtitle_Banners.APPLICATION,
      },
    },
    {
      path: pcfUrlGuid(PATHS.CCOF_FAMILY_ELIGIBILITY),
      name: 'Eligibility GUID',
      component: Eligibility,
      meta: {
        pageTitle: 'Information to Determine Eligibility',
        requiresAuth: true,
        showNavBar: true,
        navBarGroup: NAV_BAR_GROUPS.CCOF,
        subtitleBanner: Subtitle_Banners.APPLICATION,
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
        subtitleBanner: Subtitle_Banners.APPLICATION,
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
        subtitleBanner: Subtitle_Banners.APPLICATION,
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
        subtitleBanner: Subtitle_Banners.APPLICATION,
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
        subtitleBanner: Subtitle_Banners.APPLICATION,
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
        subtitleBanner: Subtitle_Banners.APPLICATION,
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
        subtitleBanner: Subtitle_Banners.APPLICATION,
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
        subtitleBanner: Subtitle_Banners.APPLICATION,
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
        subtitleBanner: Subtitle_Banners.APPLICATION,
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
        subtitleBanner: Subtitle_Banners.ADDFACILITY,
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
        subtitleBanner: Subtitle_Banners.APPLICATION,
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
        subtitleBanner: Subtitle_Banners.APPLICATION,
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
        subtitleBanner: Subtitle_Banners.APPLICATION,
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
        subtitleBanner: Subtitle_Banners.APPLICATION,
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
        subtitleBanner: Subtitle_Banners.APPLICATION,
      },
    },
    {
      path: pcfUrl(PATHS.SUMMARY_DECLARATION) + '/printable',
      name: 'Printable Summary',
      component: SummaryDeclaration,
      meta: {
        pageTitle: PAGE_TITLES.SUMMARY_DECLARATION,
        requiresAuth: true,
        showNavBar: false,
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
        subtitleBanner: Subtitle_Banners.APPLICATION,
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
        subtitleBanner: Subtitle_Banners.APPLICATION,
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
        subtitleBanner: Subtitle_Banners.APPLICATION,
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
        subtitleBanner: Subtitle_Banners.APPLICATION,
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
        subtitleBanner: Subtitle_Banners.APPLICATION,
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
        subtitleBanner: Subtitle_Banners.APPLICATION,
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
        subtitleBanner: Subtitle_Banners.APPLICATION,
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
        subtitleBanner: Subtitle_Banners.APPLICATION,
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
        subtitleBanner: Subtitle_Banners.CHANGENOTIFICATION,
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
        subtitleBanner: Subtitle_Banners.ADDFACILITY,
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
        subtitleBanner: Subtitle_Banners.ADDFACILITY,
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
        subtitleBanner: Subtitle_Banners.ADDFACILITY,
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
        subtitleBanner: Subtitle_Banners.ADDFACILITY,
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
        subtitleBanner: Subtitle_Banners.ADDFACILITY,
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
        subtitleBanner: Subtitle_Banners.ADDFACILITY,
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
        subtitleBanner: Subtitle_Banners.ADDFACILITY,
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
        subtitleBanner: Subtitle_Banners.ADDFACILITY,
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
        subtitleBanner: Subtitle_Banners.ADDFACILITY,
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
        subtitleBanner: Subtitle_Banners.ADDFACILITY,
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
        subtitleBanner: Subtitle_Banners.ADDFACILITY,
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
        subtitleBanner: Subtitle_Banners.ADDFACILITY,
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
        subtitleBanner: Subtitle_Banners.ADDFACILITY,
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
        subtitleBanner: Subtitle_Banners.ADDFACILITY,
      },
    },
    {
      path: changeUrl(PATHS.SUMMARY_DECLARATION) + '/printable',
      name: 'Printable Summary and Declaration New Facility',
      component: SummaryDeclaration,
      meta: {
        pageTitle: PAGE_TITLES.SUMMARY_DECLARATION,
        requiresAuth: true,
        showNavBar: false,
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
        subtitleBanner: Subtitle_Banners.MTFI,
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
        subtitleBanner: Subtitle_Banners.MTFI,
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
        subtitleBanner: Subtitle_Banners.MTFI,
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
        subtitleBanner: Subtitle_Banners.MTFI,
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
        subtitleBanner: Subtitle_Banners.CHANGENOTIFICATION,
      },
    },
    {
      path: changeUrl(PATHS.SUMMARY_DECLARATION, ':changeRecGuid', CHANGE_TYPES.CHANGE_NOTIFICATION) + '/printable',
      name: 'Printable Change Notification Summary',
      component: SummaryDeclarationChangeRequest,
      meta: {
        pageTitle: 'Printable Change Notification Summary',
        requiresAuth: true,
        showNavBar: false,
      },
    },
    {
      path: changeUrl(PATHS.SUMMARY_DECLARATION, ':changeRecGuid', CHANGE_TYPES.MTFI) + '/printable',
      name: 'Printable MTFI Summary',
      component: SummaryDeclarationChangeRequest,
      meta: {
        pageTitle: 'Printable MTFI Summary',
        requiresAuth: true,
        showNavBar: false,
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
        subtitleBanner: Subtitle_Banners.MTFI,
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
        subtitleBanner: Subtitle_Banners.MTFI,
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
