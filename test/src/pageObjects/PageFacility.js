<<<<<<< HEAD
import log from 'npmlog';

=======
>>>>>>> f02eac4 (Adding Page Facility, update facility testcase)
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
<<<<<<< HEAD
      'Facility Email Address',
      'Facility Licence Number',
      { date: 'Effective Date of Current Licence'},
      { radio: 'Has this facility or you as the applicant ever received funding under the Child Care Operating Funding Program?', addedField: 'Facility Name'},
=======
      'Organization Facility Email',
      'Facility Licence Number',
      { date: 'Effective Date of Current Licence'},
      { radio: 'Has this facility or you as the applicant ever received funding under the Child Care Operating Funding Program?'}
>>>>>>> f02eac4 (Adding Page Facility, update facility testcase)
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
<<<<<<< HEAD

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
=======
>>>>>>> f02eac4 (Adding Page Facility, update facility testcase)
}
export default PageOrganization;
