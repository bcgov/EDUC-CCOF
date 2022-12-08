const { getTextField, mapFieldsFromFile, getButton, getRadioOption } = require('../utils/selectors');


class PageOrganization {

  constructor() {
    this.fieldNames = [
      'Legal Name (first, middle and last) or Organization (as it appears in BC corporate Registry)',
      { heading: 'Organization Mailing Address', label: 'Mailing Address' },
      { heading: 'Organization Mailing Address', label: 'City/Town' },
      { heading: 'Organization Mailing Address', label: 'Postal Code' },
      { heading: 'Organization Street Address, if different from the Mailing Address (Optional)', label: 'Street Address' },
      { heading: 'Organization Street Address, if different from the Mailing Address (Optional)', label: 'City/Town' },
      { heading: 'Organization Street Address, if different from the Mailing Address (Optional)', label: 'Postal Code' },
      'Organization Contact Name',
      'Position',
      'Business Phone',
      'E-mail Address of Signing Authority',
      'Incorporation Number (as it appears in BC Corporate Registry)',
      { radio: 'Type of Orgnization'} //TODO fix spelling
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
