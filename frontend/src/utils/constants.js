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
  ORGANIZATION: baseRoot + 'organization',
};
//Authentication endpoints
export const AuthRoutes = Object.freeze(object);

export const ApiRoutes = Object.freeze({
  USER: baseRoot + '/user',
  LOOKUP: baseRoot + '/config/lookup',
  ORGANIZATION: baseRoot + '/organization',
  FACILITY: baseRoot + '/facility',
  CCFRIFACILITY: baseRoot + '/facility/ccfri',
  CCFRI_FEES: baseRoot + '/facility/fees',
  CCFRI_DATES: baseRoot + '/facility/dates',
  LICENSE_UPLOAD: baseRoot + '/licenseUpload',
  GROUP_FUND_AMOUNT: baseRoot + '/group/funding',
  FAMILY_FUND_AMOUNT: baseRoot + '/family/funding',
  FAMILY_ELIGIBILITY: baseRoot + '/family/eligibility',
  FAMILY_ORGANIZATION: baseRoot + '/family/organization',
  MESSAGE: baseRoot + '/messages',
  APPLICATION: baseRoot + '/application',
  APPLICATION_ECEWE: baseRoot + '/application/ecewe',
  APPLICATION_ECEWE_FACILITY: baseRoot + '/application/ecewe/facilities',
  APPLICATION_RENEW: baseRoot + '/application/renew-ccof',
  APPLICATION_CCFRI: baseRoot + '/application/ccfri',
  APPLICATION_RFI: baseRoot + '/application/ccfri',
  APPLICATION_NMF: baseRoot + '/application/ccfri',
  APPLICATION_CHANGE_REQUEST: baseRoot + '/application/changeRequest',
  SUPPORTING_DOCUMENT_UPLOAD: baseRoot + '/supportingDocument',
  APPLICATION_DECLARATION: baseRoot + '/application/declaration',
  APPLICATION_DECLARATION_SUBMIT: baseRoot + '/application/declaration/submit',
  APPLICATION_SUMMARY: baseRoot + '/application/summary',
  SYSTEM_MESSAGES: baseRoot + '/public/systemMessages',
  CHANGE_REQUEST_NEW_FAC: baseRoot + '/changeRequest/newFacility',
  CHANGE_REQUEST_MTFI: baseRoot + '/changeRequest/mtfi',
  CHANGE_REQUEST: baseRoot + '/changeRequest/',
  PDFS: baseRoot + '/pdf',
  PDF: baseRoot + '/pdf/getDocument/',
  DOCUMENT: baseRoot + '/document',
  DOCUMENT_APPLICATION: baseRoot + '/document/application',
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
  SUPPORTING_DOCUMENT_UPLOAD: 'Supporting Document Upload',
  MTFI: 'Midterm Parent Fee Increase',
});

export const CHANGE_TYPES = Object.freeze({
  NEW_FACILITY: 'nf',
  CHANGE_NOTIFICATION: 'pdf',
  MTFI: 'mtfi',
});

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
    CHANGE_NEW_FACILITY: '/change/nf/group/facility',
    CHANGE_INFO: '/change/information',
    SUBMISSION_HISTORY: '/submission-history',
  },
  PREFIX: {
    PCF: '/pcf',
    CHANGE_REQUEST: '/change',
  },
  //These are all suffixes.
  SELECT_APPLICATION_TYPE: '/select-application-type',
  NEW_APPLICATION_INTERMEDIATE: '/new-application',
  RENEW_CONFIRM: '/group/renew',

  CCOF_GROUP_ORG: '/group/organization',
  CCOF_GROUP_FACILITY: '/group/facility',
  CCOF_GROUP_FUNDING: '/group/funding',
  CCOF_GROUP_CONFIRM: '/group/confirmation',

  CCOF_FAMILY_ORG: '/family/organization',
  CCOF_FAMILY_ELIGIBILITY: '/family/eligibility',
  CCOF_FAMILY_FUNDING: '/family/funding',

  CCFRI_HOME: '/ccfri',
  CCFRI_AFS: '/ccfri/afs',
  CCFRI_CURRENT_FEES: '/ccfri/current-fees',
  CCFRI_NEW_FEES: '/ccfri/new-fees',
  CCFRI_RFI: '/ccfri/req-info',
  CCFRI_NMF: '/ccfri/req-info/new-facility',

  ECEWE_ELIGIBILITY: '/ecewe-eligibility',
  ECEWE_FACILITITES: '/ecewe-facilities',

  LICENSE_UPLOAD: '/licenseUpload',
  SUPPORTING_DOCS: '/supporting-documents',

  SUMMARY_DECLARATION: '/summary-declaration',

  //Report Change suffixes's
  CHANGE_NOTIFICATION_FORM: '/notification-form',
  CHANGE_NOTIFICATION_DIALOGUE: '/notification-dialogue',
  CHANGE_MTFI: 'midterm-fee-increase',
  CHANGE_NEW_FACILITY_OTHER: '/other-changes',
  MTFI_INFO: '/change/mtfi/mtfi-instructions',

  MTFI_GROUP_SELECT_FACILITY: '/mtfi-select-facility',

  MTFI_GROUP_FEE_VERIFICATION: '/mtfi-fee-verification',
};

//Some helper classes to build the URL consistently
export function pcfUrl(suffix, programYearGuid = ':programYearGuid') {
  return `${PATHS.PREFIX.PCF}/${programYearGuid}${suffix}`;
}

export function pcfUrlGuid(suffix, programYearGuid = ':programYearGuid', urlGuid = ':urlGuid') {
  return `${PATHS.PREFIX.PCF}/${programYearGuid}${suffix}/${urlGuid}`;
}

export function changeUrl(suffix, changeRecGuid = ':changeRecGuid', changeType = CHANGE_TYPES.NEW_FACILITY) {
  return `${PATHS.PREFIX.CHANGE_REQUEST}/${changeType}/${changeRecGuid}${suffix}`;
}

export function changeUrlGuid(
  suffix,
  changeRecGuid = ':changeRecGuid',
  urlGuid = ':urlGuid',
  changeType = CHANGE_TYPES.NEW_FACILITY,
) {
  return `${PATHS.PREFIX.CHANGE_REQUEST}/${changeType}/${changeRecGuid}${suffix}/${urlGuid}`;
}

export const NAV_BAR_GROUPS = {
  CCOF: 'CCOF',
  CCFRI: 'CCFRI',
  ECEWE: 'ECE-WE',
  MTFI: 'MTFI',
};

export const ORGANIZATION_PROVIDER_TYPES_IDS = {
  GROUP: 100000000,
  FAMILY: 100000001,
};

export const ORGANIZATION_PROVIDER_TYPES = {
  GROUP: 'GROUP',
  FAMILY: 'FAMILY',
};

export const ECEWE_SECTOR_TYPES = {
  CSSEA: 100000000,
  OTHER_UNION: 100000001,
  NO_FACILITIES_UNIONIZED: 100000002, // only for 2025-26
  SOME_FACILITIES_UNIONIZED: 100000003, // only for 2025-26
};

//2024 and previous ONLY - question to be removed in future years
export const ECEWE_BELONGS_TO_UNION = {
  YES: 1,
  NO: 0,
};

export const ECEWE_OPT_IN_TYPES = {
  OPT_IN: 1,
  OPT_OUT: 0,
};

export const ECEWE_DESCRIBE_ORG_TYPES = {
  NOT_A_MEMBER_OF_CSSEA: 100000000,
  MEMBER_OF_CSSEA: 100000001,
};

export const ECEWE_IS_PUBLIC_SECTOR_EMPLOYER = {
  YES: 1,
  NO: 0,
};

//these are used at the facility level - other codes are at ORG level
export const ECEWE_FACILITY_UNION_TYPES = {
  UNIONIZED: 100000001,
  NON_UNIONIZED: 100000002,
};

export const ECEWE_UNION_AGREEMENT_REACHED = 100000000;

export const MINISTRY_NAME = 'Ministry of Education and Child Care';

export const CCFRI_Categories = [
  'Group Under 18 Months',
  'Group 18 - 36 months',
  'Family Under 18 months',
  'Family 18 - 36 months',
  'Group 3 years to Kindergarten',
  'Family 3 years to Kindergarten',
  'Group Before & After School (Kindergarten only)',
  'Family Before & After School (Kindergarten only)',
];

export const CHANGE_REQUEST_TYPES = {
  LEGAL_ORG_NAME_CHANGE: 100000000,
  ORG_MAILING_ADDRESS: 100000001,
  FACILITY_ADDRESS: 100000002,
  FACILITY_NAME: 100000003,
  LICENSE_CHANGE: 100000004,
  NEW_FACILITY: 100000005,
  SERVICE_DETAIL_CHANGE: 100000006,
  PARENT_FEE_CHANGE: 100000007,
  CLOSURE_UPDATE: 100000008,
  CONTACT_INFORMATION_CHANGE: 100000009,
  BUSINESS_HOURS: 100000010,
  LEGAL_ENTITY_OWNERSHIP: 100000011,
  DATE_DIRECT_DEPOSIT_INFO: 100000012,
  PDF_CHANGE: 100000013,
  NEW_CATEGORY: 100000014,
};

export const CHANGE_REQUEST_EXTERNAL_STATUS = {
  IN_PROGRESS: 1,
  SUBMITTED: 2,
  ACTION_REQUIRED: 3,
  INELIGIBLE: 4,
  APPROVED: 5,
  CANCELLED: 6,
};

export const PROGRAM_YEAR_LANGUAGE_TYPES = {
  HISTORICAL: 'HISTORICAL',
  FY2024_25: 'FY2024_25',
  FY2025_26: 'FY2025_26',
};

export const PROVINCES = Object.freeze([
  {
    title: 'AB',
    value: 'AB',
  },
  {
    title: 'BC',
    value: 'BC',
  },
  {
    title: 'MB',
    value: 'MB',
  },
  {
    title: 'NB',
    value: 'NB',
  },
  {
    title: 'NL',
    value: 'NL',
  },
  {
    title: 'NT',
    value: 'NT',
  },
  {
    title: 'NS',
    value: 'NS',
  },
  {
    title: 'NU',
    value: 'NU',
  },
  {
    title: 'ON',
    value: 'ON',
  },
  {
    title: 'PE',
    value: 'PE',
  },
  {
    title: 'QC',
    value: 'QC',
  },
  {
    title: 'SK',
    value: 'SK',
  },
  {
    title: 'YT',
    value: 'YT',
  },
]);

export const AFS_STATUSES = Object.freeze({
  ACCEPT: 1,
  UPLOAD_DOCUMENTS: 2,
  DECLINE: 3,
});

export const PARENT_FEE_FREQUENCIES = Object.freeze({
  MONTHLY: 100000000,
  WEEKLY: 100000001,
  DAILY: 100000002,
});

export const DOCUMENT_TYPES = Object.freeze({
  APPLICATION_AFS: 'AFS - Supporting Documents',
  APPLICATION_AFS_SUBMITTED: 'AFS - Supporting Documents - Submitted',
});
