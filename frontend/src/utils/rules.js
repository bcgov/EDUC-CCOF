const rules = {
  email: [v => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'A valid email is required'], // https://emailregex.com/
  required: [function (v) {
    if (v === 0) {
      return true;
    } else if (!v) {
      return 'This field is required';
    }

    return true;
  }],
  postalCode: [v => !v || /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i.test(v) || 'A valid postal code is required'],
  YYYY: [v => v > 1900 && v < 2100 || 'A valid year is required'],
  notRequired: [() => true],
  max(number) {
    return v => !v || v <= number || 'Max exceeded';
  },
  min(number) {
    return v => !v || v >= number || 'Min exceeded';
  },
  phone: v => /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(v) || 'A valid phone number is required' // https://www.oreilly.com/library/view/regular-expressions-cookbook/9781449327453/ch04s02.html
};

export default rules;
