'use strict';

import {getDateFormatter} from '@/utils/format';
import {LocalDate} from '@js-joda/core';
import {isPlainObject} from 'lodash';
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

