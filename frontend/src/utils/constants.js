const baseRoot = '/api';
const authRoot = baseRoot + '/auth';

let object;

object = {
  LOGIN: authRoot + '/login',
  LOGIN_IDIR: authRoot + '/login',
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
  GROUP_FUND_AMOUNT: baseRoot + '/group/funding',
  FAMILY_FUND_AMOUNT: baseRoot + '/family/funding',
  FAMILY_ELIGIBILITY: baseRoot + '/family/eligibility',
  FAMILY_ORGANIZATION: baseRoot + '/family/organization'
});

export const PAGE_TITLES = Object.freeze({
  FACILITY_SELECTION: 'Facility Selection',
  LOGIN: 'Login',
  FRI_CALCULATOR: 'Fee Reduction Calculator',
  LANDING_PAGE: 'What would you like to do',
  ORGANIZATION_SELECT: 'Organizations',
  CCRFI_APPLICATION: 'CCRFI Application Form'
});

export const PATHS = {
  home: '/',
  estimator: '/ccfri-estimator',
  ccfriHome: '/ccfriApplication/group/CcfriEceLanding',
  addNewFees: '/ccfriApplication/group/add-new-fees',
  currentFees: '/ccfriApplication/group/current-fees',
  ccfriRequestMoreInfo: '/ccfriApplication/group/ccfri-request-info',
  selectApplicationType: '/ccof-application/select-application-type',
  group: {
    orgInfo: '/ccof-application/group/organization',
    facInfo: '/ccof-application/group/facility',
    fundAmount: '/ccof-application/group/funding',
    confirmation: '/ccof-application/group/confirmation',
  },
  family: {
    orgInfo: '/ccof-application/family/organization',
    eligibility: '/ccof-application/family/eligibility',
    fundAmount: '/ccof-application/family/funding',
  },
  documentUpload: '/ecewe-document-upload',
  eceweEligibility: '/ecewe-eligibility',
  eceweFacilities: '/ecewe-facilities',
  eceweSummary:  '/ecewe-summary'
};

export const NAV_BAR_GROUPS = {
  CCOF: 'CCOF',
  CCFRI: 'CCFRI',
  ECEWE: 'ECE-WE'
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


