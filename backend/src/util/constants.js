
//TODO: this really should be a lookup in dynamics
const CHILD_AGE_CATEGORY_TYPES = new Map();
CHILD_AGE_CATEGORY_TYPES.set('0-18', '0 to 18 months');
CHILD_AGE_CATEGORY_TYPES.set('18-36', '18 to 36 months');
CHILD_AGE_CATEGORY_TYPES.set('3Y-K', '3 Years to Kindergarten');
CHILD_AGE_CATEGORY_TYPES.set('OOSC-K', 'Out of School Care - Kindergarten');
CHILD_AGE_CATEGORY_TYPES.set('OOSC-G', 'Out of School Care - Grade 1+');
CHILD_AGE_CATEGORY_TYPES.set('PRE', 'Preschool');



//Jen changed these string values ^^ for the lookup mapping to work -- now they match EXACTLY what comes back from the Dynamics API 

const ACCOUNT_TYPE = Object.freeze({
  FACILITY: 100000001,
  ORGANIZATION: 100000000
});


const CCOF_APPLICATION_TYPES = Object.freeze({
  NEW: 100000000,
  FACILITY: 100000001,
  RENEW: 100000002
});


const APPLICATION_STATUS_CODES = Object.freeze({
  NEW: null,
  DRAFT: 1,
  SUBMITTED: 3,
  WITHDRAWN: 4,
  // Additional status codes not from Dynamics
  APPROVED: 10,
  ACTION_REQUIRED: 11
});

const CCOF_STATUS_CODES = Object.freeze({
  SUBMITTED: 1,
  ACTION_REQUIRED: 2,
  ACTIVE: 3,
  INACTIVE: 4,
  CANCELLED: 5
});

const ORGANIZATION_PROVIDER_TYPES = Object.freeze({
  GROUP: 100000000,
  FAMILY: 100000001,
});


const OPTIN_STATUS_CODES = Object.freeze({
  OUT: 0,
  IN:  1,
});

const CCFRI_STATUS_CODES = Object.freeze({
  APPROVED: 3, 
  DRAFT: 2,
  SUBMITTED: 1,
  NOT_APPROVED: 4,
  INELIGIBLE: 5,
  ACTION_REQUIRED: 6
});

const ECEWE_STATUS_CODES = Object.freeze({
  APPROVED: 3,
  DRAFT: 2,
  SUBMITTED: 1,
  NOT_APPROVED: 4,
  INELIGIBLE: 5,
  ACTION_REQUIRED: 6
});

const PROGRAM_YEAR_STATUS_CODES = Object.freeze({
  CURRENT:	1,
  INACTIVE:	2,
  FUTURE:	3,
  HISTORICAL:	4,
});


const FACILITY_AGE_GROUP_CODES = Object.freeze({
  '1': '0 to 18 months',
  '2': '18 to 36 months',
  '3': '3 Years to Kindergarten',
  '4': 'Out of School Care - Kindergarten',
  '5': 'Out of School Care - Grade 1+' ,
  '6': 'Preschool'
});

module.exports = {
  CHILD_AGE_CATEGORY_TYPES,
  ACCOUNT_TYPE,
  APPLICATION_STATUS_CODES,
  CCOF_STATUS_CODES,
  CCFRI_STATUS_CODES,
  ECEWE_STATUS_CODES,
  ORGANIZATION_PROVIDER_TYPES,
  FACILITY_AGE_GROUP_CODES,
  OPTIN_STATUS_CODES,
  PROGRAM_YEAR_STATUS_CODES,
  CCOF_APPLICATION_TYPES,
};

