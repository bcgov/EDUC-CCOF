const FILTER_OPERATION = Object.freeze(
  {
    /**
     * Equal filter operation.
     */
    EQUAL: 'eq',
    /**
     * Not equal filter operation.
     */
    NOT_EQUAL: 'neq',
    /**
     * Greater than filter operation.
     */
    GREATER_THAN: 'gt',
    /**
     * Greater than or equal to filter operation.
     */
    GREATER_THAN_OR_EQUAL_TO: 'gte',
    /**
     * Less than filter operation.
     */
    LESS_THAN: 'lt',
    /**
     * Less than or equal to filter operation.
     */
    LESS_THAN_OR_EQUAL_TO: 'lte',
    /**
     * In filter operation.
     */
    IN: 'in',
    /**
     * Not in filter operation.
     */
    NOT_IN: 'nin',
    /**
     * Between filter operation.
     */
    BETWEEN: 'btn',
    /**
     * Contains filter operation.
     */
    CONTAINS: 'like',
    /**
     * Contains ignore case filter operation.
     */
    CONTAINS_IGNORE_CASE: 'like_ignore_case',
    /**
     * Starts with filter operation.
     */
    STARTS_WITH: 'starts_with',
    /**
     * Not starts with filter operation.
     */
    NOT_STARTS_WITH: 'not_starts_with',
    /**
     * Starts with ignore case filter operation.
     */
    STARTS_WITH_IGNORE_CASE: 'starts_with_ignore_case',
    /**
     * Ends with filter operation.
     */
    ENDS_WITH: 'ends_with',
  }
);
const CONDITION = Object.freeze(
  {
    /**
     * And condition.
     */
    AND: 'AND',
    /**
     * Or condition.
     */
    OR: 'OR'
  }
);

const VALUE_TYPE = Object.freeze(
  {
    /**
     * String value type.
     */
    STRING: 'STRING',
    /**
     * Integer value type.
     */
    INTEGER: 'INTEGER',
    /**
     * Long value type.
     */
    LONG: 'LONG',
    /**
     * Date value type.
     */
    DATE: 'DATE',
    /**
     * Date time value type.
     */
    DATE_TIME: 'DATE_TIME',
    /**
     * Uuid value type.
     */
    UUID: 'UUID'
  }
);

const PEN_REQ_BATCH_STATUS_CODES = Object.freeze(
  {
    ARCHIVED: 'ARCHIVED',
    UNARCHIVED: 'UNARCHIVED',
    LOAD_FAIL: 'LOADFAIL',
    DELETED: 'DELETED',
    LOADED: 'LOADED'
  }
);
const EVENT_TYPE = Object.freeze({
  UPDATE_STUDENT: 'UPDATE_STUDENT',
  CREATE_STUDENT: 'CREATE_STUDENT'
});
const EVENT_OUTCOME = Object.freeze({
  STUDENT_UPDATED: 'STUDENT_UPDATED',
  STUDENT_CREATED: 'STUDENT_CREATED'
});
const EVENT_WS_TOPIC = 'EVENT_WS_TOPIC';

const CHILD_AGE_CATEGORY_TYPES = new Map();
CHILD_AGE_CATEGORY_TYPES.set('0-18', '0 - 18 Months');
CHILD_AGE_CATEGORY_TYPES.set('18-36', '18 - 36 Months');
CHILD_AGE_CATEGORY_TYPES.set('3Y-K', '3 Years to Kindergarten');
CHILD_AGE_CATEGORY_TYPES.set('OOSC-K', 'Before & After School (Kindergarten Only)');

const ACCOUNT_TYPE = Object.freeze({
  FACILITY: 100000001,
  ORGANIZATION: 100000000
});

const STATUS_CODES = Object.freeze({
  APPROVED: 'APPROVED',
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  NEW: 'NEW'
});

const CCOF_STATUS_CODES = Object.freeze({
  '100000001': STATUS_CODES.APPROVED,
  '100000002': STATUS_CODES.DRAFT,
  '100000003': STATUS_CODES.SUBMITTED
});

const CCFRI_STATUS_CODES = Object.freeze({

  '1': STATUS_CODES.APPROVED,
  '2': STATUS_CODES.DRAFT,
  '3': STATUS_CODES.SUBMITTED
});

const ECEWE_STATUS_CODES = Object.freeze({
  '1': STATUS_CODES.APPROVED,
  '2': STATUS_CODES.DRAFT,
  '3': STATUS_CODES.SUBMITTED});

const FACILITY_AGE_GROUP_CODES = Object.freeze({
  '1': '0 to 18 months',
  '2': '18 to 36 months',
  '3': '3 Years to Kindergarten',
  '4': 'Out of School Care - Kindergarten',
  '5': 'Out of School Care - Grade 1+' ,
  '6': 'Preschool'
});

module.exports = {
  FILTER_OPERATION,
  CONDITION,
  VALUE_TYPE,
  PEN_REQ_BATCH_STATUS_CODES,
  EVENT_TYPE,
  EVENT_OUTCOME,
  EVENT_WS_TOPIC,
  CHILD_AGE_CATEGORY_TYPES,
  ACCOUNT_TYPE,
  STATUS_CODES,
  CCOF_STATUS_CODES,
  CCFRI_STATUS_CODES,
  ECEWE_STATUS_CODES,
  FACILITY_AGE_GROUP_CODES
};

