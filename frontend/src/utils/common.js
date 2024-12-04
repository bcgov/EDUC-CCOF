'use strict';

import { isPlainObject, sortBy } from 'lodash';
import useRfdc from 'rfdc';

import { PATHS } from '@/utils/constants.js';
import { getDateFormatter } from '@/utils/format.js';
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
