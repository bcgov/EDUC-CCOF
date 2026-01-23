import { isEmpty } from 'lodash';

import { validateHourDifference } from '@/utils/common.js';
import { ERROR_MESSAGES, FILE_EXTENSIONS_ACCEPT, FILE_EXTENSIONS_ACCEPT_TEXT, MAX_FILE_SIZE } from '@/utils/constants';
import { getFileExtension, humanFileSize } from '@/utils/file';
import { isEmailValid, isPhoneNumberValid, isPostalCodeValid, isYearValid } from '@/utils/validation';

function isValidFQDN(string) {
  const labelPattern = '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?';
  const fqdnRegexString =
    '^' +
    '(https?:\\/\\/)?' +
    '(?:www\\.)?' +
    `(?:${labelPattern}\\.)+` +
    `(${labelPattern}(?:\\.${labelPattern}(?:\\.${labelPattern})?)?)` +
    '$';

  const fqdnRegex = new RegExp(fqdnRegexString, 'i');
  return fqdnRegex.test(string);
}

export function allRulesAreValid(rulesArray, value) {
  return rulesArray.map((r) => r(value)).every((ruleCheckResult) => ruleCheckResult === true);
}

export const rules = {
  email: [(v) => isEmailValid(v) || 'A valid email is required'],
  required: [
    function (v) {
      if (v === 0 || v === false) {
        return true;
      } else if ((typeof v === 'object' && isEmpty(v)) || !v) {
        return ERROR_MESSAGES.REQUIRED;
      }

      return true;
    },
  ],
  equalTo(expectedValue, message = 'Invalid value') {
    return (v) => v === expectedValue || message;
  },
  postalCode: [(v) => isPostalCodeValid(v) || 'A valid postal code is required'],
  MMDDYYYY: (v) => (!!v && !isNaN(new Date(v))) || 'Invalid date format',
  YYYY: [(v) => isYearValid(v) || 'A valid year is required'],
  validHourTo(
    hourFrom,
    difference = 1,
    message = `Hours To must be at least ${difference} hour${difference > 1 ? 's' : ''} after Hours From`,
  ) {
    return (v) => !v || validateHourDifference(hourFrom, v, difference) || message;
  },
  notRequired: [() => true],
  max(number, message = number != null ? `Maximum entry: ${number}` : 'Max exceeded') {
    return (v) => !v || v <= number || message;
  },
  min(number, message = number != null ? `Minimum entry: ${number}` : 'Min exceeded') {
    return (v) => v >= number || message;
  },
  greaterThan(number, message = number == null ? 'Value too small' : `Must be greater than ${number}`) {
    return (v) => v > number || message;
  },
  maxLength(number) {
    return (v) => !v || v.length <= number || 'Max length exceeded';
  },
  isNumber: (v) => !isNaN(parseFloat(v)) || 'Must be a number',
  wholeNumber: (v) => !v || /^\d+$/.test(v) || 'A valid whole number is required',
  phone: (v) => isPhoneNumberValid(v) || 'A valid phone number is required',
  fileRules: [
    (value) => !isEmpty(value) || 'This is required',
    (value) => {
      return isEmpty(value) || value[0]?.name?.length < 255 || 'File name can be max 255 characters.';
    },
    (value) => {
      return (
        isEmpty(value) ||
        value[0]?.size < MAX_FILE_SIZE ||
        `The maximum file size is ${humanFileSize(MAX_FILE_SIZE)} for each document.`
      );
    },
    (value) => {
      return (
        isEmpty(value) ||
        FILE_EXTENSIONS_ACCEPT.includes(getFileExtension(value[0]?.name)?.toLowerCase()) ||
        `Accepted file types are ${FILE_EXTENSIONS_ACCEPT_TEXT}.`
      );
    },
  ],
  website: (v) => {
    if (isEmpty(v)) return true;
    return isValidFQDN(v) || 'Please enter a valid website address';
  },
};

export default rules;
