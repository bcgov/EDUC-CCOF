'use strict';

import Decimal from 'decimal.js';
import moment from 'moment';
import useRfdc from 'rfdc';
import { LocalDate } from '@js-joda/core';
import { formatTime12to24, getDateFormatter } from '@/utils/format.js';
import { isEmpty, isEqual, isPlainObject, pick, sortBy } from 'lodash';
import {
  APPLICATION_CCOF_STATUSES,
  APPLICATION_TYPES,
  APPLICATION_STATUSES,
  CCOF_STATUS,
  LICENCE_STATUSES,
  OPT_STATUSES,
  ORGANIZATION_TYPES,
  PATHS,
} from '@/utils/constants.js';

const clone = useRfdc();
export const getLocalDateFromString = (date, pattern = 'uuuu-MM-dd') => {
  const formatter = getDateFormatter(pattern);
  try {
    return LocalDate.parse(date, formatter);
  } catch (e) {
    console.error(`Error is ${e}`);
  }
};

export function setEmptyInputParams(params, ...excludedParams) {
  for (const key of Object.keys(params)) {
    if (!excludedParams.includes(key)) {
      if (isPlainObject(params[key])) {
        setEmptyInputParams(params[key], ...excludedParams);
      } else {
        params[key] = null;
      }
    }
  }
}
export function deepCloneObject(objectToBeCloned) {
  return clone(objectToBeCloned);
}

export function isNullOrBlank(value) {
  return value === null || value === undefined || value === '';
}

/**
 * Checks if the time difference between `from` and `to` is greater than or equal to the specified number of hours.
 *
 * @param {string} from - The starting time in "HH:mm" format (e.g., "09:40").
 * @param {string} to - The ending time in "HH:mm" format (e.g., "21:30").
 * @param {number} difference - The minimum number of hours that `to` should be after `from` (e.g., 1 for 1 hour).
 *
 * @returns {boolean} - Returns `true` if the time difference between `from` and `to` is greater than or equal to `difference` hours,
 *                     otherwise returns `false`.
 */
export function validateHourDifference(from, to, difference) {
  if (isNullOrBlank(from) || isNullOrBlank(to) || isNullOrBlank(difference)) {
    return false;
  }
  // Extract and convert the time to minutes from "HH:mm" format
  const minutesFrom =
    parseInt(formatTime12to24(from).split(':')[0], 10) * 60 + parseInt(formatTime12to24(from).split(':')[1], 10);
  const minutesTo =
    parseInt(formatTime12to24(to).split(':')[0], 10) * 60 + parseInt(formatTime12to24(to).split(':')[1], 10);
  if (isNaN(minutesFrom) || isNaN(minutesTo)) {
    console.error('Invalid time format');
    return false;
  }
  return minutesTo >= minutesFrom + difference * 60;
}

export function isChangeRequest(vueForm) {
  return vueForm?.$route?.path?.startsWith(PATHS.PREFIX.CHANGE_REQUEST);
}

export function sortByFacilityId(value) {
  return sortBy(value, [
    function (o) {
      return o.facilityId;
    },
  ]);
}

export async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isFacilityAvailable(facility) {
  return facility?.facilityStatus && !['Closed', 'Cancelled'].includes(facility?.facilityStatus);
}

// NEW ORG Application:
// - NOT APPROVED - display all facilities associated with the application
// - APPROVED - display all facilities associated with the application, which have Facility ID (change requests new facilities will be filtered until approved).
// RENEWAL Application:
// - NOT SUBMITTED - display all facilities associated with the application, which are not in status (Closed, Cancelled, Blank) and have Facility ID.
// - SUBMITTED/APPROVED - display all facilities associated with the application, which have Facility ID (change requests new facilities will be filtered until approved).
export function filterFacilityListForPCF(facilityList, isRenewal, applicationStatus) {
  const filteredFacilityList = facilityList.filter((el) => {
    const isFacilityActive = el.ccofBaseFundingId || el.ccfriApplicationId || el.eceweApplicationId;
    if (isRenewal) {
      if (applicationStatus === 'SUBMITTED' || applicationStatus === 'APPROVED') {
        return el.facilityAccountNumber && isFacilityActive;
      } else {
        return el.facilityAccountNumber && isFacilityAvailable(el);
      }
    } else {
      if (applicationStatus === 'APPROVED') {
        return el.facilityAccountNumber && isFacilityActive;
      } else {
        return true;
      }
    }
  });
  return filteredFacilityList;
}

export function checkApplicationUnlocked(application) {
  const facilityList = application?.facilityList;
  const isCCFRIUnlocked = facilityList?.some((facility) => isFacilityAvailable(facility) && facility.unlockCcfri);
  const isNMFUnlocked = facilityList?.some((facility) => isFacilityAvailable(facility) && facility.unlockNmf);
  const isRFIUnlocked = facilityList?.some((facility) => isFacilityAvailable(facility) && facility.unlockRfi);
  const isAFSUnlocked = facilityList?.some(
    (facility) => isFacilityAvailable(facility) && facility.unlockAfs && facility.enableAfs,
  );
  const isApplicationUnlocked =
    (application?.unlockBaseFunding && application?.applicationType === 'NEW') ||
    application?.unlockLicenseUpload ||
    application?.unlockEcewe ||
    application?.unlockSupportingDocuments ||
    application?.unlockDeclaration ||
    isCCFRIUnlocked ||
    isNMFUnlocked ||
    isRFIUnlocked ||
    isAFSUnlocked;
  return isApplicationUnlocked;
}

export function isAnyApplicationUnlocked(applicationList) {
  return applicationList.some((application) => {
    return checkApplicationUnlocked(application);
  });
}

export function isAnyChangeRequestActive(changeRequestList) {
  //Status of :  "Submitted" "Action Required";
  return changeRequestList?.some(
    (el) => (el.externalStatus == 2 || el.externalStatus == 3) && el.changeActions[0].changeType != 'PARENT_FEE_CHANGE',
  );
}

export function hasEmptyFields(obj, requiredFields) {
  return requiredFields?.some((field) => obj[field] == null || obj[field] === '');
}

export function getOptInOptOut(status) {
  switch (status) {
    case OPT_STATUSES.OPT_IN:
      return 'Opt-In';
    case OPT_STATUSES.OPT_OUT:
      return 'Opt-Out';
    default:
      return null;
  }
}

export function getYesNoValue(value) {
  switch (value) {
    case true:
    case 1:
    case 100000000:
      return 'Yes';
    case false:
    case 0:
    case 100000001:
      return 'No';
    default:
      return null;
  }
}

export function getOrganizationNameLabel(organizationType) {
  switch (organizationType) {
    case ORGANIZATION_TYPES.NON_PROFIT_SOCIETY:
    case ORGANIZATION_TYPES.REGISTERED_COMPANY:
      return 'Legal Organization Name (as it appears in BC Registries and Online Services)';
    case ORGANIZATION_TYPES.SOLE_PROPRIETORSHIP:
      return 'Full Legal Name of Sole Proprietor (Licensee)';
    default:
      return 'Legal Organization Name';
  }
}

/**
 * Pads the given input value on the left with the specified character
 * until it reaches the desired length.
 *
 * @param input - The value to pad (can be a number, string, etc.).
 * @param length - The total desired length of the resulting string.
 * @param char - The character to use for padding.
 * @returns A padded string, or null if input is null or undefined.
 */
export function padString(input, length, char) {
  if (input == null) return null;
  return String(input).padStart(length, char);
}

export function getDayOfWeek(day, month, year, dateFormat = 'dddd') {
  // Adjust month to 0-based index
  const date = moment({ year, month: month - 1, day });
  return date.format(dateFormat); // e.g., "Monday"
}

/**
 * Returns an array of objects from the `updated` array that differ from the `original` array
 * based on a specified set of keys and a shared identifier.
 *
 * @param {Array<Object>} original - The original array of objects.
 * @param {Array<Object>} updated - The updated array of objects.
 * @param {Array<string>} keys - The list of keys to compare for detecting changes.
 * @param {string} idKey - The key used to uniquely identify and match objects (e.g., 'id').
 * @returns {Array<Object>} An array of objects from `updated` that have changed values for the specified keys.
 */
export function getUpdatedObjectsByKeys(original, updated, keys, idKey) {
  if (isEmpty(original) || isEmpty(updated) || isEmpty(keys) || isEmpty(idKey)) return [];
  const originalMap = new Map(original.map((obj) => [obj[idKey], obj]));
  return updated.filter((updatedObj) => {
    const originalObj = originalMap.get(updatedObj[idKey]);
    if (!originalObj) return true; // If not found in original, treat as new/changed
    return !isEqual(pick(updatedObj, keys), pick(originalObj, keys));
  });
}

/**
 * Adds two decimal numbers and rounds the result to a fixed number of decimal places,
 * returning it as a Number.
 *
 * This avoids common floating-point precision issues in JavaScript, e.g.:
 *   0.1 + 0.2 === 0.30000000000000004
 *
 * @param {number} a - First number to add.
 * @param {number} b - Second number to add.
 * @param {number} [decimals = 4] - Number of decimal places to round to.
 * @returns {number} The rounded sum as a Number.
 */
export function addDecimal(a, b, decimals = 4) {
  const safeA = a || 0;
  const safeB = b || 0;
  return new Decimal(safeA).plus(safeB).toDecimalPlaces(decimals).toNumber();
}

/**
 * Subtracts two decimal numbers and rounds the result to a fixed number of decimal places,
 * returning it as a Number.
 *
 * This avoids common floating-point precision issues in JavaScript, e.g.:
 *   0.3 - 0.1 === 0.19999999999999998
 *
 * @param {number} a - Number to subtract from.
 * @param {number} b - Number to subtract.
 * @param {number} [decimals = 4] - Number of decimal places to round to.
 * @returns {number} The rounded difference as a Number.
 */
export function subtractDecimal(a, b, decimals = 4) {
  const safeA = a || 0;
  const safeB = b || 0;
  return new Decimal(safeA).minus(safeB).toDecimalPlaces(decimals).toNumber();
}

/**
 * Multiplies two decimal numbers and rounds the result to a fixed number of decimal places,
 * returning it as a Number.
 *
 * This avoids common floating-point precision issues in JavaScript, e.g.:
 *   12 * 3.7 === 44.400000000000006
 *
 * @param {number} a - First number to multiply.
 * @param {number} b - Second number to multiply.
 * @param {number} [decimals = 4] - Number of decimal places to round to.
 * @returns {number} The rounded result as a Number.
 */
export function multiplyDecimal(a, b, decimals = 4) {
  const safeA = a || 0;
  const safeB = b || 0;
  return new Decimal(safeA).times(safeB).toDecimalPlaces(decimals).toNumber();
}

/**
 * Derive the CCOF Status from the global application and organization state.
 *
 * @param {string} applicationStatus - applicationStore.applicationStatus
 * @param {string} applicationType - applicationSTore.applicationType
 * @param {boolean} isOrganizationUnlock - is the organization unlocked in Dynamics?
 * @param {string} ccofApplicationStatus - applicationStore.ccofApplicationStatus
 */
export function getCcofStatus(applicationStatus, applicationType, isOrganizationUnlock, ccofApplicationStatus) {
  if (!applicationType) {
    return CCOF_STATUS.NEW;
  }
  if (applicationType === APPLICATION_TYPES.NEW_ORG) {
    switch (applicationStatus) {
      case APPLICATION_STATUSES.DRAFT:
        return CCOF_STATUS.CONTINUE;
      case APPLICATION_STATUSES.SUBMITTED:
        if (isOrganizationUnlock) return CCOF_STATUS.ACTION_REQUIRED;
        if (ccofApplicationStatus === APPLICATION_CCOF_STATUSES.ACTIVE) return CCOF_STATUS.APPROVED;
        return CCOF_STATUS.COMPLETE;
      default:
        return CCOF_STATUS.NEW;
    }
  }
  return CCOF_STATUS.APPROVED;
}

function getUnlockList(facilityList = [], facilityProperty = '') {
  if (isEmpty(facilityList)) return [];
  return facilityList.filter((f) => !!f[facilityProperty]).map((f) => f.ccfriApplicationId);
}

export function getUnlockCCFRIList(facilityList) {
  return getUnlockList(facilityList, 'unlockCcfri');
}

export function getUnlockNMFList(facilityList) {
  return getUnlockList(facilityList, 'unlockNmf');
}

export function getUnlockRFIList(facilityList) {
  return getUnlockList(facilityList, 'unlockRfi');
}

export function getUnlockAFSList(facilityList) {
  return getUnlockList(facilityList, 'unlockAfs');
}

/**
 * Figure out if the organization is unlocked
 *
 * @param unlockBaseFunding - applicationStore.unlockBaseFunding
 * @param applicationType - applicationStore.applicationType
 * @paran unlockDeclaration - applicationStore.unlockDeclaration
 * @param unlockEcewe - applicationStore.unlockEcewe
 * @param unlockLicenseUpload - applicationStore.unlockLicenseUpload
 * @param unlockSupportingDocuments - applicationStore.unlockSupportingDocuments
 * @param facilityList - navBarStore.navBarList
 */
export function isOrganizationUnlocked(
  unlockBaseFunding,
  applicationType,
  unlockDeclaration,
  unlockEcewe,
  unlockLicenseUpload,
  unlockSupportingDocuments,
  facilityList,
) {
  return (
    (unlockBaseFunding && applicationType === APPLICATION_TYPES.NEW_ORG) ||
    unlockDeclaration ||
    unlockEcewe ||
    unlockLicenseUpload ||
    unlockSupportingDocuments ||
    !isEmpty(getUnlockCCFRIList(facilityList)) ||
    !isEmpty(getUnlockNMFList(facilityList)) ||
    !isEmpty(getUnlockRFIList(facilityList)) ||
    !isEmpty(getUnlockAFSList(facilityList))
  );
}

/**
 * Maps a licence status to a CSS class name.
 *
 * @param {string} status - Licence status
 * @returns {string} CSS class name corresponding to the status
 */
export function getLicenceStatusClass(status) {
  switch (status) {
    case LICENCE_STATUSES.ACTIVE:
      return 'status-blue';
    case LICENCE_STATUSES.APPROVED:
      return 'status-green';
    case LICENCE_STATUSES.INACTIVE:
      return 'status-gray';
    case LICENCE_STATUSES.REPLACED:
      return 'status-yellow';
    default:
      return '';
  }
}

/**
 * Builds a simple query string from an object.
 *
 * Example:
 *   buildQueryString({ statusCode: 123456, orgName: 'TEST' })
 *   result: queryString = "?statusCode=123456&orgName=TEST"
 */
export function buildQueryString(query) {
  if (isEmpty(query)) return '';
  let queryString = '';
  for (const [key, value] of Object.entries(query)) {
    queryString += queryString ? `&${key}=${value}` : `?${key}=${value}`;
  }
  return queryString;
}
