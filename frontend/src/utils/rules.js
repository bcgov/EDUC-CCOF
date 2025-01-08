import { FILE_EXTENSIONS_ACCEPT, FILE_EXTENSIONS_ACCEPT_TEXT, MAX_FILE_SIZE } from '@/utils/constants';
import { getFileExtension, humanFileSize } from '@/utils/file';

const rules = {
  email: [(v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'A valid email is required'],
  required: [
    function (v) {
      if (v === 0) {
        return true;
      } else if (!v) {
        return 'This field is required';
      }

      return true;
    },
  ],
  postalCode: [
    (v) =>
      !v ||
      /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i.test(v) ||
      'A valid postal code is required',
  ],
  MMDDYYYY: (v) => (!!v && !isNaN(new Date(v))) || 'Invalid date format',
  YYYY: [(v) => (v > 1900 && v < 2100) || 'A valid year is required'],
  validHourTo(hourFrom) {
    return (v) => !v || v > hourFrom || 'Hours To must be after Hours From';
  },
  notRequired: [() => true],
  max(number) {
    return (v) => !v || v <= number || 'Max exceeded';
  },
  min(number, message = 'Min exceeded') {
    return (v) => !v || v >= number || message;
  },
  maxLength(number) {
    return (v) => !v || v.length <= number || 'Max length exceeded';
  },
  wholeNumber: (v) => !v || /^\d+$/.test(v) || 'A valid whole number is required',
  phone: (v) => /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(v) || 'A valid phone number is required', // https://www.oreilly.com/library/view/regular-expressions-cookbook/9781449327453/ch04s02.html
  fileRules: [
    (v) => !!v || 'This is required',
    (value) => {
      return !value || !value.length || value[0]?.name?.length < 255 || 'File name can be max 255 characters.';
    },
    (value) => {
      return (
        !value ||
        !value.length ||
        value[0].size < MAX_FILE_SIZE ||
        `The maximum file size is ${humanFileSize(MAX_FILE_SIZE)} for each document.`
      );
    },
    (value) => {
      return (
        !value ||
        !value.length ||
        FILE_EXTENSIONS_ACCEPT.includes(getFileExtension(value[0].name)?.toLowerCase()) ||
        `Accepted file types are ${FILE_EXTENSIONS_ACCEPT_TEXT}.`
      );
    },
  ],
};

export default rules;
