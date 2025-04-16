export function isEmailValid(email) {
  if (typeof email !== 'string' || email.length > 254) return false;
  return /^(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

export function isNumberOfDaysPerWeekValid(count) {
  return Number.isInteger(count) && count > 0 && count < 8;
}

export function isNumberOfWeeksPerYearValid(count) {
  return Number.isInteger(count) && count > 0 && count < 53;
}

export function isPhoneNumberValid(phone) {
  // https://www.oreilly.com/library/view/regular-expressions-cookbook/9781449327453/ch04s02.html
  return phone && /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone);
}

export function isPostalCodeValid(postalCode) {
  return postalCode && /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i.test(postalCode);
}

export function isYearValid(year) {
  return year > 1900 && year < 2100;
}
