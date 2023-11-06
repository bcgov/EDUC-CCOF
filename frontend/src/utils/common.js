'use strict';

import {getDateFormatter} from '@/utils/format';
import {LocalDate} from '@js-joda/core';
import {isPlainObject, sortBy} from 'lodash';
import { PATHS } from '@/utils/constants';

const clone = require('rfdc')();
export const getLocalDateFromString = (date, pattern = 'uuuu-MM-dd') => {
  const formatter = getDateFormatter(pattern);
  try {
    return LocalDate.parse(date, formatter);
  } catch (e) {
    console.error(`Error is ${e}`);
  }
};

export function setEmptyInputParams(params, ...excludedParams) {
  Object.keys(params).forEach(key => {
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

export function getFileExtension(fileName) {
  if (fileName)
    return fileName.slice(fileName.lastIndexOf('.') + 1);
  return '';
}
export function isNullOrBlank(value) {
  return value === null || value === undefined || value === '';
}

export function isChangeRequest(vueForm) {
  return vueForm?.$route?.path?.startsWith(PATHS.PREFIX.CHANGE_REQUEST);
}

export function sortByFacilityId(value) {
  return sortBy(value,[function(o) { return o.facilityId; }]);
}

export async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function isFacilityAvailable(facility) {
  return (facility?.facilityStatus && !['Closed','Cancelled'].includes(facility?.facilityStatus));
}

// NEW PCF:
// - APPROVED - display all facilities associated with the application, which have Facility ID (change requests new facilities will be filtered until approved).
// - OTHER STATUSES - display all facilities associated with the application, which are not in status (Closed, Cancelled, Blank).
// RENEWAL:
// - APPROVED - display all facilities associated with the application, which have Facility ID (change requests new facilities will be filtered until approved).
// - OTHER STATUSES - display all facilities associated with the application, which are not in status (Closed, Cancelled, Blank) and have Facility ID.
export function filterFacilityListForPCF(facilityList, isRenewal, applicationStatus) {
  const filteredFacilityList = facilityList.filter(el => {
    const isFacilityActive = el.ccofBaseFundingId || el.ccfriApplicationId || el.eceweApplicationId;
    if (isRenewal) {
      if (applicationStatus === 'APPROVED') {
        return (el.facilityAccountNumber && isFacilityActive);
      } else {
        return (el.facilityAccountNumber && isFacilityAvailable(el));
      }
    } else {
      if (applicationStatus === 'APPROVED') {
        return (el.facilityAccountNumber && isFacilityActive);
      } else {
        return isFacilityAvailable(el);
      }
    }
  });
  return filteredFacilityList;
}

export function checkApplicationUnlocked(application) {
  const facilityList = application?.facilityList;
  const isCCFRIUnlocked = facilityList?.findIndex(facility => isFacilityAvailable(facility) && facility.unlockCcfri) > -1;
  const isNMFUnlocked = facilityList?.findIndex(facility => isFacilityAvailable(facility) && facility.unlockNmf) > -1;
  const isRFIUnlocked = facilityList?.findIndex(facility => isFacilityAvailable(facility) && facility.unlockRfi) > -1;
  const isApplicationUnlocked = (application?.unlockBaseFunding && application?.applicationType === 'NEW') || application?.unlockLicenseUpload ||
                              application?.unlockEcewe || application?.unlockSupportingDocuments || application?.unlockDeclaration ||
                              isCCFRIUnlocked || isNMFUnlocked || isRFIUnlocked;
  return isApplicationUnlocked;
}

export function isAnyApplicationUnlocked (applicationList){
  return applicationList.some(application => {
    return checkApplicationUnlocked(application);
  });
}

export function  isAnyChangeRequestActive(changeRequestList) {
  //Status of :  "Submitted" "Action Required";
  return changeRequestList?.some((el) => el.status == 2 || el.status == 3);
}
