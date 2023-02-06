import { Selector } from 'testcafe';
import log from 'npmlog';
const {getButton} = require('../utils/selectors');
const path = require('path');

class PageOrganization {

  constructor() {
    this.licenseUploadButton = Selector('div', {timeout: 10000}).withExactText('Licence Upload'); //license upload from nav bar
    // this.noButton = getButton('No');
    this.backButton = getButton('Back');
    this.nextButton = getButton('Next');
    this.saveButton = getButton('Save');
    this.header = Selector('h3', {timeout: 10000}).withExactText('Licence Upload');
  }

  async uploadFiles(t, inputField, fileName) {
    let filepath = path.join(__dirname, '..', 'data', `${fileName}`);
    await t.setFilesToUpload(inputField, filepath);
  }

  async clearFiles(t,inputField){
    await t.clearUpload(inputField);
  }

  async uploadLicense(t, fileName,facilityName) {
    await t.click(this.licenseUploadButton).wait(2000);
    await t.expect(this.header.exists).ok({timeout: 5000});
    const facility = Selector('td').withText(facilityName).parent(0);
    const facilityInput = facility.find('input').withAttribute('placeholder', 'Select your file');
    await t.click(facility.find('div').withExactText('Select your file'));
    await this.uploadFiles(t, facilityInput, fileName);
    log.info('License uploaded for facility');
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
