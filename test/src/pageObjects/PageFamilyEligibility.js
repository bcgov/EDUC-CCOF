const { getTextField, mapFieldsFromFile, getButton } = require('../utils/selectors');


class PageFamilyEligibility {
  constructor() {
    this.fieldNames = [
      'Facility Name',
      'Facility Licence Number',
      { date: 'Effective Date of Current Licence'},
      { radio: 'Has this facility or you as the applicant ever received funding under the Child Care Operating Funding Program?', addedField: 'Facility Name'},
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
export default PageFamilyEligibility;
