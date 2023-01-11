const { getTextField, mapFieldsFromFile, getButton } = require('../utils/selectors');

class PageFamilyForm {

  constructor() {
    this.fieldNames = [
      'Legal Name (first, middle and last) or Organization (as it appears in BC corporate Registry)',
      { heading: 'Organization Mailing Address', label: 'Name of Care Provider (if registered company)'},
      { heading: 'Organization Mailing Address', label: 'Mailing Address' },
      { heading: 'Organization Mailing Address', label: 'City/Town' },
      { heading: 'Organization Mailing Address', label: 'Postal Code' },
      { heading: 'Organization Street Address, if different from the Mailing Address (Optional)', label: 'Street Address' },
      { heading: 'Organization Street Address, if different from the Mailing Address (Optional)', label: 'City/Town' },
      { heading: 'Organization Street Address, if different from the Mailing Address (Optional)', label: 'Postal Code' },
      'Year Facility began Operation (YYYY)',
      'E-mail Address of Signing Authority',
      'Business Phone',
      'Incorporation Number (as it appears in BC Corporate Registry)',
      { radio: 'Type of Orgnization'} 
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
export default PageFamilyForm;
