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
  CLOSURES: baseRoot + '/closures',
  CONTACTS: baseRoot + '/contacts',
  LICENSE_UPLOAD: baseRoot + '/licenseUpload',
  GROUP_FUND_AMOUNT: baseRoot + '/group/funding',
  MESSAGE: baseRoot + '/messages',
  APPLICATION: baseRoot + '/application',
  APPLICATION_ECEWE: baseRoot + '/application/ecewe',
  APPLICATION_ECEWE_FACILITY: baseRoot + '/application/ecewe/facilities',
  APPLICATION_RENEW: baseRoot + '/application/renew-ccof',
  APPLICATION_CCFRI: baseRoot + '/application/ccfri',
  APPLICATION_RFI: baseRoot + '/application/ccfri',
  APPLICATION_NMF: baseRoot + '/application/ccfri',
  APPLICATION_CHANGE_REQUEST: baseRoot + '/application/changeRequest',
  APPLICATION_STATUS: baseRoot + '/application/status',
  SUPPORTING_DOCUMENT_UPLOAD: baseRoot + '/supportingDocument',
  APPLICATION_DECLARATION: baseRoot + '/application/declaration',
  APPLICATION_DECLARATION_SUBMIT: baseRoot + '/application/declaration/submit',
  APPLICATION_SUMMARY: baseRoot + '/application/summary',
  SYSTEM_MESSAGES: baseRoot + '/public/systemMessages',
  CHANGE_REQUEST_NEW_FAC: baseRoot + '/changeRequest/newFacility',
  CHANGE_REQUEST_CLOSURE: baseRoot + '/changeRequest/closure',
  CHANGE_REQUEST_MTFI: baseRoot + '/changeRequest/mtfi',
  CHANGE_REQUEST: baseRoot + '/changeRequest/',
  PDFS: baseRoot + '/pdf',
  PDF: baseRoot + '/pdf/getDocument/',
  DOCUMENT: baseRoot + '/document',
  DOCUMENT_APPLICATION: baseRoot + '/document/application',
  DOCUMENT_CHANGE_ACTION: baseRoot + '/document/change-action',
  CHANGE_ACTION_CLOSURE: baseRoot + '/changeRequest/changeActionClosure',
  CANADA_POST: baseRoot + '/canadaPost',
  FUNDING_AGREEMENTS: baseRoot + '/fundingAgreements',
  ENROLMENT_REPORTS: baseRoot + '/enrolmentReports',
  LICENCES: baseRoot + '/licences',
});

export const PAGE_TITLES = Object.freeze({
  FACILITY_SELECTION: 'Facility Selection',
  LOGIN: 'Login',
  FRI_CALCULATOR: 'Fee Reduction Calculator',
  LANDING_PAGE: 'What would you like to do',
  ORGANIZATION_SELECT: 'Organizations',
  CCRFI_APPLICATION: 'CCRFI Application Form',
  CCFRI_CLOSURES: 'Closures',
  ECEWE_APPLICATION: 'ECE-WE Application',
  SUMMARY_DECLARATION: 'Summary and Declaration',
  SUPPORTING_DOCUMENT_UPLOAD: 'Supporting Document Upload',
  MANAGE_REPORTS: 'Manage Reports',
  MTFI: 'Midterm Parent Fee Increase',
  FACILITY_INFO: 'Facility Information',
  LICENCE_SERVICE_DETAILS: 'Licence and Service Details',
  ORGANIZATION_CLOSURES: 'Organization Closures',
  ENROLMENT_REPORTS: 'Enrolment Report',
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
    MANAGE_ORG_FACILITIES: '/org-facilities/manage-org-facilities',
    MANAGE_FACILITY: '/org-facilities/manage-facility',
    MANAGE_USERS: '/manage-users',
    ESTIMATOR: '/ccfri-estimator',
    IMPERSONATE: '/impersonate',
    MESSAGES: '/messages',
    CHANGE_LANDING: '/change/landing',
    CHANGE_NEW_FACILITY: '/change/nf/group/facility',
    SUBMISSION_HISTORY: '/submission-history',
    FUNDING_AGREEMENTS: '/funding-agreements',
    CLOSURES: '/closures',
    MANAGE_REPORTS: '/manage-reports',
    ENROLMENT_REPORTS: '/enrolment-reports',
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
  CCOF_FAMILY_FACILITY: '/family/facility',
  CCOF_FAMILY_FUNDING: '/family/funding',

  CCFRI_HOME: '/ccfri',
  CCFRI_AFS: '/ccfri/afs',
  CCFRI_CURRENT_FEES: '/ccfri/current-fees',
  CCFRI_CLOSURES: '/ccfri/closures',
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
  MTFI_AFS: '/mtfi-afs',
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

export const CCFRI_HAS_CLOSURE_FEE_TYPES = {
  YES: 100000000,
  NO: 100000001,
};

export const CCFRI_FEE_CORRECT_TYPES = {
  YES: 100000000,
  NO: 100000001,
};

export const FACILITY_HAS_RECEIVE_FUNDING_VALUES = {
  YES: 100000000,
  NO: 100000001,
  YES_FACILITY: 100000002,
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

export const YES_NO_VALUES = {
  YES: 1,
  NO: 0,
};

export const OPT_STATUSES = {
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

export const APPLICATION_CCOF_STATUSES = {
  ACTIVE: 'ACTIVE',
  NEW: 'NEW',
  PENDING: 'PENDING',
};

export const APPLICATION_STATUSES = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  WITHDRAWN: 'WITHDRAWN',
  // Additional status codes not from Dynamics
  APPROVED: 'APPROVED',
  ACTION_REQUIRED: 'ACTION REQUIRED',
};

export const APPLICATION_TYPES = {
  NEW_ORG: 'NEW',
  RENEWAL: 'RENEW',
};

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
  NEW_CLOSURE: 100000015,
  EDIT_EXISTING_CLOSURE: 100000016,
  REMOVE_A_CLOSURE: 100000017,
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
  APPLICATION_LICENCE: 'Facility License',
  APPLICATION_SUPPORTING: 'SUPPORTING',
  CR_NOTIFICATION_FORM: 'NOTIFICATION_FORM',
  CR_NOTIFICATION_FORM_SUPPORTING: 'SUPPORTING_DOC',
  CLOSURE_REQUEST: 'Closure Request Documents',
  RFI_EC: 'RFI-EC',
  RFI_DCSWI: 'RFI-DCSWI',
  RFI_PSE: 'RFI-PSE',
  RFI_PSEIC: 'RFI-PSEIC',
  RFI_ACCUP: 'RFI-ACCUP',
});

export const MAX_FILE_SIZE = 2100000; // 2.18 MB is max size since after base64 encoding it might grow upto 3 MB.

export const FILE_REQUIREMENTS_TEXT =
  'The maximum file size is 2MB for each document. Accepted file types are jpg, jpeg, heic, png, pdf, docx, doc, xls, and xlsx.';

export const FILE_EXTENSIONS_ACCEPT_TEXT = 'PDF, JPEG, JPG, PNG, HEIC, DOC, DOCX, XLS and XLSX';

export const FILE_EXTENSIONS_ACCEPT = Object.freeze([
  'pdf',
  'png',
  'jpg',
  'jpeg',
  'heic',
  'doc',
  'docx',
  'xls',
  'xlsx',
]);

export const FILE_TYPES_ACCEPT = Object.freeze([
  'image/png',
  'image/jpeg',
  'image/jpg',
  '.pdf',
  '.png',
  '.jpg',
  '.jpeg',
  '.heic',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
]);

export const BCSSA_REGION_LINKS = Object.freeze({
  FY2024_25: 'https://bcmcf.ca1.qualtrics.com/jfe/form/SV_eVcEWJC8HTelRCS',
  FY2025_26: 'https://bcmcf.ca1.qualtrics.com/jfe/form/SV_8GpPXz0CRc7aaXA',
});

export const ERROR_MESSAGES = Object.freeze({
  REQUIRED: 'This field is required',
  LICENCE_CATEGORY_REQUIRED: 'At least one licence category must be selected',
  EMPTY_MAX_SPACES_EXTENDED_CC: 'Enter a number greater than 0 in at least one of the two fields above.',
  CLOSURE_DATE_OUTSIDE_FUNDING_AGREEMENT_YEAR: 'You can only submit closures for the selected funding agreement term.',
  START_DATE_AFTER_END_DATE: 'Start date must not exceed end date.',
  FACILITY_MUST_OPERATE_ONE_MONTH: 'Facility should operate at least one month.',
  NO_MONTH_SELECTED: 'You should select at least one month.',
});

export const ORGANIZATION_TYPES = Object.freeze({
  NON_PROFIT_SOCIETY: 100000000,
  PUBLIC_INSTITUTION: 100000001,
  REGISTERED_COMPANY: 100000002,
  LOCAL_GOVERNMENT: 100000003,
  FIRST_NATIONS_GOVERNMENT: 100000004,
  SOLE_PROPRIETORSHIP: 100000005,
  PARTNERSHIP: 100000006,
});

export const CHANGE_ACTION_CLOSURE_STATUSES = Object.freeze({
  SUBMITTED: 100000001,
  CANCELLED: 100000006,
  COMPLETE: 100000008,
});

export const CLOSURE_STATUSES = Object.freeze({
  PENDING: 100000000,
  COMPLETE_APPROVED: 100000001,
  COMPLETE_NOT_APPROVED: 100000002,
  CANCELLED: 100000003,
  MINISTRY_REMOVED: 100000004,
  WITHDRAWN: 100000005,
});

export const CLOSURE_STATUS_TEXTS = Object.freeze({
  PENDING: 'Pending',
  APPROVED: 'Approved',
  NOT_APPROVED: 'Not Approved',
  CANCELLED: 'Cancelled',
  WITHDRAWN: 'Withdrawn',
});

export const CLOSURE_PAYMENT_ELIGIBILITIES = Object.freeze({
  CCFRI: 100000000,
  CCFRI_AND_CCOF: 100000001,
  CCOF: 100000002,
  INELIGIBLE: 100000003,
  PENDING: 100000004,
});

export const CLOSURE_PAYMENT_ELIGIBILITY_TEXTS = Object.freeze({
  CCFRI: 'CCFRI',
  CCFRI_AND_CCOF: 'CCFRI & CCOF',
  CCOF: 'CCOF',
  INELIGIBLE: 'Ineligible',
  PENDING: 'Pending',
});

export const CLOSURE_AFFECTED_AGE_GROUPS_VALUES_TO_TEXT = Object.freeze({
  100000000: '0 to 18 months',
  100000001: '18 to 36 months',
  100000002: '3 Years to Kindergarten',
  100000003: 'Out of School Care - Kindergarten',
  100000004: 'Out of School Care - Grade 1+',
  100000005: 'Preschool',
});

export const CLOSURE_AFFECTED_AGE_GROUPS = Object.freeze({
  '0 to 18 months': 100000000,
  '18 to 36 months': 100000001,
  '3 Years to Kindergarten': 100000002,
  'Out of School Care - Kindergarten': 100000003,
  'Out of School Care - Grade 1+': 100000004,
  Preschool: 100000005,
});

export const CLOSURE_TYPES = Object.freeze({
  KNOWN_CLOSURES: 100000000,
  EMERGENCY_CLOSURES: 100000001,
  NON_OPERATIONAL_CLOSURES: 100000002,
});

export const ORGANIZATION_FACILITY_STATUS_CODES = Object.freeze({
  ACTIVE: 1,
  INACTIVE: 2,
});

export const GROUP_LICENCE_CATEGORIES = Object.freeze({
  GROUP_CHILD_CARE_UNDER_36_MONTHS: 1,
  GROUP_CHILD_CARE_30_MONTHS_TO_SCHOOL_AGE: 2,
  GROUP_CHILD_CARE_SCHOOL_AGE: 3,
  MULTI_AGE_CHILD_CARE: 4,
  PRESCHOOL: 8,
  SCHOOL_AGE_CARE_ON_SCHOOL_GROUNDS: 9,
});

export const FAMILY_LICENCE_CATEGORIES = Object.freeze({
  MULTI_AGE_CHILD_CARE: 5,
  IN_HOME_MULTI_AGE_CHILD_CARE: 6,
  FAMILY_CHILD_CARE: 7,
});

export const ORGANIZATION_GOOD_STANDING_STATUSES = Object.freeze({
  PASS: 1,
  FAIL: 2,
  INTEGRATION_ERROR: 3,
});

export const TOOLTIP_TYPES = Object.freeze({
  INFO: 'Information',
  ERROR: 'Error',
  WARNING: 'Warning',
});

export const EMPTY_PLACEHOLDER = '--';

export const CCFRI_MAX_FEE = 9999;
export const CCFRI_MIN_FEE = 0;

export const DEFAULT_NUMBER_OF_PARTNERS = 2;
export const MAX_NUMBER_OF_PARTNERS = 4;

export const ROLES = Object.freeze({
  ORG_ADMIN: '10',
  FAC_ADMIN_ADVANCED: '11',
  FAC_ADMIN_BASIC: '13',
  READ_ONLY: '12',
});

export const FUNDING_AGREEMENTS_STATUS = Object.freeze({
  ACTIVE: 'Active',
  APPROVED: 'Approved',
  DRAFTED_PROVIDER_ACTION_REQUIRED: 'Drafted – Provider Action Required',
  DRAFTED_WITH_MINISTRY: 'Drafted - with Ministry',
  SUSPENDED: 'Suspended',
  CANCELLED: 'Cancelled',
  TERMINATED: 'Terminated',
  REPLACED: 'Replaced',
  EXPIRED: 'Expired',
});

export const FUNDING_AGREEMENT_INTERNAL_STATUS_CODES = Object.freeze({
  DRAFTED_PROVIDER_ACTION_REQUIRED: 101510003,
});

export const FUNDING_AGREEMENT_EXTERNAL_STATUSES = Object.freeze({
  DRAFTED_WITH_MINISTRY: 101510004,
});

export const DAY_TYPES = Object.freeze({
  WEEKDAY: 100000000,
  WEEKEND: 100000001,
  STATUTORY: 100000002,
});

export const DAYS_OF_WEEK = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  7: 'Sunday',
};

export const CCOF_STATUS = Object.freeze({
  NEW: 'NEW',
  COMPLETE: 'COMPLETE',
  CONTINUE: 'CONTINUE',
  APPROVED: 'APPROVED',
  ACTION_REQUIRED: 'ACTION_REQUIRED',
});

export const RENEW_STATUS = Object.freeze({
  NEW: 'NEW',
  COMPLETE: 'COMPLETE',
  CONTINUE: 'CONTINUE',
  APPROVED: 'APPROVED',
  ACTION_REQUIRED: 'ACTION_REQUIRED',
});

export const ENROLMENT_REPORT_STATUSES = Object.freeze({
  DRAFT: 1,
  SUBMITTED: 2,
  WITH_MINISTRY: 3,
  REJECTED: 4,
  APPROVED: 6,
  PAID: 7,
  EXPIRED: 8,
});

export const ENROLMENT_REPORT_INTERNAL_STATUSES = Object.freeze({
  CREATED: 1,
  INCOMPLETE: 2,
  SUBMITTED: 3,
  REJECTED: 5,
});

export const LICENCE_STATUSES = Object.freeze({
  APPROVED: 'Approved',
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  REPLACED: 'Replaced',
});
