const rules = {
    email: [v => /.+@.+/.test(v) || 'A valid email is required'],
    required: [function (v) {
        if (v === 0) {
            return true;
        } else if (!v) {
            return 'This field is requiered';
        }

        return true;
    }],
    postalCode: [v => /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i.test(v) || 'A valid postal code is required']
};

export default rules;
