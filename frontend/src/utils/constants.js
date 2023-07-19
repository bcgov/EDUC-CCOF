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
  APPLICATION_CHANGE_REQUEST: baseRoot + '/application/changeRequest',
  SUPPORTING_DOCUMENT_UPLOAD:baseRoot+'/supportingDocument',
  APPLICATION_DECLARATION: baseRoot + '/application/declaration',
  APPLICATION_DECLARATION_SUBMIT: baseRoot + '/application/declaration/submit',
  APPLICATION_SUMMARY: baseRoot + '/application/summary',
  SYSTEM_MESSAGES: baseRoot + '/public/systemMessages',
  CHANGE_REQUEST_NEW_FAC: baseRoot + '/changeRequest/newFacility',
  CHANGE_REQUEST: baseRoot + '/changeRequest/',
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

export const CHANGE_URL_PREFIX = '/report-change';

/*******************************************************
 *
 * APPLICATION PATHS
 * Paths will be set up using PREFIX/guid/SUFFIX/guid
 * such as:  /pcf/${yearGuid}/facility/${facilityGuid}
 *
 *
 ******************************************************/

export const PATHS = {
  //Root paths don't require a prefix/suffix
  ROOT: {
    HOME: '/',
    ESTIMATOR: '/ccfri-estimator',
    IMPERSONATE: '/impersonate',
    MESSAGES: '/messages',
    CHANGE_LANDING: '/change/landing',
    CHANGE_NEW_FACILITY: '/change/group/facility'
  },
  PREFIX: {
    PCF: '/pcf',
    CHANGE_REQUEST: '/change',
  },
  //These are all suffixes.
  SELECT_APPLICATION_TYPE: '/select-application-type',
  RENEW_CONFIRM: '/group/renew',

  CCOF_GROUP_ORG: '/group/organization',
  CCOF_GROUP_FACILITY: '/group/facility',
  CCOF_GROUP_FUNDING: '/group/funding',
  CCOF_GROUP_CONFIRM: '/group/confirmation',

  CCOF_FAMILY_ORG: '/family/organization',
  CCOF_FAMILY_ELIGIBILITY: '/family/eligibility',
  CCOF_FAMILY_FUNDING: '/family/funding',

  CCFRI_HOME: '/ccfri',
  CCFRI_CURRENT_FEES: '/ccfri/current-fees',
  CCFRI_NEW_FEES: '/ccfri/new-fees',
  CCFRI_RFI: '/ccfri/req-info',
  CCFRI_NMF: '/ccfri/req-info/new-facility',

  ECEWE_ELIGIBILITY: '/ecewe-eligibility',
  ECEWE_FACILITITES: '/ecewe-facilities',

  LICENSE_UPLOAD: '/licenseUpload',
  SUPPORTING_DOCS: '/supporting-documents',

  SUMMARY_DECLARATION:  '/summary-declaration',

  //Report Change prefix's
  CHANGE_NOTIFICATION_FORM: `${CHANGE_URL_PREFIX}/notification-form`,
  CHANGE_MTFI: 'midterm-fee-increase',
  CHANGE_NOTIFICATION_DECLARATION: '/notification-declaration',
  CHANGE_NEW_FACILITY_OTHER: '/other-changes',
};

//Some helper classes to build the URL consistently
export function pcfUrl(suffix, programYearGuid = ':programYearGuid') {
  return `${PATHS.PREFIX.PCF}/${programYearGuid}${suffix}`;
}

export function pcfUrlGuid(suffix, programYearGuid = ':programYearGuid', urlGuid = ':urlGuid') {
  return `${PATHS.PREFIX.PCF}/${programYearGuid}${suffix}/${urlGuid}`;
}

export function changeUrl(suffix, changeRecGuid = ':changeRecGuid') {
  return `${PATHS.PREFIX.CHANGE_REQUEST}/${changeRecGuid}${suffix}`;
}

export function changeUrlGuid(suffix, changeRecGuid = ':changeRecGuid', urlGuid = ':urlGuid') {
  return `${PATHS.PREFIX.CHANGE_REQUEST}/${changeRecGuid}${suffix}/${urlGuid}`;
}


export const NAV_BAR_GROUPS = {
  CCOF: 'CCOF',
  CCFRI: 'CCFRI',
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



