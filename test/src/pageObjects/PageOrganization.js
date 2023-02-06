import log from 'npmlog';

const { getTextField, mapFieldsFromFile, getButton } = require('../utils/selectors');

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
      { radio: 'Type of Organization'} //TODO fix spelling
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

  async clickSaveButton(t) {
    await t.click(this.saveButton).wait(3000);
    log.info('Save button clicked');
    await t.expect(alert.success.exists).ok();
    log.info('Save Successful clicked');
  }

  async clickBackButton(t) {
    await t.click(this.backButton);
    log.info('Back button clicked');
  }

  async clickNextButton(t) {
    await t.click(this.nextButton);
    log.info('Next button clicked');
  }

  async clickSaveAndNextButton(t) {
    this.clickSaveButton(t);
    this.clickNextButton(t);
  }

  async nextButtonIsDisabled(t) {
    await t.expect(this.nextButton.hasAttribute('disabled')).ok();
    log.info('Next button is disabled');
  }

  async nextButtonIsEnabled(t) {
    await t.expect(this.nextButton.hasAttribute('disabled')).notOk();
    log.info('Next button is enabled');
  }
}
export default PageOrganization;
