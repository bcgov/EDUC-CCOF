const baseRoot = '/api';
const authRoot = baseRoot + '/auth';

let object;

object = {
  LOGIN: authRoot + '/login',
  LOGIN_IDIR: authRoot + '/login-idir',
  DASHBOARD: '/',
  LOGOUT: authRoot + '/logout',
  SESSION_EXPIRED: authRoot + '/logout?sessionExpired=true',
  LOGIN_FAILED: authRoot + '/logout?loginError=true',
  REFRESH: authRoot + '/refresh',
  TOKEN: authRoot + '/token',
  SESSION_REMAINING_TIME: authRoot + '/user-session-remaining-time',
  ORGANIZATION: baseRoot + 'organization'
};
//Authentication endpoints
export const AuthRoutes = Object.freeze(object);

export const ApiRoutes = Object.freeze({
  USER: baseRoot + '/user',
  LOOKUP: baseRoot + '/config/lookup',
  ORGANIZATION: baseRoot + '/organization',
  FACILITY: baseRoot + '/facility',
  CCFRIFACILITY : baseRoot + '/facility/ccfri',
  LICENSE_UPLOAD: baseRoot + '/licenseUpload',
  GROUP_FUND_AMOUNT: baseRoot + '/group/funding',
  FAMILY_FUND_AMOUNT: baseRoot + '/family/funding',
  FAMILY_ELIGIBILITY: baseRoot + '/family/eligibility',
  FAMILY_ORGANIZATION: baseRoot + '/family/organization',
  MESSAGE: baseRoot + '/messages',
  APPLICATION_ECEWE: baseRoot + '/application/ecewe',
  APPLICATION_ECEWE_FACILITY: baseRoot + '/application/ecewe/facilities',
  APPLICATION_RENEW: baseRoot + '/application/renew-ccof',
  APPLICATION_RFI: baseRoot + '/application/ccfri',
  APPLICATION_NMF: baseRoot + '/application/ccfri',
  SUPPORTING_DOCUMENT_UPLOAD:baseRoot+'/supportingDocument',
  APPLICATION_DECLARATION: baseRoot + '/application/declaration',
  APPLICATION_DECLARATION_SUBMIT: baseRoot + '/application/declaration/submit',
  APPLICATION_SUMMARY: baseRoot + '/application/summary',
  SYSTEM_MESSAGES: baseRoot + '/public/systemMessages'
});

export const PAGE_TITLES = Object.freeze({
  FACILITY_SELECTION: 'Facility Selection',
  LOGIN: 'Login',
  FRI_CALCULATOR: 'Fee Reduction Calculator',
  LANDING_PAGE: 'What would you like to do',
  ORGANIZATION_SELECT: 'Organizations',
  CCRFI_APPLICATION: 'CCRFI Application Form',
  ECEWE_APPLICATION: 'ECE-WE Application',
  SUMMARY_DECLARATION: 'Summary and Declaration',
  SUPPORTING_DOCUMENT_UPLOAD: 'Supporting Document Upload'
});

export const PATHS = {
  home: '/',
  estimator: '/ccfri-estimator',
  ccfriHome: '/ccfriApplication/group/CcfriEceLanding',
  addNewFees: '/ccfriApplication/group/add-new-fees',
  currentFees: '/ccfriApplication/group/current-fees',
  ccfriRequestMoreInfo: '/ccfri-application/request-info/landing',
  WageIncrease: '/ccfri-application/request-info/wage-increase',
  ServiceExpansion: '/ccfri-application/request-info/service-expansion',
  IndigenousServiceExpansion: '/ccfri-application/request-info/indigenous-service-expansion',
  UnderservedPop: '/ccfri-application/request-info/underserved-populations',
  NMF: '/ccfri-application/request-info/new-facilities',
  selectApplicationType: '/ccof-application/select-application-type',
  impersonate: '/impersonate',
  group: {
    orgInfo: '/ccof-application/group/organization',
    facInfo: '/ccof-application/group/facility',
    fundAmount: '/ccof-application/group/funding',
    confirmation: '/ccof-application/group/confirmation',
    licenseUpload: '/ccof-application/group/licenseUpload',
    renewOrganization: '/ccof-application/group/renew',
  },
  family: {
    orgInfo: '/ccof-application/family/organization',
    eligibility: '/ccof-application/family/eligibility',
    fundAmount: '/ccof-application/family/funding',
  },
  eceweDocUpload: '/ecewe-document-upload',
  eceweEligibility: '/ecewe-eligibility',
  eceweFacilities: '/ecewe-facilities',
  summaryDeclaration:  '/summary-declaration',
  messagesPage: '/messages',
  supportingDocumentUpload: '/supporting-document-upload',
  reportChange: '/report-change/landing'
};

export const NAV_BAR_GROUPS = {
  CCOF: 'CCOF',
  CCFRI: 'CCFRI',
  RFI: 'RFI',
  NMF: 'NMF',
  ECEWE: 'ECE-WE'
};

export const ORGANIZATION_PROVIDER_TYPES = {
  GROUP: 100000000,
  FAMILY: 100000001,
};

export const MINISTRY_NAME = 'Ministry of Education and Child Care';

export const CCFRI_Categories = [
  'Group Under 18 Months',
  'Group 18 - 36 months',
  'Family Under 18 months',
  'Family 18 - 36 months',
  'Group 3 years to Kindergarten',
  'Family 3 years to Kindergarten',
  'Group Before & After School (Kindergarten only)',
  'Family Before & After School (Kindergarten only)'
];


