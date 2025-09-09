'use strict';

import Decimal from 'decimal.js';
import { isEmpty, isEqual, isPlainObject, pick, sortBy } from 'lodash';
import moment from 'moment';
import useRfdc from 'rfdc';

import {
  BCSSA_REGION_LINKS,
  OPT_STATUSES,
  ORGANIZATION_TYPES,
  PATHS,
  PROGRAM_YEAR_LANGUAGE_TYPES,
} from '@/utils/constants.js';
import { formatTime12to24, getDateFormatter } from '@/utils/format.js';
import { LocalDate } from '@js-joda/core';

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
  Object.keys(params).forEach((key) => {
    if (!excludedParams.includes(key)) {
      if (isPlainObject(params[key])) {
        setEmptyInputParams(params[key], ...excludedParams);
      } else {
        params[key] = null;
      }
    }
  });
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

export function getBCSSALink(languageYearLabel) {
  switch (languageYearLabel) {
    case PROGRAM_YEAR_LANGUAGE_TYPES.FY2024_25:
      return BCSSA_REGION_LINKS.FY2024_25;
    case PROGRAM_YEAR_LANGUAGE_TYPES.FY2025_26:
      return BCSSA_REGION_LINKS.FY2025_26;
    default:
      return BCSSA_REGION_LINKS.FY2025_26; //if future years are added but this link is not updated - default to the newest link we have
  }

  //todo- more links will need to be added for future program years when provided by the buisness
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
    case 0:
    case 100000001:
      return 'No';
    case 1:
    case 100000000:
      return 'Yes';
    default:
      return null;
  }
}

export function getOrganizationNameLabel(organizationType) {
  switch (organizationType) {
    case ORGANIZATION_TYPES.PARTNERSHIP:
      return 'Legal Organization Name';
    case ORGANIZATION_TYPES.SOLE_PROPRIETORSHIP:
      return 'Full Legal Name of Sole Proprietor (Licensee)';
    default:
      return 'Legal Organization Name (as it appears in BC Registries and Online Services)';
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
