import { Selector } from 'testcafe';
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
  }
}
export default PageOrganization;
