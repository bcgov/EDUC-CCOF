import { Selector } from 'testcafe';
const {getButton, getErrorMessage} = require('../utils/selectors');
const path = require('path');

class PageSupportingDocument {

  constructor() {
    this.supportingDocumentButton = Selector('div').withExactText('Supporting Document');
    this.addButton = getButton('Add');
    this.backButton = getButton('Back');
    this.nextButton = getButton('Next');
    this.saveButton = getButton('Save');
    this.index = 0;
  }

  async uploadFile(t, facilityName, fileName, flag){
    await t.click(this.addButton).wait(500);
    let filepath = path.join(__dirname, '..', 'data', `${fileName}`);
    const row = Selector('tr').nth(0);
    const col = row.find('td'); 
    const facilitySelect = col.nth(0).find('div').withAttribute('role', 'button');
    // const fileTypeSelect = col.nth(1).find('div');
    const fileInput = col.nth(1).find('input');
    const sizeError = getErrorMessage(fileInput, 'The maximum file size is 2 MB for each document.');
    const typeError = getErrorMessage(fileInput, 'Accepted file types are PDF, JPEG, JPG, PNG, HEIC, DOC, DOCX, XLS and XLSX');

    //Select the facility
    await t.click(facilitySelect).wait(500);
    const facilityOption = Selector('div').withAttribute('role', 'listbox').find('div').withText(facilityName).filterVisible();
    await t.click(facilityOption);

    // //Select the type
    // await t.click(fileTypeSelect).wait(500);
    // const fileTypeOption = Selector('div').withAttribute('role', 'listbox').find('div').withText(fileType).filterVisible();
    // await t.click(fileTypeOption);

    //Upload the file
    await t.click(Selector('div').withExactText('Select your file').nth(0));
    await t.setFilesToUpload(fileInput, filepath);
    if(!flag){
        await t.expect(await sizeError.exists || await typeError.exists).ok();
    }
  }

  async deleteFile(t, facilityName, fileName){
    const row = Selector('span').withExactText(facilityName).parent().parent().parent().nextSibling().find('span').withText(fileName).parent().parent();
    const deleteIcon = row.find('button');
    await t.click(deleteIcon);
  }
  
}
export default PageSupportingDocument;