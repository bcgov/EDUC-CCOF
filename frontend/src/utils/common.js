'use strict';

import {getDateFormatter} from '@/utils/format';
import {LocalDate} from '@js-joda/core';
import {isPlainObject, sortBy} from 'lodash';
import { CHANGE_URL_PREFIX} from '@/utils/constants';

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
  return vueForm?.$route?.path?.startsWith(CHANGE_URL_PREFIX);
}

export function sortByFacilityId(value) {
  return sortBy(value,[function(o) { return o.facilityId; }]);
}
