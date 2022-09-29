const rules = {
    email: [v => /.+@.+/.test(v) || 'A valid email is required'],
    required: [v => !!v || 'This field is requiered'],
    postalCode: [v => /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i.test(v) || 'A valid postal code is required']
};

export default rules;
