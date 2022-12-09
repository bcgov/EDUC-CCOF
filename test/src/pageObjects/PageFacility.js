const { getTextField, mapFieldsFromFile, getButton } = require('../utils/selectors');


class PageOrganization {

  constructor() {
    this.fieldNames = [
      'Facility Name (as it appears on the Community Care Assisted Living Act licence)',
      'Year Facility Began operation (YYYY)',
      'Facility Street Address',
      'City/Town',
      'Postal Code',
      'Facility Contact Name',
      'Position',
      'Business Phone',
      'Organization Facility Email',
      'Facility Licence Number',
      { date: 'Effective Date of Current Licence'},
      { radio: 'Has this facility or you as the applicant ever received funding under the Child Care Operating Funding Program?'}
    ];

    this.backButton = getButton('Back');
    this.nextButton = getButton('Next');
    this.saveButton = getButton('Save');
  }

  async updateField(t, fieldLabel, value) {
    await t.typeText(getTextField(fieldLabel), value, { replace: true });
  }
  async loadFieldsFromFile(t, fileName) {
    await mapFieldsFromFile(t, this.fieldNames, fileName);
  }
}
export default PageOrganization;
