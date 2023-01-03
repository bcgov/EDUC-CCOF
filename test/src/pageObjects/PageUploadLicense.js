import { Selector } from 'testcafe';
const {getButton} = require('../utils/selectors');
const path = require('path');

class PageOrganization {

  constructor() {
    this.licenseUploadButton = Selector('div', {timeout: 10000}).withExactText('License Upload'); //license upload from nav bar
    this.noButton = getButton('No');
    this.backButton = getButton('Back');
    this.nextButton = getButton('Next');
    this.saveButton = getButton('Save');
    this.header = Selector('h3', {timeout: 10000}).withExactText('License Upload');
  }

  async uploadFiles(t, inputField, fileName) {
    let filepath = path.join(__dirname, '..', 'data', `${fileName}`);
    await t.setFilesToUpload(inputField, filepath);
  }
  
  async clearFiles(t,inputField){
    await t.clearUpload(inputField);
  }

}
export default PageOrganization;
