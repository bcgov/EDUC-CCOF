import {isNullOrBlank} from '@/utils/common';

export default {
  methods: {
    convertBlankNumberToNull(object, key) {
      object[key] = !isNullOrBlank(object[key]) ? object[key] : null;
    }
  }
};
