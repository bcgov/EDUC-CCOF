export default {
  methods: {
    convertBlankNumberToNull(object, key) {
      object[key] = object[key] ? object[key] : null;
    }
  }
};
